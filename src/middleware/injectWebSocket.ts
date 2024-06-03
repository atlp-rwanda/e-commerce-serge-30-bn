import { Request, Response, NextFunction } from 'express';
import { WebSocketService } from '../utils/orderStatusWebsocket';

export default function injectWebSocketService(webSocketService: WebSocketService) {
  return function (req: Request, res: Response, next: NextFunction) {
    res.locals.webSocketService = webSocketService;
    next();
  };
}
