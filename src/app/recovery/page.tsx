'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function RecoveryPage() {
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
          Masukkan email agar mendapatkan link untuk reset password
        </p>
      </div>

      {/* Form Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert('Link reset password telah dikirim ke email anda!');
        }}
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
              placeholder="Enter your registered email"
              required
              className="pl-10 py-6 rounded-xl bg-gray-50 border-gray-300"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-6 text-base font-bold rounded-xl bg-black hover:bg-gray-800"
        >
          Kirim
        </Button>
      </form>

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
