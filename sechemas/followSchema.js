const Joi = require('joi');

// Follow/Unfollow user schema
const followUserSchema = Joi.object({
    params: {
        userId: Joi.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        })
    }
});

// Get followers/following schema
const getFollowsSchema = Joi.object({
    params: {
        userId: Joi.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        })
    },
    query: {
        limit: Joi.number().integer().min(1).max(100).default(10),
        page: Joi.number().integer().min(1).default(1)
    }
});

module.exports = {
    followUserSchema,
    getFollowsSchema
};
