'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
      }}
    >
      {/* Header NutriScale */}
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

      {/* Login Card */}
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
          Welcome Back
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Login Berhasil!');
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Email Field */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                required
                className="pl-10 py-6 rounded-xl bg-gray-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                className="pl-10 pr-10 py-6 rounded-xl bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link
              href="/recovery"
              style={{
                fontSize: '13px',
                color: '#3b82f6',
                textDecoration: 'none',
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full mt-2 py-6 text-base rounded-xl"
          >
            Sign In
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
            onClick={() =>
              alert('Fitur Login Google akan hadir di berikutnya!')
            }
          >
            <span style={{ fontWeight: 'bold', marginRight: '4px' }}>G</span>{' '}
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl py-6"
            onClick={() => alert('Fitur Login Apple akan hadir di berikutnya!')}
          >
            <span style={{ fontSize: '18px', marginRight: '4px' }}></span>{' '}
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
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            style={{
              color: '#3b82f6',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
