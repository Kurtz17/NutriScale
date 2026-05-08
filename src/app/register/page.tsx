'use client';

import LoginHeader from '@/components/auth/login-header';
import RegisterForm from '@/components/auth/register-form';
import SocialLogin from '@/components/auth/social-login';
import VerificationPending from '@/components/auth/verification-pending';
import { useRegister } from '@/hooks/useRegister';
import Link from 'next/link';

export default function RegisterPage() {
  const {
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
  } = useRegister();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#E2EDDB] p-6 py-12 md:py-20">
      {/* Header */}
      <LoginHeader />

      {/* Register Card */}
      <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl shadow-green-900/10 w-full max-w-[440px] transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {verificationPending ? 'Verifikasi Akun' : 'Create Account'}
        </h2>

        {verificationPending ? (
          <VerificationPending email={registerData.email} />
        ) : (
          <>
            <RegisterForm
              registerData={registerData}
              isLoading={isLoading}
              errorMsg={errorMsg}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              handleChange={handleChange}
              handleRegister={handleRegister}
              togglePassword={togglePassword}
              toggleConfirmPassword={toggleConfirmPassword}
            />

            <SocialLogin handleSocialLogin={handleSocialLogin} />

            <p className="mt-8 text-sm text-gray-500 text-center font-medium">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
