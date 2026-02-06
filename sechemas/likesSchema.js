// Create schemas/likes/ folder
// Create validation schemas for like operations
// Export schemas and update main schemas/index.js

const Joi = require('joi');

// Schema for toggling like
const toggleLikeSchema = Joi.object({
    userId: Joi.string().required(),
    targetType: Joi.string().valid('Post', 'Comment').required(),
    targetId: Joi.string().required()
});

// Schema for getting likes count
const getLikesCountSchema = Joi.object({
    targetType: Joi.string().valid('Post', 'Comment').required(),
    targetId: Joi.string().required()
});

// Schema for checking if user liked
const isLikedByUserSchema = Joi.object({
    userId: Joi.string().required(),
    targetType: Joi.string().valid('Post', 'Comment').required(),
    targetId: Joi.string().required()
});

// Schema for getting user likes with pagination
const getUserLikesSchema = Joi.object({
    userId: Joi.string().required(),
    limit: Joi.number().integer().min(1).default(10),
    page: Joi.number().integer().min(1).default(1)
});

module.exports = {
    toggleLikeSchema,
    getLikesCountSchema,
    isLikedByUserSchema,
    getUserLikesSchema
};