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
export const vendorSchema = {
  vendor: Joi.object({
    store_name: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Name cannot be an empty field',
      'string.min': 'Name must contain at least 1 character',
      'string.max': 'Name must contain at most 255 characters',
      'any.required': 'Name is a required field',
    }),
    store_description: Joi.string().min(10).required().messages({
      'string.empty': 'Description cannot be an empty field',
      'string.min': 'Description must contain at least 10 character',
      'any.required': 'Name is a required field',
    }),
  }),
  update: Joi.object({
    store_name: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Name cannot be an empty field',
      'string.min': 'Name must contain at least 1 character',
      'string.max': 'Name must contain at most 255 characters',
      'any.required': 'Name is a required field',
    }),
    store_description: Joi.string().min(10).messages({
      'string.empty': 'Description cannot be an empty field',
      'string.min': 'Description must contain at least 10 character',
    }),
  })
    .min(1)
    .error(new Error('At least one attribute required to update a vendor')),
};
