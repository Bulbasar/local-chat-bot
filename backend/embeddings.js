const axios = require("axios");
const config = require("./config");
const { normalizeVector } = require("./utils/normalizeVector");

async function getEmbedding(text) {
  const res = await axios.post(`${config.ollama.url}/api/embeddings`, {
    model: config.ollama.embedModel,
    prompt: text,
  });

  const emb = res.data.embedding;

  if (!Array.isArray(emb)) {
    throw new Error("Invalid embedding response");
  }

  // 🔥 normalize for cosine stability
  return normalizeVector(emb);
}

module.exports = { getEmbedding };
