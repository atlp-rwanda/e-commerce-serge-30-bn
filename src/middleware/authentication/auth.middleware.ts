import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import user from '../../models/user.model';
import AuthService from '../../service/auth.service';
declare global {
  export interface CustomRequest extends Request {
    user?: user;
    adminEmail?: string;
  }
}
export interface CustomRequest extends Request {
  user?: user;
  adminEmail?: string;
}

export const isAuthenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorizationCookie =
      req.cookies['Authorization'] || req.headers.authorization;

    if (!authorizationCookie) {
      res.status(401).send({
        message: 'Unauthenticated access: missing token',
      });
      return;
    }

    const payload = verify(
      authorizationCookie,
      process.env.JWT_SECRET || '',
    ) as { user: user };

    if (!payload) {
      res.status(401).send({
        message: 'Invalid token',
      });
      return;
    }

    const decoded = payload.user;

    if (!user) {
      res.status(401).send({
        message: 'User not found',
      });
      return;
    }

    req.user = decoded;

    next();
  } catch (e) {
    console.error(e);
    res.status(401).send({
      message: 'Unauthorized access: token has expired or it is malformed',
    });
    return;
  }
};

export const isAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const User = await AuthService.querySingleUser({
      where: { user_id: req.user.user_id },
    });

    if (!User || User.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Forbidden: User is not an admin' });
    }
    req.adminEmail = User.email;
    next();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
