// twoFactorAuthEmailTemplate.ts

import { TokenDataProp } from '../../controllers/auth.controller';

export const twoFactorAuthEmailTemplate = ({
  name,
  code,
}: TokenDataProp) => {
  return `
      ${name ? `<h1>Hello <span style={color: "blue"}>${name}</span></h1>` : ''}
      <h3>Your Verification Code</h3>
      <h2>Verification Code : ${code}</h2>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not sign up for an account, you can safely ignore this email.</p>
    `;
};
