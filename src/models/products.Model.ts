import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

class Product extends Model {
  public product_id!: string;
  public category_id!: string;
  public vendor_id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public quantity!: number;
  public image_url!: string[];
  public discount!: number;
  public expiry_date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public available!: boolean;
  public expired!: boolean;
}

Product.init(
  {
    product_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      onDelete: 'CASCADE',
    },
    vendor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'vendor_id',
      },
      onDelete: 'CASCADE',
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'category_id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    expired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
  },
);

export default Product;
