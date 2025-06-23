function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }

  return [h, s, l];
}

function hslToRgb(h, s, l) {
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : (l + s - l * s);
    const p = 2 * l - q;
    r = hue2rgb(p, q, (h / 360 + 1/3));
    g = hue2rgb(p, q, (h / 360));
    b = hue2rgb(p, q, (h / 360 - 1/3));
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Example: Find complementary of RGB(125, 10, 200)
const originalRgb = [125, 10, 200];
const [h, s, l] = rgbToHsl(...originalRgb);
const complementaryHue = (h + 180) % 360;
const complementaryRgb = hslToRgb(complementaryHue, s, l);

console.log(`Original RGB: ${originalRgb}`);
console.log(`Complementary RGB: ${complementaryRgb}`);




/**
 * Save a score for the given game only if it's greater than the current high score.
 * - gameID: any string (e.g. "dodge", "tank")
 * - score: a number (must be comparable with greater-than operator)
 */
function saveScore(gameID, score) {
  if (!gameID) throw new Error("saveScore: gameID is required");
  if (typeof score !== 'number') throw new Error("saveScore: score must be a number");
  
  const currentHighScore = getScore(gameID);
  if (score > currentHighScore) {
    localStorage.setItem(`score:${gameID}`, JSON.stringify(score));
  }
}

/**
 * Retrieve the previously saved high score.
 * Returns 0 if no score has been saved yet.
 */
function getScore(gameID) {
  if (!gameID) throw new Error("getScore: gameID is required");
  
  const raw = localStorage.getItem(`score:${gameID}`);
  return raw === null ? 0 : JSON.parse(raw);
}