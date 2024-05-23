
/**
 * @openapi
 * /api/v1/payment:
 *   post:
 *     summary: make payment
 *     description: Make payment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: UUID
 *                 description: The order id.
 *                 example: "12c410b6-dfe1-4742-8a70-fcdfe50d233d"
 *     responses:
 *       '200':
 *         description: payment made successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: payment created successfully.
 *                   example: "payment created successfully"
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
 *       - payment
 */
/**
 * @openapi
 * /api/v1/payment/momo:
 *   post:
 *     summary: Initiate MoMo Payment
 *     description: Initiate a payment using the MoMo mobile money service.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The ID of the order for which the payment is being made.
 *                 example: "12c410b6-dfe1-4742-8a70-fcdfe50d233d"
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the payer.
 *                 example: "0123456789"
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Order paid successfully"
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       '400':
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: "Order is already paid"
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: "Forbidden"
 *       '404':
 *         description: Not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: "Order not found"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 *                   example: "An unexpected error occurred"
 *     tags:
 *       - payment
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the payment.
 *         userId:
 *           type: string
 *           description: The ID of the user who made the payment.
 *         orderId:
 *           type: string
 *           description: The ID of the order for which the payment was made.
 *         amount:
 *           type: number
 *           description: The amount of the payment.
 *         payment_method:
 *           type: string
 *           description: The payment method used.
 *         payment_status:
 *           type: string
 *           description: The status of the payment.
 *         momoId:
 *           type: string
 *           description: The reference ID of the MoMo payment.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment was last updated.
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @openapi
 * /api/v1/payment/all:
 *   get:
 *     summary: Get all payments for the authenticated user or vendor
 *     description: Retrieves all payments associated with the authenticated user's account or, if the user is a vendor, retrieves payments associated with the vendor's account.
 *     tags:
 *       - payment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
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
 *                   example: payments retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
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
 *         description: No payments found or vendor not found
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
 *                   example: you have no payments
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
