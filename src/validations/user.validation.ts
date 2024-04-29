import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.message })
    }
    next()
  }
}
export const UserSchema = {
  signUp: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
  }),
}