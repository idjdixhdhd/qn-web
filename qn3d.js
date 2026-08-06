/* ============================================================
   QN3D — 依赖自由的轻量 Canvas 3D 引擎
   用途：calm-nature 各模块做 3D 化（星盘/花园/胶囊/石子/成长/折纸/仪式…）
   特性：轨道相机(yaw/pitch + 惯性)、透视投影、画家算法深度排序、
        球/圆柱/线/多边形/辉光/粒子/星空背景、rAF 循环、resize、destroy、减弱动效。
   纯本地可跑（file:// 双击、手机浏览器均可）。无外部依赖。
   ============================================================ */
(function (global) {
  'use strict';

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function create(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(global.devicePixelRatio || 1, 2);

    var E = {
      canvas: canvas, ctx: ctx,
      W: 0, H: 0, dpr: dpr,
      time: 0, running: false, reduced: false,
      list: [],                 // 本帧待绘制图元
      cam: {
        target: [0, 0.6, 0],
        yaw: 0.4, pitch: -0.18, dist: 9, fov: 62,
        yawV: 0, pitchV: 0, autoRotate: false, autoSpeed: 0.06,
        near: 0.05, minDist: 2.5, maxDist: 26,
        minPitch: -1.45, maxPitch: 1.45
      },
      onFrame: null,
      _raf: 0, _last: 0, _ro: null, _ptr: null
    };

    /* ---------- 尺寸 ---------- */
    function resize() {
      var r = canvas.getBoundingClientRect();
      E.W = Math.max(2, r.width || canvas.clientWidth || 320);
      E.H = Math.max(2, r.height || canvas.clientHeight || 240);
      canvas.width = Math.round(E.W * dpr);
      canvas.height = Math.round(E.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    E.resize = resize;
    resize();

    /* ---------- 相机基向量 ---------- */
    function camVectors() {
      var c = E.cam;
      var cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
      var cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
      // forward（看向目标）
      var fwd = [cy * cp, sp, sy * cp];
      // 右 = worldUp × fwd（右手系，+x 指向屏幕右）
      var up0 = [0, 1, 0];
      var rx = up0[1] * fwd[2] - up0[2] * fwd[1];
      var ry = up0[2] * fwd[0] - up0[0] * fwd[2];
      var rz = up0[0] * fwd[1] - up0[1] * fwd[0];
      var rl = Math.hypot(rx, ry, rz) || 1; rx /= rl; ry /= rl; rz /= rl;
      // 真实 up = fwd × right
      var ux = fwd[1] * rz - fwd[2] * ry;
      var uy = fwd[2] * rx - fwd[0] * rz;
      var uz = fwd[0] * ry - fwd[1] * rx;
      // 眼睛位置
      var ex = c.target[0] - fwd[0] * c.dist;
      var ey = c.target[1] - fwd[1] * c.dist;
      var ez = c.target[2] - fwd[2] * c.dist;
      return { fwd: fwd, right: [rx, ry, rz], up: [ux, uy, uz], eye: [ex, ey, ez] };
    }

    /* ---------- 投影 ---------- */
    E.project = function (x, y, z) {
      var v = E._v || (E._v = camVectors());
      var rl = v.right, up = v.up, fwd = v.fwd, eye = v.eye;
      var dx = x - eye[0], dy = y - eye[1], dz = z - eye[2];
      var cz = dx * fwd[0] + dy * fwd[1] + dz * fwd[2]; // 视深
      if (cz <= E.cam.near) return { vis: false, d: 1e9 };
      var cx = dx * rl[0] + dy * rl[1] + dz * rl[2];
      var cy = dx * up[0] + dy * up[1] + dz * up[2];
      var focal = (E.H * 0.5) / Math.tan((E.cam.fov * Math.PI / 180) / 2);
      var s = focal / cz;
      return {
        vis: true, d: cz, s: s,
        x: E.W / 2 + cx * s,
        y: E.H / 2 - cy * s
      };
    };

    /* ---------- 清屏 / 天空背景 ---------- */
    E.clear = function (top, bottom) {
      var g = ctx.createLinearGradient(0, 0, 0, E.H);
      g.addColorStop(0, top || '#070d12');
      g.addColorStop(1, bottom || '#0a141a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, E.W, E.H);
    };

    E.sky = function (o) {
      o = o || {};
      E.clear(o.top || '#070d12', o.bottom || '#0e1a20');
      // 地平线辉光
      if (o.horizon !== false) {
        var hy = E.H * (o.horizonY || 0.62);
        var hg = ctx.createRadialGradient(E.W / 2, hy, 10, E.W / 2, hy, E.W * 0.7);
        hg.addColorStop(0, 'rgba(' + (o.glow || '159,227,190') + ',0.10)');
        hg.addColorStop(1, 'rgba(' + (o.glow || '159,227,190') + ',0)');
        ctx.fillStyle = hg; ctx.fillRect(0, 0, E.W, E.H);
      }
      // 星空
      if (o.stars !== false && E._stars) {
        var pts = E._stars;
        for (var i = 0; i < pts.length; i++) {
          var p = E.project(pts[i][0], pts[i][1], pts[i][2]);
          if (!p.vis) continue;
          var tw = 0.6 + 0.4 * Math.sin(E.time * (pts[i][4] || 2) + pts[i][3]);
          ctx.fillStyle = 'rgba(' + (o.starColor || '200,224,235') + ',' + (tw * (pts[i][5] || 0.8)).toFixed(3) + ')';
          var rs = Math.max(0.6, p.s * (pts[i][6] || 0.0016));
          ctx.beginPath(); ctx.arc(p.x, p.y, rs, 0, 6.2832); ctx.fill();
        }
      }
    };

    E.makeStars = function (count, radius, seed) {
      var rnd = mulberry32(seed || 7);
      var a = [];
      for (var i = 0; i < (count || 260); i++) {
        // 上半球为主
        var u = rnd() * 2 - 1, th = rnd() * Math.PI * 2;
        var r = Math.sqrt(1 - u * u);
        var x = Math.cos(th) * r, y = Math.abs(u) * 0.9 + 0.05, z = Math.sin(th) * r;
        var rad = (radius || 30) * (0.7 + rnd() * 0.6);
        a.push([x * rad, y * rad, z * rad, rnd() * 6.28, 1 + rnd() * 2.5, 0.5 + rnd() * 0.5, 0.0008 + rnd() * 0.0026]);
      }
      E._stars = a;
      return a;
    };

    /* ---------- 图元（推入本帧列表） ---------- */
    function push(depth, drawFn, glowFlag) {
      E.list.push({ d: depth, f: drawFn, g: glowFlag ? 1 : 0 });
    }

    // 球（带简易光照的径向渐变球）
    E.sphere = function (x, y, z, r, o) {
      o = o || {};
      var p = E.project(x, y, z);
      if (!p.vis) return null;
      var rad = Math.max(0.5, p.s * r);
      var depth = p.d + (o.depthBias || 0);
      var col = o.color || '159,227,190';
      push(depth, function () {
        var lx = (o.light ? o.light[0] : 0.5), ly = (o.light ? o.light[1] : 0.8), lz = (o.light ? o.light[2] : 0.4);
        var v = E._v;
        // 高光偏移（用光照方向投影到屏幕）
        var hx = (lx * v.right[0] + ly * v.up[0] + lz * v.fwd[0]);
        var hy = -(lx * v.right[1] + ly * v.up[1] + lz * v.fwd[1]);
        var g = ctx.createRadialGradient(
          p.x + hx * rad * 0.5, p.y + hy * rad * 0.5, rad * 0.1,
          p.x, p.y, rad);
        g.addColorStop(0, 'rgba(' + col + ',' + (o.alpha == null ? 1 : o.alpha) + ')');
        g.addColorStop(0.7, 'rgba(' + col + ',' + ((o.alpha == null ? 1 : o.alpha) * 0.72).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + (o.shade || '20,40,36') + ',' + ((o.alpha == null ? 1 : o.alpha) * 0.5).toFixed(3) + ')');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, 6.2832); ctx.fill();
        if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 1; ctx.stroke(); }
      }, o.glow);
      // 辉光
      if (o.glow) {
        push(depth - 0.01, function () {
          var gg = ctx.createRadialGradient(p.x, p.y, rad * 0.5, p.x, p.y, rad * (o.glowR || 2.4));
          gg.addColorStop(0, 'rgba(' + col + ',' + (o.glowA == null ? 0.22 : o.glowA) + ')');
          gg.addColorStop(1, 'rgba(' + col + ',0)');
          ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p.x, p.y, rad * (o.glowR || 2.4), 0, 6.2832); ctx.fill();
        }, true);
      }
      return { x: p.x, y: p.y, r: rad, p: p };
    };

    // 圆柱（用端盖球 + 粗线近似）
    E.cylinder = function (x1, y1, z1, x2, y2, z2, r, o) {
      o = o || {};
      var col = o.color || '159,227,190';
      push((E.project(x1, y1, z1).d + E.project(x2, y2, z2).d) / 2, function () {
        var a = E.project(x1, y1, z1), b = E.project(x2, y2, z2);
        if (!a.vis || !b.vis) return;
        ctx.strokeStyle = 'rgba(' + col + ',' + (o.alpha == null ? 0.95 : o.alpha) + ')';
        ctx.lineWidth = Math.max(1, (a.s + b.s) / 2 * r);
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      E.sphere(x1, y1, z1, r * 0.95, { color: col, alpha: o.alpha, glow: o.glow });
      E.sphere(x2, y2, z2, r * 0.95, { color: col, alpha: o.alpha, glow: o.glow });
    };

    // 线
    E.line = function (p1, p2, o) {
      o = o || {};
      var a = E.project(p1[0], p1[1], p1[2]), b = E.project(p2[0], p2[1], p2[2]);
      if (!a.vis || !b.vis) return;
      push((a.d + b.d) / 2, function () {
        ctx.strokeStyle = 'rgba(' + (o.color || '159,227,190') + ',' + (o.alpha == null ? 0.8 : o.alpha) + ')';
        ctx.lineWidth = o.w || 1.2;
        if (o.glow) { ctx.shadowColor = 'rgba(' + (o.color || '159,227,190') + ',0.9)'; ctx.shadowBlur = o.glow; }
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.shadowBlur = 0;
      }, o.glow);
    };

    // 多边形（折纸用，顶点 [{x,y,z}...]）
    E.poly = function (pts, o) {
      o = o || {};
      var sp = [], ok = true, sumD = 0;
      for (var i = 0; i < pts.length; i++) {
        var pr = E.project(pts[i].x, pts[i].y, pts[i].z);
        if (!pr.vis) { ok = false; break; }
        sp.push(pr); sumD += pr.d;
      }
      if (!ok) return;
      push(sumD / pts.length, function () {
        ctx.beginPath();
        ctx.moveTo(sp[0].x, sp[0].y);
        for (var i = 1; i < sp.length; i++) ctx.lineTo(sp[i].x, sp[i].y);
        ctx.closePath();
        if (o.fill) { ctx.fillStyle = 'rgba(' + (o.color || '200,220,230') + ',' + (o.alpha == null ? 0.92 : o.alpha) + ')'; ctx.fill(); }
        if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 1; ctx.stroke(); }
      }, o.glow);
    };

    // 屏幕空间辉光点（已投影坐标）
    E.glowAt = function (sx, sy, r, col, a) {
      push(1e3 + r, function () {
        var g = ctx.createRadialGradient(sx, sy, r * 0.2, sx, sy, r);
        g.addColorStop(0, 'rgba(' + col + ',' + a + ')');
        g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.2832); ctx.fill();
      }, true);
    };

    // 文字（世界坐标标签）
    E.label = function (x, y, z, text, o) {
      o = o || {};
      var p = E.project(x, y, z);
      if (!p.vis) return;
      push(p.d, function () {
        ctx.font = (o.size || 13) + 'px "Noto Sans SC",sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(' + (o.color || '234,241,236') + ',' + (o.alpha == null ? 0.9 : o.alpha) + ')';
        if (o.shadow) { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 6; }
        ctx.fillText(text, p.x, p.y); ctx.shadowBlur = 0;
      });
    };

    /* ---------- 控件（拖拽转视角 + 滚轮缩放） ---------- */
    E.bindControls = function (cfg) {
      cfg = cfg || {};
      var c = E.cam;
      function down(e) {
        E._ptr = { x: e.clientX, y: e.clientY, t: performance.now() };
        c.autoRotate = false; c.yawV = c.pitchV = 0;
        if (E.canvas.setPointerCapture && e.pointerId != null) try { E.canvas.setPointerCapture(e.pointerId); } catch (x) {}
      }
      function move(e) {
        if (!E._ptr) return;
        var dx = e.clientX - E._ptr.x, dy = e.clientY - E._ptr.y;
        E._ptr.x = e.clientX; E._ptr.y = e.clientY;
        c.yaw += dx * 0.006;
        c.pitch += (cfg.invertY ? -dy : dy) * 0.006;
        c.pitch = clamp(c.pitch, c.minPitch, c.maxPitch);
        c.yawV = dx * 0.006; c.pitchV = (cfg.invertY ? -dy : dy) * 0.006;
      }
      function up() { E._ptr = null; }
      function wheel(e) { e.preventDefault(); c.dist = clamp(c.dist * (1 + (e.deltaY > 0 ? 0.08 : -0.08)), c.minDist, c.maxDist); }
      E.canvas.addEventListener('pointerdown', down);
      global.addEventListener('pointermove', move);
      global.addEventListener('pointerup', up);
      E.canvas.addEventListener('wheel', wheel, { passive: false });
      E._ctrl = { down: down, move: move, up: up, wheel: wheel };
    };
    E.unbindControls = function () {
      if (!E._ctrl) return;
      E.canvas.removeEventListener('pointerdown', E._ctrl.down);
      global.removeEventListener('pointermove', E._ctrl.move);
      global.removeEventListener('pointerup', E._ctrl.up);
      E.canvas.removeEventListener('wheel', E._ctrl.wheel);
      E._ctrl = null;
    };

    /* ---------- 循环 ---------- */
    function frame(ts) {
      if (!E.running) return;
      var dt = E._last ? Math.min(0.05, (ts - E._last) / 1000) : 0.016;
      E._last = ts; E.time += dt;
      var v = E.cam;
      if (v.autoRotate && !E._ptr) v.yaw += v.autoSpeed * dt;
      // 惯性
      if (!E._ptr) {
        v.yaw += v.yawV; v.pitch = clamp(v.pitch + v.pitchV, v.minPitch, v.maxPitch);
        v.yawV *= 0.92; v.pitchV *= 0.92;
        if (Math.abs(v.yawV) < 1e-4) v.yawV = 0;
        if (Math.abs(v.pitchV) < 1e-4) v.pitchV = 0;
      }
      E._v = camVectors();
      E.list.length = 0;
      if (E.onFrame) E.onFrame(dt, E.time);
      // 排序：远(大d)先画
      E.list.sort(function (a, b) {
        if (a.g !== b.g) return a.g - b.g; // 辉光后画
        return b.d - a.d;
      });
      for (var i = 0; i < E.list.length; i++) E.list[i].f();
      E._raf = global.requestAnimationFrame(frame);
    }

    E.start = function () {
      if (E.running) return;
      E.running = true; E._last = 0;
      E._raf = global.requestAnimationFrame(frame);
    };
    E.stop = function () {
      E.running = false;
      if (E._raf) global.cancelAnimationFrame(E._raf);
      E._raf = 0;
    };
    E.destroy = function () {
      E.stop();
      E.unbindControls();
      if (E._ro && E.canvas.parentNode) { try { E._ro.disconnect(); } catch (x) {} }
      E._ro = null;
    };

    // resize 观察
    if (global.ResizeObserver) {
      E._ro = new ResizeObserver(function () { resize(); });
      if (canvas.parentNode) E._ro.observe(canvas.parentNode);
    }

    return E;
  }

  global.QN3D = { create: create, version: '1.0', util: { clamp: clamp, lerp: lerp, mulberry32: mulberry32 } };
})(typeof window !== 'undefined' ? window : this);
