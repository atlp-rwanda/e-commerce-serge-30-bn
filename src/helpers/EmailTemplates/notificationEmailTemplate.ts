
export const notificationEmailTemplate = (subject: string, message: string) => {
    return `
      <h1>${subject}</h1>
      <p>${message}</p>
      <p>Thank you for using our platform.</p>
      <p>If you have any questions or concerns, feel free to contact us.</p>
      <p>Best regards,</p>
      <p>Your Team</p>
    `;
  };
  