'use client';

import LoginForm from '@/components/auth/login-form';
import LoginHeader from '@/components/auth/login-header';
import SocialLogin from '@/components/auth/social-login';
import { useLogin } from '@/hooks/useLogin';
import Link from 'next/link';

export default function LoginPage() {
  const {
    loginData,
    isLoading,
    errorMsg,
    showPassword,
    handleChange,
    handleLogin,
    togglePassword,
    handleSocialLogin,
  } = useLogin();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#E2EDDB] p-6">
      {/* Header */}
      <LoginHeader />

      {/* Login Card */}
      <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl shadow-green-900/10 w-full max-w-[440px] transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Welcome Back</h2>

        <LoginForm
          loginData={loginData}
          isLoading={isLoading}
          errorMsg={errorMsg}
          showPassword={showPassword}
          handleChange={handleChange}
          handleLogin={handleLogin}
          togglePassword={togglePassword}
        />

        <SocialLogin handleSocialLogin={handleSocialLogin} />

        <p className="mt-8 text-sm text-gray-500 text-center font-medium">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
