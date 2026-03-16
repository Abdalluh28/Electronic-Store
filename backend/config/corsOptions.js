const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman, mobile apps, server-to-server)
    if (!origin || allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
