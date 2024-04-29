import bcrypt from 'bcrypt';
import User from '../models/user.model';

interface UserData {
    username : string,
    email: string,
    password: string,
    firstname:string,
    lastname:string,
}

export class UserService {
    static async createUser(userData: UserData): Promise<User> {
      try {
        const existingUserWithEmail  = await User.findOne({ where: { email: userData.email } });
  
        if (existingUserWithEmail ) {
          throw new Error("Email already exists");
        }

        const existingUserWithUserName = await User.findOne({ where: { username: userData.username } });
        if (existingUserWithUserName) {
            throw new Error("Username already exists");
        }
  
        const hashedPassword = bcrypt.hashSync(userData.password, 10);
  
        // Create a new user
        const newUserCreated = await User.create({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          firstname: userData.firstname,
          lastname: userData.lastname
        });
  
        // Omit password field from the returned User object
        const newUser = { ...newUserCreated.toJSON() };
        delete newUser.password;
  
        return newUser;

      } catch (error) {
        throw new Error('Could not create user: ' + error);
      }
    }

}