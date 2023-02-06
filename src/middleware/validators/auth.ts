import Joi from 'joi';

export const register = Joi.object().keys({
        username: Joi.string().trim().required(),
        password: Joi.string().min(8).required(),
        email: Joi.string().email().lowercase().required()
})

export const login = Joi.object().keys({
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string().min(8).required(),
}).xor('email', 'username');

export const logout = Joi.object().keys({
        refreshToken: Joi.string().required(),
})

export const refreshTokens = Joi.object().keys({
      refreshToken: Joi.string().required(),
})
