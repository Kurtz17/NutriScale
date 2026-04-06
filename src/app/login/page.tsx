'use client';

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
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                color: '#374151',
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}
              >
                ✉️
              </span>
              <input
                type="email"
                placeholder="your.email@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  color: '#1a1a1a',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                color: '#374151',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}
              >
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 40px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  color: '#1a1a1a',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
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

          <button
            type="submit"
            style={{
              padding: '14px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '8px',
            }}
          >
            Sign In
          </button>
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
          <button
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>G</span> Google
          </button>
          <button
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <span style={{ fontSize: '18px' }}></span> Apple
          </button>
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
