import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';
import User from './user.model';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

class verifytokens extends Model {
  public id!: number;
  public email!: string;
  public token!: string;
  public createdAt!: Date;
}

verifytokens.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expirationTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'verifytokens',
  },
);
verifytokens.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

export default verifytokens;
