// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyAdmin = (req, res, next) => {


    const userInfo = JSON.parse(req.cookies.userInfo)
    if (req.cookies && req.cookies.userInfo && userInfo.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'Not authorized as an admin' });
    }
};

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Forbidden' });
        }

        
        // Attach decoded token to request object if needed
        req.user = await User.findById(decoded.userInfo.id);
        next();
    });
};

module.exports = { verifyAdmin, verifyJWT };
