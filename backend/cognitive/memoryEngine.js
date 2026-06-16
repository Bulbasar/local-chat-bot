const sequelize = require("../db");
const { getEmbedding } = require("../embeddings");
const { toVectorString } = require("../utils/vector");
const { hashContent } = require("./hash");
const { scoreImportance } = require("./scoring");

// ==========================
// FIND MEMORY (COSINE SEARCH)
// ==========================
async function findMemory(sessionId, embedding) {
  const vector = toVectorString(embedding);

  const [rows] = await sequelize.query(
    `
    SELECT 
      id, 
      content, 
      type, 
      importance, 
      access_count, 
      last_accessed
    FROM memory
    WHERE sessionid = $1
      AND is_active = TRUE
      AND embedding IS NOT NULL
    ORDER BY embedding <=> $2::vector
    ASC
    LIMIT 12;
    `,
    {
      bind: [sessionId, vector],
    },
  );

  return rows;
}

// ==========================
// UPSERT MEMORY
// ==========================
async function upsertMemory(content, sessionId, type = "episodic") {
  const emb = await getEmbedding(content);
  const vector = toVectorString(emb);
  const hash = hashContent(content);

  const [existing] = await sequelize.query(
    `
    SELECT id 
    FROM memory
    WHERE content_hash = $1
      AND sessionid = $2
      AND is_active = TRUE
    LIMIT 1;
    `,
    {
      bind: [hash, sessionId],
    },
  );

  // --------------------------
  // UPDATE EXISTING MEMORY
  // --------------------------
  if (existing.length > 0) {
    await sequelize.query(
      `
      UPDATE memory
      SET 
        access_count = access_count + 1,
        importance = LEAST(1.0, importance + 0.08),
        last_accessed = NOW()
      WHERE id = $1
      `,
      {
        bind: [existing[0].id],
      },
    );

    return;
  }

  const importance = scoreImportance(content);

  // --------------------------
  // INSERT NEW MEMORY
  // --------------------------
  await sequelize.query(
    `
    INSERT INTO memory (
      id,
      content,
      embedding,
      sessionid,
      type,
      importance,
      confidence,
      access_count,
      last_accessed,
      decay_rate,
      content_hash,
      is_active,
      version,
      created_at
    )
    VALUES (
      gen_random_uuid(),
      $1,
      $2::vector,
      $3,
      $4,
      $5,
      0.8,
      0,
      NOW(),
      0.01,
      $6,
      TRUE,
      1,
      NOW()
    );
    `,
    {
      bind: [content, vector, sessionId, type, importance, hash],
    },
  );
}

module.exports = { findMemory, upsertMemory };
