import Joi from 'joi';

export const PaymentSchema = {
  momo: Joi.object({
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.empty': 'Phone number is required',
        'string.length': 'Phone number must be 10 digits',
        'string.pattern.base': 'Phone number must be a positive number',
      }),
    orderId: Joi.string().uuid().required().messages({
      'string.empty': 'Order ID is required',
      'string.uuid': 'Order ID must be a valid UUID',
    }),
  }),
};
