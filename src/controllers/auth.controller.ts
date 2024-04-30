import { Request, Response } from 'express';
import AuthService from '../service/auth.service';
import bcrypt from 'bcrypt';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const message = await AuthService.forgotPassword(email);

    return res.status(200).json({ message });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const message = await AuthService.resetPassword(token, password);

    return res.status(200).json({ message });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Check if the provided old password matches the one stored in the database
    const passwordMatch = await AuthService.verifyPassword(userId, oldPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: 'Password must match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await AuthService.updatePassword(userId, hashedPassword);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};