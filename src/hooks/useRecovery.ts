import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

export function useRecovery() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      });

      if (error) {
        setErrorMsg(
          error.message ?? 'Gagal mengirim email reset kombinasi sandi.',
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

  return {
    email,
    setEmail,
    isLoading,
    isSuccess,
    errorMsg,
    handleResetPassword,
  };
}
