import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg(
        'Token tidak ditemukan pada URL Anda. Harap ikuti tautan yang dikirim melalui email.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Kombinasi sandi tidak cocok!');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Kombinasi sandi setidaknya 8 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (error) {
        setErrorMsg(
          error.message ??
            'Gagal mengubah kata sandi, token mungkin sudah kadaluarsa.',
        );
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return {
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    setPassword,
    setConfirmPassword,
    isLoading,
    errorMsg,
    isSuccess,
    handleResetPassword,
    togglePassword,
    toggleConfirmPassword,
    router,
  };
}
