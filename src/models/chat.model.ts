import { DataTypes, Model, Optional } from 'sequelize';
import { development, production, testing } from '../db/config';
import User from './user.model';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

interface ChatAttr {
  id: string;
  senderId: string;
  content: string;
  socketId: string;
  readStatus?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type ChatCreationAttr = Optional<ChatAttr, 'id'>;

class Chat extends Model<ChatAttr, ChatCreationAttr> implements ChatAttr {
  public id!: string;
  public senderId!: string;
  public content!: string;
  public socketId!: string;
  public readStatus!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: { User: typeof User }) {
    Chat.belongsTo(models.User, { foreignKey: 'senderId' });
  }
}

Chat.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    readStatus: {
      type: DataTypes.BOOLEAN,
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
  },
  {
    tableName: 'chats',
    sequelize,
  },
);

export default Chat;
