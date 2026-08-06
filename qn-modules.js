/* ============================================================
   QNModules — 6 个模块的 3D 场景工厂（依赖 qn3d.js）
   每个 makeX(canvas, opt) 返回 { engine, ...api }。
   - 站点内 renderX 用框架数据驱动 api；
   - 独立预览 *.html 用样例数据驱动同一套 api。
   成品灵感：Forest/Flora（每次专注种一朵，花园逐渐填满）、
   动森/Stardew 静水潭（落石→涟漪→推上岸→暖黄发光）、
   信封+火漆封缄的「给未来信」、光遇星盘、风之旅人、折纸动画。
   纯本地、无外部依赖、可离线。
   ============================================================ */
(function (global) {
  'use strict';
  var U = global.QN3D.util;
  function reduced() { try { return global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function smooth(v) { v = U.clamp(v, 0, 1); return v * v * (3 - 2 * v); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function rgb(c0, c1, t) {
    return Math.round(mix(c0[0], c1[0], t)) + ',' + Math.round(mix(c0[1], c1[1], t)) + ',' + Math.round(mix(c0[2], c1[2], t));
  }
  function ringPts(r, y, seg, phase) {
    var a = [], i; phase = phase || 0;
    for (i = 0; i < seg; i++) { var t = i / seg * 6.2832 + phase; a.push({ x: Math.cos(t) * r, y: y, z: Math.sin(t) * r }); }
    return a;
  }

  /* ============================ 专注花园 ============================ */
  function makeGarden(canvas, opt) {
    opt = opt || {};
    var E = global.QN3D.create(canvas, {});
    E.makeStars(200, 34, 11);
    E.cam.target = [0, 0.95, 0]; E.cam.yaw = 0.7; E.cam.pitch = -0.20; E.cam.dist = 6.4; E.cam.fov = 56;
    E.cam.minDist = 3.5; E.cam.maxDist = 15; E.cam.minPitch = -1.0; E.cam.maxPitch = 0.45;
    var RD = reduced(); E.cam.autoRotate = !RD; E.cam.autoSpeed = 0.038; E.bindControls({});

    var total = opt.totalMs || 900000, left = total, running = false, endAt = 0, doneAt = -99;
    var onDone = opt.onComplete || function () {};

    // 已种下的花（确定性排布，每次专注 +1 朵，看花园慢慢填满）
    var flowerCount = opt.flowers || 0;
    var PALETTES = [[244, 238, 196], [255, 183, 197], [198, 236, 222], [214, 198, 255], [255, 214, 170], [190, 232, 255], [255, 200, 170]];
    function rng(seed) { var s = seed >>> 0; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) / 4294967296); }; }
    var flowers = [];
    (function () { var r = rng(20260805); for (var i = 0; i < 48; i++) { var a = r() * 6.2832, rad = 0.55 + r() * 2.7; flowers.push({ x: Math.cos(a) * rad, z: Math.sin(a) * rad, hue: Math.floor(r() * PALETTES.length), ph: r() * 6.28, scale: 0.8 + r() * 0.55, pop: 0 }); } })();

    function flower(cx, cz, baseY, scale, open, hue, ph, t) {
      var col = PALETTES[hue % PALETTES.length];
      E.cylinder(cx, baseY, cz, cx, baseY + 0.55 * scale, cz, 0.02 * scale, { color: '92,150,118', alpha: 0.95 });
      var la = ph; E.sphere(cx + Math.cos(la) * 0.12 * scale, baseY + 0.24 * scale, cz + Math.sin(la) * 0.12 * scale, 0.06 * scale, { color: '108,168,128', alpha: 0.9 });
      var top = baseY + 0.56 * scale, n = 6, plen = 0.22 * scale, tilt = open * 1.18;
      for (var i = 0; i < n; i++) {
        var ang = i / n * 6.2832 + ph; if (!RD) ang += 0.02 * Math.sin(t * 0.4 + i);
        for (var u = 0.12; u <= 1.001; u += 0.2) {
          var tl = tilt * u, pr = plen * Math.sin(tl * 0.9 + 0.25), rr = 0.5 + 0.5 * Math.sin(Math.PI * u);
          var px = cx + Math.cos(ang) * pr, pz = cz + Math.sin(ang) * pr, py = top + plen * Math.cos(tl) * u * 0.85;
          E.sphere(px, py, pz, 0.052 * scale * rr, { color: col, shade: '28,58,48', alpha: 0.95, glow: open > 0.5, glowR: 2.0, glowA: 0.03 + 0.11 * open });
        }
      }
      E.sphere(cx, top + 0.02 * scale, cz, 0.075 * scale * (1 + 0.25 * open), { color: '255,236,170', shade: '120,90,40', glow: true, glowR: 2.4, glowA: 0.10 + 0.30 * open });
    }

    var spirits = [];
    (function () { for (var i = 0; i < 14; i++) spirits.push({ a: Math.random() * 6.28, r: 1.0 + Math.random() * 2.6, h: 0.4 + Math.random() * 1.8, sp: 0.2 + Math.random() * 0.5, ph: Math.random() * 6.28 }); })();
    var bursts = [];

    function plot(t) {
      for (var k = 0; k < 5; k++) { var y = 0.02 + k * 0.026, r = 2.7 * (0.95 + 0.05 * (k / 4)), sh = 0.3 + 0.7 * (k / 4); var pts = ringPts(r, y, 30); E.poly(pts, { color: rgb([12, 26, 24], [28, 60, 52], sh), fill: true, alpha: 0.96 }); }
      for (var i = 0; i < 16; i++) { var a = i / 16 * 6.2832 + 0.2, R = 2.3 + (i % 3) * 0.18; E.line([Math.cos(a) * R, 0.12, Math.sin(a) * R], [Math.cos(a) * R * 1.02, 0.34 + ((i % 3) * 0.06), Math.sin(a) * R * 1.02], { color: '96,158,132', alpha: 0.3, w: 1.4 }); }
    }

    E.onFrame = function (dt, t) {
      var prog = total > 0 ? U.clamp(1 - left / total, 0, 1) : 0;
      E.sky({ top: '#04090d', bottom: '#0a1620', glow: '120,200,210', starColor: '200,228,235' });
      plot(t);
      // 已种下的花：完全绽放；正在专注的那一朵：随进度绽放
      for (var i = 0; i < flowers.length; i++) {
        var f = flowers[i];
        var open = i < flowerCount ? 1 : (i === flowerCount && running ? prog : 0);
        if (open <= 0.002) continue;
        flower(f.x, f.z, 0.04, f.scale, open, f.hue, f.ph, t);
      }
      // 飘动的微光精灵
      for (var s = 0; s < spirits.length; s++) {
        var sp = spirits[s];
        sp.a += sp.sp * dt * 0.18;
        var sx = Math.cos(sp.a) * sp.r, sz = Math.sin(sp.a) * sp.r, sy = sp.h + Math.sin(t * 0.6 + sp.ph) * 0.15;
        E.sphere(sx, sy, sz, 0.05, { color: '159,227,190', alpha: 0.5, glow: true, glowR: 2.2, glowA: 0.08 });
      }
      // 绽放瞬间的光点迸发
      for (var b = 0; b < bursts.length; b++) {
        var bu = bursts[b]; bu.r0 += bu.v * dt;
        E.sphere(Math.cos(bu.a) * bu.r0, 0.4 + bu.r0 * 0.10, Math.sin(bu.a) * bu.r0, 0.045, { color: '255,236,170', alpha: 0.6, glow: true, glowR: 2, glowA: 0.06 });
      }
      if (bursts.length) bursts = bursts.filter(function (x) { return x.r0 < 3; });
      // 地面静默进度环
      var segs = 48, lit = Math.round(segs * prog);
      for (var i2 = 0; i2 < segs; i2++) {
        var aa = i2 / segs * 6.2832 - 1.57, aa1 = (i2 + 0.8) / segs * 6.2832 - 1.57;
        var on = i2 < lit;
        E.line([Math.cos(aa) * 2.92, 0.03, Math.sin(aa) * 2.92], [Math.cos(aa1) * 2.92, 0.03, Math.sin(aa1) * 2.92],
          { color: on ? '159,227,190' : '70,110,120', alpha: on ? 0.85 : 0.22, w: on ? 2 : 1.2 });
      }
    };    E.start();
    return {
      engine: E,
      setTotal: function (ms) { total = ms; left = ms; },
      start: function () { if (left <= 0) left = total; running = true; endAt = Date.now() + left; },
      pause: function () { running = false; },
      add5: function () { total += 300000; left += 300000; if (running) endAt += 300000; },
      reset: function () { running = false; left = total; doneAt = -99; },
      progress: function () { return U.clamp(1 - left / total, 0, 1); },
      timeLeft: function () { return Math.max(0, left); },
      isRunning: function () { return running; },
      addFlower: function () {
        flowerCount = Math.min(flowers.length, flowerCount + 1);
        var f = flowers[flowerCount - 1]; if (f) f.pop = 0;
        doneAt = E.time; bursts = [];
        for (var i = 0; i < 24; i++) bursts.push({ a: i / 24 * 6.2832, r0: 0.2, v: 1.2 + Math.random() });
      },
      tick: function () { if (running) { var l = endAt - Date.now(); left = l > 0 ? l : 0; if (left <= 0) { running = false; doneAt = E.time; onDone(); } } },
      destroy: function () { E.destroy(); }
    };
  }

  /* ============================ 今日小石子 ============================ */
  function makeStone(canvas, opt) {
    opt = opt || {};
    var E = global.QN3D.create(canvas, {});
    E.makeStars(220, 34, 91);
    E.cam.target = [0, 0.4, 0]; E.cam.yaw = 0.6; E.cam.pitch = -0.32; E.cam.dist = 9.2; E.cam.fov = 52;
    E.cam.minDist = 6.5; E.cam.maxDist = 16; E.cam.minPitch = -0.6; E.cam.maxPitch = -0.08;
    var RD = reduced(); E.cam.autoRotate = false; E.cam.autoSpeed = 0.03; E.bindControls({ invertY: false });
    var WATER = 0.06, POND = 2.35, SHORE_IN = 2.35, SHORE_OUT = 3.15, G = 9.0;
    var stones = [], ripples = [], splashes = [];

    function pebble(x, y, z, r, col, sh, moss) {
      E.sphere(x, y, z, r, { color: col, shade: sh, alpha: 0.98 });
      E.sphere(x + r * 0.7, y - r * 0.05, z + r * 0.16, r * 0.7, { color: col, shade: sh, alpha: 0.98 });
      E.sphere(x - r * 0.62, y + r * 0.02, z - r * 0.24, r * 0.6, { color: col, shade: sh, alpha: 0.98 });
      if (moss > 0) E.sphere(x * 1.04, y + r * 0.5, z * 1.04, r * 0.38, { color: '74,122,72', shade: '20,52,22', alpha: 0.5 * moss });
    }

    // 岸边初始几颗（场景不空，非"今日目标"）
    var SEED = [
      [2.35, -1.55, 0.24, '86,94,88', '14,24,22', 0.9],
      [-2.45, -1.05, 0.20, '120,104,80', '40,30,16', 0.4],
      [2.55, 1.35, 0.22, '78,90,82', '12,22,20', 0.7],
      [-2.55, 1.65, 0.26, '96,100,92', '16,22,18', 1.0],
      [0.5, -2.95, 0.18, '108,96,74', '36,28,14', 0.5],
      [-1.4, 2.95, 0.21, '82,92,84', '14,24,20', 0.8],
      [2.95, 0.2, 0.28, '70,78,72', '10,18,16', 0.6],
      [-2.95, -0.4, 0.23, '114,100,78', '40,30,16', 0.3]
    ];
    SEED.forEach(function (s) { stones.push({ x: s[0], y: 0.13, z: s[1], vx: 0, vy: 0, vz: 0, r: s[2], col: s[3], sh: s[4], moss: s[5], state: 'rest', glow: 0.55, user: false, t: 0 }); });

    // 用户"放下"一颗：从天上随机位置自然坠落（支持多颗）
    function addStone() {
      if (stones.length > 60) stones.shift();
      var ang = Math.random() * 6.2832, rad = Math.random() * POND * 0.6;
      stones.push({
        x: Math.cos(ang) * rad, y: 3.4 + Math.random() * 0.7, z: Math.sin(ang) * rad,
        vx: (Math.random() - 0.5) * 0.5, vy: 0, vz: (Math.random() - 0.5) * 0.5,
        r: 0.17 + Math.random() * 0.10, col: '182,196,196', sh: '26,52,48', moss: Math.random() < 0.5 ? 0.6 : 0.2,
        state: 'fall', glow: 0.25, user: true, t: 0, shoreR: 0, shoreA: 0
      });
    }
    function reset() { stones = stones.filter(function (s) { return !s.user; }); ripples = []; splashes = []; }

    function step(dt, t) {
      for (var i = 0; i < stones.length; i++) {
        var s = stones[i]; s.t += dt;
        if (s.state === 'fall') {
          s.vy -= G * dt; s.y += s.vy * dt; s.x += s.vx * dt; s.z += s.vz * dt;
          if (s.y <= WATER) {
            s.y = WATER; s.state = 'water'; s.vy = -s.vy * 0.28; s.vx *= 0.6; s.vz *= 0.6; s.glow = 0.7;
            for (var k = 0; k < 3; k++) ripples.push(0.06 + k * 0.22);
            for (var p = 0; p < 10; p++) { var pa = Math.random() * 6.2832; splashes.push({ x: s.x, y: WATER + 0.05, z: s.z, vx: Math.cos(pa) * 1.2, vy: 1.4 + Math.random(), vz: Math.sin(pa) * 1.2 }); }
          }
        } else if (s.state === 'water') {
          s.vy -= G * dt; s.y += s.vy * dt;
          if (s.y > WATER + 0.05) s.vy -= 7 * dt;
          if (s.y < WATER) { s.y = WATER; s.vy = Math.abs(s.vy) * 0.3; }
          var rr = Math.hypot(s.x, s.z) || 0.001, ox = s.x / rr, oz = s.z / rr;
          s.vx += ox * 0.5 * dt; s.vz += oz * 0.5 * dt; s.vx *= 0.985; s.vz *= 0.985;
          s.x += s.vx * dt; s.z += s.vz * dt; s.glow = mix(s.glow, 0.5, 0.04);
          if (rr >= SHORE_IN - 0.05 && Math.abs(s.vy) < 0.5) { s.state = 'shore'; s.shoreR = SHORE_IN + Math.random() * (SHORE_OUT - SHORE_IN); s.shoreA = Math.atan2(s.z, s.x); }
        } else if (s.state === 'shore') {
          s.y = mix(s.y, 0.13, 0.07);
          s.x = mix(s.x, Math.cos(s.shoreA) * s.shoreR, 0.07);
          s.z = mix(s.z, Math.sin(s.shoreA) * s.shoreR, 0.07);
          if (Math.abs(s.y - 0.13) < 0.02 && Math.hypot(s.x - Math.cos(s.shoreA) * s.shoreR, s.z - Math.sin(s.shoreA) * s.shoreR) < 0.06) { s.state = 'rest'; s.glow = 0.85; }
        } else if (s.state === 'rest') { s.glow = mix(s.glow, s.user ? 0.7 : 0.55, 0.02); }
      }
      for (var j = splashes.length - 1; j >= 0; j--) { var q = splashes[j]; q.vy -= 6 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt; if (q.y < WATER + 0.02) splashes.splice(j, 1); }
      for (var w = 0; w < ripples.length; w++) ripples[w] += dt * 0.7;
      ripples = ripples.filter(function (x) { return x < 2.1; });
    }
    function draw(t) {
      E.sky({ top: '#050b0f', bottom: '#0b1618', glow: '120,200,180', starColor: '190,222,215' });
      E.poly(ringPts(SHORE_OUT + 0.7, -0.06, 58), { color: '14,24,20', fill: true, alpha: 1 });
      E.poly(ringPts(SHORE_OUT, 0.0, 56), { color: '22,38,30', fill: true, alpha: 1 });
      E.poly(ringPts(SHORE_IN, 0.05, 52), { color: '26,46,36', fill: true, alpha: 1 });
      var wc = ['12,42,48', '16,54,60', '20,66,70'];
      for (var k = 0; k < 3; k++) E.poly(ringPts(POND - k * 0.12, WATER + 0.02 + k * 0.01, 44), { color: wc[k], fill: true, alpha: 0.96 });
      E.poly(ringPts(POND, WATER + 0.04, 50), { color: '34,90,82', fill: false, stroke: 'rgba(120,200,180,0.18)', lw: 1.2 });
      for (var w2 = 0; w2 < ripples.length; w2++) { var rr = ripples[w2]; if (rr < 0.12) continue; var al = 0.22 * (1 - rr / 2.1); if (al <= 0) continue; E.poly(ringPts(rr, WATER + 0.05, 32), { color: '150,210,205', fill: false, stroke: 'rgba(150,210,205,' + al.toFixed(3) + ')', lw: 1.2 }); }
      for (var i = 0; i < stones.length; i++) {
        var s = stones[i]; pebble(s.x, s.y, s.z, s.r, s.col, s.sh, s.moss);
        if (s.user && (s.state === 'fall' || s.state === 'water')) E.sphere(s.x, s.y, s.z, s.r * 1.18, { color: '255,214,140', glow: true, glowR: 2.6, glowA: 0.22 + 0.22 * Math.sin(t * 3) });
        else if (s.glow > 0.4) E.sphere(s.x, s.y, s.z, s.r * 1.05, { color: '150,210,205', glow: true, glowR: 1.6, glowA: 0.12 * s.glow });
      }
      for (var j = 0; j < splashes.length; j++) { var q = splashes[j]; E.sphere(q.x, q.y, q.z, 0.04, { color: '200,235,235', glow: true, glowR: 1.6, glowA: 0.3 }); }
    }
    E.onFrame = function (dt, t) { step(dt, t); draw(t); };
    E.start();
    E.stones = stones; E.ripples = ripples; E.splashes = splashes;
    return { engine: E, addStone: addStone, reset: reset, destroy: function () { E.destroy(); } };
  }

  /* ============================ 成长轨迹 ============================ */
  var SEASON = [
    { name: '春', leaf: '255,183,197', trunk: '120,96,72', ground: '40,70,52' },
    { name: '夏', leaf: '120,200,140', trunk: '110,86,64', ground: '34,74,46' },
    { name: '秋', leaf: '230,180,90', trunk: '120,90,66', ground: '58,54,38' },
    { name: '冬', leaf: '224,236,240', trunk: '120,100,86', ground: '52,60,66' }
  ];
  function plantTree(E, x, z, growth, seasonIdx) {
    var s = SEASON[seasonIdx] || SEASON[0];
    var g = U.clamp(growth, 0.05, 1);
    var h = 0.6 + g * 2.6;
    var tr = 0.06 + g * 0.10;
    E.cylinder(x, 0.05, z, x, h * 0.6, z, tr, { color: s.trunk, alpha: 0.96 });
    E.cylinder(x, h * 0.6, z, x, h, z, tr * 0.7, { color: s.trunk, alpha: 0.96 });
    var branches = 3 + Math.round(g * 3);
    for (var b = 0; b < branches; b++) {
      var a = b / branches * 6.2832 + 0.6, by = h * (0.55 + 0.1 * b / branches);
      var bl = 0.4 + g * 0.8, bx = x + Math.cos(a) * bl, bz = z + Math.sin(a) * bl, ty = by + 0.3 + g * 0.4;
      E.cylinder(x, by, z, bx, ty, bz, tr * 0.5, { color: s.trunk, alpha: 0.95 });
      var cr = 0.5 + g * 0.9;
      var clumps = 3 + Math.round(g * 2);
      for (var c = 0; c < clumps; c++) {
        var ca = c / clumps * 6.2832, crx = bx + Math.cos(ca) * cr * 0.5, crz = bz + Math.sin(ca) * cr * 0.5, cry = ty + 0.2 + (c % 2) * 0.3;
        E.sphere(crx, cry, crz, cr * (0.55 + 0.15 * Math.sin(c)), { color: s.leaf, shade: '20,50,40', alpha: 0.95, glow: seasonIdx === 3, glowR: 2, glowA: seasonIdx === 3 ? 0.2 : 0 });
      }
    }
    E.sphere(x, h + 0.3, z, 0.7 + g * 0.6, { color: s.leaf, shade: '20,50,40', alpha: 0.95, glow: seasonIdx === 3, glowR: 2.2, glowA: seasonIdx === 3 ? 0.22 : 0 });
  }
  /* ============================ 成长轨迹（SVG 森林 · 物种 / 四季 / 阶段） ============================ */
  /* 每棵树由 成长值(0~1000) 驱动：种子→嫩芽→幼苗→小树→大树→参天大树。
     8 种树形各异（松/柏/柳/枫/梧桐/银杏/桃/樱）；四季各有细节（春花/夏荫/秋色/冬雪）；
     缓慢摇曳 + 飘落粒子；成长值多种获取（打卡/浇灌/联动其它模块）。
     GROWTH_MAX=1000：满值成一棵参天大树，可种多棵，长期经营。 */
  var GROWTH_MAX = 1000;
  var GR_SEASON_NAME = { 0: '春', 1: '夏', 2: '秋', 3: '冬' };
  var GR_SPECIES = {
    pine:    { name: '松',   evergreen: true },
    cypress: { name: '柏',   evergreen: true },
    willow:  { name: '柳',   evergreen: false },
    maple:   { name: '枫',   evergreen: false },
    plane:   { name: '梧桐', evergreen: false },
    ginkgo:  { name: '银杏', evergreen: false },
    peach:   { name: '桃',   evergreen: false, blossom: '#f7c2d8' },
    cherry:  { name: '樱',   evergreen: false, blossom: '#fcd0e0' }
  };
  var GR_STAGES = [
    { min: 0,    name: '种子',     desc: '一粒种子，刚落进松软的土里。' },
    { min: 42,   name: '嫩芽',     desc: '破土而出，探出两片子叶。' },
    { min: 180,  name: '幼苗',     desc: '细细的茎，缀着几片新叶。' },
    { min: 420,  name: '小树',     desc: '有了像样的枝干和树冠。' },
    { min: 720,  name: '大树',     desc: '亭亭如盖，枝叶渐丰。' },
    { min: 1000, name: '参天大树', desc: '经年生长，已成林间一景。' }
  ];
  function grSeasonIdx() { var m = new Date().getMonth() + 1; if (m >= 3 && m <= 5) return 0; if (m >= 6 && m <= 8) return 1; if (m >= 9 && m <= 11) return 2; return 3; }
  function grSeasonKey(i) { return ['spring', 'summer', 'autumn', 'winter'][i]; }
  function grStageOf(g) {
    var s = GR_STAGES[0], next = null;
    for (var i = 0; i < GR_STAGES.length; i++) { if (g >= GR_STAGES[i].min) { s = GR_STAGES[i]; next = (i + 1 < GR_STAGES.length) ? GR_STAGES[i + 1] : null; } }
    var info = { idx: GR_STAGES.indexOf(s), name: s.name, desc: s.desc, next: null };
    if (next) info.next = { name: next.name, need: Math.max(0, Math.ceil(next.min - g)), at: next.min, done: false };
    else info.next = { name: '已长成', need: 0, done: true };
    return info;
  }
  /* 每个树种的四季叶色（[主色, 亮部]）——保证同一季不同树也各有其色 */
  var GR_TINT = {
    pine:    { spring: ['#5f9c6b', '#8bbf94'], summer: ['#2f7a4e', '#4ea070'], autumn: ['#357a4c', '#59a374'] },
    cypress: { spring: ['#5a9573', '#8abfa0'], summer: ['#2b6f52', '#469073'], autumn: ['#2f6d50', '#4d9077'] },
    willow:  { spring: ['#a8d48c', '#cbe8ae'], summer: ['#5aa563', '#84c68c'], autumn: ['#cdb04a', '#e4cd72'] },
    maple:   { spring: ['#8fc98a', '#bfe0a8'], summer: ['#3f8f5e', '#5fb87e'], autumn: ['#bf3a2c', '#e0673f'] },
    plane:   { spring: ['#96c98f', '#c3e2ab'], summer: ['#478f55', '#6cb474'], autumn: ['#b5762f', '#d59f57'] },
    ginkgo:  { spring: ['#9ed08a', '#c6e6a6'], summer: ['#4f9a5c', '#74bb7f'], autumn: ['#e0b41a', '#f6dc63'] },
    peach:   { spring: ['#87c384', '#b8dda2'], summer: ['#43925f', '#63bb80'], autumn: ['#cf8a3a', '#e8b055'] },
    cherry:  { spring: ['#93cb8d', '#c2e2ab'], summer: ['#419060', '#61b980'], autumn: ['#d1834a', '#e9ab6c'] }
  };
  /* 每个树种的树干色（梧桐斑驳浅、樱桃偏红褐） */
  var GR_TRUNK = { pine: '#6b4a30', cypress: '#67503a', willow: '#7b6244', maple: '#6e4a30', plane: '#8a7a68', ginkgo: '#6f5940', peach: '#744f38', cherry: '#6b4a3a' };
  function grPalette(season, sp) {
    var S = GR_SPECIES[sp] ? sp : 'maple';
    var ev = GR_SPECIES[S].evergreen, tint = GR_TINT[S] || GR_TINT.maple, trunk = GR_TRUNK[S] || '#6e4a30';
    if (season === 'winter') {
      if (ev) return { trunk: trunk, leaf: tint.summer[0], accent: tint.summer[1], blossom: null, ground: '#38424a', sky1: '#0a1018', sky2: '#101a24', snow: true };
      return { trunk: trunk, leaf: '#9fb28f', accent: '#c4d2bd', blossom: null, ground: '#3a444c', sky1: '#0a1018', sky2: '#101a24', snow: true, bare: true };
    }
    var pair = tint[season] || tint.summer;
    var sky = season === 'spring' ? ['#0e1c22', '#17272d'] : (season === 'summer' ? ['#0a161a', '#10242a'] : ['#1c1410', '#241a12']);
    var ground = season === 'spring' ? '#3c5a44' : (season === 'summer' ? '#2f5238' : '#574a32');
    return { trunk: trunk, leaf: pair[0], accent: pair[1], blossom: (season === 'spring' ? (GR_SPECIES[S].blossom || null) : null), ground: ground, sky1: sky[0], sky2: sky[1] };
  }
  function grLeaf(x, y, dir, col) { return '<ellipse cx="' + (x + dir * 8) + '" cy="' + (y - 4) + '" rx="9" ry="5" fill="' + col + '" transform="rotate(' + (dir * 35) + ' ' + (x + dir * 8) + ' ' + (y - 4) + ')"/>'; }
  function grPine(cx, cy, R, p) {
    var s = '', n = 3;
    for (var i = 0; i < n; i++) {
      var w = R * (1.05 - i * 0.22), topY = cy - R * 0.15 - i * R * 0.55, botY = cy + R * 0.72 - i * R * 0.5;
      s += '<path d="M' + cx + ' ' + topY.toFixed(1) + ' L' + (cx - w).toFixed(1) + ' ' + botY.toFixed(1) + ' L' + (cx + w).toFixed(1) + ' ' + botY.toFixed(1) + ' Z" fill="' + p.leaf + '"/>';
      if (p.snow) s += '<path d="M' + cx + ' ' + topY.toFixed(1) + ' L' + (cx - w * 0.42).toFixed(1) + ' ' + (topY + R * 0.2).toFixed(1) + ' L' + (cx + w * 0.42).toFixed(1) + ' ' + (topY + R * 0.2).toFixed(1) + ' Z" fill="#eef3f7" opacity="0.85"/>';
    }
    return s;
  }
  function grCypress(cx, cy, R, p) {
    var h = R * 2.0;
    var s = '<path d="M' + cx + ' ' + (cy + R * 0.9).toFixed(1) + ' C ' + (cx - R * 0.5).toFixed(1) + ' ' + (cy + R * 0.1).toFixed(1) + ' ' + (cx - R * 0.22).toFixed(1) + ' ' + (cy - h * 0.6).toFixed(1) + ' ' + cx + ' ' + (cy - h).toFixed(1) + ' C ' + (cx + R * 0.22).toFixed(1) + ' ' + (cy - h * 0.6).toFixed(1) + ' ' + (cx + R * 0.5).toFixed(1) + ' ' + (cy + R * 0.1).toFixed(1) + ' ' + cx + ' ' + (cy + R * 0.9).toFixed(1) + ' Z" fill="' + p.leaf + '"/>';
    if (p.snow) s += '<ellipse cx="' + cx + '" cy="' + (cy - h * 0.7).toFixed(1) + '" rx="' + (R * 0.18).toFixed(1) + '" ry="' + (R * 0.1).toFixed(1) + '" fill="#eef3f7" opacity="0.85"/>';
    return s;
  }
  function grWillow(cx, cy, R, p) {
    var s = '<circle cx="' + cx + '" cy="' + cy.toFixed(1) + '" r="' + (R * 0.82).toFixed(1) + '" fill="' + p.leaf + '"/>';
    for (var i = -3; i <= 3; i++) {
      var x = cx + i * R * 0.26;
      s += '<path d="M' + x.toFixed(1) + ' ' + (cy + R * 0.35).toFixed(1) + ' q ' + (i * 1.1).toFixed(1) + ' ' + (R * 0.95).toFixed(1) + ' ' + (i * 2.2).toFixed(1) + ' ' + (R * 1.55).toFixed(1) + '" stroke="' + p.accent + '" stroke-width="2" fill="none" opacity="0.82" stroke-linecap="round"/>';
    }
    return s;
  }
  function grBushy(cx, cy, R, p) {
    var pts = [[0, 0, 1], [-0.6, 0.2, 0.7], [0.6, 0.2, 0.7], [-0.32, -0.42, 0.62], [0.36, -0.36, 0.64], [0, -0.12, 0.86]];
    var s = '';
    for (var i = 0; i < pts.length; i++) { var x = cx + pts[i][0] * R, y = cy + pts[i][1] * R, rr = R * pts[i][2]; s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + rr.toFixed(1) + '" fill="' + p.leaf + '"/>'; }
    if (p.snow) s += '<circle cx="' + cx.toFixed(1) + '" cy="' + (cy - R * 0.6).toFixed(1) + '" r="' + (R * 0.5).toFixed(1) + '" fill="#eef3f7" opacity="0.7"/>';
    return s;
  }
  /* 枫：五裂掌状冠 + 三片明显枫叶 */
  function grMaple(cx, cy, R, p) {
    var s = '', i, a, rr, out = [], mid = [];
    for (i = 0; i < 10; i++) {
      a = -1.5708 + i / 10 * 6.2832;
      rr = (i % 2 === 0) ? R * 1.04 : R * 0.6;
      out.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr * 0.92).toFixed(1));
      mid.push((cx + Math.cos(a) * rr * 0.6).toFixed(1) + ',' + (cy + Math.sin(a) * rr * 0.55).toFixed(1));
    }
    s += '<polygon points="' + out.join(' ') + '" fill="' + p.leaf + '"/>';
    s += '<polygon points="' + mid.join(' ') + '" fill="' + p.accent + '" opacity="0.4"/>';
    var lf = [[-0.72, 0.24], [0.68, 0.1], [0.04, -0.74]];
    for (i = 0; i < lf.length; i++) {
      var lx = cx + lf[i][0] * R, ly = cy + lf[i][1] * R, u = Math.max(4, R * 0.2);
      s += '<path d="M' + lx.toFixed(1) + ' ' + (ly + u).toFixed(1) +
        ' L' + (lx - u).toFixed(1) + ' ' + ly.toFixed(1) +
        ' L' + (lx - u * 0.55).toFixed(1) + ' ' + (ly - u * 0.16).toFixed(1) +
        ' L' + (lx - u * 0.82).toFixed(1) + ' ' + (ly - u).toFixed(1) +
        ' L' + (lx - u * 0.2).toFixed(1) + ' ' + (ly - u * 0.72).toFixed(1) +
        ' L' + lx.toFixed(1) + ' ' + (ly - u * 1.5).toFixed(1) +
        ' L' + (lx + u * 0.2).toFixed(1) + ' ' + (ly - u * 0.72).toFixed(1) +
        ' L' + (lx + u * 0.82).toFixed(1) + ' ' + (ly - u).toFixed(1) +
        ' L' + (lx + u * 0.55).toFixed(1) + ' ' + (ly - u * 0.16).toFixed(1) +
        ' L' + (lx + u).toFixed(1) + ' ' + ly.toFixed(1) + ' Z" fill="' + p.accent + '"/>';
    }
    if (p.snow) s += '<ellipse cx="' + cx + '" cy="' + (cy - R * 0.86).toFixed(1) + '" rx="' + (R * 0.5).toFixed(1) + '" ry="' + (R * 0.16).toFixed(1) + '" fill="#eef3f7" opacity="0.75"/>';
    return s;
  }
  /* 梧桐：宽扁伞冠 + 悬铃球果 */
  function grPlane(cx, cy, R, p) {
    var s = '';
    s += '<ellipse cx="' + cx + '" cy="' + (cy + R * 0.12).toFixed(1) + '" rx="' + (R * 1.2).toFixed(1) + '" ry="' + (R * 0.66).toFixed(1) + '" fill="' + p.leaf + '"/>';
    s += '<ellipse cx="' + (cx - R * 0.62).toFixed(1) + '" cy="' + (cy - R * 0.3).toFixed(1) + '" rx="' + (R * 0.58).toFixed(1) + '" ry="' + (R * 0.44).toFixed(1) + '" fill="' + p.leaf + '"/>';
    s += '<ellipse cx="' + (cx + R * 0.6).toFixed(1) + '" cy="' + (cy - R * 0.34).toFixed(1) + '" rx="' + (R * 0.56).toFixed(1) + '" ry="' + (R * 0.42).toFixed(1) + '" fill="' + p.leaf + '"/>';
    s += '<ellipse cx="' + cx + '" cy="' + (cy - R * 0.5).toFixed(1) + '" rx="' + (R * 0.74).toFixed(1) + '" ry="' + (R * 0.38).toFixed(1) + '" fill="' + p.accent + '" opacity="0.42"/>';
    var fx = [-0.78, -0.08, 0.66];
    for (var i = 0; i < fx.length; i++) {
      var x = cx + fx[i] * R, y = cy + R * 0.6;
      s += '<path d="M' + x.toFixed(1) + ' ' + (y - R * 0.16).toFixed(1) + ' V' + (y + R * 0.12).toFixed(1) + '" stroke="' + p.trunk + '" stroke-width="1.4"/>';
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + (y + R * 0.2).toFixed(1) + '" r="' + Math.max(2, R * 0.1).toFixed(1) + '" fill="#a97f4e"/>';
    }
    if (p.snow) s += '<ellipse cx="' + cx + '" cy="' + (cy - R * 0.7).toFixed(1) + '" rx="' + (R * 0.82).toFixed(1) + '" ry="' + (R * 0.17).toFixed(1) + '" fill="#eef3f7" opacity="0.78"/>';
    return s;
  }
  /* 银杏：直立扇塔形 + 扇形叶 */
  function grGinkgo(cx, cy, R, p) {
    var top = cy - R * 1.12, bot = cy + R * 0.86;
    var s = '<path d="M' + cx + ' ' + bot.toFixed(1) +
      ' L' + (cx - R * 0.95).toFixed(1) + ' ' + (cy - R * 0.1).toFixed(1) +
      ' Q ' + cx + ' ' + (top - R * 0.2).toFixed(1) + ' ' + (cx + R * 0.95).toFixed(1) + ' ' + (cy - R * 0.1).toFixed(1) +
      ' Z" fill="' + p.leaf + '"/>';
    for (var i = 0; i < 3; i++) {
      var yy = cy - R * 0.5 + i * R * 0.4, w = R * (0.82 - i * 0.08);
      s += '<path d="M' + (cx - w).toFixed(1) + ' ' + yy.toFixed(1) + ' Q ' + cx + ' ' + (yy - R * 0.22).toFixed(1) + ' ' + (cx + w).toFixed(1) + ' ' + yy.toFixed(1) + '" stroke="' + p.accent + '" stroke-width="1.6" fill="none" opacity="0.5"/>';
    }
    var lv = [[-0.62, 0.24], [0.58, 0.08], [-0.18, -0.6], [0.32, -0.46]];
    for (var k = 0; k < lv.length; k++) {
      var lx = cx + lv[k][0] * R, ly = cy + lv[k][1] * R, u = Math.max(4, R * 0.2);
      s += '<path d="M' + lx.toFixed(1) + ' ' + (ly + u * 0.6).toFixed(1) +
        ' L' + (lx - u * 0.78).toFixed(1) + ' ' + (ly - u * 0.7).toFixed(1) +
        ' Q ' + lx.toFixed(1) + ' ' + (ly - u * 1.3).toFixed(1) + ' ' + (lx + u * 0.78).toFixed(1) + ' ' + (ly - u * 0.7).toFixed(1) +
        ' Z" fill="' + p.accent + '"/>';
    }
    if (p.snow) s += '<ellipse cx="' + cx + '" cy="' + (top + R * 0.1).toFixed(1) + '" rx="' + (R * 0.3).toFixed(1) + '" ry="' + (R * 0.12).toFixed(1) + '" fill="#eef3f7" opacity="0.8"/>';
    return s;
  }
  /* 桃 / 樱：圆冠 —— 春满树花，夏结果，秋稀疏 */
  function grBlossom(cx, cy, R, p, sp, season) {
    var s = grBushy(cx, cy, R, p);
    var bc = (GR_SPECIES[sp] && GR_SPECIES[sp].blossom) || p.blossom || '#f7c2d8';
    var n = season === 'spring' ? 14 : (season === 'summer' ? 7 : 5);
    var col = season === 'spring' ? bc : (season === 'summer' ? (sp === 'peach' ? '#e8825f' : '#cf4b5e') : '#c85a3a');
    var rad = season === 'spring' ? 0.12 : 0.088;
    for (var i = 0; i < n; i++) {
      var a = i / n * 6.2832 + 0.3, rr = R * (0.2 + 0.72 * ((i * 37 % 100) / 100));
      var x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.82;
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + Math.max(1.6, R * rad).toFixed(1) + '" fill="' + col + '" opacity="0.92"/>';
    }
    return s;
  }
  /* 冬季落叶后的枯枝剪影 —— 每个树种的骨架走向不同 */
  var GR_BARE = {
    willow: { n: 7, spread: 1.00, lift: 0.50, droop: 0.55, w: 1.7, cap: 2.4 },
    maple:  { n: 7, spread: 0.92, lift: 1.02, droop: 0.00, w: 2.3, cap: 3.2 },
    plane:  { n: 5, spread: 1.16, lift: 0.66, droop: 0.10, w: 3.0, cap: 3.6 },
    ginkgo: { n: 5, spread: 0.56, lift: 1.20, droop: -0.12, w: 2.4, cap: 2.8 },
    peach:  { n: 6, spread: 0.86, lift: 0.90, droop: 0.05, w: 2.0, cap: 2.6, bud: '#e9a9c1' },
    cherry: { n: 6, spread: 0.90, lift: 0.94, droop: 0.04, w: 2.0, cap: 2.6, bud: '#f2c2d4' }
  };
  function grBare(cx, trunkTop, R, p, sp) {
    var c = GR_BARE[sp] || GR_BARE.maple, s = '';
    for (var i = 0; i < c.n; i++) {
      var t = c.n === 1 ? 0.5 : i / (c.n - 1);            // 0~1 从左到右
      var a = (t - 0.5) * 2;                                // -1~1
      var bx = cx + a * R * c.spread;
      var by = trunkTop - (1 - Math.abs(a) * 0.55) * R * c.lift + Math.abs(a) * R * c.droop;
      var qx = cx + a * R * c.spread * 0.45;
      var qy = trunkTop - R * c.lift * 0.34 - 4;
      var lw = (c.w * (1 - Math.abs(a) * 0.32)).toFixed(1);
      s += '<path d="M' + cx + ' ' + trunkTop.toFixed(1) + ' Q ' + qx.toFixed(1) + ' ' + qy.toFixed(1) + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1) + '" stroke="' + p.trunk + '" stroke-width="' + lw + '" fill="none" stroke-linecap="round"/>';
      // 二级细枝
      var tx = bx + a * R * 0.18, ty = by - R * (c.droop > 0.3 ? -0.16 : 0.22);
      s += '<path d="M' + bx.toFixed(1) + ' ' + by.toFixed(1) + ' L' + tx.toFixed(1) + ' ' + ty.toFixed(1) + '" stroke="' + p.trunk + '" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.9"/>';
      // 积雪 / 花苞
      if (c.bud && i % 2 === 0) s += '<circle cx="' + tx.toFixed(1) + '" cy="' + ty.toFixed(1) + '" r="2.6" fill="' + c.bud + '" opacity="0.92"/>';
      s += '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="' + c.cap + '" fill="#eef3f7" opacity="0.88"/>';
    }
    return s;
  }
  /* 种子期（0~41）：每个树种的种子长得不一样 */
  function grSeed(cx, y, sp, r) {
    var s = '', crack = r > 0.55;   // 快发芽时裂开一道缝
    if (sp === 'pine') {
      // 松塔：细长鳞片球果 + 一枚种翅
      s += '<ellipse cx="' + cx + '" cy="' + (y - 1) + '" rx="5" ry="9" fill="#7a5a38" transform="rotate(-18 ' + cx + ' ' + (y - 1) + ')"/>';
      for (var i = 0; i < 4; i++) s += '<path d="M' + (cx - 4.5) + ' ' + (y - 7 + i * 3.6) + ' h9" stroke="#9c7746" stroke-width="1.4" opacity="0.8"/>';
      s += '<path d="M' + (cx + 4) + ' ' + (y - 8) + ' q 9 -3 12 4" stroke="#c9a97a" stroke-width="1.6" fill="none" opacity="0.85"/>';
    } else if (sp === 'cypress') {
      // 柏籽：小圆球果，表面盾状鳞纹
      s += '<circle cx="' + cx + '" cy="' + (y - 5) + '" r="6.4" fill="#6d5a3c"/>';
      s += '<path d="M' + (cx - 6.4) + ' ' + (y - 5) + ' h12.8 M' + cx + ' ' + (y - 11.4) + ' v12.8" stroke="#93805c" stroke-width="1.3" opacity="0.9"/>';
      s += '<circle cx="' + cx + '" cy="' + (y - 5) + '" r="2.1" fill="#a3906a"/>';
      s += '<path d="M' + (cx - 7) + ' ' + (y + 1) + ' q 7 4 14 0" stroke="#5d4d33" stroke-width="1.2" fill="none" opacity="0.7"/>';
    } else if (sp === 'maple') {
      s += '<ellipse cx="' + (cx - 3) + '" cy="' + (y - 2) + '" rx="4.6" ry="4" fill="#8a5c34"/>';
      s += '<path d="M' + (cx + 1) + ' ' + (y - 3) + ' q 13 -8 17 2 q -9 4 -17 -2 Z" fill="#c8a06a" opacity="0.9"/>'; // 翅果
      s += '<path d="M' + (cx - 1) + ' ' + (y - 3) + ' q -12 -7 -16 2 q 8 4 16 -2 Z" fill="#bb9460" opacity="0.75"/>';
    } else if (sp === 'ginkgo') {
      s += '<ellipse cx="' + cx + '" cy="' + (y - 5) + '" rx="7" ry="8" fill="#d8cba6"/>';       // 白果
      s += '<ellipse cx="' + (cx - 2) + '" cy="' + (y - 7) + '" rx="2.6" ry="2.8" fill="#efe6c8"/>';
    } else if (sp === 'peach') {
      s += '<ellipse cx="' + cx + '" cy="' + (y - 5) + '" rx="7.5" ry="9" fill="#9a6a44"/>';      // 桃核
      for (var k = -2; k <= 2; k++) s += '<path d="M' + (cx + k * 2.6) + ' ' + (y - 12) + ' q ' + (k) + ' 7 0 13" stroke="#7d5334" stroke-width="1.1" fill="none" opacity="0.75"/>';
    } else if (sp === 'cherry') {
      s += '<circle cx="' + cx + '" cy="' + (y - 5) + '" r="6" fill="#8f5a4a"/>';
      s += '<circle cx="' + (cx - 2) + '" cy="' + (y - 7) + '" r="2" fill="#b07c68"/>';
    } else if (sp === 'willow') {
      s += '<ellipse cx="' + cx + '" cy="' + (y - 4) + '" rx="3.2" ry="4.2" fill="#7f6a48"/>';
      for (var w = 0; w < 7; w++) { var a = w / 7 * 6.2832; s += '<path d="M' + cx + ' ' + (y - 5) + ' l ' + (Math.cos(a) * 9).toFixed(1) + ' ' + (Math.sin(a) * 7 - 3).toFixed(1) + '" stroke="#e6ecdc" stroke-width="1" opacity="0.6"/>'; } // 柳絮
    } else {
      s += '<circle cx="' + cx + '" cy="' + (y - 5) + '" r="7" fill="#8a6a44"/>';                  // 梧桐球果
      s += '<circle cx="' + cx + '" cy="' + (y - 5) + '" r="7" fill="none" stroke="#a9855a" stroke-width="1.6" stroke-dasharray="2 3"/>';
    }
    if (crack) s += '<path d="M' + (cx - 5) + ' ' + (y - 12) + ' q 5 -4 10 0" stroke="#bfe0a8" stroke-width="1.8" fill="none" opacity="0.9"/>';
    return s;
  }
  /* 嫩芽 / 幼苗期（42~179）：子叶形态按树种区分 */
  function grSprout(cx, groundY, sp, p, r) {
    var h = 22 + r * 46, top = groundY - h, s = '';
    s += '<path d="M' + cx + ' ' + groundY + ' Q ' + (cx - 3) + ' ' + (groundY - h * 0.5) + ' ' + cx + ' ' + top.toFixed(1) + '" stroke="' + p.trunk + '" stroke-width="' + (2.4 + r * 2.2).toFixed(1) + '" fill="none" stroke-linecap="round"/>';
    if (sp === 'pine') {
      for (var i = 0; i < 9; i++) { var a = -2.6 + i / 8 * 2.0; s += '<path d="M' + cx + ' ' + (top + 4).toFixed(1) + ' l ' + (Math.cos(a) * 14).toFixed(1) + ' ' + (Math.sin(a) * 14).toFixed(1) + '" stroke="' + p.leaf + '" stroke-width="1.8" stroke-linecap="round"/>'; }
    } else if (sp === 'cypress') {
      for (var c = 0; c < 4; c++) { var yy = top + c * 6; s += '<path d="M' + cx + ' ' + yy.toFixed(1) + ' l -8 5 M' + cx + ' ' + yy.toFixed(1) + ' l 8 5" stroke="' + p.leaf + '" stroke-width="2.2" stroke-linecap="round"/>'; }
    } else if (sp === 'ginkgo') {
      [[-1, 0], [1, 3]].forEach(function (d) {
        var lx = cx + d[0] * 7, ly = top + d[1];
        s += '<path d="M' + cx + ' ' + (ly + 2).toFixed(1) + ' L' + (lx + d[0] * 8).toFixed(1) + ' ' + (ly - 7).toFixed(1) + ' Q ' + (lx + d[0] * 3).toFixed(1) + ' ' + (ly - 12).toFixed(1) + ' ' + (lx - d[0] * 2).toFixed(1) + ' ' + (ly - 4).toFixed(1) + ' Z" fill="' + p.accent + '"/>';
      });
    } else if (sp === 'maple') {
      [-1, 1].forEach(function (d) {
        var lx = cx + d * 10, ly = top + (d < 0 ? 2 : 8), u = 7;
        s += '<path d="M' + lx.toFixed(1) + ' ' + (ly + u * 0.7).toFixed(1) + ' L' + (lx - u).toFixed(1) + ' ' + ly.toFixed(1) + ' L' + (lx - u * 0.3).toFixed(1) + ' ' + (ly - u * 0.4).toFixed(1) + ' L' + lx.toFixed(1) + ' ' + (ly - u * 1.3).toFixed(1) + ' L' + (lx + u * 0.3).toFixed(1) + ' ' + (ly - u * 0.4).toFixed(1) + ' L' + (lx + u).toFixed(1) + ' ' + ly.toFixed(1) + ' Z" fill="' + p.accent + '"/>';
        s += '<path d="M' + cx + ' ' + (ly + 2).toFixed(1) + ' L' + lx.toFixed(1) + ' ' + ly.toFixed(1) + '" stroke="' + p.leaf + '" stroke-width="1.2"/>';
      });
    } else if (sp === 'willow') {
      [-1, 1].forEach(function (d) {
        s += '<path d="M' + cx + ' ' + (top + 4).toFixed(1) + ' q ' + (d * 10) + ' 2 ' + (d * 13) + ' 14" stroke="' + p.accent + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
      });
    } else if (sp === 'plane') {
      s += '<ellipse cx="' + (cx - 9) + '" cy="' + (top + 3).toFixed(1) + '" rx="11" ry="6" fill="' + p.accent + '" transform="rotate(-24 ' + (cx - 9) + ' ' + (top + 3).toFixed(1) + ')"/>';
      s += '<ellipse cx="' + (cx + 9) + '" cy="' + (top + 8).toFixed(1) + '" rx="10" ry="5.6" fill="' + p.accent + '" transform="rotate(22 ' + (cx + 9) + ' ' + (top + 8).toFixed(1) + ')"/>';
    } else {
      s += grLeaf(cx, top + 12, -1, p.accent) + grLeaf(cx, top + 2, 1, p.accent);
      if (r > 0.6) s += '<circle cx="' + (cx + 1) + '" cy="' + (top - 2) + '" r="2.6" fill="' + (GR_SPECIES[sp] && GR_SPECIES[sp].blossom || p.accent) + '"/>';
    }
    if (p.snow) s += '<ellipse cx="' + cx + '" cy="' + (top - 2) + '" rx="9" ry="3" fill="#eef3f7" opacity="0.8"/>';
    return s;
  }
  function grTreeInner(sp, season, g) {
    var clamp = global.QN3D.util.clamp;
    var r = clamp(g / GROWTH_MAX, 0, 1);
    var cx = 120, groundY = 276;
    var spc = GR_SPECIES[sp] ? sp : 'maple';
    var p = grPalette(season, spc);
    var parts = [];
    parts.push('<ellipse cx="' + cx + '" cy="' + groundY + '" rx="94" ry="15" fill="' + p.ground + '"/>');
    parts.push('<ellipse cx="' + cx + '" cy="' + (groundY + 2) + '" rx="58" ry="8" fill="rgba(0,0,0,.16)"/>');
    if (p.snow) parts.push('<ellipse cx="' + cx + '" cy="' + (groundY - 3) + '" rx="90" ry="11" fill="#dfe8ee" opacity="0.55"/>');
    if (g < 42) {
      parts.push('<ellipse cx="' + cx + '" cy="' + (groundY - 2) + '" rx="16" ry="5" fill="rgba(0,0,0,.2)"/>');
      parts.push(grSeed(cx, groundY - 2, spc, clamp(g / 42, 0, 1)));
      return parts.join('');
    }
    var trunkH = 28 + r * 180, trunkTop = groundY - trunkH, trunkW = 5 + r * 15, canopyR = 20 + r * 82, canopyCy = trunkTop - canopyR * 0.5;
    if (g < 180) {
      parts.push(grSprout(cx, groundY, spc, p, clamp((g - 42) / 138, 0, 1)));
      return parts.join('');
    }
    parts.push('<path d="M' + (cx - trunkW / 2).toFixed(1) + ' ' + groundY + ' C ' + (cx - trunkW * 0.3).toFixed(1) + ' ' + (groundY - trunkH * 0.5).toFixed(1) + ' ' + (cx - trunkW * 0.15).toFixed(1) + ' ' + (trunkTop + trunkH * 0.3).toFixed(1) + ' ' + cx + ' ' + trunkTop.toFixed(1) + ' L ' + (cx + trunkW * 0.15).toFixed(1) + ' ' + trunkTop.toFixed(1) + ' C ' + (cx + trunkW * 0.15).toFixed(1) + ' ' + (trunkTop + trunkH * 0.3).toFixed(1) + ' ' + (cx + trunkW * 0.3).toFixed(1) + ' ' + (groundY - trunkH * 0.5).toFixed(1) + ' ' + (cx + trunkW / 2).toFixed(1) + ' ' + groundY + ' Z" fill="' + p.trunk + '"/>');
    if (r > 0.35) {
      parts.push('<path d="M' + cx + ' ' + (trunkTop + trunkH * 0.25).toFixed(1) + ' q ' + (canopyR * 0.5).toFixed(1) + ' -10 ' + (canopyR * 0.78).toFixed(1) + ' -' + (trunkH * 0.2).toFixed(1) + '" stroke="' + p.trunk + '" stroke-width="' + (trunkW * 0.42).toFixed(1) + '" fill="none" stroke-linecap="round"/>');
      parts.push('<path d="M' + cx + ' ' + (trunkTop + trunkH * 0.25).toFixed(1) + ' q ' + (-canopyR * 0.5).toFixed(1) + ' -10 ' + (-canopyR * 0.78).toFixed(1) + ' -' + (trunkH * 0.2).toFixed(1) + '" stroke="' + p.trunk + '" stroke-width="' + (trunkW * 0.42).toFixed(1) + '" fill="none" stroke-linecap="round"/>');
    }
    if (p.bare) parts.push(grBare(cx, trunkTop, canopyR, p, spc));
    else if (spc === 'pine') parts.push(grPine(cx, canopyCy, canopyR, p));
    else if (spc === 'cypress') parts.push(grCypress(cx, canopyCy, canopyR, p));
    else if (spc === 'willow') parts.push(grWillow(cx, canopyCy, canopyR, p));
    else if (spc === 'maple') parts.push(grMaple(cx, canopyCy, canopyR, p));
    else if (spc === 'plane') parts.push(grPlane(cx, canopyCy, canopyR, p));
    else if (spc === 'ginkgo') parts.push(grGinkgo(cx, canopyCy, canopyR, p));
    else if (spc === 'peach' || spc === 'cherry') parts.push(grBlossom(cx, canopyCy, canopyR, p, spc, season));
    else parts.push(grBushy(cx, canopyCy, canopyR, p));
    return parts.join('');
  }
  function makeGrowth(stage, opt) {
    opt = opt || {};
    var st = {
      species: opt.species || 'pine',
      forest: opt.forest || [{ species: opt.species || 'pine', growth: 220 }],
      active: opt.active || 0,
      season: (opt.season != null) ? opt.season : grSeasonIdx()
    };
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'gr-tree'); svg.setAttribute('viewBox', '0 0 240 320'); svg.setAttribute('preserveAspectRatio', 'xMidYMax meet');
    var sky = document.createElement('div'); sky.className = 'gr-sky';
    var fall = document.createElement('div'); fall.className = 'gr-fall';
    var tag = document.createElement('div'); tag.className = 'gr-tag';
    stage.innerHTML = ''; stage.appendChild(sky); stage.appendChild(svg); stage.appendChild(fall); stage.appendChild(tag);
    var disp = 0, target = 0, raf = 0, last = 0;
    function cur() { return st.forest[st.active] || { species: st.species, growth: 0 }; }
    function paint() {
      var t = cur(), p = grPalette(grSeasonKey(st.season), t.species);
      sky.style.background = 'linear-gradient(180deg,' + p.sky1 + ' 0%,' + p.sky2 + ' 100%)';
      var info = grStageOf(t.growth);
      tag.innerHTML = '<span class="gr-sp">' + GR_SPECIES[t.species].name + '</span><span class="gr-st">' + info.name + '</span>';
    }
    function frame(ts) {
      if (!last) last = ts; var dt = Math.min(0.05, (ts - last) / 1000); last = ts;
      var t = cur(); target = t.growth;
      disp += (target - disp) * Math.min(1, dt * 4);
      if (Math.abs(target - disp) < 0.6) disp = target;
      svg.innerHTML = '<g class="gr-sway">' + grTreeInner(t.species, grSeasonKey(st.season), disp) + '</g>';
      if (disp !== target) raf = requestAnimationFrame(frame); else { raf = 0; last = 0; }
    }
    function startAnim() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
    function makeFall() {
      fall.innerHTML = '';
      var kind = st.season === 0 ? 'petal' : (st.season === 2 ? 'leaf' : (st.season === 3 ? 'snow' : 'none'));
      if (kind === 'none') return;
      var n = st.season === 3 ? 18 : 14;
      for (var i = 0; i < n; i++) {
        var d = document.createElement('div'); d.className = 'gr-p gr-' + kind;
        d.style.left = (Math.random() * 100) + '%';
        d.style.animationDelay = (-Math.random() * 8) + 's';
        d.style.animationDuration = (6 + Math.random() * 6) + 's';
        d.style.opacity = (0.5 + Math.random() * 0.5).toFixed(2);
        if (st.season === 0) d.style.background = '#f7c6d6';
        else if (st.season === 2) d.style.background = ['#d98a2b', '#e7b34e', '#c0563a'][i % 3];
        fall.appendChild(d);
      }
    }
    paint(); makeFall(); startAnim();
    return {
      setSeason: function (s) { st.season = s; paint(); makeFall(); },
      setActive: function (i) { if (i >= 0 && i < st.forest.length) { st.active = i; paint(); startAnim(); } },
      plant: function (sp) { st.forest.push({ species: sp || st.species, growth: 0 }); st.active = st.forest.length - 1; paint(); startAnim(); return st.active; },
      setDefault: function (sp) { st.species = sp; },
      addGrowth: function (n) { var t = cur(); if (!t) return 0; t.growth = global.QN3D.util.clamp(t.growth + (n || 0), 0, GROWTH_MAX); paint(); startAnim(); return t.growth; },
      setForest: function (f, a) { if (f) st.forest = f; if (a != null) st.active = a; paint(); startAnim(); },
      getState: function () { return { species: st.species, forest: st.forest.map(function (x) { return { species: x.species, growth: x.growth }; }), active: st.active, season: st.season }; },
      destroy: function () { if (raf) cancelAnimationFrame(raf); raf = 0; stage.innerHTML = ''; }
    };
  }

  /* ============================ 时间胶囊（信封 + 火漆封缄） ============================ */
  function makeCapsule(canvas, opt) {
    opt = opt || {};
    var E = global.QN3D.create(canvas, {});
    E.makeStars(220, 36, 23);
    E.cam.target = [0, 1.0, 0]; E.cam.yaw = 0.5; E.cam.pitch = -0.10; E.cam.dist = 7; E.cam.fov = 56;
    E.cam.minDist = 4; E.cam.maxDist = 14; E.cam.minPitch = -0.9; E.cam.maxPitch = 0.5;
    var RD = reduced(); E.cam.autoRotate = true; E.cam.autoSpeed = 0.035; E.bindControls({});
    var progress = opt.progress == null ? 0 : U.clamp(opt.progress, 0, 1);
    var sealedInit = progress > 0;
    var flap = 1, sent = sealedInit ? 1 : 0, sealScale = sealedInit ? 1 : 0, openA = 0;
    var tFlap = 1, tSent = sealedInit ? 1 : 0, tSeal = sealedInit ? 1 : 0, tOpen = 0;
    function setProgress(p) { progress = U.clamp(p, 0, 1); }
    function seal() { tFlap = 1; tSent = 1; tSeal = 1; tOpen = 0; }
    function open() { tFlap = 0; tSeal = 0; tOpen = 1; }
    var W = 0.82, H = 0.56, T = 0.14;            // 信封有真实厚度，环视不再像两张纸
    var LIGHT = [0.45, 0.82, 0.55];
    function shade(base, k) { var p = String(base).split(',').map(Number); return p.map(function (c) { return Math.max(0, Math.min(255, Math.round(c * k))); }).join(','); }
    function vsub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
    function vcross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    function vnorm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
    function P(a) { return { x: a[0], y: a[1], z: a[2] }; }
    // 实心盒（6 面按法线受光，产生体积感）
    function box(cx, cy, cz, w, h, d, base, alpha) {
      var x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, z0 = cz - d / 2, z1 = cz + d / 2;
      var c = [P([x0, y0, z0]), P([x1, y0, z0]), P([x1, y1, z0]), P([x0, y1, z0]), P([x0, y0, z1]), P([x1, y0, z1]), P([x1, y1, z1]), P([x0, y1, z1])];
      var faces = [[c[0], c[1], c[2], c[3]], [c[4], c[5], c[6], c[7]], [c[0], c[1], c[5], c[4]], [c[3], c[2], c[6], c[7]], [c[0], c[3], c[7], c[4]], [c[1], c[2], c[6], c[5]]];
      var nrm = [[0, 0, -1], [0, 0, 1], [0, -1, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0]];
      for (var f = 0; f < 6; f++) {
        var n = nrm[f], dd = Math.max(0.28, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
        E.poly(faces[f], { color: shade(base, dd), fill: true, alpha: alpha == null ? 1 : alpha, stroke: 'rgba(96,84,62,.45)', lw: 1 });
      }
    }
    // 三角棱柱（封口盖，带厚度）
    function triPrism(A, B, C, thick, base) {
      var n = vnorm(vcross(vsub(B, A), vsub(C, A)));
      var A2 = [A[0] + n[0] * thick, A[1] + n[1] * thick, A[2] + n[2] * thick];
      var B2 = [B[0] + n[0] * thick, B[1] + n[1] * thick, B[2] + n[2] * thick];
      var C2 = [C[0] + n[0] * thick, C[1] + n[1] * thick, C[2] + n[2] * thick];
      var nd = Math.max(0.3, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      E.poly([P(A), P(B), P(C)], { color: shade(base, Math.max(0.4, nd)), fill: true, alpha: 1, stroke: 'rgba(110,98,72,.5)', lw: 1 });
      E.poly([P(A2), P(B2), P(C2)], { color: shade(base, Math.max(0.22, -nd * 0.8)), fill: true, alpha: 1 });
      E.poly([P(A), P(B), P(B2), P(A2)], { color: shade(base, 0.62), fill: true, alpha: 1 });
      E.poly([P(B), P(C), P(C2), P(B2)], { color: shade(base, 0.56), fill: true, alpha: 1 });
      E.poly([P(C), P(A), P(A2), P(C2)], { color: shade(base, 0.62), fill: true, alpha: 1 });
    }
    E.onFrame = function (dt, t) {
      flap = mix(flap, tFlap, 0.12); sent = mix(sent, tSent, 0.06); sealScale = mix(sealScale, tSeal, 0.10);
      openA = mix(openA, tOpen * (flap < 0.5 ? 1 : 0), 0.07);   // 盖先开、信纸随后升起
      var envY = 1.0 + sent * 0.28, envZ = -sent * 0.45;
      E.sky({ top: '#04090d', bottom: '#0a1620', glow: '120,200,210', starColor: '200,228,235' });
      // 时间环（到期进度）
      var segs = 64, lit = Math.round(segs * progress);
      for (var i = 0; i < segs; i++) {
        var a0 = i / segs * 6.2832 - 1.57, a1 = (i + 0.7) / segs * 6.2832 - 1.57, on = i < lit, r1 = 1.5, col = on ? '159,227,190' : '70,110,120';
        E.line([Math.cos(a0) * r1, envY, Math.sin(a0) * r1], [Math.cos(a1) * r1, envY, Math.sin(a1) * r1], { color: col, alpha: on ? 0.9 : 0.3, w: on ? 2.4 : 1.4, glow: on ? 6 : 0 });
      }
      // 信封主体（实心盒，有厚度）
      box(0, envY, envZ, W * 2, H * 2, T, '226,224,212', 1);
      var zf = envZ + T / 2 + 0.004;
      // 正面口袋缝线（装饰）
      E.poly([P([-W * 0.92, envY - H * 0.96, zf]), P([W * 0.92, envY - H * 0.96, zf]), P([0, envY + 0.02, zf])],
        { color: '210,206,190', fill: false, stroke: 'rgba(120,108,82,.35)', lw: 1 });
      // 封口盖（绕顶边翻开）
      var hinge = envY + H, th = (1 - flap) * 2.35;
      function rot(P) { var py = P[1] - hinge, pz = P[2] - zf; return [P[0], hinge + py * Math.cos(th) - pz * Math.sin(th), zf + py * Math.sin(th) + pz * Math.cos(th)]; }
      var FA = [-W, hinge, zf], FB = [W, hinge, zf], FC = [0, envY - H * 0.04, zf];
      triPrism(rot(FA), rot(FB), rot(FC), 0.035, '238,236,224');
      // 火漆封印（封口时贴在盖尖）
      if (sealScale > 0.02) {
        var sc = [0, envY - H * 0.04, zf];
        E.sphere(sc[0], sc[1], sc[2] + 0.06, 0.13 * sealScale, { color: '196,52,52', shade: '90,20,20', glow: true, glowR: 2.4, glowA: 0.2 * sealScale });
        E.sphere(sc[0], sc[1], sc[2] + 0.06, 0.05 * sealScale, { color: '240,120,120', glow: true, glowR: 2, glowA: 0.3 * sealScale });
      }
      // 信纸（开启时升起，实心薄片）
      if (openA > 0.02) {
        var ly = envY + H * 0.1 + openA * 0.95;
        box(0, ly, envZ, W * 0.82, H * 0.72, 0.05, '250,246,228', 1);
        if (openA > 0.5) E.glowAt(E.W / 2, E.H * 0.42, 70, '159,227,190', 0.10 * openA);
      }
    };
    E.start();
    return {
      engine: E, setProgress: setProgress, seal: seal, open: open,
      isOpen: function () { return openA > 0.5; },
      destroy: function () { E.destroy(); }
    };
  }

  /* ============================ 我的仪式 ============================ */
  var RIT_SCENE = {
    night: { sky: ['#05070f', '#0a1322'], star: '200,224,240', glow: '130,170,230', orb: '150,190,255' },
    dawn: { sky: ['#160d18', '#2a1622'], star: '240,210,225', glow: '255,170,200', orb: '255,190,210' },
    forest: { sky: ['#06120e', '#0e2018'], star: '190,230,210', glow: '120,210,160', orb: '150,230,180' },
    sea: { sky: ['#04101a', '#08202e'], star: '200,228,235', glow: '110,200,220', orb: '130,220,225' },
    ember: { sky: ['#1a0f06', '#281408'], star: '245,215,170', glow: '255,170,90', orb: '255,190,110' }
  };
  var RIT_SOUND = { calm: 7.5, focus: 5.0, deep: 9.5, light: 4.0 };
  function makeRitual(canvas, opt) {
    opt = opt || {};
    var E = global.QN3D.create(canvas, {});
    E.makeStars(200, 34, 5);
    E.cam.target = [0, 1.2, 0]; E.cam.yaw = 0.4; E.cam.pitch = -0.30; E.cam.dist = 8; E.cam.fov = 58;
    E.cam.minDist = 5; E.cam.maxDist = 16; E.cam.minPitch = -1.0; E.cam.maxPitch = 0.3;
    var RD = reduced(); E.cam.autoRotate = true; E.cam.autoSpeed = 0.045; E.bindControls({});
    var sceneKey = opt.scene || 'night', soundKey = opt.sound || 'calm';
    var playing = false, combo = 0;
    var CST = [
      [0, 2.0, 0], [0, 1.5, 0.05], [0, 1.0, 0],
      [-0.55, 1.45, 0.1], [0.55, 1.45, 0.1], [-0.9, 0.95, 0], [0.9, 0.95, 0],
      [-0.4, 0.55, 0.05], [0.4, 0.55, 0.05], [0, 0.35, 0]
    ];
    var CED = [[0, 1], [1, 2], [1, 3], [1, 4], [3, 5], [4, 6], [2, 7], [2, 8], [7, 9], [8, 9]];
    function setCombo(sc, so) { if (sc) sceneKey = sc; if (so) soundKey = so; }
    function play() { playing = true; } function stop() { playing = false; }
    E.onFrame = function (dt, t) {
      var S = RIT_SCENE[sceneKey] || RIT_SCENE.night;
      var period = RIT_SOUND[soundKey] || 6;
      var ph = (RD ? 0 : t * (6.2832 / period));
      var br = 0.5 + 0.5 * Math.sin(ph);
      if (playing) combo = mix(combo, 1, 0.05); else combo = mix(combo, 0, 0.03);
      E.sky({ top: S.sky[0], bottom: S.sky[1], glow: S.glow, starColor: S.star });
      E.poly(ringPts(2.3, 0.02, 48), { color: '14,22,30', fill: true, alpha: 1 });
      E.poly(ringPts(2.1, 0.06, 46), { color: '22,34,44', fill: true, alpha: 1 });
      for (var w = 0; w < 3; w++) { var rr = 0.7 + w * 0.6; E.poly(ringPts(rr, 0.07, 32), { color: S.glow, fill: false, stroke: 'rgba(' + S.glow + ',' + (0.12 - w * 0.03).toFixed(3) + ')', lw: 1 }); }
      for (var e = 0; e < CED.length; e++) { var a = CST[CED[e][0]], b = CST[CED[e][1]]; E.line([a[0], a[1], a[2]], [b[0], b[1], b[2]], { color: S.star, alpha: 0.5, w: 1.2 }); }
      for (var i = 0; i < CST.length; i++) {
        var p = CST[i]; var tw = 0.6 + 0.4 * Math.sin(t * 1.5 + i);
        E.sphere(p[0], p[1], p[2], 0.05 + 0.02 * tw, { color: S.star, glow: true, glowR: 3, glowA: 0.3 * tw });
      }
      var oy = 1.15 + br * 0.12;
      var R = 0.42 + br * 0.22 + combo * 0.06;
      E.sphere(0, oy, 0, R, { color: S.orb, shade: '30,40,70', alpha: 0.9, glow: true, glowR: 3.2 + br * 1.5, glowA: 0.2 + br * 0.35 + combo * 0.1 });
      E.sphere(0, oy, 0, R * 0.5, { color: '255,255,255', alpha: 0.5 + br * 0.3 });
    };
    E.start();
    return { engine: E, setCombo: setCombo, play: play, stop: stop, destroy: function () { E.destroy(); } };
  }

  /* ============================ 折纸冥想 ============================ */
  function makeFold(canvas, opt) {
    opt = opt || {};
    var E = global.QN3D.create(canvas, {});
    E.makeStars(160, 34, 17);
    E.cam.target = [0, 0.6, 0]; E.cam.yaw = 0.7; E.cam.pitch = -0.5; E.cam.dist = 6; E.cam.fov = 56;
    E.cam.minDist = 4; E.cam.maxDist = 12; E.cam.minPitch = -1.2; E.cam.maxPitch = 0.1;
    var RD = reduced(); E.cam.autoRotate = false; E.cam.autoSpeed = 0.05; E.bindControls({});
    var step = opt.step || 0, breath = 0;
    var H = 0.95;
    var corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    function setStep(n) { step = U.clamp(n, 0, 6); }
    function next() { setStep(step + 1); } function prev() { setStep(step - 1); }
    E.onFrame = function (dt, t) {
      breath = 0.5 + 0.5 * Math.sin((RD ? 0 : t) * (6.2832 / 7.2));
      var prog = step / 6, theta = prog * (Math.PI / 2);
      E.sky({ top: '#0a0d12', bottom: '#131a1e', glow: '159,227,190', starColor: '200,224,230' });
      var R0 = 0.5 + breath * 0.18;
      E.sphere(0, 0.9 + breath * 0.1, -0.2, R0, { color: '159,227,190', shade: '30,60,52', alpha: 0.5, glow: true, glowR: 3 + breath, glowA: 0.12 + breath * 0.12 });
      var base = []; for (var i = 0; i < 4; i++) base.push({ x: corners[i][0], y: 0.02, z: corners[i][1] });
      E.poly(base, { color: '210,224,230', fill: true, alpha: 0.92, stroke: 'rgba(159,227,190,.5)', lw: 1 });
      var done = prog >= 0.999;
      for (var e = 0; e < 4; e++) {
        var A = corners[e], B = corners[(e + 1) % 4];
        var mx = (A[0] + B[0]) / 2, mz = (A[1] + B[1]) / 2;
        var il = Math.hypot(mx, mz) || 1, ix = -mx / il, iz = -mz / il;
        var off = [ix * (H * Math.cos(theta)), H * Math.sin(theta), iz * (H * Math.cos(theta))];
        var A2 = { x: A[0] + off[0], y: 0.02 + off[1], z: A[1] + off[2] };
        var B2 = { x: B[0] + off[0], y: 0.02 + off[1], z: B[1] + off[2] };
        var col = done ? '236,240,210' : (e % 2 ? '200,220,228' : '214,228,234');
        E.poly([{ x: A[0], y: 0.02, z: A[1] }, { x: B[0], y: 0.02, z: B[1] }, B2, A2],
          { color: col, fill: true, alpha: 0.9, stroke: done ? 'rgba(255,220,140,.8)' : 'rgba(159,227,190,.45)', lw: 1, glow: done, glowR: 1.8, glowA: done ? 0.15 : 0 });
      }
      if (done) E.glowAt(E.W / 2, E.H / 2, 90, '255,220,140', 0.10 + breath * 0.06);
    };
    E.start();
    return { engine: E, setStep: setStep, next: next, prev: prev, step: function () { return step; }, destroy: function () { E.destroy(); } };
  }

  global.QNModules = { makeGarden: makeGarden, makeStone: makeStone, makeGrowth: makeGrowth, makeCapsule: makeCapsule, makeRitual: makeRitual, makeFold: makeFold };
  global.QNModules._SEASON = SEASON;
  global.QNModules._growth = { GROWTH_MAX: GROWTH_MAX, SPECIES: GR_SPECIES, SEASON_NAME: GR_SEASON_NAME, STAGES: GR_STAGES, stageOf: grStageOf, seasonNowIdx: grSeasonIdx, seasonKey: grSeasonKey, treeInner: grTreeInner };
  global.QNModules._RIT = { scene: RIT_SCENE, sound: RIT_SOUND };
})(typeof window !== 'undefined' ? window : this);
