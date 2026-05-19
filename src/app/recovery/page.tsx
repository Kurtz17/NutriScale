'use client';

import LoginHeader from '@/components/auth/login-header';
import RecoveryForm from '@/components/auth/recovery-form';
import RecoverySuccess from '@/components/auth/recovery-success';
import { useRecovery } from '@/hooks/useRecovery';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RecoveryPage() {
  const {
    email,
    setEmail,
    isLoading,
    isSuccess,
    errorMsg,
    handleResetPassword,
  } = useRecovery();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#E2EDDB] p-6">
      {/* Title Section */}
      <LoginHeader />

      <div className="text-center mb-8 max-w-[400px]">
        <h2 className="text-3xl font-black text-gray-900 mb-3">
          Password Recovery
        </h2>
        <p className="text-gray-600 font-medium">
          {isSuccess
            ? 'Email pengaturan ulang kata sandi telah dikirim'
            : 'Masukkan email agar mendapatkan link untuk reset password'}
        </p>
      </div>

      {isSuccess ? (
        <RecoverySuccess email={email} />
      ) : (
        <RecoveryForm
          email={email}
          setEmail={setEmail}
          isLoading={isLoading}
          errorMsg={errorMsg}
          handleResetPassword={handleResetPassword}
        />
      )}

      <Link
        href="/login"
        className="mt-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Login
      </Link>
    </div>
  );
}
