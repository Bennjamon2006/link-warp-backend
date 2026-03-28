import { describe, it, expect } from 'vitest';
import authService from '@/services/auth.service';
import { prismaMock } from '../mocks/prisma.mock';
import { bcryptMock } from '../mocks/bcrypt.mock';
import { jsonwebtokenMock } from '../mocks/jsonwebtoken.mock';
import { getFakeUser } from '../mocks/user.mock';

describe('Auth Service', () => {
  it('should authenticate a user and return a token', async () => {
    const existingUser = getFakeUser();
    const token = crypto.randomUUID();

    prismaMock.user.findUnique.mockResolvedValue(existingUser);
    bcryptMock.compare.mockResolvedValue(true);
    jsonwebtokenMock.sign.mockReturnValue(token);

    const result = await authService.login({
      email: existingUser.email,
      password: existingUser.password,
    });

    expect(result).toEqual(token);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: existingUser.email },
    });
    expect(bcryptMock.compare).toHaveBeenCalledWith(
      existingUser.password,
      existingUser.password
    );
  });

  it('should reject invalid credentials and return null', async () => {
    const existingUser = getFakeUser();
    prismaMock.user.findUnique.mockResolvedValue(existingUser);
    bcryptMock.compare.mockResolvedValue(false);

    await expect(
      authService.login({
        email: existingUser.email,
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should reject invalid credentials when user is not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'non-existent@example.com',
        password: 'anyPassword',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should verify a valid token and return the payload', async () => {
    const existingUser = getFakeUser();
    const token = crypto.randomUUID();
    const payload = { userId: existingUser.id };

    jsonwebtokenMock.verify.mockReturnValue(payload);

    const result = await authService.verifyToken(token);

    expect(result).toEqual(payload);
    expect(jsonwebtokenMock.verify).toHaveBeenCalledWith(
      token,
      expect.any(String)
    );
  });

  it('should return null for an invalid token', async () => {
    const token = crypto.randomUUID();

    jsonwebtokenMock.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = await authService.verifyToken(token);

    expect(result).toBeNull();
    expect(jsonwebtokenMock.verify).toHaveBeenCalledWith(
      token,
      expect.any(String)
    );
  });

  it('should return null for an expired token', async () => {
    const token = crypto.randomUUID();

    jsonwebtokenMock.verify.mockImplementation(() => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      throw error;
    });

    const result = await authService.verifyToken(token);

    expect(result).toBeNull();
    expect(jsonwebtokenMock.verify).toHaveBeenCalledWith(
      token,
      expect.any(String)
    );
  });

  it('should return null for a token with invalid payload', async () => {
    const token = crypto.randomUUID();

    jsonwebtokenMock.verify.mockReturnValue({ invalid: 'payload' });

    const result = await authService.verifyToken(token);

    expect(result).toBeNull();
    expect(jsonwebtokenMock.verify).toHaveBeenCalledWith(
      token,
      expect.any(String)
    );
  });
});
