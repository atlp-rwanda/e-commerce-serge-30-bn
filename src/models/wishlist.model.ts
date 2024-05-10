import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';
import User from './user.model';
import Product from './products.Model';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

class Wishlist extends Model {
  public id!: string;
  public user_id!: string;
  public product_id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Reference the user table
        key: 'user_id',
      },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products', // Reference the Products table
        key: 'product_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'wishlist',
    timestamps: true,
  },
);
Wishlist.belongsTo(Product, { foreignKey: 'product_id' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });
export default Wishlist;
