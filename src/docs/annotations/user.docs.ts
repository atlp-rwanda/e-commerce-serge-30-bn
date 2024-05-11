/**
 * @openapi
 * /api/v1/create:
 *   post:
 *     summary: Create a new user
 *     tags: 
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Error occurred while creating user
 *         content:
 *           application/json:
 *             example:
 *               message: Email is already registered
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
/**
 * @openapi
 * /api/v1/resend-verification-token:
 *   post:
 *     summary: Resend Email verification Link
 *     description: Re-sends a user an email verification link in case the first one was expired or lost.
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
 *         description: Emaul verification link sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the email verification link has been resent.
 *                   example: An email verification link has been sent to your email
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
 *                   example: Email address not found/user doesnt exist
 *     tags:
 *       - Users
 */