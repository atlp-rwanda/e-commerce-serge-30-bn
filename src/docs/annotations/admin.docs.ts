/**
 * @openapi
 * /api/v1/admin/disable/{user_id}:
 *   post:
 *     summary: Disable user account
 *     description: Disables a user account by setting its verified status to false. Requires authentication and admin privileges.
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: ID of the user account to be disabled
 *         required: true
 *         type: string
 *
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User account disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User account disabled successfully
 *       '400':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: User doesn't exist
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Unauthorized access
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Access denied. Admin privileges required.
 *     tags:
 *       - Users
 */
