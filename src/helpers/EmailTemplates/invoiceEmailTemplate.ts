export const invoiceEmailTemplate = (invoiceNumber: string, amount: number, dueDate: string, downloadUrl: string) => {
    return `
      <h1>Invoice #${invoiceNumber}</h1>
      <p>Amount: $${amount}</p>
      <p>Due Date: ${dueDate}</p>
      <p>Please find attached your invoice.</p>
      <p>You can also download your invoice <a href="${downloadUrl}">here</a>.</p>
      <p>If you have any questions or concerns, feel free to contact us.</p>
      <p>Thank you for your business!</p>
    `;
  };
  