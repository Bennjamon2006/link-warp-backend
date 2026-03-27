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

export default {
  createSpace,
};
