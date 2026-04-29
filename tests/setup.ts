import { beforeEach, vi } from 'vitest';

// Mock Prisma secara global
vi.mock('@/lib/prisma', () => ({
  default: {
    produkMakanan: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    cart: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    transaksiPembayaran: {
      create: vi.fn(),
      update: vi.fn(),
    },
    cartItem: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    pesanan: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    profilKesehatan: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    riwayatAnalisis: {
      create: vi.fn(),
    },
    mealPlan: {
      create: vi.fn(),
    },
  },
}));

// Mock Next.js Headers secara global
vi.mock('next/headers', () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

// Reset semua mock otomatis setiap ganti test case agar antar test tidak saling mengganggu
beforeEach(() => {
  vi.clearAllMocks();
});
