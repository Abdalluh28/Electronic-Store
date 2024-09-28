require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const corsOptions = require('./config/corsOptions');
const session = require('express-session');
const port = process.env.PORT || 3000;

const app = express();

connectDB();

// Middleware setup
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/', express.static('./public'));

// Routes
app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/password', require('./routes/passwordRoutes'));
app.use('/category', require('./routes/categoryRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/upload', require('./routes/uploadRoutes')); // Image upload
app.use('/orders', require('./routes/orderRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/favourite', require('./routes/favouriteRoutes'));
app.use('/payment', require('./routes/paymentRoutes'));


// Start server after MongoDB connection is established
mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
