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
    name: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Name cannot be an empty field',
      'string.min': 'Name must contain at least 1 character',
      'string.max': 'Name must contain at most 255 characters',
      'any.required': 'Name is a required field',
    }),
    description: Joi.string().min(1).required().messages({
      'string.empty': 'Description cannot be an empty field',
      'string.min': 'Description must contain at least 1 character',
      'any.required': 'Description is a required field',
    }),
    category_name: Joi.string().min(1).required().messages({
      'string.empty': 'Category name cannot be an empty field',
      'string.min': 'Category name must contain at least 1 character',
      'any.required': 'Category name is a required field',
    }),
    price: Joi.number().positive().required().messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is a required field',
    }),
    quantity: Joi.number().integer().positive().required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.positive': 'Quantity must be a positive number',
      'any.required': 'Quantity is a required field',
    }),
    image_url: Joi.array()
      .items(Joi.string().uri())
      .min(4)
      .max(8)
      .required()
      .messages({
        'array.min': 'Must contain at least 4 image URLs',
        'array.max': 'Must contain at most 8 image URLs',
        'any.required': 'Image URLs are required',
        'string.uri': 'Invalid image URL',
      }),
    discount: Joi.number().min(0).allow(null).messages({
      'number.base': 'Discount must be a number',
      'number.min': 'Discount must be at least 0',
    }),
    expiry_date: Joi.date().iso().allow(null).messages({
      'date.iso': 'Invalid date format',
    }),
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
