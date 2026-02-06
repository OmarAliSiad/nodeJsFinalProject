const Joi = require('joi');

// Get notifications schema
const getNotificationsSchema = Joi.object({
    query: {
        limit: Joi.number().integer().min(1).max(100).default(10),
        page: Joi.number().integer().min(1).default(1),
        read: Joi.boolean().optional()
    }
});

// Mark as read schema
const markAsReadSchema = Joi.object({
    params: {
        id: Joi.string().required().messages({
            'string.empty': 'Notification ID is required',
            'any.required': 'Notification ID is required'
        })
    }
});

module.exports = {
    getNotificationsSchema,
    markAsReadSchema
};
