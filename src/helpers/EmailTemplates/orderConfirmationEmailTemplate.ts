interface OrderConfirmationData {
  orderNumber: string;
  productName: string;
  totalPrice: number;
  deliveryDate: string;
  
}

export const orderConfirmationEmailTemplate = (data: OrderConfirmationData): string => {
  const totalPrice = data.totalPrice || 0;
  return `
      <h1>Order Confirmation - Order ${data.orderNumber}</h1>
      <p>Thank you for your order!</p>
      <p>We're excited to let you know that your order for ${data.productName} has been confirmed.</p>
      <p>Total Price:${totalPrice.toFixed(2)} Frw</p>
      <p>Expected Delivery Date: ${data.deliveryDate}</p>
      <p>If you have any questions about your order, please feel free to contact us.</p>
      <p>Thank you for shopping with us!</p>
  `;
};
