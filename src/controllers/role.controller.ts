import { Request, Response } from 'express';
import AuthService from '../service/auth.service';


export const roleController = {
  async updateUserRole(req: Request, res: Response) {
  
    const {id} = req.params;
    const {role} = req.body;

    try {
      const user = await AuthService.querySingleUser({ where: { user_id: id } });
      user.role = role.toUpperCase();
      await user.save();

      return res.status(200).json(user);
    }
    catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
  
      if (message.includes('User not found')) {
        return res.status(404).json({ message: 'User not found' });
      }  else {
        return res.status(500).json({ message: 'Internal server error', error:message });
      }
  } },

};
