/* eslint-disable no-undef */

/**
 * @openapi
 * /api/v1/role/{id}:
 *   patch:
 *     summary: Update User Role
 *     description: Update the role of the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose role needs to be updated.
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The new role to assign to the user.
 *                 example: admin
 *     responses:
 *       '200':
 *         description: Successfully updated user role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the user role has been updated.
 *                   example: User role updated successfully
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal server error.
 *                   example: Internal server error occurred
 *     tags:
 *       - Users
 */
