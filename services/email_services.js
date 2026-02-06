//services/email.js
const nodemailer = require('nodemailer');
const asyncHandler = require('../utils/asyncHandler');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Helper function to read and populate email templates
const loadTemplate = async (templateName, variables) => {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    let template = await fs.readFile(templatePath, 'utf-8');

    // Replace all template variables
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, variables[key] || '');
    });

    return template;
};

/*
TODO the service gmail it doesnot work use alternative service
sendWelcomeEmail(user) - Send welcome email after registration
sendPasswordResetEmail(user, resetToken) - Send password reset link
sendPasswordResetConfirmation(user) - Confirm password reset
sendCommentNotification(postAuthor, commenter, post, comment) - Notify post author of new comment
sendReplyNotification(commentAuthor, replier, comment, reply) - Notify comment author of reply
*/

sendWelcomeEmail = asyncHandler(async (user) => {
    const templateVariables = {
        username: user.name,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        facebookUrl: process.env.FACEBOOK_URL || '#',
        twitterUrl: process.env.TWITTER_URL || '#',
        linkedinUrl: process.env.LINKEDIN_URL || '#',
        year: new Date().getFullYear(),
        companyAddress: process.env.COMPANY_ADDRESS || 'Your Company Address'
    };

    const htmlContent = await loadTemplate('welcome', templateVariables);

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Welcome to Our Platform!',
        html: htmlContent,
        text: `Hello ${user.name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`
    };
    await transporter.sendMail(mailOptions);
});

sendPasswordResetEmail = asyncHandler(async (user, resetToken) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;

    const templateVariables = {
        username: user.name,
        resetUrl: resetLink,
        resetCode: resetToken.substring(0, 6).toUpperCase(), // First 6 chars as display code
        expiryTime: process.env.RESET_TOKEN_EXPIRY || '60',
        year: new Date().getFullYear(),
        companyAddress: process.env.COMPANY_ADDRESS || 'Your Company Address'
    };

    const htmlContent = await loadTemplate('passwordReset', templateVariables);

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Password Reset Request',
        html: htmlContent,
        text: `Hello ${user.name},\n\nYou can reset your password using the following link: ${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe Team`
    };
    await transporter.sendMail(mailOptions);
});

sendPasswordResetConfirmation = asyncHandler(async (user, ipAddress = 'Unknown', location = 'Unknown') => {
    const templateVariables = {
        username: user.name,
        email: user.email,
        resetDateTime: new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'long'
        }),
        ipAddress: ipAddress,
        location: location,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        year: new Date().getFullYear(),
        companyAddress: process.env.COMPANY_ADDRESS || 'Your Company Address'
    };

    const htmlContent = await loadTemplate('passwordResetConfirmation', templateVariables);

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Password Successfully Reset',
        html: htmlContent,
        text: `Hello ${user.name},\n\nYour password has been successfully reset.\n\nIf you did not perform this action, please contact support immediately.\n\nBest regards,\nThe Team`
    };
    await transporter.sendMail(mailOptions);
});

sendCommentNotification = asyncHandler(async (postAuthor, commenter, post, comment) => {
    const templateVariables = {
        postAuthorName: postAuthor.name,
        commenterName: commenter.name,
        commenterInitial: commenter.name.charAt(0).toUpperCase(),
        postTitle: post.title,
        postExcerpt: post.content ? post.content.substring(0, 150) + '...' : '',
        commentText: comment.content,
        commentTime: new Date(comment.createdAt || Date.now()).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        viewCommentUrl: `${process.env.FRONTEND_URL}/posts/${post._id}#comment-${comment._id}`,
        replyUrl: `${process.env.FRONTEND_URL}/posts/${post._id}?reply=${comment._id}`,
        notificationSettingsUrl: `${process.env.FRONTEND_URL}/settings/notifications`,
        unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${postAuthor.email}`,
        year: new Date().getFullYear(),
        companyAddress: process.env.COMPANY_ADDRESS || 'Your Company Address'
    };

    const htmlContent = await loadTemplate('commentNotification', templateVariables);

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: postAuthor.email,
        subject: 'New Comment on Your Post',
        html: htmlContent,
        text: `Hello ${postAuthor.name},\n\n${commenter.name} commented on your post titled "${post.title}":\n\n"${comment.content}"\n\nBest regards,\nThe Team`
    };
    await transporter.sendMail(mailOptions);
});

sendReplyNotification = asyncHandler(async (commentAuthor, replier, comment, reply) => {
    const templateVariables = {
        originalCommenterName: commentAuthor.name,
        originalCommenterInitial: commentAuthor.name.charAt(0).toUpperCase(),
        originalCommentText: comment.content,
        originalCommentTime: new Date(comment.createdAt || Date.now()).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        replyAuthorName: replier.name,
        replyAuthorInitial: replier.name.charAt(0).toUpperCase(),
        replyText: reply.content,
        replyTime: new Date(reply.createdAt || Date.now()).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        postTitle: comment.postId?.title || 'the post',
        viewThreadUrl: `${process.env.FRONTEND_URL}/posts/${comment.postId?._id || comment.postId}#comment-${comment._id}`,
        replyBackUrl: `${process.env.FRONTEND_URL}/posts/${comment.postId?._id || comment.postId}?reply=${reply._id}`,
        notificationSettingsUrl: `${process.env.FRONTEND_URL}/settings/notifications`,
        unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${commentAuthor.email}`,
        year: new Date().getFullYear(),
        companyAddress: process.env.COMPANY_ADDRESS || 'Your Company Address'
    };

    const htmlContent = await loadTemplate('replyNotification', templateVariables);

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: commentAuthor.email,
        subject: 'New Reply to Your Comment',
        html: htmlContent,
        text: `Hello ${commentAuthor.name},\n\n${replier.name} replied to your comment:\n\nOriginal Comment: "${comment.content}"\nReply: "${reply.content}"\n\nBest regards,\nThe Team`
    };
    await transporter.sendMail(mailOptions);
});

module.exports = {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPasswordResetConfirmation,
    sendCommentNotification,
    sendReplyNotification
};
