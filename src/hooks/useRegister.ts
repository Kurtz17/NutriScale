import { authClient } from '@/lib/auth-client';
import { RegisterData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRegister() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);

  useEffect(() => {
    if (session && !verificationPending) {
      router.push('/');
    }
  }, [session, router, verificationPending]);

  const [registerData, setRegisterData] = useState<RegisterData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (
      !registerData.fullName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setErrorMsg('Mohon isi semua data akun.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMsg('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        callbackURL: '/login',
      });

      if (error) {
        setErrorMsg(error.message ?? 'Registrasi gagal. Coba lagi.');
      } else {
        setVerificationPending(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat mendaftar.';
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    await authClient.signIn.social({
      provider,
      callbackURL: '/',
    });
  };

  return {
    registerData,
    isLoading,
    errorMsg,
    showPassword,
    showConfirmPassword,
    verificationPending,
    handleChange,
    handleRegister,
    togglePassword,
    toggleConfirmPassword,
    handleSocialLogin,
  };
}
