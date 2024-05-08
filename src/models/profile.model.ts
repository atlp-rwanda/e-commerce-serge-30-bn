import { DataTypes, Model  } from 'sequelize';
import { development, production, testing } from '../db/config';
import User from './user.model';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

class Profile extends Model {
    public static associate(
        models: { User: typeof User })
         {
            Profile.belongsTo(models.User);
        }
}

Profile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    preferred_language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferred_currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles', 
  }
);


export default Profile;
