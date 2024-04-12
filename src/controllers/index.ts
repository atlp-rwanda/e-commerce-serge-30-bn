
import User from '../models';
import { Request, Response } from 'express';

export const UserController = {
  async getAllUsers(req:Request, res:Response) {
    try {
      const users = await User.findAll({});
      res.json(users);
    } catch (error : unknown) {
        if (error instanceof Error)
      res.status(500).json({ message: error.message });
    }
  },

  async getUserById(req:Request, res:Response) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error : unknown) {
        if (error instanceof Error)
      res.status(500).json({ message: error.message });
    }
  },

  async createUser(req:Request, res:Response) {
    const { username, email, password } = req.body;
    try {
      const newUser = await User.create({ username, email, password });
      res.status(201).json(newUser);
    } catch (error : unknown) {
        if (error instanceof Error)
      res.status(400).json({ message: error.message });
    }
  },

  async updateUser(req:Request, res:Response) {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.update({ username, email, password });
      res.json(user);
    } catch (error : unknown) {
        if (error instanceof Error)
      res.status(400).json({ message: error.message });
    }
  },

  async deleteUser(req:Request, res:Response) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } catch (error : unknown) {
        if (error instanceof Error)
      res.status(500).json({ message: error.message });
    }
  },
};
