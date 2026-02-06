const userService = require('../services/user.service');
const AppError = require('../utils/AppError')
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailSMTP = require('../services/email_services.js');
const asyncHandler = require('../utils/asyncHandler');

//3.5 Integration Points
// Call sendWelcomeEmail() in user sign-up controller
// Call sendPasswordResetEmail() in password reset flow
// Call notification emails in comment creation
const singUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password || !age) {
        return next(new AppError('All fields required', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('User already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Call sendWelcomeEmail() in user sign-up controller
    await emailSMTP.sendWelcomeEmail({ name, email });
    const user = await userService.singUp({
        name,
        email,
        password: hashedPassword,
        age
    });

    res.status(201).json(user);


});


const singIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError('Invalid password', 401));
    }

    const payload = { id: user._id, role: user.role, name: user.name };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({ message: 'User logged in successfully', token });

});

// Call sendPasswordResetEmail() in password reset flow
const resetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await emailSMTP.sendPasswordResetEmail(user, resetToken);
    res.status(200).json({ message: 'Password reset email sent successfully' });
});


const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await userService.getAllUsers(req.query.limit, req.query.page);
    if (!users || users.length === 0) {
        return next(new AppError('No users found', 404));
    }
    res.status(200).json({
        message: 'Users fetched successfully',
        data: users
    });
});

const getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('User ID is required', 404));
    }
    const user = await userService.getUserById(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        message: 'User fetched successfully',
        data: user
    });
});

const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('User ID is required', 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await userService.updateUser(id, req.body);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('User ID is required', 400));
    }
    const user = await userService.deleteUser(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ message: 'User deleted successfully' });

});

// Add functions to controllers/users.js:
// forgotPassword(req, res) - Request password reset
// resetPassword(req, res) - Reset password with token
// changePassword(req, res) - Change password when logged in 

const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    const token = userService.generateResetToken();
    await userService.saveResetToken(user._id, token);
    await emailSMTP.sendPasswordResetEmail(user, token);
    res.status(200).json({ message: 'Password reset email sent successfully' });
});

const resetPasswordController = asyncHandler(async (req, res, next) => {
    const { token, newPassword } = req.body;
    const user = await userService.resetPassword(token, newPassword);
    if (!user) {
        return next(new AppError('Invalid or expired token', 400));
    }
    res.status(200).json({ message: 'Password reset successfully' });
});

const changePassword = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return next(new AppError('Current password is incorrect', 400));
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
});

const searchUsers = asyncHandler(async (req, res, next) => {
    const { q, limit, page } = req.query;

    const result = await userService.searchUsers(q, parseInt(limit) || 10, parseInt(page) || 1);

    res.status(200).json(result);
});

module.exports = {
    singUp,
    singIn,
    resetPassword,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPasswordController,
    changePassword,
    searchUsers
};

