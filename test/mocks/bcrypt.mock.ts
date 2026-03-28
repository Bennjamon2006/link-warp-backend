import { vi } from 'vitest';

export const bcryptMock = {
  hashSync: vi.fn(),
  compare: vi.fn(),
};
