import type { Link } from '@prisma/client';

const fakeNames = [
  'GitHub',
  'Twitter',
  'LinkedIn',
  'Portfolio',
  'Blog',
  'YouTube',
];

export const getFakeLink = (spaceId: string = 'space-1'): Link => {
  const index = Math.floor(Math.random() * fakeNames.length);
  const name = fakeNames[index];
  const slug = name.toLowerCase();

  return {
    id: `link-${index + 1}`,
    name,
    slug,
    url: `https://${slug}.com`,
    spaceId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
