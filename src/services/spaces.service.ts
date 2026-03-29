import RequestError from '@/core/RequestError';
import { prisma } from '@/db';
import isUniqueError from '@/helpers/isUniqueError';
import type { CreateSpaceInput } from '@/schemas/createSpace.schema';

async function createSpace(data: CreateSpaceInput, userId: string) {
  try {
    const space = await prisma.space.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        ownerId: userId,
      },
    });

    return space;
  } catch (error) {
    if (isUniqueError(error)) {
      throw RequestError.conflict('Space with the same slug already exists');
    }

    throw error;
  }
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

  if (!space) {
    throw RequestError.notFound('Space not found');
  }

  return space;
}

const checkOwnership = async (spaceId: string, userId: string) => {
  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
  });

  if (!space) {
    throw RequestError.notFound('Space not found');
  }

  if (space.ownerId !== userId) {
    throw RequestError.unauthorized(
      'You do not have permission to perform this action'
    );
  }
};

export default {
  createSpace,
  getUserSpaces,
  getSpaceBySlug,
  checkOwnership,
};
