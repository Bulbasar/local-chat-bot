const sequelize = require("../db");

async function runClustering(sessionId) {
  const [memories] = await sequelize.query(
    `
    SELECT content, type
    FROM memory
    WHERE sessionid = $1
      AND is_active = TRUE
    `,
    {
      bind: [sessionId],
    },
  );

  if (!memories || memories.length < 5) return;

  const identity = memories.filter(
    (m) => m.type === "identity" || m.type === "preference",
  );

  if (identity.length === 0) return;

  const summary = identity.map((m) => m.content).join("\n");

  await sequelize.query(
    `
    INSERT INTO memory_clusters (
      id,
      sessionid,
      cluster_type,
      summary,
      strength,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      $1,
      'identity',
      $2,
      0.8,
      NOW()
    );
    `,
    {
      bind: [sessionId, summary],
    },
  );
}

module.exports = { runClustering };
