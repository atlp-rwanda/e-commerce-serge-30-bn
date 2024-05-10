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
 *         description: Bad request 
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
 *         description: Bad request 
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
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout User
 *     description: Logout User.
 *     responses:
 *       '200':
 *         description: Logout  successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logout Successfully.
 *                   example: Logout successful
 *       '400':
 *         description: Bad request 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the reason for the bad request.
 *                   example: Errors
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
/**
* @openapi
* /api/v1/auth/login:
*   post:
*     summary: Login User
*     description: Login a user to the system
*     tags:
*       - auth
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 description: The user's email address
*                 example: user@example.com
*               password:
*                 type: string
*                 description: The user's password
*                 example: password123
*     responses:
*       200:
*         description: Login successful
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   description: Authentication token
*                 user:
*                   type: object
*                   description: User information
*                   properties:
*                     # Add user properties here 
*       401:
*         description: Invalid credentials
*       400:
*         description: Bad request
*       500:
*         description: Internal server error
*/


/**
 * @openapi
 * /api/v1/auth/send-verification-email:
 *   post:
 *     summary: Send email verification
 *     description: Sends a verification email to the specified email address.
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
 *         description: Verification email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Verification email sent successfully.
 *                   example: Verification email sent successfully
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
 * /api/v1/auth/verify-authentication-code:
 *   post:
 *     summary: Verify authentication code
 *     description: Verifies the authentication code provided by the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email and authentication code for verification.
 *                 example: user@gmail.com
 *               code:
 *                 type: string
 *                 description: The authentication code received by the user.
 *                 example: 12312312
 *     responses:
 *       '200':
 *         description: Authentication code verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the password has been reset.
 *                   example:  successful
 *       '400':
 *         description: Invalid authentication code or token has expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Invalid authentication code or token has expired.
 *                   example: Token Expired
 *       '500':
 *           description: "*Internal server error*"
 *     tags:
 *       - auth
 */