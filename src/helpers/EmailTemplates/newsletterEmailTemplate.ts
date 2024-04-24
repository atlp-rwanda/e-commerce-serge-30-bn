export const newsletterEmailTemplate = (title: string, content: string) => {
    return `
      <h1>${title}</h1>
      <p>${content}</p>
      <p>Stay tuned for more updates!</p>
      <p>If you have any feedback or suggestions, feel free to reach out to us.</p>
      <p>Best regards,</p>
      <p>Your Team</p>
    `;
  };
  