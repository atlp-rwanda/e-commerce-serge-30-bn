import User from '../models/user.model';
import { Request, Response } from 'express';
import { UserService } from '../service/user.service';

interface UserData {
  username : string,
  email: string,
  password: string,
  firstname:string,
  lastname:string,
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({});
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userData: UserData = req.body;
    const newUser = await UserService.createUser(userData);
    return res.status(201).json({ message: "Account created!", data: newUser });
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)

    if (message.includes('Email already exists')) {
      return res.status(400).json({ message: 'Email is already registered' });
    } else if (message.includes('Username already exists')) {
      return res.status(400).json({ message: 'Username is already taken' });
    } else {
      return res.status(500).json({ message: 'Internal server error', error:message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ username, email, password });
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
