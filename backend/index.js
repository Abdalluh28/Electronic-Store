require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

const port = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
connectDB();

// --------- CORS Middleware ---------
// Allow all origins, methods, and headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow these HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow these headers
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// --------- Other Middleware ---------
app.use(cookieParser());
app.use(express.json());

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --------- Routes ---------
app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/password', require('./routes/passwordRoutes'));
app.use('/category', require('./routes/categoryRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/upload', require('./routes/uploadRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/favourite', require('./routes/favouriteRoutes'));
app.use('/payment', require('./routes/paymentRoutes'));

// --------- Start Server ---------
mongoose.connection.once('open', () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
