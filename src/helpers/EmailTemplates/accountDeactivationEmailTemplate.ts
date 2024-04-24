export const accountDeactivationEmailTemplate = (username: string) => {
    return `
      <h1>Account Deactivation Notification</h1>
      <p>Dear ${username},</p>
      <p>We regret to inform you that your account has been deactivated.</p>
      <p>If you believe this deactivation is an error or if you have any questions, please contact our support team.</p>
      <p>Thank you for your understanding.</p>
      <p>Best regards,</p>
      <p>Your Team</p>
    `;
  };
  