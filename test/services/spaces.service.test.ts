import { describe, it, expect } from 'vitest';
import spacesService from '@/services/spaces.service';
import { prismaMock } from '../mocks/prisma.mock';
import { getFakeSpace } from '../mocks/space.mock';

describe('Spaces Service', () => {
  it('should create a new space for a user', async () => {
    const space = getFakeSpace();

    prismaMock.space.create.mockResolvedValue(space);

    const createdSpace = await spacesService.createSpace(
      {
        name: space.name,
        slug: space.slug,
        description: space.description || undefined,
      },
      space.ownerId
    );

    expect(createdSpace).toEqual(space);
    expect(prismaMock.space.create).toHaveBeenCalledWith({
      data: {
        name: space.name,
        slug: space.slug,
        description: space.description,
        ownerId: space.ownerId,
      },
    });
  });

  it('should retrieve all spaces for a user', async () => {
    const spaces = [getFakeSpace(), getFakeSpace()];

    prismaMock.space.findMany.mockResolvedValue(spaces);

    const result = await spacesService.getUserSpaces(spaces[0].ownerId);

    expect(result).toEqual(spaces);
    expect(prismaMock.space.findMany).toHaveBeenCalledWith({
      where: { ownerId: spaces[0].ownerId },
    });
  });

  it('should retrieve a space by slug', async () => {
    const space = getFakeSpace();

    prismaMock.space.findUnique.mockResolvedValue(space);

    const result = await spacesService.getSpaceBySlug(space.slug);

    expect(result).toEqual(space);
    expect(prismaMock.space.findUnique).toHaveBeenCalledWith({
      where: { slug: space.slug },
    });
  });

  it('should return null if space is not found', async () => {
    prismaMock.space.findUnique.mockResolvedValue(null);

    const result = await spacesService.getSpaceBySlug('non-existent');

    expect(result).toBeNull();
  });

  it('should return true if user owns the space', async () => {
    const space = getFakeSpace();

    prismaMock.space.findUnique.mockResolvedValue(space);

    const result = await spacesService.checkOwnership(space.id, space.ownerId);

    expect(result).toBe(true);
  });

  it('should return false if user does not own the space', async () => {
    const space = getFakeSpace();
    const otherUserId = 'different-user-id';

    prismaMock.space.findUnique.mockResolvedValue(space);

    const result = await spacesService.checkOwnership(space.id, otherUserId);

    expect(result).toBe(false);
  });
});
