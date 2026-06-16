const sequelize = require("../db");

async function runDecay() {
  await sequelize.query(`
    UPDATE memory
    SET importance = GREATEST(0.05, importance - decay_rate)
    WHERE is_active = TRUE
      AND type != 'identity'
      AND last_accessed < NOW() - INTERVAL '1 day';
  `);

  await sequelize.query(`
    UPDATE memory
    SET is_active = FALSE
    WHERE importance < 0.1;
  `);

  console.log("[DECAY] executed");
}

module.exports = { runDecay };
