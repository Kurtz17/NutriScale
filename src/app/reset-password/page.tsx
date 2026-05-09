'use client';

import LoginHeader from '@/components/auth/login-header';
import ResetPasswordForm from '@/components/auth/reset-password-form';
import ResetPasswordSuccess from '@/components/auth/reset-password-success';
import { useResetPassword } from '@/hooks/useResetPassword';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const {
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
  } = useResetPassword();

  if (isSuccess) {
    return <ResetPasswordSuccess />;
  }

  return (
    <ResetPasswordForm
      password={password}
      confirmPassword={confirmPassword}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      isLoading={isLoading}
      errorMsg={errorMsg}
      handleResetPassword={handleResetPassword}
      togglePassword={togglePassword}
      toggleConfirmPassword={toggleConfirmPassword}
    />
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#E2EDDB] p-6 py-12">
      <div className="mb-10 flex flex-col items-center">
        <LoginHeader />
        <p className="text-gray-500 font-bold mt-[-20px]">Pemulihan Akun</p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#7CB342] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold">Memuat akses token...</p>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>

      <p className="mt-8 text-sm text-gray-500 text-center font-medium">
        Teringat kata sandi Anda?{' '}
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
