const joi = require('joi');
// Posts Schemas //
const createPostSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    content: joi.string().min(10).required(),
    author: joi.string().required(),
    id: joi.string(),
    tags: joi.array().items(joi.string()).default([]),
    published: joi.boolean().default(false),
    likes: joi.number().integer().min(0).default(0)
});

const getAllPostSchema = joi.object({
    limit: joi.number().integer().min(1).default(10),
    page: joi.number().integer().min(1).default(1)
});

const updatePostSchema = joi.object({
    title: joi.string().min(3).max(100),
    content: joi.string().min(10),
    author: joi.string(),
    tags: joi.array().items(joi.string()),
    published: joi.boolean(),
    likes: joi.number().integer().min(0)
});


module.exports = {
    createPostSchema, getAllPostSchema, updatePostSchema
};