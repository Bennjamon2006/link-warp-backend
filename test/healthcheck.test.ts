import { describe, it, expect, afterEach, vi } from 'vitest';
import { prismaMock } from './mocks/prisma.mock';
import { prisma } from '@/db';

describe('Test Environment / Prisma Mock Setup', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should run tests', () => {
    expect(true).toBe(true);
  });

  it('should mock prisma correctly', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: '1',
      name: 'Test User',
    });

    const user = await prisma.user.findUnique({
      where: { id: '1' },
    });

    expect(user).toEqual({ id: '1', name: 'Test User' });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
