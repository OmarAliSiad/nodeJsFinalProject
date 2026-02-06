const joi = require('joi');

const getAllUserSchema = joi.object({
    limit: joi.number().integer().min(1).default(10),
    page: joi.number().integer().min(1).default(1)
});

const updateUserSchema = joi.object({
    name: joi.string().alphanum().min(3).max(30),
    email: joi.string().email(),
    password: joi.string().min(6),
    role: joi.string().valid('user', 'admin').default('user'),
    age: joi.number().integer().min(0)
});

const signUpSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    age: joi.number().integer().min(0).required()
});

const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});
const vaildatePasswordResetSchema = joi.object({
    email: joi.string().email().required()
});

/*
Create schemas/users/forgotPasswordSchema.js
Create schemas/users/resetPasswordSchema.js
Create schemas/users/changePasswordSchema.js
*/

const forgotPasswordSchema = joi.object({
    email: joi.string().email().required()
});

const resetPasswordSchema = joi.object({
    token: joi.string().required(),
    newPassword: joi.string().min(6).required()
});

const changePasswordSchema = joi.object({
    currentPassword: joi.string().min(6).required(),
    newPassword: joi.string().min(6).required()
});

module.exports = {
    getAllUserSchema, updateUserSchema,
    signUpSchema, signInSchema, vaildatePasswordResetSchema,
    forgotPasswordSchema, resetPasswordSchema, changePasswordSchema
};