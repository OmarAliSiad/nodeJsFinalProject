const Joi = require('joi');

// Bookmark post schema
const bookmarkPostSchema = Joi.object({
    params: {
        postId: Joi.string().required().messages({
            'string.empty': 'Post ID is required',
            'any.required': 'Post ID is required'
        })
    }
});

module.exports = {
    bookmarkPostSchema
};
