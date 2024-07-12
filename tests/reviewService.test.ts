import { describe, expect, it, jest } from '@jest/globals';
import { reviewService } from '../src/service/review.service';
import Review from '../src/models/review.model';
import { User } from '../src/models';
import Product from '../src/models/products.Model';

import * as service from '../src/service/review.service';

jest.mock('../src/models/review.model');
jest.mock('../src/models/products.model');

describe('review service', () => {
  const mockUser = { user_id: '1234' } as User;
  const mockReview = {
    id: '1234',
    userId: 'user123',
    title: 'title123',
    Comment: 'comment123',
  };
  const updateFields = {
    title: 'updated title',
    comment: 'updated comment',
    rating: 5,
  };

  it('should return product not found', async () => {
    await expect(
      reviewService.saveFeedBack(
        'title',
        'comment',
        'rating',
        'userId',
        'productid',
      ),
    ).rejects.toThrow('product not found');
  });

  it('should create ', async () => {
    (Product.findOne as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockReview),
    );
    jest.spyOn(service, 'setNewAverageRating').mockResolvedValue();
    const result = await reviewService.saveFeedBack(
      'title',
      'comment',
      'rating',
      'userId',
      'productid',
    );
    expect(result).toEqual(undefined);
  });

  it('should miss what to delete ', async () => {
    (Review.findOne as jest.Mock).mockImplementation(() =>
      Promise.resolve(null),
    );

    expect(reviewService.deleteFeedBack('1234', mockUser)).rejects.toThrow(
      'review not found',
    );
  });

  it('should findONe & delete ', async () => {
    (Review.findOne as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockReview),
    );
    jest.spyOn(service, 'setNewAverageRating').mockResolvedValue();
    const result = await reviewService.deleteFeedBack('1234', mockUser);

    expect(result).toEqual('deleted successfully');
  });
  it('should findAll feedbacks ', async () => {
    (Review.findAll as jest.Mock).mockImplementation(() =>
      Promise.resolve([mockReview]),
    );
    const result = await reviewService.getAllFeedBacks('1234');

    expect(result).toEqual([mockReview]);
  });
  it('should return no reviews ', async () => {
    (Review.findAll as jest.Mock).mockImplementation(() => Promise.resolve([]));
    await expect(reviewService.getAllFeedBacks('1234')).rejects.toThrow(
      'no reviews yet',
    );
  });

  it('should findONe & update ', async () => {
    (Review.findOne as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockReview),
    );
    jest.spyOn(service, 'setNewAverageRating').mockResolvedValue();
    const result = await reviewService.updateFeedBack(
      '1234',
      updateFields,
      mockUser.user_id,
    );

    expect(result).toEqual('your feedback is updated!');

    expect(Review.findOne).toHaveBeenCalledWith({
      where: { id: '1234', userId: '1234' },
    });
  });
  it('should miss what to update ', async () => {
    (Review.findOne as jest.Mock).mockImplementation(() =>
      Promise.resolve(null),
    );
    expect(
      reviewService.updateFeedBack('1234', updateFields, mockUser.user_id),
    ).rejects.toThrow('Review not found');
  });
  it('should not authorize update', async () => {
    (Review.findOne as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve(mockReview))
      .mockImplementationOnce(() => Promise.resolve(null));
    await expect(
      reviewService.updateFeedBack('1234', updateFields, mockUser.user_id),
    ).rejects.toThrow('You are not authorized to this review');
  });
  it('should have called update in average', async () => {
    (Review.findAll as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve([]),
    );
    const updateMock = jest.spyOn(Product, 'update');

    await service.setNewAverageRating('1234');
    expect(updateMock).toHaveBeenCalled();
  });
});
