const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { avatar, displayName, bio, dateOfBirth, country, city } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (displayName) user.profile.displayName = displayName;
        if (bio !== undefined) user.profile.bio = bio;
        if (dateOfBirth) user.profile.dateOfBirth = dateOfBirth;
        if (country !== undefined) user.profile.country = country;
        if (city !== undefined) user.profile.city = city;
        if (avatar !== undefined) user.profile.avatar = avatar;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            body: user
        });
    } catch (error) {
        res.response(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide your current password and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'Password should be at least 6 characters'
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect password'
            });
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password has been changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username,
            isActive: true
        }).select('username profile.displayName profile.avatar profile.bio profile.joinDate');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide your password to confirm'
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Password is incorrect'
            });
        }

        user.isActive = false;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Account successfully deleted'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;

        const query = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const users = await User.find(query)
            .select('-password')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const total = await User.countDocuments(query);

        res.status(200).json({
            status: 'success',
            count: users.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['user', 'superuser', 'admin'].includes(role)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide a valid role (user, superuser, admin)'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                status: 'error',
                message: 'You cannot change your own role'
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'User role successfully updated',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide isActive as true of false'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                status: 'error',
                message: 'You cannot change your own status'
            });
        }

        user.isActive = isActive;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            meessage: error.meessage
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getPublicProfile,
    deleteAccount,
    getAllUsers,
    updateUserRole,
    updateUserStatus
};