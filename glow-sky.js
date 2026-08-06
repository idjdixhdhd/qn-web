/* ============================================================================
 * glow-sky.js — 微光留言 · 星盘（轻量 Canvas 星空，离线可用，不卡）
 * ---------------------------------------------------------------------------
 * 性能要点（这是上一版卡死的根因，已彻底重写）：
 *   · 全程「零 shadowBlur」「零每帧 createRadialGradient」
 *   · 发光全部用「预渲染精灵 + drawImage」—— 这是 Canvas 不卡的关键
 *   · 背景星 / 星云 / 星球 / 星盘辉光 都是一次性画好的离屏精灵，每帧只 drawImage
 *
 * 视觉（按你的要求）：
 *   · 仰望星穹：每条留言 = 一颗独立颜色/亮度的星（微光不一样）
 *   · 天穹里一颗大星球（带光环），随视角缓缓转
 *   · 脚下发光「星盘」只是底座/视角载体，已美化但极轻
 *   · 没有小人
 *   · 视图切换（全部/最新/我的/随机/归位）走 DOM 按钮，不进 canvas
 *
 * window.GlowSky(stage, opts) -> { refresh, destroy, zoomIn, zoomOut, resetView, setMode }
 * ========================================================================== */
(function () {
  "use strict";

  function hash(str) {
    str = String(str == null ? "" : str);
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function esc(s) {
    return (s == null ? "" : String(s)).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function urand(seed) {
    var x = (hash(String(seed)) ^ 0x9e3779b9) >>> 0;
    x = (x ^ (x >>> 15)) >>> 0; x = (x * 0x2c1b3c6d) >>> 0; x = (x ^ (x >>> 12)) >>> 0;
    return (x >>> 0) / 4294967296;
  }

  /* 预渲染发光精灵：避免每帧 createRadialGradient（上一版卡死的主因） */
  function makeGlowSprite(rgb, soft) {
    var S = 64, c = document.createElement("canvas"); c.width = c.height = S;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    if (soft) {
      grd.addColorStop(0, "rgba(" + rgb + ",0.9)");
      grd.addColorStop(0.22, "rgba(" + rgb + ",0.5)");
      grd.addColorStop(0.55, "rgba(" + rgb + ",0.14)");
      grd.addColorStop(1, "rgba(" + rgb + ",0)");
    } else {
      grd.addColorStop(0, "rgba(" + rgb + ",1)");
      grd.addColorStop(0.3, "rgba(" + rgb + ",0.5)");
      grd.addColorStop(0.7, "rgba(" + rgb + ",0.12)");
      grd.addColorStop(1, "rgba(" + rgb + ",0)");
    }
    g.fillStyle = grd; g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 6.2832); g.fill();
    return c;
  }

  window.GlowSky = function (stage, opts) {
    opts = opts || {};
    var getPosts = opts.getPosts || function () { return []; };
    var onReport = opts.onReport || function () {};
    var meName = opts.me || "";
    var onToast = opts.onToast || function (m) { try { console.log("[glow]", m); } catch (e) {} };

    var old = stage.querySelector(".sky-holder"); if (old && old.parentNode) old.parentNode.removeChild(old);
    var holder = document.createElement("div"); holder.className = "sky-holder";
    var cv = document.createElement("canvas"); holder.appendChild(cv); stage.appendChild(holder);
    var g = cv.getContext("2d");
    var reveal = stage.querySelector(".sky-reveal");

    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var focal = H * 1.15, focalTarget = H * 1.15;

    function resize() {
      W = stage.clientWidth || 360; H = stage.clientHeight || 340;
      cv.width = Math.max(1, Math.round(W * DPR));
      cv.height = Math.max(1, Math.round(H * DPR));
      cv.style.width = W + "px"; cv.style.height = H + "px";
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
      focal = focalTarget = H * 1.15;
      // 天空渐变缓存（只建一次）
      skyGrad = g.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, "#050710");
      skyGrad.addColorStop(0.42, "#07101c");
      skyGrad.addColorStop(0.75, "#0a1a28");
      skyGrad.addColorStop(1, "#0c241f");
      // 暗角精灵缓存
      vignGrad = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.75);
      vignGrad.addColorStop(0, "rgba(0,0,0,0)");
      vignGrad.addColorStop(1, "rgba(0,0,0,0.16)");
    }

    // ---------- 调色板 / 精灵缓存 ----------
    var COLORS = ["159,227,190", "255,217,168", "169,188,255", "201,242,220"];
    var MINE_COL = "191,243,214";   // 「我的」留言专用色，也需建精灵
    var SPRITES = {}; COLORS.concat([MINE_COL]).forEach(function (c) { SPRITES[c] = makeGlowSprite(c, false); });
    var SOFT = {}; COLORS.concat([MINE_COL]).forEach(function (c) { SOFT[c] = makeGlowSprite(c, true); });
    var WHITE = makeGlowSprite("255,255,255", false);
    var DISK_GLOW = makeGlowSprite("159,227,190", true);   // 星盘底盘柔光
    var PLANET = makeGlowSprite("183,201,255", true);       // 星球本体柔光
    var TINY = makeGlowSprite("232,244,255", false);        // 背景星点（更亮）
    var skyGrad = null, vignGrad = null;

    // ---------- 世界参数 ----------
    var EYE = 0.0;   // 相机位于星穹中心，环视皆是星
    var R = 78;
    var DISK_R = 14.0;
    var FRESH_N = 6;
    var PULSE_T = 7000;
    var AUTO_DRIFT = 0.0009;     // 缓慢自转，让天穹「活着」

    // ---------- 视角 ----------
    var yaw = 0, pitch = -0.12;
    var yawV = 0, pitchV = 0;
    var targetYaw = null, targetPitch = null;
    var focusing = false;

    // ---------- 交互状态 ----------
    var dragging = false, moved = false, lx = 0, ly = 0, dx0 = 0, dy0 = 0;
    var activeIdx = -1;
    var mode = "all";

    // ---------- 数据 ----------
    var items = [];
    var pulse = [];
    var prevIds = "";
    var bgStars = [];
    var nebulae = [];
    var meteors = [];
    var diskParticles = [];
    var diskSpin = 0;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- 投影 ----------
    function project(wx, wy, wz) {
      var dx = wx, dy = wy - EYE, dz = wz;
      var cy = Math.cos(yaw), sy = Math.sin(yaw);
      var x1 = dx * cy + dz * sy;
      var z1 = -dx * sy + dz * cy;
      var y1 = dy;
      var cp = Math.cos(pitch), sp = Math.sin(pitch);
      var y2 = y1 * cp - z1 * sp;
      var z2 = y1 * sp + z1 * cp;
      if (z2 > -0.05) return null;
      var scale = focal / -z2;
      return { x: W / 2 + x1 * scale, y: H / 2 - y2 * scale, d: -z2, s: scale };
    }

    // ---------- 构建留言星 ----------
    function build() {
      var posts = (getPosts() || []).slice();
      var sorted = posts.map(function (p, i) { return { p: p, i: i }; })
        .sort(function (a, b) { return (a.p.at || "").localeCompare(b.p.at || "") || (a.i - b.i); });
      var recent = sorted.slice(-FRESH_N);
      var freshSet = {};
      recent.forEach(function (r) { freshSet[r.p.id] = true; });

      items = posts.map(function (p, i) {
        var h = hash(p.id || p.text || i);
        var az, el, isRecent = false;
        if (freshSet[p.id]) {
          isRecent = true;
          var idx = recent.findIndex(function (r) { return r.p.id === p.id; });
          var off = idx - (recent.length - 1) / 2;
          az = off * 0.18;
          el = -0.25 + (h % 100) / 100 * 0.5;
        } else {
          az = (h % 3600) / 3600 * Math.PI * 2;
          el = -1.1 + ((h >> 8) % 1000) / 1000 * 2.2;
        }
        var rr = R * (isRecent ? 0.76 : 1.0) * (0.92 + ((h >> 16) % 100) / 100 * 0.12);
        var wx = Math.sin(az) * Math.cos(el) * rr;
        var wy = Math.sin(el) * rr;
        var wz = -Math.cos(az) * Math.cos(el) * rr;
        var len = Math.min(120, (p.text || "").length);
        var k = Math.pow(len / 120, 0.7);
        var isMine = !!(p.mine || (meName && p.author && p.author === meName));
        var col;
        if (isRecent) col = "255,217,168";
        else if (isMine) col = "191,243,214";
        else {
          var c = h % 4;
          col = COLORS[c];
        }
        return {
          post: p, wx: wx, wy: wy, wz: wz, az: az, el: el,
          size: 4.5 + k * 13, bright: 0.55 + k * 0.55,
          col: col, phase: (hash(p.id + "ph") % 628) / 100,
          isRecent: isRecent, isMine: isMine
        };
      });

      var ids = posts.map(function (p) { return p.id; }).join("|");
      pulse = new Array(items.length).fill(0);
      if (prevIds) {
        var had = {};
        prevIds.split("|").forEach(function (s) { had[s] = true; });
        items.forEach(function (it, i) { if (it.post.id && !had[it.post.id]) pulse[i] = performance.now() + PULSE_T; });
      }
      prevIds = ids;
    }

    // ---------- 背景银河星 / 星云 / 星球 ----------
    function buildBg() {
      bgStars = [];
      for (var i = 0; i < 1500; i++) {
        var a = Math.random() * Math.PI * 2;
        var el = -1.45 + Math.random() * 2.9;            // 完整天球：上半球+下半球都有星，往下看不再漆黑
        var rr = R * (1.0 + Math.random() * 0.55);
        bgStars.push({
          x: Math.sin(a) * Math.cos(el) * rr,
          y: Math.sin(el) * rr,
          z: -Math.cos(a) * Math.cos(el) * rr,
          b: 0.42 + Math.random() * 0.68,
          ph: Math.random() * 6.28,
          band: false,
          size: 1.4 + Math.random() * 2.2
        });
      }
      nebulae = [];
      var hues = ["159,227,190", "169,188,255", "201,242,220", "223,246,232", "255,217,168"];
      for (var n = 0; n < 5; n++) {
        var na = Math.random() * Math.PI * 2;
        var nel = 0.35 + Math.random() * 0.7;
        var nr = R * (0.85 + Math.random() * 0.35);
        nebulae.push({
          x: Math.sin(na) * Math.cos(nel) * nr,
          y: Math.sin(nel) * nr,
          z: -Math.cos(na) * Math.cos(nel) * nr,
          rx: 26 + Math.random() * 34, ry: 14 + Math.random() * 20,
          rot: Math.random() * Math.PI,
          sprite: makeGlowSprite(hues[n], true)
        });
      }
    }
    buildBg();

    // 星球：天穹里一颗大星体（带光环），随视角转
    var PLANET_POS = (function () {
      var az = 2.15, el = 0.95, rr = R * 0.82;
      return {
        wx: Math.sin(az) * Math.cos(el) * rr,
        wy: Math.sin(el) * rr + 6,
        wz: -Math.cos(az) * Math.cos(el) * rr
      };
    })();

    // ---------- 流星 ----------
    function launchMeteor() {
      var az = Math.random() * Math.PI * 2, el = 0.5 + Math.random() * 0.7;
      var rr = R * (0.7 + Math.random() * 0.3);
      var fx = Math.sin(az) * Math.cos(el) * rr, fy = Math.sin(el) * rr, fz = -Math.cos(az) * Math.cos(el) * rr;
      var dx = -Math.cos(az) * 0.4 + (Math.random() - 0.5), dy = -0.8, dz = Math.sin(az) * 0.4 + (Math.random() - 0.5);
      var L = Math.hypot(dx, dy, dz) || 1;
      meteors.push({ x: fx, y: fy, z: fz, dx: dx / L, dy: dy / L, dz: dz / L, t: 0, life: 1.0 + Math.random() * 0.6, tail: [] });
    }

    function horizonY() { return H / 2 - Math.tan(pitch) * focal; }

    // ---------- 星球（缓存精灵 + 光环，极轻） ----------
    function drawPlanet() {
      var p = project(PLANET_POS.wx, PLANET_POS.wy, PLANET_POS.wz);
      if (!p) return;
      var rad = clamp(46 * (p.s * 0.02 + 0.5), 28, 120);
      g.globalCompositeOperation = "lighter";
      // 柔光本体
      g.globalAlpha = 0.95;
      g.drawImage(PLANET, p.x - rad, p.y - rad, rad * 2, rad * 2);
      // 实心核
      g.globalAlpha = 0.9;
      g.fillStyle = "rgba(210,224,255,0.55)";
      g.beginPath(); g.arc(p.x, p.y, rad * 0.46, 0, 6.2832); g.fill();
      // 光环（极轻：两条细弧）
      g.globalAlpha = 0.5;
      g.save();
      g.translate(p.x, p.y); g.rotate(-0.5);
      g.strokeStyle = "rgba(200,218,255,0.5)"; g.lineWidth = 2;
      g.beginPath(); g.ellipse(0, 0, rad * 1.5, rad * 0.5, 0, 0, 6.2832); g.stroke();
      g.globalAlpha = 0.28; g.lineWidth = 1;
      g.beginPath(); g.ellipse(0, 0, rad * 1.5, rad * 0.5, 0, 0.2, 6.0832); g.stroke();
      g.restore();
      g.globalAlpha = 1;
    }

    // ---------- 星盘（底座 / 视角载体，美化但极轻，无 shadowBlur） ----------
    function drawDisk(t) {
      var cx = W / 2;
      var R2 = Math.min(W, H) * 0.74;
      var cy = H + R2 * 0.34;
      var rot = diskSpin + yaw * 0.45;
      var breathe = 0.85 + 0.15 * Math.sin(t * 1.7) + 0.06 * Math.sin(t * 3.1 + 1.7);

      g.save();
      g.globalCompositeOperation = "lighter";

      // 盘面大柔光（缓存精灵，一次 drawImage，替代每帧渐变）
      var dgR = R2 * 1.02;
      g.globalAlpha = (0.5 + 0.12 * Math.sin(t * 1.1)) * breathe;
      g.drawImage(DISK_GLOW, cx - dgR, cy - dgR, dgR * 2, dgR * 2);
      g.globalAlpha = 1;

      // 同心环：纯描边，无辉光（cheap）
      var rings = [
        { r: 1.00, a: 0.95, w: 3.0, col: "159,227,190" },
        { r: 0.82, a: 0.72, w: 2.2, col: "201,242,220" },
        { r: 0.60, a: 0.58, w: 1.8, col: "169,188,255" },
        { r: 0.38, a: 0.88, w: 2.4, col: "255,217,168" },
        { r: 0.18, a: 1.05, w: 2.6, col: "159,227,190" }
      ];
      for (var ri = 0; ri < rings.length; ri++) {
        var rr = rings[ri].r * R2;
        var ba = rings[ri].a * breathe;
        g.strokeStyle = "rgba(" + rings[ri].col + "," + ba + ")";
        g.lineWidth = rings[ri].w;
        g.beginPath(); g.arc(cx, cy, rr, 0, 6.2832); g.stroke();
      }

      // 主辐条 12 + 次辐条 12（两条路径，cheap）
      g.strokeStyle = "rgba(159,227,190," + (0.42 * breathe) + ")"; g.lineWidth = 1.6;
      g.beginPath();
      for (var sp = 0; sp < 12; sp++) {
        var sa = sp / 12 * Math.PI * 2 + rot * 1.2;
        g.moveTo(cx, cy); g.lineTo(cx + Math.cos(sa) * R2 * 0.96, cy + Math.sin(sa) * R2 * 0.96);
      }
      g.stroke();
      g.strokeStyle = "rgba(169,188,255," + (0.28 * breathe) + ")"; g.lineWidth = 1;
      g.beginPath();
      for (var sp2 = 0; sp2 < 12; sp2++) {
        var sa2 = sp2 / 12 * Math.PI * 2 - rot * 0.6 + Math.PI / 12;
        g.moveTo(cx + Math.cos(sa2) * R2 * 0.40, cy + Math.sin(sa2) * R2 * 0.40);
        g.lineTo(cx + Math.cos(sa2) * R2 * 0.74, cy + Math.sin(sa2) * R2 * 0.74);
      }
      g.stroke();

      // 外圈刻度 36（一条路径，细线，无辉光）
      g.strokeStyle = "rgba(159,227,190," + (0.5 * breathe) + ")"; g.lineWidth = 1;
      g.beginPath();
      for (var tk = 0; tk < 36; tk++) {
        var ta = tk / 36 * Math.PI * 2 + rot * 0.6;
        var big = (tk % 3 === 0);
        var rOut = R2 * (big ? 1.02 : 0.97), rIn = R2 * (big ? 0.93 : 0.96);
        g.moveTo(cx + Math.cos(ta) * rIn, cy + Math.sin(ta) * rIn);
        g.lineTo(cx + Math.cos(ta) * rOut, cy + Math.sin(ta) * rOut);
      }
      g.stroke();

      // 星座节点（缓存精灵，cheap）
      for (var cj = 0; cj < 8; cj++) {
        var ang3 = cj / 8 * Math.PI * 2 + 0.4 + rot * 0.8;
        for (var st = 0; st <= 3; st++) {
          var rr3 = R2 * (0.30 + (0.70 - 0.30) * (st / 3));
          var aa3 = ang3 + st * 0.10;
          var px = cx + Math.cos(aa3) * rr3, py = cy + Math.sin(aa3) * rr3;
          var np = 0.55 + 0.45 * Math.sin(t * 2.6 + cj + st);
          g.globalAlpha = np;
          g.drawImage(SPRITES["201,242,220"], px - 5, py - 5, 10, 10);
        }
      }
      g.globalAlpha = 1;

      // 盘心强光（缓存精灵）
      var corePulse = 0.8 + 0.2 * Math.sin(t * 2);
      g.globalAlpha = 0.95;
      g.drawImage(WHITE, cx - 14 * corePulse, cy - 14 * corePulse, 28 * corePulse, 28 * corePulse);

      // 上升星尘（缓存精灵，cheap）
      while (diskParticles.length < 46) {
        diskParticles.push({ ang: Math.random() * 6.2832, r: Math.random() * R2, y: 0, spd: 0.3 + Math.random() * 0.6, life: 0.5 + Math.random() * 1.2, maxLife: 0, ph: Math.random() * 6.28, col: Math.random() < 0.5 ? "159,227,190" : "201,242,220" });
      }
      for (var i = diskParticles.length - 1; i >= 0; i--) {
        var pt = diskParticles[i];
        if (pt.maxLife === 0) pt.maxLife = pt.life;
        pt.life -= 0.016; pt.y += pt.spd; pt.ang += 0.002; pt.r *= 0.999;
        if (pt.life <= 0) { diskParticles.splice(i, 1); continue; }
        var ppx = cx + Math.cos(pt.ang) * pt.r, ppy = cy - pt.y;
        if (ppy < -20) continue;
        g.globalAlpha = (pt.life / pt.maxLife) * 0.5;
        g.drawImage(SOFT[pt.col], ppx - 6, ppy - 6, 12, 12);
      }
      g.globalAlpha = 1;
      g.restore();
    }

    // ---------- 背景层（每帧 drawImage，无渐变/无辉光） ----------
    function drawBackground(t) {
      if (skyGrad) { g.fillStyle = skyGrad; g.fillRect(0, 0, W, H); }
      else { g.fillStyle = "#050710"; g.fillRect(0, 0, W, H); }

      g.globalCompositeOperation = "lighter";
      // 星云
      for (var n = 0; n < nebulae.length; n++) {
        var nx = nebulae[n];
        var p = project(nx.x, nx.y, nx.z);
        if (!p) continue;
        var rx = nx.rx * p.s * 0.0016, ry = nx.ry * p.s * 0.0016;
        g.save(); g.translate(p.x, p.y); g.rotate(nx.rot);
        g.globalAlpha = 0.5;
        g.drawImage(nx.sprite, -rx, -ry, rx * 2, ry * 2);
        g.restore();
      }
      g.globalAlpha = 1;
      // 背景星（TINY 精灵，cheap；亮星额外小十字，确保360°都有可见星）
      for (var i = 0; i < bgStars.length; i++) {
        var bs = bgStars[i];
        var p2 = project(bs.x, bs.y, bs.z);
        if (!p2) continue;
        var tw = reduce ? 1 : (0.55 + 0.45 * Math.sin(t * 1.1 + bs.ph) + 0.10 * Math.sin(t * 3.2 + bs.ph));
        var a = bs.b * tw * (bs.band ? 1.35 : 1) * clamp(p2.s * 0.020 + 0.72, 0.55, 1);
        var r = bs.size * (1.0 + p2.s * 0.014) * (bs.band ? 1.4 : 1);
        g.globalAlpha = clamp(a, 0, 1);
        g.drawImage(TINY, p2.x - r, p2.y - r, r * 2, r * 2);
        if (r > 2.0) {
          g.globalAlpha = clamp(a * 0.8, 0, 1);
          g.strokeStyle = "rgba(210,230,255," + clamp(a * 0.35, 0, 0.45).toFixed(3) + ")";
          g.lineWidth = 0.8;
          g.beginPath(); g.moveTo(p2.x - r * 1.4, p2.y); g.lineTo(p2.x + r * 1.4, p2.y); g.stroke();
          g.beginPath(); g.moveTo(p2.x, p2.y - r * 1.4); g.lineTo(p2.x, p2.y + r * 1.4); g.stroke();
        }
      }
      g.globalAlpha = 1;
    }

    // ---------- 留言星 ----------
    function drawStars(t, nowMs) {
      g.globalCompositeOperation = "lighter";
      var pulsing = false;
      for (var s = 0; s < pulse.length; s++) { if (pulse[s] && nowMs < pulse[s]) { pulsing = true; break; } }
      // 最新星座连线
      if ((mode === "recent" || mode === "all") && !reduce) {
        var rec = items.filter(function (it) { return it.isRecent; });
        if (rec.length > 1) {
          g.strokeStyle = "rgba(255,217,168,0.2)"; g.lineWidth = 1.2; g.beginPath();
          var started = false;
          rec.forEach(function (it) {
            var p = project(it.wx, it.wy, it.wz);
            if (p) { if (!started) { g.moveTo(p.x, p.y); started = true; } else g.lineTo(p.x, p.y); }
          });
          g.stroke();
        }
      }
      for (var s2 = 0; s2 < items.length; s2++) {
        var it = items[s2];
        var p2 = project(it.wx, it.wy, it.wz);
        if (!p2) continue;
        var tw2 = reduce ? 1 : (0.72 + 0.28 * Math.sin(t * 1.3 + it.phase));
        var br = it.bright * tw2;
        var sz = it.size * (0.72 + p2.s * 0.018);
        if (mode === "recent" && !it.isRecent) br *= 0.28;
        if (mode === "mine" && !it.isMine) br *= 0.24;
        if (pulsing && pulse[s2] && nowMs < pulse[s2]) {
          var kk = (pulse[s2] - nowMs) / PULSE_T;
          br = Math.min(2.0, br + kk * 1.3); sz *= (1 + kk * 0.9);
        }
        if (s2 === activeIdx) { br = 2.2; sz *= 1.35; }
        var a = clamp(br, 0, 1);
        // 缓存发光精灵（外晕 + 亮核），替代逐颗 createRadialGradient
        g.globalAlpha = clamp(a * 0.72, 0, 1);
        g.drawImage(SOFT[it.col], p2.x - (sz + 10), p2.y - (sz + 10), (sz + 10) * 2, (sz + 10) * 2);
        g.globalAlpha = clamp(a * 1.1, 0, 1);
        g.drawImage(WHITE, p2.x - Math.max(1.6, sz * 0.5), p2.y - Math.max(1.6, sz * 0.5), Math.max(1.6, sz * 0.5) * 2, Math.max(1.6, sz * 0.5) * 2);
        // 留言星专属细环：与背景星（无光晕小点）明确区分
        g.globalCompositeOperation = "source-over";
        g.strokeStyle = "rgba(" + it.col + "," + clamp(a * 0.55, 0, 0.7).toFixed(3) + ")";
        g.lineWidth = 1.1;
        g.beginPath(); g.arc(p2.x, p2.y, sz + 7, 0, 6.2832); g.stroke();
        g.globalCompositeOperation = "lighter";
      }
      g.globalAlpha = 1;
    }

    // ---------- 流星 ----------
    function drawMeteors() {
      for (var m = meteors.length - 1; m >= 0; m--) {
        var me = meteors[m];
        me.t += 0.016;
        if (me.t > me.life) { meteors.splice(m, 1); continue; }
        var hx = me.x + me.dx * me.t * 52, hy2 = me.y + me.dy * me.t * 52, hz = me.z + me.dz * me.t * 52;
        var ph = project(hx, hy2, hz);
        if (ph) {
          me.tail.push({ x: hx, y: hy2, z: hz, t: me.t });
          if (me.tail.length > 12) me.tail.shift();
        }
        if (ph && me.tail.length > 1) {
          var aa = Math.sin(me.t / me.life * Math.PI) * 0.95;
          g.save(); g.globalCompositeOperation = "lighter";
          for (var ti = 0; ti < me.tail.length - 1; ti++) {
            var tp = project(me.tail[ti].x, me.tail[ti].y, me.tail[ti].z);
            var tp2 = project(me.tail[ti + 1].x, me.tail[ti + 1].y, me.tail[ti + 1].z);
            if (!tp || !tp2) continue;
            var ta = aa * (ti / Math.max(1, me.tail.length));
            g.strokeStyle = "rgba(223,246,232," + ta + ")"; g.lineWidth = 1 + 2.5 * (1 - ti / me.tail.length);
            g.beginPath(); g.moveTo(tp.x, tp.y); g.lineTo(tp2.x, tp2.y); g.stroke();
          }
          g.restore();
          g.globalAlpha = aa;
          g.drawImage(WHITE, ph.x - 5, ph.y - 5, 10, 10);
          g.globalAlpha = 1;
        }
      }
      if (Math.random() < 0.006 && meteors.length < 4) launchMeteor();
    }

    // ---------- 主绘制 ----------
    var t0 = performance.now();
    function frame(now) {
      try { frameBody(now); } catch (e) { try { console.error("[glow-sky]", e); } catch (x) {} }
      requestAnimationFrame(frame);
    }
    function frameBody(now) {
      var t = (now - t0) / 1000;

      // 视角
      if (focusing && targetYaw != null) {
        var dyaw = targetYaw - yaw;
        while (dyaw > Math.PI) dyaw -= 6.2832;
        while (dyaw < -Math.PI) dyaw += 6.2832;
        yaw += dyaw * 0.10;
        pitch += (targetPitch - pitch) * 0.10;
        if (Math.abs(dyaw) < 0.01 && Math.abs(targetPitch - pitch) < 0.01) { focusing = false; targetYaw = null; }
      } else if (!dragging) {
        yaw += yawV; pitch += pitchV;
        yawV *= 0.93; pitchV *= 0.93;
        if (Math.abs(yawV) < 1e-4) yawV = 0;
        if (Math.abs(pitchV) < 1e-4) pitchV = 0;
        if (!focusing && !reduce) yaw += AUTO_DRIFT;   // 天穹缓缓自转
      }
      pitch = clamp(pitch, -1.45, 1.45);
      focal += (focalTarget - focal) * 0.12;
      diskSpin += 0.0016;

      // 1. 天空 + 背景星 + 星云
      drawBackground(t);
      // 2. 留言星（身处星穹之中，环视皆是星辰；无星球/星盘/地平线遮挡）
      drawStars(t, now);
      // 6. 流星
      drawMeteors();
      // 7. 暗角
      g.globalCompositeOperation = "source-over";
      if (vignGrad) { g.fillStyle = vignGrad; g.fillRect(0, 0, W, H); }
    }

    // ---------- 聚焦 / 揭示 ----------
    function focusItem(i) {
      if (i < 0 || i >= items.length) return;
      activeIdx = i; focusing = true;
      var it = items[i];
      var dx = it.wx, dy = it.wy - EYE, dz = it.wz;
      var L = Math.hypot(dx, dz) || 1;
      targetYaw = Math.atan2(dx, -dz);
      targetPitch = Math.atan2(-dy, L);
      focalTarget = Math.min(H * 2.0, H * 1.5);
      var p = it.post;
      var who = p.author ? esc(p.author) : "过客";
      var when = p.at ? esc(p.at) : "";
      if (reveal) {
        /* 全站规则：主体内容（这句留言）居中呈现，绝不贴底被 UI 挡住 */
        reveal.innerHTML =
          '<div class="sr-card">' +
            '<div class="sr-halo"></div>' +
            '<div class="sr-mark">“</div>' +
            '<div class="sr-text">' + esc(p.text || "") + "</div>" +
            '<div class="sr-line"></div>' +
            '<div class="sr-meta">' + who + (when ? " · " + when : "") +
            ' · <span class="sr-rep" data-id="' + esc(p.id) + '">举报</span></div>' +
            (items.length > 1
              ? '<div class="sr-again">换一句 ↻</div>'
              : "") +
            '<div class="sr-tip">轻触任意处 · 回到星穹</div>' +
          "</div>";
        reveal.classList.add("on");
        stage.classList.add("reading");   // 让所有浮层 UI 让位
        var rep = reveal.querySelector(".sr-rep");
        if (rep) rep.onclick = function (e) { e.stopPropagation(); onReport({ id: this.getAttribute("data-id") }); };
        var again = reveal.querySelector(".sr-again");
        if (again) again.onclick = function (e) {
          e.stopPropagation();
          var n = items.length; if (n < 2) return;
          var ni = i; while (ni === i) ni = Math.floor(Math.random() * n);
          focusItem(ni);
        };
      }
    }
    function closeStar() {
      if (activeIdx < 0) return;
      activeIdx = -1; focusing = false; targetYaw = null;
      focalTarget = H * 1.15;
      if (reveal) reveal.classList.remove("on");
      stage.classList.remove("reading");
    }
    if (reveal) reveal.addEventListener("click", function (e) {
      if (e.target.classList && e.target.classList.contains("sr-rep")) return;
      closeStar();
    });

    // ---------- 点选（只判星，不判 HUD；HUD 走 DOM） ----------
    function pick(cx, cy) {
      var best = -1, bestD = 1e9;
      for (var i = 0; i < items.length; i++) {
        var p = project(items[i].wx, items[i].wy, items[i].wz);
        if (!p) continue;
        var dd = Math.hypot(cx - p.x, cy - p.y);
        var hit = Math.max(24, items[i].size * (0.55 + p.s * 0.012));
        if (dd <= hit && dd < bestD) { bestD = dd; best = i; }
      }
      if (best >= 0) focusItem(best);
      else if (activeIdx >= 0) closeStar();
    }

    function setMode(a) {
      if (a === "all" || a === "recent" || a === "mine") {
        mode = a; closeStar();
        if (a === "mine" && !items.some(function (it) { return it.isMine; })) onToast("还没有你点亮的微光");
      } else if (a === "random") {
        if (items.length) focusItem(Math.floor(Math.random() * items.length));
      } else if (a === "reset") {
        mode = "all"; yaw = 0; pitch = -0.12; yawV = pitchV = 0; focalTarget = H * 1.15; closeStar();
      }
    }

    // ---------- 输入 ----------
    var el = cv;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", function (e) {
      dragging = true; moved = false; lx = dx0 = e.clientX; ly = dy0 = e.clientY;
      yawV = pitchV = 0; focusing = false; targetYaw = null;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lx, dy = e.clientY - ly;
      if (Math.abs(e.clientX - dx0) + Math.abs(e.clientY - dy0) > 5) moved = true;
      yaw += dx * -0.005; yawV = dx * -0.005;
      pitch += dy * -0.004; pitchV = dy * -0.004;
      lx = e.clientX; ly = e.clientY;
    });
    el.addEventListener("pointerup", function (e) {
      dragging = false;
      if (moved) return;
      var r = el.getBoundingClientRect();
      pick(e.clientX - r.left, e.clientY - r.top);
    });
    el.addEventListener("wheel", function (e) {
      e.preventDefault();
      focalTarget = Math.max(H * 0.45, Math.min(H * 2.2, focalTarget * (e.deltaY > 0 ? 0.88 : 1.14)));
    }, { passive: false });

    // ---------- 尺寸 ----------
    var ro = new ResizeObserver(function () {
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      var fk = (H ? focal / (H * 1.15 || 1) : 1);
      resize();
      focal = focalTarget = H * 1.15 * fk;
    });
    ro.observe(stage);

    // ---------- 启停 ----------
    resize();
    build();
    requestAnimationFrame(frame);

    return {
      refresh: function () {
        var keepId = activeIdx >= 0 && items[activeIdx] ? items[activeIdx].post.id : null;
        build();
        if (keepId != null) {
          var ni = items.findIndex(function (x) { return x.post.id === keepId; });
          if (ni >= 0) focusItem(ni);
          else { if (reveal) reveal.classList.remove("on"); stage.classList.remove("reading"); activeIdx = -1; focusing = false; }
        }
      },
      zoomIn: function () { focalTarget = Math.max(H * 0.45, focalTarget * 1.15); },
      zoomOut: function () { focalTarget = Math.min(H * 2.2, focalTarget * 0.87); },
      resetView: function () { setMode("reset"); },
      setMode: setMode,
      destroy: function () {
        try { ro.disconnect(); } catch (e) {}
        if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
        if (reveal) reveal.classList.remove("on");
        stage.classList.remove("reading", "noui", "fsmode", "glow-immersive", "glow-noui");
      }
    };
  };
})();
