import { prisma } from '@/db';
import type { CreateLinkInput } from '@/schemas/createLink.schema';
import spacesService from './spaces.service';

async function createLink(data: CreateLinkInput, userId: string) {
  const isOwner = await spacesService.checkOwnership(data.spaceId, userId);

  if (!isOwner) {
    throw new Error('Unauthorized');
  }

  const link = await prisma.link.create({
    data: {
      name: data.name,
      url: data.url,
      slug: data.slug,
      spaceId: data.spaceId,
    },
  });

  return link;
}

export default {
  createLink,
};
