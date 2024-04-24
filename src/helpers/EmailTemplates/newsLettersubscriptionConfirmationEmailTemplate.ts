export const subscriptionConfirmationEmailTemplate = (username: string, confirmationLink: string) => {
    return `
      <h1>Welcome, ${username}!</h1>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>To confirm your subscription, please click on the following link:</p>
      <a href="${confirmationLink}">Confirm Subscription</a>
      <p>By confirming your subscription, you'll receive updates, news, and special offers from us.</p>
      <p>If you did not subscribe to our newsletter, you can ignore this email.</p>
      <p>Thank you!</p>
    `;
  };
  