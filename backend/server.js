const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const morgan = require("morgan");
const offerLetters = require("./routes/offerLetters");
const certificates = require("./routes/certificates");
const transactions = require("./routes/transactions");
const dashboard = require("./routes/dashboard");
const meetings = require("./routes/meetings");
const announcements = require("./routes/announcements");
const testimonials = require("./routes/testimonials");
const tasks = require("./routes/tasks");
const assignedTasks = require("./routes/assignedTasks");
const path = require("path");
const mongoose = require("mongoose");
const PaymentOption = require("./models/PaymentOption");
const sendEmail = require("./utils/sendEmail");
const fs = require("fs");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

// Trust proxy for accurate IP detection (important for rate limiting behind reverse proxies like Render)
app.set("trust proxy", 1);

// Use morgan logging in development for requests
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Set secure HTTP headers
app.use(helmet());

// Prevent HTTP parameter pollution
app.use(hpp());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Gzip compression for responses
app.use(compression());

// Enable CORS with configured frontend origin(s)
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://studentera.live",
  "http://localhost:3000",
  "https://studentera.live",
  "http://localhost:3001", // Add additional localhost port if needed
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting: apply to auth routes later, but set a reasonable default
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Apply default rate limiter to all API routes
app.use("/api", apiLimiter);

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images/users", express.static(path.join(__dirname, "images/users")));

// Mount routers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/meetings", meetings);
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/certificates", certificates);
app.use("/api/offer-letters", offerLetters);
app.use("/api/profile", require("./routes/profile"));
app.use("/api/dashboard", dashboard);
app.use("/api/applications", require("./routes/applications"));
app.use("/api/transactions", transactions);
app.use("/api/internships", require("./routes/internships"));
app.use("/api/testimonials", testimonials);
app.use("/api/announcements", announcements);
app.use("/api/tasks", tasks);
app.use("/api/assigned-tasks", assignedTasks);
app.use("/api/contact-queries", require("./routes/contactQueries"));
app.use("/api/help-queries", require("./routes/helpQueries"));
app.use("/api/payment-options", require("./routes/paymentOptions"));
app.use(
  "/api/account-deletion-requests",
  require("./routes/accountDeletionRequests")
);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Student Era Backend API is running!",
    version: "1.0.0",
    status: "active",
  });
});

// Redirect legacy reset-password links to the frontend reset page.
// This helps when emails link to the backend host (e.g., during development)
app.get("/reset-password/:resettoken", (req, res) => {
  const token = req.params.resettoken;
  const frontendBase =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV !== "production"
      ? "http://localhost:3000"
      : `${req.protocol}://${req.get("host")}`);
  // Redirect to the frontend reset route
  return res.redirect(
    `${frontendBase.replace(/\/$/, "")}/reset-password/${token}`
  );
});

// Serve frontend
if (process.env.NODE_ENV === "production") {
  const possiblePaths = [
    path.join(__dirname, "../../frontend/build"), // your original
    path.join(__dirname, "../frontend/build"),
    path.join(__dirname, "frontend/build"),
    path.join(__dirname, "..", "build"), // sometimes build is placed differently
    path.join(__dirname, "build"),
  ];

  const frontendPath = possiblePaths.find((p) => fs.existsSync(p));
  if (!frontendPath) {
    console.warn(
      "Frontend build not found in expected paths. Checked:\n" +
        possiblePaths.join("\n")
    );
  } else {
    console.log("Serving frontend from:", frontendPath);
    app.use(express.static(frontendPath));

    // IMPORTANT: This catch-all sends index.html for any non-API / non-upload route.
    app.get("*", (req, res, next) => {
      // let API, uploads, images, and other static endpoints be handled normally
      const skipPrefixes = ["/api", "/uploads", "/images", "/static"]; // add any other static prefixes you use
      if (skipPrefixes.some((prefix) => req.path.startsWith(prefix)))
        return next();

      // serve index.html for everything else (React Router handles client-side routes)
      return res.sendFile(path.join(frontendPath, "index.html"));
    });
  }
}

// Optional email test endpoint - enable by setting ENABLE_EMAIL_TEST=true in env
if (process.env.ENABLE_EMAIL_TEST === "true") {
  app.post("/api/email-test", async (req, res) => {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide an email in the body.",
        });
    try {
      const info = await sendEmail({
        email,
        subject: "Student Era - Test Email",
        message: "This is a test email from Student Era.",
        html: "<p>This is a test email from <strong>Student Era</strong>.</p>",
      });
      return res
        .status(200)
        .json({ success: true, message: "Test email sent", info });
    } catch (err) {
      console.error("Email test failed:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: err.message || "Failed to send test email",
        });
    }
  });
}

// Handle 404 for undefined routes (should be last)
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler (should be last)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// After DB connect, ensure default payment option
mongoose.connection.once("open", async () => {
  await PaymentOption.ensureDefault();
});


// inside app.js or a small route file
app.get('/test-smtp', async (req, res) => {
  const net = require('net');
  const socket = net.createConnection(587, 'smtp.gmail.com');
  socket.setTimeout(10000);
  socket.on('connect', () => {
    res.send('Connected to smtp.gmail.com:587 ✅');
    socket.end();
  });
  socket.on('timeout', () => {
    res.status(504).send('Connection timed out ❌');
    socket.destroy();
  });
  socket.on('error', (err) => {
    res.status(500).send('Connection error: ' + err.message);
  });
});
