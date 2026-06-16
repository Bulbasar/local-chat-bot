const express = require("express");
const router = express.Router();
const sequelize = require("../db");

// BOOST
router.post("/boost/:id", async (req, res) => {
  const { id } = req.params;

  await sequelize.query(
    `
    UPDATE memory
    SET importance = LEAST(1.0, importance + 0.15),
        access_count = access_count + 1,
        last_accessed = NOW()
    WHERE id = ?
    `,
    { replacements: [id] },
  );

  res.json({ status: "boosted" });
});

// FORGET
router.post("/forget/:id", async (req, res) => {
  const { id } = req.params;

  await sequelize.query(
    `
    UPDATE memory
    SET is_active = FALSE,
        importance = 0
    WHERE id = ?
    `,
    { replacements: [id] },
  );

  res.json({ status: "forgotten" });
});

// GET ONE
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await sequelize.query(
    `
    SELECT * FROM memory WHERE id = ?
    `,
    { replacements: [id] },
  );

  res.json(rows[0] || null);
});

module.exports = router;
