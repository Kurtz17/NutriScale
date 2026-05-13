import { authClient } from '@/lib/auth-client';
import { LoginData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useLogin() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!session) return;

    if (session.user.role === 'admin') {
      router.push('/admin/user-management');
    } else {
      router.push('/');
    }
  }, [session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginData.email || !loginData.password) {
      setErrorMsg('Mohon isi email dan password.');
      return;
    }

    setIsLoading(true);

    const { data, error } = await authClient.signIn.email({
      email: loginData.email,
      password: loginData.password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message ?? 'Login gagal. Periksa email dan password.');
      return;
    }

    if (data) {
      if (data.user.role === 'admin') {
        router.push('/admin/user-management');
      } else {
        router.push('/');
      }
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    await authClient.signIn.social({
      provider,
      callbackURL: '/',
    });
  };

  return {
    loginData,
    isLoading,
    errorMsg,
    showPassword,
    handleChange,
    handleLogin,
    togglePassword,
    handleSocialLogin,
  };
}
