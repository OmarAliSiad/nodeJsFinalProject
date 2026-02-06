/*
Create controllers/comments.js
Implement controller functions that call service functions
Handle errors appropriately
*/
const commentService = require('../services/commentService.js');
const notificationService = require('../services/notificationService');
const AppError = require('../utils/AppError.js');
const asyncHandler = require('../utils/asyncHandler.js');
const emailSMTP = require('../services/email_services.js');
const Post = require('../models/postModel');

const createComment = asyncHandler(async (req, res) => {
    const comment = await commentService.createComment(req.body, req.user.userId);

    // Get post to find post author
    const post = await Post.findById(req.body.postId);

    // Send notification email on comment creation
    const postAuthorEmail = req.user.email; // Assume this is passed in the request body
    if (postAuthorEmail) {
        await emailSMTP.sendCommentNotificationEmail(postAuthorEmail, comment);
    }

    // Create in-app notification for post author
    if (post && post.userId) {
        await notificationService.createCommentNotification(
            post.userId,
            req.user.userId,
            post._id,
            comment._id
        );
    }

    res.status(201).json(comment);
});

const getAllComments = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const comments = await commentService.getAllComments(req.query.limit, req.query.page, req.query.postId, userId);
    res.status(200).json(comments);
});

const getCommentById = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const comment = await commentService.getCommentById(req.params.id, userId);
    if (!comment) {
        return next(new AppError('Comment not found', 404));
    }
    res.status(200).json(comment);
});

const updateCommentById = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const comment = await commentService.updateCommentById(req.params.id, req.body, userId);
    if (!comment) {
        return next(new AppError('Comment not found or unauthorized', 404));
    }
    res.status(200).json(comment);
});

const deleteCommentById = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const comment = await commentService.deleteCommentById(req.params.id, userId);
    if (!comment) {
        return next(new AppError('Comment not found or unauthorized', 404));
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
});

const getCommentsByPost = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const comments = await commentService.getCommentsByPost(req.params.postId, userId);
    res.status(200).json(comments);
});

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById,
    getCommentsByPost
};  