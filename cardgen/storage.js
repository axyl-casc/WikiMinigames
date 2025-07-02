// Functions for persisting and retrieving card data
function loadStoredData() {
  const uploadEl = document.getElementById("tank-upload");
  const jsonUploadEl = document.getElementById("json-upload");
  const imgEl = document.getElementById("tank-image");
  const cardEl = document.getElementById("card");
  const storedImg = localStorage.getItem("robotCard:image");
  const storedJson = localStorage.getItem("robotCard:json");
  if (storedImg) {
    imgEl.src = storedImg;
    imgEl.style.display = "block";
    cardEl.style.display = "block";
  }
  if (storedJson) {
    try { window.robotInfo = JSON.parse(storedJson); } catch { }
  }
  if (storedImg || storedJson) {
    buildCard();
    if (!window.intervalId) window.intervalId = setInterval(buildCard, 60000);
  }
}

function updateCardFromStorage() {
  const imgEl = document.getElementById("tank-image");
  const cardEl = document.getElementById("card");
  const storedImg = localStorage.getItem("robotCard:image");
  const storedJson = localStorage.getItem("robotCard:json");
  if (storedImg && storedImg !== imgEl.src) {
    imgEl.src = storedImg;
    imgEl.style.display = "block";
    cardEl.style.display = "block";
  }
  if (storedJson) {
    try {
      const parsed = JSON.parse(storedJson);
      if (JSON.stringify(parsed) !== JSON.stringify(window.robotInfo)) {
        window.robotInfo = parsed;
      }
    } catch {}
  }
  buildCard();
}
