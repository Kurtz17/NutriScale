import { POST as BAN } from '@/app/api/admin/users/ban/route';
import { DELETE, GET } from '@/app/api/admin/users/route';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const ADMIN_SESSION = { user: { id: 'admin-1', role: 'admin' } };

describe('API Admin Users', () => {
  beforeEach(() => {
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN_SESSION as never);
  });

  it('should reject non-admin users', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'user-1', role: 'user' },
    } as never);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it('should return non-admin users sorted by newest', async () => {
    const users = [
      {
        id: 'user-1',
        name: 'Nadia',
        email: 'nadia@test.local',
        role: 'user',
        createdAt: new Date('2026-05-01T00:00:00.000Z'),
        banned: false,
        banReason: null,
        banExpires: null,
        lastOnline: null,
      },
    ];
    vi.mocked(prisma.user.findMany).mockResolvedValue(users as never);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: [
        {
          ...users[0],
          createdAt: '2026-05-01T00:00:00.000Z',
        },
      ],
    });
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { role: { not: 'admin' } },
      orderBy: { createdAt: 'desc' },
      select: expect.objectContaining({
        id: true,
        email: true,
        banned: true,
      }),
    });
  });

  it('should require userId before deleting a user', async () => {
    const response = await DELETE(
      new Request('http://localhost/api/admin/users', { method: 'DELETE' }),
    );

    expect(response.status).toBe(400);
  });

  it('should not allow admin to delete their own account', async () => {
    const response = await DELETE(
      new Request('http://localhost/api/admin/users?userId=admin-1', {
        method: 'DELETE',
      }),
    );

    expect(response.status).toBe(400);
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it('should delete another user account', async () => {
    vi.mocked(prisma.user.delete).mockResolvedValue({} as never);

    const response = await DELETE(
      new Request('http://localhost/api/admin/users?userId=user-1', {
        method: 'DELETE',
      }),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
  });

  it('should ban a user with reason and expiry', async () => {
    vi.mocked(prisma.user.update).mockResolvedValue({
      id: 'user-1',
      banned: true,
    } as never);

    const response = await BAN(
      new Request('http://localhost/api/admin/users/ban', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-1',
          banned: true,
          reason: 'Violation',
          expires: '2026-06-01T00:00:00.000Z',
        }),
      }),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        banned: true,
        banReason: 'Violation',
        banExpires: new Date('2026-06-01T00:00:00.000Z'),
      },
    });
  });
});
