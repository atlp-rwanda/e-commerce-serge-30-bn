import User from '../models/user.model';
import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import {logger} from '../config/Logger';
import  { fetchProfile, createProfile,  modifyProfile, removeProfile } from '../service/profile.service';


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
    await createProfile(newUser)
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
    const updatedFields= {username , email }
    await modifyProfile( {updatedFields, id} )
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
    await removeProfile(id)
    await user.destroy();   
    res.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// profile part 

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await fetchProfile(id);

    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    res.status(200).json({ profile });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
};


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updatedFields= req.body;
    const {id} =req.params;

    const newProfile = await modifyProfile({updatedFields, id});
    return res.status(201).json({ message: "profile updated!", data: newProfile });
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)

    if (message.includes('no fields to update')) {
      return res.status(400).json({ message: 'no fields to update' });
    } else if  (message.includes('profile not found')) {
      return res.status(400).json({ message: 'profile not found' });
    } else {
      return res.status(500).json({ message: 'Internal server error', error:message });
    }
  }
};
