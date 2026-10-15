require("dotenv").config();

const express = require("express");
const authRoutes = require("./authRoutes");

if (!process.env.JWT_SECRET ||
    process.env.JWT_SECRET === "replace_with_a_long_random_secret") {
  console.error("Please set a private JWT_SECRET in your .env file.");
  process.exit(1);
}

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "User Authentication API is running." });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});