import { prisma } from '@/db';
import type { CreateSpaceInput } from '@/schemas/createSpace.schema';

async function createSpace(data: CreateSpaceInput, userId: string) {
  const space = await prisma.space.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      ownerId: userId,
    },
  });

  return space;
}

async function getUserSpaces(userId: string) {
  const spaces = await prisma.space.findMany({
    where: {
      ownerId: userId,
    },
  });

  return spaces;
}

async function getSpaceBySlug(slug: string) {
  const space = await prisma.space.findUnique({
    where: {
      slug,
    },
  });

  return space;
}

const checkOwnership = async (spaceId: string, userId: string) => {
  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
  });

  return space?.ownerId === userId;
};

export default {
  createSpace,
  getUserSpaces,
  getSpaceBySlug,
  checkOwnership,
};
