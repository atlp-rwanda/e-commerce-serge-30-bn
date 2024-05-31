import Review from '../models/review.model';
import Product from '../models/products.Model';
import User from '../models/user.model';

interface inputFields {
  title: string;
  comment: string;
  rating:number
}

export class reviewService {
  public static async saveFeedBack(
    title: string,
    comment: string,
    rating:string,
    userId: string,
    productId: string,
  ): Promise<Review | null> {
    try {
      const product = await Product.findOne({
        where: { product_id: productId },
      });
      if (!product) {
        throw new Error('product not found');
      }
      const message = await Review.create({
        userId,
        productId,
        title,
        comment,
        rating
      });
      // rate only once
      await Review.update({rating},{where: {userId}})
      await setNewAverageRating(productId);
      return message;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`error adding review: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

  public static async getAllFeedBacks(
    productId: string,
  ): Promise<Review[] | null> {
    try {
      const result = await Review.findAll({
        where: { productId },
      });
      if (result.length == 0) {
        throw new Error('no reviews yet');
      }
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`error getting review, ${error.message}`);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }
  public static async updateFeedBack(
    id: string,
    updateFields: inputFields,
    userId: string,
  ): Promise<string | null> {
    try {
      const target = await Review.findOne({
        where: { id },
      });
      if (!target) {
        throw new Error('Review not found');
      }
      const review = await Review.findOne({
        where: { id, userId },
      });

      if (!review) {
        throw new Error('You are not authorized to this review');
      }

      await Review.update({ ...updateFields }, { where: { id } });
      if (updateFields.rating !== undefined) {
        await Review.update(
          { rating: updateFields.rating },
          { where: { userId } }
        );
      }
      await setNewAverageRating(target.productId);
      return 'your feedback is updated!';
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`error updating feedback, ${error.message}`);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

  public static async deleteFeedBack(
    id: string,
    user: User,
  ): Promise<string | null> {
    try {
      const target = await Review.findOne({ where: { id } });
      if (!target) {
        throw new Error('review not found');
      }
      const review = await Review.findOne({
        where: { id, userId: user.user_id },
      });

      if (!review) {
        throw new Error('You can only delete your review');
      }
      const productId = target.productId;

      await Review.destroy({
        where: { id },
      });
      await setNewAverageRating(productId);
      return 'deleted successfully';
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting, ${error.message}`);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }
}

export const setNewAverageRating = async (productId: string): Promise<void> => {
  try {
    const reviewArr = await Review.findAll({
      where: { productId },
      attributes: ['rating'],
    });

    const sumRating = reviewArr.reduce((accumulator, current) => {
      return accumulator + current.rating;
    }, 0);
    const count = reviewArr.length;
    const averageRating = (sumRating / count).toFixed(1);
    await Product.update(
      { finalRatings: averageRating, reviewsCount: count },
      {
        where: { product_id: productId },
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in average function, ${error.message}`);
    }
  }
};
