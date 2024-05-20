
import {NextFunction,Request,Response } from "express";
import { verify as verifyJwt } from "jsonwebtoken";
import dotenv from 'dotenv'
import User, { UserRole } from "../models/user.model";
import { JsonWebTokenError } from 'jsonwebtoken';
dotenv.config();

export interface RequestUser extends Request {
  user?: User;
}

export const isAuthorized = (...roles:UserRole[]) => {
  return async (req: RequestUser, res: Response, next: NextFunction) => {

    try {
      const authorizationCookie = req.cookies['Authorization'];
      const secretKey  = process.env.JWT_SECRET;
      const decoded = verifyJwt(
        authorizationCookie,
        secretKey || '',
      ) as { user: User };
      const user = decoded.user;
      req.user = user;
      
      switch (true) {
        case !authorizationCookie:
          return res.status(404).json({ message: "Please Login first" });
        case !secretKey:
          return res.status(400).json({ message: "Provide JWT secret" });
        case user.verified === true && user.role && roles.includes(user.role):
          next();
          break;
        default:
          return res.status(403).json({ message: "Unauthorized access" });
      }
      
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return res.status(401).json({ message: error.message });
      }
      if(error instanceof Error){
      return res.status(500).json({ message: error.message });
      }
    }
  };
};
