import { useLogin } from '@/hooks/useLogin';
import { useRecovery } from '@/hooks/useRecovery';
import { useRegister } from '@/hooks/useRegister';
import { useResetPassword } from '@/hooks/useResetPassword';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMocks = vi.hoisted(() => ({
  push: vi.fn(),
  searchParamGet: vi.fn(),
  useSession: vi.fn(),
  signInEmail: vi.fn(),
  signInSocial: vi.fn(),
  signUpEmail: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: authMocks.push }),
  useSearchParams: () => ({ get: authMocks.searchParamGet }),
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: () => authMocks.useSession(),
    signIn: {
      email: authMocks.signInEmail,
      social: authMocks.signInSocial,
    },
    signUp: {
      email: authMocks.signUpEmail,
    },
    requestPasswordReset: authMocks.requestPasswordReset,
    resetPassword: authMocks.resetPassword,
  },
}));

const submitEvent = {
  preventDefault: vi.fn(),
} as unknown as React.FormEvent;

const inputEvent = (id: string, value: string) =>
  ({
    target: { id, value },
  }) as React.ChangeEvent<HTMLInputElement>;

describe('auth hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMocks.useSession.mockReturnValue({ data: null });
    authMocks.searchParamGet.mockReturnValue('reset-token');
  });

  it('useLogin should validate required credentials before calling auth API', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin(submitEvent);
    });

    expect(result.current.errorMsg).toBe('Mohon isi email dan password.');
    expect(authMocks.signInEmail).not.toHaveBeenCalled();
  });

  it('useLogin should redirect admin users after successful login', async () => {
    authMocks.signInEmail.mockResolvedValue({
      data: { user: { role: 'admin' } },
      error: null,
    });
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleChange(inputEvent('email', 'admin@test.local'));
      result.current.handleChange(inputEvent('password', 'password123'));
    });
    await act(async () => {
      await result.current.handleLogin(submitEvent);
    });

    expect(authMocks.signInEmail).toHaveBeenCalledWith({
      email: 'admin@test.local',
      password: 'password123',
    });
    expect(authMocks.push).toHaveBeenCalledWith('/admin/dashboard');
  });

  it('useRegister should reject mismatched passwords', async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleChange(inputEvent('fullName', 'Test User'));
      result.current.handleChange(inputEvent('email', 'user@test.local'));
      result.current.handleChange(inputEvent('password', 'password123'));
      result.current.handleChange(inputEvent('confirmPassword', 'different'));
    });
    await act(async () => {
      await result.current.handleRegister(submitEvent);
    });

    expect(result.current.errorMsg).toBe(
      'Password dan Konfirmasi Password tidak cocok!',
    );
    expect(authMocks.signUpEmail).not.toHaveBeenCalled();
  });

  it('useRegister should show verification pending after successful signup', async () => {
    authMocks.signUpEmail.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleChange(inputEvent('fullName', 'Test User'));
      result.current.handleChange(inputEvent('email', 'user@test.local'));
      result.current.handleChange(inputEvent('password', 'password123'));
      result.current.handleChange(inputEvent('confirmPassword', 'password123'));
    });
    await act(async () => {
      await result.current.handleRegister(submitEvent);
    });

    expect(authMocks.signUpEmail).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'user@test.local',
      password: 'password123',
      callbackURL: '/login',
    });
    expect(result.current.verificationPending).toBe(true);
  });

  it('useRecovery should request password reset and expose success state', async () => {
    authMocks.requestPasswordReset.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useRecovery());

    act(() => result.current.setEmail('user@test.local'));
    await act(async () => {
      await result.current.handleResetPassword(submitEvent);
    });

    expect(authMocks.requestPasswordReset).toHaveBeenCalledWith({
      email: 'user@test.local',
      redirectTo: '/reset-password',
    });
    expect(result.current.isSuccess).toBe(true);
  });

  it('useResetPassword should validate token and password before reset', async () => {
    authMocks.searchParamGet.mockReturnValue(null);
    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.handleResetPassword(submitEvent);
    });

    expect(result.current.errorMsg).toContain('Token tidak ditemukan');
    expect(authMocks.resetPassword).not.toHaveBeenCalled();
  });

  it('useResetPassword should call auth reset API when input is valid', async () => {
    authMocks.resetPassword.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useResetPassword());

    act(() => {
      result.current.setPassword('newpassword123');
      result.current.setConfirmPassword('newpassword123');
    });
    await act(async () => {
      await result.current.handleResetPassword(submitEvent);
    });

    expect(authMocks.resetPassword).toHaveBeenCalledWith({
      newPassword: 'newpassword123',
      token: 'reset-token',
    });
    expect(result.current.isSuccess).toBe(true);
  });
});
