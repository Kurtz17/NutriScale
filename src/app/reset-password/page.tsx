'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function ResetPasswordForm() {
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-10 max-w-sm w-full bg-white rounded-3xl shadow-xl">
        <div className="bg-[#E8F4FF] p-4 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-blue-500" />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Sandi Berhasil Diubah!
          </h2>
          <p className="text-sm text-gray-600">
            Kata sandi akun Anda telah diperbarui dengan aman. Silakan gunakan
            sandi baru untuk masuk.
          </p>
        </div>
        <Button
          onClick={() => router.push('/login')}
          className="w-full font-bold py-6 rounded-xl"
        >
          Masuk Sekarang
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleResetPassword}
      className="flex flex-col gap-5 w-full max-w-sm bg-white p-10 rounded-3xl shadow-xl"
    >
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Ubah Kata Sandi</h2>
        <p className="text-sm text-gray-500 mt-2">
          Buat kata sandi baru untuk akun Anda.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Sandi Baru</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 py-6 rounded-xl bg-gray-50 text-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Konfirmasi Sandi Baru</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-10 py-6 rounded-xl bg-gray-50 text-black"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-6 text-base rounded-xl font-bold disabled:opacity-60"
      >
        {isLoading ? 'Menyimpan...' : 'Simpan Sandi Baru'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e2eddb',
        fontFamily: 'sans-serif',
        padding: '20px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#1a1a1a',
            margin: '0',
          }}
        >
          NutriScale
        </h1>
        <p style={{ color: '#6b7280', marginTop: '5px' }}>Pemulihan Akun</p>
      </div>

      <Suspense
        fallback={<div className="text-gray-500">Memuat akses token...</div>}
      >
        <ResetPasswordForm />
      </Suspense>

      <p
        style={{
          marginTop: '24px',
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
        }}
      >
        Teringat kata sandi Anda?{' '}
        <Link
          href="/login"
          style={{
            color: '#3b82f6',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          Sing In
        </Link>
      </p>
    </div>
  );
}
