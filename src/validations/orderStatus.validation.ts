import { body, param } from 'express-validator';

export const updateOrderStatusValidation = [
  param('orderId').isString().withMessage('Order ID must be a string'),
  body('status').isString().withMessage('Status must be a string'),
  body('expectedDeliveryDate').isISO8601().withMessage('Expected delivery date must be a valid date'),
];