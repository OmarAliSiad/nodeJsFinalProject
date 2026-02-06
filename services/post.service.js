const Post = require('../models/postModel');

const createPost = async (postData, id) => {
    const post = new Post(postData, id);
    return await post.save();
};

const getAllPosts = async (limit = 10, page = 1, userId) => {
    const skip = (page - 1) * limit;
    const posts = await Post.find().limit(limit).skip(skip);
    //id 
    console.log('userId in service:', userId, 'posts:', posts.map(
        (post) => post.userId
    ));
    return posts.map(post => ({
        ...post.toObject(),
        isOwner: userId ? post.userId === userId : false,
    }));
};

const getPostById = async (id, userId) => {
    const post = await Post.findById(id);
    if (!post) return null;
    return {
        ...post.toObject(),
        isOwner: userId ? post.userId === userId : false
    };
};

const updatePost = async (id, postData) => {
    return await Post.findByIdAndUpdate(id, postData, { new: true });
};

const deletePost = async (id) => {
    return await Post.findByIdAndDelete(id);
};

const getCommentsByPost = async (postId, userId) => {
    const comments = await Comment.find({ postId });
    return comments.map(comment => ({
        ...comment.toObject(),
        isOwner: userId ? comment.userId.toString() === userId : false,
    }));
}

const uploadPostImages = async (postId, images) => {
    const post = await Post.findById(postId);
    if (!post) return null;
    post.images = images;
    return await post.save();
}
const deletePostImage = async (postId, imageId) => {
    const post = await Post.findById(postId);
    if (!post) return null;
    post.images = post.images.filter(img => img !== imageId);
    return await post.save();
}

// Search posts with full-text search and filters
const searchPosts = async (searchQuery, filters = {}, limit = 10, page = 1) => {
    const skip = (page - 1) * limit;
    const query = { $text: { $search: searchQuery } };

    // Add date range filter
    if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    // Add tags filter
    if (filters.tags) {
        const tagsArray = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
        query.tags = { $in: tagsArray };
    }

    // Only search published posts
    query.published = true;

    const posts = await Post.find(query, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .skip(skip);

    const total = await Post.countDocuments(query);

    return {
        posts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Get user's draft posts
const getDraftPosts = async (userId, limit = 10, page = 1) => {
    const skip = (page - 1) * limit;
    const query = { userId, status: 'draft' };

    const posts = await Post.find(query)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await Post.countDocuments(query);

    return {
        posts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Publish a draft post
const publishDraft = async (postId, userId) => {
    const post = await Post.findOne({ _id: postId, userId });
    if (!post) return null;

    if (post.status !== 'draft') {
        throw new Error('Post is not a draft');
    }

    post.status = 'published';
    post.published = true;
    post.publishedAt = new Date();
    return await post.save();
};

// Schedule a post for future publication
const schedulePost = async (postId, userId, publishedAt) => {
    const post = await Post.findOne({ _id: postId, userId });
    if (!post) return null;

    if (post.status === 'published') {
        throw new Error('Post is already published');
    }

    post.status = 'scheduled';
    post.publishedAt = new Date(publishedAt);
    return await post.save();
};

// Publish scheduled posts (for cron job)
const publishScheduledPosts = async () => {
    const now = new Date();
    const posts = await Post.find({
        status: 'scheduled',
        publishedAt: { $lte: now }
    });

    for (const post of posts) {
        post.status = 'published';
        post.published = true;
        await post.save();
    }

    return posts.length;
};

// Increment post view count
const incrementPostView = async (postId) => {
    const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { views: 1 } },
        { new: true }
    );
    return post;
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getCommentsByPost,
    uploadPostImages,
    deletePostImage,
    searchPosts,
    getDraftPosts,
    publishDraft,
    schedulePost,
    publishScheduledPosts,
    incrementPostView
};