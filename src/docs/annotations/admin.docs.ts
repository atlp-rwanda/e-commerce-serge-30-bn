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
/**
 * @openapi
 * /api/v1/admin/expired-password-users:
 *   get:
 *     summary: Retrieve users with expired passwords
 *     description: Retrieve users with expired passwords in the system. Only accessible to admins.
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: Users with expired passwords retrieved successfully
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
 *                   example: Users with expired passwords retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '401':
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
 *       '404':
 *         description: No users with expired passwords found
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
 *                   example: No users with expired passwords found
 *       '500':
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
