import { VerifyTokenService } from '../src/service/VerifyToken.service';
import VerifyToken from '../src/models/verifytokens.model';

jest.mock('../src/models/verifytokens.model');

describe('VerifyTokenService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new token', async () => {
    const userData = {
      email: 'test@example.com',
      token: '123456',
      expirationTime: new Date(),
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    (VerifyToken.create as jest.Mock).mockResolvedValue({
      email: userData.email,
      token: userData.token,
      expirationTime: userData.expirationTime,
      user_id: userData.user_id,
    } as never);

    const newToken = await VerifyTokenService.createToken(userData as never);

    expect(VerifyToken.create).toHaveBeenCalledTimes(1);
    expect(newToken).toEqual({
      email: userData.email,
      token: userData.token,
      expirationTime: userData.expirationTime,
      user_id: userData.user_id,
    });
  });

  it('should throw an error if token creation fails', async () => {
    const userData = {
      email: 'test@example.com',
      token: '123456',
      expirationTime: new Date(),
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    (VerifyToken.create as jest.Mock).mockRejectedValue(new Error('Token creation failed'));

    await expect(VerifyTokenService.createToken(userData as never)).rejects.toThrowError(
      
    );
  });

  it('should find a user by email and token', async () => {
    const email = 'test@example.com';
    const token = '123456';

    (VerifyToken.findOne as jest.Mock).mockResolvedValue({
      email,
      token,
    } as never);

    const user = await VerifyTokenService.findEmailAndToken(email, token);

    expect(VerifyToken.findOne).toHaveBeenCalledTimes(1);
    expect(user).toEqual({
      email,
      token,
    });
  });

  it('should throw an error if user is not found', async () => {
    const email = 'test@example.com';
    const token = '123456';

    (VerifyToken.findOne as jest.Mock).mockResolvedValue(null);

    const user = await VerifyTokenService.findEmailAndToken(email, token);

    expect(VerifyToken.findOne).toHaveBeenCalledTimes(1);
    expect(user).toBeNull();
  });

  it('should throw an error if finding user fails', async () => {
    const email = 'test@example.com';
    const token = '123456';

    (VerifyToken.findOne as jest.Mock).mockRejectedValue(new Error('User not found'));

    await expect(
      VerifyTokenService.findEmailAndToken(email, token),
    ).rejects.toThrowError();
  });
});