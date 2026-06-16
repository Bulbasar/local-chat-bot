const express = require("express");
const router = express.Router();
const axios = require("axios");

const sequelize = require("../db");
const { getEmbedding } = require("../embeddings");
const { findMemory, upsertMemory } = require("../cognitive/memoryEngine");
const { runClustering } = require("../cognitive/clusteringEngine");

router.post("/", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: "Missing message or sessionId" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let full = "";
  let closed = false;

  const safeEnd = () => {
    if (!closed) {
      closed = true;
      res.write(`data: [DONE]\n\n`);
      res.end();
    }
  };

  try {
    // =========================
    // 1. MEMORY RETRIEVAL
    // =========================
    const embedding = await getEmbedding(message);
    const memories = await findMemory(sessionId, embedding);

    const memoryContext = memories.map((m) => `- ${m.content}`).join("\n");

    // =========================
    // 2. UPDATE MEMORY ACCESS
    // =========================
    await sequelize.query(
      `
      UPDATE memory
      SET access_count = access_count + 1,
          last_accessed = NOW()
      WHERE sessionid = $1
        AND is_active = TRUE
      `,
      {
        bind: [sessionId],
      },
    );

    // =========================
    // 3. STREAM LLM
    // =========================
    const response = await axios.post(
      `${process.env.OLLAMA_URL}/api/chat`,
      {
        model: process.env.OLLAMA_CHAT_MODEL,
        stream: true,
        messages: [
          {
            role: "system",
            content: `You are a persistent AI.\n\nRelevant Memory:\n${memoryContext}`,
          },
          { role: "user", content: message },
        ],
      },
      { responseType: "stream" },
    );

    // =========================
    // 4. STREAM TOKENS
    // =========================
    response.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const json = JSON.parse(line);
          const token = json.message?.content;

          if (token) {
            full += token;
            res.write(`data: ${JSON.stringify({ token })}\n\n`);
          }
        } catch {}
      }
    });

    // =========================
    // 5. END STREAM
    // =========================
    response.data.on("end", async () => {
      try {
        if (!full.trim()) return safeEnd();

        await sequelize.query(
          `
          INSERT INTO messages (id, role, content, sessionid, created_at)
          VALUES (gen_random_uuid(), $1, $2, $3, NOW())
          `,
          {
            bind: ["assistant", full, sessionId],
          },
        );

        if (message.length > 20) {
          await upsertMemory(message, sessionId, "episodic");
        }

        if (full.length > 30) {
          await upsertMemory(full, sessionId, "episodic");
        }

        try {
          await runClustering(sessionId);
        } catch (err) {
          console.log("[CLUSTER ERROR]", err.message);
        }

        safeEnd();
      } catch (err) {
        console.log("[END ERROR]", err);
        safeEnd();
      }
    });

    response.data.on("error", (err) => {
      console.log("[STREAM ERROR]", err);
      safeEnd();
    });
  } catch (err) {
    console.error("[CHAT ERROR]", err);
    safeEnd();
  }
});

module.exports = router;
