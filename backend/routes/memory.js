const express = require("express");
const router = express.Router();
const sequelize = require("../db");

// =========================
// GET SESSION MEMORY (UI)
// =========================
router.get("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const [rows] = await sequelize.query(
      `
      SELECT 
        id,
        content,
        type,
        importance,
        access_count,
        last_accessed,
        created_at
      FROM memory
      WHERE sessionid = ?
        AND is_active = TRUE
      ORDER BY importance DESC, last_accessed DESC
      LIMIT 30;
      `,
      {
        replacements: [sessionId],
      },
    );

    res.json(rows);
  } catch (err) {
    console.error("[MEMORY FETCH ERROR]", err);
    res.status(500).json({ error: "Failed to fetch memory" });
  }
});

// =========================
// DEBUG: FULL MEMORY DUMP
// =========================
router.get("/", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `
      SELECT 
        id,
        content,
        type,
        importance,
        access_count,
        last_accessed,
        created_at,
        sessionid
      FROM memory
      WHERE is_active = TRUE
      ORDER BY created_at DESC
      LIMIT 100;
      `,
      {
        replacements: [],
      },
    );

    res.json(rows);
  } catch (err) {
    console.error("[MEMORY DUMP ERROR]", err);
    res.status(500).json({ error: "Failed to fetch memory dump" });
  }
});

module.exports = router;
