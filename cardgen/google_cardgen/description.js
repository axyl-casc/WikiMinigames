// Functions related to describing the robot card
function generateBotDescription(botData) {
  const countryEmojiMap = {
    us: "\uD83C\uDDFA\uD83C\uDDF8", // United States
    dk: "\uD83C\uDDE9\uD83C\uDDF0", // Denmark
    ca: "\uD83C\uDDE8\uD83C\uDDE6", // Canada
    gb: "\uD83C\uDDEC\uD83C\uDDE7", // United Kingdom
    de: "\uD83C\uDDE9\uD83C\uDDEA", // Germany
    fr: "\uD83C\uDDEB\uD83C\uDDF7", // France
    jp: "\uD83C\uDDEF\uD83C\uDDF5", // Japan
    cn: "\uD83C\uDDE8\uD83C\uDDF3", // China
    in: "\uD83C\uDDEE\uD83C\uDDF3", // India
    kr: "\uD83C\uDDF0\uD83C\uDDF7", // South Korea
    br: "\uD83C\uDDE7\uD83C\uDDF7", // Brazil
    se: "\uD83C\uDDF8\uD83C\uDDEA"  // Sweden
  };

  const languageEmojiMap = {
    "Java": "\u2615",
    "Java 11": "\u2615",
    "C": "\uD83D\uDCBE",
    "C++": "\uD83D\uDCBB",
    "Python": "\uD83D\uDC0D",
    "Python 3": "\uD83D\uDC0D"
  };

  const {
    name,
    version,
    authors = [],
    description = "",
    homepage = "",
    countryCodes = [],
    platform = "",
    programmingLang = ""
  } = botData;

  const flagEmojis = countryCodes.length > 0
    ? countryCodes.map(code => countryEmojiMap[code.toLowerCase()] || `\u26f3\uFE0F(${code})`).join(" ")
    : "";
  const authorList = authors.length > 0
    ? authors.map(name => `<div class="author">\uD83D\uDC64 ${name}</div>`).join("")
    : "";
  const languageEmoji = languageEmojiMap[programmingLang] || "\uD83D\uDCA1";
  const siteLink = homepage ? `<a href="${homepage}" target="_blank">Visit Site</a>` : "";

  return `
        <div style="
          background: #fbeec1;
          border: 4px solid #333;
          border-radius: 12px;
          padding: 16px;
          font-family: 'Verdana', sans-serif;
          box-shadow: 3px 3px 10px rgba(0,0,0,0.3);
          color: #222;
        ">
          <div style="font-size: 1.2em; font-weight: bold;">\uD83E\uDD16 ${name || "Unnamed Bot"} ${version ? `<span style="font-size: 0.7em;">v${version}</span>` : ""}</div>
          ${flagEmojis ? `<div style="margin: 8px 0;">${flagEmojis}</div>` : ""}
          ${authorList ? `<div style="margin-bottom: 8px;">${authorList}</div>` : ""}
          ${description ? `<div style="font-style: italic; margin-bottom: 12px;">${description}</div>` : ""}
          ${programmingLang ? `<div><strong>\uD83D\uDCBB Language:</strong> ${languageEmoji} ${programmingLang}</div>` : ""}
          ${siteLink ? `<div><strong>\uD83C\uDF10 Website:</strong> ${siteLink}</div>` : ""}
        </div>
      `;
}

function renderRobotMeta() {
  const metaEl = document.getElementById("robot-meta");
  if (!window.robotInfo) {
    metaEl.style.display = "none";
    metaEl.innerHTML = "";
    return;
  }
  metaEl.style.display = "block";
  metaEl.innerHTML = generateBotDescription(window.robotInfo);
}
