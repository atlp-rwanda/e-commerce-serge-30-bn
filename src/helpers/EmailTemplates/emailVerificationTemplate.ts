// resetPasswordTemplate.ts

export const verificationEmailTemplate = (verificationLink: string) => {
    return `
      <h1>Verify Your Email Address</h1>
      <p>Thank you for signing up!</p>
      <p>To activate your account, please click on the following link:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not sign up for an account, you can safely ignore this email.</p>
    `;
  };
  