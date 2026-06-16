function scoreImportance(text) {
  let score = 0.5;

  if (/name is|i am|call me/i.test(text)) score += 0.4;
  if (/work|developer|engineer|student/i.test(text)) score += 0.3;
  if (/like|love|hobby/i.test(text)) score += 0.2;
  if (text.length < 60) score += 0.1;

  return Math.min(1, score);
}

module.exports = { scoreImportance };
