import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('auth forms', () => {
  it('LoginForm should render controlled values, submit, and toggle password visibility', () => {
    const handleLogin = vi.fn((event: React.FormEvent) =>
      event.preventDefault(),
    );
    const togglePassword = vi.fn();

    render(
      <LoginForm
        loginData={{ email: 'user@test.local', password: 'secret123' }}
        isLoading={false}
        errorMsg="Login gagal"
        showPassword={false}
        handleChange={vi.fn()}
        handleLogin={handleLogin}
        togglePassword={togglePassword}
      />,
    );

    const email = screen.getByLabelText(/Email Address/i) as HTMLInputElement;
    const password = screen.getByLabelText(/^Password$/i) as HTMLInputElement;

    expect(email.value).toBe('user@test.local');
    expect(password.type).toBe('password');
    expect(screen.getByText('Login gagal')).toBeTruthy();

    fireEvent.click(password.parentElement?.querySelector('button') as Element);
    fireEvent.submit(
      screen.getByRole('button', { name: /Sign In/i }).closest('form')!,
    );

    expect(togglePassword).toHaveBeenCalledTimes(1);
    expect(handleLogin).toHaveBeenCalledTimes(1);
  });

  it('RegisterForm should render loading state and submit current form', () => {
    const handleRegister = vi.fn((event: React.FormEvent) =>
      event.preventDefault(),
    );

    render(
      <RegisterForm
        registerData={{
          fullName: 'Nadia',
          email: 'nadia@test.local',
          password: 'password123',
          confirmPassword: 'password123',
        }}
        isLoading
        errorMsg=""
        showPassword={false}
        showConfirmPassword
        handleChange={vi.fn()}
        handleRegister={handleRegister}
        togglePassword={vi.fn()}
        toggleConfirmPassword={vi.fn()}
      />,
    );

    expect(
      (screen.getByLabelText(/Full Name/i) as HTMLInputElement).value,
    ).toBe('Nadia');
    expect(screen.getByRole('button', { name: /Memproses/i })).toBeTruthy();
    expect(
      (screen.getByLabelText(/Confirm Password/i) as HTMLInputElement).type,
    ).toBe('text');

    fireEvent.submit(
      screen.getByRole('button', { name: /Memproses/i }).closest('form')!,
    );

    expect(handleRegister).toHaveBeenCalledTimes(1);
  });
});
