const { default: axios } = require("axios");
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

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
  if (!key) {
    return res.status(400).json({ error: "Missing key parameter" });
  }
  try {
    const response = await axios.get(
      `http://db:8080/get?key=${encodeURIComponent(key)}`
    );
    res.json({ key, value: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/db/set", async (req, res) => {
  const { key, value } = req.query;
  if (!key) {
    return res.status(400).json({ error: "Missing key parameter" });
  }
  try {
    await axios.get(
      `http://db:8080/set?key=${encodeURIComponent(
        key
      )}&value=${encodeURIComponent(value)}`
    );
    res.json({ message: "DB set successfully", key, value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/db/delete", async (req, res) => {
  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ error: "Missing key parameter" });
  }
  try {
    await axios.get(`http://db:8080/delete?key=${encodeURIComponent(key)}`);
    res.json({ message: "DB delete successful", key });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// proxy endpoint for ai microservice
app.get("/api/ai/sentiment", async (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ message: "Missing text parameter" });
  }
  try {
    const response = await axios.get(
      `http://ai:8000/sentiment/?text=${encodeURIComponent(text)}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// auth routes
app.use("/api/auth", authRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authorized!` });
});

// listen to endpoint
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
