const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/test", (request, response) => {
  response.json({ message: "Backend is working!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
