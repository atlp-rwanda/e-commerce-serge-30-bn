/* eslint-disable no-shadow */

//payment model
import { DataTypes, Model } from 'sequelize';
import { development, production, testing } from '../db/config';

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;
export enum PaymentMethod {
  Stripe = 'Stripe',
  MOMO = 'MOMO',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Canceled = 'Canceled',
  Refunded = 'Refunded',
}

class Payment extends Model {
  public id!: string;
  public userId!: string;
  public orderId!: string;
  public stripeId!: string;
  public amount!: number;
  public payment_method!: PaymentMethod;
  public payment_status!: PaymentStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
{
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      stripeId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      momoId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM,
        values: ['Stripe', 'MOMO'],
      },
      payment_status: {
        type: DataTypes.ENUM,
        values: ['Pending', 'Completed', 'Failed', 'Refunded', 'Canceled'],
        defaultValue: PaymentStatus.Pending,
      },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payment',
      timestamps: true,
    },
  );
}
export default Payment;
