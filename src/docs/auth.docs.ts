/**
 * @openapi
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Send Password Reset Link
 *     description: Sends a password reset link to the user's email address if it exists in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: user@example.com
 *     responses:
 *       '200':
 *         description: Password reset link sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the reset link has been sent.
 *                   example: A password reset link has been sent to your email
 *       '400':
 *         description: Bad request (e.g., email not found).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the reason for the bad request.
 *                   example: Email address not found
 *     tags:
 *       - auth
 */
/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Allows resetting a user's password if a valid and non-expired reset token is provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token received in the email.
 *                 example: 123456abcdef0123456abcdef01234567
 *               password:
 *                 type: string
 *                 description: The new password for the user's account.
 *                 example: strong_password123
 *               confirmPassword:
 *                  type: string
 *                  description: The new password for the user's account.
 *                  example: strong_password123
 *     responses:
 *       '200':
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the password has been reset.
 *                   example: Password reset successful
 *       '400':
 *         description: Bad request (e.g., invalid or expired token).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the reason for the bad request.
 *                   example: Invalid or expired token
 *     tags:
 *       - auth
 */
/**
 * @openapi
 * /api/v1/auth/{userId}/update-password:
 *   put:
 *     summary: Change user password
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       description: Update an existing password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Old password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *       '400':
 *         description: Invalid request or old password
 *     tags:
 *       - auth
 */
