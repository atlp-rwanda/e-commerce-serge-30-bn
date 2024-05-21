import { DataTypes, Model, UUIDV4 } from 'sequelize';
import { development, production, testing } from '../db/config';
import Cart from './cart.model';
import User from './user.model';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
export const sequelize = isProduction
  ? production
  : isTesting
    ? testing
    : development;

class Order extends Model {
  public id!: string;
  public cartId!: string;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public address!: string;
  public phone!: string;
  public city!: string;
  public country!: string;
  public userId!: string;
  public totalPrice!: number;
  public zipCode?: string;
  public expectedDeliveryDate!: Date;
  public products!: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cart',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expectedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  },
);


Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'users',
  onDelete: 'CASCADE',
});
User.hasMany(Order, { foreignKey: 'userId' });

Order.belongsTo(Cart, {
  foreignKey: 'cartId',
  as: 'cart',
  onDelete: 'SET NULL',
});
Cart.hasMany(Order, { foreignKey: 'cartId', as: 'orders' });

export default Order;