import { UUID } from 'crypto';
import Profile from '../models/profile.model';

interface UpdateUserInputs {
  id: string;
  updatedFields: {
    email?: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    gender?: string;
    birthdate?: string;
    preferred_language?: string;
    preferred_currency?: string;
    location?: string;
  };
}
interface createdFields {
  user_id?: string;
  username?: string;
  email?: string;
}

export const createProfile = async (
  inputs: createdFields,
): Promise<Profile | null> => {
  try {
    const { user_id, username, email } = inputs;
    const newProfile = await Profile.create({
      userId: user_id,
      username: username,
      email: email,
    });

    return newProfile;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error updating user: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

export const modifyProfile = async (
  updateUserInputs: UpdateUserInputs,
): Promise<Profile | null> => {
  try {
    const { id, updatedFields } = updateUserInputs;
    const target = await Profile.findOne({ where: { userId: id } });

    if (target == null) {
      throw new Error('profile not found');
    } else if (Object.keys(updatedFields).length === 0) {
      throw new Error('no fields to update');
    }

    await target.update(updatedFields);
    return target;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error updating user: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

export const removeProfile = async (id: string): Promise<void> => {
  try {
    const profileToDelete = await Profile.findOne({ where: { userId: id } });

    if (!profileToDelete) {
      throw new Error('Profile not found');
    }

    await profileToDelete.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error deleting profile: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

export const fetchProfile = async (userId: string) => {
  try {
    const profile = await Profile.findOne({
      where: {
        userId: userId,
      },
    });

    return profile;
  } catch (error) {
    throw new Error('Error fetching profile');
  }
};
