import { Response } from 'express';
import { CartService } from '../service/cart.service';
import { OrderService } from '../service/order.service';
import { sequelize } from '../models/order.model';
import Product from '../models/products.Model';
import { ProductService } from '../service/index';
interface ProductProp {
  productId: string,
  quantity: number,
  price:number
}
async function updateProductInventory(products:ProductProp[]) {
  const transaction = await sequelize.transaction();

  try {
    for (const product of products) {
      const { productId, quantity } = product;

      const existingProduct = await ProductService.getProductById(productId);
      if (!existingProduct) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      const newQuantity = existingProduct.quantity - quantity;

      if (newQuantity < 0) {
        throw new Error(`Insufficient stock for product with ID ${productId}`);
      }

      await Product.update(
        { quantity: newQuantity },
        { where: { product_id: productId }, transaction },
      );
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

const createOrder = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401);
    }

    const { address, country, city, phone, zipCode, expectedDeliveryDate } =
      req.body;

    let cart;
    if (userId) {
      cart = await CartService.getCartByUserId(userId.user_id);
    }
    if (!cart) {
      res
        .status(404)
        .json({ ok: false, message: 'No cart found for this user' });
      return;
    }
    const products = cart.products;
    const orderData = {
      address,
      country,
      city,
      phone,
      zipCode,
      expectedDeliveryDate,
      userId: userId.user_id,
      totalPrice: cart.dataValues.totalPrice,
      cartId: cart.dataValues.id,
      products,
    };

    const data = await OrderService.saveOrder(orderData);

    await updateProductInventory(products);
    return res.status(201).json({
      ok: true,
      message: 'Order created successfully',
      data: {
        ...data.dataValues,
        products,
      },
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default createOrder;
