require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT || 5000,
  },

  db: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },

  ollama: {
    url: process.env.OLLAMA_URL,
    chatModel: process.env.OLLAMA_CHAT_MODEL,
    embedModel: process.env.OLLAMA_EMBED_MODEL,
  },
};
