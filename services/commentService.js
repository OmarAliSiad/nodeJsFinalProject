// 1.2 Comment Service
// Create services/comments.js
// Functions:
// createComment(commentData, userId) - Create comment or reply
// getAllComments(query, postId, userId) - Get comments with pagination, filtering, and isOwner flag
// getCommentById(id, userId) - Get single comment with isOwner flag
// updateCommentById(id, commentData, userId) - Update comment (author only)
// deleteCommentById(id, userId) - Delete comment (author or post author)
// getCommentsByPost(postId, userId) - Get all comments for a specific post

const Comment = require('../models/commentModel.js');
const Post = require('../models/postModel.js');

const createComment = async (commentData, userId) => {
    const post = await Post.findById(commentData.postId);
    if (!post) throw new Error('Post not found');
    const comment = new Comment({ ...commentData, userId });
    return await comment.save();
};

const getAllComments = async (limit = 10, page = 1, postId, userId) => {
    const skip = (page - 1) * limit;
    const comments = await Comment.find({ postId }).limit(limit).skip(skip);
    const total = await Comment.countDocuments({ postId });
    console.log('userId in service:', userId, 'comments:', comments.map(
        (comment) => comment.userId
    ));
    return comments.map(comment => ({
        ...comment.toObject(),
        isOwner: userId ? comment.userId.toString() === userId : false,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    }));
}

const getCommentById = async (id, userId) => {
    const comment = await Comment.findById(id);
    if (!comment) return null;
    return {
        ...comment.toObject(),
        isOwner: userId ? comment.userId.toString() === userId : false,
    };
}

const updateCommentById = async (id, commentData, userId) => {
    const comment = await Comment.findById(id);
    if (!comment) return null;
    if (comment.userId.toString() !== userId) return null;
    return await Comment.findByIdAndUpdate(id, commentData, { new: true });
};

const deleteCommentById = async (id, userId) => {
    const comment = await Comment.findById(id);
    if (!comment) return null;
    const post = await Post.findById(comment.postId);
    if (comment.userId.toString() !== userId && post.userId.toString() !== userId) return null;
    return await Comment.findByIdAndDelete(id);
}

const getCommentsByPost = async (postId, userId) => {
    const comments = await Comment.find({ postId });
    return comments.map(comment => ({
        ...comment.toObject(),
        isOwner: userId ? comment.userId.toString() === userId : false,
    }));
}

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById,
    getCommentsByPost,
};