import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { validateSchema } from '../utils/joi.validateSchema';
import { reviewVal } from '../validations/review.validation';
import { checkIfPaid } from '../middleware/authentication/checkIfPaid.middleware';

const reviewRoutes = Router();

reviewRoutes.post(
  '/buyer/review/:id',
  validateSchema(reviewVal.createReview),
  isAuthenticated,
  checkIfPaid,
  reviewController.addFeedBack,
);
reviewRoutes.put(
  '/buyer/review/:id',
  validateSchema(reviewVal.updateReview),
  isAuthenticated,
  reviewController.updatefeedBack,
);
reviewRoutes.delete(
  '/buyer/review/:id',
  isAuthenticated,
  reviewController.deleteFeedBack,
);
reviewRoutes.get('/buyer/review/:id', reviewController.getAllFeedBacks);

export default reviewRoutes;
