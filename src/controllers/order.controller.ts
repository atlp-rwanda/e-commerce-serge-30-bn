import { CartService } from '../service/cart.service';
import { OrderService} from '../service/order.service';
import { sequelize } from '../models/order.model';
import Product from '../models/products.Model';
import { ProductService } from '../service/index';
import { Request, Response } from 'express';
import NotificationEvents from '../service/event.service';
import User from '../models/user.model';
import { WebSocketService } from '../utils/orderStatusWebsocket';
import { CustomRequest } from '../middleware/authentication/auth.middleware';
import { VendorService } from '../service/vendor.service';
interface ProductProp {
  productId: string,
  quantity: number,
  price:number
}
export async function updateProductInventory(products:ProductProp[]) {
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
    NotificationEvents.emit("newOrder",data,userId.user_id);

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

interface AuthenticatedRequest extends Request {
  user?: User;
  webSocketService?: WebSocketService;
}
export const getAllOrders = async (req: CustomRequest, res:Response) => {
try{
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized' });
  }
  let orders = await OrderService.getAllOrders(req.user.user_id);
  const role = req.user.role;

  if(role === "ADMIN"){
    orders = await OrderService.adminGetAllOrders();
  }
  if (role === 'VENDOR') {
    const vendor = await VendorService.getVendorByAuthenticatedUserId(
      req.user.user_id,
    );
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    orders = await OrderService.getAllOrders(vendor.user_id);
}
if (!orders || orders.length < 1) {
  return res.status(404).json({
    success: false,
    message: 'you have no orders',
  });
}
return res.status(200).json({
  success: true,
  message: 'orders retrieved successfully',
  data: orders,
});
}catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
}
}


export const getOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let userId: string | undefined;
    if (req.user && typeof req.user.user_id === 'string') {
      userId = req.user.user_id;
    }

    if (!userId) {
      const errorMessage = 'User not authenticated';
      res.status(400).json({ message: errorMessage });
      return;
    }
    const { orderId } = req.params;

    if (!orderId) {
      res.status(400).json({ message: 'Order ID is missing' });
      return;
    }

    const orderStatus = await OrderService.getOrderStatus(userId, orderId);

    if (!orderStatus) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json(orderStatus);
  } catch (error) {
    console.error('Error getting order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

interface AuthenticatedRequest extends Request {
  webSocketService?: WebSocketService;
  params: {
    orderId: string;
  };
  body: {
    status: string;
    expectedDeliveryDate: string;
  };
}

export const updateOrderStatus = async (req: Request, res: Response, webSocketService: WebSocketService) => {
  const { orderId } = req.params;
  const { status, expectedDeliveryDate } = req.body;

  try {
    const updatedOrder = await OrderService.updateOrderStatus(orderId, status, new Date(expectedDeliveryDate));

    const notificationMessage = {
      message: 'Order status updated',
      orderId,
      status,
      expectedDeliveryDate: new Date(expectedDeliveryDate),
    };

    webSocketService.notifyOrderStatusChange(notificationMessage);

    res.status(200).json({
      message: 'Order status updated successfully',
      updatedOrder,
      notificationMessage,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: errorMessage });
  }
};


export default createOrder;