import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

class User extends Model {
  username!: string;
  email!: string;
  password!: string;
  resetToken!: string | null;
  resetTokenExpiration!: string | null;
  verified!: boolean;
  role!: Enumerator
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
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN", "VENDOR"),
      defaultValue: "USER",
      allowNull:false
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull:true
    },
     google_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    google_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'users',
    sequelize,
  },
);

export default User;
