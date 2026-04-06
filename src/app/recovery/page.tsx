'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RecoveryPage() {
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#e2eddb',
        fontFamily: 'sans-serif',
        padding: '0 20px',
      }}
    >
      {/* Title Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#000',
            marginBottom: '16px',
          }}
        >
          Password Recovery
        </h1>
        <p
          style={{
            color: '#1a1a1a',
            fontSize: '18px',
            lineHeight: '1.4',
            maxWidth: '400px',
          }}
        >
          {isSuccess
            ? 'Email pengaturan ulang kata sandi telah dikirim'
            : 'Masukkan email agar mendapatkan link untuk reset password'}
        </p>
      </div>

      {isSuccess ? (
        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '430px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            alignItems: 'center',
          }}
        >
          <div className="bg-[#E8F4FF] p-4 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Cek Kotak Masuk Anda
          </h2>
          <p className="text-sm text-gray-600">
            Tautan instruksi untuk mengatur ulang kata sandi Anda telah berhasil
            dikirim ke <strong>{email}</strong>. Mohon cek juga folder Spam Anda
            bila belum menemukannya.
          </p>
        </div>
      ) : (
        /* Form Section */
        <form
          onSubmit={handleResetPassword}
          style={{
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Bagian Email Field */}
          <div className="grid gap-2 text-left w-full">
            <Label htmlFor="email" className="text-sm font-medium mb-1">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                className="pl-10 py-6 rounded-xl bg-gray-50 border-gray-300"
              />
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
            className="w-full py-6 text-base font-bold rounded-xl bg-black hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sedang mengirim...' : 'Kirim Link Reset'}
          </Button>
        </form>
      )}

      {/* Optional: Link back to login if you want to be extra helpful */}
      <Link
        href="/login"
        className="mt-8 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
        style={{ textDecoration: 'none' }}
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Login
      </Link>
    </div>
  );
}
