import type { Space } from '@prisma/client';
import { randomBytes } from 'node:crypto';

const fakeNames = [
  'Project Alpha',
  'Team Beta',
  'Workspace Gamma',
  'Group Delta',
  'Organization Epsilon',
  'Company Zeta',
];

export const getFakeSpace = (): Space => {
  const index = Math.floor(Math.random() * fakeNames.length);
  const name = fakeNames[index];
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const description = `Description for ${name}`;
  const ownerId = randomBytes(16).toString('hex');

  return {
    id: `${index + 1}`,
    name,
    slug,
    description,
    ownerId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
