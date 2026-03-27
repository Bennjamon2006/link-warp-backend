import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase and can contain hyphens'
    ),
  description: z.string().optional(),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
