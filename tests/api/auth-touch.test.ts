import { POST } from '@/app/api/auth/touch/route';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('API Auth Touch', () => {
  it('should reject unauthenticated calls', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const response = await POST();

    expect(response.status).toBe(401);
  });

  it('should skip lastOnline update for admins', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'admin-1', role: 'admin' },
    } as never);

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Skipped for admin');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should update lastOnline for regular users', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'user-1', role: 'user' },
    } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({} as never);

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { lastOnline: expect.any(Date) },
    });
  });
});
