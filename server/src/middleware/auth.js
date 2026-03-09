const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized, no token provided!'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password').lean();

        if (!user.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'Account is deactivated'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized, token invalid'
        });
    }
};

const requireVerified = (req, res, next) => {
    if (!req.user.isVerified) {
        return res.status(403).json({
            status: 'error',
            message: 'Please verify your email to perform this action!'
        });
    }

    next();
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

module.exports = { protect, requireVerified, authorize };