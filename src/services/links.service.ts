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

async function getSpaceLinks(spaceId: string) {
  const links = await prisma.link.findMany({
    where: { spaceId },
  });

  return links;
}

async function getLinkBySlug(slug: string, spaceSlug: string) {
  const space = await prisma.space.findUnique({
    where: { slug: spaceSlug },
  });

  if (!space) {
    return null;
  }

  const link = await prisma.link.findFirst({
    where: {
      slug,
      spaceId: space.id,
    },
  });

  return link;
}

export default {
  createLink,
  getSpaceLinks,
  getLinkBySlug,
};
