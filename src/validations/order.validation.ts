import Joi from 'joi';

export const orderSchema = {
  order: Joi.object({
    address: Joi.string().min(1).max(255).required().messages({
      'string.min': 'Address must contain at least 1 character',
      'string.max': 'Address must contain at most 255 characters',
    }),
    country: Joi.string().min(1).required().messages({
      'string.min': 'Country must contain at least 1 character',
    }),
    city: Joi.string().min(1).required().messages({
      'string.min': 'city name must contain at least 1 character',
    }),
    zipCode: Joi.string().min(1).required().messages({
      'string.min': 'zipCode name must contain at least 1 character',
    }),
    expectedDeliveryDate: Joi.string().min(1).required().messages({
      'string.min':
        'expectedDeliveryDate name must contain at least 1 character',
    }),
  }),
};
