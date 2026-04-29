import { GET } from '@/app/api/user/me/route';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { describe, expect, it, vi } from 'vitest';

// --- DATA MOCK (Module Level) ---
const MOCK_USER = {
  id: 'user_123',
  name: 'Kurtz',
  email: 'kurtz@example.com',
  username: 'kurtz17',
};

// --- SPECIFIC MOCKS ---
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('API User Me', () => {
  it('should return 401 if user is not logged in', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it('should return user profile if logged in', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'user_123' },
    } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(MOCK_USER as never);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Kurtz');
    expect(data.email).toBe('kurtz@example.com');
  });

  it('should return 404 if user not found in database', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'user_123' },
    } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(404);
  });
});
