import Joi from 'joi';;

export const reviewVal = {

  createReview: Joi.object({
    title: Joi.string().min(1).required(),
    comment: Joi.string().min(1).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
  }),
  updateReview: Joi.object({
    title: Joi.string().min(1).optional().messages,
    comment: Joi.string().min(1).optional(),
    rating: Joi.number().integer().min(1).max(5).optional()
  }).min(1)
};
