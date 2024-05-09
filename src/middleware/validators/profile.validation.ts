import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  };
};

export const profileSchema = Joi.object({
    gender: Joi.string().valid('male', 'female', 'other').insensitive(),
    birthdate: Joi.date().iso(),
    preferred_language: Joi.string(),
    preferred_currency: Joi.string(),
    location: Joi.string(),
  }).options({ stripUnknown: true })
  
