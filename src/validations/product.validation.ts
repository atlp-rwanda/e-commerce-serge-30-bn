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
export const productSchema = {
  product: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).required(),
    category_name: Joi.string().min(1).required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().positive().required(),
    image_url: Joi.array().items(Joi.string().uri()).min(4).max(8).required(),
    discount: Joi.number().min(0).max(100).allow(null),
    expiry_date: Joi.date().iso().allow(null),
  }),
};
