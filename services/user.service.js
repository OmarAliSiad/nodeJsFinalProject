const User = require('../models/userModel');
const logger = require('../config/logger');

const singUp = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

const singIn = async (email, password) => {
    return await User.findOne({ email: email, password: password });
}
const getAllUsers = async (limit = 10, page = 1) => {
    const skip = (page - 1) * limit;
    return await User.find().limit(parseInt(limit)).skip(skip);
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const updateUser = async (id, userData) => {
    return await User.findByIdAndUpdate(id, userData, { new: true });
};

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};
/*
5.2 Password Reset Service
Add functions to services/users.js or create services/passwordReset.js:
generateResetToken() - Generate secure random token using crypto.randomBytes()
saveResetToken(userId, token) - Save token with expiration (15 minutes)
verifyResetToken(token) - Verify token validity
resetPassword(token, newPassword) - Reset password and clear token
*/

const generateResetToken = () => {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
}

const saveResetToken = async (userId, token) => {
    const expiration = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    return await User.findByIdAndUpdate(userId, {
        passwordResetToken: token,
        passwordResetExpires: new Date(expiration)
    }, { new: true });
}

const verifyResetToken = async (token) => {
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() } // token not expired
    });
    return user;
}

const resetPassword = async (token, newPassword) => {
    const user = await verifyResetToken(token);
    if (!user) {
        throw new logger.error('Invalid or expired token');
    }
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return await user.save();
}

// Search users with full-text search
const searchUsers = async (searchQuery, limit = 10, page = 1) => {
    const skip = (page - 1) * limit;
    const query = { $text: { $search: searchQuery } };

    const users = await User.find(query, {
        score: { $meta: "textScore" },
        password: 0  // Exclude password from results
    })
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .skip(skip);

    const total = await User.countDocuments(query);

    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

module.exports = {
    singUp,
    singIn,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    generateResetToken,
    saveResetToken,
    verifyResetToken,
    resetPassword,
    searchUsers
};
