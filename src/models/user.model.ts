import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';
import Profile from './profile.model';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

// eslint-disable-next-line no-shadow
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
}

class User extends Model {
  user_id!: string;
  username!: string;
  email!: string;
  password!: string;
  resetToken!: string | null;
  resetTokenExpiration!: string | null;
  emailVerificationToken!: string | null;
  emailVerificationTokenExpiration!: string | null;
  verified!: boolean;
  active!: boolean; 
  role!: UserRole;
  firstname!: string;
  lastname!: string;
  lastTimePasswordUpdate!: Date;
  previousPasswords!: string;
  passwordExpired!: boolean;

  public static associate(models: { Profile: typeof Profile }) {
    User.hasOne(models.Profile);
  }
}

User.init(
  {
    user_id: {
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
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetToken: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    emailVerificationTokenExpiration: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('USER', 'ADMIN', 'VENDOR'),
      defaultValue: UserRole.USER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    google_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    previousPasswords: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false
    },
    lastTimePasswordUpdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    passwordExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
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
  },
  {
    tableName: 'users',
    sequelize,
  },
);

export default User;
