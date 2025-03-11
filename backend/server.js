const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// parsing JSON
app.use(express.json());

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// proxy endpoints for custom DB service

app.get("/api/db/get", async (req, res) => {
  const { key } = req.query;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
