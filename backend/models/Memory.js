const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Memory = sequelize.define(
  "memory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // ❌ REMOVED embedding from Sequelize (pgvector only via raw SQL)

    sessionid: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "episodic",
    },

    importance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.5,
    },

    confidence: {
      type: DataTypes.FLOAT,
      defaultValue: 0.7,
    },

    access_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    last_accessed: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    decay_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.01,
    },

    content_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "memory",
    timestamps: false,
  },
);

module.exports = Memory;
