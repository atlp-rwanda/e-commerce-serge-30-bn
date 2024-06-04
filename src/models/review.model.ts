import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';
import User from './user.model';
import Product from './products.Model';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

class Review extends Model {
  userId!: string;
  productId!:string;
  title!: string;
  rating!: number;
  comment!: string;

  public static associate(models: {
    User: typeof User;
    Product: typeof Product;
  }) {
    Review.belongsTo(models.User);
    Review.belongsTo(models.Product);
  }
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    productId: {
      type: DataTypes.UUID,
      references: {
        model: 'products',
        key: 'product_id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull:true,
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
    tableName: 'reviews',
    sequelize,
  },
);

export default Review;
