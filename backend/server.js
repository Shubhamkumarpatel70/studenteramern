const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
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

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: [
    'https://studenteramernfrontend.onrender.com',
    'https://studentera.live'
  ],
  credentials: true
}));

// Log CORS errors for debugging
app.use((err, req, res, next) => {
  if (err && err instanceof Error && err.message.includes('CORS')) {
    console.error('CORS error:', err.message);
    res.status(500).json({ message: 'CORS error', error: err.message });
  } else {
    next(err);
  }
});

// Handle preflight requests
app.options('*', cors({
  origin: [
    'https://studenteramernfrontend.onrender.com',
    'https://studentera.live'
  ],
  credentials: true
}));

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

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Student Era Backend API is running!',
        version: '1.0.0',
        status: 'active'
    });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: `Route ${req.originalUrl} not found` 
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

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/build');
    app.use(express.static(frontendPath));
    // Serve index.html for any unknown route (except API and uploads)
    app.get(/^\/(?!api|uploads).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// After DB connect, ensure default payment option
mongoose.connection.once('open', async () => {
  await PaymentOption.ensureDefault();
}); 