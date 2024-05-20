/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';
import User from './user.model';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;
interface CartProduct {
  productId: string;
  quantity: number;
  price: number;
}
class Cart extends Model {
  public id!: string;
  public userId!: string;
  public products!: CartProduct[]; 
  public totalPrice!: number;
  public totalQuantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: { User: typeof User }) {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSONB, 
      allowNull: false,
      defaultValue: [], 
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: true,
  },
);

export default Cart;
