const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./db");

const chatRoute = require("./routes/chat");
const memoryRoute = require("./routes/memory");
const memoryActionsRoute = require("./routes/memoryActions");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);
app.use("/api/memory", memoryRoute);
app.use("/api/memory-actions", memoryActionsRoute);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  await sequelize.authenticate();
  console.log("DB connected");

  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running");
  });
}

start();
