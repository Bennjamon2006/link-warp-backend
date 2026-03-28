import type { User } from '@prisma/client';
import { randomBytes } from 'node:crypto';

const fakeNames = [
  'John Doe',
  'Jane Smith',
  'Alice Johnson',
  'Bob Brown',
  'Charlie Davis',
  'Emily Wilson',
  'Frank Miller',
  'Grace Lee',
  'Henry Clark',
  'Ivy Turner',
];

export const getFakeUser = (): User => {
  const index = Math.floor(Math.random() * fakeNames.length);
  const name = fakeNames[index];
  const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
  const password = randomBytes(16).toString('hex');

  return {
    id: `${index + 1}`,
    name,
    email,
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
