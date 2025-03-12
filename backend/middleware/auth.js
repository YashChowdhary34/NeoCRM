require("dotenv").config();
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const authLogger = require("../utils/auditLogger");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // log error
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

exports.signup = async (req, res, next) => {
  try {
    if (req.body.email === process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: "Cannot register admin email" });
    }

    const response = await axios.post("http://localhost:8080/signup", req.body);

    const token = jwt.sign(
      { email: req.body.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        email: req.body.email,
        role: "user",
      },
    });
  } catch (err) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const response = await axios.post("http://localhost:8080/login", res.body);

    if (response.data.status === "authenticated") {
      const token = jwt.sign(
        { email: req.body.email, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      authLogger.info(`User login: ${req.body.email}`);
      return res.json({
        token,
        user: {
          email: req.body.email,
          role: "user",
        },
      });
    }

    res.status(response.status).json(response.data);
  } catch (err) {
    next(err);
  }
};
