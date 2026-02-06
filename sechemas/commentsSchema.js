/*
Create schemas/comments/ folder
Create validation schemas for:
Creating comments (content, postId, parentCommentId)
Getting comments (pagination, postId filter)
Updating comments (content, comment id)
Validate nested comment depth (max 2-3 levels recommended)
*/

const Joi = require('joi');

// Schema for creating a comment
const createCommentSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required(),
    postId: Joi.string().hex().length(24).required(),
    parentCommentId: Joi.string().hex().length(24).optional()
});

// Schema for getting comments with pagination and optional postId filter
const getCommentsSchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).optional(),
    page: Joi.number().integer().min(1).optional(),
    postId: Joi.string().hex().length(24).optional()
});

// Schema for updating a comment
const updateCommentSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required()
});

//TODO Validate nested comment depth (max 2-3 levels recommended)

module.exports = {
    createCommentSchema,
    getCommentsSchema,
    updateCommentSchema
};