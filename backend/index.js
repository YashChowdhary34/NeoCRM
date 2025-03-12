require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");

// user-defined
const rateLimiter = require("./middleware/rateLimiter");
const validate = require("./middleware/validation");
const auditLogger = require("./utils/auditLogger");
const auth = require("./middleware/auth");
const { createLogger } = require("./config/logger");

const app = express();
const logger = createLogger();

//security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ratelimit
app.use("/api/", rateLimiter.apiLimiter);

// admin bypass
const checkAdminCredentials = (req, res, next) => {
  if (req.body.email === process.env.ADMIN_EMAIL) {
    if (req.body.password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      auditLogger.info(`Admin login: ${process.env.ADMIN_EMAIL}`);
      return res.json({
        token,
        user: {
          name: "Admin User",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
        },
      });
    }
    auditLogger.warn(`Invalid admin login attempt: ${process.env.ADMIN_EMAIL}`);
    return res.status(401).json({ error: "Invalid admin credentials" });
  }
  next();
};

// Validation Schemas
const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// login/sign-up api endpoints
app.post("/api/signup", validate.validateRequest(signupSchema), auth.signup);

app.post(
  "/api/login",
  validate.validateRequest(loginSchema),
  checkAdminCredentials,
  auth.login
);

// protected test endpoint
app.get("/api/protected", auth.authenticateToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.email} (${req.user.role})`,
  });
});

// error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  auditLogger.error(`Server error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// start https server
const sslOptions = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.cert"),
};
https.createServer(sslOptions, app).listen(process.env.PORT, () => {
  logger.info(`CRM Backend running securely on port ${process.env.PORT}`);
});
