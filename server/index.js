const express = require("express");
const usersRouter = require("./routes/users");
const contentRouter = require("./routes/content");
const shopRouter = require("./routes/shop");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Mount routers
app.use("/api/users", usersRouter);
app.use("/api/content", contentRouter);
app.use("/api/shop", shopRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

module.exports = app;
