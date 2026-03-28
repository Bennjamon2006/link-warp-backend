import { vi, beforeEach } from 'vitest';
import { prismaMock } from './mocks/prisma.mock';

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock('@/db', () => ({
  prisma: prismaMock,
}));
