const Joi = require('joi');

// Search posts schema
const searchPostsSchema = Joi.object({
    query: {
        q: Joi.string().min(1).max(200).required().messages({
            'string.empty': 'Search query cannot be empty',
            'string.min': 'Search query must be at least 1 character',
            'string.max': 'Search query cannot exceed 200 characters',
            'any.required': 'Search query is required'
        }),
        tags: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(Joi.string())
        ).optional(),
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
            'date.min': 'End date must be after start date'
        }),
        limit: Joi.number().integer().min(1).max(100).default(10),
        page: Joi.number().integer().min(1).default(1)
    }
});

// Search users schema
const searchUsersSchema = Joi.object({
    query: {
        q: Joi.string().min(1).max(200).required().messages({
            'string.empty': 'Search query cannot be empty',
            'string.min': 'Search query must be at least 1 character',
            'string.max': 'Search query cannot exceed 200 characters',
            'any.required': 'Search query is required'
        }),
        limit: Joi.number().integer().min(1).max(100).default(10),
        page: Joi.number().integer().min(1).default(1)
    }
});

module.exports = {
    searchPostsSchema,
    searchUsersSchema
};
