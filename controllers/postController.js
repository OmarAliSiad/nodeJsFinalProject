const postService = require('../services/post.service');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');


const createPost = asyncHandler(async (req, res) => {
    console.log("userId" + req.user.userId);
    const post = await postService.createPost({
        ...req.body,
        userId: req.user.userId
    });
    res.status(201).json(post);
});

const getAllPosts = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    console.log('UserId in getAllPosts:', userId);
    const posts = await postService.getAllPosts(req.query.limit, req.query.page, userId);
    res.status(200).json(posts);
});

const getPostById = asyncHandler(async (req, res, next) => {
    const username = req.user?.name;
    const post = await postService.getPostById(req.params.id, username);
    if (!post) {
        return next(new AppError('Post not found', 404));
    }
    res.status(200).json(post);
});

const updatePost = asyncHandler(async (req, res, next) => {
    const post = await postService.updatePost(req.params.id, req.body);
    if (!post) {
        return next(new AppError('Post not found', 404));
    }
    res.status(200).json(post);

});

const deletePost = asyncHandler(async (req, res, next) => {
    const post = await postService.deletePost(req.params.id);
    if (!post) {
        return next(new AppError('Post not found', 404));
    }
    res.status(200).json({ message: 'Post deleted successfully' });
});

const uploadPostImages = asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError('No files uploaded', 400));
    }
    const imageUrls = req.files.map(file => file.path); // Assuming multer stores the file path in 'path'
    const post = await postService.uploadPostImages(req.params.id, imageUrls);
    if (!post) {
        return next(new AppError('Post not found', 404));
    }
    res.status(200).json({ message: 'Images uploaded successfully', images: post.images });
});

const deletePostImage = asyncHandler(async (req, res, next) => {
    const post = await postService.deletePostImage(req.params.id, req.params.imageId);
    if (!post) {
        return next(new AppError('Post not found', 404));
    }
    res.status(200).json({ message: 'Image deleted successfully', images: post.images });
});

const searchPosts = asyncHandler(async (req, res, next) => {
    const { q, tags, startDate, endDate, limit, page } = req.query;

    const filters = {};
    if (tags) filters.tags = tags;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const result = await postService.searchPosts(q, filters, parseInt(limit) || 10, parseInt(page) || 1);

    res.status(200).json(result);
});

const getDraftPosts = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const { limit, page } = req.query;

    const result = await postService.getDraftPosts(userId, parseInt(limit) || 10, parseInt(page) || 1);

    res.status(200).json(result);
});

const publishDraft = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const postId = req.params.id;

    const post = await postService.publishDraft(postId, userId);

    if (!post) {
        return next(new AppError('Draft not found or you are not the author', 404));
    }

    res.status(200).json({ message: 'Draft published successfully', post });
});

const schedulePost = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const postId = req.params.id;
    const { publishedAt } = req.body;

    const post = await postService.schedulePost(postId, userId, publishedAt);

    if (!post) {
        return next(new AppError('Post not found or you are not the author', 404));
    }

    res.status(200).json({ message: 'Post scheduled successfully', post });
});

const incrementView = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;

    const post = await postService.incrementPostView(postId);

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    res.status(200).json({ message: 'View count incremented', views: post.views });
});

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    uploadPostImages,
    deletePostImage,
    searchPosts,
    getDraftPosts,
    publishDraft,
    schedulePost,
    incrementView
};