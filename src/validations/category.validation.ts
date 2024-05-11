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
export const categorySchema = {
  category: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow(null, ''),
  }),
};
