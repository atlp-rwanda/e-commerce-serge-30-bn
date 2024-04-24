
export const resetPasswordTemplate = (resetUrl: string) => {
  return `
    <h1>Password Reset</h1>
    <p>You have requested a password reset for your account.</p>
    <p>Click on the following link to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 24 hours.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;

};

