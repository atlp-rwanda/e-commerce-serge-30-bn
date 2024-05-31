/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import order from '../models/order.model';
import { CartService } from '../service/cart.service';
import Cart from '../models/cart.model';
import { sequelize } from '../models/order.model';
import { Op } from 'sequelize';

interface Product {
  productId: string;
  price: number;
  quantity: number;
}

interface CartProp {
  id: string;
  userId: string;
  products: Product[];
  totalPrice: number;
  totalQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CartItem {
  productId: string;
  quantity: number;
  save(options?: any): Promise<void>;
}

export class OrderService {
  public static async saveOrder(orderData: any): Promise<order> {
    const transaction = await sequelize.transaction();
    try {
      const cartRes = await CartService.getCartByUserId(orderData.userId);
      if (!cartRes) {
        throw new Error('Cart not found.');
      }

      const cartProducts: Product[] = cartRes.products;


      if (!Array.isArray(cartProducts)) {
        throw new Error('Cart products should be an array.');
      }

      for (const product of cartProducts) {
        const productIds = cartProducts.map((producta) => producta.productId);

        const cartItems = await Cart.findAll({
          where: {
            'products.productId': {
              [Op.in]: productIds,
            },
          },
          transaction,
        });

        for (const cartItem of cartItems) {
          const orderedProduct = cartProducts.find(
            (productd) => productd.productId === cartItem.products[0].productId,
          );

          if (!orderedProduct) {
            throw new Error('Ordered product not found in the cart.');
          }

          await cartItem.save({ transaction });
        }
      }

      const orders = await order.create(orderData, { transaction });

      await transaction.commit();
      return orders;
    } catch (error: any) {
      await transaction.rollback();
      throw new Error('Failed to save order. ' + error.message);
    }
  }

  public static async getOrderById(id: string): Promise<order | null> {
    try {
      const data = await order.findOne({ where: { id } });
      return data;
    } catch (error: any) {
      throw new Error('Failed to fetch order. ' + error.message);
    }
  }
}
