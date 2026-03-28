import { describe, it, expect, afterEach } from 'vitest';
import { vi } from 'vitest';
import linksService from '@/services/links.service';
import { prismaMock } from '../mocks/prisma.mock';
import { getFakeLink } from '../mocks/link.mock';
import { getFakeSpace } from '../mocks/space.mock';

// Mock spacesService
vi.mock('@/services/spaces.service', () => ({
  default: {
    checkOwnership: vi.fn(),
  },
}));

import spacesService from '@/services/spaces.service';

describe('Links Service', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new link for a user space', async () => {
    const link = getFakeLink();
    const space = getFakeSpace();

    (
      spacesService.checkOwnership as ReturnType<typeof vi.fn>
    ).mockResolvedValue(true);
    prismaMock.link.create.mockResolvedValue(link);

    const createdLink = await linksService.createLink(
      {
        name: link.name,
        slug: link.slug,
        url: link.url,
        spaceId: link.spaceId,
      },
      space.ownerId
    );

    expect(createdLink).toEqual(link);
    expect(spacesService.checkOwnership).toHaveBeenCalledWith(
      link.spaceId,
      space.ownerId
    );
    expect(prismaMock.link.create).toHaveBeenCalledWith({
      data: {
        name: link.name,
        slug: link.slug,
        url: link.url,
        spaceId: link.spaceId,
      },
    });
  });

  it('should throw error if user does not own the space', async () => {
    const link = getFakeLink();
    const otherUserId = 'different-user-id';

    (
      spacesService.checkOwnership as ReturnType<typeof vi.fn>
    ).mockResolvedValue(false);

    await expect(
      linksService.createLink(
        {
          name: link.name,
          slug: link.slug,
          url: link.url,
          spaceId: link.spaceId,
        },
        otherUserId
      )
    ).rejects.toThrow('Unauthorized');
  });

  it('should retrieve all links for a space', async () => {
    const links = [getFakeLink(), getFakeLink()];
    const spaceId = 'space-1';

    prismaMock.link.findMany.mockResolvedValue(links);

    const result = await linksService.getSpaceLinks(spaceId);

    expect(result).toEqual(links);
    expect(prismaMock.link.findMany).toHaveBeenCalledWith({
      where: { spaceId },
    });
  });

  it('should retrieve a link by slug and space slug', async () => {
    const space = getFakeSpace();
    const link = getFakeLink(space.id);

    prismaMock.space.findUnique.mockResolvedValue(space);
    prismaMock.link.findFirst.mockResolvedValue(link);

    const result = await linksService.getLinkBySlug(link.slug, space.slug);

    expect(result).toEqual(link);
    expect(prismaMock.space.findUnique).toHaveBeenCalledWith({
      where: { slug: space.slug },
    });
    expect(prismaMock.link.findFirst).toHaveBeenCalledWith({
      where: {
        slug: link.slug,
        spaceId: space.id,
      },
    });
  });

  it('should return null if space is not found', async () => {
    prismaMock.space.findUnique.mockResolvedValue(null);

    const result = await linksService.getLinkBySlug(
      'any-slug',
      'non-existent-space'
    );

    expect(result).toBeNull();
  });

  it('should return null if link is not found in space', async () => {
    const space = getFakeSpace();

    prismaMock.space.findUnique.mockResolvedValue(space);
    prismaMock.link.findFirst.mockResolvedValue(null);

    const result = await linksService.getLinkBySlug('non-existent', space.slug);

    expect(result).toBeNull();
  });
});
