import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock global fetch for session check
global.fetch = vi.fn();

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (path: string) => {
    return new NextRequest(new URL(path, 'http://localhost'));
  };

  it('should redirect to /login if no session is found', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve(null),
    } as never);

    const req = createRequest('/health-dashboard');
    const res = await middleware(req);

    expect(res?.status).toBe(307); // Temporary Redirect
    expect(res?.headers.get('location')).toContain('/login');
  });

  it('should allow request to proceed if session exists', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve({ user: { id: '123' } }),
    } as never);

    const req = createRequest('/cart');
    const res = await middleware(req);

    // NextResponse.next() doesn't have a status in some versions,
    // but it won't be a redirect.
    expect(res?.status).not.toBe(307);
  });

  it('should redirect to /login if session check fails (error)', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const req = createRequest('/profile');
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/login');
  });
});
