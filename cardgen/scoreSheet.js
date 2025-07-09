// Utilities for handling Robocode-style score sheets

/**
 * @typedef {Object} ScoreRow
 * @property {number} rank          // Field 1
 * @property {string} name          // Field 2
 * @property {number} survival      // Field 3
 * @property {number} lastSurvivor  // Field 4
 * @property {number} bullet        // Field 5
 * @property {number} bonus         // Field 7
 * @property {string} raw           // Original line
 */

/**
 * Parse a raw score sheet string produced by a tournament.
 * Each line should be tab separated with the fixed field order described
 * in the README. Only the first seven columns are used.
 *
 * @param {string} raw
 * @returns {ScoreRow[]}
 */
function parseScoreSheet(raw) {
  if (typeof raw !== 'string') return [];
  return raw
    .trim()
    .split(/\r?\n/) // split on newlines
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('\t');
      return {
        rank: Number(parts[0]) || 0,
        name: parts[1] || '',
        survival: Number(parts[2]) || 0,
        lastSurvivor: Number(parts[3]) || 0,
        bullet: Number(parts[5]) || 0,
        bonus: Number(parts[6]) || 0,
        raw: line,
      };
    });
}

/**
 * Parse the given score sheet string and persist it under
 * localStorage['botScoreSheet'].
 *
 * @param {string} raw
 */
function saveScoreSheet(raw) {
  const scores = parseScoreSheet(raw);
  try {
    localStorage.setItem('botScoreSheet', JSON.stringify(scores));
  } catch (err) {
    console.error('Failed to store score sheet', err);
  }
}

/**
 * Get tint information for a particular row relative to the entire sheet.
 * This computes tints for survival (green), bullet damage (blue) and bonus
 * (orange) according to the specification.
 *
 * @param {ScoreRow} row  The row to evaluate
 * @param {ScoreRow[]} all  All rows from the sheet
 * @returns {{survivalTint:string, bulletTint:string, bonusTint:string}}
 */
function getTintInfo(row, all) {
  if (!row || !Array.isArray(all) || all.length === 0) {
    return { survivalTint: '', bulletTint: '', bonusTint: '' };
  }

  const survivalValues = all.map((r) => r.survival);
  const bonusValues = all.map((r) => r.bonus);
  const bulletValues = all.map((r) => r.bullet);

  const minSurvival = Math.min.apply(null, survivalValues);
  const maxSurvival = Math.max.apply(null, survivalValues);
  const minBonus = Math.min.apply(null, bonusValues);
  const maxBonus = Math.max.apply(null, bonusValues);
  const maxBullet = Math.max.apply(null, bulletValues);

  const survivalRange = maxSurvival - minSurvival || 1;
  const bonusRange = maxBonus - minBonus || 1;

  const survRatio = (row.survival - minSurvival) / survivalRange;
  const bonusRatio = (row.bonus - minBonus) / bonusRange;

  const survivalOpacity = Math.max(0, Math.min(1, survRatio)) * 0.3;
  const bonusOpacity = Math.max(0, Math.min(1, bonusRatio)) * 0.3;

  const survivalTint =
    survivalOpacity > 0
      ? `rgba(0,255,0,${survivalOpacity.toFixed(2)})`
      : '';
  const bonusTint =
    bonusOpacity > 0 ? `rgba(255,165,0,${bonusOpacity.toFixed(2)})` : '';
  const bulletTint = row.bullet === maxBullet ? 'rgba(0,0,255,0.3)' : '';

  return { survivalTint, bulletTint, bonusTint };
}

// expose globals for non-module usage
window.parseScoreSheet = parseScoreSheet;
window.saveScoreSheet = saveScoreSheet;
window.getTintInfo = getTintInfo;

