/**
 * @openapi
 * /api/v1/checkout:
 *   post:
 *     summary: Create order
 *     description: Adding Products to the order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: The address of the buyer.
 *                 example: "123 Maple Street"
 *               country:
 *                 type: string
 *                 description: The country of the buyer.
 *                 example: "United States"
 *               city:
 *                 type: string
 *                 description: The city of the buyer.
 *                 example: "New York"
 *               phone:
 *                 type: string
 *                 description: The phone number of the buyer.
 *                 example: "+1-212-555-0123"
 *               zipCode:
 *                 type: string
 *                 description: The zip code of the buyer.
 *                 example: "10001"
 *               expectedDeliveryDate:
 *                 type: string
 *                 description: The expected delivery date.
 *                 example: "2024-06-10"
 *     responses:
 *       '200':
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Order created successfully.
 *                   example: "Order created successfully"
 *       '401':
 *         description: No Token Provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: No Token Provided.
 *                   example: "No Token Provided"
 *       '403':
 *         description: Not Authorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Not Authorized.
 *                   example: "JWT Expired or Malformed"
 *     tags:
 *       - order
 */

/**
 * @openapi
 * info:
 *   title: Order Tracking API
 *   version: 1.0.0
 *   description: API for tracking order status
 */

/**
 * @openapi
 * tags:
 *   name: Orders
 *   description: Operations related to orders
 */

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * security:
 *   - bearerAuth: []
 */

/**
 * @openapi
 * /api/v1/orders/{orderId}/status:
 *   get:
 *     summary: Get order status
 *     description: Retrieve the status of a specific order by its ID.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the order to retrieve status for
 *     responses:
 *       200:
 *         description: Order status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The current status of the order
 *                 expectedDeliveryDate:
 *                   type: string
 *                   format: date-time
 *                   description: The expected delivery date of the order
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @openapi
 * /api/v1/orders/{orderId}/status:
 *   post:
 *     summary: Update order status
 *     description: Update the status of a specific order by its ID.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the order to update status for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the order
 *               expectedDeliveryDate:
 *                 type: string
 *                 format: date-time
 *                 description: The new expected delivery date of the order
 *             required:
 *               - status
 *               - expectedDeliveryDate
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The updated status of the order
 *                 expectedDeliveryDate:
 *                   type: string
 *                   format: date-time
 *                   description: The updated expected delivery date of the order
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
 
/**
 * @openapi
 * /api/v1/checkout:
 *   post:
 *     summary: Create order
 *     description: Adding Products to the order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: The address of the buyer.
 *                 example: "123 Maple Street"
 *               country:
 *                 type: string
 *                 description: The country of the buyer.
 *                 example: "United States"
 *               city:
 *                 type: string
 *                 description: The city of the buyer.
 *                 example: "New York"
 *               phone:
 *                 type: string
 *                 description: The phone number of the buyer.
 *                 example: "+1-212-555-0123"
 *               zipCode:
 *                 type: string
 *                 description: The zip code of the buyer.
 *                 example: "10001"
 *               expectedDeliveryDate:
 *                 type: string
 *                 description: The expected delivery date.
 *                 example: "2024-06-10"
 *     responses:
 *       '200':
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Order created successfully.
 *                   example: "Order created successfully"
 *       '401':
 *         description: No Token Provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: No Token Provided.
 *                   example: "No Token Provided"
 *       '403':
 *         description: Not Authorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Not Authorized.
 *                   example: "JWT Expired or Malformed"
 *     tags:
 *       - order
 */

/**
 * @openapi
 * info:
 *   title: Order Tracking API
 *   version: 1.0.0
 *   description: API for tracking order status
 */

/**
 * @openapi
 * tags:
 *   name: Orders
 *   description: Operations related to orders
 */

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * security:
 *   - bearerAuth: []
 */

/**
 * @openapi
 * /api/v1/orders/{orderId}/status:
 *   get:
 *     summary: Get order status
 *     description: Retrieve the status of a specific order by its ID.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the order to retrieve status for
 *     responses:
 *       200:
 *         description: Order status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The current status of the order
 *                 expectedDeliveryDate:
 *                   type: string
 *                   format: date-time
 *                   description: The expected delivery date of the order
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @openapi
 * /api/v1/orders/{orderId}/status:
 *   post:
 *     summary: Update order status
 *     description: Update the status of a specific order by its ID.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the order to update status for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the order
 *               expectedDeliveryDate:
 *                 type: string
 *                 format: date-time
 *                 description: The new expected delivery date of the order
 *             required:
 *               - status
 *               - expectedDeliveryDate
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The updated status of the order
 *                 expectedDeliveryDate:
 *                   type: string
 *                   format: date-time
 *                   description: The updated expected delivery date of the order
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the order
 *         status:
 *           type: string
 *           description: The current status of the order
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           description: The expected delivery date of the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the order
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update date of the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The unique identifier of the product
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product in the order
 *               price:
 *                 type: number
 *                 description: The price of the product in the order
 *         address:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: The address of the buyer
 *             country:
 *               type: string
 *               description: The country of the buyer
 *             city:
 *               type: string
 *               description: The city of the buyer
 *             phone:
 *               type: string
 *               description: The phone number of the buyer
 *             zipCode:
 *               type: string
 *               description: The zip code of the buyer
 */

 /**
 * @openapi
 * /api/v1/orders/all:
 *   get:
 *     summary: Get all orders for the authenticated user or vendor
 *     description: Retrieves all orders associated with the authenticated user's account.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: orders retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: No orders found or vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: you have no orders
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */