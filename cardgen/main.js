// Main logic for the card generator
const GAME_IDS = [1, 2, 3, 4];
const MAX_SCORES = { 1: 30, 2: 30, 3: 4, 4: 30 };
const MAX_TOTAL = Object.values(MAX_SCORES).reduce((a, b) => a + b, 0);
window.codeBonus = 0;
window.robotInfo = null;
window.intervalId = null;
const ROLE_COLORS = {
  Explorer: [128, 128, 128],
  Achiever: [0, 128, 128],
  Competitor: [218, 165, 32],
  Harmonizer: [0, 128, 0],
};
const ROLE_EMOJIS = {
  Explorer: "✨",
  Achiever: "🏆",
  Competitor: "🔥",
  Harmonizer: "🤝",
};

function starsForScore(score, max) {
  if (score >= max) return 3;
  if (score >= max * 0.8) return 2;
  if (score >= max * 0.5) return 1;
  return 0;
}

function updateCodeBonus() {
  const code = document.getElementById("code-input").value.trim();
  if (/^\d.*[abc]$/.test(code)) {
    window.codeBonus = (code.match(/%/g) || []).length;
  } else {
    window.codeBonus = 0;
  }
}

function buildCard() {
  const statsEl = document.getElementById("stats");
  const starEl = document.getElementById("star-rating");
  const roleTitleEl = document.getElementById("player-role");
  statsEl.innerHTML = "";

  renderRobotMeta();

  let total = 0;
  let starTotal = 0;
  GAME_IDS.forEach((id) => {
    const score = getScore(id) || 0;
    total += score;
    starTotal += starsForScore(score, MAX_SCORES[id]);
  });

  updateCodeBonus();

  let rank = 0;
  if (window.robotInfo) {
    try {
      const sheet = JSON.parse(localStorage.getItem("botScoreSheet") || "[]");
      const me = sheet.find(
        (r) => r.name === `${window.robotInfo.name} ${window.robotInfo.version}`
      );
      if (me) rank = me.rank || 0;
    } catch {}
  }

  const baseStars = Math.min(12, starTotal + window.codeBonus);
  const starCount = Math.max(0, baseStars - rank);
  starEl.textContent = "★".repeat(starCount);

  const hue = Math.max(0, Math.min(120, total));
  let [r1, g1, b1] = hslToRgb(hue, 0.65, 0.4);
  let [r2, g2, b2] = hslToRgb(hue, 0.65, 0.6);
  const role = localStorage.getItem("robotCard:role") || "";
  roleTitleEl.textContent = ROLE_EMOJIS[role] || "";
  if (ROLE_COLORS[role]) {
    const [tr, tg, tb] = ROLE_COLORS[role];
    const mix = (c, t) => Math.round(c * 0.75 + t * 0.25);
    r1 = mix(r1, tr);
    g1 = mix(g1, tg);
    b1 = mix(b1, tb);
    r2 = mix(r2, tr);
    g2 = mix(g2, tg);
    b2 = mix(b2, tb);
  }
  const gradient = `linear-gradient(135deg, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`;
  const borderColor = `rgb(${r2}, ${g2}, ${b2})`;
  const cardEl = document.getElementById("card");
  cardEl.style.background = gradient;
  cardEl.style.borderColor = borderColor;
}

// DOM setup and event bindings
window.addEventListener('DOMContentLoaded', () => {
  const uploadEl = document.getElementById("tank-upload");
  const jsonUploadEl = document.getElementById("json-upload");
  const scoreSheetUploadEl = document.getElementById("scoresheet-upload");
  const imgEl = document.getElementById("tank-image");
  const cardEl = document.getElementById("card");
  const codeInputEl = document.getElementById("code-input");
  const editImgBtn = document.getElementById("edit-image-btn");
  const editJsonBtn = document.getElementById("edit-json-btn");
  const editSheetBtn = document.getElementById("edit-scoresheet-btn");

  codeInputEl.addEventListener("input", () => {
    updateCodeBonus();
    buildCard();
  });

  editImgBtn.addEventListener("click", () => uploadEl.click());
  editJsonBtn.addEventListener("click", () => jsonUploadEl.click());
  editSheetBtn.addEventListener("click", () => scoreSheetUploadEl.click());

  uploadEl.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      imgEl.src = ev.target.result;
      imgEl.style.display = "block";
      cardEl.style.display = "block";
      localStorage.setItem("robotCard:image", ev.target.result);
      buildCard();
      if (!window.intervalId) {
        window.intervalId = setInterval(buildCard, 60000);
      }
    };
    reader.readAsDataURL(file);
  });

  jsonUploadEl.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        window.robotInfo = JSON.parse(ev.target.result);
        localStorage.setItem("robotCard:json", ev.target.result);
      } catch (err) {
        alert("Invalid JSON file");
        window.robotInfo = null;
      }
      cardEl.style.display = "block";
      buildCard();
      if (!window.intervalId) {
        window.intervalId = setInterval(buildCard, 60000);
      }
    };
    reader.readAsText(file);
  });

  scoreSheetUploadEl.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      saveScoreSheet(ev.target.result);
      buildCard();
      if (!window.intervalId) {
        window.intervalId = setInterval(buildCard, 60000);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById("update-btn").addEventListener("click", updateCardFromStorage);

  document.getElementById("download-btn").addEventListener("click", () => {
    html2canvas(document.getElementById("card"), { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "robot_card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });

  loadStoredData();
});
