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
app.use(cors());

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    // ... existing code ...
}

// After DB connect, ensure default payment option
mongoose.connection.once('open', async () => {
  await PaymentOption.ensureDefault();
}); 