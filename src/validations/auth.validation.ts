import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  };
};
export const AuthSchema = {
  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),
  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .min(6)
      .valid(Joi.ref('password'))
      .required()
      .error(new Error('Passwords must match')),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  updatePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required(),
  }),
};

export const EmailSchema = {
  email: Joi.object({
    email: Joi.string().email().required(),
  })
};

export const EmailTokenSchema = {
  emailToken: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().min(3).required(),
  }),
};
