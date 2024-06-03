import { Request, Response, NextFunction } from 'express';
import { updateOrderStatus } from '../controllers/order.controller';

export const updateOrderStatusHandler = (req: Request, res: Response, next: NextFunction) => {
  const webSocketService = res.locals.webSocketService;
  updateOrderStatus(req, res, webSocketService).catch(next);
};