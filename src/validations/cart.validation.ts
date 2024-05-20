import Joi from "joi";
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

export const dataSchema = Joi.object({
  productid: Joi.string().required(),
  quantity: Joi.number().integer().positive().required(),
});
