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
    store_name: Joi.string().min(1).max(255).required(),
    store_description: Joi.string().allow(null, ''),
  }),
};
