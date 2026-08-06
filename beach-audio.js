/* ============================================================================
 * 海滩环境音引擎（beach-audio.js）
 * 移植自 adams914/beach-wallpaper 的 Web Audio 分层环境音引擎（沿用其交叉淡变设计）。
 *
 * 设计约定（不改动网站既有代码）：
 *   - 本文件是「独立附加模块」，只负责声音，不触碰 beach3d.js / SoundKit / 其它逻辑。
 *   - 由「同看一片海」板 renderWatchSeaBoard 通过 window.startBeachAudio(box, opts) 调用，
 *     返回 { stop() }，由调用方压入 SCENE_STOPS 统一清理。
 *   - 音轨读取 media/audio/ 下的本地文件（waves / wind / seagulls / campfire /
 *     music_day / music_night），与原站音频目录一致，可完全离线。
 *   - 浏览器自动播放策略：首次需一次用户手势（点击提示条）启动音频。
 *   - 跟随海滩场景时刻交叉淡变：海浪/海风常驻，篝火随夜色淡入淡出，
 *     白天轻音乐 / 夜晚 ambient 按昼夜权重过渡，白天偶发海鸥。
 * ========================================================================== */
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const sstep01 = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const smoothstep = (a, b, x) => sstep01((x - a) / (b - a));
const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const fireFade = (h) => {
  if (h >= 18.3) return smoothstep(18.3, 19.1, h);
  if (h <= 5.5)  return 1 - smoothstep(4.7, 5.5, h);
  return 0;
};
const daylight = (h) => smoothstep(5.4, 7.2, h) * (1 - smoothstep(17.4, 19.2, h));

/* 主入口：在 container（#ws-cv）上叠加海滩环境音。
 * opts: { hour=14, speed=1, base='media/audio/' } */
function startBeachAudio(container, opts = {}) {
  if (!container) return { stop() {} };
  if (!window.AudioContext && !window.webkitAudioContext) return { stop() {} };

  const base = (opts && opts.base) || 'media/audio/';
  const startHour = (opts && Number.isFinite(opts.hour)) ? ((opts.hour % 24) + 24) % 24 : 14;
  const speed = (opts && Number.isFinite(opts.speed) && opts.speed > 0) ? opts.speed : 1;
  const VOL = 0.7;

  /* ---- 内部场景时刻（与海滩视觉保持一致；若海滩暴露时间滑块则以滑块为准） ---- */
  let curHour = startHour;
  let lastTs = performance.now();
  let rafId = 0, rafOn = true;
  function tick(ts) {
    if (!rafOn) return;
    const dt = Math.min(0.1, (ts - lastTs) / 1000 || 0.016);
    lastTs = ts;
    const slider = container.querySelector && container.querySelector('.bz-time');
    if (slider && slider.value) {
      const v = parseFloat(slider.value);
      if (Number.isFinite(v)) curHour = ((v % 24) + 24) % 24;
    } else {
      curHour = (curHour + dt * speed / 3600) % 24;
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  /* ---- 音频引擎 ---- */
  const AudioSys = {
    ctx: null, master: null, ready: false, loading: false,
    buffers: {}, media: {}, loops: {},
    vol: VOL,
    async init() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') { try { await this.ctx.resume(); } catch (e) {} }
      this.master.gain.setTargetAtTime(this.vol, this.ctx.currentTime, 0.8);
      if (this.ready || this.loading) return;
      this.loading = true;
      const files = {
        waves: base + 'waves.mp3', wind: base + 'wind.mp3', gulls: base + 'seagulls.mp3',
        fire: base + 'campfire.mp3', musicDay: base + 'music_day.mp3', musicNight: base + 'music_night.mp3'
      };
      await Promise.all(Object.entries(files).map(async ([k, u]) => {
        try {
          const r = await fetch(u);
          if (!r.ok) throw new Error('HTTP ' + r.status);
          this.buffers[k] = await this.ctx.decodeAudioData(await r.arrayBuffer());
        } catch (e) {
          console.warn('[beach-audio] fetch 失败，改用 <audio> 元素直放:', u);
          try {
            const el = new Audio(); el.preload = 'auto'; el.src = u; el.volume = 0;
            this.media[k] = { el };
          } catch (e2) { console.warn('[beach-audio] 音频不可用:', u, e2); }
        }
      }));
      for (const k of ['waves', 'wind', 'fire', 'musicDay', 'musicNight']) this.loops[k] = this.mkLoop(k);
      this.ready = true;
      this.update(true);
    },
    mkLoop(key) {
      const g = this.ctx.createGain(); g.gain.value = 0; g.connect(this.master);
      const b = this.buffers[key];
      if (b) {
        const s = this.ctx.createBufferSource();
        s.buffer = b; s.loop = true;
        s.loopStart = 0.1; s.loopEnd = Math.max(0.2, b.duration - 0.1);
        s.connect(g); s.start(0, 0.1);
        return { g };
      }
      const m = this.media[key];
      if (m) { m.el.loop = true; m.el.play().catch(() => {}); return { m }; }
      return null;
    },
    targets(h) {
      const dayW = smoothstep(5.5, 7.5, h) * (1 - smoothstep(16.8, 18.8, h));
      return {
        waves: 0.34,
        wind: 0.16,
        fire: 0.40 * fireFade(h),
        musicDay: 0.24 * dayW,
        musicNight: 0.24 * (1 - dayW)
      };
    },
    update(force) {
      if (!this.ready) return;
      const tg = this.targets(curHour), now = this.ctx.currentTime;
      for (const k in tg) {
        const L = this.loops[k];
        if (!L) continue;
        if (L.g) L.g.gain.setTargetAtTime(tg[k], now, force ? 1.6 : 1.2);
        else if (L.m) L.m.el.volume = clamp(L.m.el.volume + (tg[k] * this.vol - L.m.el.volume) * 0.35, 0, 1);
      }
    },
    playGulls() {
      if (!this.ready) return;
      const h = curHour; if (h < 6 || h > 18) return;
      const g = this.ctx.createGain(); g.gain.value = 0.13; g.connect(this.master);
      if (this.buffers.gulls) {
        const s = this.ctx.createBufferSource(); s.buffer = this.buffers.gulls;
        s.connect(g); s.start(0, 0.1, Math.max(0.2, this.buffers.gulls.duration - 0.2));
      } else if (this.media.gulls) {
        const m = this.media.gulls;
        m.el.volume = 0.13 * this.vol; m.el.currentTime = 0.1; m.el.play().catch(() => {});
      }
    },
    setVol(v) {
      this.vol = v;
      if (this.master && this.ctx) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.25);
    },
    suspend() {
      if (this.ctx && this.ctx.state === 'running') this.ctx.suspend();
      for (const k in this.media) this.media[k].el.pause();
    },
    resume() {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (this.ready) for (const k in this.loops) { const L = this.loops[k]; if (L && L.m) L.m.el.play().catch(() => {}); }
    }
  };

  const updTimer = setInterval(() => AudioSys.update(false), 500);
  if (updTimer && updTimer.unref) updTimer.unref();

  /* 白天偶发海鸥（仿原版 20-50s 一波、55% 概率轻鸣） */
  let gullTimer = null;
  function scheduleGull() {
    gullTimer = setTimeout(() => {
      if (curHour > 6 && curHour < 18 && Math.random() < 0.55) AudioSys.playGulls();
      scheduleGull();
    }, rand(20000, 50000));
  }
  scheduleGull();

  /* 页面隐藏自动挂起，恢复时继续 */
  function onVis() {
    if (document.hidden) AudioSys.suspend();
    else if (AudioSys.ready) AudioSys.resume();
  }
  document.addEventListener('visibilitychange', onVis);

  /* ---- 启动遮罩（一次性手势，满足自动播放策略） ---- */
  let hint = null;
  if (!/mute=1/.test(window.location.search)) {
    hint = document.createElement('div');
    hint.className = 'bz-audio-hint';
    hint.innerHTML = '<span>🌊 点击，听见这片海</span>';
    hint.addEventListener('click', () => {
      AudioSys.init().catch(() => {});
      if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
      hint = null;
    }, { once: true });
    container.appendChild(hint);
  }

  function stop() {
    rafOn = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (updTimer) clearInterval(updTimer);
    if (gullTimer) clearTimeout(gullTimer);
    document.removeEventListener('visibilitychange', onVis);
    if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
    try { AudioSys.suspend(); } catch (e) {}
    if (AudioSys.ctx) { try { AudioSys.ctx.close(); } catch (e) {} }
  }

  return { stop };
}

window.startBeachAudio = startBeachAudio;
