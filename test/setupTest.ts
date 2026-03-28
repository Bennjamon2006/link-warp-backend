import { vi, beforeEach } from 'vitest';
import { prismaMock } from './mocks/prisma.mock';
import { bcryptMock } from './mocks/bcrypt.mock';
import { jsonwebtokenMock } from './mocks/jsonwebtoken.mock';

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock('@/db', () => ({
  prisma: prismaMock,
}));

vi.mock('bcrypt', () => bcryptMock);
vi.mock('jsonwebtoken', () => jsonwebtokenMock);
