const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readUsers, saveUsers } = require("./middleware/routes/data/users");

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        message: "Enter a name, valid email, and password of at least 8 characters."
      });
    }

    const users = readUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(user => user.email === cleanEmail)) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      id: require("crypto").randomUUID(),
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword
    };

    users.push(newUser);
    saveUsers(users);

    return res.status(201).json({
      message: "Registration successful.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const users = readUsers();
    const cleanEmail = email.trim().toLowerCase();

    const user = users.find(item => item.email === cleanEmail);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

module.exports = { register, login };