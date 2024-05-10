import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import user from '../../models/user.model';

export interface CustomRequest extends Request {
  user?: user;
}

export const isAuthenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorizationCookie = req.cookies['Authorization'];

    if (!authorizationCookie) {
      res.status(401).send({
        message: 'No token provided',
      });
    }

    const payload = verify(
      authorizationCookie,
      process.env.JWT_SECRET || '',
    ) as { user: user };

    if (!payload) {
      res.status(401).send({
        message: 'Invalid token',
      });
    }

    const decoded = payload.user;

    if (!user) {
      res.status(401).send({
        message: 'User not found',
      });
    }

    req.user = decoded;

    next();
  } catch (e) {
    console.error(e);
    res.status(401).send({
      message: 'Authentication failed',
    });
  }
};
