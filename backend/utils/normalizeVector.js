function normalizeVector(vec) {
  if (!Array.isArray(vec)) return vec;

  let sum = 0;

  for (const v of vec) {
    sum += v * v;
  }

  const norm = Math.sqrt(sum);

  if (!norm) return vec;

  return vec.map((v) => v / norm);
}

module.exports = { normalizeVector };
