import { z } from 'zod';

export const createLinkSchema = z.object({
  name: z.string().min(1, 'Title is required'),
  url: z.url(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase and can contain hyphens'
    ),
  spaceId: z.uuid(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
