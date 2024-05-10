import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;

class Vendor extends Model {
  vendor_id!: string;
  store_name!: string;
  store_description!: string;
  user_id!: string;
}

Vendor.init(
  {
    vendor_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    store_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    store_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'vendors',
    sequelize,
  },
);

export default Vendor;
