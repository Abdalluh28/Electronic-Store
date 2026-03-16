require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
connectDB();

// --------- CORS Middleware ---------
// Use the official cors package
app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // cannot be true if origin is "*"
  })
);

// Handle preflight requests
app.options("*", cors());

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
