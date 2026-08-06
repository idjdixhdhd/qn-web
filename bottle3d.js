/* ============================================================================
 * bottle3d.js — 漂流瓶 · 贴海面的 3D 偶遇（本地 Three.js）
 * ---------------------------------------------------------------------------
 * 与「微光星穹」的本质区别：
 *   微光 = 抬头看「全部」的光，远、静、只可仰望。
 *   漂流瓶 = 低头捡「一只」瓶，近、动、亲手拿到手里。
 *
 * 这里刻意做成：
 *   · 视角贴着海面（人蹲在岸边的高度），不是俯瞰
 *   · 每只瓶 = 海面上一个发光的浮标（玻璃瓶 + 暖光晕），远看也是一颗星点
 *   · 新扔出 / 别处同步来的瓶：先在眼前近处轻轻落水（看得见、捡得到）
 *   · 之后缓缓漂远，结成自己的漂流轨迹——这就是「偶遇」
 *   · 捡起 = 瓶子被拿到眼前 → 木塞拔开 → 纸卷升起展开 → 才读到那句话
 *   · 扔出 = 抛物线入水 → 涟漪散开 → 汇入漂流
 *
 * window.startBottles(container, opts) -> { stop, refresh, addBottle, pickRandom }
 *   opts.getPosts()   -> 全部瓶子帖
 *   opts.getView()    -> 'all' | 'mine'
 *   opts.onPick(post) -> 瓶子在眼前打开时回调（用于显示文字）
 *   opts.onNotice(msg)-> 想提示用户时回调（如「它还在远处」）
 * ========================================================================== */
import * as THREE from "./vendor/three.module.js";

const MAX_VISIBLE = 20;        // 同时在海上的瓶子上限（弱机也能跑动）
const REACH = 6.2;             // 手能够到的距离
const BORN_T = 14;             // 新生瓶在近处停留的秒数
const BLEND = 4;               // 之后渐入漂流轨迹的过渡秒数

function hash(str) {
  str = String(str == null ? "" : str);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function noteColor(post) {
  const palette = ["#FFF3D6", "#FFE9C9", "#F3F7E8", "#FFEFE0", "#EAF6EC", "#FFF7E2"];
  return palette[hash(post.author || post.text || "x") % palette.length];
}
/* 纸笺贴图：把留言画到一张 cream 纸上，3D 展开时直接能读 */
function makePaperTexture(post) {
  const W = 512, H = 384;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  // 做旧纸底：中心亮、四角压暗（岁月感）
  const base = g.createRadialGradient(W/2, H/2, 30, W/2, H/2, W*0.62);
  base.addColorStop(0, "#F6EFDC");
  base.addColorStop(0.68, "#EBDBBE");
  base.addColorStop(1, "#D9C7A0");
  g.fillStyle = base; g.fillRect(0, 0, W, H);
  // 几处淡旧渍（基于内容固定，不每帧乱跳）
  const h = hash(post.id || post.text || "x");
  for (let i = 0; i < 5; i++) {
    const sx = ((h >> (i*3)) % 100) / 100 * W;
    const sy = ((h >> (i*3+2)) % 100) / 100 * H;
    const r = 16 + ((h >> (i*3+5)) % 28);
    const st = g.createRadialGradient(sx, sy, 0, sx, sy, r);
    st.addColorStop(0, "rgba(120,90,50,0.10)");
    st.addColorStop(1, "rgba(120,90,50,0)");
    g.fillStyle = st; g.beginPath(); g.arc(sx, sy, r, 0, 6.29); g.fill();
  }
  // 旧折痕
  g.strokeStyle = "rgba(120,90,50,0.10)"; g.lineWidth = 1;
  g.beginPath(); g.moveTo(0, H*0.5); g.lineTo(W, H*0.5); g.stroke();
  // 顶部蜡封色带
  g.fillStyle = noteColor(post); g.fillRect(0, 0, W, 8);
  // 装饰引号
  g.font = 'bold 60px "Noto Serif SC", serif';
  g.fillStyle = "rgba(159,227,190,0.45)";
  g.fillText("”", 28, 78);
  // 留言正文（自动折行）
  g.font = '26px "Noto Serif SC", serif';
  g.fillStyle = "#3A3326";
  g.textAlign = "left";
  const text = (post.text || "").replace(/\s+/g, " ");
  const maxW = W - 56;
  const lineH = 38;
  let y = 126, line = "";
  for (let i = 0; i < text.length; i++) {
    const test = line + text[i];
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, 28, y);
      line = text[i];
      y += lineH;
    } else {
      line = test;
    }
  }
  g.fillText(line, 28, y);
  // 署名
  g.font = '18px "Noto Sans SC", sans-serif';
  g.fillStyle = "#6B665A";
  g.textAlign = "right";
  const author = post.author || "某位过客";
  g.fillText("—— " + author, W - 28, H - 70);
  // 时间
  g.font = '14px "Noto Sans SC", sans-serif';
  g.fillStyle = "#8A8576";
  const dateStr = post.at ? post.at.split(" ")[0] : new Date().toLocaleDateString("zh-CN");
  g.fillText(dateStr + (post.seed ? " · 来自远方" : " · 漂到这里"), W - 28, H - 44);
  // 做旧暗角
  const vg = g.createRadialGradient(W/2, H/2, W*0.3, W/2, H/2, W*0.72);
  vg.addColorStop(0, "rgba(60,40,20,0)");
  vg.addColorStop(1, "rgba(60,40,20,0.22)");
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
/* 发光晕贴图：让每只瓶在海上都是一颗可辨的暖光点 */
function makeGlowTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(206,255,238,1)");
  grd.addColorStop(0.28, "rgba(165,240,210,0.7)");
  grd.addColorStop(1, "rgba(165,240,210,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const GLOW_TEX = makeGlowTexture();

window.startBottles = function (container, opts) {
  opts = opts || {};
  const getPosts = opts.getPosts || function () { return []; };
  const getView = opts.getView || function () { return "all"; };
  const onPick = opts.onPick || function () {};
  const notice = opts.onNotice || function () {};

  const W = container.clientWidth || 360, H = container.clientHeight || 320;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.zIndex = "1";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // 雾要很淡：之前 0.020 把天和海糊成同一块深蓝，看起来就「什么都没有」
  scene.fog = new THREE.FogExp2(0x0b2028, 0.0085);
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 400);
  camera.position.set(0, 1.18, 0);            // 贴海面：蹲在岸边的高度

  /* 月亮的方向（天与海共用它，才会有一条对得上的月光路） */
  const MOON_DIR = new THREE.Vector3(0.06, 0.20, -1).normalize();
  /* 太阳方向（白天版本用） */
  const SUN_DIR = new THREE.Vector3(0.35, 0.5, -1).normalize();

  /* ---------- 天光 ---------- */
  const hemi = new THREE.HemisphereLight(0x9fc4d8, 0x08202a, 0.75);
  scene.add(hemi);
  // 月光/日光：低角度、强反射 —— 这就是海面上那条粼粼的光路
  const moonLight = new THREE.DirectionalLight(0xe8f4ff, 2.6);
  moonLight.position.copy(MOON_DIR).multiplyScalar(60);
  scene.add(moonLight);
  const amb = new THREE.AmbientLight(0x1b3a46, 0.5);
  scene.add(amb);

  /* ---------- 昼夜两套配色（UI 切换） ---------- */
  let btTime = "night";
  const TIME = {
    night: {
      sky: { top: 0x060d1a, mid: 0x123143, bot: 0x081a22, warm: 0x5e7f7a },
      disk: { dir: MOON_DIR, color: 0xfff6e0, glow: 0x9fc0d8, star: 1.0 },
      moon: { color: 0xe8f4ff, intensity: 2.6 },
      hemi: { sky: 0x9fc4d8, ground: 0x08202a, intensity: 0.75 },
      amb: { color: 0x1b3a46, intensity: 0.5 },
      fog: 0x0b2028,
      water: { color: 0x0b2c36, rough: 0.18, metal: 0.62 }
    },
    day: {
      sky: { top: 0x2f6f9e, mid: 0x8fc4dd, bot: 0xcfe6ef, warm: 0xbfe0e0 },
      disk: { dir: SUN_DIR, color: 0xfff4d8, glow: 0xffe6b0, star: 0.10 },
      moon: { color: 0xfff2d6, intensity: 3.3 },   // 白天时这盏方向光即「太阳」
      hemi: { sky: 0xbfe0f0, ground: 0x29483a, intensity: 0.95 },
      amb: { color: 0x6f8aa0, intensity: 0.7 },
      fog: 0x9fc3d4,
      water: { color: 0x1d5566, rough: 0.22, metal: 0.55 }
    }
  };
  function applyTime() {
    const T = TIME[btTime];
    skyMat.uniforms.top.value.setHex(T.sky.top);
    skyMat.uniforms.mid.value.setHex(T.sky.mid);
    skyMat.uniforms.bot.value.setHex(T.sky.bot);
    skyMat.uniforms.warm.value.setHex(T.sky.warm);
    skyMat.uniforms.uDiskDir.value.copy(T.disk.dir);
    skyMat.uniforms.uDiskColor.value.setHex(T.disk.color);
    skyMat.uniforms.uDiskGlow.value.setHex(T.disk.glow);
    skyMat.uniforms.uStar.value = T.disk.star;
    moonLight.color.setHex(T.moon.color); moonLight.intensity = T.moon.intensity;
    moonLight.position.copy(T.disk.dir).multiplyScalar(60);
    hemi.color.setHex(T.hemi.sky); hemi.groundColor.setHex(T.hemi.ground); hemi.intensity = T.hemi.intensity;
    amb.color.setHex(T.amb.color); amb.intensity = T.amb.intensity;
    scene.fog.color.setHex(T.fog);
    waterMat.color.setHex(T.water.color); waterMat.roughness = T.water.rough; waterMat.metalness = T.water.metal;
  }

  /* 天空穹顶：昼/夜共用一套着色器，靠 uniform 切换 */
  const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new THREE.Color(0x060d1a) },
        mid: { value: new THREE.Color(0x123143) },
        bot: { value: new THREE.Color(0x081a22) },
        warm: { value: new THREE.Color(0x5e7f7a) },
        uDiskDir: { value: MOON_DIR.clone() },
        uDiskColor: { value: new THREE.Color(0xfff6e0) },
        uDiskGlow: { value: new THREE.Color(0x9fc0d8) },
        uStar: { value: 1.0 }
      },
      vertexShader: "varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader:
        "varying vec3 vP; uniform vec3 top; uniform vec3 mid; uniform vec3 bot; uniform vec3 warm; uniform vec3 uDiskDir; uniform vec3 uDiskColor; uniform vec3 uDiskGlow; uniform float uStar;" +
        "float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }" +
        "void main(){ vec3 n = normalize(vP); float h = n.y;" +
        "vec3 c = h>0.0 ? mix(mid, top, pow(h,0.48)) : mix(mid, bot, pow(-h,0.5));" +
        // 地平线暖光带：给天海之间一条清楚的分界，画面立刻「有东西」
        "c += warm * exp(-abs(h)*11.0) * 0.55;" +
        // 月晕 + 月盘
        "float md = max(0.0, dot(n, normalize(uDiskDir)));" +
        "c += uDiskGlow * pow(md, 18.0) * 0.9;" +
        "c += uDiskColor * smoothstep(0.9986, 0.9995, md) * 2.6;" +
        // 高空星点
        "vec2 g = floor(n.xz * 190.0);" +
        "float s = step(0.9965, h21(g)) * smoothstep(0.02, 0.5, h) * uStar;" +
        "c += vec3(0.85,0.93,0.95) * s;" +
        "gl_FragColor = vec4(c,1.0); }"
    });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 20), skyMat);
  scene.add(sky);

  /* ---------- 海面 ---------- */
  const SEG = 72;                                   // 老机器也扛得住的网格密度
  const waterGeo = new THREE.PlaneGeometry(220, 220, SEG, SEG);
  waterGeo.rotateX(-Math.PI / 2);
  // 更暗更亮的对比：海本身压暗，靠月光的高光把波纹「打」出来
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0b2c36, roughness: 0.18, metalness: 0.62
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  scene.add(water);
  const basePos = waterGeo.attributes.position.array.slice();

  /* 月光路：从地平线一直铺到脚边的一条亮带。
     这是「让这片海一眼看上去是有画面的」最关键的一笔。 */
  (function moonPath() {
    const c = document.createElement("canvas");
    c.width = 64; c.height = 256;
    const g = c.getContext("2d");
    const grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0.00, "rgba(232,244,255,0.00)");
    grd.addColorStop(0.14, "rgba(226,242,255,0.55)");
    grd.addColorStop(0.45, "rgba(198,230,245,0.26)");
    grd.addColorStop(1.00, "rgba(170,215,235,0.00)");
    g.fillStyle = grd; g.fillRect(0, 0, 64, 256);
    // 左右羽化，让光路边缘自然散开
    const side = g.createLinearGradient(0, 0, 64, 0);
    side.addColorStop(0, "rgba(0,0,0,1)");
    side.addColorStop(0.5, "rgba(0,0,0,0)");
    side.addColorStop(1, "rgba(0,0,0,1)");
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = side; g.fillRect(0, 0, 64, 256);

    const tex = new THREE.CanvasTexture(c);
    const geo = new THREE.PlaneGeometry(26, 150);
    geo.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false
    }));
    // 铺向月亮所在的方向
    m.position.set(MOON_DIR.x * 70, 0.10, MOON_DIR.z * 70);
    m.rotation.y = Math.atan2(MOON_DIR.x, MOON_DIR.z);
    scene.add(m);
  })();

  /* 浪：振幅比之前大，月光才「打」得出粼粼的反光 */
  function waveAt(x, z, t) {
    return Math.sin(x * 0.36 + t * 0.9) * 0.30
      + Math.cos(z * 0.31 + t * 0.72) * 0.24
      + Math.sin((x + z) * 0.19 + t * 1.25) * 0.14
      + Math.sin((x - z) * 0.72 + t * 1.9) * 0.06;
  }
  /* 波面法线：让瓶子随波面倾斜，更像真的浮在水上 */
  const _n = new THREE.Vector3();
  function waveNormal(x, z, t) {
    const s = 0.12;
    const h0 = waveAt(x, z, t);
    const hx = waveAt(x + s, z, t);
    const hz = waveAt(x, z + s, t);
    return _n.set(h0 - hx, s, h0 - hz).normalize();
  }

  /* ---------- 涟漪 ---------- */
  const ripples = [];
  function addRipple(x, z) {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.24, 36),
      new THREE.MeshBasicMaterial({ color: 0xd8f2e6, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.06, z);
    scene.add(m);
    ripples.push({ mesh: m, t: 0 });
  }

  /* ---------- 瓶子 ---------- */
  function makeBottle(post) {
    const g = new THREE.Group();
    const profile = [
      new THREE.Vector2(0.001, 0), new THREE.Vector2(0.28, 0.02), new THREE.Vector2(0.32, 0.10),
      new THREE.Vector2(0.32, 0.80), new THREE.Vector2(0.26, 0.96), new THREE.Vector2(0.12, 1.14),
      new THREE.Vector2(0.12, 1.46), new THREE.Vector2(0.16, 1.52), new THREE.Vector2(0.16, 1.58),
      new THREE.Vector2(0.001, 1.58)
    ];
    // 玻璃：刻意不用 MeshPhysicalMaterial 的 transmission —— 折射需要 WebGL2 浮点
    // 渲染目标，在老集显（如 Radeon HD 74xx）上会整块静默渲染失败，画面就全黑了。
    // 这里用普通标准材质 + 自发光模拟通透感，任何机器都画得出来。
    const glass = new THREE.MeshStandardMaterial({
      color: 0x9fdcc6, transparent: true, opacity: 0.72,
      roughness: 0.16, metalness: 0.10,
      emissive: 0x2e6f5c, emissiveIntensity: 0.45,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 30), glass);
    g.add(body);

    // 木塞：捡起后会被拔开
    const cork = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.155, 0.2, 18),
      new THREE.MeshStandardMaterial({ color: 0x9a7448, roughness: 0.92 })
    );
    cork.position.y = 1.6;
    g.add(cork);

    // 卷起的纸：捡起后升起展开
    const paperMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(noteColor(post)), roughness: 0.94, side: THREE.DoubleSide,
      emissive: new THREE.Color(noteColor(post)), emissiveIntensity: 0.18
    });
    const rolled = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.42, 12), paperMat);
    rolled.rotation.z = Math.PI / 2 * 0.92;
    rolled.position.set(0, 0.42, 0);
    g.add(rolled);

    const paperTex = makePaperTexture(post);
    const sheetMat = new THREE.MeshStandardMaterial({
      map: paperTex, roughness: 0.92, metalness: 0.0, side: THREE.DoubleSide,
      transparent: true, opacity: 0.98
    });
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.44), sheetMat);
    sheet.position.set(0, 2.15, 0);
    sheet.scale.set(0.01, 0.01, 0.01);
    sheet.visible = false;
    g.add(sheet);

    // 暖光晕：让瓶在海上是一颗可辨的光点（解决「海里什么都没有」）
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: GLOW_TEX, color: 0xc6fff0, transparent: true, opacity: 0.95,
      depthWrite: false, blending: THREE.AdditiveBlending
    }));
    glow.scale.setScalar(1.7);
    glow.position.y = 0.5;
    g.add(glow);

    g.userData.cork = cork;
    g.userData.rolled = rolled;
    g.userData.sheet = sheet;
    g.userData.glow = glow;
    g.userData.post = post;
    g.scale.setScalar(0.82);
    return g;
  }

  /* 漂流轨迹：每只瓶由远及近，各有周期 */
  function driftOf(post) {
    const h = hash(post.id || Math.random());
    return {
      ang: (h % 1000) / 1000 * Math.PI * 2,
      period: 52 + (h >> 7) % 46,
      offset: ((h >> 13) % 1000) / 1000,
      lateral: (((h >> 19) % 200) / 100 - 1) * 3.4
    };
  }

  const bottles = new Map();     // id -> {group, post, drift, bornAt, bornPhase}
  let held = null;
  const throwing = [];

  function spawn(post) {
    let rec = bottles.get(post.id);
    if (rec) { rec.post = post; return rec; }
    const g = makeBottle(post);
    const d = driftOf(post);
    scene.add(g);
    rec = {
      group: g, post: post, drift: d,
      bornAt: clock,
      bornPhase: (hash(post.id + "b") % 1000) / 1000 * Math.PI * 2
    };
    bottles.set(post.id, rec);
    return rec;
  }

  function refresh(shuffle) {
    const view = getView();
    let all = (getPosts() || []).filter(function (p) {
      return view === "mine" ? p.authorId === uid() : true;
    });
    if (all.length > MAX_VISIBLE) {
      if (shuffle) {
        const start = Math.floor(Math.random() * Math.max(1, all.length - MAX_VISIBLE + 1));
        all = all.slice(start, start + MAX_VISIBLE);
      } else {
        all = all.slice(-MAX_VISIBLE);
      }
    }

    const ids = new Set(all.map(function (p) { return p.id; }));
    bottles.forEach(function (v, id) {
      if (!ids.has(id)) {
        if (held && held.post && held.post.id === id) return;
        scene.remove(v.group); bottles.delete(id);
      }
    });
    all.forEach(function (p) { spawn(p); });
    return all.length;
  }

  /* 漂流轨迹位置（由远及近） */
  const _v = new THREE.Vector3();
  function driftPos(d, t, out) {
    const k = ((t / d.period) + d.offset) % 1;
    const dist = 26 - k * 24;
    const x = Math.cos(d.ang) * dist * 0.55 + d.lateral * (1 - k * 0.5);
    const z = -Math.abs(Math.sin(d.ang)) * dist - dist * 0.35;
    return out.set(x, 0, z);
  }

  /* 新生瓶：在眼前近处轻轻落水，看得见也捡得到 */
  function addBottle(post) {
    const rec = spawn(post);
    const a = rec.bornPhase, d = 3.4;
    const nx = Math.cos(a) * d * 0.5, nz = -Math.abs(Math.sin(a)) * d - 1.4;
    rec.group.position.set(nx, 0.12, nz);
    addRipple(nx, nz);
  }

  function take(rec) {
    if (held) release();
    held = { group: rec.group, post: rec.post, t: 0, phase: "in" };
  }
  function release() {
    if (!held) return;
    const g = held.group;
    g.userData.sheet.visible = false;
    g.userData.sheet.scale.set(0.01, 0.01, 0.01);
    g.userData.cork.position.y = 1.6;
    g.userData.cork.rotation.z = 0;
    g.userData.rolled.visible = true;
    held = null;
  }

  function pickRandom() {
    const near = [];
    bottles.forEach(function (v) {
      if (held && held.post.id === v.post.id) return;
      if (v.group.position.length() < REACH + 1.5) near.push(v);
    });
    if (!near.length) {
      notice("这会儿手边没有瓶子，等一只漂过来");
      return null;
    }
    const pick = near[Math.floor(Math.random() * near.length)];
    take(pick);
    onPick(pick.post);
    return pick.post;
  }

  /* ---------- 交互 ---------- */
  let dragging = false, moved = false, lx = 0, ly = 0, dx0 = 0, dy0 = 0;
  let azim = 0, elev = 0;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const el = renderer.domElement;

  el.addEventListener("pointerdown", function (e) {
    dragging = true; moved = false; lx = dx0 = e.clientX; ly = dy0 = e.clientY;
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    const dx = e.clientX - lx, dy = e.clientY - ly;
    if (Math.abs(e.clientX - dx0) + Math.abs(e.clientY - dy0) > 6) moved = true;
    azim -= dx * 0.004;
    elev = Math.max(-0.16, Math.min(0.34, elev + dy * 0.0026));
    lx = e.clientX; ly = e.clientY;
  });
  el.addEventListener("pointerup", function (e) {
    dragging = false;
    if (moved) return;
    if (held) { release(); return; }
    const r = el.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    const meshes = [];
    bottles.forEach(function (v) { v.group.traverse(function (o) { if (o.isMesh) meshes.push(o); }); });
    const hits = ray.intersectObjects(meshes, false);
    if (!hits.length) return;
    let grp = hits[0].object; while (grp && !grp.userData.post) grp = grp.parent;
    if (!grp) return;
    const rec = bottles.get(grp.userData.post.id);
    if (!rec) return;
    if (rec.group.position.length() > REACH) {
      notice("它还在远处，等它漂近一点");
      return;
    }
    take(rec);
    onPick(rec.post);
  });

  const ro = new ResizeObserver(function () {
    const w = container.clientWidth || W, h = container.clientHeight || H;
    if (!w || !h) return;
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
  });
  ro.observe(container);

  /* ---------- 主循环 ---------- */
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0, alive = true, t0 = performance.now(), last = t0, clock = 0;
  const tmp = new THREE.Vector3();

  /* 帧循环护栏：任何一帧抛异常都不能打断 requestAnimationFrame 链。
     之前「有海却什么都不动、画布全空」正是因为某帧抛错后循环直接死了。 */
  let frameErrs = 0;
  function frame(now) {
    if (!alive) return;
    try { frameBody(now); }
    catch (err) {
      frameErrs++;
      if (frameErrs === 1) { try { console.error("[bottle3d] frame error:", err); } catch (e) {} }
      if (frameErrs === 12) notice("这台设备的 3D 有点吃力，画面已简化");
    }
    raf = requestAnimationFrame(frame);
  }

  function frameBody(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    clock = (now - t0) / 1000;
    const t = reduce ? 0 : clock;

    const pos = waterGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.array[i * 3 + 1] = waveAt(basePos[i * 3], basePos[i * 3 + 2], t);
    }
    pos.needsUpdate = true;
    waterGeo.computeVertexNormals();

    bottles.forEach(function (v) {
      if (held && held.post.id === v.post.id) return;
      if (throwing.some(function (x) { return x.rec === v; })) return;
      const age = clock - v.bornAt;
      let p, near;
      if (age >= 0 && age < BORN_T + BLEND) {
        // 新生：眼前近处缓缓冲岸，再渐入漂流
        const k = Math.max(0, Math.min(1, age / BORN_T));
        const d = 3.0 + k * 1.8;
        const a = v.bornPhase;
        const nx = Math.cos(a) * d * 0.5, nz = -Math.abs(Math.sin(a)) * d - 1.2;
        const np = new THREE.Vector3(nx, waveAt(nx, nz, t) - 0.06, nz);
        if (age < BORN_T) { p = np; near = true; }
        else {
          const dr = driftPos(v.drift, t, _v.clone());
          p = np.lerp(dr, (age - BORN_T) / BLEND); near = ((age - BORN_T) / BLEND) < 0.5;
        }
      } else {
        driftPos(v.drift, t, tmp);
        p = tmp.clone(); near = tmp.length() < REACH;
      }
      v.group.position.copy(p);
      // 物理浮漂：底座贴住波面，再加上轻微晃动
      const n = waveNormal(p.x, p.z, t);
      const rock = Math.sin(t * 1.1 + v.bornPhase * 6.28);
      v.group.rotation.x = Math.atan2(n.z, n.y) + Math.cos(t * 0.9 + v.bornPhase * 6.28) * 0.08;
      v.group.rotation.z = -Math.atan2(n.x, n.y) + rock * 0.12;
      v.group.rotation.y += 0.0016;
      v.group.userData.rolled.material.emissiveIntensity = near ? 0.5 : 0.14;
      if (v.group.userData.glow) v.group.userData.glow.material.opacity = near ? 0.98 : 0.5;
    });

    // 扔出的抛物线（保留接口，落水即有涟漪）
    for (let i = throwing.length - 1; i >= 0; i--) {
      const tw = throwing[i];
      tw.t += dt / 1.35;
      const k = Math.min(1, tw.t);
      const e = 1 - Math.pow(1 - k, 2);
      tw.rec.group.position.lerpVectors(tw.from, tw.to, e);
      tw.rec.group.position.y = tw.from.y * (1 - e) + Math.sin(k * Math.PI) * 1.5 + waveAt(tw.to.x, tw.to.z, t) * e;
      tw.rec.group.rotation.z += 0.06;
      if (k >= 1) { addRipple(tw.to.x, tw.to.z); throwing.splice(i, 1); }
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.t += dt / 2.2;
      const s = 1 + rp.t * 7;
      rp.mesh.scale.set(s, s, s);
      rp.mesh.material.opacity = Math.max(0, 0.7 * (1 - rp.t));
      rp.mesh.position.y = 0.06 + waveAt(rp.mesh.position.x, rp.mesh.position.z, t);
      if (rp.t >= 1) { scene.remove(rp.mesh); ripples.splice(i, 1); }
    }

    if (held) {
      held.t = Math.min(1, held.t + dt / 1.1);
      const g = held.group;
      const fwd = tmp.copy(camera.position).add(new THREE.Vector3(0, -0.1, -1));
      const dest = fwd.multiplyScalar(0).add(camera.position).add(new THREE.Vector3(0, -0.55, -2.4));
      g.position.lerp(dest, 0.12);
      g.rotation.x += (0 - g.rotation.x) * 0.12;
      g.rotation.z += (-0.28 - g.rotation.z) * 0.12;
      g.rotation.y += (Math.PI * 0.12 - g.rotation.y) * 0.06;

      const k = held.t;
      if (k > 0.35) {
        const kk = Math.min(1, (k - 0.35) / 0.25);
        g.userData.cork.position.y = 1.6 + kk * 0.5;
        g.userData.cork.rotation.z = kk * 0.6;
      }
      if (k > 0.58) {
        const kk = Math.min(1, (k - 0.58) / 0.42);
        // 软木塞缓缓拔出
        g.userData.cork.position.y = 1.6 + kk * 0.5;
        g.userData.cork.rotation.z = kk * 0.6;
        // 卷起的小纸筒随展开收细（像从筒里抽出）
        const rolled = g.userData.rolled;
        rolled.visible = kk < 0.9;
        rolled.scale.y = 1 - kk * 0.92;
        // 纸笺：横向卷轴展开（宽从 0 长到满，带轻微卷曲后归正）
        const sh = g.userData.sheet;
        sh.visible = true;
        const open = Math.sin(kk * Math.PI * 0.5);
        sh.position.y = 1.5 + kk * 0.75;
        sh.scale.set(0.04 + open * 1.02, 0.05 + kk * 0.99, 1);
        sh.rotation.y = Math.PI + (1 - kk) * 1.0;
        sh.rotation.z = Math.sin(kk * Math.PI) * 0.07 * (1 - kk);
      }
    }

    const dist = 0.001;
    const target = new THREE.Vector3(Math.sin(azim) * -12.5, 0.5 + elev * 5, Math.cos(azim) * -12.5);
    camera.position.y = 1.15 + Math.sin(t * 0.5) * 0.05 + dist;
    camera.lookAt(target);

    renderer.render(scene, camera);
  }

  applyTime();
  refresh();
  raf = requestAnimationFrame(frame);

  return {
    stop: function () {
      alive = false; cancelAnimationFrame(raf);
      try { ro.disconnect(); } catch (e) {}
      try { renderer.dispose(); } catch (e) {}
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    },
    refresh: refresh,
    addBottle: addBottle,
    pickRandom: pickRandom,
    release: release,
    setTime: function (mode) { if (TIME[mode]) { btTime = mode; applyTime(); } }
  };
};
