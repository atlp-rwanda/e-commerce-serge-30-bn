import { Request, Response } from 'express';
import { reviewService } from '../service/review.service';
import { CustomRequest } from '../middleware/authentication/auth.middleware';
export const reviewController = {
  async addFeedBack(req: CustomRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }
      const userId = req.user.user_id;
      const { id } = req.params; //product's
      const { title, comment ,rating } = req.body;
      const createdReview = await reviewService.saveFeedBack(
        title,
        comment,
        rating,
        userId,
        id,
      );
      return res.status(201).json({
        success: true,
        message: 'Review added successfully!',
        review: createdReview,
      });
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAllFeedBacks(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await reviewService.getAllFeedBacks(id);
      return res.status(200).json({ success: 'true', allReviews: result });
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
  async updatefeedBack(req: CustomRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }
      const userId = req.user.user_id;
      const updatedFields = req.body;
      const { id } = req.params;
      const result = await reviewService.updateFeedBack(
        id,
        updatedFields,
        userId,
      );
      return res.status(200).json({ message: result });
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
  async deleteFeedBack(req: CustomRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }
      const { id } = req.params;

      const message = await reviewService.deleteFeedBack(id, req.user);

      return res.status(200).json({ message: message });
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
