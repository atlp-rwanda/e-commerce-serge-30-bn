import Joi from 'joi'

export function validate(req: Request) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(255).required(),
  })
  return schema.validate(req)
}
