import { describe, it, expect } from 'vitest';
import usersService from '@/services/users.service';
import { prismaMock } from '../mocks/prisma.mock';
import { bcryptMock } from '../mocks/bcrypt.mock';
import { getFakeUser } from '../mocks/user.mock';

describe('Users Service', () => {
  it('should create a new user with hashed password', async () => {
    const newUser = getFakeUser();
    const hashedPassword = `hashed-${newUser.password}`;

    bcryptMock.hashSync.mockReturnValue(hashedPassword);

    prismaMock.user.create.mockResolvedValue({
      ...newUser,
      password: hashedPassword,
    });

    const createdUser = await usersService.createUser({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    });

    expect(createdUser).toEqual({
      id: newUser.id,
    });
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: newUser.name,
        email: newUser.email,
        password: hashedPassword,
      },
    });
  });

  it('should retrieve a user by id', async () => {
    const existingUser = getFakeUser();
    prismaMock.user.findUnique.mockResolvedValue(existingUser);

    const user = await usersService.getUserById(existingUser.id);

    expect(user).toEqual(existingUser);
  });

  it('should return null if user is not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const user = await usersService.getUserById('non-existent-id');

    expect(user).toBeNull();
  });
});
