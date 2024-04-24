import { Request, Response } from 'express';
import AuthService from '../service/auth.service';
import bcrypt from 'bcrypt';

import { validate } from '../middleware/validators/schemaValidators';
import { generateToken } from '../utils/jwt.utils';
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


export const LogoutUsers = async (req: Request, res: Response) => {
  try {
    res.clearCookie("Authorization");
    return res.status(200).send('Logout Successfully');
  } catch (error) {
    console.error('Logout error ', error);
    res.status(500).json({ error: 'Logout failed' });
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
export const Login = async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  const user = await AuthService.getUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const passwordRemoved = { ...user.toJSON(), password: undefined };
  const token = generateToken({ user: passwordRemoved });
  return res
    .header('Authorization', token)
    .cookie('Authorization', token, {
      httpOnly: true,
      maxAge: 60 * 600 * 1000,
    })
    .status(200)
    .json({ message: `${user.username} successfully logged in`, token });
};
