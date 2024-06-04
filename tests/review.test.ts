import { describe, expect, it, jest, beforeAll, afterAll } from '@jest/globals';
import { reviewService } from '../src/service/review.service';
import { reviewController } from '../src/controllers/review.controller';
import { server } from '../src/server';
import { NextFunction, Request, Response } from 'express';
import { checkIfPaid } from '../src/middleware/authentication/checkIfPaid.middleware';

jest.mock('../src/service/review.service');

beforeAll(() => {
  server;
});

describe(' feedback CRUD', () => {
  const saveFeedBackMock = reviewService.saveFeedBack as jest.Mock;
  it('should return 400,product not found', async () => {
    saveFeedBackMock.mockImplementation(() =>
      Promise.reject('product not found'),
    );

    const req = {
      user: { user_id: 'test123' },
      params: { id: 'product123' },
      body: { title: 'testtitle', comment: 'testcomment', rating: 4 },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.addFeedBack(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });
  it('should return 400,no params', async () => {
    const req = {
      user: { user_id: 'test123' },
      body: { title: 'testtitle', comment: 'testcomment', rating: 4 },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.addFeedBack(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 201, add review', async () => {
    saveFeedBackMock.mockImplementation(() => Promise.resolve('check'));

    const req = {
      user: { user_id: 'test123' },
      params: { id: 'product123' },
      body: { title: 'testtitle', comment: 'testcomment', rating: 4 },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.addFeedBack(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Review added successfully!',
      review: 'check',
    });
  });

  it('should return 200, get feedbacks', async () => {
    const req = {
      params: { id: 'product123' },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.getAllFeedBacks(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 400, feedbacks error', async () => {
    const req = {} as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.getAllFeedBacks(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 200, update feedback', async () => {
    const req = {
      user: { user_id: 'test123' },
      params: { id: 'product123' },
      body: { title: 'test', comment: 'comment', rating: 4 },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.updatefeedBack(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it('should return 401, update others feedback', async () => {
    const req = {
      params: { id: 'product123' },
      body: { title: 'test', comment: 'comment', rating: 4 },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.updatefeedBack(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(401);
  });
  it('should return 400, update without datas', async () => {
    const req = {
      user: { user_id: 'test123' },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.updatefeedBack(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 200, delete feedback', async () => {
    const req = {
      user: { user_id: 'test123' },
      params: { id: 'product123' },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.deleteFeedBack(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 401', async () => {
    const req = {
      params: { id: 'product123' },
      body: { title: 'testtitle', comment: 'testcomment' },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    await reviewController.addFeedBack(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
describe('CHECKPAYMENT', () => {
  it('should unauthorized', async () => {
    const req = {
      params: { id: 'product123' },
      body: { title: 'testtitle', comment: 'testcomment' },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as NextFunction;
    await checkIfPaid(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
afterAll(() => {
  server.close();
});
