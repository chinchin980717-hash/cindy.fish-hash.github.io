const CHARACTERS = {
  wave: { name: "溫柔海浪", handle: "@溫柔海浪", icon: "☀️", color: "#6de5e8" },
  jelly: { name: "神秘水母", handle: "@神秘水母", icon: "🫥", color: "#c5a9ff" },
  squid: { name: "夜光魷魚", handle: "@夜光魷魚", icon: "🌙", color: "#ffd36e" },
  coral: { name: "慢慢靠岸", handle: "@慢慢靠岸", icon: "🪸", color: "#87e6ad" },
  puffer: { name: "委屈河豚", handle: "@委屈河豚", icon: "🫠", color: "#ff8068" }
};

// 新角色只需要在 CHARACTERS 建立資料，再把 characterId 放入事件即可。
const EVENTS = [
  { characterId: "wave", type: "日常投餌型", title: "每天都說早安晚安", message: "早安～晚安～今天也要想你喔 ❤️", detail: "但你一問「最近好嗎？」，對方就已讀到海底。", best: 1 },
  { characterId: "jelly", type: "突然消失型", title: "昨天還在，今天蒸發", message: "昨天：你是我最特別的人。\n今天：最後上線 23 小時前。", detail: "這不是魔術，是把你放進冷凍庫的技術。", best: 2 },
  { characterId: "squid", type: "深夜出沒型", title: "凌晨 01:37 的一句話", message: "睡了嗎？\n現在出來見面，海邊風很大。", detail: "白天訊息已讀，晚上突然變成浪漫電影主角。", best: 1 },
  { characterId: "wave", type: "群發撒網型", title: "同一句話，漂到你這裡", message: "嗨寶～我第一眼就覺得你很不一樣 ✨", detail: "你往旁邊一看，整片海都有同款餌。", best: 2 },
  { characterId: "wave", type: "未來支票型", title: "等有空一定帶你看海", message: "等我忙完這陣子，我們就去旅行。\n（這句已經拖三季。）", detail: "未來很美，只是永遠還沒排進行事曆。", best: 1 },
  { characterId: "puffer", type: "情緒索取型", title: "只回你一句就說很忙", message: "我今天好累，可以陪我聊四小時嗎？\n你說你也累：喔那先這樣。", detail: "你的情緒不是 24 小時便利商店。", best: 2 },
  { characterId: "coral", type: "真誠稀有型", title: "這次的餌，好像有點不一樣", message: "我喜歡跟你聊天，也尊重你的節奏。\n不急，你想回再回就好。", detail: "警報沒有響，心裡卻有小魚在跳。", best: 0 },
  { characterId: "jelly", type: "迷因回彈型", title: "只有你懂的那張梗圖", message: "（傳來一張只有你們笑得出來的迷因）\n「這不就是你嗎？」", detail: "危險訊號：你真的笑了，而且想回一張。", best: 0 }
];

const state = { screen: "title", roundIndex: 0, roundCount: 8, deck: [], event: null, locked: false, heart: 42, radar: 28, boundary: 50, chain: 0, score: 0, bestScore: Number(localStorage.getItem("fish-best-score") || 0) };
const $ = (id) => document.getElementById(id);

function showScreen(name) {
  ["title", "play", "result"].forEach((screen) => $(screen + "-screen").classList.toggle("hidden", screen !== name));
  state.screen = name;
}
function clamp(value) { return Math.max(0, Math.min(100, value)); }
function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
function characterFor(event) { return CHARACTERS[event.characterId] || CHARACTERS.wave; }
function updateBar(id, value) { $(id).style.width = `${clamp(value)}%`; }
function updateStatus() {
  $("heart-value").textContent = `${state.heart} / 100`;
  $("radar-value").textContent = `${state.radar} / 100`;
  $("boundary-value").textContent = `${state.boundary} / 100`;
  $("chain-value").textContent = state.chain;
  $("score-value").textContent = state.score;
  updateBar("heart-bar", state.heart); updateBar("radar-bar", state.radar); updateBar("boundary-bar", state.boundary);
}
function startGame() {
  state.roundCount = Number($("round-count").value); state.roundIndex = 0; state.deck = shuffle(EVENTS);
  state.heart = 42; state.radar = 28; state.boundary = 50; state.chain = 0; state.score = 0;
  showScreen("play"); nextEvent();
}
function nextEvent() {
  if (state.roundIndex >= state.roundCount) return finishGame();
  state.event = state.deck[state.roundIndex % state.deck.length]; state.locked = false;
  const event = state.event; const character = characterFor(event);
  $("round-label").textContent = `第 ${state.roundIndex + 1} / ${state.roundCount} 則訊息`;
  $("round-progress").style.width = `${state.roundIndex / state.roundCount * 100}%`;
  $("event-badge").textContent = `${character.icon} ${event.type}`; $("event-badge").style.color = character.color;
  $("event-title").textContent = event.title; $("event-sender").textContent = `${character.handle} · 關係海域傳來一則訊息`;
  $("event-message").textContent = event.message; $("event-detail").textContent = event.detail; $("feedback").textContent = "";
  $("next-button").classList.add("hidden"); document.querySelectorAll(".choice").forEach((button) => { button.disabled = false; }); updateStatus();
}
function choiceComment(choice, best) {
  if (choice === 0) return best ? "這次的心動有根據，但還是記得看後續行動。" : "甜甜的餌，通常也會附贈一點點暈船。";
  if (choice === 1) return best ? "漂亮，先讓時間替你驗證。" : "不急著回，也是一種回覆。";
  return best ? "這個轉身，游得很有尊嚴。" : "你選擇先把自己放回第一順位。";
}
function choose(choice) {
  if (state.locked) return; state.locked = true; document.querySelectorAll(".choice").forEach((button) => { button.disabled = true; });
  const best = choice === state.event.best;
  if (choice === 0) { state.heart += 13; state.radar -= 8; state.boundary -= 7; state.score += 70 + state.chain * 12; state.chain += 1; }
  if (choice === 1) { state.heart += 4; state.radar += 8; state.boundary += 8; state.score += 105 + (best ? 20 : 0); state.chain = best ? state.chain + 1 : 0; }
  if (choice === 2) { state.heart -= 4; state.radar += 14; state.boundary += 12; state.score += 90 + (best ? 25 : 0); state.chain = best ? state.chain + 1 : 0; }
  state.heart = clamp(state.heart); state.radar = clamp(state.radar); state.boundary = clamp(state.boundary);
  $("feedback").textContent = `${choice === 0 ? "咬下去了！" : choice === 1 ? "你把餌翻過來看了一圈。" : "甩尾成功！"}　${choiceComment(choice, best)}`;
  $("next-button").classList.remove("hidden"); updateStatus();
}
function report() {
  if (state.boundary >= 78 && state.radar >= 65) return "自由海域型：你能靠近，也能清楚地保留自己的時間與界線。";
  if (state.boundary >= 68) return "深海觀察型：你願意感受心動，但不急著把訊息當成承諾。";
  if (state.heart >= 78 && state.boundary < 42) return "容易暈船型：感受力很強；下一趟游泳，記得替自己留一個出口。";
  if (state.boundary < 55) return "浪漫冒險型：你很勇敢地靠近，也可以練習在靠近前先問問自己。";
  return "平衡游法型：你正在找到心動與自我保護之間舒服的距離。";
}
function finishGame() {
  showScreen("result"); if (state.score > state.bestScore) { state.bestScore = state.score; localStorage.setItem("fish-best-score", state.bestScore); }
  let title = "自由潛水員 🌊", summary = "你沒有急著成為誰的特別，也沒有把孤單誤認成愛。\n海很大，慢慢游就好。";
  if (state.boundary >= 78 && state.radar >= 65) { title = "成功脫鉤 🐟"; summary = "你把魚鉤還給了海，也把自己的時間拿了回來。\n今天沒有上鉤，明天也不用急著上。"; }
  else if (state.heart >= 86 && state.radar < 32) { title = "被群發捕獲 🕸️"; summary = "你以為是命中注定，結果只是對方的群發名單很長。\n先休息一下，暈船不是你的錯，但下船要靠你。"; }
  else if (state.chain >= 4) { title = "海王／海后養成 👑"; summary = "你看穿了餌，也學會了不把每一次心動都當成承諾。"; }
  else if (state.heart >= 58) { title = "差點暈船 🌀"; summary = "心動是真的，警覺也是真的。\n你還沒有翻船，只是需要一點距離。"; }
  $("result-title").textContent = title; $("result-summary").textContent = summary;
  $("result-stats").innerHTML = `心動值 ${state.heart} / 100　·　警覺值 ${state.radar} / 100　·　界線值 ${state.boundary} / 100<br />本局分數 ${state.score}　·　魚餌連擊 ${state.chain}　·　最高分 ${state.bestScore}<br /><br /><strong>游法報告：</strong>${report()}`;
}

$("start-button").addEventListener("click", startGame); $("replay-button").addEventListener("click", startGame); $("title-button").addEventListener("click", () => showScreen("title")); $("quit-button").addEventListener("click", () => showScreen("title")); $("next-button").addEventListener("click", () => { state.roundIndex += 1; nextEvent(); });
$("how-button").addEventListener("click", () => { $("title-hint").textContent = "每回合閱讀一則關係誘餌，選擇：1 咬餌、2 先觀察、3 甩尾離場。心動不等於真心，警覺也不是冷漠。"; });
document.querySelectorAll(".choice").forEach((button) => button.addEventListener("click", () => choose(Number(button.dataset.choice))));
document.addEventListener("keydown", (event) => { if (state.screen === "title" && ["Enter", " "].includes(event.key)) startGame(); else if (state.screen === "play" && !state.locked && ["1", "2", "3"].includes(event.key)) choose(Number(event.key) - 1); else if (state.screen === "play" && state.locked && ["Enter", " "].includes(event.key)) { state.roundIndex += 1; nextEvent(); } else if (event.key === "Escape") showScreen("title"); });
updateStatus();
