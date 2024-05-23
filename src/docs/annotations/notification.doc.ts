/**
 * @openapi
 * /api/v1/notifications/all:
 *   get:
 *     summary: Retrieve all notifications for the logged-in user
 *     description: Retrieve all notifications associated with the logged-in user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: all notifications
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         message:
 *           type: string
 *           example: "Hi John, your product is now available."
 *         isRead:
 *           type: boolean
 *           example: false
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-05T09:01:02.525Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-05T09:01:02.525Z"
 */
