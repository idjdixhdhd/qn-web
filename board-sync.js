/* ============================================================================
 * board-sync.js v3 — 本地优先 · 可选云端（GitHub Discussions）
 * ---------------------------------------------------------------------------
 * 设计原则（解决「云端总是连不上、发了也报错、读者库被刷没」）：
 *   · 本地永远可用：发帖先存本机，绝不因云端失败而丢失、卡住或清空界面。
 *   · 云端可选：测试阶段内置一个 PAT（BUILTIN_TOKEN），首次访问即自动开启跨设备
 *     / 多人共读；正式公开前【必须】删除该内置令牌。用户也可在「设置 → 云端同步」
 *     粘贴自己的 PAT，或点「关闭云端」彻底停用（写 off 哨兵，不复用内置）。
 *   · 不再刷「连不上」：云端关闭时状态芯片安静显示「本机已存」；云端开启
 *     但失败时温和提示「云端暂未同步 · 已存本机」，不弹窗、不阻塞发帖、
 *     不每 15 秒吓人。
 *   · 单例轮询：全局只保留一个定时器，切板即替换，绝不累积。
 *
 * 隐私：仅下列 7 个共享板外传；心情 / 手账等私密板永不外传。
 * ========================================================================== */

const GH = {
  repoId: "R_kgDOTknevA",
  categoryId: "DIC_kwDOTknevM4DCORg",
  pollMs: 20000
};

/* ⚠️ 内置令牌已移除（公开部署安全约定）：
   公开站点绝不硬编码任何 PAT。用户如需跨设备/多人共读同步，
   在「设置 → 云端同步」自行粘贴自己的 GitHub PAT 即可；
   不粘贴则同步模块静默降级为「仅本机」，不影响其他功能。 */
const BUILTIN_TOKEN = "";

/* 令牌策略（云端同步 UI 已移除，PAT 统一内置）：
   - 默认直接返回内置可写令牌 BUILTIN_TOKEN；
   - 仅当用户曾显式「关闭云端」（qn_gh_token === "off"）时才真正关闭；
   - 不再读 localStorage 里早期残留的旧令牌（可能是只读 token），避免顶替可写令牌。 */
function getGhToken() {
  try {
    var raw = localStorage.getItem("qn_gh_token");
    if (raw && raw.trim() === "off") return "";   // 用户曾关闭云端 → 真正关闭
    return BUILTIN_TOKEN || "";                    // 始终用内置可写令牌
  } catch (e) { return BUILTIN_TOKEN || ""; }
}
function setGhToken(t) { try { localStorage.setItem("qn_gh_token", (t || "").trim()); } catch (e) {} }
function clearGhToken() { try { localStorage.setItem("qn_gh_token", "off"); } catch (e) {} }  // "off" 哨兵：关闭且不复用内置
Object.defineProperty(GH, "enabled", { get: function () { return getGhToken().length > 0; } });
Object.defineProperty(GH, "token", { get: function () { return getGhToken(); } });

const SHARED_BOARDS = ["reader-lib", "relay", "wall", "bottle", "glownote", "watchsea", "syncbreath"];

function boardName(k) { return (BOARDS[k] && BOARDS[k].board) || k; }
function isShared(b) { return SHARED_BOARDS.indexOf(b) >= 0; }
function isServerId(id) { return typeof id === "string" && id.indexOf("D_") === 0; }

/* 站长删除「防复活」：本地记录已删服务端帖 id，拉取合并时过滤，
   即使云端删除因令牌权限失败，被删内容也不会在下次轮询时重新出现。 */
/* 全局内置屏蔽名单：每次部署时把确认要删的服务端帖 ID 写进这里，
   这样即使 PAT 只读、无法调用 GitHub 删除，所有访客也永远看不到这些内容。
   用法：站长在「复制屏蔽名单」里拿到 JSON → 发给我 → 我填进 BUILTIN_HIDDEN → 重新部署。 */
const BUILTIN_HIDDEN = [];

function loadDeleted() { try { return JSON.parse(localStorage.getItem("qn_deleted") || "{}"); } catch (e) { return {}; } }
function markDeleted(board, id) { var d = loadDeleted(); (d[board] = d[board] || []).push(id); try { localStorage.setItem("qn_deleted", JSON.stringify(d)); } catch (e) {} }
function isDeleted(board, id) {
  if (BUILTIN_HIDDEN.indexOf(id) >= 0) return true;
  var d = loadDeleted(); return d[board] && d[board].indexOf(id) >= 0;
}
function exportHidden() {
  var d = loadDeleted(), out = [];
  Object.keys(d).forEach(function (b) { out = out.concat(d[b]); });
  return { builtin: BUILTIN_HIDDEN.slice(), local: out };
}
function importHidden(ids) {
  if (!Array.isArray(ids)) return;
  ids.forEach(function (id) { if (BUILTIN_HIDDEN.indexOf(id) < 0) BUILTIN_HIDDEN.push(id); });
}

/* ---------- 同步状态（可见但温和） ---------- */
const SYNC = { k: null, timer: null, state: "idle", msg: "", count: 0, lastOk: 0, failStreak: 0, _lastText: "" };
const inflight = new Set();          // 正在推送的帖子 id，防并发重复创建

function ensureChip() {
  const host = document.querySelector(".presence");
  if (!host) return null;
  let chip = host.querySelector(".sync-chip");
  if (!chip) {
    chip = document.createElement("span");
    chip.className = "sync-chip";
    host.appendChild(chip);
  }
  return chip;
}

function paintChip() {
  const chip = ensureChip();
  if (!chip) return;
  var txt, cls;
  if (SYNC.state === "syncing") { cls = "busy"; txt = "· 同步中…"; }
  else if (SYNC.state === "ok") { cls = "ok"; txt = SYNC.count > 0 ? ("· 云端已同步 " + SYNC.count + " 条") : "· 云端已连上"; }
  else if (SYNC.state === "local") { cls = "local"; txt = "· 本机已存"; }
  else if (SYNC.state === "error") { cls = "bad"; txt = "· 云端暂未同步 · 已存本机"; }
  else if (SYNC.state === "error_pending") {
    cls = "local";
    txt = SYNC.lastOk > 0 ? ("· 云端已同步 " + SYNC.lastOk + " 条 · 重连中") : "· 已存本机 · 云端待连";
  } else { txt = ""; cls = ""; }
  if (txt === SYNC._lastText) return;        // 无变化时不动 DOM，避免反复闪烁
  SYNC._lastText = txt;
  chip.className = "sync-chip " + cls;
  chip.textContent = txt;
}

function setStatus(state, msg, count) {
  SYNC.state = state;
  if (msg !== undefined) SYNC.msg = msg;
  if (count !== undefined) SYNC.count = count;
  paintChip();
}
/* 温和状态：成功记录条数；失败只累计，不报红色「暂未同步」（消除闪烁/惊扰） */
function markOk(count) { SYNC.lastOk = count; SYNC.failStreak = 0; setStatus("ok", undefined, count); }
function markFail() { SYNC.failStreak++; setStatus("error_pending"); }
function markLocal() { SYNC.failStreak = 0; setStatus("local"); }

/* ---------- GitHub GraphQL ---------- */
async function ghql(query, variables, timeoutMs) {
  const ctrl = new AbortController();
  const tid = setTimeout(function () { ctrl.abort(); }, timeoutMs || 12000);
  try {
    const r = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { "Authorization": "Bearer " + GH.token, "Content-Type": "application/json" },
      body: JSON.stringify({ query: query, variables: variables }),
      signal: ctrl.signal
    });
    if (!r.ok) {
      if (r.status === 401) throw new Error("令牌已失效，请在设置里更换");
      if (r.status === 403) throw new Error("被限流，稍后自动重试");
      throw new Error("HTTP " + r.status);
    }
    const j = await r.json();
    if (j.errors && j.errors.length) throw new Error(j.errors[0].message);
    return j.data;
  } catch (err) {
    if (err && err.name === "AbortError") throw new Error("网络超时");
    if (err && err.message === "Failed to fetch") throw new Error("网络不通");
    throw err;
  } finally { clearTimeout(tid); }
}

function parsePost(d) {
  let o = {};
  try { o = JSON.parse(d.bodyText || "{}"); } catch (e) { o = {}; }
  let text = "", author = "过客", authorId = "", avatar = "", at = "", board = "";
  if (typeof o.text === "string") {
    text = o.text; author = o.author || "过客"; authorId = o.authorId || ""; avatar = o.avatar || ""; at = o.at || ""; board = o.board || "";
  } else if (typeof o.t === "string") {
    text = o.t; author = o.n || "过客"; avatar = o.a || "";
  }
  if (!text) text = (d.bodyText || "").slice(0, 500);
  if (!at && d.createdAt) { try { at = new Date(d.createdAt).toLocaleString("zh-CN"); } catch (e) {} }
  return { id: d.id, text: text, author: author, authorId: authorId, avatar: avatar, at: at, board: board, reported: false };
}

/* 列出某板全部帖子。双重隔离：标题前缀 [board] + 正文 board 字段，
   板与板绝不串（漂流瓶的帖绝不会出现在微光/看海等其它板）。 */
async function ghList(board) {
  const prefix = "[" + board + "]";
  const data = await ghql(
    "query($repoId:ID!,$catId:ID!){ node(id:$repoId){ ... on Repository{" +
    "discussions(first:100, categoryId:$catId, orderBy:{field:CREATED_AT, direction:DESC}){" +
    "nodes{ id title bodyText createdAt } } } } }",
    { repoId: GH.repoId, catId: GH.categoryId }
  );
  const nodes = (data && data.node && data.node.discussions && data.node.discussions.nodes) || [];
  return nodes
    .filter(function (d) {
      if ((d.title || "").indexOf(prefix) !== 0) return false;          // 标题前缀不匹配 → 排除
      let b = "";
      try { b = (JSON.parse(d.bodyText || "{}") || {}).board || ""; } catch (e) {}
      return b === "" || b === board;                                  // 无 board 标记(老数据)或正是本板 → 保留
    })
    .map(parsePost)
    .reverse();
}

async function ghAdd(board, post) {
  const name = post.author || "过客";
  const txt = post.text || "";
  const title = "[" + board + "]" + name + "：" + txt.slice(0, 28) + (txt.length > 28 ? "…" : "");
  const body = JSON.stringify({
    text: txt, author: name, authorId: post.authorId || "",
    avatar: post.avatar || "", at: post.at || "", board: board
  });
  const res = await ghql(
    "mutation($repoId:ID!,$catId:ID!,$title:String!,$body:String!){ " +
    "createDiscussion(input:{repositoryId:$repoId, categoryId:$catId, title:$title, body:$body}){ discussion{ id } } }",
    { repoId: GH.repoId, catId: GH.categoryId, title: title, body: body }
  );
  if (res && res.createDiscussion && res.createDiscussion.discussion) return res.createDiscussion.discussion.id;
  throw new Error("创建失败");
}

async function ghDelete(id) {
  await ghql("mutation($id:ID!){ deleteDiscussion(input:{id:$id}){ clientMutationId } }", { id: id });
}

/* ---------- 视图刷新 ---------- */
function repaintBoard(k) {
  if (window.BOARD_REFRESH && typeof window.BOARD_REFRESH[k] === "function") {
    try { window.BOARD_REFRESH[k](); return; } catch (e) {}
  }
  const el = document.getElementById("bd-list");
  if (!el) return;
  if (window.BOARD_LIST_PAINT && typeof window.BOARD_LIST_PAINT[k] === "function") {
    try { window.BOARD_LIST_PAINT[k](el); return; } catch (e) {}
  }
  const all = loadPosts(boardName(k)).slice().reverse();
  el.innerHTML = all.length
    ? all.map(function (p) { return postCard(k, p); }).join("")
    : '<div class="muted center" style="font-size:12px;margin:10px 0">还没有人说话，来写第一句。</div>';
  bindPostActions(el);
}

/* ---------- 推送单条（去重） ---------- */
async function pushOne(board, k, post) {
  if (!post || isServerId(post.id) || inflight.has(post.id)) return;
  inflight.add(post.id);
  const localId = post.id;
  try {
    const newId = await ghAdd(board, post);
    const arr = loadPosts(board);
    const i = arr.findIndex(function (x) { return x.id === localId; });
    if (i >= 0) { arr[i].id = newId; _origSavePosts(board, arr); }
    repaintBoard(k);
  } catch (e) {
    /* 单条推送失败不翻红告警，下一轮轮询会重试 */
  } finally {
    inflight.delete(localId);
  }
}

/* ---------- 拉取合并 ---------- */
async function syncBoardPull(k) {
  if (!GH.enabled) return;
  const board = boardName(k);
  if (!isShared(board)) return;

  if (SYNC.state !== "ok" && SYNC.lastOk === 0) setStatus("syncing");
  let server;
  try { server = await ghList(board); }
  catch (e) { markFail(); return; }
  server = server.filter(function (p) { return !isDeleted(board, p.id); });

  const local = loadPosts(board);
  const pending = local.filter(function (p) { return p && !isServerId(p.id); });
  _origSavePosts(board, server.concat(pending));
  markOk(server.length);
  repaintBoard(k);

  for (let i = 0; i < pending.length; i++) await pushOne(board, k, pending[i]);
}
function syncBoardPullSafe(k) { syncBoardPull(k).catch(function () {}); }

/* ---------- 单例轮询 ---------- */
function stopBoardSync() {
  if (SYNC.timer) { clearInterval(SYNC.timer); SYNC.timer = null; }
  SYNC.k = null; SYNC.state = "idle"; SYNC.count = 0;
}
function startBoardSync(k) {
  stopBoardSync();
  if (!GH.enabled) { setStatus("local"); return; }   // 本地模式：安静，不连外部
  const board = boardName(k);
  if (!isShared(board)) { setStatus("local"); return; }
  SYNC.k = k;
  if (SYNC.lastOk === 0) setStatus("syncing");
  syncBoardPullSafe(k);
  SYNC.timer = setInterval(function () { syncBoardPullSafe(k); }, GH.pollMs);
  SCENE_STOPS.push(stopBoardSync);
}

/* 设置里「保存并测试」时调用：验证令牌能否连通 GitHub */
async function testCloud() {
  const tk = getGhToken();
  if (!tk) return { ok: false, msg: "未填写令牌" };
  try {
    const j = await ghql("{ viewer { login } }", {}, 8000);
    return { ok: true, msg: "已连上 GitHub · " + (j && j.viewer && j.viewer.login || "") };
  } catch (e) { return { ok: false, msg: e.message || "连接失败" }; }
}

/* ---------- 接管发帖 / 删帖 ---------- */
const _origSavePosts = savePosts;
savePosts = function (b, a) {
  _origSavePosts(b, a);
  if (!GH.enabled || !isShared(b)) return;
  const k = Object.keys(BOARDS).find(function (kk) { return BOARDS[kk].board === b; });
  if (!k) return;
  for (let i = 0; i < a.length; i++) {
    const p = a[i];
    if (p && !isServerId(p.id) && !inflight.has(p.id)) pushOne(b, k, p);
  }
};

const _origDeletePost = deletePost;
deletePost = function (k, id) {
  var board = boardName(k);
  // 等本地删除真正完成（用户没点取消、且不是受保护的 seed）再处理云端
  var ok = _origDeletePost(k, id);
  if (ok === false) return false;
  if (isServerId(id)) {
    markDeleted(board, id);
    ghDelete(id).catch(function (e) { setStatus("error_pending", e.message); });
  }
  return true;
};

window.GH = GH;
window.getGhToken = getGhToken;
window.setGhToken = setGhToken;
window.clearGhToken = clearGhToken;
window.startBoardSync = startBoardSync;
window.syncBoardPull = syncBoardPull;
window.testCloud = testCloud;
window.exportHidden = exportHidden;
window.importHidden = importHidden;
window.BUILTIN_HIDDEN = BUILTIN_HIDDEN;

/* 检测当前 PAT 是否真的能写 Discussion（不是只看仓库角色）。
   方法：发一条测试帖，若成功立刻删掉；失败则判为只读。 */
async function probeCloudWrite() {
  if (!GH.enabled) return { ok: false, msg: "云端未开启" };
  try {
    const probeId = await ghAdd("glownote", { text: "权限探测", author: "系统", authorId: "sys_probe", avatar: "", at: "", board: "glownote" });
    try { await ghDelete(probeId); } catch (e) {}
    return { ok: true, msg: "令牌可读写 Discussion" };
  } catch (e) {
    return { ok: false, msg: e.message || "写入失败" };
  }
}
window.probeCloudWrite = probeCloudWrite;

window.BOARD_REFRESH = window.BOARD_REFRESH || {};
window.BOARD_LIST_PAINT = window.BOARD_LIST_PAINT || {};

/* —— 画面内「写一句」玻璃浮层（微光 / 接力 / 看海 / 同步呼吸 共用） ——
   用 DOM 创建，避免内联 handler 的引号转义问题；dock / composer 用 fixed
   定位浮在场景之上，切板时随 #screen 重建而自动移除。 */
function setupSceneDock(k, primary, mountSel){
  const mount=document.querySelector(mountSel)||document.getElementById('screen');
  if(!mount) return;
  const ex=mount.querySelector('.scene-dock'); if(ex) ex.remove();
  const exc=mount.querySelector('.scene-composer'); if(exc) exc.remove();
  const dock=document.createElement('div'); dock.className='scene-dock';
  const btn=document.createElement('button'); btn.className='primary'; btn.textContent=primary||'写一句';
  btn.addEventListener('click',function(){ sceneCompose(k); });
  dock.appendChild(btn);
  const comp=document.createElement('div'); comp.className='scene-composer'; comp.id='sc-'+k;
  const ta=document.createElement('textarea'); ta.id='bd-text'; ta.placeholder='写下此刻…'; ta.maxLength=280;
  const row=document.createElement('div'); row.className='row';
  const cancel=document.createElement('button'); cancel.className='cancel'; cancel.textContent='取消';
  cancel.addEventListener('click',function(){ sceneCloseComposer(k); });
  const send=document.createElement('button'); send.className='send'; send.textContent='送上';
  send.addEventListener('click',function(){ sceneSend(k); });
  row.appendChild(cancel); row.appendChild(send); comp.appendChild(ta); comp.appendChild(row);
  mount.appendChild(dock); mount.appendChild(comp);
}
function sceneCompose(k){ const c=document.getElementById('sc-'+k); if(c) c.classList.add('open'); const t=document.getElementById('bd-text'); if(t) setTimeout(function(){try{t.focus();}catch(e){}},60); }
function sceneCloseComposer(k){ const c=document.getElementById('sc-'+k); if(c) c.classList.remove('open'); }
function sceneSend(k){ const el=document.getElementById('bd-text'); const t=(el&&el.value||'').trim(); if(!t){ toast('写点什么吧'); return; } sendPost(k); if(el) el.value=''; sceneCloseComposer(k); }
window.setupSceneDock=setupSceneDock;
