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
