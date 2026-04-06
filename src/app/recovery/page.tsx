'use client';

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
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <input
          type="email"
          placeholder="Email"
          required
          style={{
            width: '100%',
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid #d1d5db',
            backgroundColor: '#f3f4f6',
            color: '#1a1a1a',
            fontSize: '16px',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            borderRadius: '16px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          Kirim
        </button>
      </form>

      {/* Optional: Link back to login if you want to be extra helpful */}
      <Link
        href="/login"
        style={{
          color: '#1a1a1a',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        ← Kembali ke Login
      </Link>
    </div>
  );
}
