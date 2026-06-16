function toVectorString(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return "[0]";
  }

  const clean = arr.map((v) => Number(v) || 0);

  return `[${clean.join(",")}]`;
}

module.exports = { toVectorString };
