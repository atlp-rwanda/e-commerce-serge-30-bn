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
  update: Joi.object({
    name: Joi.string().when('$name', {
      is: Joi.exist(),
      then: Joi.string().required(),
    }),
    description: Joi.string().when('$description', {
      is: Joi.exist(),
      then: Joi.string().required(),
    }),
    category_name: Joi.string().when('$category_name', {
      is: Joi.exist(),
      then: Joi.string().required(),
    }),
    price: Joi.number().when('$price', {
      is: Joi.exist(),
      then: Joi.number().required(),
    }),
    quantity: Joi.number().when('$quantity', {
      is: Joi.exist(),
      then: Joi.number().required(),
    }),
    image_url: Joi.array()
      .items(Joi.string().uri())
      .min(4)
      .max(8)
      .when('$image_url', {
        is: Joi.exist(),
        then: Joi.array().items(Joi.string().uri()).min(4).max(8).required(),
      }),
    discount: Joi.number()
      .min(0)
      .max(100)
      .allow(null)
      .when('$discount', {
        is: Joi.exist(),
        then: Joi.number().min(0).max(100).allow(null),
      }),
    expiry_date: Joi.date()
      .iso()
      .allow(null)
      .when('$expiry_date', {
        is: Joi.exist(),
        then: Joi.date().iso().allow(null),
      }),
  })
    .min(1)
    .error(new Error('At least one attribute required to update product')),
};
