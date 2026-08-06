/* ============================================================================
 * relay-river.js — 共读接力「可交互光河」
 * 每一段续写 = 河面上的一处光；句子越长，光越亮越大；
 * 光河本身持续流动（粒子顺流而下），点一处光，读出那一段故事。
 *
 * 本次重做：
 *   · 只有写进东西，河面才发光；空河只留一道很淡的引示
 *   · 画布可缩放（滚轮 / 双指）、可拖动（拖动画布平移）——像星空一样看得清、点得准
 *
 * 不依赖任何外部库（原生 Canvas 2D）。RelayRiver(stage, opts) -> { refresh, destroy }
 * ========================================================================== */
(function (global) {
  const TAU = Math.PI * 2;

  function esc(s) {
    return (s == null ? "" : String(s)).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function accent() {
    return (getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb") || "159,227,190").trim();
  }

  function RelayRiver(stage, opts) {
    opts = opts || {};
    const canvas = stage.querySelector("canvas");
    const hint = stage.querySelector(".relay-hint");
    const reveal = stage.querySelector(".relay-reveal");
    const getPosts = opts.getPosts || function () { return []; };

    let posts = [], nodes = [], particles = [];
    let alive = true, t0 = performance.now(), dpr = 1, w = 320, h = 160;
    let hoverNode = null, activeNode = null, activeUntil = 0;
    let dragging = false, downX = 0, downY = 0, moved = false, lastX = 0, lastY = 0;
    let sig = "";
    let ribbonLit = 0.12;                 // 空河很淡，有内容才亮
    const view = { scale: 1, ox: 0, oy: 0 };  // 缩放 / 平移
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* 河道长度 = 画布宽的 SPAN 倍。默认缩放到能看全整条河，
       放大后沿河平移，就能把某一段的光和句子看清、点准。 */
    const SPAN = 2.6;
    function riverPoint(t) {
      const pad = Math.max(18, w * 0.045);
      const total = w * SPAN - 2 * pad;
      const x = pad + t * total;
      const midY = h * 0.52;
      const amp = Math.min(h * 0.34, 78);
      // 多个不同周期叠加 → 一条真正蜿蜒的长河，而不是一段短波浪
      const y = midY
        + Math.sin(t * TAU * 2.6 + 0.6) * amp * 0.42
        + Math.sin(t * TAU * 1.1 + 1.7) * amp * 0.38
        + Math.sin(t * TAU * 0.4 + 3.1) * amp * 0.30;
      return { x: x, y: y };
    }
    /* 让整条河刚好落在画布里 */
    function fitView() {
      view.scale = 1 / SPAN;
      view.ox = 0;
      view.oy = h * (1 - 1 / SPAN) * 0.5;
    }

    function layout() {
      w = canvas.clientWidth || 320; h = canvas.clientHeight || 160;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    }

    function build() {
      posts = (getPosts() || []).slice();
      const n = posts.length;
      nodes = posts.map(function (p, i) {
        const t = n === 1 ? 0.5 : 0.06 + (i / (n - 1)) * 0.88;
        const len = (p.text || "").length;
        const k = Math.min(len, 60) / 60;
        return { post: p, t: t, pt: riverPoint(t), baseR: 4 + k * 7, k: k };
      });
      sig = posts.map(function (p) { return p.id + ":" + (p.text || "").length; }).join("|");
      ribbonLit = n > 0 ? 1 : 0.12;

      if (!particles.length) {
        const P = 30;
        for (let i = 0; i < P; i++) {
          particles.push({ off: i / P + Math.random() * 0.02, sp: 0.030 + Math.random() * 0.03, r: 1.4 + Math.random() * 1.6, o: 0.25 + Math.random() * 0.4 });
        }
      }
      if (hint) {
        hint.textContent = n === 0
          ? "河面还很静，做第一个落笔的人 · 句子越长，光越亮"
          : "轻点一处光，读那一段 · 滚轮/双指放大 · 拖动沿河走";
      }
    }

    function strokeRibbon(col) {
      const N = 420, pts = [];       // 河变长了，采样点同步加密，曲线才不会折角
      for (let i = 0; i <= N; i++) pts.push(riverPoint(i / N));
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.globalCompositeOperation = "lighter";
      const passes = [
        { w: 30, a: 0.05, blur: 26 },
        { w: 16, a: 0.09, blur: 16 },
        { w: 6, a: 0.16, blur: 9 },
        { w: 2, a: 0.30, blur: 4 }
      ];
      passes.forEach(function (p) {
        ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.lineWidth = p.w; ctx.strokeStyle = "rgba(" + col + "," + (p.a * ribbonLit) + ")";
        ctx.shadowColor = "rgba(" + col + "," + Math.min(0.5, p.a + 0.1) * ribbonLit + ")";
        ctx.shadowBlur = p.blur; ctx.stroke();
      });
      ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
    }

    // 屏幕(CSS px) → 画布逻辑坐标（考虑缩放/平移）
    function toWorld(cx, cy) {
      const rect = canvas.getBoundingClientRect();
      const sx = cx - rect.left, sy = cy - rect.top;
      return { x: (sx - view.ox) / view.scale, y: (sy - view.oy) / view.scale };
    }

    function pick(mx, my) {
      let best = null, bestD = 1e9;
      // 命中半径按「屏幕上约 22px」折算回世界坐标——缩小时也点得中
      const tol = 22 / Math.max(0.05, view.scale);
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i], pt = riverPoint(nd.t);
        const d = Math.hypot(pt.x - mx, pt.y - my);
        const hit = Math.max(tol, nd.baseR + 12);
        if (d < hit && d < bestD) { bestD = d; best = nd; }
      }
      return best;
    }

    function showReveal(nd) {
      activeNode = nd; activeUntil = performance.now() + 6000;
      const p = nd.post;
      if (reveal) {
        const name = p.author || "过客";
        const av = (global.avHtml && p.avatar) ? global.avHtml(p.avatar) : "";
        reveal.innerHTML =
          '<div class="gr-av">' + (av || "") + '</div>' +
          '<div class="gr-body"><div class="gr-text">' + esc(p.text || "") + '</div>' +
          '<div class="gr-meta">' + esc(name) + (p.at ? " · " + esc(p.at) : "") + '</div></div>';
        reveal.classList.add("on");
      }
    }

    let ctx;
    function frame(now) {
      if (!alive) return;
      if (!canvas.isConnected) { alive = false; return; }
      layout();
      if (!ctx) ctx = canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * view.scale, 0, 0, dpr * view.scale, view.ox * dpr, view.oy * dpr);
      const t = reduce ? 0 : (now - t0) / 1000;
      const col = accent();

      strokeRibbon(col);

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const pp = particles[i];
        let u = (pp.off + t * pp.sp) % 1; if (u < 0) u += 1;   // 曾误写为 const，会在回绕时抛错
        const pt = riverPoint(u);
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pp.r * 4);
        g.addColorStop(0, "rgba(" + col + "," + pp.o * ribbonLit + ")");
        g.addColorStop(1, "rgba(" + col + ",0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pt.x, pt.y, pp.r * 4, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255," + (pp.o + 0.15) * ribbonLit + ")";
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pp.r * 0.6, 0, TAU); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i], pt = riverPoint(nd.t);
        const isActive = (nd === activeNode || nd === hoverNode);
        const r = nd.baseR * (isActive ? 1.5 : 1);
        const glowR = r * 4;
        const a = Math.min(1, 0.30 + nd.k * 0.5 + (isActive ? 0.25 : 0));
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glowR);
        g.addColorStop(0, "rgba(" + col + "," + a + ")");
        g.addColorStop(0.4, "rgba(" + col + "," + (a * 0.5) + ")");
        g.addColorStop(1, "rgba(" + col + ",0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pt.x, pt.y, glowR, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255," + Math.min(1, a + 0.2) + ")";
        ctx.beginPath(); ctx.arc(pt.x, pt.y, Math.max(1.5, r * 0.5), 0, TAU); ctx.fill();
        if (isActive) {
          ctx.strokeStyle = "rgba(" + col + ",0.85)"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, r + 6, 0, TAU); ctx.stroke();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      if (activeNode && now > activeUntil) {
        activeNode = null; if (reveal) reveal.classList.remove("on");
      }
      requestAnimationFrame(frame);
    }

    stage.addEventListener("pointerdown", function (e) {
      dragging = true; moved = false; downX = lastX = e.clientX; downY = lastY = e.clientY;
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    });
    stage.addEventListener("pointermove", function (e) {
      const wc = toWorld(e.clientX, e.clientY);
      hoverNode = pick(wc.x, wc.y);
      stage.style.cursor = hoverNode ? "pointer" : "default";
      if (dragging && (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 5)) {
        moved = true;
        view.ox += e.clientX - lastX; view.oy += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
      }
    });
    stage.addEventListener("pointerleave", function () { hoverNode = null; stage.style.cursor = "default"; });
    stage.addEventListener("pointerup", function (e) {
      dragging = false;
      if (moved) return;
      const wc = toWorld(e.clientX, e.clientY);
      const nd = pick(wc.x, wc.y);
      if (nd) showReveal(nd);
      else { activeNode = null; if (reveal) reveal.classList.remove("on"); }
    });
    /* 以光标为锚点缩放：放大时你盯着的那一段会留在原地，而不是整条河乱跑 */
    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
      const before = { x: (sx - view.ox) / view.scale, y: (sy - view.oy) / view.scale };
      const min = 1 / SPAN * 0.85;
      view.scale = Math.max(min, Math.min(5, view.scale * (e.deltaY < 0 ? 1.14 : 0.88)));
      view.ox = sx - before.x * view.scale;
      view.oy = sy - before.y * view.scale;
    }, { passive: false });

    const timer = setInterval(function () {
      const raw = (getPosts() || []).slice();
      const nsig = raw.map(function (p) { return p.id + ":" + (p.text || "").length; }).join("|");
      if (nsig !== sig) build();
    }, 3500);

    layout(); fitView(); build(); requestAnimationFrame(frame);
    return {
      refresh: function () { build(); },
      fit: function () { layout(); fitView(); },
      destroy: function () { alive = false; clearInterval(timer); if (reveal) reveal.classList.remove("on"); }
    };
  }

  global.RelayRiver = RelayRiver;
})(window);
