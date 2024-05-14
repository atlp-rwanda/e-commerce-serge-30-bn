import Joi from 'joi';

export const cartSchema = {
  addItem: Joi.object({
    productid: Joi.string().required(),
    quantity: Joi.number().integer().positive().required(),
  }),
  updateItem: Joi.object({
    productId: Joi.string().required().messages({
      'string.empty': 'Product ID cannot be an empty string',
      'string.base': 'Product ID must be a string',
      'any.required': 'Product ID is required',
    }),
    quantity: Joi.number().integer().required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'any.required': 'Quantity is required',
    }),
  }),
};
