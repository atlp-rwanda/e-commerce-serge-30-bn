import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


 
export const profileAuth = (req: Request, res: Response, next: NextFunction) => {
   
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }
  
    try {
      const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;
  
      if (decoded.user.user_id !== req.params.id) {
       console.log(decoded.user.user_id)
       console.log(req.params.id)
        return res.status(403).json({ message: 'You are not authorized on this profile' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  
