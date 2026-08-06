<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no">
<!-- Umami 全站统计（站长模式看板入口） -->
<script defer src="https://cloud.umami.is/script.js" data-website-id="debce0ab-aea3-454a-bbca-e7d1df38ea26"></script>
<script>
  function uTrack(e,d){ try{ if(window.umami && window.umami.track){ window.umami.track(e, d||{}); } }catch(_){} }
</script>
<title>自然之境·Quiet Nature</title>
<meta property="og:title" content="自然之境·Quiet Nature">
<meta property="og:site_name" content="自然之境·Quiet Nature">
<meta property="og:description" content="一个安静的自然主题心灵栖息地。">
<meta property="og:type" content="website">
<link rel="manifest" href="manifest.json">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#0A0F0D">
<meta name="theme-color" content="#0A0F0D">
<link rel="apple-touch-icon" href="icon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;600;700&family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
<!-- 提前预载 Three.js 引擎（漂流瓶/海滩 3D 依赖，约 1.3MB）。页面一打开就开始下载，
     等用户走到「漂流瓶」板块时基本已就绪，彻底解决「海面引擎未能加载」的加载竞态。 -->
<link rel="modulepreload" href="./vendor/three.module.js">
<style>
:root{
  --bg:#0A0F0D; --glass:rgba(255,255,255,.10); --glass-border:rgba(255,255,255,.14);
  --ui:#EAF1EC; --muted:#9DB0A6; --accent:#9FE3BE;
  --accent-rgb:159,227,190;
  --safe-t:env(safe-area-inset-top,0px); --safe-b:env(safe-area-inset-bottom,0px);
  --safe-l:env(safe-area-inset-left,0px); --safe-r:env(safe-area-inset-right,0px);
  --radius:18px;
}
[data-mood="ember"]{--accent:#FFB877;--accent-rgb:255,184,119;}
[data-mood="night"]{--accent:#A9BCFF;--accent-rgb:169,188,255;}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{margin:0;padding:0;height:100%;background:var(--bg);color:var(--ui);
  font-family:"Noto Sans SC","Inter",system-ui,sans-serif;overflow:hidden;}
/* 极淡环境光，随心境换色，让整屏不再死黑 */
body::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(130% 90% at 50% -10%, rgba(var(--accent-rgb),.12), transparent 50%),
    radial-gradient(120% 80% at 50% 112%, rgba(var(--accent-rgb),.07), transparent 55%);
  transition:background .8s ease;}
button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.serif{font-family:"Noto Serif SC",serif;}
.en{font-family:"Cormorant Garamond",serif;letter-spacing:.12em;}

/* ===== App shell ===== */
#app{position:fixed;inset:0;display:flex;flex-direction:column;z-index:1;}
#topbar{display:flex;align-items:center;justify-content:space-between;
  padding:calc(12px + var(--safe-t)) max(18px,var(--safe-l)) 12px max(18px,var(--safe-r));}
.brand{display:flex;flex-direction:column;}
.brand .t{font-size:20px;font-weight:600;letter-spacing:.08em;}
.brand .e{font-size:11px;color:var(--muted);letter-spacing:.34em;}
.moodbtn{width:44px;height:44px;border-radius:22px;background:var(--glass);
  border:1px solid var(--glass-border);color:var(--accent);font-size:18px;font-weight:600;}

#screen{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;
  padding:8px max(18px,var(--safe-l)) calc(96px + var(--safe-b)) max(18px,var(--safe-r));}

/* ===== Menu（替代底部 tab 栏） ===== */
.brand{cursor:pointer;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;touch-action:manipulation;}
#menu{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;
  background:rgba(6,10,8,.6);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .35s;}
#menu.show{opacity:1;pointer-events:auto;}
#menu .panel{width:min(82vw,360px);background:rgba(18,32,26,.92);border:1px solid var(--glass-border);
  border-radius:24px;padding:30px 26px 22px;text-align:center;
  transform:translateY(14px) scale(.98);transition:transform .4s cubic-bezier(.2,.8,.2,1);
  box-shadow:0 30px 80px -30px rgba(0,0,0,.8);}
#menu.show .panel{transform:none;}
#menu .mb{font-family:"Noto Serif SC",serif;font-size:26px;font-weight:600;letter-spacing:.1em;}
#menu .me{font-size:10px;color:var(--muted);letter-spacing:.4em;margin:4px 0 22px;}
#menu .mi{display:flex;flex-direction:column;align-items:center;gap:2px;padding:16px;border-radius:16px;
  cursor:pointer;transition:background .25s,transform .25s;}
#menu .mi:hover{background:rgba(255,255,255,.05);}
#menu .mi:active{transform:scale(.97);}
#menu .mi .mt{font-family:"Noto Serif SC",serif;font-size:20px;font-weight:600;}
#menu .mi .ms{font-size:11px;color:var(--muted);letter-spacing:.12em;}
#menu .mf{font-size:10px;color:var(--muted);letter-spacing:.4em;margin-top:20px;opacity:.6;}

/* ===== Generic card ===== */
.card{background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);
  padding:18px 16px;backdrop-filter:blur(16px);box-shadow:0 18px 46px -22px rgba(0,0,0,.6);}
.tag{display:inline-block;font-size:11px;padding:3px 10px;border-radius:12px;
  background:rgba(var(--accent-rgb),.14);color:var(--accent);border:1px solid rgba(var(--accent-rgb),.3);}
.muted{color:var(--muted);}
.center{text-align:center;}
.h2{font-family:"Noto Serif SC",serif;font-size:24px;font-weight:600;letter-spacing:.06em;margin:4px 0 2px;}

/* ===== Stack sections ===== */
.stack{margin:18px 0 6px;}
.stack-head{display:flex;align-items:baseline;gap:10px;margin-bottom:10px;}
.stack-head .sn{font-family:"Noto Serif SC",serif;font-size:19px;font-weight:600;}
.stack-head .se{font-size:11px;color:var(--muted);letter-spacing:.3em;}
.stack-head .sm{margin-left:auto;font-size:11px;color:var(--muted);}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.mod{background:var(--glass);border:1px solid var(--glass-border);border-radius:14px;padding:14px 13px;
  min-height:96px;display:flex;flex-direction:column;gap:5px;cursor:pointer;transition:transform .25s,border-color .25s;}
.mod:active{transform:scale(.97);}
.mod .mi{font-size:22px;}
.mod .mt{font-size:15px;font-weight:500;}
.mod .me{font-size:9px;letter-spacing:.24em;color:var(--muted);text-transform:uppercase;}
.mod .md{font-size:11px;color:var(--muted);line-height:1.45;}
.mod .mk{margin-top:auto;font-size:10px;color:var(--accent);opacity:.85;}

/* 刚看过的模块：柔和脉冲高亮 */
.mod.just-seen{position:relative;border-color:rgba(var(--accent-rgb),.62);
  box-shadow:0 0 0 1px rgba(var(--accent-rgb),.18),0 12px 34px -16px rgba(var(--accent-rgb),.22);
  animation:pulseSeen 2.4s ease-in-out 3;}
.mod.just-seen .seen-tag{font-size:10px;display:inline-block;margin-top:6px;padding:2px 8px;border-radius:10px;
  background:rgba(var(--accent-rgb),.14);color:var(--accent);border:1px solid rgba(var(--accent-rgb),.34);}
@keyframes pulseSeen{0%,100%{box-shadow:0 0 0 1px rgba(var(--accent-rgb),.18),0 12px 34px -16px rgba(var(--accent-rgb),.22);}
  50%{box-shadow:0 0 0 4px rgba(var(--accent-rgb),.10),0 16px 42px -14px rgba(var(--accent-rgb),.30);}}

/* 栖处悬浮栈导航 */
#stackRail{position:fixed;right:calc(10px + var(--safe-r));top:50%;z-index:40;display:flex;flex-direction:column;gap:7px;
  padding:7px;background:rgba(18,32,26,.88);border:1px solid rgba(255,255,255,.14);border-radius:18px;
  backdrop-filter:blur(14px);box-shadow:0 16px 42px -14px rgba(0,0,0,.55);
  transform:translateY(-50%) translateX(24px);opacity:0;pointer-events:none;
  transition:opacity .35s,transform .4s cubic-bezier(.2,.8,.2,1);}
#stackRail.in{opacity:1;pointer-events:auto;transform:translateY(-50%) translateX(0);}
.srail-dot{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:11px;color:var(--muted);
  background:transparent;cursor:pointer;transition:background .25s,color .25s,transform .18s;}
.srail-dot.on{background:var(--accent);color:var(--bg);font-weight:600;box-shadow:0 0 12px rgba(var(--accent-rgb),.32);}
.srail-dot:active{transform:scale(.88);}

/* ===== Login gate ===== */
.gate{position:fixed;inset:0;z-index:80;background:radial-gradient(120% 90% at 50% 18%,#13241D,#0A0F0D 70%);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:calc(30px + var(--safe-t)) 24px calc(30px + var(--safe-b));overflow-y:auto;text-align:center;}
.gate.hide{display:none;}
.gate-x{position:absolute;top:calc(16px + var(--safe-t));right:18px;width:38px;height:38px;border-radius:50%;
  display:grid;place-items:center;font-size:22px;color:var(--muted);background:var(--glass);border:1px solid var(--glass-border);cursor:pointer;}
.gate-x:active{color:var(--ui);}
.gate h1{font-family:"Noto Serif SC",serif;font-size:34px;font-weight:700;margin:0 0 4px;letter-spacing:.08em;}
.gate .ge{font-size:13px;color:var(--muted);letter-spacing:.4em;margin-bottom:26px;}
.gate .lead{font-size:14px;color:var(--muted);line-height:1.8;max-width:320px;margin:0 auto 24px;}
.field{width:100%;max-width:320px;text-align:left;margin-bottom:14px;}
.field label{display:block;font-size:12px;color:var(--muted);margin-bottom:6px;letter-spacing:.06em;}
.inp{width:100%;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;
  padding:12px 14px;color:var(--ui);font-size:15px;font-family:inherit;outline:none;}
.inp:focus{border-color:rgba(var(--accent-rgb),.6);}
.cc{display:flex;gap:10px;}
.cc .dot{width:34px;height:34px;border-radius:50%;border:2px solid transparent;cursor:pointer;}
.cc .dot.on{border-color:#fff;}
.chips{display:flex;flex-wrap:wrap;gap:8px;}
.chip{font-size:13px;padding:8px 14px;border-radius:16px;background:var(--glass);border:1px solid var(--glass-border);color:var(--muted);}
.chip.on{color:var(--bg);background:var(--accent);border-color:var(--accent);font-weight:600;}
.btn{width:100%;max-width:320px;padding:14px;border-radius:24px;background:var(--accent);color:var(--bg);
  font-size:16px;font-weight:600;margin-top:6px;}
.btn.ghost{background:transparent;color:var(--muted);border:1px solid var(--glass-border);font-weight:500;margin-top:10px;}
.note{font-size:11px;color:var(--muted);opacity:.7;max-width:320px;margin:14px auto 0;line-height:1.6;}

/* ===== Door · 推开自然之门（真 3D 透视 · 全 GPU 合成） =====
   时长由 --dr 控制（JS 按设备能力写入），全部 transform/opacity，弱机也不掉帧 */
.door{position:fixed;inset:0;z-index:70;display:none;overflow:hidden;
  background:#050907;--dr:2.6s;--cam:1.9s;--camd:.9s;}
.door.show{display:block;pointer-events:auto;cursor:pointer;}
.door .stage{position:absolute;inset:0;perspective:1100px;perspective-origin:50% 48%;
  transform-style:preserve-3d;}
/* 相机推进：门推开到一半时，镜头缓缓穿过门框走进去 */
.door .dolly{position:absolute;inset:0;transform-style:preserve-3d;
  transform:translateZ(0) scale3d(1,1,1);
  transition:transform var(--cam) cubic-bezier(.4,0,.35,1) var(--camd);}
.door.open .dolly{transform:translateZ(0) scale3d(2.15,2.15,1);}

/* —— 门外的世界：光 + 雾（推到 3D 空间更深处，门板才不会穿模） —— */
.door .far{position:absolute;inset:0;transform:translateZ(-300px) scale(1.28);
  background:
    radial-gradient(58% 48% at 50% 46%, rgba(var(--accent-rgb),.55), rgba(var(--accent-rgb),.14) 42%, transparent 72%),
    radial-gradient(120% 70% at 50% 100%, rgba(var(--accent-rgb),.10), transparent 60%),
    linear-gradient(180deg,#0B1712,#050908);
  opacity:.22;transition:opacity calc(var(--dr) * .9) ease-out .25s;}
.door.open .far{opacity:1;}
.door .fog{position:absolute;left:50%;top:52%;width:60vmax;height:60vmax;border-radius:50%;
  margin:-30vmax 0 0 -30vmax;pointer-events:none;
  background:radial-gradient(circle,rgba(var(--accent-rgb),.20),transparent 62%);
  filter:blur(28px);opacity:0;will-change:transform,opacity;}
.door.open .fog{animation:fogOut calc(var(--dr) + .7s) cubic-bezier(.22,.7,.3,1) forwards;}
.door .fog.f2{animation-delay:.28s;width:44vmax;height:44vmax;margin:-22vmax 0 0 -22vmax;}
.door .fog.f3{animation-delay:.55s;width:78vmax;height:78vmax;margin:-39vmax 0 0 -39vmax;opacity:0;}
@keyframes fogOut{
  0%{transform:translateZ(-180px) scale(.18) translateY(6%);opacity:0;}
  22%{opacity:.85;}
  100%{transform:translateZ(-180px) scale(1.5) translateY(-9%);opacity:0;}
}

/* —— 门扉本体：两扇实板，被慢慢「推」进去 —— */
.door .leaf{position:absolute;top:0;height:100%;width:calc(50% + 1px);overflow:hidden;
  backface-visibility:hidden;
  background:
    /* 竖向木纹 */
    repeating-linear-gradient(90deg, rgba(255,255,255,.030) 0 2px, transparent 2px 9px,
                                     rgba(0,0,0,.16) 9px 11px, transparent 11px 22px),
    /* 上下明暗 */
    linear-gradient(180deg, #2A4A3B 0%, #1C3629 38%, #14261D 74%, #0D1913 100%),
    #1C3629;
  box-shadow:inset 0 0 120px rgba(0,0,0,.62), inset 0 0 0 1px rgba(255,255,255,.05);
  transition:transform var(--dr) cubic-bezier(.36,.02,.16,1);
  will-change:transform;}
/* 门推进去后背光 → 门板逐渐变成剪影，年轮纹被光勾出来 */
.door .leaf::after{content:"";position:absolute;inset:0;background:rgba(3,6,5,.62);
  opacity:.3;transition:opacity var(--dr) ease-in;}
.door.open .leaf::after{opacity:1;}
.door .leaf.l{left:0;  transform-origin:left  center;}
.door .leaf.r{right:0; transform-origin:right center;}
/* 正角度 = 自由边向内（远离观众）→ 这才是「推」开 */
.door.open .leaf.l{transform:rotateY(87deg);}
.door.open .leaf.r{transform:rotateY(-87deg);}
/* 蓄力：推之前先向外极轻微一顿，像吸了一口气 */
.door.load .leaf.l{transform:rotateY(-2.4deg);}
.door.load .leaf.r{transform:rotateY(2.4deg);}
.door.load .leaf{transition-duration:.34s;transition-timing-function:cubic-bezier(.3,.9,.4,1);}

/* 门上年轮雕纹：左右各半，合起来是一个整圆 —— 一眼认出「这是门」 */
.door .carve{position:absolute;top:50%;width:46vmin;height:46vmin;margin-top:-23vmin;
  border-radius:50%;border:1px solid rgba(var(--accent-rgb),.34);
  box-shadow:0 0 0 1px rgba(0,0,0,.35) inset, 0 0 22px rgba(var(--accent-rgb),.10);}
.door .carve::before{content:"";position:absolute;inset:14%;border-radius:50%;
  border:1px solid rgba(var(--accent-rgb),.20);}
.door .carve::after{content:"";position:absolute;inset:32%;border-radius:50%;
  border:1px solid rgba(var(--accent-rgb),.13);}
.door .leaf.l .carve{right:-23vmin;}
.door .leaf.r .carve{left:-23vmin;}
/* 门环把手 */
.door .knob{position:absolute;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;
  border:2px solid rgba(var(--accent-rgb),.5);box-shadow:0 0 12px rgba(var(--accent-rgb),.25);}
.door .leaf.l .knob{right:16px;}
.door .leaf.r .knob{left:16px;}
/* 门板外缘厚度高光 */
.door .leaf.l{border-right:2px solid rgba(var(--accent-rgb),.35);}
.door .leaf.r{border-left:2px solid rgba(var(--accent-rgb),.35);}

/* —— 中缝漏光 —— */
.door .seam{position:absolute;left:50%;top:0;bottom:0;width:3px;transform:translateX(-50%) translateZ(-10px);
  background:linear-gradient(180deg,transparent,rgba(var(--accent-rgb),.95) 22%,#fff 50%,rgba(var(--accent-rgb),.95) 78%,transparent);
  box-shadow:0 0 26px 6px rgba(var(--accent-rgb),.55);opacity:.55;
  transition:opacity .5s ease, box-shadow .5s ease;}
.door.load .seam{opacity:1;box-shadow:0 0 46px 14px rgba(var(--accent-rgb),.8);}
.door.open .seam{opacity:0;transition:opacity .55s ease .18s;}

/* —— 木框（树皮质感）：压在最上层，让门「嵌在墙里」 —— */
.door .jamb{position:absolute;inset:0;pointer-events:none;transform:translateZ(30px);
  box-shadow:inset 0 0 0 11px #3E2A1A, inset 0 0 0 13px #6B4A2E,
             inset 0 0 0 15px #4A3320, inset 0 0 90px 30px rgba(0,0,0,.72);}

/* —— 自然装饰：门脚苔藓 · 松果 · 枝叶果实（森林手工本气息） —— */
.door .moss{position:absolute;bottom:0;width:36vmin;height:20vmin;pointer-events:none;
  transform:translateZ(32px);opacity:.85;filter:blur(3px);
  background:
    radial-gradient(58% 68% at 28% 92%, rgba(122,170,108,.55), transparent 72%),
    radial-gradient(52% 62% at 66% 96%, rgba(96,150,96,.46), transparent 74%),
    radial-gradient(40% 50% at 48% 100%, rgba(150,190,128,.38), transparent 72%);}
.door .moss.l{left:0;}
.door .moss.r{right:0;transform:translateZ(32px) scaleX(-1);}
/* 内联 SVG 装饰：挂在门楣、生在门脚，随相机一同推近 */
.door .deco{position:absolute;pointer-events:none;transform:translateZ(33px);
  opacity:.94;filter:drop-shadow(0 2px 3px rgba(0,0,0,.55));}
.door .deco.sprig{top:1.2vmin;left:50%;margin-left:-9vmin;width:18vmin;height:12vmin;}
.door .deco.pine-l{bottom:2vmin;left:3.2vmin;width:8.5vmin;height:12vmin;}
.door .deco.pine-r{bottom:2vmin;right:3.2vmin;width:8.5vmin;height:12vmin;transform:translateZ(33px) scaleX(-1);}

/* —— 落幕 —— */
.door.fade{opacity:0;transition:opacity .55s ease;}
.door .skip{position:absolute;right:calc(16px + var(--safe-r));bottom:calc(20px + var(--safe-b));
  font-size:11px;letter-spacing:.2em;color:rgba(var(--accent-rgb),.55);z-index:5;opacity:0;
  transition:opacity .6s ease .8s;}
.door.show .skip{opacity:1;}
/* 弱机精简：门照常 3D 推开，只去掉大面积模糊雾团（blur 最吃 GPU） */
.door.lite .fog{display:none;}
.door.lite .carve{box-shadow:none;}
@media (prefers-reduced-motion: reduce){
  .door{--dr:.01s;--cam:.01s;}
  .door .fog{display:none;}
}

/* ===== Webmaster ===== */
.stat-box{background:rgba(var(--accent-rgb),.08);border:1px solid rgba(var(--accent-rgb),.25);border-radius:14px;padding:14px;margin-bottom:12px;}
.stat-row{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;font-size:13px;padding:5px 0;}
.stat-row span{color:var(--accent);min-width:70px;flex-shrink:0;}
.stat-row b{font-weight:600;margin-right:6px;}
.lock{font-size:13px;color:var(--muted);}
/* 站长 · 隐秘入口（长按标题约 0.7 秒唤出，无任何标识） */
.wm-secret{position:fixed;inset:0;z-index:65;display:flex;align-items:center;justify-content:center;
  background:rgba(6,10,8,.6);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity .3s;}
.wm-secret.show{opacity:1;pointer-events:auto;}
.wm-secret .inp.shake{animation:wmShake .4s;}
@keyframes wmShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}

/* 站长模式 · 缓缓浮现（口令正确后才慢慢出现） */
.wm-veil{position:fixed;inset:0;z-index:64;pointer-events:none;opacity:0;
  background:radial-gradient(62% 62% at 50% 48%, rgba(var(--accent-rgb),.10), rgba(3,6,5,.86));
  transition:opacity 1.7s ease;}
.wm-veil.in{opacity:1;}
.wm-reveal{opacity:0;filter:blur(16px);transform:scale(.985);
  transition:opacity 1.9s ease, filter 1.9s ease, transform 1.9s ease;}
.wm-reveal.in{opacity:1;filter:blur(0);transform:none;}

/* ===== Toast ===== */
#toast{position:fixed;left:50%;bottom:calc(110px + var(--safe-b));transform:translateX(-50%);
  background:rgba(20,39,31,.95);border:1px solid var(--glass-border);color:var(--ui);
  padding:10px 18px;border-radius:20px;font-size:13px;z-index:90;opacity:0;transition:opacity .3s;pointer-events:none;max-width:84vw;text-align:center;}
#toast.show{opacity:1;}

/* 极淡的换界面提示：融入空栈界面，不抢眼 */
.tap-tip{text-align:center;font-size:12px;color:var(--muted);letter-spacing:.03em;
  margin:-2px 0 14px;opacity:0;animation:tipIn 1.4s ease .3s forwards;}
@keyframes tipIn{0%{opacity:0;}60%{opacity:.72;}100%{opacity:.5;}}

/* 背景图（按心境切换） */
#backdrop{position:fixed;inset:0;z-index:-2;background-size:cover;background-position:center;background-repeat:no-repeat;opacity:0;transition:opacity 1s ease, background-image 1s ease;}
#veil{position:fixed;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(180deg, rgba(10,15,13,.62), rgba(10,15,13,.82));transition:background .8s ease;}
.door .far-photo{position:absolute;inset:0;transform:translateZ(-300px) scale(1.28);background-size:cover;background-position:center;opacity:0;transition:opacity calc(var(--dr) * .9) ease-out .25s;}
.door.open .far-photo{opacity:.92;}
.greet{text-align:center;font-size:13px;color:var(--muted);margin:-4px 0 12px;letter-spacing:.02em;}
.greet b{color:var(--accent);font-weight:600;}
.profile-row{display:flex;align-items:center;gap:12px;padding:14px;margin-top:14px;background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);}
.avatar{width:46px;height:46px;border-radius:50%;flex:0 0 auto;display:grid;place-items:center;font-size:20px;font-weight:600;color:var(--accent);background:rgba(var(--accent-rgb),.14);border:1px solid rgba(var(--accent-rgb),.4);overflow:hidden;}
.avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;}
.avatar-pick{cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;gap:6px;}
.avatar-pick .avatar{width:72px;height:72px;font-size:30px;}
.avatar-pick .hint{font-size:11px;color:var(--muted);}
.avatar-pick .clear{font-size:11px;color:#FF9C9C;border:1px solid rgba(255,156,156,.4);border-radius:14px;padding:3px 10px;margin-top:2px;}
.stack.def{background:linear-gradient(90deg,rgba(var(--accent-rgb),.045),transparent 42%);border-radius:12px;}
.profile-row .pn{font-size:15px;font-weight:600;color:var(--ui);}
.profile-row .ps{font-size:11px;color:var(--muted);margin-top:2px;}
.dm-row{display:flex;gap:10px;margin-top:12px;}
.dm-row .btn{flex:1;}
.sub{font-size:12px;color:var(--muted);margin-top:8px;line-height:1.6;}
textarea.inp{height:96px;resize:none;font-family:inherit;line-height:1.6;}
/* 公共留言板 */
.post{border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:10px 12px;margin-bottom:10px;background:rgba(255,255,255,.03);}
.post.reported{border-color:rgba(255,156,156,.5);background:rgba(255,156,156,.06);}
/* 举报弹层 */
.rpt-mask{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;background:rgba(4,8,6,.55);backdrop-filter:blur(3px);padding:18px;}
.rpt-mask.show{display:flex;}
.rpt{width:min(92vw,360px);background:rgba(18,32,26,.96);border:1px solid var(--glass-border);border-radius:18px;padding:18px 18px 16px;box-shadow:0 18px 50px rgba(0,0,0,.45);}
.rpt-t{font-family:"Noto Serif SC",serif;font-size:18px;font-weight:600;letter-spacing:.04em;}
.rpt-sub{font-size:11px;color:var(--muted);margin:4px 0 12px;}
.rpt-reasons{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;}
.rpt-chip{padding:7px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:var(--ui);font-size:12px;cursor:pointer;transition:.15s;}
.rpt-chip:active{transform:scale(.96);}
.rpt-chip.on{background:rgba(var(--accent-rgb),.18);border-color:var(--accent);color:var(--accent);}
.rpt-note{height:64px;width:100%;margin-bottom:12px;}
.rpt-row{display:flex;gap:8px;flex-wrap:wrap;}
.rpt-row .btn{flex:1 1 auto;min-width:84px;}
.rpt-ok{font-size:11px;color:var(--accent);margin-top:8px;min-height:14px;}
.phead{display:flex;align-items:center;gap:8px;font-size:12px;}
.pav{width:22px;height:22px;border-radius:50%;object-fit:cover;display:grid;place-items:center;font-size:12px;color:var(--accent);background:rgba(var(--accent-rgb),.14);flex:0 0 auto;overflow:hidden;}
.pn{font-weight:600;color:var(--ui);}
.pt{color:var(--muted);font-size:11px;}
.ptext{font-size:14px;line-height:1.7;margin:6px 0 8px;white-space:pre-wrap;word-break:break-word;}
.pact{display:flex;gap:14px;}
.link{background:none;border:none;color:var(--accent);font-size:12px;cursor:pointer;padding:0;font-family:inherit;}
.link.warn{color:#FF9C9C;}
.tag.warn{color:#FF9C9C;border:1px solid rgba(255,156,156,.5);}

.hidden{display:none!important;}

/* ==================== 私域模块 · 通用外壳 ==================== */
.mscene{position:relative;width:100%;height:186px;border-radius:18px;overflow:hidden;
  border:1px solid var(--glass-border);margin-top:12px;background:#04100c;}
.mscene canvas{display:block;width:100%;height:100%;}
.mscene.tall{height:238px;}
.mscene .sccap{position:absolute;left:14px;bottom:11px;font-size:11px;letter-spacing:.14em;
  color:rgba(255,255,255,.72);text-shadow:0 1px 8px rgba(0,0,0,.8);pointer-events:none;}
.mrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}
.mbtn{flex:1 1 116px;padding:11px 12px;border-radius:20px;font-size:13px;text-align:center;
  background:var(--glass);border:1px solid var(--glass-border);color:var(--text);cursor:pointer;
  user-select:none;transition:background .22s,border-color .22s,color .22s,transform .12s;}
.mbtn:active{transform:scale(.97);}
.mbtn.on{background:rgba(var(--accent-rgb),.17);border-color:rgba(var(--accent-rgb),.5);color:var(--accent);}
.mbtn.pri{background:var(--accent);color:#08130f;border-color:transparent;font-weight:600;}
.mbtn.sm{flex:0 0 auto;padding:7px 14px;font-size:12px;}
.mnote{font-size:12px;color:var(--muted);line-height:1.75;margin-top:11px;}
.mstat{display:flex;gap:8px;margin-top:12px;}
.mstat>div{flex:1;background:var(--glass);border:1px solid var(--glass-border);
  border-radius:14px;padding:12px 6px;text-align:center;}
.mstat b{display:block;font-size:21px;color:var(--accent);font-family:"Cormorant Garamond",serif;line-height:1.2;}
.mstat span{font-size:11px;color:var(--muted);}
.mcard{background:var(--glass);border:1px solid var(--glass-border);border-radius:16px;
  padding:15px 16px;margin-top:12px;}
.mline{display:flex;justify-content:space-between;align-items:center;padding:9px 0;
  border-bottom:1px solid rgba(255,255,255,.06);font-size:13px;}
.mline:last-child{border-bottom:0;}
.mline b{color:var(--accent);font-weight:600;}
.msw{width:44px;height:25px;border-radius:14px;background:rgba(255,255,255,.12);position:relative;
  transition:background .28s;flex:0 0 auto;cursor:pointer;}
.msw::after{content:"";position:absolute;top:3px;left:3px;width:19px;height:19px;border-radius:50%;
  background:#EAF1EC;transition:transform .28s;}
.msw.on{background:rgba(var(--accent-rgb),.65);}
.msw.on::after{transform:translateX(19px);}
.chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px;}
.chip{padding:6px 13px;border-radius:15px;font-size:12px;background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.1);color:var(--muted);cursor:pointer;transition:.2s;}
.chip.on{background:rgba(var(--accent-rgb),.16);border-color:rgba(var(--accent-rgb),.45);color:var(--accent);}
.mempty{text-align:center;color:var(--muted);font-size:12px;padding:22px 10px;line-height:1.9;}

/* ---- 回声·声景 ---- */
.ecgrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px;}
.ectr{background:var(--glass);border:1px solid var(--glass-border);border-radius:15px;padding:11px 12px;
  cursor:pointer;transition:border-color .25s,background .25s;position:relative;overflow:hidden;}
.ectr.on{border-color:rgba(var(--accent-rgb),.5);background:rgba(var(--accent-rgb),.09);}
.ectr .ecn{font-size:13px;display:flex;align-items:center;gap:7px;}
.ectr .ecd{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.2);flex:0 0 auto;transition:.3s;}
.ectr.on .ecd{background:var(--accent);box-shadow:0 0 9px rgba(var(--accent-rgb),.85);animation:ecpulse 2.6s ease-in-out infinite;}
@keyframes ecpulse{0%,100%{opacity:.55}50%{opacity:1}}
.ectr .ecs{font-size:10.5px;color:var(--muted);margin-top:3px;}
.ectr input[type=range]{width:100%;margin-top:8px;accent-color:var(--accent);height:3px;}
.ecwave{width:100%;height:74px;display:block;margin-top:12px;}
.ecpre{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:15px;font-size:12px;
  background:rgba(var(--accent-rgb),.1);border:1px solid rgba(var(--accent-rgb),.3);color:var(--accent);cursor:pointer;}
.ecpre .x{opacity:.55;font-size:11px;}

/* ---- 心流 · 专注 ---- */
.flowring{position:relative;width:212px;height:212px;margin:16px auto 4px;}
.flowring svg{display:block;transform:rotate(-90deg);}
.flowring .fnum{position:absolute;inset:0;display:grid;place-items:center;text-align:center;}
.flowring .ft{font-family:"Cormorant Garamond",serif;font-size:44px;letter-spacing:.03em;line-height:1;}
.flowring .fs{font-size:11.5px;color:var(--muted);letter-spacing:.22em;margin-top:7px;}
.flowring .fhalo{position:absolute;inset:26px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(var(--accent-rgb),.16),transparent 68%);
  animation:fbreath 8s ease-in-out infinite;}
@keyframes fbreath{0%,100%{transform:scale(.92);opacity:.5}50%{transform:scale(1.06);opacity:.95}}

/* ---- 节气历 ---- */
.stnow{text-align:center;margin-top:14px;}
.stnow .stn{font-family:"Noto Serif SC",serif;font-size:46px;letter-spacing:.28em;
  text-indent:.28em;color:var(--accent);line-height:1.2;}
.stnow .std{font-size:12px;color:var(--muted);letter-spacing:.14em;margin-top:4px;}
.sthou{display:flex;gap:8px;margin-top:14px;}
.sthou>div{flex:1;background:var(--glass);border:1px solid var(--glass-border);border-radius:14px;
  padding:13px 8px;text-align:center;animation:qrise .5s ease both;}
.sthou i{display:block;font-style:normal;font-size:10.5px;color:var(--accent);letter-spacing:.16em;}
.sthou p{margin:6px 0 0;font-size:12.5px;font-family:"Noto Serif SC",serif;line-height:1.6;}
@keyframes qrise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
.strail{display:flex;gap:5px;overflow-x:auto;margin-top:14px;padding-bottom:5px;-webkit-overflow-scrolling:touch;}
.strail span{flex:0 0 auto;padding:5px 11px;border-radius:13px;font-size:11.5px;white-space:nowrap;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:var(--muted);}
.strail span.on{background:rgba(var(--accent-rgb),.17);border-color:rgba(var(--accent-rgb),.45);color:var(--accent);}

/* ---- 月相 ---- */
.mnbox{display:flex;align-items:center;gap:17px;margin-top:14px;}
.mnbox canvas{width:104px;height:104px;border-radius:50%;flex:0 0 auto;
  box-shadow:0 0 38px rgba(255,244,214,.22);}
.mnbox .mnm b{font-family:"Noto Serif SC",serif;font-size:22px;letter-spacing:.14em;}
.mnbox .mnm div{font-size:12px;color:var(--muted);margin-top:5px;line-height:1.7;}

/* ---- 随机诗句 ---- */
.vsbox{position:relative;margin-top:14px;padding:26px 20px 22px;border-radius:18px;overflow:hidden;
  border:1px solid rgba(255,255,255,.1);background:linear-gradient(160deg,rgba(255,255,255,.055),rgba(255,255,255,.015));}
.vsbox canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.5;}
.vst{position:relative;font-family:"Noto Serif SC",serif;font-size:21px;line-height:2.15;
  letter-spacing:.09em;text-align:center;min-height:2.15em;}
.vst i{font-style:normal;opacity:0;display:inline-block;animation:inkin .62s ease forwards;
  filter:blur(5px);}
@keyframes inkin{to{opacity:1;filter:blur(0)}}
.vsa{position:relative;text-align:right;margin-top:14px;font-size:12.5px;color:var(--muted);letter-spacing:.1em;}
.vseal{position:absolute;right:16px;bottom:14px;width:34px;height:34px;border-radius:5px;
  border:1.6px solid rgba(214,92,72,.85);color:rgba(214,92,72,.95);display:grid;place-items:center;
  font-family:"Ma Shan Zheng","Noto Serif SC",serif;font-size:13px;line-height:1.05;text-align:center;
  opacity:0;animation:sealin .5s ease .9s forwards;transform:rotate(-6deg) scale(1.4);}
@keyframes sealin{to{opacity:.92;transform:rotate(-6deg) scale(1)}}
.vskeep{margin-top:12px;}
.vskeep .vk{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);
  border-left:2px solid rgba(var(--accent-rgb),.5);border-radius:0 12px 12px 0;padding:11px 13px;
  margin-bottom:8px;font-family:"Noto Serif SC",serif;font-size:14px;line-height:1.85;}
.vskeep .vk small{display:block;color:var(--muted);font-family:"Noto Sans SC",sans-serif;font-size:11px;margin-top:5px;}

/* ---- 灵感手账 ---- */
.ntcard{position:relative;background:linear-gradient(178deg,rgba(255,255,255,.062),rgba(255,255,255,.022));
  border:1px solid rgba(255,255,255,.09);border-radius:4px 14px 14px 4px;padding:13px 15px 13px 19px;
  margin-bottom:10px;animation:ntin .45s ease both;}
.ntcard::before{content:"";position:absolute;left:7px;top:11px;bottom:11px;width:1.5px;
  background:rgba(var(--accent-rgb),.42);border-radius:1px;}
@keyframes ntin{from{opacity:0;transform:translateX(-11px)}to{opacity:1;transform:none}}
.ntcard .nth{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:6px;}
.ntcard .ntt{font-size:14px;line-height:1.85;white-space:pre-wrap;}

/* ---- 心境 ---- */
.mdpick{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:14px;}
.mdc{aspect-ratio:1;border-radius:15px;background:var(--glass);border:1px solid var(--glass-border);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;
  transition:border-color .25s,background .25s;position:relative;overflow:hidden;}
.mdc.on{border-color:rgba(var(--accent-rgb),.55);background:rgba(var(--accent-rgb),.1);}
.mdc canvas{width:34px;height:34px;}
.mdc span{font-size:10.5px;color:var(--muted);}
.mdc.on span{color:var(--accent);}
.mdheat{display:grid;grid-template-columns:repeat(15,1fr);gap:4px;margin-top:14px;}
.mdheat i{aspect-ratio:1;border-radius:3.5px;background:rgba(255,255,255,.055);}

/* ---- 晨启夜收 ---- */
.rtstep{font-family:"Noto Serif SC",serif;font-size:18.5px;line-height:2;text-align:center;
  padding:22px 12px;animation:rtin .55s ease both;}
@keyframes rtin{from{opacity:0;transform:translateY(11px) scale(.985)}to{opacity:1;transform:none}}
.rtdots{display:flex;gap:7px;justify-content:center;margin-top:2px;}
.rtdots i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.18);transition:.3s;}
.rtdots i.on{background:var(--accent);width:19px;border-radius:3px;box-shadow:0 0 9px rgba(var(--accent-rgb),.6);}

/* ---- 身体扫描 ---- */
.bdfig{position:relative;height:222px;margin-top:14px;display:grid;place-items:center;}
.bdfig svg{height:100%;}
.bdbar{height:3px;border-radius:2px;background:rgba(255,255,255,.09);overflow:hidden;margin-top:12px;}
.bdbar i{display:block;height:100%;background:var(--accent);border-radius:2px;
  box-shadow:0 0 11px rgba(var(--accent-rgb),.75);transition:width .7s ease;}
.bdtext{font-family:"Noto Serif SC",serif;font-size:17px;line-height:2.05;text-align:center;
  padding:18px 10px 6px;animation:rtin .6s ease both;}

/* ---- 折纸冥想 · 3D 纸盒 ---- */
.oristage{height:296px;margin-top:12px;display:grid;place-items:center;
  perspective:900px;perspective-origin:50% 44%;}
.oriwrap{width:184px;height:184px;position:relative;transform-style:preserve-3d;
  transform:rotateX(59deg) rotateZ(-16deg);transition:transform 1.5s cubic-bezier(.4,.05,.2,1);}
.oriwrap.done{animation:oriturn 17s linear infinite;}
@keyframes oriturn{from{transform:rotateX(56deg) rotateZ(-16deg)}to{transform:rotateX(56deg) rotateZ(344deg)}}
.opl{position:absolute;transform-style:preserve-3d;
  transition:transform 1.15s cubic-bezier(.36,.02,.2,1);
  background:linear-gradient(148deg,#f2ece0,#ddd4c1);
  box-shadow:inset 0 0 0 1px rgba(90,78,58,.14);}
.opl::after{content:"";position:absolute;inset:0;opacity:.3;pointer-events:none;
  background:repeating-linear-gradient(97deg,rgba(140,124,96,.11) 0 1px,transparent 1px 4px);}
.obase{left:42px;top:42px;width:100px;height:100px;background:linear-gradient(148deg,#ece5d7,#d3c9b4);}
.owall{width:100px;height:42px;}
.owall.n{left:42px;top:0;transform-origin:50% 100%;}
.owall.s{left:42px;top:142px;transform-origin:50% 0;}
.owall.w{left:0;top:42px;width:42px;height:100px;transform-origin:100% 50%;}
.owall.e{left:142px;top:42px;width:42px;height:100px;transform-origin:0 50%;}
.ocn{position:absolute;width:42px;height:42px;transform-style:preserve-3d;
  transition:transform 1.05s cubic-bezier(.36,.02,.2,1);
  background:linear-gradient(148deg,#e6dece,#c9bfa8);box-shadow:inset 0 0 0 1px rgba(90,78,58,.15);}
.ocn.l{left:-42px;top:0;transform-origin:100% 50%;}
.ocn.r{left:100px;top:0;transform-origin:0 50%;}
.ocrease{position:absolute;background:rgba(var(--accent-rgb),.85);opacity:0;
  box-shadow:0 0 8px rgba(var(--accent-rgb),.8);transition:opacity .5s;pointer-events:none;}
.oriwrap.creased .ocrease{opacity:.85;}
.oshade{position:absolute;left:42px;top:42px;width:100px;height:100px;opacity:0;
  transition:opacity 1s;pointer-events:none;
  background:radial-gradient(74% 74% at 50% 42%,rgba(255,248,224,.20),rgba(0,0,0,.42) 96%);}
.oriwrap.done .oshade{opacity:1;}
.oribr{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:6px;
  font-size:12.5px;color:var(--muted);letter-spacing:.1em;min-height:20px;}
.oribr i{width:8px;height:8px;border-radius:50%;background:var(--accent);flex:0 0 auto;
  box-shadow:0 0 10px rgba(var(--accent-rgb),.8);transition:transform 3.6s ease-in-out,opacity 3.6s;}
.oribr i.inh{transform:scale(2.3);opacity:1;}
.oribr i.exh{transform:scale(.75);opacity:.5;}
.oristeps{display:flex;gap:5px;justify-content:center;margin-top:9px;}
.oristeps i{height:3px;flex:1;max-width:44px;border-radius:2px;background:rgba(255,255,255,.13);transition:.4s;}
.oristeps i.on{background:var(--accent);box-shadow:0 0 8px rgba(var(--accent-rgb),.6);}

/* ===================== 公共板块 · 各自不同的形态 ===================== */
.bhead{position:relative;display:flex;align-items:flex-start;gap:10px;margin:14px 0 4px;}
.bback{flex:0 0 auto;padding:6px 12px;font-size:12px;color:var(--accent);background:var(--glass);border:1px solid var(--glass-border);border-radius:16px;}
.bback:active{transform:scale(.96);}
.bht{flex:1;}
.bh2{font-family:"Noto Serif SC",serif;font-size:22px;font-weight:600;letter-spacing:.05em;}
.bsub{font-size:12px;color:var(--muted);margin-top:2px;line-height:1.5;}
.btag{position:absolute;right:0;top:2px;}
.bcard{background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:14px 14px;backdrop-filter:blur(16px);}
.bhero{display:block;width:100%;height:150px;border-radius:var(--radius);}
.bhint{font-size:12px;color:var(--muted);text-align:center;margin:12px 0;line-height:1.6;}

/* 每日一读 · 共读库 */
.qfeature{background:linear-gradient(135deg,rgba(var(--accent-rgb),.10),rgba(var(--accent-rgb),.02));border:1px solid rgba(var(--accent-rgb),.25);border-radius:var(--radius);padding:18px 16px;text-align:center;}
.qftag{font-size:11px;color:var(--accent);letter-spacing:.2em;}
.qftext{font-family:"Noto Serif SC",serif;font-size:21px;line-height:1.7;margin:12px 0 8px;animation:qfloat 5s ease-in-out infinite;}
@keyframes qfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.qfauth{font-size:13px;color:var(--muted);}
.qfacts{margin-top:12px;display:flex;justify-content:center;gap:18px;font-size:13px;color:var(--accent);}
.qstar{cursor:pointer;user-select:none;}
.qrand{cursor:pointer;color:var(--muted);user-select:none;}
.qchips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 2px;}
.qp{font-size:13px;padding:6px 14px;border-radius:16px;background:var(--glass);border:1px solid var(--glass-border);color:var(--muted);cursor:pointer;}
.qp.sel{color:var(--bg);background:var(--accent);border-color:var(--accent);font-weight:600;}
.qcard{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:10px;transition:border-color .2s,background .2s;}
.qcard:hover{border-color:rgba(var(--accent-rgb),.4);background:rgba(255,255,255,.06);}
.qctext{font-family:"Noto Serif SC",serif;font-size:16px;line-height:1.7;}
.qcfoot{display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:12px;color:var(--muted);}
.qcact .link{font-size:12px;}
/* 读者库 · 搜索与筛选 */
.rsearch{margin:14px 0 8px;}
.rinp{width:100%;box-sizing:border-box;padding:11px 14px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass);color:var(--ui);font-family:"Noto Sans SC",sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s;}
.rinp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(var(--accent-rgb),.18);}
.qsubs{margin-top:-2px;}
.qp.sub{font-size:12px;padding:4px 11px;border-radius:13px;opacity:.85;}
.rstat{font-size:12px;margin:10px 2px 2px;}
.qtag{display:inline-block;font-size:11px;padding:2px 9px;border-radius:10px;margin:8px 6px 0 0;background:rgba(var(--accent-rgb),.14);color:var(--accent);}
.qtag.sub{background:rgba(255,255,255,.07);color:var(--muted);}
.qctags{margin-top:2px;}

/* 同步状态芯片（挂在各共享板的「在场感」一行） */
.sync-chip{margin-left:8px;font-size:11px;opacity:.85;}
.sync-chip.busy{color:var(--muted);}
.sync-chip.ok{color:var(--accent);}
.sync-chip.bad{color:#FFB877;}
.sync-chip.local{color:var(--muted);opacity:.7;}
/* 共笔墙「以谁的身份」提示 */
.wall-as{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:12px;color:var(--muted);line-height:1.5;}
.wall-as .avsvg{flex:0 0 auto;width:26px;height:26px;}
.wall-as b{color:var(--ui);font-weight:600;}

/* 共读接力 */
.rhero{margin-top:6px;}
.rthread{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-left:2px solid rgba(var(--accent-rgb),.5);border-radius:0 14px 14px 0;padding:14px 14px 14px 18px;margin-top:12px;font-family:"Noto Serif SC",serif;font-size:16px;line-height:2;max-height:34vh;overflow-y:auto;}
.rseg{display:inline;}
.ract{font-size:11px;}
/* 共读接力 · 光河（替代原漂浮光点 hero） */
.relay-river{position:relative;border-radius:var(--radius);overflow:hidden;background:linear-gradient(180deg,#0c201b 0%,#081511 58%,#05090c 100%);border:1px solid var(--glass-border);height:min(46vh,360px);margin-top:6px;touch-action:none;}
.relay-river>canvas{display:block;width:100%;height:100%;}
.relay-hint{position:absolute;left:0;right:0;bottom:10px;text-align:center;font-size:12px;color:rgba(220,235,228,.55);pointer-events:none;letter-spacing:.02em;}
.relay-reveal{position:absolute;left:50%;bottom:34px;transform:translateX(-50%) translateY(8px);max-width:86%;width:max-content;background:rgba(10,16,28,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(var(--accent-rgb),.35);border-radius:16px;padding:12px 16px;display:flex;gap:10px;align-items:center;opacity:0;transition:opacity .35s ease,transform .35s ease;pointer-events:none;}
.relay-reveal.on{opacity:1;transform:translateX(-50%) translateY(0);}
.relay-reveal .gr-av{flex:0 0 auto;width:34px;height:34px;border-radius:50%;overflow:hidden;background:rgba(var(--accent-rgb),.12);display:flex;align-items:center;justify-content:center;}
.relay-reveal .gr-body{max-width:320px;}
.relay-reveal .gr-text{font-size:14px;line-height:1.6;color:#eef5f0;}
.relay-reveal .gr-meta{margin-top:4px;font-size:11px;color:rgba(220,235,228,.55);}

/* 共笔墙 */
.wnote{position:relative;background:linear-gradient(160deg,rgba(255,250,235,.10),rgba(255,250,235,.04));border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:16px 14px 12px;margin-bottom:12px;transform:rotate(var(--rot,0deg));box-shadow:0 10px 26px -16px rgba(0,0,0,.7);transition:transform .25s;}
.wnote:hover{transform:rotate(0deg) scale(1.01);}
.wpn{position:absolute;top:-7px;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px rgba(var(--accent-rgb),.25),0 2px 4px rgba(0,0,0,.5);}
.wnum{position:absolute;top:8px;right:10px;font-size:11px;color:var(--muted);}
.wtext{font-size:14px;line-height:1.7;white-space:pre-wrap;word-break:break-word;}
.wfoot{display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:12px;}
.wlike{color:var(--muted);background:none;border:none;cursor:pointer;font-family:inherit;font-size:12px;}
.wlike.on{color:#FF9C9C;}

/* ============================================================================
 * 【全站规则】UI 永不遮挡主体内容
 * ---------------------------------------------------------------------------
 * 1) 任何 3D / 画布舞台加 class="qn-stage"；舞台内的浮层 UI（工具条 / 视图条 /
 *    提示 / 操作坞）一律再加 class="qn-ui"。
 * 2) 当舞台要「呈现主体内容」（读一句留言、展开一封信…）时，给舞台加 .reading，
 *    所有 .qn-ui 自动淡出让位，读完移除即复原。JS 请统一调用 stageReading()。
 * 3) 主体内容一律走 .qn-read 居中读物层：屏幕正中、避开安全区、字大可读，
 *    绝不贴底、绝不与任何 UI 抢位置。
 * 4) ⤢ 全屏沉浸 / ◌ 关闭界面 由 stageChrome() 统一提供，全站行为一致。
 * ========================================================================== */
.qn-ui{transition:opacity .42s ease,transform .42s ease;}
.qn-stage.reading .qn-ui{opacity:0!important;pointer-events:none!important;transform:translateY(10px);}
.qn-stage.noui .qn-ui{opacity:0;pointer-events:none;}
.qn-stage.noui .qn-top{opacity:.3;pointer-events:auto;}
.qn-stage.noui .qn-top:hover,.qn-stage.noui .qn-top:active{opacity:1;}
.qn-stage.fsmode{position:fixed;inset:0;z-index:9990;width:100vw!important;height:100vh!important;
  max-width:100vw;max-height:100vh;border-radius:0;border:none;margin:0;}
.qn-stage.fsmode>canvas{width:100%!important;height:100%!important;}
/* 舞台右上通用微控（全屏 / 关界面） */
.qn-top{position:absolute;right:10px;z-index:36;display:flex;gap:6px;
  top:calc(10px + env(safe-area-inset-top,0px));transition:opacity .35s ease;}
.qn-btn{width:34px;height:34px;border-radius:50%;border:1px solid var(--glass-border);
  background:rgba(10,18,26,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  color:var(--ui);font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;
  justify-content:center;padding:0;transition:background .2s,transform .15s;}
.qn-btn:active{background:rgba(var(--accent-rgb),.22);transform:scale(.92);}
/* 居中读物层：主体内容的唯一容身处 */
.qn-read{position:absolute;inset:0;z-index:34;display:flex;align-items:center;justify-content:center;
  padding:calc(58px + env(safe-area-inset-top,0px)) 20px calc(58px + env(safe-area-inset-bottom,0px));
  opacity:0;visibility:hidden;pointer-events:none;box-sizing:border-box;
  transition:opacity .5s ease,visibility .5s;
  background:radial-gradient(115% 85% at 50% 50%,rgba(4,10,14,.18) 0%,rgba(4,10,14,.62) 72%,rgba(4,10,14,.80) 100%);}
.qn-read.on{opacity:1;visibility:visible;pointer-events:auto;}

/* 漂流瓶 */
.bottleSea{position:relative;border-radius:var(--radius);overflow:hidden;background:linear-gradient(180deg,#0d2630,#06141a);border:1px solid var(--glass-border);}
/* 漂流瓶 3D 舞台 + 视图切换 */
.bottle-stage{position:relative;border-radius:var(--radius);overflow:hidden;background:linear-gradient(180deg,#0d2630 0%,#081820 60%,#04101a 100%);border:1px solid var(--glass-border);height:min(52vh,400px);cursor:grab;touch-action:none;}
.bottle-stage:active{cursor:grabbing;}
.bottle-stage>canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}
.bt-hint{position:absolute;left:0;right:0;bottom:78px;text-align:center;font-size:12px;color:rgba(220,235,228,.5);pointer-events:none;}
.bt-toggle{display:flex;gap:8px;margin-top:10px;}
.bt-toggle span{flex:1;text-align:center;font-size:13px;padding:8px 0;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid var(--glass-border);color:var(--muted);cursor:pointer;transition:.2s;}
.bt-toggle span.on{background:rgba(var(--accent-rgb),.16);border-color:rgba(var(--accent-rgb),.5);color:var(--ui);}
.bottle-card{display:flex;flex-direction:column;align-items:center;gap:8px;background:rgba(255,255,255,.05);border:1px solid rgba(var(--accent-rgb),.3);border-radius:16px;padding:18px;margin-bottom:12px;animation:qflip .5s ease both;}
.bottle-card.throw{animation:bthrow 1.1s cubic-bezier(.4,0,.3,1) both;}
@keyframes bthrow{0%{opacity:1;transform:translateY(0) rotate(0)}60%{opacity:1;transform:translateY(-26px) rotate(-6deg)}100%{opacity:0;transform:translateY(-60px) rotate(-12deg)}}
.bottle-svg{width:40px;height:58px;}
.bottle-text{font-family:"Noto Serif SC",serif;font-size:16px;line-height:1.6;text-align:center;}
.bottle-meta{font-size:12px;color:var(--muted);}
/* 漂流瓶 · 画布内玻璃操作坞 */
.bottle-dock{position:absolute;left:14px;right:14px;bottom:14px;z-index:4;display:flex;gap:10px;justify-content:center;align-items:center;padding:7px;background:rgba(255,255,255,.10);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.16);border-radius:36px;box-shadow:0 8px 24px rgba(0,0,0,.25);}
.bottle-dock button{flex:1;max-width:120px;height:44px;border-radius:22px;border:none;font-size:15px;font-family:"Noto Sans SC",sans-serif;cursor:pointer;transition:transform .12s,background .15s;}
.bottle-dock button:active{transform:scale(.96);}
.bottle-dock .primary{background:#9FE3BE;color:#0A0F0D;font-weight:600;box-shadow:0 0 16px rgba(159,227,190,.45);}
.bottle-dock .ghost{background:rgba(255,255,255,.08);color:#EAF1EC;border:1px solid rgba(255,255,255,.16);}
.bottle-dock .ghost:active{background:rgba(255,255,255,.14);}
/* ============================================================================
 * 漂流瓶 · 开瓶 —— 做旧卷轴（木轴 + 泛黄纸 + 霉斑 + 焦边 + 展开动画）
 * 遵循全站规则：信文居中呈现，展开时舞台上的坞/提示全部让位，绝不遮挡。
 * ========================================================================== */
.bottle-reveal{position:fixed;inset:0;z-index:9995;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:calc(30px + env(safe-area-inset-top,0px)) 16px calc(24px + env(safe-area-inset-bottom,0px));
  box-sizing:border-box;opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .4s ease,visibility .4s;
  background:radial-gradient(120% 90% at 50% 46%,rgba(4,12,18,.24) 0%,rgba(4,12,18,.72) 74%,rgba(3,9,14,.88) 100%);}
.bottle-reveal.open{opacity:1;visibility:visible;pointer-events:auto;}
.scroll-wrap{position:relative;width:min(420px,92vw);display:flex;flex-direction:column;align-items:center;
  opacity:0;transform:translateY(10px);transition:opacity .4s ease,transform .5s cubic-bezier(.2,.85,.25,1);}
.bottle-reveal.open .scroll-wrap{opacity:1;transform:none;animation:scSway 9s ease-in-out 1.1s infinite;}
@keyframes scSway{0%,100%{transform:rotate(-.25deg)}50%{transform:rotate(.25deg)}}
/* 木轴 */
.scroll-rod{position:relative;width:100%;height:17px;border-radius:9px;flex:0 0 auto;z-index:2;
  background:linear-gradient(180deg,#7A5630 0%,#5A3C20 34%,#3A2512 72%,#2A1A0C 100%);
  box-shadow:0 3px 12px rgba(0,0,0,.55),inset 0 1px 0 rgba(214,170,110,.45),inset 0 -2px 5px rgba(0,0,0,.5);}
.scroll-rod::before,.scroll-rod::after{content:"";position:absolute;top:50%;width:15px;height:23px;
  border-radius:5px;transform:translateY(-50%);
  background:linear-gradient(180deg,#8A6338 0%,#5A3C20 50%,#33200F 100%);
  box-shadow:0 2px 7px rgba(0,0,0,.5),inset 0 1px 0 rgba(220,178,118,.4);}
.scroll-rod::before{left:-9px;}
.scroll-rod::after{right:-9px;}
/* 卷起 → 展开 */
.scroll-clip{position:relative;width:calc(100% - 14px);max-height:0;overflow:hidden;z-index:1;
  transition:max-height .92s cubic-bezier(.16,.86,.3,1);}
.bottle-reveal.open .scroll-clip{max-height:min(58vh,470px);}
.scroll-paper{position:relative;padding:26px 24px 22px;
  clip-path:polygon(0% 1.2%,2.2% 0%,26% .9%,52% 0%,74% 1%,97.6% 0%,100% 1.4%,99.2% 26%,100% 51%,99.1% 76%,100% 98.6%,97.4% 100%,73% 99.1%,49% 100%,25% 99%,2.4% 100%,0% 98.4%,.9% 74%,0% 50%,1% 25%);
  background-color:#EAD9B4;
  background-image:
    radial-gradient(120% 100% at 30% 12%,rgba(255,250,235,.7),transparent 55%),
    radial-gradient(120% 120% at 82% 92%,rgba(150,110,55,.16),transparent 60%),
    radial-gradient(90% 72% at 50% 50%,transparent 42%,rgba(120,86,40,.12) 78%,rgba(70,44,16,.32) 100%),
    linear-gradient(168deg,#F3E8CC,#E6D4AB);
  background-size:cover;
  background-position:center;
  background-repeat:no-repeat;
  box-shadow:inset 0 9px 16px -8px rgba(58,34,10,.5),inset 0 -9px 16px -8px rgba(58,34,10,.5),
             inset 0 0 0 1px rgba(120,88,44,.16),0 16px 44px rgba(0,0,0,.45);}
/* 纸纤维颗粒 */
.scroll-paper::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.34;
  mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='.42'/%3E%3C/svg%3E");}
/* 竖向折痕 */
.scroll-paper::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
  background:repeating-linear-gradient(90deg,transparent 0 68px,rgba(96,64,26,.09) 68px 69px,rgba(255,248,226,.35) 69px 70px,transparent 70px 138px);}
.scroll-inner{position:relative;z-index:2;max-height:calc(min(58vh,470px) - 48px);overflow-y:auto;-webkit-overflow-scrolling:touch;
  opacity:0;transition:opacity .5s ease .42s;}
.bottle-reveal.open .scroll-inner{opacity:1;}
.bottle-reveal .paper-mark{font-family:"Noto Serif SC",serif;font-size:38px;line-height:.8;color:rgba(112,76,32,.34);}
.bottle-reveal .paper-text{font-family:"Noto Serif SC",serif;font-size:clamp(16px,4.4vw,20px);line-height:1.95;
  color:#33291B;white-space:pre-wrap;word-break:break-word;margin-top:8px;
  text-shadow:0 1px 0 rgba(255,250,232,.55);}
.bottle-reveal .paper-rule{height:1px;margin:18px 0 12px;
  background:linear-gradient(90deg,transparent,rgba(110,76,34,.28),transparent);}
.bottle-reveal .paper-author{text-align:right;font-family:"Noto Serif SC",serif;font-size:13.5px;color:#6B563A;}
.bottle-reveal .paper-time{margin-top:4px;text-align:right;font-size:11px;color:#8A755A;}
.bottle-reveal .paper-footer{margin-top:8px;text-align:center;font-size:12px;color:#8A755A;}
.bottle-reveal .paper-footer .link{color:#7A5F3C;}
.bottle-reveal .paper-footer .link.warn{color:#9C5A46;}
/* 动作区（在卷轴外，永不压字） */
.bottle-reveal .paper-actions{display:flex;gap:10px;margin-top:16px;width:min(420px,92vw);}
.bottle-reveal .paper-actions button{flex:1;height:44px;border-radius:22px;border:none;font-size:14px;
  font-family:"Noto Sans SC",sans-serif;cursor:pointer;transition:transform .1s,background .2s;}
.bottle-reveal .paper-actions button:active{transform:scale(.96);}
.bottle-reveal .paper-actions .ghost{background:rgba(240,232,210,.14);color:#E8DFC8;border:1px solid rgba(240,232,210,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);}
.bottle-reveal .paper-actions .primary{background:#9FE3BE;color:#0A0F0D;font-weight:600;box-shadow:0 0 18px rgba(159,227,190,.35);}
/* 漂流瓶 · 画布内写留言浮层 */
.bottle-composer{position:absolute;left:14px;right:14px;bottom:86px;z-index:6;background:rgba(10,15,13,.82);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:16px;opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s,transform .25s;transform:translateY(10px);}
.bottle-composer.open{opacity:1;visibility:visible;transform:translateY(0);}
.bottle-composer textarea{width:100%;min-height:96px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:12px;color:#EAF1EC;font-family:"Noto Sans SC",sans-serif;font-size:15px;line-height:1.6;resize:none;outline:none;box-sizing:border-box;}
.bottle-composer textarea::placeholder{color:#9DB0A6;}
.bottle-composer .row{display:flex;gap:10px;justify-content:flex-end;margin-top:12px;}
.bottle-composer button{height:38px;border-radius:19px;padding:0 18px;border:none;font-size:14px;font-family:"Noto Sans SC",sans-serif;cursor:pointer;transition:transform .1s;}
.bottle-composer button:active{transform:scale(.96);}
.bottle-composer .cancel{background:rgba(255,255,255,.08);color:#EAF1EC;border:1px solid rgba(255,255,255,.14);}
.bottle-composer .send{background:#9FE3BE;color:#0A0F0D;font-weight:600;}
.bottle-composer .send:disabled{opacity:.5;cursor:not-allowed;}
/* 开瓶动画（点瓶子后先播这一段，再展开卷轴，保证「先开瓶、卷轴才出来」一气呵成） */
.bottle-pop{position:fixed;inset:0;z-index:9994;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;
  background:radial-gradient(120% 90% at 50% 50%,rgba(4,12,18,.30),rgba(3,9,14,.78));}
.bottle-pop.play{animation:popFade .95s ease forwards;}
@keyframes popFade{0%{opacity:0}12%{opacity:1}78%{opacity:1}100%{opacity:0}}
.pop-stage{position:relative;width:200px;height:240px;display:flex;align-items:center;justify-content:center;}
.pop-glow{position:absolute;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(255,228,170,.6),rgba(255,210,150,.12) 45%,transparent 70%);opacity:0;transform:scale(.6);}
.bottle-pop.play .pop-glow{animation:popGlow .95s ease forwards;}
@keyframes popGlow{0%{opacity:0;transform:scale(.6)}42%{opacity:.95;transform:scale(1)}100%{opacity:0;transform:scale(1.3)}}
.pop-bottle{position:relative;width:82px;height:158px;transform:translateY(8px) scale(.92);}
.bottle-pop.play .pop-bottle{animation:popBottle .95s cubic-bezier(.2,.8,.25,1) forwards;}
@keyframes popBottle{0%{transform:translateY(8px) scale(.92);opacity:0}14%{opacity:1}55%{transform:translateY(0) scale(1)}100%{transform:translateY(-16px) scale(1.03);opacity:0}}
.pop-body{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:82px;height:122px;border-radius:32px 32px 36px 36px;
  background:linear-gradient(135deg,rgba(196,238,224,.5),rgba(120,190,170,.26));border:1px solid rgba(222,246,236,.5);
  box-shadow:inset 0 0 24px rgba(180,255,235,.35),0 10px 30px rgba(0,0,0,.4);}
.pop-neck{position:absolute;top:14px;left:50%;transform:translateX(-50%);width:28px;height:32px;
  background:linear-gradient(135deg,rgba(196,238,224,.46),rgba(120,190,170,.22));border:1px solid rgba(222,246,236,.45);border-radius:6px 6px 0 0;}
.pop-cork{position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:24px;height:22px;border-radius:5px;
  background:linear-gradient(180deg,#b58e57,#7a5630);box-shadow:inset 0 1px 0 rgba(222,182,122,.5);}
.bottle-pop.play .pop-cork{animation:popCork .95s cubic-bezier(.2,.8,.25,1) forwards;}
@keyframes popCork{0%{transform:translate(-50%,0) rotate(0);opacity:1}30%{transform:translate(-50%,-2px) rotate(-4deg)}60%{transform:translate(-50%,-36px) rotate(12deg);opacity:1}100%{transform:translate(-50%,-56px) rotate(22deg);opacity:0}}
/* 通用「画面内」玻璃操作坞 + 写话浮层（微光 / 接力 / 看海 / 同步呼吸 共用） */
.scene-dock{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:8;display:flex;gap:10px;justify-content:center;align-items:center;padding:7px;width:min(360px,calc(100% - 28px));background:rgba(255,255,255,.10);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.16);border-radius:36px;box-shadow:0 8px 24px rgba(0,0,0,.28);}
.scene-dock button{flex:1;max-width:200px;height:44px;border-radius:22px;border:none;font-size:15px;font-family:'Noto Sans SC',sans-serif;cursor:pointer;transition:transform .12s,background .15s;}
.scene-dock button:active{transform:scale(.96);}
.scene-dock .primary{background:#9FE3BE;color:#0A0F0D;font-weight:600;box-shadow:0 0 16px rgba(159,227,190,.4);}
.scene-dock .ghost{background:rgba(255,255,255,.08);color:#EAF1EC;border:1px solid rgba(255,255,255,.16);}
.scene-composer{position:fixed;left:50%;transform:translateX(-50%) translateY(10px);bottom:76px;z-index:9;width:min(380px,calc(100% - 28px));background:rgba(10,15,13,.86);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:16px;opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s,transform .25s;}
.scene-composer.open{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0);}
.scene-composer textarea{width:100%;min-height:92px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:12px;color:#EAF1EC;font-family:'Noto Sans SC',sans-serif;font-size:15px;line-height:1.6;resize:none;outline:none;box-sizing:border-box;}
.scene-composer textarea::placeholder{color:#9DB0A6;}
.scene-composer .row{display:flex;gap:10px;justify-content:flex-end;margin-top:12px;}
.scene-composer button{height:38px;border-radius:19px;padding:0 18px;border:none;font-size:14px;font-family:'Noto Sans SC',sans-serif;cursor:pointer;transition:transform .1s;}
.scene-composer button:active{transform:scale(.96);}
.scene-composer .cancel{background:rgba(255,255,255,.08);color:#EAF1EC;border:1px solid rgba(255,255,255,.14);}
.scene-composer .send{background:#9FE3BE;color:#0A0F0D;font-weight:600;}
.btn.ghost{background:rgba(255,255,255,.08);color:#EAF1EC;border:1px solid rgba(255,255,255,.16);}
.bt-load-note{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;font-size:13px;color:#EAF1EC;background:rgba(10,15,13,.6);border:1px solid var(--glass-border);padding:9px 18px;border-radius:999px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);pointer-events:none;z-index:7;box-shadow:0 6px 22px rgba(0,0,0,.35);}

/* 微光留言 */
.glowHero{border-radius:var(--radius);overflow:hidden;background:radial-gradient(120% 120% at 50% 0%,#15203a,#070b16);border:1px solid var(--glass-border);}
.glowcard{background:rgba(var(--accent-rgb),.06);border:1px solid rgba(var(--accent-rgb),.25);border-radius:14px;padding:14px;margin-bottom:10px;animation:gpulse 4s ease-in-out infinite;}
/* 可交互星空 */
.glow-stage{position:relative;border-radius:var(--radius);overflow:hidden;background:radial-gradient(130% 130% at 50% 12%,#15203a 0%,#0a1024 45%,#05070f 100%);border:1px solid var(--glass-border);height:min(68vh,540px);cursor:grab;touch-action:none;}
.glow-stage:active{cursor:grabbing;}
.glow-stage>canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}
/* 顶右：沉浸 + 关闭UI */
.sky-top{position:absolute;right:10px;top:10px;z-index:5;display:flex;gap:6px;}
.sky-btn{width:34px;height:34px;border-radius:50%;border:1px solid var(--glass-border);background:rgba(10,18,26,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:var(--ui);font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:background .2s,transform .15s;}
.sky-btn:active{background:rgba(var(--accent-rgb),.22);transform:scale(.92);}
/* 右下：缩放 */
.sky-zoom{position:absolute;right:10px;bottom:62px;z-index:4;display:flex;flex-direction:column;gap:6px;}
.sky-zoom button{width:34px;height:34px;border-radius:50%;border:1px solid var(--glass-border);background:rgba(10,18,26,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:var(--ui);font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;}
.sky-zoom button:active{background:rgba(var(--accent-rgb),.22);}
/* 底部：视图切换条 */
.sky-bar{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:4;display:flex;gap:6px;flex-wrap:wrap;justify-content:center;max-width:94%;}
.sky-tab{padding:6px 12px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(10,18,26,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:var(--ui);font-size:13px;cursor:pointer;transition:.2s;white-space:nowrap;}
.sky-tab.on{background:rgba(var(--accent-rgb),.22);border-color:rgba(var(--accent-rgb),.9);color:#dff6e8;}
.sky-tab:active{transform:scale(.95);}
.glow-hint{position:absolute;left:12px;top:12px;font-size:12px;color:rgba(220,235,228,.55);pointer-events:none;letter-spacing:.02em;text-shadow:0 1px 4px rgba(0,0,0,.45);transition:opacity .5s ease;max-width:60%;}
/* 全屏沉浸 / 关闭界面：统一由 .qn-stage 规则接管（见文件上方「全站规则」） */
.glow-stage.fsmode{height:100vh!important;}
.glow-stage.fsmode .sky-bar{bottom:calc(18px + env(safe-area-inset-bottom,0px));}
.glow-reveal{position:absolute;left:50%;bottom:34px;transform:translateX(-50%) translateY(8px);max-width:86%;width:max-content;background:rgba(10,16,28,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(var(--accent-rgb),.35);border-radius:16px;padding:12px 16px;display:flex;gap:10px;align-items:center;opacity:0;transition:opacity .35s ease,transform .35s ease;pointer-events:none;}
.glow-reveal.on{opacity:1;transform:translateX(-50%) translateY(0);}
.glow-reveal .gr-av{flex:0 0 auto;width:34px;height:34px;border-radius:50%;overflow:hidden;background:rgba(var(--accent-rgb),.12);display:flex;align-items:center;justify-content:center;}
.glow-reveal .gr-av img{width:100%;height:100%;object-fit:cover;}
.glow-reveal .gr-av svg{width:26px;height:26px;}
.glow-reveal .gr-body{max-width:320px;}
.glow-reveal .gr-text{font-size:14px;line-height:1.6;color:#eef5f0;}
.glow-reveal .gr-meta{margin-top:4px;font-size:11px;color:rgba(220,235,228,.55);}
/* 3D 星穹（glow-sky.js）—— 抬头看「全部」的星 */
.sky-holder{position:absolute;inset:0;z-index:1;}
.sky-holder canvas{display:block;width:100%!important;height:100%!important;}
.glow-stage .glow-hint{z-index:2;}
/* 微光读句 —— 居中读物层（遵循全站规则：句子在正中央，UI 自动让位） */
.sky-reveal{cursor:pointer;}
.sky-reveal .sr-card{position:relative;max-width:min(560px,88vw);width:100%;text-align:center;
  transform:translateY(14px) scale(.985);opacity:0;
  transition:transform .62s cubic-bezier(.2,.85,.25,1),opacity .52s ease;}
.sky-reveal.on .sr-card{transform:none;opacity:1;}
.sky-reveal .sr-halo{position:absolute;left:50%;top:50%;width:min(360px,72vw);height:min(360px,72vw);
  transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(var(--accent-rgb),.16) 0%,rgba(var(--accent-rgb),.05) 42%,transparent 70%);
  animation:srHalo 6s ease-in-out infinite;}
@keyframes srHalo{0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}}
.sky-reveal .sr-mark{position:relative;font-family:"Noto Serif SC",serif;font-size:44px;line-height:1;
  color:rgba(var(--accent-rgb),.42);margin-bottom:6px;}
.sky-reveal .sr-text{position:relative;font-family:"Noto Serif SC",serif;
  font-size:clamp(19px,5.4vw,29px);line-height:1.9;letter-spacing:.03em;color:#F2F8F4;
  text-shadow:0 2px 18px rgba(0,0,0,.55),0 0 34px rgba(var(--accent-rgb),.18);
  white-space:pre-wrap;word-break:break-word;
  max-height:52vh;overflow-y:auto;-webkit-overflow-scrolling:touch;}
.sky-reveal .sr-line{position:relative;width:56px;height:1px;margin:20px auto 14px;
  background:linear-gradient(90deg,transparent,rgba(var(--accent-rgb),.55),transparent);}
.sky-reveal .sr-meta{position:relative;font-size:12.5px;color:rgba(220,235,228,.62);letter-spacing:.05em;}
.sky-reveal .sr-rep{display:inline-block;margin-left:8px;color:rgba(var(--accent-rgb),.75);cursor:pointer;text-decoration:underline;}
.sky-reveal .sr-again{position:relative;display:inline-block;margin-top:20px;padding:8px 20px;
  border-radius:20px;border:1px solid rgba(var(--accent-rgb),.42);background:rgba(10,20,26,.5);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  color:rgba(var(--accent-rgb),.95);font-size:13px;letter-spacing:.06em;cursor:pointer;transition:.2s;}
.sky-reveal .sr-again:active{transform:scale(.95);background:rgba(var(--accent-rgb),.2);}
.sky-reveal .sr-tip{position:relative;margin-top:16px;font-size:11.5px;letter-spacing:.14em;
  color:rgba(220,235,228,.34);animation:srTip 3.4s ease-in-out infinite;}
@keyframes srTip{0%,100%{opacity:.34}50%{opacity:.72}}
@keyframes gpulse{0%,100%{box-shadow:0 0 0 0 rgba(var(--accent-rgb),0);opacity:.92}50%{box-shadow:0 0 22px 2px rgba(var(--accent-rgb),.22);opacity:1}}
.glowtext{font-size:15px;line-height:1.7;}
.glowact{margin-top:6px;font-size:12px;}

/* 同看一片海 */
.wssea{position:relative;border-radius:var(--radius);overflow:hidden;background:linear-gradient(180deg,#bfe3ef 0%,#7fb9cf 38%,#3f7d9a 70%,#21506a 100%);border:1px solid var(--glass-border);}
.wssea #ws-cv{height:260px;display:block;}
.ws-sun{position:absolute;top:14px;left:50%;width:54px;height:54px;margin-left:-27px;border-radius:50%;background:radial-gradient(circle,#fff6d8,#ffd98a 60%,rgba(255,217,138,0));filter:blur(1px);opacity:.9;}
.wscard{background:rgba(255,255,255,.85);color:#0d2a38;border-radius:14px;padding:12px 14px;margin-bottom:10px;animation:wbob 5s ease-in-out infinite;}
@keyframes wbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.wstext{font-size:14px;line-height:1.6;color:#0d2a38;}
.wsact{margin-top:4px;font-size:12px;}
.wscard .link{color:#2a6b86;}

/* ===== 海滩环境音启动提示（beach-audio.js，独立附加）===== */
.bz-audio-hint{position:absolute;left:0;right:0;bottom:0;z-index:9;display:flex;align-items:center;justify-content:center;height:48px;cursor:pointer;color:#eaf3ee;font-size:13px;letter-spacing:.16em;background:linear-gradient(0deg,rgba(4,12,18,.60),rgba(4,12,18,0));animation:bsglow 3.4s ease-in-out infinite;}
.bz-audio-hint span{padding:7px 16px;border-radius:20px;border:1px solid rgba(255,255,255,.22);background:rgba(10,20,28,.42);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}
@keyframes bsglow{0%,100%{opacity:.62}50%{opacity:1}}
/* ===== 3D 海滩控制浮层（全屏 / 重置视角 / 4 阶段 / 时间进度条 / 隐藏功能）===== */
#ws-cv:fullscreen{width:100vw!important;height:100vh!important;background:#04080c;overflow:hidden;border-radius:0;}

/* 同看一片海 · 全屏横屏：竖屏手机上把海面强制转为横屏铺满，保证完整
   （不依赖屏幕方向锁，iframe / iOS 也能生效） */
.bz-stage{position:absolute;inset:0;overflow:hidden;}
#ws-cv.ws-land{position:fixed;inset:0;z-index:99999;background:#04080c;overflow:hidden;width:100vw!important;height:100vh!important;}
@media (orientation: portrait){
  #ws-cv.ws-land .bz-stage{top:50%;left:50%;right:auto;bottom:auto;width:100vh;height:100vw;transform:translate(-50%,-50%) rotate(90deg);}
}
@media (orientation: landscape){
  #ws-cv.ws-land .bz-stage{position:absolute;inset:0;}
}
.beach-ui{position:absolute;inset:0;z-index:7;pointer-events:none;transition:opacity .6s ease;}
.beach-ui .bz-quick{position:absolute;bottom:16px;right:16px;display:flex;gap:8px;pointer-events:auto;}
.beach-ui .bz-quick button{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(10,20,30,.5);color:#fff;font-size:18px;cursor:pointer;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;transition:transform .15s,background .2s;}
.beach-ui .bz-quick button:active{transform:scale(.92);}
.beach-ui .bz-panel{pointer-events:auto;position:absolute;bottom:66px;right:16px;width:190px;padding:12px;border-radius:14px;background:rgba(10,20,30,.6);border:1px solid rgba(255,255,255,.2);color:#eef;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);box-shadow:0 8px 30px rgba(0,0,0,.35);transition:opacity .5s ease,transform .5s ease;}
.beach-ui .bz-panel[hidden]{display:none;}
.beach-ui .bz-panel.bz-hidden{opacity:0;pointer-events:none;transform:translateY(8px);}
.beach-ui .bz-sync{display:flex;align-items:center;gap:6px;font-size:12px;opacity:.9;cursor:pointer;}
.beach-ui .bz-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;}
.beach-ui .bz-stages{display:flex;gap:6px;margin-bottom:10px;}
.beach-ui .bz-stages button{flex:1;padding:6px 0;border-radius:9px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#eef;font-size:13px;cursor:pointer;}
.beach-ui .bz-stages button:hover{background:rgba(255,255,255,.18);}
.beach-ui .bz-time{width:100%;margin:2px 0 8px;accent-color:#ffd58a;}
.beach-ui .bz-clock{font-size:12px;opacity:.8;margin-bottom:8px;font-variant-numeric:tabular-nums;}

/* 同步呼吸 */
.sbwrap{display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0 4px;}
.sbreath{width:200px;height:200px;position:relative;}
.sbreath canvas{width:100%;height:100%;display:block;}
.sbphase{font-family:"Noto Serif SC",serif;font-size:17px;color:var(--accent);letter-spacing:.1em;}
.sbguide{font-size:12px;color:var(--muted);}
.sbnote{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;margin-bottom:8px;}
.sbdot{width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px rgba(var(--accent-rgb),.6);animation:gpulse 4s ease-in-out infinite;flex:0 0 auto;}
.sbtext{font-size:14px;line-height:1.6;flex:1;}
.sbact{font-size:12px;}

/* 管理端列表（各板块共用） */
.bmod{margin-top:16px;border-top:1px dashed rgba(255,255,255,.15);padding-top:12px;}
.bmod-t{font-size:12px;color:var(--accent);margin-bottom:8px;}
.bmod-item{display:flex;justify-content:space-between;gap:10px;font-size:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06);}
.bmod-text{color:var(--muted);white-space:pre-wrap;word-break:break-word;flex:1;}

/* 帖子卡片（带头像，各公共板块共用） */
.pcard{display:flex;gap:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;margin-bottom:10px;animation:pcin .4s ease both;}
.pc-av{flex:0 0 auto;width:30px;height:30px;}
.avsvg{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:rgba(var(--accent-rgb),.12);color:var(--accent);overflow:hidden;}
.avsvg .i-svg{width:20px;height:20px;}
.avsvg.av-img{background-size:cover;background-position:center;}
.avsvg.av-img img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.avsvg.av-ini{font-size:13px;font-weight:600;}
.pc-body{flex:1;min-width:0;}
.pc-top{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;}
.pc-name{font-size:13px;color:var(--ui);font-weight:600;}
.pc-time{font-size:11px;color:var(--muted);}
.pc-text{font-size:14px;line-height:1.6;margin-top:3px;word-break:break-word;}
.pc-act{margin-top:6px;font-size:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
@keyframes pcin{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}

/* 在场感提示条 */
.presence{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);margin:8px 2px 2px;}
.presence-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px rgba(var(--accent-rgb),.7);animation:gpulse 3s ease-in-out infinite;}

/* 公共头像选择（共笔墙 · 全网共笔） */
.avpick{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 4px;}
.avpick .av{width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);cursor:pointer;transition:.2s;color:var(--ui);overflow:hidden;}
.avpick .av .i-svg{width:20px;height:20px;}
.avpick .av.on{border-color:var(--accent);background:rgba(var(--accent-rgb),.18);box-shadow:0 0 0 2px rgba(var(--accent-rgb),.25);}
.avpick .av.up{color:var(--muted);font-size:9px;text-align:center;line-height:1.15;flex-direction:column;padding:2px;}
.avpick .av.up img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.avpick .av.up span{display:block;}

/* 全网共笔墙分区 */
.pubwall{margin-top:18px;border-top:1px dashed rgba(255,255,255,.16);padding-top:14px;}
.sec-title{font-family:"Noto Serif SC",serif;font-size:15px;color:var(--ui);margin-bottom:6px;display:flex;align-items:center;gap:6px;}
.sec-sub{font-size:12px;color:var(--muted);margin-bottom:8px;line-height:1.5;}
.fld{width:100%;box-sizing:border-box;background:rgba(255,255,255,.05);border:1px solid var(--glass-border);border-radius:10px;padding:10px 12px;color:var(--ui);font-size:14px;font-family:inherit;margin-top:8px;}
.fld::placeholder{color:var(--muted);}

/* 微光留言 · 卡片柔光（替代旧 glowcard，统一用 pcard.glowcard） */
.pcard.glowcard{background:rgba(var(--accent-rgb),.07);border:1px solid rgba(var(--accent-rgb),.28);box-shadow:0 0 18px rgba(var(--accent-rgb),.10);animation:glowin .55s ease both, gpulse 5s ease-in-out infinite;}
@keyframes glowin{from{opacity:0;transform:translateY(10px) scale(.98);}to{opacity:1;transform:none;}}
.glow-list{display:flex;flex-direction:column;gap:2px;}

/* 同步呼吸 · 治愈短句（带感受 / 解释，以你的感受为主） */
.breath-thought{margin-top:14px;min-height:66px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;padding:0 12px;}
.bt-text{font-family:"Noto Serif SC",serif;font-size:16px;color:var(--ui);letter-spacing:.04em;line-height:1.5;}
.bt-feel{font-size:12px;color:var(--muted);line-height:1.5;max-width:300px;}
.bt-in{animation:btin .8s ease both;}
@keyframes btin{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}

/* 漂流瓶 · 署名与头像居中 */
.bt-av{margin:2px auto 0 !important;}
.bottle-name{font-size:12px;color:var(--accent);font-weight:600;margin-top:2px;}

/* 共读接力 · 帖子在故事流里的间距 */
.rthread .pcard{margin-bottom:8px;}

/* ===== 移植模块样式 garden/stone/growth/capsule/ritual ===== */
/* ===== calm-nature original module CSS (garden/stone/growth/capsule/ritual) ===== */
/* 来源：C:/Users/ZeroEnt/WorkBuddy/2026-07-26-21-47-36/calm-nature/index.html
   <style> 块（第 20-1425 行）中与这 5 个模块相关的规则，逐字摘录，未做改写。
   仅摘取相关规则，未导出整份样式表。 */

/* ---------- 原站 :root 中被下列规则实际用到的变量 ---------- */
/* 原文位置：第 22-48 行（基础 token） */

/* 原文第 1135 行：后置覆盖，最终 --accent 生效值为 #7fd1a0
   注意：原站此处只改了 --accent，未同步改 --accent-rgb，
   所以 rgba(var(--accent-rgb),...) 仍然是 184,224,200 那一支。原样保留。 */


/* ⚠ 未定义变量：.mod-btn.ghost 使用了 var(--text)，原站 :root 与全文均未定义 --text，
   该声明在原站即为 invalid at computed-value time（color 退化为 inherit）。原样保留。 */


/* ================= garden ================= */
/* 第 1334-1336 行 */
.nc-hero{ display:block; width:100%; height:172px; border-radius:18px; margin:6px 0 16px; background:#06121c; box-shadow: inset 0 0 40px rgba(0,0,0,.45), 0 8px 30px rgba(0,0,0,.3); }
.nc-hero.tall{ height:230px; }
.nc-hero.tall#gd-cv{ height:300px; background:linear-gradient(180deg,#bfe6f2 0%,#dff3e0 58%,#3f7a4e 100%); }

/* 第 1358-1359 行 */
.garden-stat{ display:flex; gap:14px; margin:8px 0; font-size:13px; opacity:.8; }
.garden-stat b{ font-size:20px; color:var(--accent); display:block; }


/* ================= stone ================= */
/* 第 1304-1310 行 */
.stone-scene{position:relative;height:210px;margin:14px 0;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,#0a1a2a,#06121d);display:flex;align-items:flex-end;justify-content:center}
.stone-water{position:absolute;left:0;right:0;bottom:0;height:64px;background:radial-gradient(120% 100% at 50% 100%,rgba(120,180,200,.28),transparent);animation:wave 4.5s ease-in-out infinite}
.stone-shore{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(180deg,#1a2a20,#0c1812)}
.stone-pebble{position:absolute;bottom:48px;left:50%;transform:translateX(-50%);max-width:74%;padding:12px 16px;background:rgba(20,30,26,.92);border:1px solid var(--glass-border);border-radius:14px;color:var(--ui);font-size:14px;text-align:center;line-height:1.5;box-shadow:0 6px 22px rgba(0,0,0,.45);transition:all .7s cubic-bezier(.2,.8,.2,1)}
.stone-pebble.ashore{bottom:62px;background:linear-gradient(160deg,#274033,#16271d);box-shadow:0 0 26px rgba(var(--accent-rgb),.55);border-color:rgba(var(--accent-rgb),.6)}
.stone-scene.done .stone-water{display:none}
@keyframes wave{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}


/* ================= growth ================= */
/* 第 1316-1317 行 */
.rev-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px dashed rgba(var(--accent-rgb),.18);font-size:13px;color:var(--muted)}
.rev-row b{color:var(--ui)}

/* 第 1319-1320 行 */
.grow-tree{display:flex;justify-content:center;margin:10px 0}
.grow-name{text-align:center;font-size:16px;color:var(--ui);margin:6px 0;font-weight:600}

/* 第 1377-1399 行 */
.grow-how{margin-top:8px;background:var(--glass);border:1px solid var(--glass-border);border-radius:14px;padding:12px 14px}
.grow-how .gh-t{font-size:12px;letter-spacing:.1em;color:var(--muted);margin-bottom:8px}
.grow-how .gh-row{display:flex;justify-content:space-between;font-size:13px;padding:3px 0;color:var(--ui)}
.grow-how .gh-row b{color:var(--accent)}
.grow-tree{animation:treeSway 4s ease-in-out infinite;transform-origin:bottom center}
.gt-svg{transform-box:fill-box;transform-origin:bottom center;overflow:visible}
.gt-grow{transform-box:fill-box;transform-origin:bottom center;animation:growIn 1.6s cubic-bezier(.2,.8,.2,1) both}
.gt-leaves{animation:leavesIn 1.1s ease .55s both}
@keyframes growIn{0%{transform:scaleY(.02);opacity:0}55%{opacity:1}100%{transform:scaleY(1);opacity:1}}
@keyframes leavesIn{0%,55%{opacity:0}100%{opacity:1}}
.grow-season{text-align:center;font-size:12px;color:var(--muted);margin:2px 0 4px}
.grow-species{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:8px 0}
.gs-btn{padding:6px 14px;border-radius:20px;font-size:13px;color:var(--muted);background:var(--glass);border:1px solid var(--glass-border);cursor:pointer;transition:all .2s}
.gs-btn.on{color:#fff;background:var(--accent);border-color:var(--accent)}
.grow-bar{height:8px;border-radius:6px;background:rgba(var(--accent-rgb),.16);overflow:hidden;margin:10px 0}
.grow-bar i{display:block;height:100%;background:var(--accent);border-radius:6px;transition:width 1.2s ease}
.grow-forest{margin-top:14px;text-align:left}
.forest-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.forest-tree{display:flex;flex-direction:column;align-items:center;width:64px;background:rgba(var(--accent-rgb),.08);border:1px solid var(--glass-border);border-radius:12px;padding:4px 2px}
.forest-tree svg{width:48px;height:auto}
.forest-tree span{font-size:11px;color:var(--muted);margin-top:-4px}
@media (prefers-reduced-motion:reduce){.gt-grow,.gt-leaves{animation:none}}
@keyframes treeSway{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
@media (prefers-reduced-motion:reduce){.gr-sway,.gr-p{animation:none!important}}

/* ===== 成长轨迹（新版 SVG 森林） ===== */
.gr-stage{position:relative;height:360px;border-radius:18px;overflow:hidden;border:1px solid var(--glass-border);margin:12px 0;background:#0a161a;}
.gr-sky{position:absolute;inset:0;transition:background .8s ease;}
.gr-tree{position:absolute;left:0;right:0;bottom:0;width:100%;height:100%;}
.gr-sway{transform-box:fill-box;transform-origin:bottom center;animation:grSway 5.5s ease-in-out infinite;}
@keyframes grSway{0%,100%{transform:rotate(-1.1deg)}50%{transform:rotate(1.1deg)}}
.gr-fall{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.gr-p{position:absolute;top:-7%;width:8px;height:8px;animation:grFall linear infinite;}
.gr-petal{border-radius:50% 0 50% 50%;}
.gr-leaf{border-radius:2px;}
.gr-snow{border-radius:50%;box-shadow:0 0 6px rgba(255,255,255,.55);}
@keyframes grFall{0%{transform:translateY(-10%) translateX(0) rotate(0)}100%{transform:translateY(390px) translateX(46px) rotate(360deg)}}
.gr-tag{position:absolute;left:12px;bottom:10px;display:flex;gap:8px;align-items:baseline;color:#eaf1ec;text-shadow:0 1px 5px rgba(0,0,0,.7);}
.gr-tag .gr-sp{font-size:16px;font-weight:600;}
.gr-tag .gr-st{font-size:13px;color:var(--accent);}
.gr-prog{margin:4px 0 2px;}
.gr-prog .gp-bar{height:10px;border-radius:8px;background:rgba(var(--accent-rgb),.16);overflow:hidden;}
.gr-prog .gp-bar i{display:block;height:100%;width:0;border-radius:8px;background:linear-gradient(90deg,rgba(var(--accent-rgb),.5),var(--accent));transition:width .9s cubic-bezier(.2,.8,.2,1);}
.gr-prog .gp-meta{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:6px;gap:10px;}
.gr-prog .gp-meta b{color:var(--accent);}
.gr-species{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;}
.gr-sp-btn{padding:7px 14px;border-radius:20px;font-size:13px;color:var(--muted);background:var(--glass);border:1px solid var(--glass-border);cursor:pointer;transition:.2s;}
.gr-sp-btn.on{color:#08110d;background:var(--accent);border-color:var(--accent);font-weight:600;}
.gr-sec{font-size:12px;letter-spacing:.1em;color:var(--muted);margin:12px 0 2px;}
.gr-forest{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;}
.gr-ft{display:flex;flex-direction:column;align-items:center;width:74px;background:rgba(var(--accent-rgb),.07);border:1px solid var(--glass-border);border-radius:12px;padding:6px 2px;cursor:pointer;transition:.2s;}
.gr-ft.on{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent);}
.gr-ft svg{width:54px;height:auto;display:block;}
.gr-ft span{font-size:11px;color:var(--muted);margin-top:2px;}
.gr-ft b{font-size:11px;color:var(--accent);}
.gr-methods{margin-top:6px;}
.gr-mrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
.gr-mbtn{flex:1;min-width:120px;padding:11px 12px;border-radius:14px;background:var(--glass);border:1px solid var(--glass-border);color:var(--ui);font-size:13px;cursor:pointer;text-align:left;transition:.2s;box-sizing:border-box;}
.gr-mbtn:hover{background:rgba(255,255,255,.12);}
.gr-mbtn .gm-t{font-weight:600;display:block;}
.gr-mbtn .gm-d{font-size:11px;color:var(--muted);}
.gr-mbtn .gm-v{float:right;color:var(--accent);font-weight:600;}
.gr-mbtn:disabled{opacity:.45;cursor:not-allowed;}
.gr-link{display:inline-block;margin-top:10px;font-size:12px;color:var(--accent);cursor:pointer;}


/* ================= capsule ================= */
/* 第 1266-1271 行（原站为分组选择器，此处保留分组，仅裁掉不相关的 .note-card/.fold-card 兄弟规则中
   与本次移植无关的部分；分组本体因含 .cap-card/.rit-card 而整条保留） */
.note-card, .cap-card, .fold-card, .rit-card{ border-radius:16px; padding:14px 16px; margin-bottom:12px;
  background:rgba(255,255,255,.04); border:1px solid var(--glass-border); }
.note-card .nc-top, .cap-card .cc-top{ display:flex; justify-content:space-between; font-size:11px; opacity:.5; margin-bottom:6px; }
.cap-card .cc-t{ font-size:14px; line-height:1.7; }
.cap-card .cc-open{ font-size:11px; opacity:.6; margin-top:8px; color:var(--accent); cursor:pointer; }

/* 第 1371-1376 行：开信 / 卡片入场 / 撰写框呼吸光 */
.cap-open-anim{ animation: capOpen 1.2s cubic-bezier(.22,.61,.36,1) both; }
@keyframes capOpen{ 0%{ opacity:0; transform:scale(.7) rotate(-4deg); filter:blur(8px); letter-spacing:2px;} 55%{ opacity:1; filter:blur(0);} 100%{ transform:none; letter-spacing:normal;} }
.cap-card{ animation: capIn .55s cubic-bezier(.22,.61,.36,1) both; }
@keyframes capIn{ from{opacity:0; transform:translateY(14px) scale(.98);} to{opacity:1; transform:none;} }
.cap-compose{ animation: capGlow 3.2s ease-in-out infinite; }
@keyframes capGlow{ 0%,100%{box-shadow:0 0 0 1px rgba(var(--accent-rgb),.25), 0 0 18px -6px rgba(var(--accent-rgb),.3);} 50%{box-shadow:0 0 0 1px rgba(var(--accent-rgb),.5), 0 0 30px -4px rgba(var(--accent-rgb),.5);} }


/* ================= ritual ================= */
/* .rit-card 的全部样式来自上方 capsule 段第 1266 行的分组选择器
   （.note-card, .cap-card, .fold-card, .rit-card{...}），原站没有 .rit-card 的独立规则。
   #rit-name / #rit-scene / #rit-snd / #rit-min / #rit-save 在原站是 id，
   外观完全由 .ag-input / .q-btn.primary 提供（见 shared 段）。
   [data-play] / [data-del] 在原站无任何 CSS 规则，外观由 .q-btn 提供。 */


/* ===== shared (q-btn/q-actions/q-hint/q-area/ag-input/form-area/empty/mod-btn/room-meta/nc-hero) ===== */
/* 第 888-900 行 */
.q-area{width:100%;min-height:96px;resize:none;border-radius:16px;border:1px solid var(--glass-border);background:rgba(0,0,0,.28);color:var(--ui);padding:14px 16px;font-size:15px;line-height:1.8;font-family:inherit;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-sizing:border-box}
.q-area:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.q-actions{display:flex;gap:12px;margin-top:6px}
.q-btn{flex:1;padding:13px;border-radius:30px;border:1px solid var(--glass-border);background:rgba(var(--accent-rgb),.14);color:var(--ui);font-size:14px;letter-spacing:.16em;cursor:pointer;text-align:center;transition:.2s;box-sizing:border-box}
.q-btn:active{transform:scale(.97)}
.q-btn.primary{background:linear-gradient(135deg,rgba(var(--accent-rgb),.3),rgba(var(--accent-rgb),.1));box-shadow:0 0 24px -6px rgba(var(--accent-rgb),.6)}
.q-hint{font-size:11px;color:var(--muted);line-height:1.7}

/* 第 1154-1156 行 */
.ag-input{ width:100%; box-sizing:border-box; background:rgba(255,255,255,.05); border:1px solid var(--glass-border);
  color:var(--ui); border-radius:12px; padding:12px 14px; font-size:15px; font-family:inherit; outline:none; }
.ag-input:focus{ border-color:var(--accent); }

/* 第 1272-1274 行 */
.form-area{ width:100%; box-sizing:border-box; min-height:84px; background:rgba(255,255,255,.05); border:1px solid var(--glass-border);
  color:var(--ui); border-radius:12px; padding:12px; font-size:14px; font-family:inherit; outline:none; resize:vertical; }
.form-area:focus{ border-color:var(--accent); }

/* 第 1298 行 */
.empty{ text-align:center; opacity:.5; font-size:13px; padding:30px 10px; line-height:1.8; }

/* 第 1340-1343 行 */
.mod-btn{ display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:999px; background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 60%,#fff)); color:#08110d; font-weight:600; font-size:14px; cursor:pointer; border:none; }
.mod-btn.ghost{ background:transparent; border:1px solid var(--glass-border); color:var(--text); }
.mod-btn:disabled{ opacity:.42; cursor:not-allowed; filter:saturate(.6); box-shadow:none; }
.mod-btn:active{ transform:scale(.97); }

/* 第 1367 行 */
.room-meta{ font-size:12px; opacity:.6; margin:6px 0 12px; }

/* 第 1417-1418 行：通用微交互（hover 微抬 / 按钮提亮） */
.q-btn:hover{ transform:translateY(-1px); box-shadow:0 6px 22px -12px rgba(var(--accent-rgb),.7); }
.mod-btn:hover{ filter:brightness(1.06); }

/* 第 1177、1190-1191 行：qnIcon 注入的 <svg class="i-svg"> 需要它们才有正确尺寸 */
.i-svg{ display:block; width:22px; height:22px; }
.q-hint svg, .pm svg, .cap-card svg, .fold-card svg, .mb-e svg, .vol svg, .mood-stat svg{
  display:inline-block; width:1em; height:1em; vertical-align:-.15em; margin-right:3px; }

/* 第 1414 行：.q-hint 在 .body-intro 内的居中变体（模块内不触发，保留以防结构复用） */
.body-intro .mod-sub,.body-intro .q-hint{ text-align:center; }


/* ===== QN3D 通用画布 + 3D 模块样式 ===== */
.qn3d-canvas{width:100%;height:340px;display:block;border-radius:18px;background:#070d12;touch-action:none;border:1px solid rgba(var(--accent-rgb),.16);cursor:grab;}
.qn3d-canvas:active{cursor:grabbing;}
.g3-hint{font-size:12px;color:var(--muted);margin:8px 2px 0;letter-spacing:.02em;}
.g3-clock{font-family:"Noto Serif SC",serif;font-size:34px;letter-spacing:.06em;margin:12px 0 2px;color:var(--ui);text-shadow:0 0 18px rgba(var(--accent-rgb),.26);}
.g3-clock small{font-size:12px;color:var(--muted);margin-left:10px;letter-spacing:.14em;}
.g3-bar{height:4px;border-radius:4px;background:var(--glass);overflow:hidden;margin:8px 0 14px;}
.g3-bar i{display:block;height:100%;width:0;border-radius:4px;background:linear-gradient(90deg,rgba(var(--accent-rgb),.45),var(--accent));transition:width .4s linear;}
.g3-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.g3-stat{display:flex;gap:20px;flex-wrap:wrap;margin:16px 0 4px;font-size:13px;color:var(--muted);}
.g3-stat b{display:block;font-size:20px;color:var(--accent);font-weight:600;line-height:1.5;}
.mod-btn-2{padding:11px 18px;border-radius:30px;border:1px solid var(--glass-border);background:var(--glass);color:var(--ui);font-size:14px;letter-spacing:.06em;cursor:pointer;}
.st-stage{position:relative;border-radius:18px;overflow:hidden;border:1px solid var(--glass-border);}
.st-tip{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:11px;color:rgba(157,176,166,.75);pointer-events:none;letter-spacing:.04em;}
.st-panel{margin-top:14px;display:flex;flex-direction:column;gap:10px;}
.st-input{width:100%;padding:13px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(0,0,0,.30);color:var(--ui);font-size:15px;line-height:1.6;font-family:inherit;outline:none;}
.st-input::placeholder{color:var(--muted);opacity:.75;}
.st-input:focus{border-color:rgba(var(--accent-rgb),.45);}
.st-row{display:flex;gap:10px;}
.st-btn{flex:1;padding:13px;border-radius:30px;border:1px solid var(--glass-border);background:var(--glass);color:var(--ui);font-size:14px;letter-spacing:.16em;cursor:pointer;text-align:center;transition:.2s;user-select:none;}
.st-btn:hover{background:rgba(255,255,255,.16);}
.st-btn.primary{background:rgba(var(--accent-rgb),.16);border-color:rgba(var(--accent-rgb),.34);color:var(--accent);}
.st-status{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);letter-spacing:.08em;padding:2px 4px;}
.st-status .dot{width:7px;height:7px;border-radius:50%;background:var(--muted);opacity:.6;}
.st-status.done{color:var(--accent);}
.st-status.done .dot{background:var(--accent);opacity:1;box-shadow:0 0 10px rgba(var(--accent-rgb),.8);}
.st-word{font-family:"Noto Serif SC",serif;font-size:15px;line-height:1.8;color:var(--ui);padding:12px 16px;border-radius:16px;background:var(--glass);border:1px solid var(--glass-border);}
.st-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px;}
.st-chip{font-size:12px;line-height:1.5;color:var(--ui);background:var(--glass);border:1px solid var(--glass-border);border-radius:14px;padding:7px 12px;}
.gr-row{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;}
.gr-stat{display:flex;gap:20px;font-size:13px;color:var(--muted);}
.gr-stat b{display:block;font-size:20px;color:var(--accent);}
.cap-panel{margin-top:14px;display:flex;flex-direction:column;gap:10px;}
.cap-ta{width:100%;min-height:90px;padding:13px 16px;border-radius:16px;border:1px solid var(--glass-border);background:rgba(0,0,0,.30);color:var(--ui);font-size:15px;line-height:1.6;font-family:inherit;outline:none;resize:vertical;}
.cap-row{display:flex;gap:10px;align-items:center;}
.cap-lbl{font-size:13px;color:var(--muted);}
.cap-num{width:90px;padding:9px 12px;border-radius:12px;border:1px solid var(--glass-border);background:rgba(0,0,0,.30);color:var(--ui);font-size:15px;}
.cap-word{font-family:"Noto Serif SC",serif;font-size:15px;line-height:1.8;color:var(--ui);padding:14px 16px;border-radius:16px;background:var(--glass);border:1px solid var(--glass-border);white-space:pre-wrap;}
.cap-word.open{box-shadow:0 0 26px rgba(var(--accent-rgb),.4);}
.cap-lock{font-size:13px;color:var(--muted);text-align:center;}
.cap-lock b{color:var(--accent);}
.rit-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0;}
.rit-lbl{font-size:13px;color:var(--muted);min-width:34px;}
.fld-row{display:flex;gap:10px;align-items:center;justify-content:center;margin-top:12px;}
.fld-step{font-family:"Noto Serif SC",serif;font-size:17px;color:var(--accent);min-width:120px;text-align:center;}
.fld-hint{font-size:12px;color:var(--muted);text-align:center;margin-top:8px;letter-spacing:.03em;}
.fld-hint b{color:var(--accent);}
</style>
<script src="https://beacon.cdn.qq.com/sdk/4.5.9/beacon_web.min.js"></script>
<script>
(function(){
  try{
    var beacon=new BeaconAction({
      appkey:'0WEB06U85YBSLJNL',
      versionCode:'1.0.0',
      channelID:'share',
      delay:1000,
      sessionDuration:30*60*1000,
      isOversea:false,
      needReportRqdEvent:false
    });
    beacon.onDirectUserAction('preview_page_view',{
      'url':location.href,
      'referrer':document.referrer,
      'title':document.title,
      'sandbox_id':'73f79397727a4c2b926746da7dc27ba9'
    });
  }catch(e){}
})();
</script></head>
<body>
<div id="backdrop"></div>
<div id="veil"></div>
<div id="app">
  <div id="topbar">
    <div class="brand"><div class="t serif">自然之境</div><div class="e en">QUIET NATURE</div></div>
    <button class="moodbtn" id="moodbtn" title="切换心境">色</button>
  </div>

  <div id="screen"><!-- screens render here --></div>

</div>

<!-- 菜单（替代底部 tab 栏） -->
<div id="menu">
  <div class="panel">
    <div class="mb serif">自然之境</div>
    <div class="me en">QUIET NATURE</div>
    <div class="mi" data-go="gallery"><div class="mt">入景</div><div class="ms">走进一片景象</div></div>
    <div class="mi" data-go="sanctuary"><div class="mt">空栈</div><div class="ms">5 栈 · 27 模块</div></div>
    <div class="mi" data-go="settings"><div class="mt">设置</div><div class="ms">个人 · 数据 · 退出</div></div>
    <div class="mf en">— 轻触任意处关闭 —</div>
  </div>
</div>

<!-- 站长 · 隐秘入口（长按标题约 0.7 秒唤出，无任何标识） -->
<form id="wm-secret" class="wm-secret" onsubmit="return wmSubmit(event)" onclick="if(event.target===this)this.classList.remove('show')">
  <input class="inp" id="wm-pass" type="password" placeholder="· · ·" maxlength="12"
    style="text-align:center;letter-spacing:.5em;max-width:200px;opacity:.75">
</form>
<div class="wm-veil" id="wm-veil"></div>

<!-- 推开自然之门（3D 透视双扉 + 门外光雾 + 相机穿门） -->
<div class="door" id="door">
  <div class="stage"><div class="dolly">
    <div class="far"></div>
    <div class="far-photo"></div>
    <div class="fog f1"></div><div class="fog f2"></div><div class="fog f3"></div>
    <div class="leaf l"><div class="carve"></div><div class="knob"></div></div>
    <div class="leaf r"><div class="carve"></div><div class="knob"></div></div>
    <div class="seam"></div>
    <div class="jamb"></div>
    <div class="moss l"></div><div class="moss r"></div>
    <div class="deco sprig"><svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 72 Q58 42 112 6" stroke="#5A7A45" stroke-width="3" fill="none"/>
      <path d="M44 52 q-13 -7 -20 -2 q11 9 20 2 Z" fill="#6E8B4E"/>
      <path d="M74 32 q13 -7 20 -2 q-11 9 -20 2 Z" fill="#6E8B4E"/>
      <circle cx="52" cy="46" r="4.2" fill="#C0392B"/>
      <circle cx="64" cy="38" r="4.2" fill="#C0392B"/>
      <circle cx="82" cy="26" r="4.2" fill="#C0392B"/>
      <circle cx="94" cy="18" r="4.2" fill="#C0392B"/>
    </svg></div>
    <div class="deco pine-l"><svg viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg">
      <rect x="19" y="0" width="2" height="7" fill="#4A3320"/>
      <g fill="#6B4A2E" stroke="#33220F" stroke-width="1">
        <path d="M20 5 L30 16 L20 24 L10 16 Z"/>
        <path d="M20 17 L31 28 L20 36 L9 28 Z"/>
        <path d="M20 29 L33 40 L20 48 L7 40 Z"/>
        <path d="M20 41 L30 50 L20 56 L10 50 Z"/>
      </g>
    </svg></div>
    <div class="deco pine-r"><svg viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg">
      <rect x="19" y="0" width="2" height="7" fill="#4A3320"/>
      <g fill="#6B4A2E" stroke="#33220F" stroke-width="1">
        <path d="M20 5 L30 16 L20 24 L10 16 Z"/>
        <path d="M20 17 L31 28 L20 36 L9 28 Z"/>
        <path d="M20 29 L33 40 L20 48 L7 40 Z"/>
        <path d="M20 41 L30 50 L20 56 L10 50 Z"/>
      </g>
    </svg></div>
  </div></div>
  <div class="skip en">TAP TO SKIP</div>
</div>

<!-- Login / 进站 gate（默认隐藏，可在「设置→个人资料」里打开） -->
<div class="gate hide" id="gate">
  <button class="gate-x" onclick="closeGate()" aria-label="关闭">×</button>
  <h1 class="serif">自然之境</h1>
  <div class="ge en">QUIET NATURE</div>
  <p class="lead">把喧嚣留在岸上，让呼吸慢下来。<br>先告诉我，怎么称呼你？</p>
  <div class="field"><label>昵称</label><input class="inp" id="ob-name" placeholder="例如：来访者" maxlength="16"></div>
  <div class="field"><label>心情色</label>
    <div class="cc" id="ob-cc">
      <div class="dot on" data-c="#9FE3BE" style="background:#9FE3BE"></div>
      <div class="dot" data-c="#FFB877" style="background:#FFB877"></div>
      <div class="dot" data-c="#A9BCFF" style="background:#A9BCFF"></div>
    </div>
  </div>
  <div class="field"><label>常驻栈（可选）</label>
    <div class="chips" id="ob-st">
      <div class="chip on" data-s="nature">自然栈</div>
      <div class="chip" data-s="reader">读者栈</div>
      <div class="chip" data-s="void">留白栈</div>
      <div class="chip" data-s="fold">折叠栈</div>
      <div class="chip" data-s="module">模块栈</div>
    </div>
  </div>
  <div class="field"><label>头像（点击上传 · 可自定义）</label>
    <div class="avatar-pick" onclick="document.getElementById('ob-avatar').click()">
      <div class="avatar" id="ob-avatar-prev"></div>
      <span class="hint">点击选择图片</span>
      <span class="clear" id="ob-avatar-clear" style="display:none" onclick="clearAvatar(event)">清除头像</span>
    </div>
    <input type="file" id="ob-avatar" accept="image/*" hidden>
  </div>
  <div class="field"><label>个人锁（可选，留空则不设）</label><input class="inp" id="ob-pass" type="password" placeholder="4 位以上" maxlength="20"></div>
  <button class="btn" id="ob-go">进入自然之境</button>
  <button class="btn ghost" id="ob-skip">先随便逛逛</button>
  <p class="note" id="gate-note">这是框架预览版：进站信息仅存本机（localStorage）。<br>数据导出/导入、GitHub 共笔等完整功能将在后续接入。</p>
</div>

<div id="toast"></div>
<div id="stackRail"></div>

<script src="./reader-lib.js"></script>
<script src="./media-data.js"></script>
<script>
/* ===================== 数据：5 栈 / 27 模块 ===================== */
const STACKS = [
  {key:"nature",title:"自然栈",en:"Nature",mode:"自我",desc:"回到山林湖海，让世界的熵增慢下来。",
    modules:["immerse","garden","fav","echo","flow","create","solar"]},
  {key:"reader",title:"读者栈",en:"Reader",mode:"自我",desc:"每日一句，与好文字安静相处——把《读者》装进口袋。",
    modules:["reader","verse","relay"]},
  {key:"void",title:"留白栈",en:"The Void",mode:"自我",desc:"给心事留白，与时间为友。写给自己的，不必给别人看。",
    modules:["mood","notes","capsule","stone","body","review","growth","quiet","moon","morningnight"]},
  {key:"fold",title:"折叠栈",en:"Fold",mode:"需求",desc:"折一枚纸，折一段静气。从一张方纸开始，跟随呼吸，折出一只可以盛放心事的小盒。",
    modules:["fold"]},
  {key:"module",title:"模块栈",en:"Module",mode:"需求",desc:"像搭积木一样，把场景·声景·计时组合成一套日常仪式。",
    modules:["ritual","wall","bottle","glownote","syncbreath","watchsea"]}
];
const MODULES = {
  immerse:{t:"沉浸自然",en:"Immersive",d:"选一片景象，把自己放进去，慢慢看",i:"🌿"},
  garden:{t:"专注花园",en:"Focus Garden",d:"专注时，角落悄悄开花",i:"🌸"},
  fav:{t:"收藏连播",en:"Favorites",d:"收藏的场景，连成一段安静的时光",i:"✨"},
  echo:{t:"回声·声景",en:"Echo Mixer",d:"多轨环境音混音台",i:"🔊"},
  flow:{t:"心流·专注",en:"Focus Flow",d:"把一段时间圈起来，只做一件事",i:"⏳"},
  create:{t:"拼帖·创作",en:"Collage",d:"挑几张自然底图，写一句话，合成卡片",i:"🎴"},
  solar:{t:"我的节气历",en:"Solar Terms",d:"今日节气与物候",i:"🍃"},
  reader:{t:"每日一读",en:"Daily Reader",d:"读者金句库 · 藏句 · 批注",i:"📖"},
  verse:{t:"随机诗句",en:"Random Verse",d:"一句安静的话，落进心里",i:"✍️"},
  relay:{t:"共读接力",en:"Reading Relay",d:"大家接力，续写同一段故事",i:"📜"},
  mood:{t:"心境",en:"Daily Mood",d:"签到今日心情，看它在日子里留下的痕迹",i:"🌗"},
  notes:{t:"灵感手账",en:"Notes",d:"随手记下的念头",i:"📝"},
  capsule:{t:"时间胶囊",en:"Time Capsule",d:"写给未来自己的信",i:"💌"},
  stone:{t:"今日小石子",en:"Today's Stone",d:"放一枚石子，代表今天想完成的一件事",i:"🪨"},
  body:{t:"身体扫描",en:"Body Scan",d:"跟着指引，从脚到头松下来",i:"🌊"},
  review:{t:"温柔回顾",en:"Gentle Review",d:"这一周/这一个月，你如何与自己相处",i:"📔"},
  growth:{t:"成长轨迹",en:"Growth Trail",d:"你来过的日子，慢慢长成一棵树",i:"🌳"},
  quiet:{t:"自动安静",en:"Auto Quiet",d:"进站点，世界自动调暗、安静下来",i:"🌙"},
  moon:{t:"月相画廊",en:"Moon Phase",d:"今夜月相，随月换上夜色",i:"🌕"},
  morningnight:{t:"晨启夜收",en:"Day Open/Night Close",d:"晨起与夜间的一分钟仪式",i:"🌅"},
  fold:{t:"折纸冥想",en:"Origami Box",d:"六步，折出一只小纸盒",i:"📦"},
  ritual:{t:"我的仪式",en:"Rituals",d:"组合场景·声景·计时",i:"🧩"},
  wall:{t:"共笔墙",en:"Shared Wall",d:"留言 · 互享 · 多人",i:"✏️"},
  bottle:{t:"漂流瓶",en:"Drift Bottle",d:"写一句扔出去，被陌生人轻轻捡起",i:"🍶"},
  glownote:{t:"微光留言",en:"Glow Notes",d:"给此刻也在的人留句温柔",i:"💡"},
  syncbreath:{t:"同步呼吸",en:"Sync Breath",d:"和陌生人一起，同呼吸",i:"🌬️"},
  watchsea:{t:"同看一片海",en:"Watch the Sea",d:"和陌生人同看一段海",i:"🌊"}
};
/* 原站站长口令样例（框架占位，正式版请改） */
const WALL_PASS = { admin:"628031" };
let OWNER=null; // 站长会话：口令正确后注入 {level, role}，后续可扩展多等级/细分权限

/* ===================== 渲染 ===================== */
const screen = document.getElementById('screen');
const toastEl = document.getElementById('toast');
let toastTimer;
function toast(msg){ toastEl.textContent=msg; toastEl.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toastEl.classList.remove('show'),1800); }

/* 栖处导航记忆：保存离开时的滚动位置与模块，返回时恢复 */
let SANCTUARY_SCROLL = 0;
let LAST_MOD = null;

/* ============ 入景 · 媒体中心（画廊 + 联动枢纽） ============ */
let G_FILTER='all', FAV_RUN=false;
const GALLERY_CSS=`
.gtabs{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 10px;scrollbar-width:none}
.gtabs::-webkit-scrollbar{display:none}
.gtab{flex:0 0 auto;padding:8px 14px;border-radius:20px;background:var(--glass);border:1px solid var(--glass-border);font-size:13px;color:var(--muted);white-space:nowrap}
.gtab.on{background:var(--accent);color:#06231a;border-color:transparent;font-weight:600}
.ggrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:4px 0 90px}
.gcell{position:relative;border-radius:14px;overflow:hidden;background:rgba(255,255,255,.04);aspect-ratio:4/5;cursor:pointer;border:1px solid var(--glass-border)}
.gcell img,.gcell video{width:100%;height:100%;object-fit:cover;display:block}
.gcell .gtx{position:absolute;left:0;right:0;bottom:0;padding:10px 10px 8px;background:linear-gradient(180deg,transparent,rgba(0,0,0,.66))}
.gcell .gt{font-size:13px;font-weight:600;color:#fff}
.gcell .gc{font-size:11px;color:rgba(255,255,255,.82);line-height:1.4;max-height:2.8em;overflow:hidden}
.gcell .gh{position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:17px;background:rgba(0,0,0,.52);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:17px;color:#fff;z-index:3;cursor:pointer;transition:.18s}
.gcell .gh:active{transform:scale(.88)}
.gcell .gh.on{color:#ff6b8b}
.gcell .gv{position:absolute;top:8px;left:8px;padding:3px 8px;border-radius:10px;background:rgba(0,0,0,.45);font-size:10px;color:#fff;letter-spacing:.05em;z-index:2}
.gcell .gpend{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.72);font-size:12px;text-align:center;padding:12px;z-index:1}
.mvwrap{position:fixed;inset:0;background:#05080a;z-index:40;display:flex;flex-direction:column}
.mvtop{display:flex;align-items:center;justify-content:space-between;padding:calc(12px + var(--safe-t)) 16px 8px}
.mvbody{flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
.mvbody img,.mvbody video{max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 0 0 1px rgba(255,255,255,.14),0 20px 60px rgba(0,0,0,.55);border-radius:4px}
.mvbody::after{content:'';position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 110px rgba(0,0,0,.5)}
.mvpend{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.72);font-size:13px;text-align:center;padding:30px;background:linear-gradient(135deg,#1f4a3a,#0c1a16)}
.mvbtn{width:34px;height:34px;border-radius:17px;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.mvbtn:active{transform:scale(.94)}
.mvzone{position:absolute;top:0;bottom:0;width:34%;cursor:pointer}
.mvzone-l{left:0}.mvzone-r{right:0}
.mvwrap:fullscreen,.mvwrap:-webkit-full-screen{background:#000;width:100%;height:100%}
/* 全屏沉浸：覆盖填充；横屏图自动横过来铺满，控件保持正立 */
.mvwrap.fs .mvbody img,.mvwrap.fs .mvbody video{object-fit:cover;width:100%;height:100%}
.mvrot{position:fixed;top:50%;left:50%;width:100vh;height:100vw;transform:translate(-50%,-50%) rotate(90deg);z-index:1}
.mvwrap.fs .mvrot img,.mvwrap.fs .mvrot video{object-fit:cover;width:100%;height:100%}
.mvzone{z-index:5}
.mvcap{padding:14px 18px calc(18px + var(--safe-b));text-align:center}
.mvt{font-size:17px;font-weight:600;font-family:"Noto Serif SC",serif}
.mvc{font-size:13px;color:var(--muted);line-height:1.6;margin-top:6px}
.mvacts{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:14px}
.mvact{flex:1 1 30%;min-width:96px;padding:10px 6px;border-radius:12px;background:var(--glass);border:1px solid var(--glass-border);font-size:12px;color:var(--ui);text-align:center}
.mvact b{display:block;font-size:13px;margin-bottom:2px;color:var(--accent)}
.gcat{margin:4px 0 2px}
.gcat-h{display:flex;align-items:baseline;gap:10px;padding:16px 4px 9px;border-bottom:1px solid var(--glass-border)}
.gcat-num{font-family:"Noto Serif SC",serif;font-size:18px;color:var(--accent);opacity:.7;flex:0 0 auto}
.gcat-meta{flex:1;min-width:0}
.gcat-name{font-size:16px;font-weight:600;letter-spacing:1px;font-family:"Noto Serif SC",serif}
.gcat-desc{font-size:11px;color:var(--muted);margin-top:2px}
.gcat-count{font-size:11px;color:var(--muted);white-space:nowrap;flex:0 0 auto}
/* 播放器顶栏工具：带文字标签，避免图标被误认为装饰 */
.mvtools{display:flex;gap:8px;align-items:center}
.mvtool{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-width:44px;padding:5px 8px;border-radius:13px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);color:#fff;font-family:inherit;cursor:pointer;transition:.18s}
.mvtool span{font-size:15px;line-height:1.1}
.mvtool i{font-size:9px;font-style:normal;opacity:.72;letter-spacing:.5px}
.mvtool:active{transform:scale(.93)}
.mvtool.on{color:#ff6b8b;border-color:rgba(255,107,139,.55);background:rgba(255,107,139,.16)}
.mvtool.snd{color:#9FE3BE;border-color:rgba(159,227,190,.55);background:rgba(159,227,190,.16)}
/* 拼贴创作：两种形式 */
.cmodes{display:flex;gap:8px;margin:10px 0 12px}
.cmode{flex:1;padding:10px 8px;border-radius:14px;background:var(--glass);border:1px solid var(--glass-border);text-align:center;font-size:13px;cursor:pointer;transition:.18s}
.cmode.on{border-color:var(--accent);color:var(--accent);background:rgba(159,227,190,.12);font-weight:600}
.cmode small{display:block;font-size:10px;opacity:.7;margin-top:3px;font-weight:400;color:var(--muted)}
.cprev{position:relative;width:100%;aspect-ratio:4/5;border-radius:18px;overflow:hidden;border:1px solid var(--glass-border);background:#0a0e0c}
.cprev .cfg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cprev .cshade{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.86),rgba(0,0,0,.16) 44%,transparent 64%)}
.cprev .cq{position:absolute;left:0;right:0;bottom:38px;padding:0 22px;font-family:"Noto Serif SC",serif;font-size:19px;line-height:1.7;color:#fff;white-space:pre-wrap;word-break:break-word}
.cprev .ca{position:absolute;left:22px;bottom:15px;font-size:11px;color:rgba(255,255,255,.75)}
.cthumbs{display:flex;gap:8px;overflow-x:auto;padding:8px 2px 4px;scrollbar-width:none}
.cthumbs::-webkit-scrollbar{display:none}
.cthumb{flex:0 0 auto;width:58px;height:58px;border-radius:12px;overflow:hidden;border:2px solid transparent;background:#0d1512;cursor:pointer}
.cthumb img{width:100%;height:100%;object-fit:cover;display:block}
.cthumb.on{border-color:var(--accent)}
.chint{font-size:11px;color:var(--muted);margin:14px 0 2px;letter-spacing:.6px}
.ggrid.cpick .gcell{aspect-ratio:1/1}
.ggrid.cpick .gcell img{object-fit:contain;background:#0d1512}
.gcell .cbadge{position:absolute;top:8px;left:8px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:var(--accent);color:#06231a;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;z-index:3}
.clay{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.clayb{padding:7px 13px;border-radius:18px;border:1px solid var(--glass-border);background:var(--glass);font-size:12px;cursor:pointer}
.clayb.on{border-color:var(--accent);color:var(--accent)}
.cpv-canvas{width:100%;height:auto;display:block;border-radius:16px;background:#0a0f0d;border:1px solid rgba(var(--accent-rgb),.16);margin-top:6px}
`;
function injectGalleryCSS(){ if(document.getElementById('gcss')) return; const s=document.createElement('style'); s.id='gcss'; s.textContent=GALLERY_CSS; document.head.appendChild(s); }
function moodGrad(m){ return m==='night'?'#2a3a66,#0c1330':m==='ember'?'#5a3a22,#1a120c':'#1f4a3a,#0c1a16'; }
function favList(){ return lsGet('qn_fav',[]); }
function isFav(id){ return favList().indexOf(id)>=0; }
function toggleFav(id){ const a=favList(); const i=a.indexOf(id); const on=(i<0); if(i>=0)a.splice(i,1); else a.push(id); lsSet('qn_fav',a.slice(-60)); uTrack('fav_toggle',{id:id,on:on}); return isFav(id); }

function gTabsHtml(){
  const tabs=[['all','全部']].concat(MEDIA.themes.map(t=>[t.id,t.tab])).concat([['fav','收藏']]);
  return '<div class="gtabs">'+tabs.map(t=>'<div class="gtab'+(G_FILTER===t[0]?' on':'')+'" data-gf="'+t[0]+'">'+t[1]+'</div>').join('')+'</div>';
}
function gItems(){
  if(G_FILTER==='fav'){ const f=favList(); return MEDIA.flat().filter(x=>f.indexOf(x.id)>=0); }
  if(G_FILTER==='all') return MEDIA.flat();
  const th=MEDIA.themes.find(t=>t.id===G_FILTER);
  return th?th.items.map(i=>(Object.assign({},i,{theme:th.id,mood:th.mood,type:i.type||'image'}))):[];
}
function gCellHtml(it){
  let media;
  if(it.type==='video') media='<video src="'+it.file+'" muted preload="metadata" playsinline></video><div class="gv">视频</div>';
  else if(it.pending) media='<div class="gpend">待补图<br>'+it.title+'</div>';
  else media='<img src="'+it.file+'" loading="lazy" alt="'+it.title+'">';
  return '<div class="gcell" data-gid="'+it.id+'" data-cat="'+(it.theme||'')+'">'+media+
    '<div class="gh'+(isFav(it.id)?' on':'')+'" data-fav="'+it.id+'">'+(isFav(it.id)?'♥':'♡')+'</div>'+
    '<div class="gtx"><div class="gt">'+it.title+'</div>'+(it.caption?'<div class="gc">'+it.caption+'</div>':'')+'</div></div>';
}
function renderGallery(){
  CUR_VIEW='gallery';
  injectGalleryCSS();
  if(G_FILTER==='fav'){ renderFav(); return; }
  let h='<div class="center" style="margin:16px 0 4px"><div class="h2 serif">入景</div>'+
    '<div class="muted" style="font-size:12px">把世界的喧嚣留在门外</div></div>'+
    '<p class="muted center" style="font-size:12px;margin:2px 0 6px;color:var(--accent)">每一张，都是一扇通往自然的窗</p>';
  h+=gTabsHtml();
  MEDIA.themes.forEach(t=>{
    const items=t.items.map(i=>(Object.assign({},i,{theme:t.id,mood:t.mood,type:i.type||'image'})));
    h+='<section class="gcat" data-cat="'+t.id+'">'+
      '<div class="gcat-h"><span class="gcat-num">'+t.num+'</span>'+
      '<div class="gcat-meta"><div class="gcat-name">'+t.name+'</div>'+(t.desc?'<div class="gcat-desc">'+t.desc+'</div>':'')+'</div>'+
      '<span class="gcat-count">'+(t.id==='video'?items.length+' 段':items.length+' 幅')+'</span></div>'+
      '<div class="ggrid">'+items.map(gCellHtml).join('')+'</div></section>';
  });
  screen.innerHTML=h;
  screen.querySelectorAll('[data-gf]').forEach(t=>t.onclick=()=>{
    const f=t.dataset.gf;
    if(f==='fav'){ G_FILTER='fav'; renderGallery(); return; }
    if(G_FILTER!=='all'){ G_FILTER='all'; renderGallery(); }
    if(f!=='all'){ const sec=screen.querySelector('.gcat[data-cat="'+f+'"]'); if(sec) setTimeout(()=>sec.scrollIntoView({behavior:'smooth',block:'start'}),40); }
    else screen.scrollTop=0;
  });
  screen.querySelectorAll('[data-fav]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); const on=toggleFav(b.dataset.fav); b.classList.toggle('on',on); b.textContent=on?'♥':'♡'; });
  screen.querySelectorAll('.gcell').forEach(c=>c.onclick=()=>openMedia(c.dataset.gid));
  _activeCat=MEDIA.themes[0].id;
  setupGalleryIO();
  initSoundBtn();
  if(SOUND_ON){ soundStartBgm(); soundSetCat(_activeCat); }
}

/* 画廊观看器：真全屏 + contain 保完整 + 边框/暗角 + 真实环境音 + 横竖自适应 */
let MV_LIST=[], MV_I=0, MV_FS=false, MV_WRAP=null, MV_DIM={};
function inFs(){ return MV_FS||IMM_FS; }
function mvVideoTap(v){ if(v.paused) v.play().catch(()=>{}); else v.pause(); }
function mvMediaInner(it){
  if(it.type==='video'){
    const fs=inFs();
    return '<video id="mv-el" src="'+it.file+'" autoplay loop playsinline '+(fs?'':'controls ')+'onloadedmetadata="mvCacheDim(\''+it.id+'\',this)"'+(fs?' onclick="mvVideoTap(this)"':'')+' style="width:100%;height:100%;object-fit:contain;background:#000"></video>';
  }
  return '<img id="mv-el" src="'+it.file+'" onload="mvCacheDim(\''+it.id+'\',this)" style="width:100%;height:100%;object-fit:contain">';
}
function mvIsLand(it){
  if(MV_DIM[it.id]) return MV_DIM[it.id].w>MV_DIM[it.id].h;
  const el=document.getElementById('mv-el'); if(!el) return false;
  if(it.type==='video') return (el.videoWidth||0)>(el.videoHeight||0);
  return (el.naturalWidth||0)>(el.naturalHeight||0);
}
function mvCacheDim(id,el){
  const w=el.videoWidth||el.naturalWidth, h=el.videoHeight||el.naturalHeight;
  if(!w||!h) return;
  MV_DIM[id]={w,h};
  const land = w>h;
  const inGalleryFs = MV_FS && MV_WRAP && MV_WRAP.querySelector('#mv-el')===el;
  const inImmFs = IMM_FS && (function(){ const w=document.getElementById('imm'); return w&&w.querySelector('#mv-el')===el; })();
  if(inGalleryFs || inImmFs){
    const wrap = inGalleryFs ? MV_WRAP : document.getElementById('imm');
    const hasRot = !!wrap.querySelector('.mvrot');
    if(land!==hasRot){ if(inGalleryFs) mvPaint(); else immPaint(); }
  }
}
function openMedia(id){
  uTrack('gallery_open',{id:id});
  MV_LIST=MEDIA.flat(); MV_I=Math.max(0,MV_LIST.findIndex(x=>x.id===id));
  if(!MV_WRAP){ const w=document.createElement('div'); w.className='mvwrap'; w.id='mvwrap'; document.body.appendChild(w); MV_WRAP=w; }
  mvPaint();
  if(SOUND_ON){ soundStartBgm(); soundSetCat(MV_LIST[MV_I].theme,true); }
}
function mvPaint(){
  const w=MV_WRAP; if(!w) return; const it=MV_LIST[MV_I]; if(!it) return;
  const sndOK=SOUND_ON && (!!it.music||(it.type!=='video'&&!!it.audio)) && !it.pending;
  const land = MV_FS && mvIsLand(it);
  w.innerHTML='<div class="mvtop"><button class="bback" onclick="closeMedia()">← 入景</button>'+
    '<div class="mvtools">'+
      '<button class="mvtool'+(isFav(it.id)?' on':'')+'" id="mv-fav"><span id="mv-fav-i">'+(isFav(it.id)?'♥':'♡')+'</span><i>收藏</i></button>'+
      '<button class="mvtool" id="mv-fs"><span>⛶</span><i>'+(MV_FS?'退出':'全屏')+'</i></button>'+
      '<button class="mvtool'+(SOUND_ON?' snd':'')+'" id="mv-snd-w"><span id="mv-snd">'+(SOUND_ON?'🔊':'🔇')+'</span><i>声音</i></button>'+
    '</div></div>'+
    '<div class="mvbody">'+(land?'<div class="mvrot">'+mvMediaInner(it)+'</div>':mvMediaInner(it))+
      (it.type!=='video'&&!it.pending?'<div class="mvzone mvzone-l" onclick="mvStep(-1)"></div><div class="mvzone mvzone-r" onclick="mvStep(1)"></div>':'')+
    '</div>'+
    '<div class="mvcap"><div class="mvt">'+it.title+'</div>'+(it.caption?'<div class="mvc">'+it.caption+'</div>':'')+
    (it.type==='video'
      ? '<div class="muted" style="font-size:11px;margin-top:8px">视频'+(MV_FS?' · 轻触画面暂停/播放':' · 轻触控制条')+(it.audio?' · 含真实录音':'')+(SOUND_ON?' · 已开启配乐':'')+'</div>'
      : (SOUND_ON&&sndOK?'<div class="muted" style="font-size:11px;margin-top:8px">配纯音乐'+(it.audio?' · 叠自然录音':'')+' · 已开启</div>'
                :(land?'<div class="muted" style="font-size:11px;margin-top:8px">已横屏铺满 · 退出全屏恢复完整</div>':'<div class="muted" style="font-size:11px;margin-top:8px">点右上角 🔊 开启配乐</div>')))+'</div>';
  w.querySelector('#mv-fav').onclick=(e)=>{ const on=toggleFav(it.id); const b=e.currentTarget; b.classList.toggle('on',on); b.querySelector('span').textContent=on?'♥':'♡'; toast(on?'已收藏':'已取消收藏'); };
  w.querySelector('#mv-fs').onclick=()=>mvGoFs(w);
  w.querySelector('#mv-snd-w').onclick=(e)=>{ playerToggleSound(); e.currentTarget.classList.toggle('snd',SOUND_ON); };
}
function mvStep(d){ if(!MV_LIST.length) return; MV_I=(MV_I+d+MV_LIST.length)%MV_LIST.length; mvPaint(); if(SOUND_ON) soundSetCat(MV_LIST[MV_I].theme,true); }
function mvGoFs(w){
  const fn=w.requestFullscreen||w.webkitRequestFullscreen;
  if(!fn){                                   // iOS Safari 等不支持元素全屏：用 CSS 铺满模式替代
    MV_FS=!MV_FS; w.classList.toggle('fs',MV_FS); mvPaint();
    if(MV_FS) toast('铺满沉浸模式 · 再点一次退出');
    return;
  }
  if(!document.fullscreenElement && !document.webkitFullscreenElement){
    fn.call(w);
    const onch=()=>{
      const on=!!(document.fullscreenElement||document.webkitFullscreenElement);
      w.classList.toggle('fs',on); MV_FS=on; mvPaint();
      if(!on){ document.removeEventListener('fullscreenchange',onch); document.removeEventListener('webkitfullscreenchange',onch); }
    };
    document.addEventListener('fullscreenchange',onch);
    document.addEventListener('webkitfullscreenchange',onch);
  } else { const ex=document.exitFullscreen||document.webkitExitFullscreen; if(ex) ex.call(document); }
}
function closeMedia(){ if(MV_WRAP){ MV_WRAP.remove(); MV_WRAP=null; } if(SOUND_ON&&CUR_VIEW==='gallery') soundSetCat(_activeCat,true); }
function mvGoFsImm(w){
  const fn=w.requestFullscreen||w.webkitRequestFullscreen;
  if(!fn){
    IMM_FS=!IMM_FS; w.classList.toggle('fs',IMM_FS); immPaint();
    if(IMM_FS) toast('铺满沉浸模式 · 再点一次退出');
    return;
  }
  if(!document.fullscreenElement && !document.webkitFullscreenElement){
    fn.call(w);
    const onch=()=>{ const on=!!(document.fullscreenElement||document.webkitFullscreenElement); w.classList.toggle('fs',on); IMM_FS=on; immPaint(); if(!on){ document.removeEventListener('fullscreenchange',onch); document.removeEventListener('webkitfullscreenchange',onch); } };
    document.addEventListener('fullscreenchange',onch);
    document.addEventListener('webkitfullscreenchange',onch);
  } else { const ex=document.exitFullscreen||document.webkitExitFullscreen; if(ex) ex.call(document); }
}

/* 沉浸自然 —— 全屏静观，左右切换。联动发生在「板块内部」（从栖处进入），不在画廊里。声音沿用全局画廊配乐（BGM+分类环境音）。 */
let IMM_I=0, IMM_LIST=[], IMM_BACK=function(){ renderSanctuary(profile.stack||true); };
function closeImmerse(){ const w=document.getElementById('imm'); if(w) w.remove(); }
let IMM_FS=false;
function immPaint(){
  const w=document.getElementById('imm'); if(!w) return;
  const list=IMM_LIST, i=IMM_I, cur=list[i];
  const sndOK=SOUND_ON && (!!cur.music||(cur.type!=='video'&&!!cur.audio));
  const land = IMM_FS && mvIsLand(cur);
  const media = land ? '<div class="mvrot">'+mvMediaInner(cur)+'</div>' : mvMediaInner(cur);
  w.innerHTML='<div class="mvtop"><button class="bback" onclick="IMM_BACK()">← 返回</button>'+
    '<div class="mvtools">'+
      '<button class="mvtool'+(isFav(cur.id)?' on':'')+'" id="imm-fav"><span>'+(isFav(cur.id)?'♥':'♡')+'</span><i>收藏</i></button>'+
      '<button class="mvtool" id="imm-fs"><span>⛶</span><i>'+(IMM_FS?'退出':'全屏')+'</i></button>'+
      '<button class="mvtool'+(SOUND_ON?' snd':'')+'" id="imm-snd-w"><span id="imm-snd">'+(SOUND_ON?'🔊':'🔇')+'</span><i>声音</i></button>'+
    '</div></div>'+
    '<div class="mvbody">'+media+
      '<div class="mvzone mvzone-l" onclick="immStep(-1)"></div><div class="mvzone mvzone-r" onclick="immStep(1)"></div>'+
    '</div>'+
    '<div class="mvcap"><div class="mvt">'+cur.title+'</div>'+(cur.caption?'<div class="mvc">'+cur.caption+'</div>':'')+
    '<div class="muted" style="font-size:11px;margin-top:8px">轻触左右两侧切换 · '+(i+1)+'/'+list.length+((cur.music||cur.audio)?(SOUND_ON?' · 🔊 配乐开':' · 点右上角 🔊 听配乐'):'')+(land?' · 已横屏铺满':'')+'</div></div>';
  w.querySelector('#imm-fav').onclick=(e)=>{ const on=toggleFav(cur.id); const b=e.currentTarget; b.classList.toggle('on',on); b.querySelector('span').textContent=on?'♥':'♡'; toast(on?'已收藏':'已取消收藏'); };
  w.querySelector('#imm-fs').onclick=()=>mvGoFsImm(w);
  w.querySelector('#imm-snd-w').onclick=(e)=>{ playerToggleSound(); e.currentTarget.classList.toggle('snd',SOUND_ON); };
}
function openImmerse(id, back){
  uTrack('immerse_open',{id:id});
  IMM_LIST=MEDIA.flat().filter(x=>!x.pending);
  IMM_I=Math.max(0,IMM_LIST.findIndex(x=>x.id===id));
  const target = (typeof back==='function') ? back : function(){ renderSanctuary(profile.stack||true); };
  IMM_BACK = function(){ closeImmerse(); target(); };
  const wrap=document.createElement('div'); wrap.className='mvwrap'; wrap.id='imm';
  document.body.appendChild(wrap);
  immPaint();
  if(SOUND_ON){ soundStartBgm(); soundSetCat(IMM_LIST[IMM_I].theme,true); }
}
window.immStep=(d)=>{ if(!IMM_LIST.length) return; IMM_I=(IMM_I+d+IMM_LIST.length)%IMM_LIST.length; immPaint(); if(SOUND_ON) soundSetCat(IMM_LIST[IMM_I].theme,true); };
function renderImmerse(){ const f=MEDIA.flat().find(x=>!x.pending); openImmerse(f.id); }

/* ============ 统一声音引擎：画廊浏览 = 全局 BGM + 按分类环境音（真实录音） ============
 * 默认静音；右上角全局按钮开启；按可视分类自动切换环境音（淡入淡出）；选择存入 localStorage。
 * 全部使用本地真实录音（media/audio 下，源自原站），未做任何 AI 合成。 */
let SOUND_ON = lsGet('qn_sound', false);
let CUR_VIEW = 'gallery';
let _bgm=null, _amb=null, _ambCat=null, _ambCache={}, _io=null, _activeCat='canyon';
const BGM_SRC='media/audio/music_day.mp3';
/* 每个分类一个真实自然录音（mixkit CC0 自由授权），互不重复，符合「按主题配真实环境音」 */
const CAT_AMB = {
  canyon:'media/audio/amb_canyon.mp3', clouds:'media/audio/amb_clouds.mp3', coast:'media/audio/amb_coast.mp3',
  aurora:'media/audio/amb_aurora.mp3', wild:'media/audio/amb_wild.mp3', forest:'media/audio/amb_forest.mp3',
  sky:'media/audio/amb_sky.mp3', water:'media/audio/amb_water.mp3', video:null
};
const CAT_VOL = { canyon:.28, clouds:.22, coast:.30, aurora:.24, wild:.34, forest:.30, sky:.22, water:.30, video:0 };
function audioEl(src){ const a=new Audio(src); a.loop=true; a.preload='none'; return a; }
function fadeTo(a,target,secs,done){
  if(!a){ done&&done(); return; }
  const iv=50, steps=Math.max(1,Math.round(secs*1000/iv));
  const inc=(target-a.volume)/steps;
  clearInterval(a._fv);
  a._fv=setInterval(()=>{
    let v=a.volume+inc;
    if((inc>0&&v>=target)||(inc<0&&v<=target)||v<0||v>1){ v=Math.max(0,Math.min(1,target)); a.volume=v; clearInterval(a._fv); a._fv=null; if(target===0&&done) done(); }
    else a.volume=v;
  },iv);
}
function soundStartBgm(){ if(!_bgm){ _bgm=audioEl(BGM_SRC); _bgm.volume=0; } _bgm.play().then(()=>{}).catch(()=>{}); fadeTo(_bgm,0.12,2); }
function soundStopAll(){ if(_bgm){ const b=_bgm; fadeTo(b,0,1,()=>b.pause()); } soundAmbStop(); }
function soundAmbStop(){ if(_amb){ const a=_amb; fadeTo(a,0,1,()=>a.pause()); _amb=null; } _ambCat=null; }
function soundAmbFor(cat){ if(!cat||cat==='video'||!CAT_AMB[cat]) return null; if(!_ambCache[cat]){ _ambCache[cat]=audioEl(CAT_AMB[cat]); _ambCache[cat].volume=0; } return _ambCache[cat]; }
function soundSetCat(cat,force){
  if(!SOUND_ON) return;
  if(!force && inPlayer()) return;   // 画廊滚动时不打断播放器；播放器内部用 force=true 主动切
  if(cat===_ambCat) return;
  const prev=_amb; _ambCat=cat;
  const next=(cat&&cat!=='video'&&CAT_AMB[cat])?soundAmbFor(cat):null;
  if(prev&&prev!==next){ const o=prev; fadeTo(o,0,1,()=>o.pause()); }
  _amb=next;
  if(_amb){ _amb.play().then(()=>{}).catch(()=>{}); fadeTo(_amb,CAT_VOL[cat]||0.25,1.5); }
}
function inPlayer(){ return !!MV_WRAP || !!document.getElementById('imm'); }
function setupGalleryIO(){
  if(_io) _io.disconnect();
  _io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ _activeCat=e.target.dataset.cat; if(SOUND_ON&&CUR_VIEW==='gallery'&&!inPlayer()) soundSetCat(_activeCat); } });
  },{root:screen,rootMargin:'-45% 0px -45% 0px',threshold:0});
  screen.querySelectorAll('.gcat').forEach(s=>_io.observe(s));
}
function initSoundBtn(){
  let b=document.getElementById('soundBtn');
  if(!b){
    b=document.createElement('button'); b.id='soundBtn';
    /* z-index 必须低于播放器 .mvwrap(40)，否则会盖住观看器右上角的 ♡收藏 / ⛶全屏 */
    b.style.cssText='position:fixed;top:calc(12px + var(--safe-t,0px));right:12px;z-index:36;display:flex;align-items:center;gap:6px;padding:8px 13px;border-radius:22px;background:rgba(10,15,13,.62);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid var(--glass-border,rgba(255,255,255,.16));color:#eaf1ec;font-size:13px;cursor:pointer;font-family:inherit';
    document.body.appendChild(b);
  }
  b.onclick=()=>playerToggleSound();
  soundUpdateBtn();
}
function soundUpdateBtn(){
  const b=document.getElementById('soundBtn'); if(!b) return;
  b.innerHTML='<span class="ic">'+(SOUND_ON?'🔊':'🔇')+'</span><span class="tx">'+(SOUND_ON?'声音已开':'开启声音')+'</span>';
  b.style.background = SOUND_ON?'rgba(95,227,190,.22)':'rgba(10,15,13,.62)';
  b.style.borderColor = SOUND_ON?'rgba(95,227,190,.5)':'rgba(255,255,255,.16)';
}
/* 全局唯一的声音开关：任何视图/播放器内都调它（符合「只有一个全局按钮、无逐图按钮」） */
function playerToggleSound(){
  SOUND_ON=!SOUND_ON; lsSet('qn_sound',SOUND_ON);
  if(!SOUND_ON){ soundStopAll(); }
  else {
    soundStartBgm();                       // BGM 全站常驻
    let cat=null;
    if(MV_WRAP && MV_LIST[MV_I]) cat=MV_LIST[MV_I].theme;
    else if(document.getElementById('imm') && IMM_LIST[IMM_I]) cat=IMM_LIST[IMM_I].theme;
    else if(CUR_VIEW==='gallery') cat=_activeCat;
    if(cat){ _ambCat=null; soundSetCat(cat,true); }
  }
  soundUpdateBtn(); soundSyncPlayerBtns();
}
/* 播放器（观看器/沉浸）顶栏内的声音按钮与全局状态保持同步 */
function soundSyncPlayerBtns(){
  ['mv-snd','imm-snd'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    el.textContent=SOUND_ON?'🔊':'🔇';
    el.style.background=SOUND_ON?'rgba(95,227,190,.24)':'rgba(255,255,255,.1)';
  });
}

/* 收藏联播 */
function renderFav(){
  CUR_VIEW='fav'; soundStopAll();
  const all=MEDIA.flat().filter(x=>favList().indexOf(x.id)>=0 && !x.pending);
  let h=modHeader('fav','收藏的场景，连成一段安静的时光');
  if(!all.length){
    h+='<div class="card" style="margin-top:16px"><p class="muted" style="font-size:13px;line-height:1.7">还没有收藏任何一景。<br>回到「入景」，点右下角的 ♡ 即可加入这里，连播成一段属于自己的自然时光。</p>'+
       '<button class="btn" style="margin-top:12px" onclick="go(\'gallery\')">去入景收藏</button></div>';
    screen.innerHTML=h; return;
  }
  h+='<div class="mcard" style="margin-top:14px"><div class="mvacts" style="margin-top:0">'+
     '<div class="mvact" id="fav-play"><b>连播</b>开始 / 暂停</div>'+
     '<div class="mvact" id="fav-prev"><b>上一景</b></div>'+
     '<div class="mvact" id="fav-next"><b>下一景</b></div></div></div>';
  h+='<div id="fav-stage" style="margin-top:14px;border-radius:16px;overflow:hidden;aspect-ratio:4/3;background:#000;position:relative"></div>';
  h+='<div class="muted center" style="font-size:12px;margin-top:8px" id="fav-cap"></div>';
  screen.innerHTML=h;
  let idx=0, timer=null, aud=null, aud2=null;
  function show(){
    const it=all[idx];
    document.getElementById('fav-stage').innerHTML = it.type==='video'
      ? '<video src="'+it.file+'" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover"></video>'
      : '<img src="'+it.file+'" style="width:100%;height:100%;object-fit:cover">';
    document.getElementById('fav-cap').textContent=(idx+1)+'/'+all.length+' · '+it.title;
    if(aud){ aud.pause(); aud=null; } if(aud2){ aud2.pause(); aud2=null; }
    if(SOUND_ON && it.music){ aud=new Audio(it.music); aud.loop=true; aud.volume=.42; aud.play().catch(()=>{}); }
    if(SOUND_ON && it.audio){ aud2=new Audio(it.audio); aud2.loop=true; aud2.volume=.30; aud2.play().catch(()=>{}); }
  }
  function step(d){ idx=(idx+d+all.length)%all.length; show(); }
  function play(){ FAV_RUN=true; document.getElementById('fav-play').innerHTML='<b>暂停</b>开始 / 暂停'; show(); timer=setInterval(()=>step(1),8000); }
  function pause(){ FAV_RUN=false; document.getElementById('fav-play').innerHTML='<b>连播</b>开始 / 暂停'; clearInterval(timer); timer=null; if(aud){aud.pause();aud=null;} if(aud2){aud2.pause();aud2=null;} }
  document.getElementById('fav-play').onclick=()=>{ FAV_RUN?pause():play(); };
  document.getElementById('fav-prev').onclick=()=>{ if(FAV_RUN)pause(); step(-1); };
  document.getElementById('fav-next').onclick=()=>{ if(FAV_RUN)pause(); step(1); };
  show();
}

/* ============ 诗签 / 组诗签 · 壁纸级创作 ============
 * 诗签（单图）：4 种模板（电影感 / 竖排书法 / 杂志跨页 / 极简禅意）+ 多字体
 * 组诗签（2–4 图）：多图走诗签美学，每套模板定制文字位置，不再是硬拼网格
 * 所有图片等比完整显示（contain），绝不裁切；导出分辨率高，可作壁纸
 * 预览与导出共用同一套排版函数（creCompose），所见即所得 */
let CRE_MODE='poem', CRE_ONE=null, CRE_SEL=[], CRE_TPL='cinema', CRE_FONT='serif';
let CRE_SRC='reader', CRE_Q=null, CRE_TEXT='', CRE_AUTHOR='';

const CRE_TPL_LIST=[
  {id:'cinema',n:'电影感'},
  {id:'vertical',n:'竖排书法'},
  {id:'magazine',n:'杂志跨页'},
  {id:'zen',n:'极简禅意'}
];
const CRE_FONT_LIST=[
  {id:'serif',n:'宋体'},
  {id:'sans',n:'黑体'},
  {id:'kai',n:'楷体'},
  {id:'brush',n:'行楷'}
];
function creFontFamily(k){
  if(k==='sans') return '"Noto Sans SC",sans-serif';
  if(k==='kai') return '"KaiTi","STKaiti","Noto Serif SC",serif';
  if(k==='brush') return '"Ma Shan Zheng","Noto Serif SC",cursive';
  return '"Noto Serif SC",serif';
}

function crePool(){ return MEDIA.flat().filter(x=>!x.pending && x.type!=='video'); }
function creRandQuote(){
  const L=window.READER_LIB||[];
  if(!L.length) return {t:'把世界的喧嚣留在门外。',a:'自然之境'};
  const q=L[Math.floor(Math.random()*L.length)];
  return {t:q.t,a:q.a||'佚名'};
}
function creQuote(){
  if(CRE_SRC==='own') return {t:(CRE_TEXT||'（在此写一句想留下的话）'),a:CRE_AUTHOR||''};
  if(!CRE_Q) CRE_Q=creRandQuote();
  return CRE_Q;
}

function renderCreate(){
  injectGalleryCSS();
  const pool=crePool();
  if(!pool.length){ screen.innerHTML=modHeader('create','暂无可用底图'); return; }
  if(!CRE_ONE||!MEDIA.byId(CRE_ONE)) CRE_ONE=pool[0].id;
  CRE_SEL=CRE_SEL.filter(function(id){ return MEDIA.byId(id); });
  if(CRE_MODE==='group' && CRE_SEL.length<1) CRE_SEL=[pool[0].id];
  const keep=screen.scrollTop||0;
  let h=modHeader('create','把一张自然，和一句话，留成一张卡片');
  h+='<div class="cmodes">'+
     '<div class="cmode'+(CRE_MODE==='poem'?' on':'')+'" data-cm="poem">诗签<small>单图 + 一句话</small></div>'+
     '<div class="cmode'+(CRE_MODE==='group'?' on':'')+'" data-cm="group">组诗签<small>2–4 张合成</small></div>'+
     '</div>';
  h+='<div class="chint">模板</div><div class="cmodes" style="flex-wrap:wrap;gap:8px">';
  CRE_TPL_LIST.forEach(function(t){ h+='<div class="cmode'+(CRE_TPL===t.id?' on':'')+'" data-tpl="'+t.id+'">'+t.n+'</div>'; });
  h+='</div>';
  h+='<div class="chint">字体</div><div class="clay" style="flex-wrap:wrap;gap:8px">';
  CRE_FONT_LIST.forEach(function(f){ h+='<div class="clayb'+(CRE_FONT===f.id?' on':'')+'" data-font="'+f.id+'">'+f.n+'</div>'; });
  h+='</div>';
  h+='<div class="chint">文字来源</div><div class="clay">'+
     '<div class="clayb'+(CRE_SRC==='reader'?' on':'')+'" data-cs="reader">读者金句</div>'+
     '<div class="clayb'+(CRE_SRC==='own'?' on':'')+'" data-cs="own">自己写</div>'+
     (CRE_SRC==='reader'?'<div class="clayb" id="c-shuffle">换一句 ↻</div>':'')+'</div>';
  if(CRE_SRC==='own'){
    h+='<div class="card" style="margin-top:10px">'+
       '<input class="inp" id="c-text" placeholder="写一句想留下的话" maxlength="46" value="'+esc(CRE_TEXT)+'">'+
       '<input class="inp" id="c-author" placeholder="署名（可留空）" maxlength="16" style="margin-top:8px" value="'+esc(CRE_AUTHOR)+'"></div>';
  }
  if(CRE_MODE==='poem'){
    h+='<div class="chint">底图 · 共 '+pool.length+' 张（等比完整显示，不裁切）</div>';
    h+='<div class="cthumbs">'+pool.map(function(p){
        return '<div class="cthumb'+(p.id===CRE_ONE?' on':'')+'" data-one="'+p.id+'"><img src="'+p.file+'" loading="lazy" alt="'+esc(p.title)+'"></div>';
      }).join('')+'</div>';
  } else {
    h+='<div class="muted" style="font-size:12px;margin:2px 0 4px">已选 <b style="color:var(--accent)">'+CRE_SEL.length+'</b> / 4 张 · 轻触图片加入或移除</div>';
    h+='<div class="ggrid cpick">'+pool.map(function(it){
        const k=CRE_SEL.indexOf(it.id);
        return '<div class="gcell" data-cid="'+it.id+'"'+(k>=0?' style="outline:2px solid var(--accent);outline-offset:-2px"':'')+'>'+
          '<img src="'+it.file+'" loading="lazy" alt="'+esc(it.title)+'">'+
          (k>=0?'<div class="cbadge">'+(k+1)+'</div>':'')+
          '<div class="gtx"><div class="gt">'+esc(it.title)+'</div></div></div>';
      }).join('')+'</div>';
  }
  h+='<div class="chint">预览（与导出一致）</div><canvas id="cpv-canvas" class="cpv-canvas"></canvas>';
  h+='<div class="dm-row" style="margin-top:14px"><button class="btn" id="c-make">生成卡片</button>'+
     '<button class="btn ghost" onclick="go(\'gallery\')">返回入景</button></div>';
  h+='<div id="c-out"></div>';
  screen.innerHTML=h;
  screen.querySelectorAll('[data-cm]').forEach(function(el){ el.onclick=function(){ CRE_MODE=el.dataset.cm; screen.scrollTop=0; renderCreate(); }; });
  screen.querySelectorAll('[data-tpl]').forEach(function(el){ el.onclick=function(){ CRE_TPL=el.dataset.tpl; renderCreate(); }; });
  screen.querySelectorAll('[data-font]').forEach(function(el){ el.onclick=function(){ CRE_FONT=el.dataset.font; renderCreate(); }; });
  screen.querySelectorAll('[data-cs]').forEach(function(el){ el.onclick=function(){ CRE_SRC=el.dataset.cs; renderCreate(); }; });
  const sh=document.getElementById('c-shuffle'); if(sh) sh.onclick=function(){ CRE_Q=creRandQuote(); renderCreate(); };
  const tx=document.getElementById('c-text'); if(tx) tx.oninput=function(){ CRE_TEXT=tx.value; updatePreviewText(); };
  const au=document.getElementById('c-author'); if(au) au.oninput=function(){ CRE_AUTHOR=au.value; updatePreviewText(); };
  if(CRE_MODE==='poem'){
    screen.querySelectorAll('[data-one]').forEach(function(t){ t.onclick=function(){ CRE_ONE=t.dataset.one; renderCreate(); }; });
  } else {
    screen.querySelectorAll('[data-cid]').forEach(function(c){ c.onclick=function(){
      const id=c.dataset.cid, k=CRE_SEL.indexOf(id);
      if(k>=0) CRE_SEL.splice(k,1);
      else { if(CRE_SEL.length>=4){ toast('最多 4 张'); return; } CRE_SEL.push(id); }
      renderCreate();
    }; });
  }
  const mk=document.getElementById('c-make'); if(mk) mk.onclick=creExport;
  crePaintPreview();
  screen.scrollTop=keep;
}

/* ---------- 以下旧版诗签三函数（crePoemHtml / crePoemBind / crePoemExport）已并入统一 renderCreate + creCompose，避免重复 ---------- */

/* ---------- 统一排版：诗签 / 组诗签（预览与导出共用同一套函数） ---------- */
function creCompose(g, W, H, items, q, tpl, fontKey){
  const fam=creFontFamily(fontKey);
  const aRGB=accentRGB();
  if(items.length===1){
    const im=items[0];
    const r=Math.min(W/im.width, H/im.height);
    const dw=im.width*r, dh=im.height*r, dx=(W-dw)/2, dy=(H-dh)/2;
    const bg=g.createLinearGradient(0,0,0,H); bg.addColorStop(0,'#0c1411'); bg.addColorStop(1,'#070d0b');
    g.fillStyle=bg; g.fillRect(0,0,W,H);
    g.drawImage(im,dx,dy,dw,dh);
  } else {
    const bg=g.createLinearGradient(0,0,0,H); bg.addColorStop(0,'#101a16'); bg.addColorStop(1,'#0a0f0d');
    g.fillStyle=bg; g.fillRect(0,0,W,H);
    const pad=Math.round(Math.min(W,H)*0.04), gap=Math.round(Math.min(W,H)*0.018), rad=Math.round(Math.min(W,H)*0.02);
    const aX=pad,aY=pad,aW=W-pad*2,aH=H-pad*2, n=items.length;
    let boxes=[];
    if(n===2){ const hh=(aH-gap)/2; boxes=[[aX,aY,aW,hh],[aX,aY+hh+gap,aW,hh]]; }
    else if(n===3){ const hh=(aH-gap*2)/3; boxes=[[aX,aY,aW,hh],[aX,aY+hh+gap,aW,hh],[aX,aY+(hh+gap)*2,aW,hh]]; }
    else { const cols=2, rows=Math.ceil(n/cols), cw=(aW-gap)/cols, ch=(aH-gap*(rows-1))/rows;
      for(let i=0;i<n;i++){ const c=i%cols, rr=Math.floor(i/cols); boxes.push([aX+c*(cw+gap),aY+rr*(ch+gap),cw,ch]); } }
    boxes.forEach(function(b,i){ const x=b[0],y=b[1],w=b[2],h=b[3];
      g.save(); cvRound(g,x,y,w,h,rad); g.clip(); if(items[i]) cvContain(g,items[i],x,y,w,h); g.restore();
      g.save(); cvRound(g,x+.5,y+.5,w-1,h-1,rad); g.strokeStyle='rgba(255,255,255,.10)'; g.lineWidth=1; g.stroke(); g.restore();
    });
  }
  creDrawText(g, tpl, fam, q, W, H, aRGB);
}
function creDrawText(g, tpl, fam, q, W, H, accentRGB){
  g.textBaseline='alphabetic'; g.textAlign='left';
  const pad=Math.round(Math.min(W,H)*0.06);
  const accent='rgba('+accentRGB+',.92)';
  const scrim=tpl==='zen'?0.30:(tpl==='magazine'?0.55:0.62);
  const gr=g.createLinearGradient(0,H*0.42,0,H);
  gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(.6,'rgba(0,0,0,'+(scrim*0.5)+')'); gr.addColorStop(1,'rgba(0,0,0,'+scrim+')');
  g.fillStyle=gr; g.fillRect(0,H*0.42,W,H*0.58);
  if(tpl==='vertical'){
    g.save();
    const colW=Math.round(Math.min(W,H)*0.12), fs=Math.round(Math.min(W,H)*0.075);
    g.font='400 '+fs+'px '+fam; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='rgba(245,250,247,.95)';
    const chars=Array.from(q.t).filter(function(c){return c!=='\n';});
    const perCol=Math.floor((H-pad*2)/(fs*1.06));
    const startX=W-pad-colW/2, maxCol=Math.floor((W-pad*2)/colW);
    let col=0, ci=0;
    while(ci<chars.length && col<maxCol){
      const x=startX-col*colW; let y=pad+fs*0.6;
      for(let r=0;r<perCol && ci<chars.length;r++,ci++){ g.fillText(chars[ci],x,y); y+=fs*1.06; }
      col++;
    }
    if(q.a){ g.font='400 '+Math.round(fs*0.5)+'px '+fam; g.fillStyle='rgba(234,241,236,.72)';
      const ax=pad+Math.round(fs*0.4); let ay=H-pad;
      Array.from('—— '+q.a).forEach(function(ch){ g.fillText(ch,ax,ay); ay-=fs*0.55; }); }
    g.restore(); return;
  }
  const fs=Math.round(Math.min(W,H)*(tpl==='zen'?0.030:0.036));
  g.font='400 '+fs+'px '+fam;
  const lines=cvLines(g,q.t,W-pad*2);
  const maxLines=tpl==='zen'?5:(tpl==='magazine'?4:6);
  const shown=lines.slice(0,maxLines);
  const lh=fs*1.5;
  if(tpl==='zen'){
    g.textAlign='center'; const blockH=shown.length*lh; let y=H*0.60-blockH/2+fs*0.2;
    g.fillStyle='#F2F7F3'; g.font='400 '+fs+'px '+fam;
    for(let i=0;i<shown.length;i++){ g.fillText(shown[i],W/2,y); y+=lh; }
    g.fillStyle='rgba(238,246,242,.09)'; g.font='500 '+Math.round(fs*0.46)+'px "Noto Sans SC",sans-serif'; g.fillText('自 然 之 境',W/2,y+fs*0.2);
    if(q.a){ g.fillStyle='rgba(234,241,236,.7)'; g.font='400 '+Math.round(fs*0.8)+'px '+fam; g.fillText('—— '+q.a,W/2,y+fs*1.0); }
    return;
  }
  const blockH=shown.length*lh; const textTop=H-pad-blockH+fs*0.2;
  g.fillStyle='rgba(238,246,242,.10)'; g.font='500 '+Math.round(fs*0.42)+'px "Noto Sans SC",sans-serif';
  g.fillText('自然之境', pad, textTop-fs*0.7);
  if(tpl==='magazine'){ g.strokeStyle='rgba('+accentRGB+',.5)'; g.lineWidth=1; g.beginPath(); g.moveTo(pad,textTop-fs*0.45); g.lineTo(pad+Math.round(Math.min(W,H)*0.12),textTop-fs*0.45); g.stroke(); }
  g.fillStyle='#F2F7F3'; g.font='400 '+fs+'px '+fam; g.textAlign='left';
  for(let i=0;i<shown.length;i++){ g.fillText(shown[i],pad,textTop+i*lh); }
  if(q.a){ g.fillStyle='rgba(234,241,236,.82)'; g.font='400 '+Math.round(fs*0.8)+'px '+fam; g.fillText('—— '+q.a,pad,H-pad+Math.round(fs*0.12)); }
}
function creExport(){
  const meta=CRE_MODE==='poem'?[MEDIA.byId(CRE_ONE)]:CRE_SEL.map(function(id){return MEDIA.byId(id);}).filter(Boolean);
  if(!meta.length){ toast('先选底图'); return; }
  if(CRE_MODE==='group' && meta.length<2){ toast('组诗签至少选 2 张'); return; }
  const q=creQuote(); toast('正在合成…');
  cvLoad(meta.map(function(x){return x.file;}),function(ims){
    const imgs=ims.filter(Boolean);
    if(imgs.length<(CRE_MODE==='group'?2:1)){ toast('图片未能载入，无法导出'); return; }
    let W,H;
    if(CRE_MODE==='poem'){ const im=imgs[0]; const MAX=1600; const sc=Math.min(1,MAX/Math.max(im.width,im.height)); W=Math.round(im.width*sc); H=Math.round(im.height*sc); }
    else { W=1080; H=1620; }
    const cv=document.createElement('canvas'); cv.width=W; cv.height=H; const g=cv.getContext('2d');
    creCompose(g,W,H,imgs,q,CRE_TPL,CRE_FONT);
    let url;
    try{ url=cv.toDataURL('image/png'); }
    catch(e){ toast('导出受限：图片跨域，请长按下方预览图保存'); crePaintPreview(); return; }
    cvOut(url,CRE_MODE==='group'?'自然之境-组诗签.png':'自然之境-诗签.png');
  });
}
function crePaintPreview(){
  const cv=document.getElementById('cpv-canvas'); if(!cv) return;
  const meta=CRE_MODE==='poem'?[MEDIA.byId(CRE_ONE)]:CRE_SEL.map(function(id){return MEDIA.byId(id);}).filter(Boolean);
  const q=creQuote();
  if(!meta.length){ crePaintMsg(cv,'先选一张底图'); return; }
  cvLoad(meta.map(function(x){return x.file;}),function(ims){
    const imgs=ims.filter(Boolean);
    if(!imgs.length){ crePaintMsg(cv,'底图未能载入（网络或跨域受限）'); return; }
    let W,H;
    if(CRE_MODE==='poem'){ const im=imgs[0]; const MAX=540; const sc=Math.min(1,MAX/Math.max(im.width,im.height)); W=Math.round(im.width*sc); H=Math.round(im.height*sc); }
    else { W=360; H=540; }
    cv.width=W; cv.height=H; const g=cv.getContext('2d');
    try{ creCompose(g,W,H,imgs,q,CRE_TPL,CRE_FONT); }
    catch(e){ crePaintMsg(cv,'合成出错：'+(e&&e.message?e.message:e)); }
  });
}
function crePaintMsg(cv,msg){
  cv.width=360; cv.height=240; const g=cv.getContext('2d');
  g.clearRect(0,0,cv.width,cv.height);
  g.fillStyle='rgba(255,255,255,.04)'; g.fillRect(0,0,cv.width,cv.height);
  g.fillStyle='rgba(234,241,236,.62)'; g.font='14px "Noto Sans SC",sans-serif';
  g.textAlign='center'; g.textBaseline='middle'; g.fillText(msg, cv.width/2, cv.height/2);
}
function updatePreviewText(){ crePaintPreview(); }

/* ---------- canvas 公共工具（等比完整 / 模糊铺底 / 圆角 / 折行 / 输出） ---------- */
function cvLoad(files,cb){
  const out=new Array(files.length).fill(null); let n=0;
  if(!files.length){ cb(out); return; }
  files.forEach((f,i)=>{ const im=new Image();
    im.onload=()=>{ out[i]=im; if(++n===files.length) cb(out); };
    im.onerror=()=>{ if(window.console) console.warn('[collage] 图片载入失败:',f); if(++n===files.length) cb(out); };
    im.src=f; });
}
function cvContain(g,im,x,y,w,h){
  if(!im||!im.width) return;
  const r=Math.min(w/im.width,h/im.height), dw=im.width*r, dh=im.height*r;
  g.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
function cvCoverBlur(g,im,x,y,w,h){
  g.save(); g.beginPath(); g.rect(x,y,w,h); g.clip();
  if(im&&im.width){
    const r=Math.max(w/im.width,h/im.height)*1.2, dw=im.width*r, dh=im.height*r;
    try{ g.filter='blur(30px) brightness(.45) saturate(1.1)'; }catch(e){}
    g.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
    try{ g.filter='none'; }catch(e){}
  } else { g.fillStyle='#101a16'; g.fillRect(x,y,w,h); }
  g.restore();
}
function cvRound(g,x,y,w,h,r){
  g.beginPath(); g.moveTo(x+r,y);
  g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r);
  g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath();
}
function cvLines(g,t,maxW){
  const lines=[]; let line='';
  for(const ch of String(t).split('')){
    if(ch==='\n'){ lines.push(line); line=''; continue; }
    if(g.measureText(line+ch).width>maxW&&line){ lines.push(line); line=ch; } else line+=ch;
  }
  if(line) lines.push(line);
  return lines;
}
function cvOut(url,name){
  const box=document.getElementById('c-out'); if(!box) return;
  box.innerHTML='<img src="'+url+'" style="width:100%;border-radius:16px;border:1px solid var(--glass-border)">'+
    '<a class="btn" style="margin-top:12px;display:block;text-align:center;text-decoration:none" href="'+url+'" download="'+name+'">保存到相册</a>'+
    '<div class="muted" style="font-size:11px;text-align:center;margin-top:6px">若下载被拦，长按上图选「保存图片」</div>';
  setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'center'}),60);
}

function renderSanctuary(enter, defKey){
  const defStack = (defKey!==undefined)? defKey : ((enter===true)? null : enter);
  const residentTitle = STACK_TITLE[profile.stack]||'自然栈';
  let html = `
    <div class="center" style="margin:14px 0 4px">
      <div class="h2 serif">空栈</div>
      <div class="muted" style="font-size:12px">5 栈 / 27 模块</div>
    </div>
    <p class="muted center" style="font-size:12px;margin:6px 0 2px">你常驻于「<b style="color:var(--accent)">${residentTitle}</b>」· 在这里慢慢看</p>`+
  `<p class="muted center" style="font-size:11px;margin:0 0 6px;opacity:.78">一座安放注意力的小岛——在这里，世界的喧嚣会慢下来。</p>`;
  STACKS.forEach(s=>{
    const isDef = s.key===defStack;
    html += `<div class="stack${isDef?' def':''}" data-stack="${s.key}">
      <div class="stack-head"><span class="sn serif">${s.title}</span>${isDef?'<span class="tag" style="margin-left:8px;font-size:11px">常驻</span>':''}<span class="se en">${s.en}</span></div>
      <div class="grid2">`;
    s.modules.forEach(k=>{ const m=MODULES[k];
      const live = !!(BOARDS[k]||MODULE_RENDER[k]);
      const seen = (k===LAST_MOD);
      html += `<div class="mod${live?' live':''}${seen?' just-seen':''}" data-mod="${k}">
        <div class="mi">${m.i}</div><div class="mt">${m.t}</div><div class="me">${m.en}</div>
        <div class="md">${m.d}</div>${seen?'<div class="seen-tag">刚看过</div>':''}<div class="mk">${live?'可进入':'框架待实现'}</div></div>`; });
    html += `</div></div>`;
  });
  screen.innerHTML = html;
  screen.querySelectorAll('.mod').forEach(el=>{
    el.addEventListener('click',()=>openModule(el.dataset.mod));
  });
  if(enter) playDoor();
  buildStackRail();
}
/* 从板块返回栖处：恢复离开时的滚动位置，高亮刚看过的模块，展开悬浮栈导航 */
function returnToSanctuary(){
  renderSanctuary(false, profile.stack);
  requestAnimationFrame(()=>{
    screen.scrollTop = SANCTUARY_SCROLL;
    buildStackRail();
    if(LAST_MOD){ toast('已回到你离开的地方'); LAST_MOD=null; }
  });
}

/* 栖处右侧悬浮栈导航：快速跳转 + 滚动联动高亮 */
const SRAIL_LABEL = {nature:'自',reader:'读',void:'留',fold:'折',module:'模'};
function buildStackRail(){
  let rail = document.getElementById('stackRail');
  if(!rail){ rail = document.createElement('div'); rail.id = 'stackRail'; document.getElementById('app').appendChild(rail); }
  rail.innerHTML = STACKS.map(s=>{
    const on = s.key===profile.stack ? ' on' : '';
    return `<div class="srail-dot${on}" data-stack="${s.key}" title="${s.title}">${SRAIL_LABEL[s.key]||s.title[0]}</div>`;
  }).join('');
  rail.querySelectorAll('.srail-dot').forEach(d=>{
    d.addEventListener('click',()=>{
      const target = screen.querySelector(`.stack[data-stack="${d.dataset.stack}"]`);
      if(target){
        const y = target.getBoundingClientRect().top - screen.getBoundingClientRect().top + screen.scrollTop - 12;
        screen.scrollTo({top:Math.max(0,y),behavior:'smooth'});
      }
    });
  });
  if(!screen._railScroll){ screen._railScroll = ()=> updateRailActive(); screen.addEventListener('scroll',screen._railScroll,{passive:true}); }
  rail.classList.add('in');
  updateRailActive();
}
function hideStackRail(){
  const rail = document.getElementById('stackRail');
  if(rail) rail.classList.remove('in');
}
function updateRailActive(){
  const rail = document.getElementById('stackRail');
  if(!rail) return;
  let active = profile.stack;
  const topPad = 170;
  screen.querySelectorAll('.stack[data-stack]').forEach(st=>{
    const r = st.getBoundingClientRect(), p = screen.getBoundingClientRect();
    if((r.top - p.top) <= topPad) active = st.dataset.stack;
  });
  rail.querySelectorAll('.srail-dot').forEach(d=> d.classList.toggle('on', d.dataset.stack===active));
}

function renderWebmaster(){
  const lv=OWNER?OWNER.level:0, rl=OWNER?OWNER.role:'—';
  screen.innerHTML = `
    <div class="wm-reveal" id="wm-reveal">
    <div class="center" style="margin:16px 0 6px"><div class="h2 serif">站长模式</div>
      <div class="muted" style="font-size:12px">隐秘入口 · 仅口令持有者可入</div></div>
    <div class="card" style="margin-top:14px">
      <div class="stat-box">
        <div style="font-size:13px;color:var(--accent);margin-bottom:6px">当前权限（预留多等级）</div>
        <div class="stat-row"><span>角色</span><b>${rl}</b></div>
        <div class="stat-row"><span>等级</span><b>${lv} / 2</b><i class="muted" style="font-style:normal">2=站长 · 后续可扩展 1=编辑 等</i></div>
      </div>
      <div class="stat-box">
        <div style="font-size:13px;color:var(--accent);margin-bottom:6px">站点访问（不蒜子 · 全站累计）</div>
        <div class="stat-row"><span>页面浏览</span><b>— 次</b><i class="muted" style="font-style:normal">正式部署后由不蒜子填充</i></div>
        <div class="stat-row"><span>独立访客</span><b>— 人</b><i class="muted" style="font-style:normal">正式部署后由不蒜子填充</i></div>
      </div>
      <div class="stat-box">
        <div style="font-size:13px;color:var(--accent);margin-bottom:6px">本机访问信息（免后端 · 实时）</div>
        <div class="stat-row"><span>来源</span><b id="st-src">—</b></div>
        <div class="stat-row"><span>设备</span><b id="st-dev">—</b></div>
        <div class="stat-row"><span>系统</span><b id="st-os">—</b></div>
        <div class="stat-row"><span>浏览器</span><b id="st-br">—</b></div>
        <div class="stat-row"><span>本机累计</span><b id="st-n">— 次</b></div>
      </div>
      <div class="stat-box">
        <div style="font-size:13px;color:var(--accent);margin-bottom:6px">全站数据统计（Umami）</div>
        <div class="muted" style="font-size:12px;line-height:1.7">全站访问量、访客、来源，以及每个模块的使用次数都已实时上报到 Umami。此入口仅站长可见。<b>「公开看板」</b>不用登录直接看总览；要看每个功能的具体使用次数（如打开画廊几次、落了几颗石子），请用 Umami 账号登录后台，进 <b>Events（事件）</b> 页。</div>
        <div class="row" style="margin-top:10px;gap:8px;flex-wrap:wrap">
          <button class="btn small" onclick="window.open('https://cloud.umami.is/share/9jWJNod4YoeVTqMW','_blank')">公开看板（免登录）</button>
          <button class="btn small ghost" onclick="window.open('https://cloud.umami.is','_blank')">登录完整后台</button>
          <button class="btn small ghost" onclick="wmCopyUmamiId()">复制 Website ID</button>
        </div>
        <div id="wm-umami-id" class="muted" style="font-size:11px;margin-top:8px;word-break:break-all">Website ID：debce0ab-aea3-454a-bbca-e7d1df38ea26</div>
      </div>
      <div class="stat-box">
        <div style="font-size:13px;color:var(--accent);margin-bottom:6px">内容审核 · 删除权限</div>
        <div class="muted" style="font-size:12px;line-height:1.7">站长模式下，共笔墙 / 共读库 / 漂流瓶 / 微光留言 的公开内容将显示「删除」按钮，可清理违规。真实删除走 GitHub 仓库（Discussions 手动）。</div>
        <div class="row" style="margin-top:10px;gap:8px;flex-wrap:wrap">
          <button class="btn small" onclick="wmProbeCloud()">云端权限自检</button>
          <button class="btn small ghost" onclick="wmCopyHidden()">复制屏蔽名单</button>
          <button class="btn small ghost" onclick="wmPasteHidden()">导入屏蔽名单</button>
        </div>
        <div id="wm-cloud-status" class="muted" style="font-size:12px;margin-top:8px">点击「云端权限自检」查看当前 PAT 能否读写 Discussion。</div>
      </div>
      <button class="btn ghost" style="margin-top:14px;width:100%" onclick="exitWm()">退出站长模式</button>
    </div>
    </div>`;
  fillSelfStats();
  const r=document.getElementById('wm-reveal'); if(r){ void r.offsetWidth; r.classList.add('in'); } // 缓缓浮现
}
function fillSelfStats(){
  const ua=navigator.userAgent;
  const src=/micromessenger/.test(ua)?'内置浏览器':(/qq\//.test(ua)?'QQ':'系统浏览器');
  const dev=/android/i.test(ua)?'移动端':/iphone|ipad/i.test(ua)?'iOS':'桌面';
  const os=/android/i.test(ua)?'Android':/iphone|ipad|mac/i.test(ua)?'Apple':'Windows/Linux';
  const br=/chrome/i.test(ua)?'Chrome':/safari/i.test(ua)?'Safari':/firefox/i.test(ua)?'Firefox':'其他';
  const n=(()=>{let c=localStorage.getItem('qn_visits')||0;c=+c+1;localStorage.setItem('qn_visits',c);return c;})();
  document.getElementById('st-src').textContent=src;
  document.getElementById('st-dev').textContent=dev;
  document.getElementById('st-os').textContent=os;
  document.getElementById('st-br').textContent=br;
  document.getElementById('st-n').textContent=n+' 次';
}

function renderSettings(){
  const c=Store.count();
  const initial=profile.name?profile.name[0]:'访';
  screen.innerHTML = `
    <div class="center" style="margin:16px 0 6px"><div class="h2 serif">设置</div>
      <div class="muted" style="font-size:12px">个人 · 数据 · 反馈</div></div>
    <div class="profile-row">
      <div class="avatar">${avatarInner(profile.avatar)}</div>
      <div><div class="pn">${profile.name||'来访者'}</div>
        <div class="ps">${moodLabel(profile.color)} · 常驻 ${STACK_TITLE[profile.stack]||'自然栈'}${profile.passcode?' · 已上锁':''}</div></div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="mod" onclick="openGate()"><div class="mi">🪪</div><div class="mt">个人资料</div><div class="md">昵称 / 心情色 / 常驻栈 / 个人锁</div></div>
      <div class="mod" style="margin-top:12px" onclick="requireUnlock(renderDataManage)"><div class="mi">💾</div><div class="mt">数据管理</div><div class="md">已存 ${c} 条 · 导出 / 导入 / 清空</div></div>
      <div class="mod" style="margin-top:12px" onclick="renderFeedback()"><div class="mi">📨</div><div class="mt">反馈 / 报 Bug</div><div class="md">把问题告诉我</div></div>
      <div class="mod" style="margin-top:12px" id="door-card">
        <div class="mi">🚪</div><div class="mt">门扉</div><div class="md">推开自然之门 · 开合快慢</div>
        <div class="chips" id="door-sp" style="margin-top:10px">
          <div class="chip" data-k="0.7">快</div><div class="chip" data-k="1">标准</div>
          <div class="chip" data-k="1.4">慢</div><div class="chip" data-k="1.9">很慢</div>
        </div>
        <button class="btn ghost" style="margin-top:12px" onclick="playDoor()">再推一次门</button>
      </div>
      <div class="mod" style="margin-top:12px" onclick="showExit()"><div class="mi">🌾</div><div class="mt">离开自然之境</div><div class="md">清空会话并刷新</div></div>
    </div>`;
  const sp=document.getElementById('door-sp'), cur=String(doorSpeed());
  sp.querySelectorAll('.chip').forEach(c=>{
    if(c.dataset.k===cur) c.classList.add('on');
    c.onclick=e=>{ e.stopPropagation();
      sp.querySelectorAll('.chip').forEach(x=>x.classList.remove('on')); c.classList.add('on');
      localStorage.setItem('qn_door_speed',c.dataset.k);
      toast('开门速度 · '+c.textContent); playDoor(); };
  });
  screen.scrollTop=0;
}

/* ===================== 推开自然之门（3D 透视 · 可调速） =====================
   DOOR_SPEED: 1 = 标准(约 3.9s)，可在设置里换 0.7 更快 / 1.4 更慢
   弱机（≤2 核 / ≤2G）自动走精简：门照常 3D 推开，只是更短、去掉雾团 */
let DOOR_TIMERS=[];
function doorSpeed(){ return +(localStorage.getItem('qn_door_speed')||1); }
function playDoor(){
  const d=document.getElementById('door');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 门外的世界：换上当前心境的背景图
  const mood=document.documentElement.getAttribute('data-mood')||'mist';
  const fp=d.querySelector('.far-photo');
  if(fp && BACKDROPS[mood]) fp.style.backgroundImage='url('+BACKDROPS[mood]+')';

  const weak=(navigator.hardwareConcurrency||4)<=2 || (navigator.deviceMemory||4)<=2;
  const k=doorSpeed();
  const DR=(weak?1.7:2.6)*k, CAM=(weak?1.15:1.9)*k, LOAD=680*k, CAMD=(weak?.6:.9)*k;

  DOOR_TIMERS.forEach(clearTimeout); DOOR_TIMERS=[];
  d.className='door'+(weak?' lite':'');            // 复位
  d.style.setProperty('--dr',DR+'s');
  d.style.setProperty('--cam',CAM+'s');
  d.style.setProperty('--camd',CAMD+'s');
  void d.offsetWidth;

  const T=(fn,ms)=>DOOR_TIMERS.push(setTimeout(fn,ms));

  // ① 门先合着出现，中缝光渐亮、门板极轻微向内「吸一口气」
  d.classList.add('show','load');
  // ② 蓄力结束 → 双扉慢慢向外推开，门外的光与雾涌进来，镜头随后穿过门框
  T(()=>{ d.classList.remove('load'); d.classList.add('open'); }, LOAD);
  // ③ 门完全推开、镜头到位后落幕
  const END=LOAD+Math.max(DR*1000, CAMD*1000+CAM*1000)+180;
  T(()=>d.classList.add('fade'), END);
  T(()=>{ d.className='door'; }, END+620);

  d.onclick=skipDoor;
}
function skipDoor(){
  const d=document.getElementById('door');
  DOOR_TIMERS.forEach(clearTimeout); DOOR_TIMERS=[];
  d.classList.add('fade');
  DOOR_TIMERS.push(setTimeout(()=>{ d.className='door'; },420));
}

/* ===================== 导航（菜单 + 隐秘站长） ===================== */
const navMap={gallery:renderGallery,sanctuary:()=>renderSanctuary(profile.stack||true),webmaster:renderWebmaster,settings:renderSettings};
function go(view){
  closeMenu(); hideStackRail();
  /* BGM 全站常驻；分类环境音只在画廊/播放器里跟随可视分类 */
  if(view!=='gallery'){ CUR_VIEW=view; soundAmbStop(); if(SOUND_ON) soundStartBgm(); }
  else { G_FILTER='all'; CUR_VIEW='gallery'; }
  (navMap[view]||renderGallery)();
  screen.scrollTop=0;
  initSoundBtn();                       // 全站唯一的声音开关，任何视图都在
}
function openMenu(){ const m=document.getElementById('menu'); m.classList.add('show'); }
function closeMenu(){ document.getElementById('menu').classList.remove('show'); }
document.querySelectorAll('#menu .mi').forEach(it=>it.addEventListener('click',()=>go(it.dataset.go)));
document.getElementById('menu').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeMenu(); });

/* 标题：轻触=菜单；长按约 0.7s=站长隐秘入口（无任何标识/提示，普通用户绝不会触发） */
const brandEl=document.querySelector('.brand');
let _lpTimer=null, _lpFired=false;
brandEl.addEventListener('pointerdown',()=>{ _lpFired=false; _lpTimer=setTimeout(()=>{ _lpFired=true; openWmSecret(); },700); });
['pointerup','pointerleave','pointercancel'].forEach(ev=>brandEl.addEventListener(ev,()=>clearTimeout(_lpTimer)));
brandEl.addEventListener('contextmenu',e=>e.preventDefault());
brandEl.addEventListener('click',()=>{ if(_lpFired){ _lpFired=false; return; } openMenu(); });
function openWmSecret(){ const s=document.getElementById('wm-secret'); s.classList.add('show'); setTimeout(()=>document.getElementById('wm-pass').focus(),60); }
function wmSubmit(e){ e.preventDefault(); const inp=document.getElementById('wm-pass'); const v=inp.value.trim();
  if(v===WALL_PASS.admin){
    OWNER={ level:2, role:'admin' };                 // 注入站长会话（后续可扩展多等级权限）
    document.getElementById('wm-secret').classList.remove('show'); inp.value='';
    document.body.classList.add('wm-on');
    renderWebmaster(); screen.scrollTop=0;
    const veil=document.getElementById('wm-veil');    // 口令对了——门户缓缓浮现
    veil.classList.add('in'); setTimeout(()=>veil.classList.remove('in'),1750);
  } else {
    inp.value=''; inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); // 仅站长本人可见的轻颤
  }
  return false;
}
function exitWm(){ OWNER=null; document.body.classList.remove('wm-on'); renderGallery(); }

/* 站长模式 · 云端与屏蔽工具 */
async function wmProbeCloud(){
  const el=document.getElementById('wm-cloud-status'); if(!el) return;
  el.textContent='检测中…';
  try{
    const r=await (window.probeCloudWrite||function(){return{ok:false,msg:'未加载 board-sync'}})();
    el.textContent=(r.ok?'✓ ':'✗ ')+r.msg+(r.ok?'':' · 只读令牌会导致新帖/删除无法真正同步到 GitHub，需更换带 Discussion 写权限的 PAT');
  }catch(e){ el.textContent='检测出错：'+e.message; }
}
function wmCopyUmamiId(){
  const id='debce0ab-aea3-454a-bbca-e7d1df38ea26';
  navigator.clipboard.writeText(id).then(()=>toast('Website ID 已复制')).catch(()=>{ prompt('复制 Website ID：',id); });
}
function wmCopyHidden(){
  const h=window.exportHidden?window.exportHidden():{builtin:[],local:[]};
  const txt=JSON.stringify(h.local.concat(h.builtin),null,2);
  navigator.clipboard.writeText(txt).then(()=>toast('屏蔽名单已复制')).catch(()=>{ prompt('复制以下内容，发给我以写入全局屏蔽：',txt); });
}
function wmPasteHidden(){
  const raw=prompt('粘贴要导入的屏蔽 ID 列表（JSON 数组，每个 ID 以 D_ 开头）：','[]'); if(!raw) return;
  try{
    const arr=JSON.parse(raw);
    if(Array.isArray(arr) && arr.length && window.importHidden){ window.importHidden(arr); toast('已导入 '+arr.length+' 条屏蔽'); }
    else { toast('格式无效'); }
  }catch(e){ toast('JSON 解析失败'); }
}

/* 心境切换（同时写入个人资料 · 心情色，并切换背景图） */
const MOODS=['mist','ember','night'];
const COLOR_BY_MOOD={mist:'#9FE3BE',ember:'#FFB877',night:'#A9BCFF'};
let mi=0;
function setMood(m){ document.documentElement.setAttribute('data-mood',m); uTrack('mood_checkin',{mood:m});
  if(profile) profile.color=COLOR_BY_MOOD[m]||'#9FE3BE';
  try{ localStorage.setItem(PROFILE_KEY,JSON.stringify(profile)); }catch(e){}
  setBackdrop(m);
  toast('心境 · '+({mist:'雾',ember:'烬',night:'夜'}[m])); }
document.getElementById('moodbtn').addEventListener('click',()=>{ mi=(mi+1)%3; setMood(MOODS[mi]); });

/* ===================== 个人资料 & 本地数据 ===================== */
const PROFILE_KEY='qn_user', DATA_KEY='quiet-nature-data', FEED_KEY='quiet-nature-feedback';
const PUSHPLUS_TOKENS=[
  "6734d2d8f36941bab373fdea740f14e0", // 主通知（取自桌面「遥控」配置）
  "" // ← 填入额外接收人（如闺蜜）的 PushPlus token，即可同步送达
].filter(Boolean); // 站点通知推送（PushPlus）
const MOOD_BY_COLOR={'#9FE3BE':'mist','#FFB877':'ember','#A9BCFF':'night'};
const STACK_TITLE={nature:'自然栈',reader:'读者栈',void:'留白栈',fold:'折叠栈',module:'模块栈'};
const BACKDROPS={mist:'assets/bg-mist.jpg',ember:'assets/bg-ember.jpg',night:'assets/bg-night.jpg'};

function loadProfile(){ try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');}catch(e){return null;} }
function saveProfile(){ try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));}catch(e){} }
function moodLabel(c){ return ({'#9FE3BE':'雾绿','#FFB877':'暖沙','#A9BCFF':'夜蓝'}[c])||'雾绿'; }
function avatarInner(src){ if(src) return '<img src="'+src+'" alt="">'; return '<span>'+(profile.name?profile.name[0]:'访')+'</span>'; }
function getAvatar(){ return profile.avatar||''; }   // 供共读站 / 共笔墙 / 留言等模块复用

/* —— 公共头像库（沿用原站 12 款自然生灵 SVG，供共笔墙 / 留言等选用）—— */
const AVATARS=["fox","cat","owl","sprout","wave","leaf","flame","moon","planet","bird","bee","fall","snow","star","flower","deer","cloud","stone"];
const AV_SVG={
  fox:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4l-3 6 3 2"/><path d="M17 4l3 6-3 2"/><path d="M12 6c-4 0-7 4-7 9 0 4 3 7 7 7s7-3 7-7c0-5-3-9-7-9z"/><path d="M9 14c.3.2.7.2 1 0"/><path d="M14 14c.3.2.7.2 1 0"/></svg>`,
  cat:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5l-2 4h2l1-2 2 2h2l1-2 2 2h2l-2-4"/><circle cx="12" cy="14" r="7"/><path d="M9 14c.3.2.7.2 1 0"/><path d="M14 14c.3.2.7.2 1 0"/></svg>`,
  owl:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6c0-2 2-3 4-2l3 3 3-3c2-1 4 0 4 2v8c0 4-3 7-7 7S5 18 5 14V6z"/><circle cx="9" cy="11" r="1.5" fill="currentColor"/><circle cx="15" cy="11" r="1.5" fill="currentColor"/><path d="M12 14v3"/></svg>`,
  sprout:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-8"/><path d="M12 14c-3-3-7-2-7 2 0 3 3 4 7 2"/><path d="M12 14c3-3 7-2 7 2 0 3-3 4-7 2"/><path d="M12 10V7"/><circle cx="12" cy="5" r="2"/></svg>`,
  wave:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0"/><path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0"/></svg>`,
  leaf:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-5 0-9-4-9-9 0-5 9-10 9-10s9 5 9 10c0 5-4 9-9 9z"/><path d="M12 21V3"/></svg>`,
  flame:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-4 0-7-3-7-7 0-3 2-6 4-8 1 2 3 3 3 3s2-3 2-6c3 2 5 6 5 9 0 4-3 9-7 9z"/></svg>`,
  moon:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12c0 5-4 9-9 9-2 0-4-.7-5.5-2 3.5.3 7-2.5 7-7 0-4.5-3.5-7.3-7-7C7.3 3.7 9.4 3 12 3c5 0 9 4 9 9z"/></svg>`,
  planet:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-20 12 12)"/></svg>`,
  bird:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c3-3 7-4 10-2 3-2 7-1 10 2-3 1-7 1-10 3-3-2-7-2-10-3z"/><path d="M12 10V6"/></svg>`,
  bee:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="13" rx="6" ry="5"/><path d="M9 8V6"/><path d="M15 8V6"/><path d="M7 13h10"/><path d="M7 16h10"/><path d="M12 8v10"/></svg>`,
  fall:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21l-4-4 2-2-4-4 3-3-3-3 7 2 7-2-3 3 3 3-4 4 2 2-4 4z"/><path d="M12 21V11"/></svg>`,
  snow:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M3 7l18 10M21 7L3 17"/></svg>`,
  star:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.4 6.4L21 10l-5.4 4 1.8 6.6L12 17.5 7.6 20.6 9.4 14 4 10l6.6-.6z"/></svg>`,
  flower:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.6"/><path d="M12 9c0-3 1-5 3-5 1 2 0 5-3 5zM12 9c0-3-1-5-3-5-1 2 0 5 3 5zM12 15c0 3-1 5-3 5-1-2 0-5 3-5zM12 15c0 3 1 5 3 5 1-2 0-5-3-5z"/></svg>`,
  deer:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4l1 4-2 2M15 4l-1 4 2 2"/><circle cx="12" cy="15" r="5"/><path d="M10 12l2 1 2-1"/></svg>`,
  cloud:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4 4 0 010-8 5 5 0 019-1.5A4 4 0 0116 18z"/></svg>`,
  sys_moon:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mg" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#fffbe8"/><stop offset="60%" stop-color="#e6e0c0"/><stop offset="100%" stop-color="#b8b292"/></radialGradient><filter id="mh"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="32" cy="32" r="28" fill="url(#mg)" opacity=".95"/><ellipse cx="22" cy="24" rx="6" ry="5" fill="#c9c29e" opacity=".55"/><ellipse cx="40" cy="38" rx="8" ry="7" fill="#c9c29e" opacity=".5"/><ellipse cx="34" cy="18" rx="4" ry="3" fill="#c9c29e" opacity=".45"/><circle cx="32" cy="32" r="30" fill="none" stroke="#fffbe8" stroke-width="1" opacity=".35" filter="url(#mh)"/></svg>`,
  sys_wave:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6fa8ff"/><stop offset="50%" stop-color="#2b6fd1"/><stop offset="100%" stop-color="#0f3a7a"/></linearGradient><radialGradient id="wg2" cx="50%" cy="80%" r="60%"><stop offset="0%" stop-color="#ffffff" stop-opacity=".35"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs><rect x="0" y="0" width="64" height="64" fill="#0a1c33"/><path d="M-4 38c6-4 12-4 18 0s12 4 18 0 12-4 18 0 12 4 18 0" fill="none" stroke="#8fc4ff" stroke-width="2.5" opacity=".9"/><path d="M-4 46c6-4 12-4 18 0s12 4 18 0 12-4 18 0 12 4 18 0" fill="none" stroke="#6fa8ff" stroke-width="2" opacity=".75"/><path d="M-4 54c6-4 12-4 18 0s12 4 18 0 12-4 18 0 12 4 18 0" fill="none" stroke="#4b8ce0" stroke-width="1.8" opacity=".6"/><circle cx="32" cy="46" r="4" fill="#fff" opacity=".5"/><ellipse cx="32" cy="52" rx="3" ry="1" fill="#fff" opacity=".25"/></svg>`,
  stone:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14c0-3 3-6 7-6s7 3 7 6-3 4-7 4-7-1-7-4z"/></svg>`
};
function avHtml(av){
  if(av && (av.indexOf('data:')===0 || av.indexOf('http')===0)) return '<span class="avsvg av-img"><img src="'+av+'" alt=""></span>';
  let key=av;
  if(!key || !AV_SVG[key]){
    const seed=(profile.name||'访'); let h=0; for(let i=0;i<seed.length;i++) h=(h*31+seed.charCodeAt(i))>>>0;
    key=AVATARS[h%AVATARS.length];
  }
  return '<span class="avsvg">'+AV_SVG[key]+'</span>';
}
/* 把用户上传的图片压缩成 dataURL，供头像 / 共笔墙使用 */
function imgToDataURL(file,max,cb){
  try{
    const fr=new FileReader();
    fr.onload=()=>{ const img=new Image();
      img.onload=()=>{ const s=Math.min(1,max/Math.max(img.width,img.height)); const cw=Math.round(img.width*s),ch=Math.round(img.height*s);
        const cv=document.createElement('canvas'); cv.width=cw; cv.height=ch; cv.getContext('2d').drawImage(img,0,0,cw,ch); cb(cv.toDataURL('image/jpeg',0.85)); };
      img.onerror=()=>cb(null); img.src=fr.result; };
    fr.onerror=()=>cb(null); fr.readAsDataURL(file);
  }catch(e){ cb(null); }
}

let profile = loadProfile() || {name:'来访者',color:'#9FE3BE',stack:'nature',passcode:'',avatar:'',joined:Date.now()};
if(!profile.avatar){ let h=0; const s=profile.name||'访'; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; profile.avatar=AVATARS[h%AVATARS.length]; }

/* 本地数据仓库（沿用原站 quiet-nature-data 结构，纯本机，不联网不公开） */
const Store={
  data:null,
  load(){ try{this.data=JSON.parse(localStorage.getItem(DATA_KEY)||'null');}catch(e){this.data=null;}
    if(!this.data||typeof this.data!=='object') this.data={};
    ['moods','journal','notes','capsules','favorites','created','readerNotes'].forEach(k=>{ if(!this.data[k]) this.data[k]=[]; });
    if(!this.data.settings) this.data.settings={};
    return this.data; },
  save(){ try{localStorage.setItem(DATA_KEY,JSON.stringify(this.data));}catch(e){} },
  count(){ const d=this.data||{}; let n=0;
    n+=(d.moods&&Object.keys(d.moods).length)||0;
    n+=(d.journal&&d.journal.length)||0;
    n+=(d.notes&&d.notes.length)||0;
    n+=(d.capsules&&d.capsules.length)||0;
    n+=(d.favorites&&d.favorites.length)||0;
    n+=(d.created&&d.created.length)||0; return n; }
};
function loadFeedback(){ try{return JSON.parse(localStorage.getItem(FEED_KEY)||'[]');}catch(e){return [];} }

function setBackdrop(m){ const b=document.getElementById('backdrop');
  if(b&&BACKDROPS[m]){ b.style.backgroundImage='url('+BACKDROPS[m]+')'; b.style.opacity='1'; } }
function applyMood(){ document.documentElement.setAttribute('data-mood', MOOD_BY_COLOR[profile.color]||'mist'); }
function prefillGate(){
  document.getElementById('ob-name').value = profile.name||'';
  document.querySelectorAll('#ob-cc .dot').forEach(x=>x.classList.toggle('on', x.dataset.c===profile.color));
  document.querySelectorAll('#ob-st .chip').forEach(x=>x.classList.toggle('on', x.dataset.s===profile.stack));
  document.getElementById('ob-pass').value='';
  document.getElementById('ob-avatar-prev').innerHTML = avatarInner(profile.avatar);
  document.getElementById('ob-avatar-clear').style.display = profile.avatar ? 'inline-block' : 'none';
  gateData.avatar = profile.avatar || '';
  document.getElementById('gate-note').textContent = profile.passcode ? '已设个人锁：修改资料需先输入锁码' : '这是框架预览版：资料与数据仅存本机（localStorage），不上传任何服务器。';
}

/* 进站 gate */
const gate=document.getElementById('gate');
let gateMode='init';   // init=首次进站；edit=从设置打开（保存/关闭后留在设置，不跳空栈）
let gateData={name:'',color:'#9FE3BE',stack:'nature',avatar:''};
document.querySelectorAll('#ob-cc .dot').forEach(d=>d.addEventListener('click',()=>{
  document.querySelectorAll('#ob-cc .dot').forEach(x=>x.classList.remove('on'));
  d.classList.add('on'); gateData.color=d.dataset.c;
}));
document.querySelectorAll('#ob-st .chip').forEach(c=>c.addEventListener('click',()=>{
  document.querySelectorAll('#ob-st .chip').forEach(x=>x.classList.remove('on'));
  c.classList.add('on'); gateData.stack=c.dataset.s;
}));
document.getElementById('ob-name').addEventListener('input',e=>gateData.name=e.target.value);
document.getElementById('ob-avatar').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader(); r.onload=()=>{ gateData.avatar=r.result;
    document.getElementById('ob-avatar-prev').innerHTML='<img src="'+r.result+'" alt="">';
    document.getElementById('ob-avatar-clear').style.display='inline-block'; };
  r.readAsDataURL(f);
});
function clearAvatar(e){ e.stopPropagation(); gateData.avatar='';
  document.getElementById('ob-avatar-prev').innerHTML=avatarInner('');
  document.getElementById('ob-avatar-clear').style.display='none'; }

function enter(){
  const nm=(document.getElementById('ob-name').value||'').trim();
  const pass=document.getElementById('ob-pass').value;
  if(profile.passcode && pass!==profile.passcode){ toast('个人锁不匹配'); return; }
  profile={ name:nm||'来访者', color:gateData.color, stack:gateData.stack,
            passcode:(pass||profile.passcode||''), avatar:(gateData.avatar||profile.avatar||''),
            joined:profile.joined||Date.now() };
  saveProfile(); applyMood(); setBackdrop(MOOD_BY_COLOR[profile.color]||'mist');
  gate.classList.add('hide');
  if(gateMode==='edit'){ renderSettings(); }
  gateMode='init';
  toast(nm?('已保存，'+nm):'已保存');
}
document.getElementById('ob-go').addEventListener('click',enter);
document.getElementById('ob-skip').addEventListener('click',()=>{ gate.classList.add('hide'); if(gateMode==='edit') renderSettings(); gateMode='init'; });

/* 个人锁：保护数据管理 / 资料修改（同一会话内解锁一次即可） */
let sessionUnlocked=false;
function requireUnlock(cb){
  if(!profile.passcode || sessionUnlocked){ cb(); return; }
  const p=prompt('输入个人锁以继续');
  if(p===null) return;
  if(p===profile.passcode){ sessionUnlocked=true; cb(); }
  else toast('个人锁不匹配');
}

/* 进站页：默认隐藏，可在「设置→个人资料」打开 */
function openGate(){ gateMode='edit'; prefillGate(); gate.classList.remove('hide'); }

/* 关闭进站页：从「设置→个人资料」打开时，关闭即回到设置（与数据管理「返回」一致） */
function closeGate(){ gate.classList.add('hide'); if(gateMode==='edit'){ renderSettings(); } gateMode='init'; }

/* ===================== 数据管理 ===================== */
function renderDataManage(){
  const c=Store.count(), fb=loadFeedback().length;
  screen.innerHTML=`
    <div class="center" style="margin:16px 0 6px"><div class="h2 serif">数据管理</div>
      <div class="muted" style="font-size:12px">本机数据 · 导出 / 导入 / 清空</div></div>
    <div class="card" style="margin-top:14px">
      <div class="stat-row"><span>已存内容</span><b>${c} 条</b></div>
      <div class="stat-row"><span>反馈留言</span><b>${fb} 条</b></div>
      <div class="sub">所有数据都在你这台设备/浏览器里（localStorage），不上传服务器、不联网。换设备需用「导出」带走。</div>
      <div class="dm-row">
        <button class="btn" onclick="exportData()">导出备份</button>
        <button class="btn ghost" onclick="importData()">导入</button>
      </div>
      <div class="dm-row">
        <button class="btn ghost" style="color:#FF9C9C;border-color:rgba(255,156,156,.4)" onclick="clearData()">清空全部内容</button>
        <button class="btn ghost" onclick="renderSettings()">返回</button>
      </div>
    </div>`;
  screen.scrollTop=0;
}
function exportData(){
  const blob=new Blob([JSON.stringify({profile,data:Store.data,feedback:loadFeedback(),exported:Date.now()},null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='quiet-nature-backup-'+new Date().toISOString().slice(0,10)+'.json'; a.click();
  URL.revokeObjectURL(a.href); toast('已导出备份');
}
function importData(){
  const inp=document.createElement('input'); inp.type='file'; inp.accept='application/json,.json';
  inp.onchange=()=>{ const f=inp.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>{ try{
      const o=JSON.parse(r.result);
      if(o.data){ Store.data=o.data; Store.save(); }
      if(o.profile){ profile=o.profile; saveProfile(); applyMood(); setBackdrop(MOOD_BY_COLOR[profile.color]||'mist'); }
      if(o.feedback){ localStorage.setItem(FEED_KEY,JSON.stringify(o.feedback)); }
      toast('已导入'); renderDataManage();
    }catch(e){ toast('文件无法解析'); } };
    r.readAsText(f); };
  inp.click();
}
function clearData(){
  if(confirm('确定清空本机全部内容（个人资料保留）？此操作不可恢复。')){
    try{ localStorage.removeItem(DATA_KEY); localStorage.removeItem(FEED_KEY); }catch(e){}
    Store.load(); toast('已清空内容'); renderDataManage();
  }
}

/* ===================== 公共留言板（站长权限 / 人工审核） ===================== */
function esc(s){return (s==null?'':String(s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function uid(){let id=localStorage.getItem('qn_uid');if(!id){id='u'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('qn_uid',id);}catch(e){}}return id;}
function me(){return {id:uid(),name:profile.name||'匿名来访者',avatar:profile.avatar||''};}
function loadPosts(b){try{return JSON.parse(localStorage.getItem('qn_posts_'+b)||'[]');}catch(e){return [];}}
function savePosts(b,a){try{localStorage.setItem('qn_posts_'+b,JSON.stringify(a.slice(-500)));}catch(e){}}
function canModerate(){return OWNER!==null;}
function canDeletePost(p){return canModerate()||p.authorId===uid();}

const BOARDS={
  reader:{board:'reader-lib',title:'每日一读 · 共读库',sub:'分享一句打动你的话，或一段读书批注',ph:'写一句金句，或你的读书批注…',btn:'分享',order:'new'},
  relay:{board:'relay',title:'共读接力',sub:'大家接力，续写同一段故事',ph:'接着上一句，续写你的那一段…',btn:'续写',order:'old'},
  wall:{board:'wall',title:'共笔墙',sub:'把此刻想说的，写在这里',ph:'写点什么吧…',btn:'贴上墙',order:'new'},
  bottle:{board:'bottle',title:'漂流瓶',sub:'写一句扔出去，被轻轻捡起',ph:'写一句想对陌生人说的话…',btn:'扔出',order:'new'},
  glownote:{board:'glownote',title:'微光留言',sub:'给此刻也在的人留句温柔',ph:'留一句温柔的话…',btn:'点亮',order:'new'},
  watchsea:{board:'watchsea',title:'同看一片海',sub:'和此刻也在的人，同看一段海',ph:'说一句你正看着的海…',btn:'同看',order:'new'},
  syncbreath:{board:'syncbreath',title:'同步呼吸',sub:'把此刻的呼吸，轻轻交出去',ph:'此刻你在哪里，呼吸着什么…',btn:'同步',order:'new'}
};

/* ===================== 公共留言板引擎（共享客服） =====================
   7 个公共板块共用同一套底层：发帖 / 删己帖 / 站长删全员 / 举报(人工审核)。
   每个板块有自己独立的渲染与动画，互不相同（见下方 BOARD_RENDER）。 */
function postActions(k,p){
  const mine=p.authorId===uid(); const del=canDeletePost(p); const mod=canModerate();
  let a='';
  if(del) a+=`<button class="link" data-act="del" data-k="${k}" data-id="${p.id}">${mod&&!mine?'删除(管理)':'删除'}</button>`;
  if(!mod && !mine) a+=`<button class="link warn" data-act="rep" data-k="${k}" data-id="${p.id}">举报</button>`;
  return a;
}
function bindPostActions(anchor){
  if(!anchor) return;
  anchor.addEventListener('click', e=>{
    const b=e.target.closest('[data-act]'); if(!b) return;
    const {act,k,id}=b.dataset;
    if(act==='del') deletePost(k,id);
    else if(act==='rep') openReport(k,id);
  });
}
function boardHeader(cfg,mod){
  return `<div class="bhead">
    <button class="bback" onclick="returnToSanctuary()">← 栖处</button>
    <div class="bht"><div class="bh2">${cfg.title}</div><div class="bsub">${cfg.sub}</div></div>
    ${mod?'<span class="tag btag">管理端</span>':''}
  </div>`;
}
/* 站长管理端：列出全部内容，可删违规（各板块共用） */
function renderModList(k){
  const all=loadPosts(BOARDS[k].board);
  let html=`<div class="bmod"><div class="bmod-t">管理端 · 共 ${all.length} 条 · 可删违规</div><div class="bmod-list">`;
  if(!all.length) html+='<div class="muted" style="font-size:12px">暂无内容</div>';
  all.slice().reverse().forEach(p=>{
    const act = canDeletePost(p) ? `<button class="link" data-act="del" data-k="${k}" data-id="${p.id}">删除</button>` : '—';
    html+=`<div class="bmod-item"><span class="bmod-text">${esc(p.text)}${p.reportReason?` <span style="color:#FFB877;font-size:11px">· 举报:${esc(p.reportReason)}</span>`:''}</span><span>${act}</span></div>`;
  });
  html+='</div></div>';
  const wrap=document.createElement('div'); wrap.innerHTML=html;
  screen.appendChild(wrap); bindPostActions(wrap);
}

/* —— 在场感：跨标签页真实共在（BroadcastChannel），退化到本机 ——
   原站用 GitHub Discussions 房间计数；这里在无后端时改用同浏览器多标签页心跳，
   打开两个标签页即算「两个人同在」，作为共在感的真实底座。接入远端后替换为真实人数。 */
const _presChan = ('BroadcastChannel' in window)?new BroadcastChannel('cn_presence'):null;
const _peers={};
if(_presChan){ _presChan.onmessage=(e)=>{ const m=e.data; if(!m||!m.b) return; (_peers[m.b]=_peers[m.b]||{})[m.u]=Date.now(); }; }
function presenceBeat(b){ try{ const u=uid(); if(_presChan) _presChan.postMessage({b,u,t:Date.now()}); (_peers[b]=_peers[b]||{})[u]=Date.now();
  for(const k in _peers){ for(const u2 in _peers[k]){ if(Date.now()-_peers[k][u2]>15000) delete _peers[k][u2]; } } }catch(e){} }
function presenceCount(b){ const s=_peers[b]||{}; return Math.max(1,Object.keys(s).length); }
/* 诚实的在场感措辞：n=1 时不伪装成「有别人」，明确是「只有你」 */
function presenceLabel(b, verb){
  const n = presenceCount(b);
  if(n<=1) return `此刻只有你${verb}`;
  return `此刻 ${n} 人也在${verb}（含你）`;
}

/* 统一的帖子卡片（头像 / 署名 / 时间 / 操作），各公共板块共用 */
function postCard(k,p,opts){
  opts=opts||{};
  const av=avHtml(p.avatar);
  const act=postActions(k,p);
  const name=esc(p.author||'过客');
  const time=p.at?('<span class="pc-time">'+esc(p.at)+'</span>'):'';
  const extra=opts.extra||'';
  const inner=(act?act+' ':'')+extra;
  return `<div class="pcard${opts.cls?' '+opts.cls:''}">
    <div class="pc-av">${av}</div>
    <div class="pc-body"><div class="pc-top"><span class="pc-name">${name}</span>${time}</div>
    <div class="pc-text">${esc(p.text)}</div>${inner?'<div class="pc-act">'+inner+'</div>':''}</div>
  </div>`;
}

/* 全网共笔墙（本机存储；REMOTE_SYNC 为可配置远端槽位，默认关闭 → 本地） */
function loadPub(){ try{ return JSON.parse(localStorage.getItem('qn_pubwall')||'[]'); }catch(e){ return []; } }
function savePub(a){ try{ localStorage.setItem('qn_pubwall', JSON.stringify(a.slice(-500))); }catch(e){} }

/* 漂浮光点（共读接力 / 微光留言的 hero 动画，无外部依赖，脱离即停） */
function boardParticles(canvas, opts){
  if(!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const color=opts.color||'190,230,210';
  let alive=true, t0=performance.now();
  const dots=Array.from({length:24},()=>({x:Math.random(),y:Math.random(),r:0.6+Math.random()*1.8,s:0.15+Math.random()*0.4,o:0.15+Math.random()*0.35}));
  function frame(now){
    if(!alive) return; if(!canvas.isConnected){ alive=false; return; }
    const w=canvas.clientWidth||320, h=canvas.clientHeight||150, dpr=Math.min(window.devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*dpr)){ canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); }
    const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    const t=(now-t0)/1000; ctx.globalCompositeOperation='lighter';
    dots.forEach(d=>{ const yy=((d.y - t*d.s*0.05)%1+1)%1; const x=d.x+Math.sin(t*0.3+d.r)*0.02; const px=x*w, py=yy*h, rr=d.r*2.2;
      const g=ctx.createRadialGradient(px,py,0,px,py,rr*3); g.addColorStop(0,`rgba(${color},${d.o})`); g.addColorStop(1,`rgba(${color},0)`);
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(px,py,rr*3,0,6.29); ctx.fill(); });
    ctx.globalCompositeOperation='source-over';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
/* 海面波纹（漂流瓶 hero） */
function boardSea(canvas){
  if(!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let alive=true, t0=performance.now();
  function frame(now){
    if(!alive) return; if(!canvas.isConnected){ alive=false; return; }
    const w=canvas.clientWidth||320, h=canvas.clientHeight||150, dpr=Math.min(window.devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*dpr)){ canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); }
    const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    const t=(now-t0)/1000;
    for(let l=0;l<3;l++){
      ctx.beginPath(); ctx.moveTo(0,h);
      for(let x=0;x<=w;x+=6){ const y=h*0.55 + Math.sin(x*0.02 + t*(0.6+l*0.25) + l*1.3)*7 + l*12; ctx.lineTo(x,y); }
      ctx.lineTo(w,h); ctx.closePath();
      ctx.fillStyle=`rgba(${150-l*20},${210-l*25},${200-l*20},${0.20+l*0.10})`; ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
/* 呼吸圆（同步呼吸 hero） */
function breathAnim(circle){
  if(!circle) return;
  const cv=circle.querySelector('canvas'); if(!cv) return;
  let alive=true, t0=performance.now();
  function frame(now){
    if(!alive) return; if(!cv.isConnected){ alive=false; return; }
    const w=cv.clientWidth||200, h=cv.clientHeight||200, dpr=Math.min(window.devicePixelRatio||1,2);
    if(cv.width!==Math.round(w*dpr)){ cv.width=Math.round(w*dpr); cv.height=Math.round(h*dpr); }
    const ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    const t=(now-t0)/1000, s=0.5+0.5*Math.sin(t*0.5);
    const cx=w/2, cy=h/2, rr=Math.min(w,h)*0.16 + Math.min(w,h)*0.22*s;
    const g=ctx.createRadialGradient(cx,cy,4,cx,cy,rr*1.5); g.addColorStop(0,`rgba(150,220,200,${0.30+0.25*s})`); g.addColorStop(1,'rgba(150,220,200,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,rr*1.5,0,6.29); ctx.fill();
    ctx.strokeStyle='rgba(190,240,220,.85)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,rr,0,6.29); ctx.stroke();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  const phases=[['吸气',4000],['屏息',4000],['呼气',6000]]; let pi=0;
  const pe=document.getElementById('sb-phase');
  (function step(){ if(!pe||!pe.isConnected) return; pe.textContent=phases[pi][0]+' · 跟着圆，慢慢呼吸';
    const d=phases[pi][1]; pi=(pi+1)%phases.length; setTimeout(step,d); })();
}

/* —— 各板块内容库 / 种子 —— */
/* 读者库数据已移至外部 reader-lib.js（window.READER_LIB / READER_THEMES / READER_SUBS，共 737 条《读者》言论） */
const BOTTLE_SEED=["愿你被这个世界温柔以待。","今天也辛苦了，喝口水歇会儿。","海的那边，也有人想着你。","把烦恼折进瓶子，让它漂走吧。","慢一点，海一直都在。","你不是一个人。"];
const GLOW_SEED=["愿你今晚睡得安稳。","有人也在，别怕。","把心事交给海风吧。","你今天也很努力了。","慢一点，也没关系。"];
const WALL_SEED=[
  {text:'今夜月色很好，适合把心事轻轻写下。', author:'月', avatar:'sys_moon'},
  {text:'浪不会一直停，但它总会再来。', author:'浪', avatar:'sys_wave'},
  {text:'我在这里，听你说。', author:'月', avatar:'sys_moon'},
  {text:'风把潮声推远，也把思绪推平。', author:'浪', avatar:'sys_wave'}
];
/* 种子数据：首次访问「只播种一次」到本机 localStorage；之后完全以 localStorage 为准。
   站长（管理端）删除即永久消失，不会再像以前那样「删了又复活」。 */
function seedBoardOnce(board, texts, author, avatar){
  const key='qn_seeded_'+board;
  try{ if(localStorage.getItem(key)) return; }catch(e){ return; }
  const arr=loadPosts(board); const now=new Date().toLocaleString('zh-CN');
  texts.forEach(function(t,i){
    const item=(typeof t==='object')?t:{text:t};
    arr.unshift({id:'seed_'+board+'_'+i, text:item.text, author:item.author||author||'', authorId:'seed', avatar:item.avatar||avatar||'', at:now, reported:false, seed:true});
  });
  savePosts(board, arr);
  try{ localStorage.setItem(key,'1'); }catch(e){}
}
seedBoardOnce('bottle', BOTTLE_SEED);
seedBoardOnce('glownote', GLOW_SEED);
seedBoardOnce('wall', WALL_SEED);
const BOTTLE_SVG=`<svg viewBox="0 0 44 64" xmlns="http://www.w3.org/2000/svg"><rect x="17" y="2" width="10" height="10" rx="2" fill="#caa86a"/><rect x="14" y="11" width="16" height="6" rx="2" fill="#caa86a"/><path d="M14 17 q-3 4 -3 12 v22 a6 6 0 0 0 6 6 h10 a6 6 0 0 0 6 -6 V29 q0 -8 -3 -12 Z" fill="rgba(159,227,190,.45)" stroke="rgba(159,227,190,.9)" stroke-width="1.4"/><rect x="15" y="34" width="14" height="16" rx="2" fill="rgba(255,255,255,.22)"/></svg>`;
/* 同步呼吸 · 治愈短句（每句带一句「感受 / 解释」，以你的感受为主） */
const BREATH_PHRASES=[
  {t:'吸气，把世界轻轻吸进来。', f:'允许自己此刻只做这一件事：呼吸。'},
  {t:'屏住，让心安静半拍。', f:'不需要赶走杂念，只是看着它们，像看云飘过。'},
  {t:'呼气，把紧绷交还给夜色。', f:'肩膀、眉头、牙关，都可以松一松了。'},
  {t:'你已经在安全的地方。', f:'此刻没有必须做的事，也没有必须成为的人。'},
  {t:'慢一点，海一直都在。', f:'慌张多半是假象，节奏由你定。'},
  {t:'今天也辛苦了。', f:'不必等别人说，先对自己说一句。'},
  {t:'把心事交给海风吧。', f:'有些话，说出来就轻了；说不出口，吹走也行。'},
  {t:'你今天也很努力了。', f:'努力不一定要被看见，它已经发生了。'},
  {t:'有人也在，别怕。', f:'这世上总有人和你同一时刻，安静地活着。'},
  {t:'愿你今晚睡得安稳。', f:'把今天轻轻合上，明天的事留给明天。'},
  {t:'允许自己什么都不做。', f:'休息不是奖励，是活着的一部分。'},
  {t:'深呼吸，再深一点。', f:'氧气到不了的地方，先让它到肩膀。'},
  {t:'你不是一块需要一直发电的电池。', f:'会累，会空，才是真的你。'},
  {t:'把期待放低一点，把温柔抬高一点。', f:'对自己宽容，比对外人宽容更难，也更值得。'},
  {t:'这一口气，只属于此刻的你。', f:'过去和未来都够不着，只有现在在呼吸。'},
  {t:'难过也可以慢慢来。', f:'情绪没有截止日期，不用赶着好起来。'},
  {t:'先照顾好自己，其余的再说。', f:'你稳了，周围才会跟着稳。'},
  {t:'风停在窗台，它说你也可以停一停。', f:'连风都知道歇脚，你当然也可以。'},
  {t:'你不必是一盏灯，做一颗星也好。', f:'微光也是光，不必耀眼才值得被看见。'},
  {t:'把烦恼折进瓶子，让它漂走吧。', f:'有些重量，放手比扛着更勇敢。'},
  {t:'此刻的你，足够好。', f:'不是"将来够好"，是现在，就这样，就够。'},
  {t:'听，世界也在轻轻呼吸。', f:'你不是孤岛，万物同频。'},
  {t:'再给自己三分钟。', f:'三分钟不多，但足够把一口气，喘回来。'},
  {t:'嗯，我在这里，陪着你。', f:'如果没人说，就让这句话替他们说。'}
];

/* —— 每日一读 · 读者库（737 条《读者》言论 + 用户投稿，支持搜索 / 主题 / 细分筛选）—— */
function renderReaderBoard(k){
  const cfg=BOARDS[k]; const mod=canModerate();
  presenceBeat(cfg.board);
  const fav=()=>{ try{return JSON.parse(localStorage.getItem('qn_reader_fav')||'[]');}catch(e){return [];} };
  const posts=loadPosts(cfg.board); const postById={}; posts.forEach(p=>postById[p.id]=p);
  const LIB=(window.READER_LIB||[]).map(q=>({t:q.t,a:q.a,theme:q.theme,sub:q.sub,_lib:true}));
  const THEMES=window.READER_THEMES||['全部'];
  const SUBS=window.READER_SUBS||{};
  let tag='全部', sub='全部', kw='', featured=0;
  function pool(){ return LIB.concat(posts.map(p=>({t:p.text,a:p.author||'我',_id:p.id}))); }
  function filtered(){
    const all=pool(); const k2=kw.trim().toLowerCase();
    return all.filter(it=>{
      if(tag!=='全部' && it.theme!==tag) return false;
      if(sub!=='全部' && it.sub!==sub) return false;
      if(k2){ const s=((it.t||'')+(it.a||'')).toLowerCase(); if(s.indexOf(k2)<0) return false; }
      return true;
    });
  }
  function listHtml(items){
    if(!items.length) return `<div class="muted center" style="font-size:12px;margin:10px 0">没有匹配的句子，换个词或主题试试。</div>`;
    return items.map(it=>{
      let act=''; if(it._id){ const p=postById[it._id]; if(p) act=postActions(k,p); }
      const tags=it._lib&&it.theme?`<span class="qtag">${esc(it.theme)}</span>${it.sub?`<span class="qtag sub">${esc(it.sub)}</span>`:''}`:'';
      return `<div class="qcard"><div class="qctext">${esc(it.t)}</div><div class="qcfoot"><span class="qcauth">—— ${esc(it.a)}</span>${act?'<span class="qcact">'+act+'</span>':''}</div>${tags?`<div class="qctags">${tags}</div>`:''}</div>`;
    }).join('');
  }
  function paintShell(reset){
    const all=pool();
    const f=all.length?all[featured%all.length]:{t:'海还在，句子也会来的。',a:'读者库'};
    const ft=f.t; const faved=fav();
    let html=boardHeader(cfg,mod)+`<div class="presence"><span class="presence-dot"></span>${presenceLabel(cfg.board,'在读')}</div>`;
    html+=`<div class="qfeature"><div class="qftag">今日一读 · ${new Date().getMonth()+1}月${new Date().getDate()}日</div>
      <div class="qftext">${esc(f.t)}</div><div class="qfauth">—— ${esc(f.a)}</div>
      <div class="qfacts"><span class="qstar ${faved.indexOf(ft)>=0?'on':''}">${faved.indexOf(ft)>=0?'★ 已藏':'☆ 藏此句'}</span><span class="qrand" id="q-rand">换一篇</span></div></div>`;
    html+=`<div class="rsearch"><input class="rinp" id="r-search" placeholder="搜索句子或出处…" value="${esc(kw)}"></div>`;
    html+=`<div class="qchips" id="r-themes">${['全部'].concat(THEMES).map(t=>`<div class="qp${t===tag?' sel':''}" data-tag="${t}">${t}</div>`).join('')}</div>`;
    if(tag!=='全部' && SUBS[tag] && SUBS[tag].length){
      html+=`<div class="qchips qsubs" id="r-subs">${['全部'].concat(SUBS[tag]).map(s=>`<div class="qp sub${s===sub?' sel':''}" data-sub="${s}">${s}</div>`).join('')}</div>`;
    }
    html+=`<div class="rstat muted" id="r-stat"></div>`;
    html+=`<div class="bcard" style="margin-top:12px"><div class="bsub" style="margin-bottom:8px">投稿到共读库（任何人可见）</div>
      <textarea class="inp" id="bd-text" placeholder="分享一句打动你的话，或一段读书批注…" maxlength="280"></textarea>
      <div class="dm-row"><button class="btn" onclick="sendPost('${k}')">${cfg.btn}</button></div></div>`;
    html+=`<div id="bd-list" style="margin-top:14px"></div>`;
    screen.innerHTML=html; if(reset) screen.scrollTop=0;
    const se=document.getElementById('r-search'); if(se) se.oninput=()=>{ kw=se.value; paintList(); };
    document.querySelectorAll('#r-themes .qp').forEach(el=>el.onclick=()=>{ tag=el.dataset.tag; sub='全部'; paintShell(true); });
    const subEls=document.querySelectorAll('#r-subs .qp'); if(subEls.length) subEls.forEach(el=>el.onclick=()=>{ sub=el.dataset.sub; paintShell(true); });
    document.getElementById('q-rand').onclick=()=>{ const L=all.length; let r; do{r=Math.floor(Math.random()*L);}while(r===featured&&L>1); featured=r; paintShell(false); };
    const star=document.querySelector('.qstar'); if(star) star.onclick=()=>{ const a=fav(); const i=a.indexOf(ft); if(i>=0)a.splice(i,1); else a.push(ft); localStorage.setItem('qn_reader_fav',JSON.stringify(a)); paintShell(false); toast(i>=0?'已取消收藏':'已藏此句'); };
    paintList();
  }
  function paintList(){
    const items=filtered();
    const list=document.getElementById('bd-list'); if(!list) return;
    list.innerHTML=listHtml(items); bindPostActions(list);
    const stat=document.getElementById('r-stat'); if(stat) stat.textContent=`共 ${items.length} 句${kw.trim()?` · 含「${kw.trim()}」`:''}`;
  }
  /* 关键：注册读者库自己的重绘，避免 board-sync 每 15 秒轮询时用
     loadPosts()（只有用户投稿）覆盖 #bd-list，把 737 条本地库刷没。
     这样云端拉取只触发本函数，本地库 + 筛选状态都保留。 */
  window.BOARD_LIST_PAINT = window.BOARD_LIST_PAINT || {};
  window.BOARD_LIST_PAINT[k] = function(){ paintList(); };
  paintShell(true);
}

/* —— 共读接力 · 光河（每段续写=河面一处光，句子越长光越亮；光河本身顺流而动）—— */
function renderRelayBoard(k){
  const cfg=BOARDS[k]; const mod=canModerate();
  presenceBeat(cfg.board);
  screen.innerHTML=boardHeader(cfg,mod)+
    `<div class="presence"><span class="presence-dot"></span>${presenceLabel(cfg.board,'正在接力')}</div>
     <div class="rhero relay-river" id="rl-river">
       <canvas id="rl-cv"></canvas>
       <div class="relay-hint" id="rl-hint">轻点河面的一处光，读那一段故事 · 句子越长，光越亮</div>
       <div class="relay-reveal" id="rl-reveal"></div>
     </div>
     <div class="rthread" id="rl-story"></div>`;
  const story=document.getElementById('rl-story');
  const all=loadPosts(cfg.board);
  if(!all.length){ story.innerHTML='<div class="muted" style="font-size:12px;opacity:.7">故事还是空白的，做第一个落笔的人吧。</div>'; }
  else { story.innerHTML=all.map(p=>postCard(k,p,{cls:'rseg'})).join(''); story.scrollTop=story.scrollHeight; }
  bindPostActions(story);
  const river=document.getElementById('rl-river');
  if(river && typeof window.RelayRiver==='function'){
    const api=window.RelayRiver(river,{ getPosts:function(){ return loadPosts(cfg.board); } });
    SCENE_STOPS.push(function(){ try{api.destroy();}catch(e){} });
  } else {
    const cv=document.getElementById('rl-cv'); if(cv) SCENE_STOPS.push(NatureCanvas(cv,'motes'));
  }
  if(mod) renderModList(k);
}

/* —— 共笔墙（本地私密 + 全网共笔，沿用原站双栏与头像身份）—— */
function renderWallBoard(k){
  const cfg=BOARDS[k]; const mod=canModerate();
  presenceBeat(cfg.board);
  const meNow=me();
  screen.innerHTML=boardHeader(cfg,mod)+
    `<div class="presence"><span class="presence-dot"></span>${presenceLabel(cfg.board,'在写')}</div>
     <div class="bcard" style="margin-top:12px">
       <div class="wall-as">${avHtml(meNow.avatar)}<span>以「<b>${esc(meNow.name)}</b>」的身份写下，所有人可见 · 头像与名字在「设置」里改</span></div>
       <textarea class="inp" id="bd-text" placeholder="${cfg.ph}" maxlength="280"></textarea>
       <div class="dm-row"><button class="btn" id="wall-post-btn">${cfg.btn}</button>${mod?'<button class="btn ghost" id="wall-post-moon">以「月」发言</button><button class="btn ghost" id="wall-post-wave">以「浪」发言</button>':''}</div>
     </div>
     <div id="bd-list" style="margin-top:14px"></div>`;

  // 渲染帖子（共享板，含赞 + 删除自己的）
  const likes=()=>{ try{return JSON.parse(localStorage.getItem('qn_liked_'+cfg.board)||'[]');}catch(e){return [];} };
  const anchor=document.getElementById('bd-list'); bindPostActions(anchor);
  function paint(){
    const all=loadPosts(cfg.board).slice().reverse();
    if(!all.length){ anchor.innerHTML='<div class="muted center" style="font-size:12px;margin:10px 0">还没有人张贴，来写第一句。</div>'; return; }
    const liked=likes();
    anchor.innerHTML=all.map(p=>{
      const on=liked.includes(p.id);
      return postCard(k,p,{extra:`<button class="link wlike ${on?'on':''}" data-like="${p.id}">${on?'♥ 已赞':'♡ 赞'}</button>`});
    }).join('');
    anchor.querySelectorAll('[data-like]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.like; const a=likes(); const i=a.indexOf(id);
      if(i>=0)a.splice(i,1); else a.push(id);
      localStorage.setItem('qn_liked_'+cfg.board,JSON.stringify(a));
      b.classList.toggle('on',i<0); b.textContent=i<0?'♥ 已赞':'♡ 赞';
    });
  }
  paint();
  // 注册自定义列表渲染：轮询刷新时保留「赞」按钮（board-sync 会调用）
  window.BOARD_LIST_PAINT = window.BOARD_LIST_PAINT || {};
  window.BOARD_LIST_PAINT[k] = paint;
  window.BOARD_REFRESH = window.BOARD_REFRESH || {};
  window.BOARD_REFRESH[k] = paint;

  // 发帖 → 直接用个人资料的头像与名字，走共享板，board-sync 自动同步到云端
  function postAs(who, name, avatar){
    uTrack('wall_post',{as:who});
    const el=document.getElementById('bd-text'); const t=(el&&el.value||'').trim();
    if(!t){ toast('写点什么吧'); return; }
    const all=loadPosts(cfg.board);
    all.push({id:'p'+Date.now()+Math.random().toString(36).slice(2,6),text:t,author:name,authorId:who,avatar:avatar,at:new Date().toLocaleString('zh-CN'),reported:false});
    savePosts(cfg.board,all); el.value=''; paint(); toast('已贴上墙');
  }
  document.getElementById('wall-post-btn').onclick=()=>postAs(me().id, me().name, me().avatar);
  if(mod){
    const bm=document.getElementById('wall-post-moon'), bw=document.getElementById('wall-post-wave');
    if(bm) bm.onclick=()=>postAs('sys:moon','月','sys_moon');
    if(bw) bw.onclick=()=>postAs('sys:wave','浪','sys_wave');
    renderModList(k);
  }
}

/* ============================================================================
 * 【全站通用】舞台控制器：⤢ 全屏沉浸 / ◌ 关闭界面 / UI 让位
 * ---------------------------------------------------------------------------
 * 用法：给舞台 <div class="qn-stage">，浮层 UI 加 class="qn-ui"，
 *       右上放 <div class="qn-top"><button data-act="fs">⤢</button>
 *                               <button data-act="noui">◌</button></div>
 *       渲染后调用 stageChrome(stage) 即可，全站行为一致。
 * 主体内容出现时调用 stageReading(stage,true) —— UI 自动淡出让位，
 * 这是全站硬规则：UI 永远不许压在主体内容上面。
 * ========================================================================== */
function stageReading(stage,on){ if(stage) stage.classList.toggle('reading',!!on); }
function stageChrome(stage,opts){
  if(!stage) return null;
  opts=opts||{};
  const fsBtn=stage.querySelector('[data-act="fs"]');
  const uiBtn=stage.querySelector('[data-act="noui"]');
  function inFs(){ return document.fullscreenElement===stage || document.webkitFullscreenElement===stage; }
  function paintFs(){
    const on=stage.classList.contains('fsmode');
    if(fsBtn){ fsBtn.textContent=on?'⤡':'⤢'; fsBtn.title=on?'退出全屏':'全屏沉浸'; }
    if(opts.onResize) setTimeout(opts.onResize,60);
    setTimeout(function(){ window.dispatchEvent(new Event('resize')); },80);
  }
  function enter(){
    stage.classList.add('fsmode');
    try{ (stage.requestFullscreen||stage.webkitRequestFullscreen||function(){}).call(stage); }catch(e){}
    paintFs();
  }
  function exit(){
    stage.classList.remove('fsmode');
    try{ if(inFs()) (document.exitFullscreen||document.webkitExitFullscreen||function(){}).call(document); }catch(e){}
    paintFs();
  }
  if(fsBtn) fsBtn.onclick=function(e){ e.stopPropagation(); stage.classList.contains('fsmode')?exit():enter(); };
  if(uiBtn) uiBtn.onclick=function(e){
    e.stopPropagation();
    const off=stage.classList.toggle('noui');
    uiBtn.textContent=off?'◉':'◌'; uiBtn.title=off?'显示界面':'隐藏界面';
  };
  const onFsChange=function(){ if(!document.fullscreenElement && !document.webkitFullscreenElement){ stage.classList.remove('fsmode'); paintFs(); } };
  document.addEventListener('fullscreenchange',onFsChange);
  document.addEventListener('webkitfullscreenchange',onFsChange);
  SCENE_STOPS.push(function(){
    document.removeEventListener('fullscreenchange',onFsChange);
    document.removeEventListener('webkitfullscreenchange',onFsChange);
    stage.classList.remove('fsmode','noui','reading');
  });
  return { enter:enter, exit:exit };
}

/* —— 漂流瓶 —— */
let _bottleApi=null, _bottleView='all', btTimeMode='night';
function showBottle(k,post){
  const reveal=document.getElementById('bd-reveal'); if(!reveal) return;
  const mine=post.authorId===uid();
  const del=canDeletePost(post)?`<button class="link" data-act="del" data-k="${k}" data-id="${post.id}">${canModerate()&&!mine?'删除(管理)':'删除'}</button>`:'';
  const rep=(!canModerate()&&!mine)?`<button class="link warn" data-act="rep" data-k="${k}" data-id="${post.id}">举报</button>`:'';
  const footer=document.getElementById('br-footer'); if(footer) footer.innerHTML=(del||rep)?(del+' '+rep):'';
  const bn=post.author||(post.seed?'某位过客':'过客');
  const tt=document.getElementById('br-text'); if(tt) tt.textContent=post.text||'';
  const au=document.getElementById('br-author'); if(au) au.textContent='—— '+bn;
  const tm=document.getElementById('br-time'); if(tm) tm.textContent=(post.at?post.at.split(' ')[0]:new Date().toLocaleDateString('zh-CN'))+(post.seed?' · 来自远方':' · 漂到这里');
  reveal.classList.add('open');
  bindPostActions(reveal);
}
let bdPopPost=null;
function playBottleOpen(k,post){
  const pop=document.getElementById('bd-pop');
  if(!pop){ showBottle(k,post); return; }
  if(bdPopPost) return; bdPopPost=post;
  pop.classList.remove('play'); void pop.offsetWidth; pop.classList.add('play');
  setTimeout(function(){ pop.classList.remove('play'); bdPopPost=null; showBottle(k,post); }, 950);
}
function bottleOpenComposer(k){
  bottleCloseReveal(k);
  const c=document.getElementById('bd-composer'); if(!c) return;
  c.classList.add('open');
  const ta=document.getElementById('bd-text'); if(ta) setTimeout(()=>{try{ta.focus();}catch(e){}},60);
}
function bottleCloseComposer(k){
  const c=document.getElementById('bd-composer'); if(c) c.classList.remove('open');
}
function bottleCloseReveal(k){
  const reveal=document.getElementById('bd-reveal'); if(reveal) reveal.classList.remove('open');
  if(_bottleApi && _bottleApi.release) _bottleApi.release();
  bdPopPost=null; const pop=document.getElementById('bd-pop'); if(pop) pop.classList.remove('play');
}
function bottleReply(k){ bottleCloseReveal(k); bottleOpenComposer(k); }
function bottleRefresh(k){
  bottleCloseReveal(k); bottleCloseComposer(k);
  if(_bottleApi){ _bottleApi.refresh(true); toast('海面轻轻一动，换了另一批瓶子'); }
}
function renderBottleBoard(k){
  const cfg=BOARDS[k]; const mod=canModerate();
  presenceBeat(cfg.board);
  const total=loadPosts(cfg.board).length;
  screen.innerHTML=boardHeader(cfg,mod)+
    `<div class="presence"><span class="presence-dot"></span>海里漂着 ${total} 只瓶子</div>
     <div class="bt-toggle">
       <span data-v="all" class="${_bottleView==='all'?'on':''}">全部海</span>
       <span data-v="mine" class="${_bottleView==='mine'?'on':''}">我的海</span>
     </div>
     <div id="bt-stage" class="bottle-stage qn-stage"><canvas></canvas>
       <div class="qn-top bt-top">
         <button type="button" class="qn-btn" data-act="fs" title="全屏沉浸">⤢</button>
         <button type="button" class="qn-btn" id="bt-time" title="昼夜切换">☾</button>
         <button type="button" class="qn-btn" data-act="noui" title="隐藏界面">◌</button>
       </div>
       <div class="bt-hint qn-ui">拖拽转视角 · 点瓶子读它的话</div>
       <div class="bottle-dock qn-ui">
         <button class="primary" onclick="bottleOpenComposer('${k}')">扔瓶子</button>
         <button class="ghost" onclick="bottlePick('${k}')">捡瓶子</button>
         <button class="ghost" onclick="bottleRefresh('${k}')">换一批</button>
       </div>
       <div id="bd-reveal" class="bottle-reveal">
         <div class="scroll-wrap">
           <div class="scroll-rod"></div>
           <div class="scroll-clip">
             <div class="scroll-paper">
               <div class="scroll-inner">
                 <div class="paper-mark">“</div>
                 <div class="paper-text" id="br-text"></div>
                 <div class="paper-rule"></div>
                 <div class="paper-author" id="br-author"></div>
                 <div class="paper-time" id="br-time"></div>
                 <div class="paper-footer" id="br-footer"></div>
               </div>
             </div>
           </div>
           <div class="scroll-rod"></div>
         </div>
         <div class="paper-actions">
           <button class="ghost" onclick="bottleCloseReveal('${k}')">回海</button>
           <button class="primary" onclick="bottleReply('${k}')">也写一只</button>
         </div>
       </div>
       <div id="bd-pop" class="bottle-pop"><div class="pop-stage"><div class="pop-glow"></div><div class="pop-bottle"><div class="pop-body"></div><div class="pop-neck"></div><div class="pop-cork"></div></div></div></div>
       <div id="bd-composer" class="bottle-composer">
         <textarea id="bd-text" placeholder="${cfg.ph}" maxlength="280"></textarea>
         <div class="row">
           <button class="cancel" onclick="bottleCloseComposer('${k}')">取消</button>
           <button class="send" onclick="bottleThrow('${k}')">扔出</button>
         </div>
       </div>
     </div>`;
  // 视图切换：全部海 / 我的海（只看自己扔的）
  const tog=screen.querySelectorAll('.bt-toggle span');
  tog.forEach(s=>s.onclick=()=>{ _bottleView=s.dataset.v; tog.forEach(o=>o.classList.toggle('on',o.dataset.v===_bottleView)); if(_bottleApi) _bottleApi.refresh(); });
  // 3D 海面 + 漂浮玻璃瓶
  const stage=document.getElementById('bt-stage'); _bottleApi=null;
  stageChrome(stage);
  const tbtn=document.getElementById('bt-time');
  if(tbtn){ tbtn.textContent = btTimeMode==='night'?'☾':'☀';
    tbtn.onclick=function(){ btTimeMode = btTimeMode==='night'?'day':'night'; tbtn.textContent = btTimeMode==='night'?'☾':'☀'; if(_bottleApi && _bottleApi.setTime) _bottleApi.setTime(btTimeMode); }; }
  function initBottle3D(){
    if(_bottleApi) return true;
    if(typeof window.startBottles!=='function') return false;
    try{
      _bottleApi=window.startBottles(stage,{
        getPosts:function(){ return loadPosts(cfg.board); },
        getView:function(){ return _bottleView; },
        onPick:function(post){ playBottleOpen(k,post); },
        onNotice:function(msg){ toast(msg); }
      });
      SCENE_STOPS.push(function(){ try{_bottleApi.stop();}catch(e){} });
      if(btTimeMode!=='night' && _bottleApi.setTime) _bottleApi.setTime(btTimeMode);
      return true;
    }catch(e){ return false; }
  }
  if(!initBottle3D()){
    /* bottle3d.js 是 defer 模块，且依赖 1.3MB 的 three.module.js。
       页面已用 modulepreload 提前预载引擎，这里只做兜底轮询：
       先显示「海面加载中」，最多等 ~14s；真等不到才降级（捡瓶子仍可走本地池）。 */
    let tries=0;
    const note=document.createElement('div'); note.className='bt-load-note'; note.textContent='海面加载中…';
    try{ stage.appendChild(note); }catch(e2){}
    const iv=setInterval(function(){
      tries++;
      if(initBottle3D()){
        clearInterval(iv);
        try{ if(note.parentNode) note.parentNode.removeChild(note); }catch(e3){}
      }
      else if(tries>=120){ /* ~14.4s 仍没就绪，降级但保证捡瓶子可用 */
        clearInterval(iv);
        try{ note.textContent='海面引擎加载较慢，可稍后刷新重试；捡瓶子仍可用本地池'; }catch(e3){}
      }
    },120);
    SCENE_STOPS.push(function(){ clearInterval(iv); try{ if(note&&note.parentNode) note.parentNode.removeChild(note); }catch(e3){} });
  }
  // 跨设备：远端同步拉到的新瓶子，实时重排海面（不再只是本机）
  window.BOARD_REFRESH = window.BOARD_REFRESH || {};
  window.BOARD_REFRESH[k] = function(){ if(_bottleApi) _bottleApi.refresh(); };
  if(mod) renderModList(k);
}
function bottleThrow(k){
  uTrack('bottle_throw');
  const cfg=BOARDS[k]; const el=document.getElementById('bd-text'); const t=(el&&el.value||'').trim();
  if(!t){ toast('先写一句吧'); return; }
  const all=loadPosts(cfg.board); const m=me();
  const post={id:'p'+Date.now()+Math.random().toString(36).slice(2,6),text:t,author:m.name,authorId:m.id,avatar:m.avatar,at:new Date().toLocaleString('zh-CN'),reported:false};
  all.push(post); savePosts(cfg.board,all); el.value='';
  bottleCloseComposer(k); showBottle(k,post);
  if(_bottleApi){ _bottleApi.addBottle(post); _bottleApi.refresh(); }
  toast('瓶子已扔出');
}
function bottlePick(k){
  bottleCloseReveal(k); bottleCloseComposer(k);
  if(_bottleApi){ const p=_bottleApi.pickRandom(); if(p) return; }
  /* 修复：这里原先误用未定义的 cfg，3D 引擎没起来时点「捡瓶子」会直接抛错 */
  const bcfg=BOARDS[k]; if(!bcfg) return;
  const all=loadPosts(bcfg.board);
  if(!all.length){ showBottle(k,{text:'海里还很安静，你先扔一只？',author:'海',seed:true}); return; }
  showBottle(k, all[Math.floor(Math.random()*all.length)]);
}

/* —— 微光留言 —— */
function renderGlowBoard(k){
  const cfg=BOARDS[k]; const mod=canModerate();
  const meNow=me();
  presenceBeat(cfg.board);
  screen.innerHTML=boardHeader(cfg,mod)+
    `<div class="presence"><span class="presence-dot"></span>${presenceLabel(cfg.board,'亮着微光')}</div>
     <div id="gl-stage" class="glow-stage qn-stage">
       <canvas></canvas>
       <div class="qn-top sky-top">
         <button type="button" id="sky-immerse" class="qn-btn" data-act="fs" title="全屏沉浸">⤢</button>
         <button type="button" id="sky-ui" class="qn-btn" data-act="noui" title="隐藏界面">◌</button>
       </div>
       <div class="sky-zoom qn-ui">
         <button type="button" id="sky-in" title="放大">＋</button>
         <button type="button" id="sky-out" title="缩小">−</button>
         <button type="button" id="sky-fit" title="回到全景">全</button>
       </div>
       <div class="sky-bar qn-ui">
         <button type="button" class="sky-tab on" data-mode="all">全部</button>
         <button type="button" class="sky-tab" data-mode="recent">最新</button>
         <button type="button" class="sky-tab" data-mode="mine">我的</button>
         <button type="button" class="sky-tab" data-mode="random">随机</button>
         <button type="button" class="sky-tab" data-mode="reset">归位</button>
       </div>
       <div class="glow-hint qn-ui">拖拽仰望星穹 · 点一颗微光，读那句话</div>
       <div class="sky-reveal qn-read"></div>
     </div>
     <div class="bcard" style="margin-top:12px">
       <div class="wall-as">${avHtml(meNow.avatar)}<span>以「<b>${esc(meNow.name)}</b>」的身份，点亮一句微光</span></div>
       <textarea class="inp" id="bd-text" placeholder="${cfg.ph}" maxlength="280"></textarea>
       <div class="dm-row"><button class="btn" onclick="sendPost('${k}')">${cfg.btn}</button></div>
     </div>`;
  // 星穹：每条留言=一颗星（越长越亮），抬头仰望「全部」；点击一颗，它坠落浮现那句话
  const stage=document.getElementById('gl-stage');
  _glowApi=null;
  if(stage && typeof window.GlowSky==='function'){
    _glowApi=window.GlowSky(stage,{
      getPosts:function(){ return loadPosts(cfg.board); },
      onReport:function(post){ if(post&&post.id) openReport(k,post.id); },
      me: meNow.name,
      onToast: toast
    });
    SCENE_STOPS.push(function(){ try{_glowApi.destroy();}catch(e){} });
    // 主动放大：星多的时候先放大，再点那一颗，避免误触
    const zi=document.getElementById('sky-in'), zo=document.getElementById('sky-out'), zf=document.getElementById('sky-fit');
    if(zi) zi.onclick=function(){ if(_glowApi&&_glowApi.zoomIn) _glowApi.zoomIn(); };
    if(zo) zo.onclick=function(){ if(_glowApi&&_glowApi.zoomOut) _glowApi.zoomOut(); };
    if(zf) zf.onclick=function(){ if(_glowApi&&_glowApi.resetView) _glowApi.resetView(); };
    // 视图切换（DOM 按钮，不进 canvas，更快更稳）
    screen.querySelectorAll('.sky-tab').forEach(function(b){
      b.onclick=function(){
        screen.querySelectorAll('.sky-tab').forEach(function(x){ x.classList.remove('on'); });
        b.classList.add('on');
        if(_glowApi&&_glowApi.setMode) _glowApi.setMode(b.dataset.mode);
      };
    });
    // 全屏沉浸 / 关闭界面：走全站统一控制器
    stageChrome(stage);
  } else if(stage){
    SCENE_STOPS.push(NatureCanvas(stage.querySelector('canvas'),'night'));
  }
  // 跨设备：远端同步拉到的新留言，实时点亮星穹
  window.BOARD_REFRESH = window.BOARD_REFRESH || {};
  window.BOARD_REFRESH[k] = function(){ if(_glowApi) _glowApi.refresh(); };
  if(mod) renderModList(k);
}

/* —— 同看一片海 —— */
function renderWatchSeaBoard(k){
  const cfg=BOARDS[k]; const mod=canModerate();
  const meNow=me();
  presenceBeat(cfg.board);
  screen.innerHTML=boardHeader(cfg,mod)+
    `<div class="presence"><span class="presence-dot"></span>${presenceLabel(cfg.board,'同看这片海')}</div>
     <div class="wssea"><div id="ws-cv" class="bhero" data-fs></div></div>
     <div class="bhint">和此刻也在的人，同看一段海。不用说话，只是知道：有人也在这里。</div>
     <div class="bcard" style="margin-top:12px">
       <div class="wall-as">${avHtml(meNow.avatar)}<span>以「<b>${esc(meNow.name)}</b>」的身份，说一句你正看着的海</span></div>
       <textarea class="inp" id="bd-text" placeholder="${cfg.ph}" maxlength="280"></textarea>
       <div class="dm-row"><button class="btn" onclick="sendPost('${k}')">${cfg.btn}</button></div>
     </div>
     <div id="bd-list" style="margin-top:14px"></div>`;
  const anchor=document.getElementById('bd-list'); bindPostActions(anchor);
  const all=loadPosts(cfg.board).slice().reverse();
  if(!all.length) anchor.innerHTML='<div class="muted center" style="font-size:12px;margin:10px 0">海很安静，还没有人说话。</div>';
  else anchor.innerHTML=all.map(p=>postCard(k,p)).join('');
  const seaBox=document.getElementById('ws-cv');
  if(seaBox){
    try{
      if(typeof window.startBeach==='function'){
        const inst=window.startBeach(seaBox,{hour:15,speed:45,audio:false,interactive:true});
        if(inst&&inst.stop) SCENE_STOPS.push(()=>{ try{inst.stop();}catch(e){} });
        /* 附加：海滩环境音（独立模块，不改动既有代码） */
        if(typeof window.startBeachAudio==='function'){
          const aInst=window.startBeachAudio(seaBox,{hour:15,speed:45,base:'media/audio/'});
          if(aInst&&aInst.stop) SCENE_STOPS.push(()=>{ try{aInst.stop();}catch(e){} });
        }
      } else { throw new Error('no-3d'); }
    }catch(e){
      try{ const fc=document.createElement('canvas'); fc.className='bhero'; seaBox.appendChild(fc); SCENE_STOPS.push(NatureCanvas(fc,'beach')); }catch(e2){}
    }
  }
  if(mod) renderModList(k);
}

/* —— 同步呼吸 —— */
function renderSyncBreathBoard(k){
  const cfg=BOARDS[k]; const mod=canModerate();
  const meNow=me();
  presenceBeat(cfg.board);
  screen.innerHTML=boardHeader(cfg,mod)+
    `<div class="presence"><span class="presence-dot"></span>${presenceLabel(cfg.board,'同呼吸')}</div>
     <div class="sbwrap"><div class="sbreath" id="sb-circle"><canvas></canvas></div><div class="sbphase" id="sb-phase">准备 · 跟着圆，慢慢呼吸</div><div class="sbguide">吸气 4 秒 · 屏息 4 秒 · 呼气 6 秒</div></div>
     <div class="breath-thought" id="sb-thought"><div class="bt-text"></div><div class="bt-feel"></div></div>
     <div class="bcard" style="margin-top:12px">
       <div class="wall-as">${avHtml(meNow.avatar)}<span>以「<b>${esc(meNow.name)}</b>」的身份，把此刻的呼吸交出去</span></div>
       <textarea class="inp" id="bd-text" placeholder="${cfg.ph}" maxlength="280"></textarea>
       <div class="dm-row"><button class="btn" onclick="sendPost('${k}')">${cfg.btn}</button></div>
     </div>
     <div id="bd-list" style="margin-top:14px"></div>`;
  const anchor=document.getElementById('bd-list'); bindPostActions(anchor);
  const all=loadPosts(cfg.board).slice().reverse();
  if(!all.length) anchor.innerHTML='<div class="muted center" style="font-size:12px;margin:10px 0">还没有人同呼吸。留下此刻吧。</div>';
  else anchor.innerHTML=all.map(p=>postCard(k,p)).join('');
  breathAnim(document.getElementById('sb-circle'));
  /* 治愈短句轮转：每句带一句「感受 / 解释」，以你的感受为主 */
  (function(){
    const box=document.getElementById('sb-thought'); if(!box) return;
    const tx=box.querySelector('.bt-text'), fe=box.querySelector('.bt-feel');
    let bi=Math.floor(Math.random()*BREATH_PHRASES.length);
    function paint(){ const p=BREATH_PHRASES[bi]; if(tx) tx.textContent=p.t; if(fe) fe.textContent=p.f; box.classList.remove('bt-in'); void box.offsetWidth; box.classList.add('bt-in'); }
    paint();
    const rot=setInterval(()=>{ bi=(bi+1)%BREATH_PHRASES.length; paint(); },8000);
    SCENE_STOPS.push(()=>clearInterval(rot));
  })();
  if(mod) renderModList(k);
}

/* 分发：模块点击 → 对应板块的独立渲染 */
const BOARD_RENDER={reader:renderReaderBoard,relay:renderRelayBoard,wall:renderWallBoard,bottle:renderBottleBoard,glownote:renderGlowBoard,watchsea:renderWatchSeaBoard,syncbreath:renderSyncBreathBoard};
function renderBoard(k){ window.__curBoard=k; const f=BOARD_RENDER[k]; if(f) f(k); else toast('「'+(MODULES[k]?MODULES[k].t:k)+'」框架待实现'); if(typeof startBoardSync==='function') startBoardSync(k);
  /* 画面内「写一句」玻璃浮层：仅「共读接力」保留（用户要求微光/同呼吸/同看海恢复原本的下方输入框）。 */
  if(k==='relay' && typeof setupSceneDock==='function'){
    setupSceneDock(k, '接力一句', '#screen');
  }
}

function sendPost(k){
  uTrack('board_post',{board:k});
  const cfg=BOARDS[k]; const el=document.getElementById('bd-text'); const t=(el&&el.value||'').trim();
  if(!t){ toast('写点什么吧'); return; }
  const all=loadPosts(cfg.board); const m=me();
  all.push({id:'p'+Date.now()+Math.random().toString(36).slice(2,6),text:t,author:m.name,authorId:m.id,avatar:m.avatar,at:new Date().toLocaleString('zh-CN'),reported:false});
  savePosts(cfg.board,all); if(el) el.value=''; toast('已送上');
  // 3D 板（微光）：原地刷新场景，避免整屏重建丢失视角
  if(window.BOARD_REFRESH && typeof window.BOARD_REFRESH[k]==='function'){ try{ window.BOARD_REFRESH[k](); return; }catch(e){} }
  renderBoard(k);
}
function deletePost(k,id){
  const cfg=BOARDS[k]; const all=loadPosts(cfg.board); const i=all.findIndex(x=>x.id===id); if(i<0) return false;
  const p=all[i];
  // 本体 seed（微光粒子、漂流瓶示例等）受保护，管理端也不允许删除
  if(p.seed){ toast('这条内容是站点本体示例，不能删除'); return false; }
  const mine=p.authorId===uid();
  if(!window.confirm(canModerate()&&!mine?'作为管理端删除这条内容？':'删除这条留言？')) return false;
  all.splice(i,1); savePosts(cfg.board,all);
  toast(canModerate()&&!mine?'已作为管理端删除':'已删除'); renderBoard(k);
  return true;
}
/* 举报：弹层选原因（或直接举报），并通知管理端微信 */
function openReport(k,id){
  if(document.getElementById('rptMask')) document.getElementById('rptMask').remove();
  const mask=document.createElement('div'); mask.className='rpt-mask'; mask.id='rptMask';
  mask.innerHTML=`
    <div class="rpt">
      <div class="rpt-t">举报这条内容</div>
      <div class="rpt-sub">我们会尽快处理 · 同时通知管理端微信</div>
      <div class="rpt-reasons">
        <button class="rpt-chip" data-r="垃圾广告">垃圾广告</button>
        <button class="rpt-chip" data-r="不当内容">不当内容</button>
        <button class="rpt-chip" data-r="骚扰 / 攻击">骚扰 / 攻击</button>
        <button class="rpt-chip" data-r="重复刷屏">重复刷屏</button>
        <button class="rpt-chip" data-r="其他">其他</button>
      </div>
      <textarea class="inp rpt-note" id="rptNote" placeholder="补充说明（选填）…"></textarea>
      <div class="rpt-row">
        <button class="btn" id="rptSubmit">提交举报</button>
        <button class="btn ghost" id="rptDirect">直接举报</button>
        <button class="btn ghost" id="rptCancel">取消</button>
      </div>
      <div class="rpt-ok" id="rptOk"></div>
    </div>`;
  document.getElementById('app').appendChild(mask);
  requestAnimationFrame(()=>mask.classList.add('show'));
  let reason='';
  mask.querySelectorAll('.rpt-chip').forEach(c=>c.addEventListener('click',()=>{
    const on=c.classList.contains('on');
    mask.querySelectorAll('.rpt-chip').forEach(x=>x.classList.remove('on'));
    if(!on){ c.classList.add('on'); reason=c.dataset.r; }
  }));
  mask.addEventListener('click',e=>{ if(e.target===mask) closeReport(); });
  document.getElementById('rptCancel').addEventListener('click',closeReport);
  document.getElementById('rptDirect').addEventListener('click',()=>submitReport(k,id,'',document.getElementById('rptNote').value.trim()));
  document.getElementById('rptSubmit').addEventListener('click',()=>{
    const note=document.getElementById('rptNote').value.trim();
    if(!reason && !note){ document.getElementById('rptOk').textContent='请选一个原因，或点「直接举报」'; return; }
    submitReport(k,id,reason,note);
  });
}
function closeReport(){ const m=document.getElementById('rptMask'); if(m){ m.classList.remove('show'); setTimeout(()=>m.remove(),180); } }
function submitReport(k,id,reason,note){
  const cfg=BOARDS[k]; const all=loadPosts(cfg.board); const p=all.find(x=>x.id===id);
  if(p){ p.reported=true; p.reportReason=reason; p.reportNote=note; p.reportAt=new Date().toLocaleString('zh-CN'); savePosts(cfg.board,all); }
  const me2=me();
  const body=`板块：${cfg.title}\n原因：${reason||'（未填原因）'}${note?'\n说明：'+note:''}\n内容：${(p&&p.text||'').slice(0,80)}\n举报人：${me2.name}`;
  pushWechat('空栈 · 新举报', body).then(ok=>{
    closeReport();
    toast(ok?'已提交 · 管理端微信已收到':'已提交 · 通知未送达');
    renderBoard(k);
  });
}

/* ===================== 声音底座（本地实时合成 · 不依赖任何音频文件） =====================
   此前「有时候听不到声音」的两个根因：
   ① 手机浏览器要求先发生一次真实触摸，音频才被允许出声（否则一直静音、无提示）；
   ② 依赖外链音频文件时，网络一慢就静默失败。
   现在全部改为本地实时合成：首次触摸自动解锁，离线也能出声，永不依赖外部文件。 */
function lsGet(k,d){ try{ const v=localStorage.getItem(k); return v==null?d:JSON.parse(v); }catch(e){ return d; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
function accentRGB(){ return (getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb')||'159,227,190').trim(); }
function accentRGBA(a){ return 'rgba('+accentRGB()+','+a+')'; }

const SoundKit=(function(){
  let ctx=null, master=null, ana=null;
  const live={}, vols=lsGet('qn_snd_vols',{});
  function ac(){
    if(!ctx){
      const K=window.AudioContext||window.webkitAudioContext; if(!K) return null;
      ctx=new K();
      master=ctx.createGain(); master.gain.value=.9;
      ana=ctx.createAnalyser(); ana.fftSize=256;
      master.connect(ana); ana.connect(ctx.destination);
    }
    if(ctx.state==='suspended'){ try{ctx.resume();}catch(e){} }
    return ctx;
  }
  function buf(kind,sec){
    const c=ac(), len=Math.floor(c.sampleRate*(sec||3));
    const b=c.createBuffer(1,len,c.sampleRate), d=b.getChannelData(0);
    if(kind==='brown'){ let l=0; for(let i=0;i<len;i++){ const w=Math.random()*2-1; l=(l+.02*w)/1.02; d[i]=l*3.4; } }
    else if(kind==='pink'){ let a=0,b1=0,b2=0; for(let i=0;i<len;i++){ const w=Math.random()*2-1;
      a=.99765*a+w*.0990460; b1=.96300*b1+w*.2965164; b2=.57*b2+w*1.0526913; d[i]=(a+b1+b2+w*.1848)*.26; } }
    else { for(let i=0;i<len;i++) d[i]=Math.random()*2-1; }
    return b;
  }
  function lfo(param,rate,depth,base){ const c=ac();
    const o=c.createOscillator(); o.frequency.value=rate;
    const g=c.createGain(); g.gain.value=depth;
    o.connect(g); g.connect(param); param.value=base; o.start(); return o; }
  function ping(out,freq,dur,gain,type){ const c=ac(); if(!c) return;
    const o=c.createOscillator(); o.type=type||'sine'; o.frequency.value=freq;
    const g=c.createGain(); g.gain.value=0; o.connect(g); g.connect(out);
    const t=c.currentTime;
    g.gain.linearRampToValueAtTime(gain,t+.006);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.start(t); o.stop(t+dur+.06);
  }
  function burst(out,f,q,dur,gain){ const c=ac(); if(!c) return;
    const s=c.createBufferSource(); s.buffer=buf('white',.25);
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=f; bp.Q.value=q;
    const g=c.createGain(); g.gain.value=0;
    s.connect(bp); bp.connect(g); g.connect(out);
    const t=c.currentTime;
    g.gain.linearRampToValueAtTime(gain,t+.01);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    s.start(t); s.stop(t+dur+.05);
  }
  /* 环境音素材（本地真实录音，统一用 .mp3；回忆曲用已生成的 mood 音乐复用） */
  const FILES={
    rain:'media/audio/rain.mp3', wind:'media/audio/wind.mp3', fire:'media/audio/campfire.mp3',
    seagulls:'media/audio/seagulls.mp3', music_day:'media/audio/music_day.mp3', music_night:'media/audio/music_night.mp3'
  };
  /* 轨道：file=真实录音；synth=实时钵音（短促温柔，不像噪音） */
  const RECIPE={
    rain:{n:'细雨',     s:'落在窗沿的雨声',   file:'rain'},
    wind:{n:'山风',     s:'穿过松林的风',     file:'wind'},
    fire:{n:'篝火',     s:'木柴轻轻爆响',     file:'fire'},
    seagulls:{n:'海鸥', s:'远处海面的鸥鸣',   file:'seagulls'},
    music_day:{n:'昼之轻音', s:'明亮的钢琴小品', file:'music_day'},
    music_night:{n:'夜之轻音', s:'静谧的大提琴', file:'music_night'},
    bowl:{n:'钵音',     s:'一记悠长的余韵',   synth:true}
  };
  /* 钵音：实时合成（短促温柔，不像噪音） */
  function bowlStops(out){
    const c=ac(), stops=[];
    const fire=()=>{ const f=196*(Math.random()<.5?1:1.5);
      [1,2.02,2.99,4.21].forEach((m,i)=>ping(out,f*m,5.5-i*.7,.055/(i+1),'sine')); };
    const id=setInterval(fire,11000); stops.push(()=>clearInterval(id));
    fire();
    return stops;
  }
  /* 真实文件音轨：createMediaElementSource → 增益 → 主输出（可被可视化与分析器捕获） */
  function fileStops(key,out){
    const c=ac(); if(!c) return [];
    const url=FILES[RECIPE[key].file]; if(!url) return [];
    const a=new Audio(url); a.loop=true; a.preload='auto'; a.volume=1;
    let src; try{ src=c.createMediaElementSource(a); }catch(e){ return []; }
    src.connect(out);
    const p=a.play(); if(p&&p.catch) p.catch(()=>{});
    return [()=>{ try{a.pause();}catch(e){} try{src.disconnect();}catch(e){} try{a.src='';}catch(e){} }];
  }
  function build(key,out){
    if(RECIPE[key].file) return fileStops(key,out);
    if(RECIPE[key].synth) return bowlStops(out);
    return [];
  }
  function vol(key){ return vols[key]==null?.6:vols[key]; }
  function setVol(key,v){ vols[key]=v; lsSet('qn_snd_vols',vols); if(live[key]) live[key].g.gain.value=v; }
  function on(key){ return !!live[key]; }
  function start(key){
    if(live[key]) return true;
    const c=ac(); if(!c){ return false; }
    const g=c.createGain(); g.gain.value=vol(key); g.connect(master);
    live[key]={g,stops:build(key,g)};
    return true;
  }
  function stop(key){ const L=live[key]; if(!L) return;
    L.stops.forEach(f=>{try{f()}catch(e){}}); try{L.g.disconnect()}catch(e){}
    delete live[key]; }
  function toggle(key){ if(live[key]){ stop(key); return false; } return start(key); }
  function stopAll(){ Object.keys(live).forEach(stop); }
  function count(){ return Object.keys(live).length; }
  /* 首次真实触摸即解锁 —— 这是「点了没声音」最常见的原因 */
  ['pointerdown','touchstart','keydown'].forEach(ev=>
    window.addEventListener(ev,()=>{ if(ctx&&ctx.state==='suspended'){ try{ctx.resume()}catch(e){} } },{passive:true}));
  return {
    list:RECIPE, on, start, stop, toggle, stopAll, count, vol, setVol,
    ready(){ return !!(window.AudioContext||window.webkitAudioContext); },
    analyser(){ ac(); return ana; },
    /* 完成提示：一记温柔的钵音 */
    chime(){ const c=ac(); if(!c) return;
      [1,2.02,2.99].forEach((m,i)=>ping(master,294*m,4.2-i*.6,.07/(i+1),'sine')); },
    tick(){ const c=ac(); if(!c) return; ping(master,660,.12,.035,'sine'); }
  };
})();

/* 悬浮的声景开关：只要有音轨在响就出现，随手可停 */
function soundPill(){
  let el=document.getElementById('sndpill');
  if(!SoundKit.count()){ if(el) el.remove(); return; }
  if(!el){
    el=document.createElement('button'); el.id='sndpill';
    el.style.cssText='position:fixed;right:14px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:60;'+
      'padding:9px 15px;border-radius:20px;font-size:12px;font-family:inherit;color:#08130f;background:var(--accent);'+
      'border:none;box-shadow:0 10px 26px -10px rgba(0,0,0,.8);cursor:pointer;';
    el.onclick=()=>{ SoundKit.stopAll(); soundPill(); toast('声景已停');
      if(document.getElementById('ec-grid')) renderEcho(); };
    document.body.appendChild(el);
  }
  el.textContent='◼ 声景 · '+SoundKit.count();
}

/* ===================== 语音引导（修「没声音 / 提示引擎未就绪」） =====================
   浏览器首次读取语音列表常常返回空，旧版据此判定"不可用"就再也不出声了。
   现在改为：延迟重取 + 选中文音色 + 无论如何都配一记轻音与全屏文字，语音只是加分项。 */
const Voice=(function(){
  let voices=[];
  function load(){ try{ voices=window.speechSynthesis?(speechSynthesis.getVoices()||[]):[]; }catch(e){ voices=[]; } }
  if(window.speechSynthesis){ load(); try{ speechSynthesis.onvoiceschanged=load; }catch(e){} setTimeout(load,600); }
  function pick(){ return voices.find(v=>/zh[-_]?CN/i.test(v.lang)) || voices.find(v=>/zh/i.test(v.lang)) || voices[0] || null; }
  return {
    supported(){ return !!window.speechSynthesis; },
    say(text,rate){
      SoundKit.tick();                       // 无论语音成不成，先给一记轻音，绝不会「完全没反应」
      if(!window.speechSynthesis) return false;
      try{
        if(!voices.length) load();
        const u=new SpeechSynthesisUtterance(text);
        const v=pick(); if(v) u.voice=v;
        u.lang='zh-CN'; u.rate=rate||.76; u.pitch=.96; u.volume=1;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
        return true;
      }catch(e){ return false; }
    },
    stop(){ try{ window.speechSynthesis && speechSynthesis.cancel(); }catch(e){} }
  };
})();

/* ===================== 场景渲染底座（现场绘制的自然画面，非贴图） ===================== */
let SCENE_STOPS=[];
function stopScenes(){ SCENE_STOPS.forEach(f=>{try{f()}catch(e){}}); SCENE_STOPS=[]; }
function scene(cv,draw){
  if(!cv) return;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const fit=()=>{ const w=cv.clientWidth||320,h=cv.clientHeight||180;
    if(cv.width!==Math.floor(w*dpr)){ cv.width=Math.floor(w*dpr); cv.height=Math.floor(h*dpr); } return [w,h]; };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    const [w,h]=fit(); const g=cv.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0); draw(g,w,h,0); return;
  }
  let alive=true; const t0=performance.now();
  (function frame(now){
    if(!alive||!cv.isConnected){ alive=false; return; }
    const [w,h]=fit(); const g=cv.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0);
    draw(g,w,h,(now-t0)/1000);
    requestAnimationFrame(frame);
  })(performance.now());
  SCENE_STOPS.push(()=>{alive=false;});
}

/* ===================== NatureCanvas（原站场景引擎 · 原样搬入） =====================
   统一驱动各公共板块的 hero 动画：night / beach / bottle / motes / breath 等。
   返回 stop 函数，由调用方压入 SCENE_STOPS，随 modClear 统一清理。 */
function NatureCanvas(canvas, theme, opts){
  opts = opts||{};
  if(!canvas || !canvas.getContext) return function(){};
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio||1, 2);
  let raf=null, t0=performance.now(), alive=true, parts=[];
  function W(){ return canvas.clientWidth||canvas.width/DPR; }
  function H(){ return canvas.clientHeight||canvas.height/DPR; }
  function resize(){
    const w=canvas.clientWidth||300, h=canvas.clientHeight||160;
    canvas.width=Math.floor(w*DPR); canvas.height=Math.floor(h*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    if(theme==="night"||theme==="star"){ parts=[]; const n=Math.max(20,Math.floor(w*h/9000)); for(let i=0;i<n;i++) parts.push({x:Math.random()*w,y:Math.random()*h*0.85,r:Math.random()*1.3+0.3,p:Math.random()*6.28,s:Math.random()*0.5+0.2}); }
    if(theme==="forest"||theme==="motes"){ parts=[]; const n=Math.max(16,Math.floor(w*h/12000)); for(let i=0;i<n;i++) parts.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2+0.6,v:Math.random()*0.2+0.05,o:Math.random()*0.6+0.2}); }
  }
  function flower(ctx,x,y,r,t,color){
    ctx.save(); ctx.translate(x,y);
    ctx.strokeStyle="rgba(120,200,150,.7)"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-r*1.4); ctx.stroke();
    ctx.translate(0,-r*1.4);
    for(let i=0;i<6;i++){ ctx.save(); ctx.rotate(i/6*6.29); ctx.fillStyle=color; ctx.beginPath(); ctx.ellipse(0,-r*0.6, r*0.42, r*0.62,0,0,6.29); ctx.fill(); ctx.restore(); }
    ctx.fillStyle="rgba(255,222,120,.95)"; ctx.beginPath(); ctx.arc(0,0,r*0.34,0,6.29); ctx.fill();
    ctx.restore();
  }
  function draw(t){
    const w=W(), h=H(); ctx.clearRect(0,0,w,h);
    if(theme==="water"||theme==="sea"||theme==="bottle"||theme==="pebble"||theme==="lake"){
      const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,"#0d2a3a"); g.addColorStop(0.55,"#103a4d"); g.addColorStop(1,"#0a2230"); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      ctx.strokeStyle="rgba(150,210,230,.10)"; ctx.lineWidth=1;
      for(let k=0;k<4;k++){ ctx.beginPath(); const yo=h*0.5+k*h*0.12; for(let x=0;x<=w;x+=8){ const y=yo+Math.sin(x*0.02+t*1.2+k)*4+Math.sin(x*0.05+t*0.7)*2; if(x===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.stroke(); }
      if(theme==="pebble"){ const px=w/2, py=h*0.72, pr=Math.min(w,h)*0.10; ctx.fillStyle="rgba(185,205,215,.92)"; ctx.beginPath(); ctx.ellipse(px,py,pr*1.3,pr*0.7,0,0,6.29); ctx.fill(); ctx.fillStyle="rgba(255,255,255,.22)"; ctx.beginPath(); ctx.ellipse(px-pr*0.4,py-pr*0.22,pr*0.5,pr*0.24,0,0,6.29); ctx.fill(); ctx.strokeStyle="rgba(200,230,240,.16)"; for(let r=1;r<4;r++){ ctx.globalAlpha=0.5-r*0.12; ctx.beginPath(); ctx.ellipse(px,py,pr*1.3+r*10,pr*0.7+r*6,0,0,6.29); ctx.stroke(); } ctx.globalAlpha=1; }
      if(theme==="bottle"){ const cnt=(opts&&opts.count)||1; for(let i=0;i<cnt;i++){ const seed=i*97.13; const bx=w*(0.15+0.7*((Math.sin(seed)*0.5+0.5))); const by=h*0.45+Math.sin(t*1.2+seed)*h*0.06+(i%2?h*0.13:0); ctx.save(); ctx.translate(bx,by); ctx.rotate(-0.32+Math.sin(t*0.5+seed)*0.05); ctx.fillStyle="rgba(195,228,238,.26)"; ctx.strokeStyle="rgba(225,248,252,.55)"; ctx.lineWidth=2; ctx.beginPath(); if(ctx.roundRect)ctx.roundRect(-9,-24,18,48,8); else ctx.rect(-9,-24,18,48); ctx.fill(); ctx.stroke(); ctx.fillStyle="rgba(120,180,190,.5)"; ctx.fillRect(-6,16,12,11); ctx.restore(); } }
    } else if(theme==="beach"){
      const sky=ctx.createLinearGradient(0,0,0,h*0.7); sky.addColorStop(0,"#aee3f2"); sky.addColorStop(1,"#fde6c4"); ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*0.62);
      const sx=w*0.78, sy=h*0.22, sr=Math.min(w,h)*0.07; const sg=ctx.createRadialGradient(sx,sy,sr*0.3,sx,sy,sr*3); sg.addColorStop(0,"rgba(255,240,200,.9)"); sg.addColorStop(1,"rgba(255,240,200,0)"); ctx.fillStyle=sg; ctx.fillRect(0,0,w,h*0.62); ctx.fillStyle="rgba(255,238,190,.95)"; ctx.beginPath(); ctx.arc(sx,sy,sr,0,6.29); ctx.fill();
      const seaTop=h*0.55; const sea=ctx.createLinearGradient(0,seaTop,0,h*0.86); sea.addColorStop(0,"#2f8fb0"); sea.addColorStop(1,"#0f5b78"); ctx.fillStyle=sea; ctx.fillRect(0,seaTop,w,h*0.32);
      ctx.strokeStyle="rgba(220,245,255,.25)"; ctx.lineWidth=1.5;
      for(let k=0;k<5;k++){ ctx.beginPath(); const yo=seaTop+h*0.05+k*h*0.05; for(let x=0;x<=w;x+=8){ const y=yo+Math.sin(x*0.03+t*1.3+k)*3; if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);} ctx.stroke(); }
      ctx.fillStyle="#e9d3a0"; ctx.beginPath(); ctx.moveTo(0,h*0.84); ctx.quadraticCurveTo(w*0.5,h*0.80,w,h*0.86); ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.fill();
      ctx.fillStyle="rgba(255,255,255,.5)"; for(let i=0;i<6;i++){ const bx=w*(0.1+0.8*((i*0.37)%1)); const by=h*0.9+Math.sin(t*1.5+i)*3; ctx.beginPath(); ctx.arc(bx,by,2.5,0,6.29); ctx.fill(); }
    } else if(theme==="night"||theme==="star"){
      const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,"#0a0f24"); g.addColorStop(1,"#161d3a"); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      const mg=ctx.createRadialGradient(w*0.78,h*0.2,4,w*0.78,h*0.2,h*0.5); mg.addColorStop(0,"rgba(255,247,220,.5)"); mg.addColorStop(1,"rgba(255,247,220,0)"); ctx.fillStyle=mg; ctx.fillRect(0,0,w,h);
      parts.forEach(p=>{ const tw=0.5+0.5*Math.sin(t*p.s+p.p); ctx.globalAlpha=p.o*tw; ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.29); ctx.fill(); }); ctx.globalAlpha=1;
    } else if(theme==="forest"||theme==="motes"){
      const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,"#0c2417"); g.addColorStop(1,"#06140d"); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      parts.forEach(p=>{ p.y-=p.v; if(p.y<-4){p.y=h+4;p.x=Math.random()*w;} ctx.globalAlpha=p.o; ctx.fillStyle="rgba(195,242,185,.85)"; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.29); ctx.fill(); }); ctx.globalAlpha=1;
    } else if(theme==="dawn"){
      const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,"#2a1a3a"); g.addColorStop(0.5,"#7a3b5a"); g.addColorStop(1,"#e3a06a"); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      const sg=ctx.createRadialGradient(w*0.5,h*0.85,4,w*0.5,h*0.85,h*0.6); sg.addColorStop(0,"rgba(255,220,150,.6)"); sg.addColorStop(1,"rgba(255,220,150,0)"); ctx.fillStyle=sg; ctx.fillRect(0,0,w,h);
    } else if(theme==="breath"){
      const s=0.5+0.5*Math.sin(t*0.8); const cx=w/2, cy=h/2, rr=Math.min(w,h)*0.18*(0.7+0.5*s);
      const g=ctx.createRadialGradient(cx,cy,4,cx,cy,rr*1.6); g.addColorStop(0,"rgba(150,220,200,"+(0.35+0.25*s)+")"); g.addColorStop(1,"rgba(150,220,200,0)"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,rr*1.6,0,6.29); ctx.fill();
      ctx.strokeStyle="rgba(190,240,220,.85)"; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,rr,0,6.29); ctx.stroke();
    } else if(theme==="garden"){
      const count = (opts&&opts.count)||0;
      const grow = (opts&&opts.getGrow)?opts.getGrow():(opts&&opts.grow!=null?opts.grow:0.6);
      ctx.fillStyle="rgba(18,46,30,.55)"; ctx.fillRect(0,h*0.86,w,h*0.14);
      const shown = Math.max(count, 5);
      const cols=Math.max(1,Math.ceil(Math.sqrt(shown+1)));
      for(let i=0;i<shown;i++){
        const gx=w*(0.12+0.76*((i%cols)/(cols-1||1)));
        const gy=h*0.86 - Math.floor(i/cols)*(Math.min(w,h)*0.11);
        flower(ctx, gx+Math.sin(t*0.8+i)*2, gy, Math.min(w,h)*0.07, t+i, "rgba(230,155,191,.9)");
      }
      const cxp=w/2, byp=h*0.86;
      const crad=Math.min(w,h)*0.16*Math.max(grow,0.2);
      flower(ctx, cxp+Math.sin(t*0.6)*3, byp, crad, t, grow>0.05?"rgba(242,193,78,.95)":"rgba(230,155,191,.55)");
    }
  }
  function frame(now){ if(!alive) return; if(!canvas.isConnected){ alive=false; return; } draw((now-t0)/1000); if(reduce){ alive=false; return; } raf=requestAnimationFrame(frame); }
  let ro; try{ ro=new ResizeObserver(resize); ro.observe(canvas); }catch(e){}
  resize(); if(reduce){ draw(0); } else { raf=requestAnimationFrame(frame); }
  const stop=function(){ alive=false; if(raf)cancelAnimationFrame(raf); if(ro)try{ro.disconnect();}catch(e){} };
  canvas._ncStop=stop; return stop;
}

/* 层叠山峦：由调色板决定季节与时辰的气质 */
function paintRidges(g,w,h,t,P){
  const sky=g.createLinearGradient(0,0,0,h);
  P.sky.forEach((c,i)=>sky.addColorStop(i/(P.sky.length-1),c));
  g.fillStyle=sky; g.fillRect(0,0,w,h);
  if(P.sun){
    const sx=w*P.sun.x, sy=h*P.sun.y, r=P.sun.r*h;
    const gr=g.createRadialGradient(sx,sy,0,sx,sy,r);
    gr.addColorStop(0,P.sun.c0); gr.addColorStop(.4,P.sun.c1); gr.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=gr; g.beginPath(); g.arc(sx,sy,r,0,7); g.fill();
  }
  P.ridges.forEach((R,i)=>{
    g.beginPath(); g.moveTo(0,h+2);
    const base=h*R.y, amp=h*R.a, ph=t*(R.d||0);
    for(let x=0;x<=w;x+=3){
      const u=x/w;
      const y=base - Math.sin(u*Math.PI*R.s+ph+i*1.7)*amp - Math.sin(u*Math.PI*R.s*2.6+i*2.3)*amp*.4;
      g.lineTo(x,y);
    }
    g.lineTo(w,h+2); g.closePath(); g.fillStyle=R.c; g.fill();
  });
  for(let i=0;i<3;i++){
    const y=h*(.54+i*.13), off=((t*(7+i*5))%(w+300))-150;
    const gr=g.createLinearGradient(off-150,0,off+150,0);
    gr.addColorStop(0,'rgba(255,255,255,0)');
    gr.addColorStop(.5,'rgba(255,255,255,'+(.045+i*.018)+')');
    gr.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=gr; g.fillRect(0,y,w,h*.11);
  }
}
const _STARS=Array.from({length:96},()=>({x:Math.random(),y:Math.random()*.82,r:Math.random()*1.05+.3,p:Math.random()*6.28,s:.5+Math.random()*1.7}));
function paintNight(g,w,h,t,o){
  o=o||{};
  const sky=g.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,o.top||'#070d24'); sky.addColorStop(.6,o.mid||'#0a1628'); sky.addColorStop(1,o.bot||'#04090f');
  g.fillStyle=sky; g.fillRect(0,0,w,h);
  _STARS.forEach(s=>{ const a=(.28+.62*(.5+.5*Math.sin(t*s.s+s.p)));
    g.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')'; g.beginPath(); g.arc(s.x*w,s.y*h,s.r,0,7); g.fill(); });
  if(o.moon!==false){
    const mx=w*(o.mx||.76), my=h*(o.my||.26), r=h*.11;
    const gr=g.createRadialGradient(mx,my,0,mx,my,r*4.2);
    gr.addColorStop(0,'rgba(255,248,224,.42)'); gr.addColorStop(1,'rgba(255,248,224,0)');
    g.fillStyle=gr; g.beginPath(); g.arc(mx,my,r*4.2,0,7); g.fill();
    g.fillStyle='#FFF7E0'; g.beginPath(); g.arc(mx,my,r,0,7); g.fill();
  }
  g.beginPath(); g.moveTo(0,h+2);
  for(let x=0;x<=w;x+=3){ const u=x/w;
    g.lineTo(x,h*.82 - Math.sin(u*Math.PI*1.6+.4)*h*.1 - Math.sin(u*Math.PI*4.1)*h*.03); }
  g.lineTo(w,h+2); g.closePath(); g.fillStyle='#03070b'; g.fill();
}

/* ===================== 私域模块 · 外壳 ===================== */
let MOD_TICKS=[];
function modTick(fn,ms){ const id=setInterval(fn,ms); MOD_TICKS.push(id); return id; }
function modWait(fn,ms){ const id=setTimeout(fn,ms); MOD_TICKS.push(id); return id; }
function modClear(){ MOD_TICKS.forEach(id=>{clearInterval(id);clearTimeout(id);}); MOD_TICKS=[]; stopScenes(); Voice.stop(); }
function modBack(){ modClear(); returnToSanctuary(); }
function modHeader(k,sub){
  const m=MODULES[k]||{t:k,d:''};
  return '<div class="bhead">'+
    '<button class="bback" onclick="modBack()">← 栖处</button>'+
    '<div class="bht"><div class="bh2">'+m.t+'</div><div class="bsub">'+(sub||m.d)+'</div></div>'+
  '</div>';
}
function openModule(k){
  uTrack('module_open');          // 总计：任意模块被打开一次
  uTrack('module_'+k);             // 明细：每个模块一个独立事件名，后台可按事件名看 27 种点击
  if(BOARDS[k] || MODULE_RENDER[k]){
    SANCTUARY_SCROLL = screen.scrollTop;
    LAST_MOD = k;
    hideStackRail();
  }
  if(BOARDS[k]){ modClear(); renderBoard(k); screen.scrollTop=0; return; }
  const f=MODULE_RENDER[k];
  if(f){ modClear(); f(); screen.scrollTop=0; soundPill(); return; }
  toast('「'+(MODULES[k]?MODULES[k].t:k)+'」框架待实现');
}

/* ===================== 回声 · 声景 ===================== */
const EC_PRESETS={
  '雨夜书房':{rain:.72,fire:.34,bowl:.30},
  '林间微风':{wind:.60,seagulls:.30,music_day:.25},
  '海边黄昏':{seagulls:.55,wind:.34,music_day:.30},
  '篝火夜谈':{fire:.62,wind:.24,bowl:.30},
  '深夜助眠':{rain:.44,music_night:.34,bowl:.30}
};
let ECHO_SLEEP=null, ECHO_SLEEP_MIN=0;
function renderEcho(){
  soundStopAll();                        // 声景板自带混音器，让全局 BGM 让位
  const L=SoundKit.list, keys=Object.keys(L);
  let h=modHeader('echo','真实环境音 + 钵音 · 叠成属于你此刻的那片声音');
  h+='<canvas class="ecwave" id="ec-wave"></canvas>';
  h+='<div class="mrow">'+Object.keys(EC_PRESETS).map(p=>
      '<div class="mbtn sm" data-pre="'+p+'">'+p+'</div>').join('')+'</div>';
  h+='<div class="ecgrid" id="ec-grid">';
  keys.forEach(k=>{
    const on=SoundKit.on(k);
    h+='<div class="ectr'+(on?' on':'')+'" data-tr="'+k+'">'+
        '<div class="ecn"><span class="ecd"></span>'+L[k].n+'</div>'+
        '<div class="ecs">'+L[k].s+'</div>'+
        '<input type="range" min="0" max="100" data-vol="'+k+'" value="'+Math.round(SoundKit.vol(k)*100)+'">'+
      '</div>';
  });
  h+='</div>';
  h+='<div class="mline" style="margin-top:14px"><span>睡眠定时</span><span id="ec-sleep-l" style="font-size:12px;color:var(--muted)">'+(ECHO_SLEEP_MIN?ECHO_SLEEP_MIN+' 分钟后停':'关')+'</span></div>';
  h+='<div class="chips">'+[0,15,30,60,90].map(m=>
      '<div class="chip'+(ECHO_SLEEP_MIN===m?' on':'')+'" data-sleep="'+m+'">'+(m?m+'分钟':'不定时')+'</div>').join('')+'</div>';
  h+='<div class="mrow"><div class="mbtn" id="ec-stop">全部停止</div></div>';
  h+='<div class="mnote">环境音为合成素材（雨 / 风 / 篝火 / 海鸥 / 昼夜轻音乐），钵音为实时合成。<br>离开这一页后声景会继续，右下角随时可以停。</div>';
  screen.innerHTML=h;

  scene(document.getElementById('ec-wave'),(g,w,hh,t)=>{
    g.clearRect(0,0,w,hh);
    const an=SoundKit.analyser(); let d=null;
    if(an&&SoundKit.count()){ d=new Uint8Array(an.fftSize); an.getByteTimeDomainData(d); }
    g.beginPath();
    for(let x=0;x<=w;x++){
      const v=d? (d[Math.floor(x/w*(d.length-1))]-128)/128 : Math.sin(x*.028+t*.8)*.05;
      const y=hh/2+v*hh*.42;
      x?g.lineTo(x,y):g.moveTo(x,y);
    }
    g.strokeStyle=accentRGBA(d?.85:.28); g.lineWidth=1.5; g.stroke();
    g.strokeStyle=accentRGBA(.10); g.lineWidth=1; g.beginPath(); g.moveTo(0,hh/2); g.lineTo(w,hh/2); g.stroke();
  });

  screen.querySelectorAll('.ectr').forEach(el=>{
    el.addEventListener('click',e=>{
      if(e.target.tagName==='INPUT') return;
      const k=el.dataset.tr;
      if(!SoundKit.ready()){ toast('此浏览器不支持实时声音'); return; }
      const on=SoundKit.toggle(k);
      el.classList.toggle('on',on); soundPill();
      if(!on && SoundKit.count()===0) toast('已安静');
    });
  });
  screen.querySelectorAll('input[data-vol]').forEach(r=>{
    r.addEventListener('input',()=>SoundKit.setVol(r.dataset.vol, r.value/100));
    r.addEventListener('click',e=>e.stopPropagation());
  });
  screen.querySelectorAll('[data-pre]').forEach(b=>b.addEventListener('click',()=>{
    applyPreset(b.dataset.pre); renderEcho(); toast('已换上「'+b.dataset.pre+'」');
  }));
  screen.querySelectorAll('[data-sleep]').forEach(c=>c.addEventListener('click',()=>{
    setSleep(+c.dataset.sleep); renderEcho();
  }));
  document.getElementById('ec-stop').onclick=()=>{ SoundKit.stopAll(); soundPill(); renderEcho(); toast('已安静'); };
  soundPill();
}
function applyPreset(name){
  const p=EC_PRESETS[name]; if(!p) return;
  SoundKit.stopAll();
  Object.keys(p).forEach(k=>{ SoundKit.setVol(k,p[k]); SoundKit.start(k); });
  soundPill();
}
function setSleep(min){
  clearTimeout(ECHO_SLEEP); ECHO_SLEEP=null; ECHO_SLEEP_MIN=min;
  if(min>0){ ECHO_SLEEP=setTimeout(()=>{ SoundKit.stopAll(); soundPill(); ECHO_SLEEP_MIN=0;
    if(document.getElementById('ec-grid')) renderEcho(); },min*60000); }
}

/* ===================== 心流 · 专注 ===================== */
let FLOW={min:25,left:25*60,run:false,id:null};
function flowLog(){ return lsGet('qn_flow_log',[]); }
function todayKey(d){ d=d||new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function renderFlow(){
  const log=flowLog(), today=todayKey();
  const tMin=log.filter(x=>x.d===today).reduce((a,b)=>a+b.m,0);
  let h=modHeader('flow','把一段时间圈起来，只做一件事');
  h+='<div class="flowring"><div class="fhalo"></div>'+
     '<svg width="212" height="212" viewBox="0 0 212 212">'+
       '<circle cx="106" cy="106" r="96" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="5"/>'+
       '<circle id="fl-arc" cx="106" cy="106" r="96" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" stroke-dasharray="603.2" stroke-dashoffset="0"/>'+
     '</svg>'+
     '<div class="fnum"><div><div class="ft" id="fl-t">--:--</div><div class="fs" id="fl-s">准备好了就开始</div></div></div></div>';
  h+='<div class="chips" style="justify-content:center">'+[15,25,45,60].map(m=>
      '<div class="chip'+(FLOW.min===m?' on':'')+'" data-fmin="'+m+'">'+m+' 分钟</div>').join('')+'</div>';
  h+='<div class="mrow"><div class="mbtn pri" id="fl-go">'+(FLOW.run?'暂停':'开始')+'</div><div class="mbtn" id="fl-rs">重来</div></div>';
  h+='<div class="mnote">要不要配一段声音？</div>';
  h+='<div class="mrow">'+Object.keys(EC_PRESETS).slice(0,4).map(p=>
      '<div class="mbtn sm" data-fpre="'+p+'">'+p+'</div>').join('')+'</div>';
  /* 心流专注 ← 画廊素材（联动在板块内部发生）：选一张自然景铺在背后 */
  const fbgNow=lsGet('qn_flow_bg',null);
  h+='<div class="mnote" style="margin-top:14px">或者，选一张自然景铺在背后</div>';
  h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px" id="fb-grid">'+MEDIA.flat().filter(x=>!x.pending).slice(0,9).map(it=>
      '<div data-fb="'+it.id+'" style="aspect-ratio:1;border-radius:10px;overflow:hidden;cursor:pointer;border:2px solid '+(fbgNow===it.file?'var(--accent)':'transparent')+'">'+
      (it.type==='video'?'<video src="'+it.file+'" muted preload="metadata" playsinline style="width:100%;height:100%;object-fit:cover"></video>':'<img src="'+it.file+'" loading="lazy" style="width:100%;height:100%;object-fit:cover">')+
      '</div>').join('')+'</div>';
  h+='<div class="mrow" style="margin-top:8px;justify-content:center"><div class="mbtn sm" id="fb-clear">清除背景</div></div>';
  h+='<div class="mstat"><div><b>'+tMin+'</b><span>今天 · 分钟</span></div>'+
     '<div><b>'+log.filter(x=>x.d===today).length+'</b><span>今天 · 段</span></div>'+
     '<div><b>'+log.reduce((a,b)=>a+b.m,0)+'</b><span>累计 · 分钟</span></div></div>';
  h+='<div class="mnote">时间到会有一记钵音。离开这一页计时也会继续走。</div>';
  screen.innerHTML=h;
  (function(){ const fbg=lsGet('qn_flow_bg',null); if(fbg){ screen.style.backgroundImage='linear-gradient(rgba(10,15,13,.74),rgba(10,15,13,.74)),url('+JSON.stringify(fbg)+')'; screen.style.backgroundSize='cover'; screen.style.backgroundPosition='center'; } })();
  flowPaint();
  screen.querySelectorAll('[data-fmin]').forEach(c=>c.addEventListener('click',()=>{
    if(FLOW.run){ toast('先暂停再换时长'); return; }
    FLOW.min=+c.dataset.fmin; FLOW.left=FLOW.min*60; renderFlow();
  }));
  screen.querySelectorAll('[data-fpre]').forEach(b=>b.addEventListener('click',()=>{
    applyPreset(b.dataset.fpre); toast('已配上「'+b.dataset.fpre+'」');
  }));
  document.getElementById('fl-go').onclick=flowToggle;
  document.getElementById('fl-rs').onclick=()=>{ flowStop(); FLOW.left=FLOW.min*60; renderFlow(); };
  screen.querySelectorAll('[data-fb]').forEach(c=>c.addEventListener('click',()=>{ const m=MEDIA.byId(c.dataset.fb); if(m){ lsSet('qn_flow_bg', m.file); renderFlow(); } }));
  const fbc=document.getElementById('fb-clear'); if(fbc) fbc.onclick=()=>{ lsSet('qn_flow_bg',null); renderFlow(); };
}
function flowPaint(){
  const t=document.getElementById('fl-t'), s=document.getElementById('fl-s'), a=document.getElementById('fl-arc');
  if(!t) return;
  const m=Math.floor(FLOW.left/60), sec=FLOW.left%60;
  t.textContent=String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
  s.textContent=FLOW.run?'正在专注':'准备好了就开始';
  if(a) a.setAttribute('stroke-dashoffset', (603.2*(1-FLOW.left/(FLOW.min*60))).toFixed(1));
}
function flowToggle(){ FLOW.run?flowStop():flowStart(); const b=document.getElementById('fl-go'); if(b) b.textContent=FLOW.run?'暂停':'开始'; flowPaint(); }
function flowStart(){
  if(FLOW.run) return; FLOW.run=true;
  FLOW.id=setInterval(()=>{
    FLOW.left--; flowPaint();
    if(FLOW.left<=0){
      flowStop();
      const log=flowLog(); log.push({d:todayKey(),m:FLOW.min}); lsSet('qn_flow_log',log.slice(-400));
      FLOW.left=FLOW.min*60;
      SoundKit.chime(); toast('这一段结束了 · 起身走走');
      if(document.getElementById('fl-t')) renderFlow();
    }
  },1000);
}
function flowStop(){ FLOW.run=false; clearInterval(FLOW.id); FLOW.id=null; }

/* ===================== 温柔回顾 ===================== */
function renderReview(){
  const log=flowLog(), moods=lsGet('qn_mood',{}), notes=lsGet('qn_notes',[]), days=lsGet('qn_days',[]);
  const last7=[]; const now=new Date();
  for(let i=6;i>=0;i--){ const d=new Date(now); d.setDate(d.getDate()-i);
    const k=todayKey(d); last7.push({k, lab:(d.getMonth()+1)+'/'+d.getDate(),
      m:log.filter(x=>x.d===k).reduce((a,b)=>a+b.m,0), mood:moods[k]||null}); }
  const max=Math.max(30,...last7.map(x=>x.m));
  const weekMin=last7.reduce((a,b)=>a+b.m,0);
  const checkin=last7.filter(x=>x.mood).length;
  let streak=0; for(let i=0;;i++){ const d=new Date(now); d.setDate(d.getDate()-i);
    if(days.indexOf(todayKey(d))>=0) streak++; else break; if(i>400) break; }
  let h=modHeader('review','这一周，你是怎么和自己相处的');
  h+='<div class="mstat"><div><b>'+weekMin+'</b><span>本周专注分钟</span></div>'+
     '<div><b>'+checkin+'</b><span>本周记录心境</span></div>'+
     '<div><b>'+streak+'</b><span>连续到访天</span></div></div>';
  h+='<div class="mcard"><div style="font-size:12px;color:var(--muted);margin-bottom:12px">近 7 天专注</div>'+
     '<div style="display:flex;align-items:flex-end;gap:7px;height:104px">';
  last7.forEach(x=>{
    const hh=Math.max(3,Math.round(x.m/max*88));
    h+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">'+
       '<div style="width:100%;height:'+hh+'px;border-radius:6px;background:'+(x.m?'linear-gradient(180deg,'+accentRGBA(.85)+','+accentRGBA(.28)+')':'rgba(255,255,255,.07)')+'"></div>'+
       '<span style="font-size:10px;color:var(--muted)">'+x.lab+'</span></div>';
  });
  h+='</div></div>';
  h+='<div class="mcard"><div style="font-size:12px;color:var(--muted);margin-bottom:10px">本周心境</div>';
  h+='<div style="display:flex;gap:7px">'+last7.map(x=>{
      const M=MOOD_SET.find(m=>m.k===x.mood);
      return '<div style="flex:1;text-align:center"><div style="height:34px;border-radius:9px;background:'+
        (M?M.c:'rgba(255,255,255,.06)')+';opacity:'+(M?.85:1)+'"></div>'+
        '<div style="font-size:10px;color:var(--muted);margin-top:5px">'+(M?M.t:'—')+'</div></div>'; }).join('')+'</div></div>';
  h+='<div class="mcard"><div class="mline"><span>手账条数</span><b>'+notes.length+'</b></div>'+
     '<div class="mline"><span>累计专注</span><b>'+log.reduce((a,b)=>a+b.m,0)+' 分钟</b></div>'+
     '<div class="mline"><span>到访天数</span><b>'+days.length+' 天</b></div></div>';
  h+='<div class="mnote">'+(weekMin>=120?'这一周你给了自己不少完整的时间。':
     weekMin>0?'有几段安静的时间，已经够了。':'这一周还没有专注记录——不必补，从现在开始就行。')+'</div>';
  screen.innerHTML=h;
}

/* ===================== 自动安静 ===================== */
function quietCfg(){ return lsGet('qn_quiet',{dim:0,auto:true,mute:false,motion:false}); }
function applyQuiet(){
  const q=quietCfg();
  let el=document.getElementById('dimlayer');
  if(!el){ el=document.createElement('div'); el.id='dimlayer';
    el.style.cssText='position:fixed;inset:0;background:#000;pointer-events:none;z-index:55;transition:opacity .8s;opacity:0;';
    document.body.appendChild(el); }
  let d=+q.dim||0;
  const hr=new Date().getHours();
  if(q.auto && (hr>=21||hr<6)) d=Math.max(d,.26);
  el.style.opacity=Math.min(d,.6);
  document.body.classList.toggle('lessmotion',!!q.motion);
  if(q.mute && (hr>=23||hr<6) && SoundKit.count()){ SoundKit.stopAll(); soundPill(); }
}
function renderQuiet(){
  const q=quietCfg(), hr=new Date().getHours();
  const nightNow=(hr>=21||hr<6);
  let h=modHeader('quiet','到了夜里，站点自己安静下来');
  h+='<div class="mscene" style="height:150px"><canvas id="q-cv"></canvas><div class="sccap">'+(nightNow?'此刻 · 夜':'此刻 · 白天')+'</div></div>';
  h+='<div class="mcard">'+
     '<div class="mline"><span>入夜自动调暗<br><small style="color:var(--muted);font-size:11px">21:00 后自动压低亮度</small></span><div class="msw'+(q.auto?' on':'')+'" data-q="auto"></div></div>'+
     '<div class="mline"><span>深夜自动静音<br><small style="color:var(--muted);font-size:11px">23:00 后停下所有声景</small></span><div class="msw'+(q.mute?' on':'')+'" data-q="mute"></div></div>'+
     '<div class="mline"><span>减少动效<br><small style="color:var(--muted);font-size:11px">关掉呼吸、浮动一类的动画</small></span><div class="msw'+(q.motion?' on':'')+'" data-q="motion"></div></div>'+
     '</div>';
  h+='<div class="mcard"><div class="mline" style="border:0"><span>常驻暗度</span><b id="q-dv">'+Math.round((q.dim||0)*100)+'%</b></div>'+
     '<input type="range" id="q-dim" min="0" max="55" value="'+Math.round((q.dim||0)*100)+'" style="width:100%;accent-color:var(--accent)"></div>';
  h+='<div class="mnote">调整时画面会立刻跟着变，看到合适为止。设置保存在本机。</div>';
  screen.innerHTML=h;
  scene(document.getElementById('q-cv'),(g,w,hh,t)=>{
    if(nightNow) paintNight(g,w,hh,t,{});
    else paintRidges(g,w,hh,t,{sky:['#cfe6e0','#a8cfc6','#7fae9f'],
      sun:{x:.72,y:.24,r:.5,c0:'rgba(255,252,235,.95)',c1:'rgba(255,238,190,.32)'},
      ridges:[{y:.72,a:.09,s:1.5,c:'#3c6154',d:.05},{y:.84,a:.07,s:2.3,c:'#24413a',d:.08},{y:.95,a:.05,s:3.1,c:'#132621',d:.12}]});
  });
  screen.querySelectorAll('[data-q]').forEach(sw=>sw.addEventListener('click',()=>{
    const c=quietCfg(); c[sw.dataset.q]=!c[sw.dataset.q]; lsSet('qn_quiet',c);
    sw.classList.toggle('on',c[sw.dataset.q]); applyQuiet();
  }));
  const dim=document.getElementById('q-dim');
  dim.addEventListener('input',()=>{ const c=quietCfg(); c.dim=dim.value/100; lsSet('qn_quiet',c);
    document.getElementById('q-dv').textContent=dim.value+'%'; applyQuiet(); });
}

/* ===================== 我的节气历 ===================== */
const TERMS=[
  ['小寒',5.4055,'雁北乡','鹊始巢','雉始雊'],   ['大寒',20.12,'鸡始乳','征鸟厉疾','水泽腹坚'],
  ['立春',3.87,'东风解冻','蛰虫始振','鱼陟负冰'], ['雨水',18.73,'獭祭鱼','候雁北','草木萌动'],
  ['惊蛰',5.63,'桃始华','仓庚鸣','鹰化为鸠'],   ['春分',20.646,'玄鸟至','雷乃发声','始电'],
  ['清明',4.81,'桐始华','田鼠化为鴽','虹始见'], ['谷雨',20.1,'萍始生','鸣鸠拂其羽','戴胜降于桑'],
  ['立夏',5.52,'蝼蝈鸣','蚯蚓出','王瓜生'],     ['小满',21.04,'苦菜秀','靡草死','麦秋至'],
  ['芒种',5.678,'螳螂生','鵙始鸣','反舌无声'],  ['夏至',21.37,'鹿角解','蜩始鸣','半夏生'],
  ['小暑',7.108,'温风至','蟋蟀居宇','鹰始挚'],  ['大暑',22.83,'腐草为萤','土润溽暑','大雨时行'],
  ['立秋',7.5,'凉风至','白露降','寒蝉鸣'],      ['处暑',23.13,'鹰乃祭鸟','天地始肃','禾乃登'],
  ['白露',7.646,'鸿雁来','玄鸟归','群鸟养羞'],  ['秋分',23.042,'雷始收声','蛰虫坯户','水始涸'],
  ['寒露',8.318,'鸿雁来宾','雀入大水为蛤','菊有黄华'], ['霜降',23.438,'豺乃祭兽','草木黄落','蛰虫咸俯'],
  ['立冬',7.438,'水始冰','地始冻','雉入大水为蜃'],     ['小雪',22.36,'虹藏不见','天气上升地气下降','闭塞而成冬'],
  ['大雪',7.18,'鹖鴠不鸣','虎始交','荔挺出'],   ['冬至',21.94,'蚯蚓结','麋角解','水泉动']
];
function termDay(y,i){ const c=TERMS[i][1], yy=y%100;
  return Math.floor(yy*.2422+c)-Math.floor((yy-1)/4); }
function termDate(y,i){ return new Date(y, Math.floor(i/2), termDay(y,i)); }
function currentTerm(now){
  now=now||new Date(); const y=now.getFullYear();
  let idx=-1, start=null;
  for(let i=23;i>=0;i--){ const d=termDate(y,i); if(now>=d){ idx=i; start=d; break; } }
  if(idx<0){ idx=23; start=termDate(y-1,23); }
  const nextI=(idx+1)%24, nextY=nextI===0?y+1:y;
  return {i:idx,start:start,next:TERMS[nextI][0],nextDate:termDate(nextY,nextI)};
}
const TERM_PAL=[
  {sky:['#0f2434','#17384a','#2b5566'],r:'#0a1a24'},   // 冬
  {sky:['#dfeee2','#b6dcc2','#7fbf9c'],r:'#2e5a45'},   // 春
  {sky:['#cdeaf2','#8fd0da','#4fa2b4'],r:'#1f5560'},   // 夏
  {sky:['#f3e0c4','#e0bd8f','#b98a5b'],r:'#5a3f26'}    // 秋
];
function renderSolar(){
  const now=new Date(), T=currentTerm(now), t=TERMS[T.i];
  const days=Math.floor((now-T.start)/86400000);
  const hou=Math.min(2,Math.floor(days/5));
  const left=Math.max(0,Math.ceil((T.nextDate-now)/86400000));
  const season=[0,1,1,1,2,2,2,3,3,3,0,0][now.getMonth()];  // 冬春夏秋 → TERM_PAL 下标
  const P=TERM_PAL[season];
  let h=modHeader('solar','今天落在哪一格时间里');
  h+='<div class="mscene tall"><canvas id="st-cv"></canvas><div class="sccap">'+
     (now.getMonth()+1)+' 月 '+now.getDate()+' 日</div></div>';
  h+='<div class="stnow"><div class="stn">'+t[0]+'</div><div class="std">第 '+(days+1)+' 天 · 距「'+T.next+'」还有 '+left+' 天</div></div>';
  h+='<div class="sthou">'+[0,1,2].map(i=>
     '<div style="animation-delay:'+(i*.09)+'s;'+(i===hou?'border-color:'+accentRGBA(.5)+';background:'+accentRGBA(.08):'')+'">'+
     '<i>'+['一候','二候','三候'][i]+'</i><p>'+t[2+i]+'</p></div>').join('')+'</div>';
  h+='<div class="strail">'+TERMS.map((x,i)=>'<span class="'+(i===T.i?'on':'')+'">'+x[0]+'</span>').join('')+'</div>';
  h+='<div class="mcard"><div class="mline"><span>本节气始于</span><b>'+(T.start.getMonth()+1)+' 月 '+T.start.getDate()+' 日</b></div>'+
     '<div class="mline"><span>下一个节气</span><b>'+T.next+' · '+(T.nextDate.getMonth()+1)+'/'+T.nextDate.getDate()+'</b></div>'+
     '<div class="mline"><span>今日物候</span><b>'+t[2+hou]+'</b></div></div>';
  h+='<div class="mnote">「候」是古人给时间划的最小刻度，五天一候，三候一节气。<br>今天正走在「'+t[2+hou]+'」这一候里。</div>';
  screen.innerHTML=h;
  scene(document.getElementById('st-cv'),(g,w,hh,tt)=>paintRidges(g,w,hh,tt,{
    sky:P.sky,
    sun:{x:.24,y:.26,r:.46,c0:'rgba(255,252,238,.9)',c1:'rgba(255,240,200,.22)'},
    ridges:[{y:.70,a:.10,s:1.4,c:P.r+'cc',d:.04},{y:.83,a:.08,s:2.2,c:P.r+'ee',d:.07},{y:.96,a:.05,s:3.4,c:P.r,d:.11}]
  }));
  const rail=screen.querySelector('.strail .on'); if(rail) rail.scrollIntoView({inline:'center',block:'nearest'});
}

/* ===================== 月相画廊 ===================== */
const SYN=29.530588853;
function moonAge(d){ const ref=Date.UTC(2000,0,6,18,14)/86400000;
  return ((d.getTime()/86400000-ref)%SYN+SYN)%SYN; }
function moonName(a){
  if(a<1.85) return '新月'; if(a<5.53) return '蛾眉月'; if(a<9.22) return '上弦月';
  if(a<12.91) return '盈凸月'; if(a<16.61) return '满月'; if(a<20.3) return '亏凸月';
  if(a<23.99) return '下弦月'; if(a<27.68) return '残月'; return '新月';
}
function drawMoon(g,cx,cy,r,phase){
  g.save(); g.beginPath(); g.arc(cx,cy,r,0,7); g.clip();
  g.fillStyle='#15181f'; g.fillRect(cx-r,cy-r,r*2,r*2);
  const lit='#FFF6DC', waxing=phase<.5;
  g.fillStyle=lit; g.beginPath(); g.arc(cx,cy,r,-Math.PI/2,Math.PI/2,!waxing); g.closePath(); g.fill();
  const k=Math.cos(2*Math.PI*phase);
  g.fillStyle = k>0 ? '#15181f' : lit;
  g.beginPath(); g.ellipse(cx,cy,r*Math.abs(k),r,0,0,7); g.fill();
  [[-.3,-.25,.19],[.22,.12,.15],[-.1,.36,.12],[.36,-.34,.09]].forEach(c=>{
    g.fillStyle='rgba(150,144,126,.20)'; g.beginPath(); g.arc(cx+c[0]*r,cy+c[1]*r,c[2]*r,0,7); g.fill(); });
  g.restore();
}
function renderMoon(){
  const now=new Date(), a=moonAge(now), ph=a/SYN, ill=(1-Math.cos(2*Math.PI*ph))/2;
  const toFull=((SYN/2-a)+SYN)%SYN, toNew=(SYN-a)%SYN;
  let h=modHeader('moon','今夜的月亮长这样');
  h+='<div class="mscene tall"><canvas id="mn-sky"></canvas><div class="sccap">'+moonName(a)+' · 照亮 '+Math.round(ill*100)+'%</div></div>';
  h+='<div class="mnbox"><canvas id="mn-cv" width="208" height="208"></canvas>'+
     '<div class="mnm"><b>'+moonName(a)+'</b><div>月龄 '+a.toFixed(1)+' 天<br>照亮 '+Math.round(ill*100)+'%<br>'+
     '距满月 '+Math.ceil(toFull)+' 天 · 距新月 '+Math.ceil(toNew)+' 天</div></div></div>';
  h+='<div class="mcard"><div style="font-size:12px;color:var(--muted);margin-bottom:11px">往后九夜</div>'+
     '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px">';
  for(let i=0;i<9;i++){ const d=new Date(now); d.setDate(d.getDate()+i);
    h+='<div style="flex:0 0 auto;text-align:center"><canvas class="mn9" data-ph="'+(moonAge(d)/SYN)+'" width="96" height="96" style="width:48px;height:48px"></canvas>'+
       '<div style="font-size:10px;color:var(--muted);margin-top:4px">'+(d.getMonth()+1)+'/'+d.getDate()+'</div></div>'; }
  h+='</div></div>';
  h+='<div class="mnote">月相由日期实时算出，不联网也准。<br>'+
     (ill>.92?'今夜近满月，出门抬头看看。':ill<.08?'今夜近新月，天最黑，星最亮。':
      ph<.5?'月亮正在变圆。':'月亮正在变瘦。')+'</div>';
  screen.innerHTML=h;
  scene(document.getElementById('mn-sky'),(g,w,hh,t)=>paintNight(g,w,hh,t,{mx:.74,my:.28}));
  const cv=document.getElementById('mn-cv');
  if(cv){ const g=cv.getContext('2d'); g.clearRect(0,0,208,208); drawMoon(g,104,104,96,ph); }
  screen.querySelectorAll('.mn9').forEach(c=>{ const g=c.getContext('2d'); drawMoon(g,48,48,44,+c.dataset.ph); });
}

/* ===================== 随机诗句 ===================== */
const VERSES=[
  {t:'行到水穷处，坐看云起时。',a:'王维'},        {t:'空山新雨后，天气晚来秋。',a:'王维'},
  {t:'人闲桂花落，夜静春山空。',a:'王维'},        {t:'松风吹解带，山月照弹琴。',a:'王维'},
  {t:'月出惊山鸟，时鸣春涧中。',a:'王维'},        {t:'白云回望合，青霭入看无。',a:'王维'},
  {t:'涧户寂无人，纷纷开且落。',a:'王维'},        {t:'野旷天低树，江清月近人。',a:'孟浩然'},
  {t:'荷风送香气，竹露滴清响。',a:'孟浩然'},      {t:'山中何所有，岭上多白云。',a:'陶弘景'},
  {t:'采菊东篱下，悠然见南山。',a:'陶渊明'},      {t:'久在樊笼里，复得返自然。',a:'陶渊明'},
  {t:'结庐在人境，而无车马喧。',a:'陶渊明'},      {t:'一蓑烟雨任平生。',a:'苏轼'},
  {t:'此心安处是吾乡。',a:'苏轼'},                {t:'惟江上之清风，与山间之明月。',a:'苏轼'},
  {t:'水流心不竞，云在意俱迟。',a:'杜甫'},        {t:'相看两不厌，只有敬亭山。',a:'李白'},
  {t:'掬水月在手，弄花香满衣。',a:'于良史'},      {t:'孤云将野鹤，岂向人间住。',a:'刘长卿'},
  {t:'万物静观皆自得，四时佳兴与人同。',a:'程颢'},{t:'落霞与孤鹜齐飞，秋水共长天一色。',a:'王勃'},
  {t:'清风明月本无价，近水远山皆有情。',a:'梁章钜'},{t:'返景入深林，复照青苔上。',a:'王维'},
  {t:'林深时见鹿，溪午不闻钟。',a:'李白'},        {t:'我见青山多妩媚，料青山见我应如是。',a:'辛弃疾'}
];
let VS_CUR=0;
function renderVerse(){
  VS_CUR=Math.floor(Math.random()*VERSES.length);
  paintVerse();
}
function paintVerse(){
  const v=VERSES[VS_CUR], keep=lsGet('qn_verse_keep',[]);
  const kept=keep.some(x=>x.t===v.t);
  let h=modHeader('verse','一句安静的话，落进心里');
  h+='<div class="vsbox"><canvas id="vs-ink"></canvas>'+
     '<div class="vst" id="vs-t"></div>'+
     '<div class="vsa">—— '+v.a+'</div>'+
     '<div class="vseal">自<br>然</div></div>';
  h+='<div class="mrow"><div class="mbtn pri" id="vs-next">换一句</div>'+
     '<div class="mbtn'+(kept?' on':'')+'" id="vs-keep">'+(kept?'已藏':'藏起这句')+'</div></div>';
  if(keep.length){
    h+='<div class="mnote" style="margin-top:16px">藏句 · '+keep.length+' 句</div><div class="vskeep">';
    keep.slice().reverse().forEach(x=>{
      h+='<div class="vk">'+esc(x.t)+'<small>'+esc(x.a)+' · '+x.at+
         ' <button class="link" data-drop="'+esc(x.t)+'">移出</button></small></div>'; });
    h+='</div>';
  }
  screen.innerHTML=h;
  /* 逐字浮墨 */
  const box=document.getElementById('vs-t');
  v.t.split('').forEach((c,i)=>{ const s=document.createElement('i');
    s.textContent=c; s.style.animationDelay=(i*0.075+0.1)+'s'; box.appendChild(s); });
  /* 随句生成的水墨底 —— 同一句永远是同一幅 */
  let seed=0; for(let i=0;i<v.t.length;i++) seed=(seed*31+v.t.charCodeAt(i))%99991;
  const rnd=()=>{ seed=(seed*1103515245+12345)%2147483648; return seed/2147483648; };
  const blobs=Array.from({length:7},()=>({x:rnd(),y:rnd(),r:.12+rnd()*.3,o:.05+rnd()*.1,s:.2+rnd()*.5}));
  scene(document.getElementById('vs-ink'),(g,w,hh,t)=>{
    g.clearRect(0,0,w,hh);
    blobs.forEach((b,i)=>{
      const cx=b.x*w+Math.sin(t*b.s+i)*7, cy=b.y*hh+Math.cos(t*b.s*.8+i)*5, r=b.r*w;
      const gr=g.createRadialGradient(cx,cy,0,cx,cy,r);
      gr.addColorStop(0,'rgba(255,255,255,'+b.o.toFixed(3)+')');
      gr.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=gr; g.beginPath(); g.arc(cx,cy,r,0,7); g.fill();
    });
  });
  document.getElementById('vs-next').onclick=()=>{
    let n; do{ n=Math.floor(Math.random()*VERSES.length); }while(n===VS_CUR&&VERSES.length>1);
    VS_CUR=n; modClear(); paintVerse();
  };
  document.getElementById('vs-keep').onclick=()=>{
    const k=lsGet('qn_verse_keep',[]);
    const i=k.findIndex(x=>x.t===v.t);
    if(i>=0){ k.splice(i,1); toast('已移出'); }
    else { k.push({t:v.t,a:v.a,at:todayKey()}); toast('已藏起'); }
    lsSet('qn_verse_keep',k); modClear(); paintVerse();
  };
  screen.querySelectorAll('[data-drop]').forEach(b=>b.addEventListener('click',()=>{
    const k=lsGet('qn_verse_keep',[]).filter(x=>x.t!==b.dataset.drop);
    lsSet('qn_verse_keep',k); toast('已移出'); modClear(); paintVerse();
  }));
}

/* ===================== 灵感手账 ===================== */
const NOTE_TAGS=['随手','想法','要做','读到','心事'];
function renderNotes(){
  const all=lsGet('qn_notes',[]), tag=lsGet('qn_note_tag','全部');
  const list=(tag==='全部'?all:all.filter(x=>x.tag===tag)).slice().reverse();
  let h=modHeader('notes','写下来就不用一直记着了');
  h+='<div class="mcard"><textarea class="inp" id="nt-in" placeholder="此刻想到的一句话…" maxlength="500"></textarea>'+
     '<div class="chips" id="nt-tags">'+NOTE_TAGS.map((t,i)=>
       '<div class="chip'+(i===0?' on':'')+'" data-nt="'+t+'">'+t+'</div>').join('')+'</div>'+
     '<div class="mrow"><div class="mbtn pri" id="nt-save">记下</div></div></div>';
  h+='<div class="chips" style="margin-top:16px">'+['全部'].concat(NOTE_TAGS).map(t=>
     '<div class="chip'+(tag===t?' on':'')+'" data-ntf="'+t+'">'+t+'</div>').join('')+'</div>';
  h+='<div style="margin-top:12px">';
  if(!list.length) h+='<div class="mempty">这里还空着。<br>随手写一句，哪怕只有两个字。</div>';
  list.forEach((n,i)=>{
    h+='<div class="ntcard" style="animation-delay:'+Math.min(i*.05,.4)+'s">'+
       '<div class="nth"><span>'+esc(n.tag)+'</span><span>'+esc(n.at)+
       ' · <button class="link" data-ndel="'+n.id+'">删除</button></span></div>'+
       '<div class="ntt">'+esc(n.text)+'</div></div>';
  });
  h+='</div>';
  h+='<div class="mnote">共 '+all.length+' 条 · 只存在这台设备上，没有上传。</div>';
  screen.innerHTML=h;
  let cur=NOTE_TAGS[0];
  screen.querySelectorAll('[data-nt]').forEach(c=>c.addEventListener('click',()=>{
    screen.querySelectorAll('[data-nt]').forEach(x=>x.classList.remove('on'));
    c.classList.add('on'); cur=c.dataset.nt; }));
  screen.querySelectorAll('[data-ntf]').forEach(c=>c.addEventListener('click',()=>{
    lsSet('qn_note_tag',c.dataset.ntf); modClear(); renderNotes(); }));
  document.getElementById('nt-save').onclick=()=>{
    const el=document.getElementById('nt-in'), t=(el.value||'').trim();
    if(!t){ toast('写点什么吧'); return; }
    const a=lsGet('qn_notes',[]);
    a.push({id:'n'+Date.now(),text:t,tag:cur,at:new Date().toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})});
    lsSet('qn_notes',a.slice(-600)); toast('已记下'); modClear(); renderNotes();
  };
  screen.querySelectorAll('[data-ndel]').forEach(b=>b.addEventListener('click',()=>{
    lsSet('qn_notes',lsGet('qn_notes',[]).filter(x=>x.id!==b.dataset.ndel));
    toast('已删除'); modClear(); renderNotes(); }));
}

/* ===================== 心境（每种心情一段专属小动画） ===================== */
const MOOD_SET=[
  {k:'calm',t:'静',c:'#9FE3BE',w:'今天挺平的，这样就很好。',d:(g,w,h,t)=>{
    g.clearRect(0,0,w,h);
    for(let i=0;i<3;i++){ const p=(t*.4+i/3)%1;
      g.strokeStyle='rgba(159,227,190,'+(1-p).toFixed(2)+')'; g.lineWidth=1.2;
      g.beginPath(); g.arc(w/2,h/2,p*w*.44+2,0,7); g.stroke(); } }},
  {k:'warm',t:'暖',c:'#FFD9A8',w:'有点被照到的感觉。',d:(g,w,h,t)=>{
    g.clearRect(0,0,w,h);
    const r=w*(.24+.05*Math.sin(t*1.5));
    const gr=g.createRadialGradient(w/2,h/2+Math.sin(t*1.1)*2,0,w/2,h/2,r*2.1);
    gr.addColorStop(0,'rgba(255,217,168,.95)'); gr.addColorStop(1,'rgba(255,217,168,0)');
    g.fillStyle=gr; g.beginPath(); g.arc(w/2,h/2,r*2.1,0,7); g.fill(); }},
  {k:'low',t:'沉',c:'#7E93B8',w:'沉一点没关系，它会过去。',d:(g,w,h,t)=>{
    g.clearRect(0,0,w,h);
    for(let i=0;i<3;i++){ const y=((t*.24+i/3)%1)*h;
      g.fillStyle='rgba(126,147,184,'+(.8-.65*(y/h)).toFixed(2)+')';
      g.beginPath(); g.arc(w/2,y,2.6,0,7); g.fill(); } }},
  {k:'bright',t:'亮',c:'#FFE9A0',w:'今天有件事让你亮了一下。',d:(g,w,h,t)=>{
    g.clearRect(0,0,w,h);
    g.strokeStyle='rgba(255,233,160,.85)'; g.lineWidth=1.1;
    for(let i=0;i<8;i++){ const a=i/8*6.283+t*.35, r0=w*.15, r1=w*(.27+.06*Math.sin(t*2+i));
      g.beginPath(); g.moveTo(w/2+Math.cos(a)*r0,h/2+Math.sin(a)*r0);
      g.lineTo(w/2+Math.cos(a)*r1,h/2+Math.sin(a)*r1); g.stroke(); }
    g.fillStyle='rgba(255,233,160,.92)'; g.beginPath(); g.arc(w/2,h/2,w*.1,0,7); g.fill(); }},
  {k:'rain',t:'雨',c:'#8FB6C9',w:'下点雨也好，正好待着不动。',d:(g,w,h,t)=>{
    g.clearRect(0,0,w,h);
    g.strokeStyle='rgba(143,182,201,.85)'; g.lineWidth=1.1;
    for(let i=0;i<6;i++){ const x=(i+.5)/6*w, y=((t*.95+i*.17)%1)*h;
      g.beginPath(); g.moveTo(x,y); g.lineTo(x-1.6,y+6); g.stroke(); } }}
];
function renderMood(){
  const all=lsGet('qn_mood',{}), today=todayKey(), cur=all[today]||null;
  const M=MOOD_SET.find(m=>m.k===cur);
  let h=modHeader('mood','今天是什么颜色的');
  h+='<div class="mdpick">'+MOOD_SET.map(m=>
     '<div class="mdc'+(cur===m.k?' on':'')+'" data-md="'+m.k+'"><canvas data-mdc="'+m.k+'" width="68" height="68"></canvas><span>'+m.t+'</span></div>').join('')+'</div>';
  h+='<div class="mnote" style="text-align:center;min-height:2.4em">'+(M?M.w:'选一个最接近的，不用很准。')+'</div>';
  /* 近 90 天 */
  const days=[]; const now=new Date();
  for(let i=89;i>=0;i--){ const d=new Date(now); d.setDate(d.getDate()-i);
    const k=todayKey(d); days.push({k,m:all[k]||null}); }
  h+='<div class="mcard"><div style="font-size:12px;color:var(--muted);margin-bottom:4px">近 90 天</div>'+
     '<div class="mdheat">'+days.map(d=>{
       const mm=MOOD_SET.find(x=>x.k===d.m);
       return '<i title="'+d.k+'" style="background:'+(mm?mm.c:'rgba(255,255,255,.055)')+';opacity:'+(mm?.82:1)+'"></i>'; }).join('')+'</div></div>';
  const counts=MOOD_SET.map(m=>({t:m.t,c:m.c,n:days.filter(d=>d.m===m.k).length}));
  h+='<div class="mcard">'+counts.map(c=>
     '<div class="mline"><span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:'+c.c+';margin-right:8px"></i>'+c.t+'</span><b>'+c.n+' 天</b></div>').join('')+'</div>';
  h+='<div class="mnote">签到只写在本机，不会传给任何人。同一天可以随时改。</div>';
  h+='<div class="mrow" style="margin-top:8px;justify-content:center"><div class="mbtn" id="m-scene">随机看一景</div></div>';
  screen.innerHTML=h;
  MOOD_SET.forEach(m=>{ const cv=screen.querySelector('[data-mdc="'+m.k+'"]'); scene(cv,m.d); });
  screen.querySelectorAll('[data-md]').forEach(c=>c.addEventListener('click',()=>{
    const a=lsGet('qn_mood',{}); const k=c.dataset.md;
    if(a[today]===k) delete a[today]; else a[today]=k;
    lsSet('qn_mood',a); SoundKit.tick(); modClear(); renderMood();
  }));
  const ms=document.getElementById('m-scene');
  if(ms) ms.onclick=()=>{ const pool=MEDIA.flat().filter(x=>!x.pending); if(pool.length) openImmerse(pool[Math.floor(Math.random()*pool.length)].id, ()=>openModule('mood')); };
}

/* ===================== 晨启夜收 ===================== */
const RITUAL={
  morning:{n:'晨启',s:['先别看手机 · 让眼睛慢慢醒过来',
    '深深吸一口气，把昨夜留在身体里的东西呼出去','想一件今天想完成的小事，就一件',
    '喝一杯水，慢一点喝','出门前抬头看一眼天，记住它今天的颜色']},
  night:{n:'夜收',s:['把灯调暗一点，光线先安静下来',
    '回想今天让你稍微松一口气的那个瞬间','把明天最要紧的一件事写下来，然后放下',
    '吸气四拍，呼气六拍，做三轮','对今天说一声：辛苦了']}
};
let RT={mode:'morning',step:0,auto:false};
function renderMorningNight(){
  const hr=new Date().getHours();
  if(RT.step===0) RT.mode=(hr>=5&&hr<12)?'morning':'night';
  const R=RITUAL[RT.mode], last=RT.step>=R.s.length-1;
  let h=modHeader('morningnight','一天的两头，各留一分钟给自己');
  h+='<div class="mscene tall"><canvas id="rt-cv"></canvas><div class="sccap">'+R.n+' · 第 '+(RT.step+1)+' / '+R.s.length+' 步</div></div>';
  h+='<div class="chips" style="justify-content:center;margin-top:14px">'+
     ['morning','night'].map(m=>'<div class="chip'+(RT.mode===m?' on':'')+'" data-rt="'+m+'">'+RITUAL[m].n+'</div>').join('')+'</div>';
  h+='<div class="rtstep" id="rt-s">'+R.s[RT.step]+'</div>';
  h+='<div class="rtdots">'+R.s.map((x,i)=>'<i class="'+(i<=RT.step?'on':'')+'"></i>').join('')+'</div>';
  h+='<div class="mrow"><div class="mbtn pri" id="rt-next">'+(last?'完成':'下一步')+'</div>'+
     '<div class="mbtn'+(RT.auto?' on':'')+'" id="rt-auto">自动 · 每 14 秒</div></div>';
  h+='<div class="mnote">'+(RT.mode==='morning'
     ?'早上不必立刻高效，先让身体跟上来。'
     :'晚上的重点不是总结，是把今天放下。')+'</div>';
  screen.innerHTML=h;
  const morning=RT.mode==='morning';
  scene(document.getElementById('rt-cv'),(g,w,hh,t)=>{
    if(morning) paintRidges(g,w,hh,t,{
      sky:['#22344a','#7c6a72','#e0a077','#f6cf9c'],
      sun:{x:.5,y:.66,r:.55,c0:'rgba(255,246,214,.98)',c1:'rgba(255,196,120,.36)'},
      ridges:[{y:.76,a:.09,s:1.3,c:'#4a3b3f',d:.03},{y:.88,a:.07,s:2.1,c:'#2a2226',d:.06},{y:.99,a:.05,s:3.2,c:'#140f12',d:.1}]});
    else paintNight(g,w,hh,t,{top:'#050a1c',mid:'#08122a',bot:'#03060c',mx:.24,my:.24});
  });
  screen.querySelectorAll('[data-rt]').forEach(c=>c.addEventListener('click',()=>{
    RT.mode=c.dataset.rt; RT.step=0; modClear(); renderMorningNight(); }));
  document.getElementById('rt-next').onclick=rtNext;
  document.getElementById('rt-auto').onclick=()=>{ RT.auto=!RT.auto; modClear(); renderMorningNight(); };
  if(RT.auto && !last) modWait(rtNext,14000);
}
function rtNext(){
  const R=RITUAL[RT.mode];
  if(RT.step>=R.s.length-1){ RT.step=0; RT.auto=false; SoundKit.chime(); toast('这一分钟结束了'); }
  else { RT.step++; SoundKit.tick(); }
  modClear(); renderMorningNight();
}

/* ===================== 身体扫描（修好语音，且语音只是加分项） ===================== */
const BODY_STEPS=[
  {p:'双脚',y:216,t:'把注意力放到双脚 · 感觉它们贴着地面的重量'},
  {p:'小腿',y:190,t:'往上一点，小腿 · 如果它是紧的，就让它松下来'},
  {p:'大腿',y:158,t:'大腿和膝盖 · 不用做什么，只是知道它们在那里'},
  {p:'腹部',y:126,t:'腹部 · 让呼吸把它轻轻顶起来，再落下去'},
  {p:'胸口',y:100,t:'胸口 · 感觉空气进来时那一点点凉'},
  {p:'双手',y:96 ,t:'两只手 · 手指、手心，让它们完全放开'},
  {p:'肩颈',y:62 ,t:'肩膀和脖子 · 大多数紧张都堆在这里，让它掉下去'},
  {p:'面部',y:32 ,t:'脸 · 眉心、下巴、舌根，一处一处松开'},
  {p:'头顶',y:10 ,t:'到头顶了 · 现在整个身体都是松的，就这样待一会儿'}
];
let BS={i:0,run:false,timer:null};
function renderBodyScan(){
  const A=accentRGB();
  let h=modHeader('body','从脚到头，一处一处松下来');
  h+='<div class="bdfig"><svg viewBox="0 0 120 240" preserveAspectRatio="xMidYMid meet">'+
     '<defs><clipPath id="bdclip">'+
       '<circle cx="60" cy="26" r="16"/>'+
       '<rect x="41" y="43" width="38" height="76" rx="17"/>'+
       '<rect x="21" y="52" width="15" height="66" rx="7.5" transform="rotate(9 28 85)"/>'+
       '<rect x="84" y="52" width="15" height="66" rx="7.5" transform="rotate(-9 91 85)"/>'+
       '<rect x="43" y="115" width="15" height="106" rx="7.5"/>'+
       '<rect x="62" y="115" width="15" height="106" rx="7.5"/>'+
     '</clipPath>'+
     '<linearGradient id="bdband" x1="0" y1="0" x2="0" y2="1">'+
       '<stop offset="0%" stop-color="rgb('+A+')" stop-opacity="0"/>'+
       '<stop offset="50%" stop-color="rgb('+A+')" stop-opacity="0.95"/>'+
       '<stop offset="100%" stop-color="rgb('+A+')" stop-opacity="0"/>'+
     '</linearGradient></defs>'+
     '<g clip-path="url(#bdclip)">'+
       '<rect x="0" y="0" width="120" height="240" fill="rgba(255,255,255,.075)"/>'+
       '<rect id="bd-band" x="0" y="-26" width="120" height="52" fill="url(#bdband)" style="transition:transform 1.2s cubic-bezier(.4,0,.2,1)"/>'+
     '</g></svg></div>';
  h+='<div class="bdbar"><i id="bd-p" style="width:0%"></i></div>';
  h+='<div class="bdtext" id="bd-t">准备好了就开始 · 找个不用使劲的姿势</div>';
  h+='<div class="mrow"><div class="mbtn pri" id="bd-go">'+(BS.run?'暂停':'开始')+'</div>'+
     '<div class="mbtn" id="bd-rs">重来</div></div>';
  h+='<div class="mnote">每一步大约 16 秒，会有一记轻音提示换位置。<br>'+
     '声音打不开也不影响——画面上的这行字就是完整指引。</div>';
  screen.innerHTML=h;
  bdPaint();
  document.getElementById('bd-go').onclick=()=>{ BS.run?bdStop():bdStart(); };
  document.getElementById('bd-rs').onclick=()=>{ bdStop(); BS.i=0; modClear(); renderBodyScan(); };
  if(BS.run) bdSchedule();
}
function bdPaint(){
  const s=BODY_STEPS[BS.i], band=document.getElementById('bd-band'),
        tx=document.getElementById('bd-t'), pb=document.getElementById('bd-p');
  if(!band) return;
  if(BS.run||BS.i>0){ band.style.transform='translateY('+s.y+'px)'; tx.textContent=s.t; }
  if(pb) pb.style.width=Math.round((BS.i+(BS.run?1:0))/BODY_STEPS.length*100)+'%';
}
function bdStart(){
  BS.run=true; const b=document.getElementById('bd-go'); if(b) b.textContent='暂停';
  bdSay(); bdPaint(); bdSchedule();
}
/* 用独立计时器，避免 modClear 顺手把刚开口的语音打断 */
function bdSchedule(){ clearTimeout(BS.timer); BS.timer=setTimeout(()=>{
  if(!BS.run) return;
  if(BS.i>=BODY_STEPS.length-1){ bdStop(); BS.i=0; SoundKit.chime();
    const t=document.getElementById('bd-t'); if(t) t.textContent='结束了 · 慢慢睁开眼睛';
    return; }
  BS.i++; bdSay(); bdPaint(); bdSchedule();
},16000); }
function bdStop(){ BS.run=false; Voice.stop(); clearTimeout(BS.timer); BS.timer=null;
  const b=document.getElementById('bd-go'); if(b) b.textContent='开始'; }
function bdSay(){ Voice.say(BODY_STEPS[BS.i].t.replace(/ · /g,'，')); }

/* ===================== 折纸冥想 · 折一只纸盒 ===================== */
const ORI_STEPS=[
  '一张方纸 · 什么都还没有发生',
  '先压出四道折痕 · 让纸记住该弯的地方',
  '把前后两壁立起来',
  '再把左右两壁立起来',
  '四角向内收 · 纸开始互相扣住',
  '成了 · 一只可以放东西的纸盒'
];
let ORI={s:0,auto:false,inh:true};
function renderFold(){
  if(window._qn3dKill) window._qn3dKill();
  const st = lsGet('qn_fold', { step:0, sessions:0 });
  const sub='跟着六步，折一只小纸盒。每折一步，跟着圆，慢慢呼吸。';
  const steps=['平铺方纸','折起第一面','第二面立起','第三面立起','第四面立起','合拢收口','盒子折好了'];
  screen.innerHTML = modHeader('fold', sub)
    + '<canvas id="fld-canvas" class="qn3d-canvas"></canvas>'
    + '<div class="fld-row"><button class="mod-btn ghost" id="fld-prev">上一步</button>'
    + '<span id="fld-step" class="fld-step">'+steps[0]+'</span>'
    + '<button class="mod-btn ghost" id="fld-next">下一步</button></div>'
    + '<div class="fld-hint">吸气时纸向上立起，呼气时缓缓收拢 · 第 <b id="fld-n">0</b>/6 步</div>';
  const cv=screen.querySelector('#fld-canvas');
  let api=null;
  if(window.QNModules && cv){
    api=QNModules.makeFold(cv, { step: st.step||0 });
    window._qn3dEngines.push(api.engine);
    SCENE_STOPS.push(function(){ api.engine.destroy(); });
  }
  function paint(){ const n=api?api.step():0; st.step=n; lsSet('qn_fold', st); const sn=screen.querySelector('#fld-step'); if(sn)sn.textContent=steps[n]; const nn=screen.querySelector('#fld-n'); if(nn)nn.textContent=n; }
  const bn=screen.querySelector('#fld-next'); if(bn) bn.onclick=function(){ api&&api.next(); paint(); if(api&&api.step()>=6){ st.sessions=(st.sessions||0)+1; lsSet('qn_fold', st); toast('一只小纸盒折好了 ✦'); } };
  const bp=screen.querySelector('#fld-prev'); if(bp) bp.onclick=function(){ api&&api.prev(); paint(); };
  paint();
}
function oriApply(){
  const w=document.getElementById('ori'); if(!w) return;
  const s=ORI.s;
  w.classList.toggle('creased',s>=1);
  w.classList.toggle('done',s>=5);
  const N=document.getElementById('ow-n'), S=document.getElementById('ow-s'),
        W=document.getElementById('ow-w'), E=document.getElementById('ow-e');
  N.style.transform = s>=2?'rotateX(-90deg)':'none';
  S.style.transform = s>=2?'rotateX(90deg)':'none';
  W.style.transform = s>=3?'rotateY(90deg)':'none';
  E.style.transform = s>=3?'rotateY(-90deg)':'none';
  document.querySelectorAll('.ocn.l').forEach(c=>c.style.transform = s>=4?'rotateY(-90deg)':'none');
  document.querySelectorAll('.ocn.r').forEach(c=>c.style.transform = s>=4?'rotateY(90deg)':'none');
  w.style.transform = s>=5?'':'rotateX(59deg) rotateZ(-16deg)';
}
function oriSync(){
  const t=document.getElementById('ori-t'); if(t) t.textContent=ORI_STEPS[ORI.s];
  document.querySelectorAll('.oristeps i').forEach((el,i)=>el.classList.toggle('on',i<=ORI.s));
  if(ORI.s>=ORI_STEPS.length-1) SoundKit.chime();
}

/* 分发：私域模块 */

/* ===== 移植模块 garden/stone/growth/capsule/ritual（来自 calm-nature 原站） ===== */
/* =====================================================================
   _port_adapted.js —— 旧站（calm-nature）5 个模块移植到框架版（calm-nature-framework）
   来源：C:/Users/ZeroEnt/WorkBuddy/2026-07-26-21-47-36/calm-nature/index.html
   目标 API：modHeader / lsGet / lsSet / toast / SoundKit / scene / modClear /
            modBack / MOD_TICKS / modTick / modWait / todayKey / SCENE_STOPS
   说明：本文件只提供适配后的源码，不修改框架 index.html。
        使用时在框架 <\/script> 之后追加 <script src="./_port_adapted.js"><\/script>，
        并把 5 个函数登记进 MODULE_RENDER（见文件末尾注释）。
   ===================================================================== */

/* ===== 小工具（原站依赖，框架里没有同名实现） ===== */
/* 原站 3289 行，原样搬入（框架自带的是 esc()，此处保留原名避免改动模块正文） */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])); }

/* 原站 getIcon(name) 依赖整份 ICONS 图标库；这里只摘出被移植模块真正用到的两枚，
   并改名 qnIcon 以免与外部脚本的 getIcon 撞名。 */
const QN_ICONS = {
  bubble:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="10" r="4"/><circle cx="16" cy="15" r="3"/><path d="M14.5 6.5a2 2 0 110 4"/></svg>`,
  hourglass:`<svg class="i-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12M7 3c.5 6 9.5 6 10 9-1 3-9.5 3-10 9"/></svg>`
};
function qnIcon(name){ return QN_ICONS[name] || ""; }

/* ===== QNStore（renamed from original Sanctuary） ===== */
/* 原站 3059-3125 行的 Sanctuary，整体改名 QNStore：
   ① 新存储键 qn_store（框架版全新数据位，避免与原站/框架 Store 混淆）；
   ② todayKey() 委托给框架全局 todayKey()；
   ③ load/save/成长值累计逻辑一字不改地保留。 */
const QN_STORE_KEY = "qn_store";
const QNStore = {
  store:null,
  load(){
    try{ this.store = JSON.parse(localStorage.getItem(QN_STORE_KEY)||"null"); }catch(e){ this.store=null; }
    // 迁移：老站点旧 key 的数据合并进来，防止"丢失"（只读旧 key，写回一律用 qn_store）
    if(!this.store || typeof this.store!=="object" || !Object.keys(this.store).length){
      ["quiet-nature-data","quiet-nature-guest","quiet-nature-sanctuary"].some(function(k){
        try{ var v=JSON.parse(localStorage.getItem(k)||"null"); if(v&&typeof v==="object"&&Object.keys(v).length){ this.store=v; this.save(); return true; } }catch(e){} return false;
      }, this);
    }

    if(!this.store || typeof this.store!=="object") this.store = {moods:{},journal:[],favorites:[],solar:{}};

    if(!this.store.moods) this.store.moods = {};
    if(!this.store.journal) this.store.journal = [];
    if(!this.store.quotes) this.store.quotes = [];
    if(!this.store.favorites) this.store.favorites = [];
    if(!this.store.solar) this.store.solar = {};
    if(!this.store.echo) this.store.echo = [];
    if(!this.store.echoLast) this.store.echoLast = null;
    if(!this.store.wall) this.store.wall = [];
    if(!this.store.collages) this.store.collages = [];
    if(!this.store.playlists) this.store.playlists = [];
    if(!this.store.notes) this.store.notes = [];
    if(!this.store.capsules) this.store.capsules = [];
    if(!this.store.folds) this.store.folds = [];
    if(!this.store.rituals) this.store.rituals = [];
    if(!this.store.bonds) this.store.bonds = [];
    if(!this.store.readerNotes) this.store.readerNotes = {};
    if(!this.store.stone) this.store.stone = {date:"", text:"", done:false};
    if(!this.store.body) this.store.body = {sessions:0, last:0};
    if(!this.store.quiet) this.store.quiet = {auto:false};
    if(!this.store.bottle) this.store.bottle = {sent:[]};
    if(!this.store.settings) this.store.settings = {};

    // 成长轨迹：累计成长值（不再实时重算，改为按活动增量累计，石子也可累计）
    if(!this.store.growth) this.store.growth = {species:"pine", total:0, forest:[], base:{moods:0,journal:0,capsules:0,notes:0,stone:0}};
    if(!this.store.growth.base) this.store.growth.base = {moods:0,journal:0,capsules:0,notes:0,stone:0};
    if(!this.store.growth.forest) this.store.growth.forest = [];
    try{
      const g=this.store.growth, b=g.base;
      const cm=Object.keys(this.store.moods||{}).length;
      const cj=(this.store.journal||[]).length;
      const cc=(this.store.capsules||[]).length;
      const cn=(this.store.notes||[]).length;
      const cs=(this.store.stone && this.store.stone.done) ? 1 : 0;
      g.total = Math.max(0, g.total + (cm-b.moods)+(cj-b.journal)+(cc-b.capsules)+(cn-b.notes)+(cs-b.stone));
      b.moods=cm; b.journal=cj; b.capsules=cc; b.notes=cn; b.stone=cs;
    }catch(e){}

    return this.store;
  },
  save(){ try{ localStorage.setItem(QN_STORE_KEY, JSON.stringify(this.store)); }catch(e){} },
  /* 原站自带的 todayKey 换成框架全局实现 */
  todayKey(){
    if(typeof window!=="undefined" && typeof window.todayKey==="function") return window.todayKey();
    const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  }
};

/* ===== renderGarden ===== */
/* 原站 4624-4659。适配：c → screen + modHeader('garden')；flashToast → toast；
   setInterval → modTick（仍保留手动 clearInterval）；
   原站 #gd-cv 是给 3D 版 startGarden 用的 div，框架里没有 garden3d.js，
   降级分支里补一张 canvas 交给 NatureCanvas("garden") 画。 */
function renderGarden(){
  if(window._qn3dKill) window._qn3dKill();
  const DEF_MIN = 15;
  const st = lsGet('qn_garden', {sessions:0, minutes:0, today:'', todayMin:0});
  if(st.today !== todayKey()){ st.today = todayKey(); st.todayMin = 0; }
  const who = (typeof ME !== 'undefined' && ME && ME.name) ? ME.name : '';
  const fmt = (ms)=>{ ms=Math.max(0,ms|0); const m=Math.floor(ms/60000), s=Math.floor((ms%60000)/1000); return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); };
  screen.innerHTML = modHeader('garden','坐下来，让一株莲花陪你专注。倒计时走完，它会完全绽放。')
    + '<canvas id="g-canvas" class="qn3d-canvas"></canvas>'
    + '<div class="g3-hint">拖拽环顾花园 · 滚轮缩放</div>'
    + '<div class="g3-clock"><span id="g3-time">'+fmt(DEF_MIN*60000)+'</span><small id="g3-state">等待开始</small></div>'
    + '<div class="g3-bar"><i id="g3-fill"></i></div>'
    + '<div class="g3-row"><button class="mod-btn" id="g3-start">开始 '+DEF_MIN+' 分钟专注</button>'
    + '<button class="mod-btn ghost" id="g3-add">+5 分钟</button><button class="mod-btn-2" id="g3-reset">重置</button></div>'
    + '<div class="g3-stat"><div><b id="g3-sess">'+(st.sessions||0)+'</b>次专注</div>'
    + '<div><b id="g3-min">'+(st.minutes||0)+'</b>累计分钟</div><div><b id="g3-today">'+(st.todayMin||0)+'</b>今日分钟</div>'
    + '<div><b id="g3-bloom">0%</b>绽放</div></div>';
  const $ = (id)=> screen.querySelector('#'+id);
  const cv = $('g-canvas');
  let api=null;
  if(window.QNModules && cv){
    api = QNModules.makeGarden(cv, { totalMs: DEF_MIN*60000, flowers: (st.sessions||0), onComplete: function(){
      const mins = DEF_MIN;
      st.sessions=(st.sessions||0)+1; st.minutes=(st.minutes||0)+mins; st.today=todayKey(); st.todayMin=(st.todayMin||0)+mins;
      lsSet('qn_garden', st);
      try{ if(typeof SoundKit!=='undefined' && SoundKit.chime) SoundKit.chime(); }catch(e){}
      toast(who ? (who+'，'+mins+' 分钟专注完成 ✦ 一朵花开了') : (mins+' 分钟专注完成 ✦ 一朵花开了'));
      if(api && api.addFlower) api.addFlower(); paint();
    }});
    window._qn3dEngines.push(api.engine);
    SCENE_STOPS.push(function(){ api.engine.destroy(); });
  }
  function paint(){
    const p = api? api.progress() : 0, left = api? api.timeLeft() : DEF_MIN*60000, running = api? api.isRunning() : false;
    const t1=$('g3-time'); if(t1) t1.textContent=fmt(left);
    const s1=$('g3-state'); if(s1) s1.textContent = running?'专注中':(left<=0?'已绽放':(left<DEF_MIN*60000?'已暂停':'等待开始'));
    const f1=$('g3-fill'); if(f1) f1.style.width=(p*100).toFixed(1)+'%';
    const b1=$('g3-start'); if(b1) b1.textContent = running?'暂停':(left<=0?'再来一次':(left<DEF_MIN*60000?'继续专注':'开始 '+DEF_MIN+' 分钟专注'));
    const b2=$('g3-bloom'); if(b2) b2.textContent=Math.round(p*100)+'%';
    const c1=$('g3-sess'); if(c1)c1.textContent=st.sessions||0; const c2=$('g3-min'); if(c2)c2.textContent=st.minutes||0; const c3=$('g3-today'); if(c3)c3.textContent=st.todayMin||0;
  }
  const bs=$('g3-start'); if(bs) bs.onclick=function(){
    if(api.isRunning()){ api.pause(); toast('已暂停，随时可以继续'); }
    else { if(api.timeLeft()<=0) api.reset(); api.start(); toast('开始专注，陪这朵花慢慢开'); }
    paint();
  };
  const ba=$('g3-add'); if(ba) ba.onclick=function(){ api.add5(); toast('又加了 5 分钟'); paint(); };
  const br=$('g3-reset'); if(br) br.onclick=function(){ api.reset(); toast('已重置'); paint(); };
  if(api){ modTick(function(){ api.tick(); paint(); }, 400); }
  paint();
}

/* ===== renderStone ===== */
/* 原站 5056-5087。适配：c → screen + modHeader('stone')；flashToast → toast；
   Sanctuary → QNStore；NatureCanvas("pebble") 保留，_stoneStop 手动回收也保留。 */
let _stoneStop=null;
function renderStone(){
  if(window._qn3dKill) window._qn3dKill();
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  const today = todayKey();
  let st = lsGet('qn_stone_'+today, null);
  if(!st || !Array.isArray(st.items)){ st={date:today, items:[]}; lsSet('qn_stone_'+today, st); }
  screen.innerHTML = modHeader('stone', '写今天想放下的小事，一枚枚小石子落进静水，会自己沉、自己漂上岸。')
    + '<div class="st-stage"><canvas id="st-canvas" class="qn3d-canvas"></canvas><div class="st-tip">拖拽环视 · 滚轮缩放 · 可放很多枚</div></div>'
    + '<div class="st-panel" id="st-panel"></div>';
  const cv = screen.querySelector('#st-canvas');
  let api=null;
  if(window.QNModules && cv){
    api = QNModules.makeStone(cv, {});
    window._qn3dEngines.push(api.engine);
    SCENE_STOPS.push(function(){ api.engine.destroy(); });
    // 恢复今日已放下的：逐枚重新落入（视觉）
    var seedN = st.items.length;
    for(var si=0; si<seedN; si++){ (function(d){ setTimeout(function(){ if(api) api.addStone(); }, 250 + d*420); })(si); }
  }
  const panel = screen.querySelector('#st-panel');
  function paint(){
    let h='';
    h+='<input class="st-input" id="st-in" maxlength="40" placeholder="写一件今天想放下的小事…" />';
    h+='<div class="st-row"><div class="st-btn primary" id="st-put">放 下</div>'+(st.items.length?'<div class="st-btn" id="st-reset">清空今日</div>':'')+'</div>';
    if(st.items.length){
      h+='<div class="st-list">';
      st.items.slice().reverse().forEach(function(it){ h+='<div class="st-chip">'+esc(it.text)+'</div>'; });
      h+='</div>';
      h+='<div class="st-status"><span class="dot"></span>今日已放下 '+st.items.length+' 枚，静静泊在岸边</div>';
    } else {
      h+='<div class="st-status"><span class="dot"></span>还没放下</div>';
    }
    panel.innerHTML=h;
    const put=screen.querySelector('#st-put');
    if(put) put.onclick=function(){
      const inp=screen.querySelector('#st-in'); const v=(inp.value||'').trim();
      if(!v){ toast('先写一句吧'); return; }
      st.items.push({text:v}); lsSet('qn_stone_'+today, st);
      if(api) api.addStone(); uTrack('stone_drop');
      inp.value=''; toast('石子落进水里了');
      paint();
    };
    const inp2=screen.querySelector('#st-in'); if(inp2) inp2.addEventListener('keydown',function(e){ if(e.key==='Enter' && put) put.click(); });
    const rs=screen.querySelector('#st-reset');
    if(rs) rs.onclick=function(){ st={date:today,items:[]}; lsSet('qn_stone_'+today, st); if(api) api.reset(); paint(); };
  }
  paint();
}

/* ===== renderGrowth ===== */
/* 原站 5118-5239（GROWTH_MAX / SPECIES / seasonNow / SEASON_NAME / seasonPalette /
   buildCrown / buildTree 一并搬入）。适配：c → screen + modHeader('growth')；
   flashToast → toast；renderGrowth(c) 自递归 → renderGrowth()。 */
const GROWTH_MAX = 1000;
const SPECIES = {
  pine:    {name:"松",   crown:"pine"},
  cypress: {name:"柏",   crown:"cypress"},
  willow:  {name:"柳",   crown:"willow"},
  maple:   {name:"枫",   crown:"maple"},
  plane:   {name:"梧桐", crown:"maple"},
  ginkgo:  {name:"银杏", crown:"ginkgo"},
  peach:   {name:"桃",   crown:"peach"},
  cherry:  {name:"樱",   crown:"peach"}
};
function seasonNow(){
  const m=new Date().getMonth()+1;
  if(m>=3&&m<=5) return "spring";
  if(m>=6&&m<=8) return "summer";
  if(m>=9&&m<=11) return "autumn";
  return "winter";
}
const SEASON_NAME = {spring:"春", summer:"夏", autumn:"秋", winter:"冬"};
function seasonPalette(season){
  switch(season){
    case "spring": return {crown:"#8fc98a", accent:"#bfe0a8", flower:"#f7c6d6", snow:null};
    case "summer": return {crown:"#3f8f5e", accent:"#5fb87e", flower:null, snow:null};
    case "autumn": return {crown:"#d98a2b", accent:"#e7b34e", flower:null, snow:null};
    default:       return {crown:"#7a6a52", accent:"#9a8a6e", flower:null, snow:"#eef3f7"};
  }
}
function buildCrown(type, pal, r){
  const k = 0.55 + 0.45*r;
  if(type==="pine"){
    const t=(dy,w,y)=>`<path d="M12 ${y} L${(12-w).toFixed(1)} ${(y+dy).toFixed(1)} L${(12+w).toFixed(1)} ${(y+dy).toFixed(1)} Z" fill="${pal.crown}"/>`;
    return t(5, 4.6*k, 6) + t(4.4, 3.4*k, 9.2) + t(3.8, 2.3*k, 12.2);
  }
  if(type==="cypress"){
    const h = 15*k;
    return `<path d="M12 27 V${(27-h).toFixed(1)}" stroke="#6b5640" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M12 ${(27-h).toFixed(1)} q -3.2 ${(h*0.5).toFixed(1)} 0 ${h.toFixed(1)} q 3.2 ${(-h*0.5).toFixed(1)} 0 ${(-h).toFixed(1)} Z" fill="${pal.crown}"/>`;
  }
  if(type==="willow"){
    let s=`<circle cx="12" cy="10" r="${(5*k).toFixed(1)}" fill="${pal.crown}"/>`;
    for(let i=-2;i<=2;i++){ s+=`<path d="M${(12+i*2).toFixed(1)} 10 q ${(i*0.6).toFixed(1)} 6 ${(i*0.3).toFixed(1)} 9" stroke="${pal.accent}" stroke-width="0.8" fill="none" opacity="0.75"/>`; }
    return s;
  }
  if(type==="maple" || type==="ginkgo"){
    const rr=4.2*k;
    let s=`<circle cx="12" cy="10" r="${rr.toFixed(1)}" fill="${pal.crown}"/>`;
    s+=`<circle cx="${(12-rr*0.7).toFixed(1)}" cy="${(10+rr*0.5).toFixed(1)}" r="${(rr*0.7).toFixed(1)}" fill="${pal.crown}"/>`;
    s+=`<circle cx="${(12+rr*0.7).toFixed(1)}" cy="${(10+rr*0.5).toFixed(1)}" r="${(rr*0.7).toFixed(1)}" fill="${pal.crown}"/>`;
    if(type==="ginkgo"){ s+=`<path d="M12 ${(10-rr).toFixed(1)} q -5 2 -4 5 q 4 1 8 0 q 1 -3 -4 -5 Z" fill="${pal.accent}" opacity="0.7"/>`; }
    return s;
  }
  if(type==="peach"){
    let s=`<circle cx="12" cy="10" r="${(4.4*k).toFixed(1)}" fill="${pal.crown}"/>`;
    if(pal.flower){ for(let i=0;i<6;i++){ const a=i/6*6.283; const x=12+Math.cos(a)*3*k, y=10+Math.sin(a)*2.4*k; s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1" fill="${pal.flower}"/>`; } }
    return s;
  }
  return `<circle cx="12" cy="10" r="${(4.5*k).toFixed(1)}" fill="${pal.crown}"/>`;
}
function buildTree(species, season, ratio){
  const pal = seasonPalette(season);
  const r = Math.max(0, Math.min(1, ratio));
  const crown = buildCrown((SPECIES[species] && SPECIES[species].crown) || "round", pal, r);
  const trunkW = (1.6 + 0.6*r).toFixed(1);
  const trunk = `<path d="M12 27 V13" stroke="#6b5640" stroke-width="${trunkW}" fill="none" stroke-linecap="round"/>`;
  let snow="";
  if(pal.snow){ snow = `<circle cx="12" cy="6" r="2.4" fill="${pal.snow}"/><circle cx="9" cy="9" r="1.5" fill="${pal.snow}"/><circle cx="15" cy="9" r="1.5" fill="${pal.snow}"/>`; }
  return `<svg viewBox="0 0 24 30" width="150" height="188" aria-hidden="true" class="gt-svg"><g class="gt-grow">${trunk}<g class="gt-leaves">${crown}${snow}</g></g></svg>`;
}
function renderGrowth(){
  if(window._qn3dKill) window._qn3dKill();
  const G = (window.QNModules && QNModules._growth) ? QNModules._growth
    : { GROWTH_MAX:1000, SPECIES:{pine:{name:'松'}}, SEASON_NAME:{0:'春',1:'夏',2:'秋',3:'冬'},
        stageOf:function(g){return {name:'',next:{name:'',need:0}};}, seasonNowIdx:function(){return 0;},
        seasonKey:function(i){return ['spring','summer','autumn','winter'][i];}, treeInner:function(){return '';} };
  const GM = G.GROWTH_MAX;
  const SP = G.SPECIES;
  const DK = todayKey();
  const DAILY_CAP = 100;
  const CHECK_V = 15, WATER_V = 10, WATER_MAX = 2, WATER_GAP = 5*3600*1000;
  let st = lsGet('qn_growth', { species:'pine', forest:[{species:'pine',growth:240}], active:0, season:null, lastCheck:'', synced:0, dayKey:'', todayGain:0, waterTimes:[] });
  if(st.dayKey !== DK){ st.dayKey = DK; st.todayGain = 0; }
  if(!st.forest || !st.forest.length) st.forest = [{ species: st.species || 'pine', growth: 0 }];
  if(st.active == null || st.active >= st.forest.length) st.active = 0;
  if(st.synced == null) st.synced = 0;
  const seasonIdx = (st.season != null) ? st.season : G.seasonNowIdx();

  const sub = '你来过的日子，会一棵棵长成树。每一天、每一次专注与书写，都是浇灌。';
  let speciesBtns = '';
  Object.keys(SP).forEach(function(k){ speciesBtns += '<button class="gr-sp-btn'+(k===st.species?' on':'')+'" data-sp="'+k+'">'+SP[k].name+'</button>'; });
  let seasonBtns = '';
  [0,1,2,3].forEach(function(i){ const nm = (G.SEASON_NAME[i]||['春','夏','秋','冬'][i]); seasonBtns += '<button class="gr-sp-btn'+(i===seasonIdx?' on':'')+'" data-se="'+i+'">'+nm+'</button>'; });

  screen.innerHTML = modHeader('growth', sub)
    + '<div class="gr-stage" id="gr-stage"></div>'
    + '<div class="gr-prog"><div class="gp-bar"><i id="gr-fill"></i></div>'
    + '<div class="gp-meta"><span>成长值 <b id="gr-gv">0</b> / '+GM+'</span><span id="gr-next"></span></div></div>'
    + '<div class="gr-row"><button class="mod-btn" id="gr-plant">种一棵（'+(SP[st.species]?SP[st.species].name:'树')+'）</button>'
    + '<button class="mod-btn ghost" id="gr-check">今日打卡 +15</button>'
    + '<button class="mod-btn ghost" id="gr-water">静心浇灌 +10</button></div>'
    + '<div class="gr-species" id="gr-species">'+speciesBtns+'</div>'
    + '<div class="gr-sec">季节</div>'
    + '<div class="gr-species" id="gr-seasons">'+seasonBtns+'</div>'
    + '<div class="gr-sec">我的林子（'+st.forest.length+' 棵）</div>'
    + '<div class="gr-forest" id="gr-forest"></div>'
    + '<div class="gr-methods"><div class="gr-sec">成长值从哪来</div>'
    + '<div class="gr-mrow"><button class="gr-mbtn" id="gm-check"><span class="gm-t">每日打卡</span><span class="gm-d">每天一次，记录你来过</span><span class="gm-v">+15</span></button>'
    + '<button class="gr-mbtn" id="gm-water"><span class="gm-t">静心浇灌</span><span class="gm-d">每天最多 2 次，间隔 5 小时</span><span class="gm-v">+10</span></button></div>'
    + '<div class="gr-mrow"><button class="gr-mbtn" data-go="garden"><span class="gm-t">专注花园</span><span class="gm-d">完成一次专注</span><span class="gm-v">+20</span></button>'
    + '<button class="gr-mbtn" data-go="stone"><span class="gm-t">打磨小石子</span><span class="gm-d">推上岸、暖黄发光</span><span class="gm-v">+10</span></button></div>'
    + '<div class="gr-mrow"><button class="gr-mbtn" data-go="capsule"><span class="gm-t">写时间胶囊</span><span class="gm-d">写一封给未来的信</span><span class="gm-v">+20</span></button>'
    + '<button class="gr-mbtn" data-go="create"><span class="gm-t">拼贴创作</span><span class="gm-d">选景拼一张卡片</span><span class="gm-v">+10</span></button></div></div>'
    + '<div class="gr-link" id="gr-sync">同步其它模块的足迹 →</div>';

  const stage = screen.querySelector('#gr-stage');
  let api = null;
  if(window.QNModules && stage){
    api = QNModules.makeGrowth(stage, { species: st.species, forest: st.forest, active: st.active, season: seasonIdx });
    SCENE_STOPS.push(function(){ if(api) api.destroy(); });
  }

  function persist(){ lsSet('qn_growth', st); }
  function activeTree(){ return st.forest[st.active]; }
  function thumb(sp, g){ return '<svg viewBox="0 0 240 320" preserveAspectRatio="xMidYMax meet"><g class="gr-sway">'+G.treeInner(sp, G.seasonKey(seasonIdx), g)+'</g></svg>'; }
  function refresh(){
    const t = activeTree(); const info = G.stageOf(t.growth);
    const fill = screen.querySelector('#gr-fill'); if(fill) fill.style.width = (t.growth/GM*100).toFixed(1)+'%';
    const gv = screen.querySelector('#gr-gv'); if(gv) gv.textContent = Math.round(t.growth);
    const nx = screen.querySelector('#gr-next'); if(nx) nx.innerHTML = (info.next && !info.next.done) ? ('距 <b>'+info.next.name+'</b> 还需 <b>'+info.next.need+'</b>') : '<b>已长成参天大树 ✦</b>';
    const fw = screen.querySelector('#gr-forest');
    if(fw){
      fw.innerHTML = st.forest.map(function(tr, i){
        const nm = SP[tr.species] ? SP[tr.species].name : '树';
        return '<div class="gr-ft'+(i===st.active?' on':'')+'" data-i="'+i+'">'+thumb(tr.species, tr.growth)+'<span>'+nm+'</span><b>'+Math.round(tr.growth/GM*100)+'%</b></div>';
      }).join('');
    }
  }
  function addToActive(n){
    const t = activeTree(); if(!t) return;
    t.growth = Math.min(GM, t.growth + (n||0));
    if(api) api.setForest(st.forest, st.active);
    persist(); refresh();
  }
  function waterToday(){ return (st.waterTimes||[]).filter(function(ts){ return todayKey(new Date(ts))===DK; }); }
  function updateWaterBtn(){
    const bw = screen.querySelector('#gr-water'); if(!bw) return;
    const wt = waterToday();
    if(wt.length >= WATER_MAX){ bw.textContent = '静心浇灌 · 今日已浇满 💧'; return; }
    const last = wt.length? wt[wt.length-1] : 0;
    if(last && Date.now()-last < WATER_GAP){
      const mins = Math.ceil((WATER_GAP-(Date.now()-last))/60000);
      bw.textContent = '静心浇灌 · '+mins+' 分钟后可浇'; return;
    }
    bw.textContent = '静心浇灌 +'+WATER_V+'（今日剩 '+(WATER_MAX-wt.length)+' 次）';
  }
  function doCheck(){
    if(st.lastCheck === DK){ toast('今天已经打卡啦 ✦'); return; }
    st.lastCheck = DK; st.todayGain = (st.todayGain||0) + CHECK_V;
    addToActive(CHECK_V); toast('今日打卡 ✦ 树又长高了一点');
  }
  function doWater(){
    const wt = waterToday();
    if(wt.length >= WATER_MAX){ toast('今天已经浇过 '+WATER_MAX+' 次水啦，明天再来 💧'); return; }
    const last = wt.length? wt[wt.length-1] : 0;
    if(last && Date.now()-last < WATER_GAP){
      const mins = Math.ceil((WATER_GAP-(Date.now()-last))/60000);
      toast('离下次浇灌还有 '+mins+' 分钟 💧'); return;
    }
    st.waterTimes = (st.waterTimes||[]).concat(Date.now());
    st.todayGain = (st.todayGain||0) + WATER_V;
    addToActive(WATER_V); persist(); refresh(); updateWaterBtn();
    toast('静心浇灌 +'+WATER_V+' 💧');
  }

  screen.querySelectorAll('#gr-species .gr-sp-btn').forEach(function(b){
    b.onclick = function(){
      st.species = b.dataset.sp;
      screen.querySelectorAll('#gr-species .gr-sp-btn').forEach(function(c){ c.classList.remove('on'); });
      b.classList.add('on');
      const pb = screen.querySelector('#gr-plant'); if(pb) pb.textContent = '种一棵（'+(SP[st.species]?SP[st.species].name:'树')+'）';
      if(api) api.setDefault(st.species);
      persist();
    };
  });
  screen.querySelectorAll('#gr-seasons .gr-sp-btn').forEach(function(b){
    b.onclick = function(){
      const se = +b.dataset.se; st.season = se;
      screen.querySelectorAll('#gr-seasons .gr-sp-btn').forEach(function(c){ c.classList.remove('on'); });
      b.classList.add('on');
      if(api) api.setSeason(se);
      persist(); refresh();
    };
  });
  const bp = screen.querySelector('#gr-plant'); if(bp) bp.onclick = function(){
    const sp = st.species;
    if(!api){ st.forest.push({species:sp, growth:0}); st.active = st.forest.length-1; }
    else { st.active = api.plant(sp); }
    persist(); refresh(); toast('种下了一棵'+(SP[sp]?SP[sp].name:'')+'苗 🌱');
  };
  const bc = screen.querySelector('#gr-check'); if(bc) bc.onclick = doCheck;
  const bw = screen.querySelector('#gr-water'); if(bw) bw.onclick = doWater;
  const mck = screen.querySelector('#gm-check'); if(mck) mck.onclick = doCheck;
  const mw = screen.querySelector('#gm-water'); if(mw) mw.onclick = doWater;
  updateWaterBtn();
  let waterTimer = setInterval(function(){ if(!screen.querySelector('#gr-water')){ clearInterval(waterTimer); return; } updateWaterBtn(); }, 30000);
  SCENE_STOPS.push(function(){ clearInterval(waterTimer); });
  screen.querySelector('#gr-forest').addEventListener('click', function(e){
    const el = e.target.closest('.gr-ft'); if(!el) return;
    const i = +el.dataset.i; if(isNaN(i) || i>=st.forest.length) return;
    st.active = i; if(api) api.setActive(i); persist(); refresh();
  });
  screen.querySelectorAll('[data-go]').forEach(function(b){
    b.onclick = function(){ const k = b.dataset.go; if(typeof openModule==='function') openModule(k); };
  });
  const sync = screen.querySelector('#gr-sync'); if(sync) sync.onclick = function(){
    try{
      if(typeof QNStore!=='undefined'){
        const store = QNStore.load(); const total = store.growth ? store.growth.total : 0;
        const delta = Math.max(0, Math.min(40, total - (st.synced||0)));
        if(delta > 0){ addToActive(delta); st.synced = (st.synced||0) + delta; persist(); toast('同步足迹 +'+Math.round(delta)+' 🌿'); }
        else toast('暂无可同步的新足迹');
      } else toast('暂无可同步的足迹');
    }catch(e){ toast('同步失败'); }
  };

  refresh();
}

/* ===== renderCapsule ===== */
/* 原站 5454-5524（含 renderCapList）。适配：c → screen + modHeader('capsule')；
   flashToast → toast；getIcon → qnIcon；renderCapsule(c) 自递归 → renderCapsule()。
   写信 → 选开启日 → 封存（上锁）→ 到期才可开启 的全套逻辑原样保留。 */
function renderCapsule(){
  if(window._qn3dKill) window._qn3dKill();
  function cl(v){ return v<0?0:(v>1?1:v); }
  const st = lsGet('qn_capsule', { letter:'', openDate:'', sealedAt:'', sealed:false, opened:false });
  const openTs = st.openDate? new Date(st.openDate).getTime():0;
  const sealedTs = st.sealedAt? new Date(st.sealedAt).getTime():0;
  let prog = (st.sealed && openTs>sealedTs)? cl((Date.now()-sealedTs)/(openTs-sealedTs)) : (st.sealed? (Date.now()>=openTs?1:0):0);
  const sub='写一封信，设一个开启的日子，封存。到那天，它才会为你打开。';
  screen.innerHTML = modHeader('capsule', sub)
    + '<canvas id="cap-canvas" class="qn3d-canvas"></canvas>'
    + '<div class="cap-panel" id="cap-panel"></div>';
  const cv=screen.querySelector('#cap-canvas');
  let api=null;
  if(window.QNModules && cv){
    api=QNModules.makeCapsule(cv, { progress: prog });
    window._qn3dEngines.push(api.engine);
    SCENE_STOPS.push(function(){ api.engine.destroy(); });
  }
  function daysLeft(){ if(!openTs) return 0; return Math.max(0, Math.ceil((openTs-Date.now())/86400000)); }
  function paint(){
    const s = lsGet('qn_capsule', st);
    prog = (s.sealed && openTs>sealedTs)? cl((Date.now()-sealedTs)/(openTs-sealedTs)) : (s.sealed? (Date.now()>=openTs?1:0):0);
    if(api && !api.isOpen()) api.setProgress(prog);
    if(s.sealed && prog>=1 && api && !api.isOpen()) api.setProgress(1);
    let h='';
    if(!s.sealed){
      h+='<textarea class="cap-ta" id="cap-ta" maxlength="200" placeholder="写点什么给将来的自己…">'+esc(s.letter)+'</textarea>';
      h+='<div class="cap-row"><span class="cap-lbl">多少天后开启</span><input class="cap-num" id="cap-days" type="number" min="1" max="3650" value="30" /></div>';
      h+='<div class="cap-row"><div class="st-btn primary" id="cap-seal">封 存</div></div>';
    } else if(prog<1){
      h+='<div class="cap-word">'+esc(s.letter)+'</div>';
      h+='<div class="cap-lock">🔒 封存中 · 还剩 <b>'+daysLeft()+'</b> 天开启</div>';
      h+='<div class="g3-bar"><i style="width:'+(prog*100).toFixed(1)+'%"></i></div>';
    } else {
      h+='<div class="cap-word open">'+esc(s.letter)+'</div>';
      h+='<div class="cap-row"><div class="st-btn primary" id="cap-open">打开胶囊 ✦</div></div>';
    }
    const panel=screen.querySelector('#cap-panel'); if(panel) panel.innerHTML=h;
    const seal=screen.querySelector('#cap-seal');
    if(seal) seal.onclick=function(){
      const ta=screen.querySelector('#cap-ta'); const days=parseInt(screen.querySelector('#cap-days').value,10)||30;
      const letter=(ta.value||'').trim(); if(!letter){ toast('先写点什么'); return; }
      const now=Date.now();
      st={ letter:letter, openDate:new Date(now+days*86400000).toISOString(), sealedAt:new Date(now).toISOString(), sealed:true, opened:false };
      lsSet('qn_capsule', st);
      if(api){ api.seal(); api.setProgress(0); }
      toast('已封存 ✦ 到那天再打开'); paint();
    };
    const open=screen.querySelector('#cap-open');
    if(open) open.onclick=function(){
      st=lsGet('qn_capsule', st); st.opened=true; lsSet('qn_capsule', st); uTrack('capsule_open');
      if(api) api.open(); toast('胶囊打开了 ✦'); paint();
    };
  }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  paint();
}
function renderCapList(){
  const list = screen.querySelector("#cap-list"); if(!list) return;
  if(!QNStore.store.capsules.length){ list.innerHTML = `<div class="empty">还没有时间胶囊。<br>把今天的自己，寄给未来的自己。</div>`; return; }
  const today = new Date().toISOString().slice(0,10);
  let h = "";
  QNStore.store.capsules.forEach(cap=>{
    const ready = cap.openDate <= today;
    const d = new Date(cap.ts); const ds = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    h += `<div class="cap-card"><div class="cc-top"><span>封存于 ${ds}</span><span>${ready?qnIcon('bubble')+" 可开启":qnIcon('hourglass')+" "+cap.openDate+" 开启"}</span></div>`;
    if(ready && cap.opened){ h += `<div class="cc-t cap-open-anim">${escapeHtml(cap.text)}</div>`; }
    else if(ready){ h += `<div class="cc-open" data-open="${cap.id}">▸ 开启这枚胶囊</div>`; }
    else { h += `<div class="cc-t" style="opacity:.55">${escapeHtml(cap.text.slice(0,12))}……（未到开启日）</div>`; }
    h += `</div>`;
  });
  list.innerHTML = h;
  list.querySelectorAll("[data-open]").forEach(b=> b.addEventListener("click", ()=>{
    const cap = QNStore.store.capsules.find(x=>x.id===b.dataset.open);
    if(cap){ cap.opened=true; uTrack('capsule_open'); QNStore.save(); SoundKit.chime(); renderCapsule(); toast("胶囊已开启 · 写给自己的话"); }
  }));
}

/* ===== renderRitual ===== */
/* 原站 5612-5680（含 renderRitList）。适配：
   ① c → screen + modHeader('ritual')；flashToast → toast；Sanctuary → QNStore；
   ② 原站的全局 scenes（scenes.json 场景表）框架里不存在，改用框架的 MEDIA.flat()；
   ③ 原站 enterPlayer(id) + 关闭 #sanct-detail，框架里对应 openImmerse(id, back)；
   ④ 追加「配一段声景」：原站仪式只存 scene+min，这里用框架 SoundKit 的音轨补齐
      场景 + 声景 + 计时 的组合（老数据没有 snd 字段时按无声景处理，向下兼容）。 */
function ritScenes(){
  try{ return (window.MEDIA && MEDIA.flat) ? MEDIA.flat().filter(x=>!x.pending) : []; }catch(e){ return []; }
}
function renderRitual(){
  if(window._qn3dKill) window._qn3dKill();
  const st = lsGet('qn_ritual', { scene:'night', sound:'calm' });
  const scenes=[['night','星夜'],['dawn','黎明'],['forest','密林'],['sea','深海'],['ember','余烬']];
  const sounds=[['calm','舒缓'],['focus','专注'],['deep','深沉'],['light','轻灵']];
  const sub='选一处场景、一段声景，开始一段属于你的仪式。';
  let html = modHeader('ritual', sub) + '<canvas id="rit-canvas" class="qn3d-canvas"></canvas>'
    + '<div class="rit-row"><span class="rit-lbl">场景</span>';
  scenes.forEach(function(s){ html+='<button class="mod-btn ghost" data-sc="'+s[0]+'">'+s[1]+'</button>'; });
  html+='</div><div class="rit-row"><span class="rit-lbl">声景</span>';
  sounds.forEach(function(s){ html+='<button class="mod-btn ghost" data-so="'+s[0]+'">'+s[1]+'</button>'; });
  html+='</div><div class="rit-row"><button class="mod-btn" id="rit-play">开始仪式</button><button class="mod-btn ghost" id="rit-stop">结束</button></div>';
  screen.innerHTML=html;
  const cv=screen.querySelector('#rit-canvas');
  let api=null;
  if(window.QNModules && cv){
    api=QNModules.makeRitual(cv, { scene: st.scene, sound: st.sound });
    window._qn3dEngines.push(api.engine);
    SCENE_STOPS.push(function(){ api.engine.destroy(); });
  }
  screen.querySelectorAll('[data-sc]').forEach(function(b){ b.onclick=function(){ st.scene=b.dataset.sc; lsSet('qn_ritual', st); api&&api.setCombo(st.scene, st.sound); toast('场景：'+b.textContent); }; });
  screen.querySelectorAll('[data-so]').forEach(function(b){ b.onclick=function(){ st.sound=b.dataset.so; lsSet('qn_ritual', st); api&&api.setCombo(st.scene, st.sound); toast('声景：'+b.textContent); }; });
  const bp=screen.querySelector('#rit-play'); if(bp) bp.onclick=function(){ api&&api.play(); try{ if(typeof SoundKit!=='undefined'&&SoundKit.start) SoundKit.start(st.sound); }catch(e){} toast('仪式开始，深呼吸'); };
  const bs=screen.querySelector('#rit-stop'); if(bs) bs.onclick=function(){ api&&api.stop(); try{ if(typeof SoundKit!=='undefined'&&SoundKit.stopAll) SoundKit.stopAll(); }catch(e){} toast('仪式结束'); };
}
function renderRitList(){
  const list = screen.querySelector("#rit-list"); if(!list) return;
  if(!QNStore.store.rituals.length){ list.innerHTML = `<div class="empty">还没有仪式。<br>把日常搭成你自己的样子。</div>`; return; }
  const pool = ritScenes();
  let h = "";
  QNStore.store.rituals.forEach(r=>{
    const sc = pool.find(s=>s.id===r.scene);
    const sn = (r.snd && typeof SoundKit!=='undefined' && SoundKit.list[r.snd]) ? SoundKit.list[r.snd].n : "";
    h += `<div class="rit-card"><div><b>${escapeHtml(r.name)}</b> · ${r.min} 分钟 · ${sc?escapeHtml(sc.title||sc.id):""}${sn?" · "+escapeHtml(sn):""}</div><div class="q-actions" style="margin-top:8px"><div class="q-btn" data-play="${r.id}">▶ 播放仪式</div><div class="q-btn" data-del="${r.id}">删除</div></div></div>`;
  });
  list.innerHTML = h;
  list.querySelectorAll("[data-play]").forEach(b=> b.addEventListener("click", ()=>{
    const r = QNStore.store.rituals.find(x=>x.id===b.dataset.play); if(!r) return;
    /* 声景：先停掉旧的，再起这套仪式配的那一轨 */
    if(r.snd && typeof SoundKit!=='undefined'){ try{ SoundKit.stopAll(); SoundKit.start(r.snd); if(typeof soundPill==='function') soundPill(); }catch(e){} }
    /* 场景：原站 enterPlayer(id) → 框架 openImmerse(id, 返回本模块) */
    if(typeof openImmerse === "function" && r.scene){ openImmerse(r.scene, ()=>openModule('ritual')); }
    toast("仪式开始 · "+r.name+"（"+r.min+" 分钟，可在心流里计时）");
  }));
  list.querySelectorAll("[data-del]").forEach(b=> b.addEventListener("click", ()=>{
    QNStore.store.rituals = QNStore.store.rituals.filter(x=>x.id!==b.dataset.del); QNStore.save(); renderRitual();
  }));
}


const MODULE_RENDER={
  echo:renderEcho, flow:renderFlow, review:renderReview, quiet:renderQuiet,
  solar:renderSolar, moon:renderMoon, verse:renderVerse, notes:renderNotes,
  mood:renderMood, morningnight:renderMorningNight, body:renderBodyScan, fold:renderFold,
  immerse:renderImmerse, fav:renderFav, create:renderCreate, garden:renderGarden, stone:renderStone, growth:renderGrowth, capsule:renderCapsule, ritual:renderRitual
};

/* ===================== 反馈 ===================== */
function renderFeedback(){
  const list=loadFeedback().slice(-5).reverse();
  screen.innerHTML=`
    <div class="center" style="margin:16px 0 6px"><div class="h2 serif">反馈 / 报 Bug</div>
      <div class="muted" style="font-size:12px">写给站点管理的一句 · 提交后会送达管理端</div></div>
    <div class="card" style="margin-top:14px">
      <textarea class="inp" id="fb-text" placeholder="说说你遇到的问题，或想加的功能…"></textarea>
      <div class="dm-row">
        <button class="btn" onclick="sendFeedback()">送出</button>
        <button class="btn ghost" onclick="renderSettings()">返回</button>
      </div>
      ${list.length?`<div class="sub" style="margin-top:14px">最近留言：<br>${list.map(t=>`· ${t.text} <span style="opacity:.5">(${t.at})</span>`).join('<br>')}</div>`:''}
    </div>`;
  screen.scrollTop=0;
}
/* 站点通知推送（PushPlus → 微信）。返回 Promise<boolean> 是否送达 */
function pushWechat(title, content){
  if(!PUSHPLUS_TOKENS.length) return Promise.resolve(false);
  const pay={title:title,content:content,template:"txt"};
  return Promise.all(PUSHPLUS_TOKENS.map(tk=>
    fetch("https://www.pushplus.plus/send",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(Object.assign({token:tk},pay))})
      .then(r=>r.json()).catch(()=>({code:-1}))))
    .then(res=>res.some(j=>j&&(j.code===200||j.data==="发送成功"||j.success)))
    .catch(()=>false);
}
function sendFeedback(){
  const t=document.getElementById('fb-text').value.trim(); if(!t){ toast('写点什么吧'); return; }
  const list=loadFeedback(); list.push({text:t,at:new Date().toLocaleString('zh-CN')});
  try{ localStorage.setItem(FEED_KEY,JSON.stringify(list.slice(-100))); }catch(e){}
  toast('已记下，正在送达…');
  pushWechat("空栈反馈", t).then(ok=> toast(ok?'已送出 · 管理端已收到':'已记下 · 推送未成功'));
  renderFeedback();
}

/* 离开 */
function showExit(){
  if(confirm('确定离开「自然之境」吗？')){ location.reload(); }
}

/* ===================== 启动 ===================== */
(function(){ const s=document.createElement('style');
  s.textContent='body.lessmotion *{animation-duration:.001s!important;animation-iteration-count:1!important;transition-duration:.12s!important}'+
  '.mod.live .mk{color:var(--accent);opacity:.9}';
  document.head.appendChild(s); })();
applyMood(); Store.load(); setBackdrop(MOOD_BY_COLOR[profile.color]||'mist');
/* 记录到访日（温柔回顾的「连续天数」用） */
(function(){ const d=lsGet('qn_days',[]), k=todayKey();
  if(d.indexOf(k)<0){ d.push(k); lsSet('qn_days',d.slice(-800)); } })();
applyQuiet();
setInterval(applyQuiet,120000);
renderGallery();
</script>
<!-- 公共板多人共享（前端同步适配器，直连 GitHub Discussions，默认开启） -->
<script src="./board-sync.js"></script>
<!-- 共享 3D 引擎 + 模块场景工厂 -->
<script src="./qn3d.js"></script>
<script src="./qn-modules.js"></script>
<script>window._qn3dEngines=[];window._qn3dKill=function(){(window._qn3dEngines||[]).forEach(function(e){try{e.destroy();}catch(_){}});window._qn3dEngines=[];};</script>
<!-- 微光留言 · 星穹（纯 Canvas 3D，离线可用；抬头看「全部」的星，脚下星盘可切换视图） -->
<script src="./glow-sky.js"></script>
<!-- 共读接力 · 可交互光河（每段续写=一处光，点击读那一段故事；句子越长光越亮） -->
<script src="./relay-river.js"></script>
<!-- 3D 海滩：复刻 adams914/beach-wallpaper，本地 Three.js，无外部图片依赖。
     模块自带 window.startBeach(container,opts)，由「同看一片海」调用。 -->
<script type="module" src="./beach3d.js"></script>
<!-- 漂流瓶 · 3D 海面与漂浮玻璃瓶（本地 Three.js，参照海滩做法）。模块自带 window.startBottles。 -->
<script type="module" src="./bottle3d.js"></script>
<!-- 海滩环境音：移植自 adams914/beach-wallpaper 的 Web Audio 分层引擎（waves/wind/seagulls/campfire/music），
     本地音频读取 media/audio/，仅作声音附加，不改动 beach3d.js 与既有音乐/回声板逻辑。 -->
<script type="module" src="./beach-audio.js"></script>
<!-- PWA：注册 Service Worker，使站点可「安装到主屏幕」并离线缓存外壳 -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  });
}
</script>
</body>
</html>
