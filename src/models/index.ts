import { DataTypes, Model } from 'sequelize';
import {development,production,testing} from "../db/config";

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : (isTesting ? testing : development);

class User extends Model {
    username!: string;
    email!: string;
    password!: string;
  }
  
   User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
        
    tableName: 'users',
    sequelize,
    }
  );
  
  export default User;