const Joi = require('joi');

// Publish draft schema
const publishDraftSchema = Joi.object({
    params: {
        id: Joi.string().required().messages({
            'string.empty': 'Post ID is required',
            'any.required': 'Post ID is required'
        })
    }
});

// Schedule post schema
const schedulePostSchema = Joi.object({
    params: {
        id: Joi.string().required().messages({
            'string.empty': 'Post ID is required',
            'any.required': 'Post ID is required'
        })
    },
    body: {
        publishedAt: Joi.date().iso().min('now').required().messages({
            'date.base': 'Published date must be a valid date',
            'date.min': 'Published date must be in the future',
            'any.required': 'Published date is required'
        })
    }
});

// Get drafts schema
const getDraftsSchema = Joi.object({
    query: {
        limit: Joi.number().integer().min(1).max(100).default(10),
        page: Joi.number().integer().min(1).default(1)
    }
});

module.exports = {
    publishDraftSchema,
    schedulePostSchema,
    getDraftsSchema
};
