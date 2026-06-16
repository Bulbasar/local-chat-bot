const axios = require("axios");
const config = require("./config");

async function askLLM(messages) {
  const res = await axios.post(`${config.ollama.url}/api/chat`, {
    model: config.ollama.chatModel,
    messages,
    stream: false,
  });

  return res.data.message.content;
}

module.exports = { askLLM };
