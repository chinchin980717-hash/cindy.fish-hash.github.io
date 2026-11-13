const ACTIONS = {
  bite: { label: "咬餌", display: "咬餌", className: "bite", heart: 13, radar: -8, boundary: -7, points: 70 },
  observe: { label: "先觀察", display: "觀察", className: "observe", heart: 4, radar: 8, boundary: 8, points: 105 },
  unhook: { label: "甩尾離場", display: "脫鉤（甩尾離場）", className: "leave", heart: -4, radar: 14, boundary: 12, points: 90 }
};

const state = {
  screen: "title", roundIndex: 0, roundCount: 8, deck: [], question: null, answers: [],
  locked: false, heart: 42, radar: 28, boundary: 50, chain: 0, score: 0,
  actionCounts: { bite: 0, observe: 0, unhook: 0 },
  bestScore: Number(localStorage.getItem("fish-best-score") || 0)
};
const $ = (id) => document.getElementById(id);
let questions = [];

function showScreen(name) {
  ["title", "play", "result"].forEach((screen) => $(screen + "-screen").classList.toggle("hidden", screen !== name));
  state.screen = name;
}
function clamp(value) { return Math.max(0, Math.min(100, value)); }
function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
function updateBar(id, value) { $(id).style.width = `${clamp(value)}%`; }
function updateStatus() {
  $("heart-value").textContent = `${state.heart} / 100`;
  $("radar-value").textContent = `${state.radar} / 100`;
  $("boundary-value").textContent = `${state.boundary} / 100`;
  $("chain-value").textContent = state.chain;
  $("score-value").textContent = state.score;
  updateBar("heart-bar", state.heart);
  updateBar("radar-bar", state.radar);
  updateBar("boundary-bar", state.boundary);
}
function startGame() {
  if (!questions.length) return;
  state.roundCount = Number($("round-count").value);
  state.roundIndex = 0;
  // 完整航程保留題庫順序，讓第 250 題作為真正的結局；短航程則隨機抽題。
  state.deck = state.roundCount === questions.length
    ? [...questions].sort((a, b) => a.id - b.id)
    : shuffle(questions).slice(0, state.roundCount);
  state.heart = 42; state.radar = 28; state.boundary = 50; state.chain = 0; state.score = 0;
  state.actionCounts = { bite: 0, observe: 0, unhook: 0 };
  showScreen("play"); nextQuestion();
}
function makeAnswerButton(answer, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice";
  button.dataset.choice = String(index);
  button.textContent = answer.text;
  button.setAttribute("aria-label", `回覆選項 ${index + 1}：${answer.text}`);
  button.addEventListener("click", () => choose(index));
  return button;
}
function nextQuestion() {
  if (state.roundIndex >= state.roundCount) return finishGame();
  state.question = state.deck[state.roundIndex]; state.locked = false;
  const question = state.question;
  state.answers = shuffle(question.answers);
  const gameFish = $("game-fish");
  gameFish.classList.remove("react-bite", "react-observe", "react-unhook");
  gameFish.setAttribute("aria-label", "正在游動的小魚");
  $("round-label").textContent = `第 ${state.roundIndex + 1} / ${state.roundCount} 題`;
  $("round-progress").style.width = `${state.roundIndex / state.roundCount * 100}%`;
  $("event-badge").textContent = `題庫第 ${question.id} 題`;
  $("event-title").textContent = question.title;
  $("event-sender").textContent = "關係海域傳來一則訊息 · 請選擇你會回覆的文字";
  $("event-message").textContent = question.scenario;
  $("event-detail").textContent = "先讀對方傳來的訊息，再挑一句你真的會說的話。魚的動作會在選擇後揭曉。";
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("next-button").classList.add("hidden");
  const choices = $("answer-choices"); choices.replaceChildren(...state.answers.map(makeAnswerButton));
  updateStatus();
}
function choose(index) {
  if (state.locked) return;
  state.locked = true;
  const answer = state.answers[index];
  const action = ACTIONS[answer.fishAction];
  const gameFish = $("game-fish");
  gameFish.classList.remove("react-bite", "react-observe", "react-unhook");
  void gameFish.offsetWidth;
  gameFish.classList.add(`react-${answer.fishAction}`);
  gameFish.setAttribute("aria-label", `小魚的動作：${action.display}`);
  document.querySelectorAll(".choice").forEach((button, i) => {
    button.disabled = true;
    if (i === index) button.classList.add("selected", action.className);
  });
  state.actionCounts[answer.fishAction] += 1;
  state.heart = clamp(state.heart + action.heart);
  state.radar = clamp(state.radar + action.radar);
  state.boundary = clamp(state.boundary + action.boundary);
  state.score += action.points + (answer.fishAction === "bite" ? state.chain * 12 : 0);
  state.chain = answer.fishAction === "bite" ? state.chain + 1 : 0;
  $("feedback").innerHTML = `<strong>魚的動作：${action.display}</strong>　·　心動 ${action.heart >= 0 ? "+" : ""}${action.heart}　警覺 ${action.radar >= 0 ? "+" : ""}${action.radar}　界線 ${action.boundary >= 0 ? "+" : ""}${action.boundary}<br><span>你的回覆：「${escapeHtml(answer.text)}」</span>`;
  $("feedback").classList.add(action.className);
  $("next-button").classList.remove("hidden");
  updateStatus();
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function report() {
  if (state.boundary >= 78 && state.radar >= 65) return "自由海域型：你能靠近，也能清楚地保留自己的時間與界線。";
  if (state.boundary >= 68) return "深海觀察型：你願意感受心動，但不急著把訊息當成承諾。";
  if (state.heart >= 78 && state.boundary < 42) return "容易暈船型：感受力很強；下一趟游泳，記得替自己留一個出口。";
  if (state.boundary < 55) return "浪漫冒險型：你很勇敢地靠近，也可以練習在靠近前先問問自己。";
  return "平衡游法型：你正在找到心動與自我保護之間舒服的距離。";
}
function finishGame() {
  showScreen("result");
  if (state.score > state.bestScore) { state.bestScore = state.score; localStorage.setItem("fish-best-score", state.bestScore); }
  let title = "自由潛水員 🌊", summary = "你沒有急著成為誰的特別，也沒有把孤單誤認成愛。\n海很大，慢慢游就好。";
  if (state.boundary >= 78 && state.radar >= 65) { title = "成功脫鉤 🐟"; summary = "你把魚鉤還給了海，也把自己的時間拿了回來。\n今天沒有上鉤，明天也不用急著上。"; }
  else if (state.heart >= 78 && state.boundary < 42) { title = "暈船中 🌀"; summary = "心動是真的；記得也替自己的時間與界線留一個位置。"; }
  else if (state.chain >= 4) { title = "連續咬餌達人 🎣"; summary = "你很願意靠近，也可以再看看對方的行動是否和訊息一致。"; }
  else if (state.heart >= 58) { title = "差點暈船 🌊"; summary = "心動和警覺都可以同時存在，給自己一點時間。"; }
  $("result-title").textContent = title; $("result-summary").textContent = summary;
  const counts = state.actionCounts;
  $("result-stats").innerHTML = `心動值 ${state.heart} / 100　·　警覺值 ${state.radar} / 100　·　界線值 ${state.boundary} / 100<br>本局分數 ${state.score}　·　最高分 ${state.bestScore}<br><br><strong>魚的動作統計：</strong>咬餌 ${counts.bite} 次　·　觀察 ${counts.observe} 次　·　脫鉤 ${counts.unhook} 次<br><br><strong>游法報告：</strong>${report()}`;
}

$("start-button").addEventListener("click", startGame);
$("replay-button").addEventListener("click", startGame);
$("title-button").addEventListener("click", () => showScreen("title"));
$("quit-button").addEventListener("click", () => showScreen("title"));
$("next-button").addEventListener("click", () => { state.roundIndex += 1; nextQuestion(); });
$("how-button").addEventListener("click", () => {
  $("title-hint").textContent = "先選一句你會傳出去的文字回覆；之後系統才揭曉魚是咬餌、觀察，還是脫鉤。沒有唯一標準答案。";
});
document.addEventListener("keydown", (event) => {
  if (state.screen === "title" && ["Enter", " "].includes(event.key)) startGame();
  else if (state.screen === "play" && !state.locked && ["1", "2", "3"].includes(event.key)) choose(Number(event.key) - 1);
  else if (state.screen === "play" && state.locked && ["Enter", " "].includes(event.key)) { state.roundIndex += 1; nextQuestion(); }
  else if (event.key === "Escape") showScreen("title");
});

fetch("questions.json")
  .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then((data) => {
    questions = data.questions || [];
    if (questions.length !== 250) throw new Error(`預期 250 題，實際載入 ${questions.length} 題`);
    $("round-count").innerHTML = `<option value="5">5 題｜快速試游</option><option value="8" selected>8 題｜標準航程</option><option value="10">10 題｜深海模式</option><option value="15">15 題｜暈船耐力賽</option><option value="30">30 題｜長程巡游</option><option value="60">60 題｜遠洋航程</option><option value="100">100 題｜半數題庫</option><option value="250">250 題｜完整題庫・最終章</option>`;
    $("start-button").disabled = false;
    $("bank-status").textContent = "250 題完整題庫已載入";
  })
  .catch((error) => {
    $("bank-status").textContent = `題庫載入失敗：${error.message}。請以網站或本機伺服器開啟。`;
    $("start-button").disabled = true;
    console.error("Question bank failed to load", error);
  });
$("start-button").disabled = true;
$("bank-status").textContent = "正在載入 250 題題庫…";
updateStatus();
