'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// 1. Definisikan interface untuk data registrasi
interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
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

  // 2. Gunakan interface pada useState
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
      });

      if (error) {
        setErrorMsg(error.message ?? 'Registrasi gagal. Coba lagi.');
      } else {
        setVerificationPending(true);
      }
    } catch (err) {
      // 3. Menghindari 'any' pada catch block
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat mendaftar.';
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... isi return JSX kamu tetap sama (tidak ada perubahan di bagian UI)
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e2eddb',
        fontFamily: 'sans-serif',
        padding: '40px 20px',
      }}
    >
      {/* Header */}
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
        <p style={{ color: '#6b7280', marginTop: '5px' }}>
          Your personalized health companion
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#111827',
          }}
        >
          {verificationPending ? 'Verifikasi Akun' : 'Create Account'}
        </h2>

        {verificationPending ? (
          <div className="flex flex-col gap-6 justify-center items-center text-center">
            <div className="bg-[#E8F4FF] p-6 rounded-full mb-2 flex items-center justify-center">
              <Mail className="text-blue-500 w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-black">Periksa Email Anda</h3>
            <p className="text-black text-center text-sm leading-relaxed">
              Kami telah mengirimkan tautan verifikasi ke email <br />
              <strong className="text-blue-600">
                {registerData.email}
              </strong>. <br />
              Silakan periksa kotak masuk atau folder spam Anda.
            </p>

            <div className="bg-[#FFF4E8] border border-[#FFE8E8] text-[#D97706] p-4 rounded-xl w-full flex items-start gap-4 shadow-sm mt-2">
              <div className="text-xs flex flex-col text-left gap-1">
                <strong className="text-sm">Status: Menunggu Verifikasi</strong>
                <span>
                  Halaman ini akan otomatis dialihkan ke Beranda apabila
                  verifikasi berhasil, atau Anda dapat melanjutkan dengan masuk.
                </span>
              </div>
            </div>

            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              className="w-full mt-2 font-bold border-2 border-slate-200 rounded-xl py-6 hover:bg-gray-50"
            >
              Menuju Halaman Login
            </Button>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleRegister}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Full Name */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    required
                    id="fullName"
                    value={registerData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="pl-10 py-6 rounded-xl bg-gray-50 text-black"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    required
                    id="email"
                    value={registerData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="pl-10 py-6 rounded-xl bg-gray-50 text-black"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={handleChange}
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

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={handleChange}
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

              {/* Error Message */}
              {errorMsg && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-6 text-base rounded-xl disabled:opacity-60"
              >
                {isLoading ? 'Memproses...' : 'Sign Up'}
              </Button>
            </form>

            <div
              style={{
                margin: '24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}
              ></div>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                Or continue with
              </span>
              <div
                style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}
              ></div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl py-6"
                onClick={async () => {
                  await authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/',
                  });
                }}
              >
                <span style={{ fontWeight: 'bold', marginRight: '4px' }}>
                  G
                </span>{' '}
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl py-6"
                disabled
              >
                <span style={{ fontSize: '18px', marginRight: '4px' }}></span>{' '}
                Apple
              </Button>
            </div>

            <p
              style={{
                marginTop: '24px',
                fontSize: '14px',
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              Already have an account?{' '}
              <Link
                href="/login"
                style={{
                  color: '#3b82f6',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
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
