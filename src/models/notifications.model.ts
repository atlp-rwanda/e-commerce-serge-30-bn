/* eslint-disable require-jsdoc */
import { UUID } from 'crypto';
import { Model, DataTypes } from 'sequelize';
import { development, production, testing } from '../db/config';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

export class Notification extends Model {
  public id!: UUID;

  public message!: string;

  declare userId: string;

  declare isRead: boolean;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'notification',
    freezeTableName: true,
  },
);

export default Notification;
