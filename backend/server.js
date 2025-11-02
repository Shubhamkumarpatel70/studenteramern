const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const offerLetters = require('./routes/offerLetters');
const certificates = require('./routes/certificates');
const transactions = require('./routes/transactions');
const dashboard = require('./routes/dashboard');
const meetings = require('./routes/meetings');
const announcements = require('./routes/announcements');
const testimonials = require('./routes/testimonials');
const tasks = require('./routes/tasks');
const assignedTasks = require('./routes/assignedTasks');
const path = require('path');
const mongoose = require('mongoose');
const PaymentOption = require('./models/PaymentOption');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Use morgan logging in development for requests
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
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
  process.env.FRONTEND_URL || 'https://studentera.live',
  'http://localhost:3000'
];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

// Apply default rate limiter to all API routes
app.use('/api', apiLimiter);

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images/users', express.static(path.join(__dirname, 'images/users')));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/meetings', meetings);
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/certificates', certificates);
app.use('/api/offer-letters', offerLetters);
app.use('/api/profile', require('./routes/profile'));
app.use('/api/dashboard', dashboard);
app.use('/api/applications', require('./routes/applications'));
app.use('/api/transactions', transactions);
app.use('/api/internships', require('./routes/internships'));
app.use('/api/testimonials', testimonials);
app.use('/api/announcements', announcements);
app.use('/api/tasks', tasks);
app.use('/api/assigned-tasks', assignedTasks);
app.use('/api/contact-queries', require('./routes/contactQueries'));
app.use('/api/help-queries', require('./routes/helpQueries'));
app.use('/api/payment-options', require('./routes/paymentOptions'));
app.use('/api/account-deletion-requests', require('./routes/accountDeletionRequests'));

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Student Era Backend API is running!',
        version: '1.0.0',
        status: 'active'
    });
});

// Redirect legacy reset-password links to the frontend reset page.
// This helps when emails link to the backend host (e.g., during development)
app.get('/reset-password/:resettoken', (req, res) => {
  const token = req.params.resettoken;
  const frontendBase = process.env.FRONTEND_URL || process.env.CLIENT_URL || (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : `${req.protocol}://${req.get('host')}`);
  // Redirect to the frontend reset route
  return res.redirect(`${frontendBase.replace(/\/$/, '')}/reset-password/${token}`);
});

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/build');
    app.use(express.static(frontendPath));
    // Serve index.html for any unknown route (except API and uploads)
    app.get(/^\/(?!api|uploads).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// Handle 404 for undefined routes (should be last)
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: `Route ${req.originalUrl} not found` 
    });
});

// Global error handler (should be last)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// After DB connect, ensure default payment option
mongoose.connection.once('open', async () => {
  await PaymentOption.ensureDefault();
}); 