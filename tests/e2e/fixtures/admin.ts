import type { Page } from '@playwright/test';

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  price: number;
  stok: number;
  label_risiko: string;
  image: string;
  tags: string[];
};

type AdminOrder = {
  id: string;
  createdAt: string;
  rawDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    price: number;
    qty: number;
  }>;
  note: string | null;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  banReason?: string | null;
  banExpires?: string | null;
  createdAt: string;
  lastOnline: string | null;
};

export type AdminMockState = {
  products: AdminProduct[];
  orders: AdminOrder[];
  users: AdminUser[];
  productRequests: Array<{ method: string; body?: unknown; id?: string }>;
  orderRequests: Array<{ method: string; body?: unknown }>;
  userRequests: Array<{ method: string; body?: unknown; query?: string }>;
};

export function createAdminMockState(): AdminMockState {
  return {
    products: [
      {
        id: 'e2e-prod-1',
        name: 'E2E Granola Bowl',
        category: 'Grains',
        calories: 250,
        protein: 8,
        price: 32000,
        stok: 12,
        label_risiko: 'Aman',
        image: 'G',
        tags: ['Tinggi Serat'],
      },
      {
        id: 'e2e-prod-2',
        name: 'E2E Recovery Yogurt',
        category: 'Dairy',
        calories: 180,
        protein: 14,
        price: 28000,
        stok: 0,
        label_risiko: 'Rendah Gula',
        image: 'Y',
        tags: ['Tinggi Protein'],
      },
    ],
    orders: [
      {
        id: 'ORD-E2E-001',
        createdAt: '24 Mei 2026',
        rawDate: '2026-05-24T08:00:00.000Z',
        totalPrice: 79000,
        status: 'DIPROSES',
        paymentStatus: 'BERHASIL',
        customer: {
          name: 'Nadia E2E',
          email: 'nadia.e2e@example.com',
          phone: '081234567890',
          address: 'Jl. Testing No. 1',
        },
        items: [{ name: 'E2E Granola Bowl', price: 32000, qty: 2 }],
        note: 'Kirim pagi.',
      },
      {
        id: 'ORD-E2E-002',
        createdAt: '23 Mei 2026',
        rawDate: '2026-05-23T08:00:00.000Z',
        totalPrice: 43000,
        status: 'TERTUNDA',
        paymentStatus: 'TERTUNDA',
        customer: {
          name: 'Rafi E2E',
          email: 'rafi.e2e@example.com',
          phone: '089876543210',
          address: 'Jl. Mock No. 2',
        },
        items: [{ name: 'E2E Recovery Yogurt', price: 28000, qty: 1 }],
        note: null,
      },
    ],
    users: [
      {
        id: 'user-e2e-1',
        name: 'Nadia E2E',
        email: 'nadia.e2e@example.com',
        role: 'user',
        banned: false,
        createdAt: '2026-04-01T08:00:00.000Z',
        lastOnline: '2026-05-24T08:00:00.000Z',
      },
      {
        id: 'user-e2e-2',
        name: 'Rafi Banned',
        email: 'rafi.banned@example.com',
        role: 'user',
        banned: true,
        banReason: 'Existing test ban',
        banExpires: null,
        createdAt: '2026-03-10T08:00:00.000Z',
        lastOnline: null,
      },
    ],
    productRequests: [],
    orderRequests: [],
    userRequests: [],
  };
}

export async function mockAdminApis(page: Page) {
  const state = createAdminMockState();

  await page.route('**/api/admin/dashboard?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          totalUser: 128,
          totalOrder: 42,
          activeOrders: 8,
          totalRevenue: 1250000,
          weeklySummary: [
            { date: '2026-05-18', revenue: 120000, orders: 3 },
            { date: '2026-05-19', revenue: 90000, orders: 2 },
            { date: '2026-05-20', revenue: 180000, orders: 4 },
          ],
        },
      }),
    });
  });

  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ products: state.products }),
    });
  });

  await page.route('**/api/admin/products', async (route) => {
    const request = route.request();

    if (request.method() !== 'POST') {
      await route.fallback();
      return;
    }

    const body = request.postDataJSON() as Record<string, unknown>;
    state.productRequests.push({ method: 'POST', body });
    const created: AdminProduct = {
      id: 'e2e-prod-created',
      name: String(body.namaProduk),
      category: String(body.kategori || 'Other'),
      calories: Number(
        (body.nilaiGizi as { calories?: number } | undefined)?.calories || 0,
      ),
      protein: Number(
        (body.nilaiGizi as { protein?: number } | undefined)?.protein || 0,
      ),
      price: Number(body.harga),
      stok: Number(body.stok || 0),
      label_risiko: String(body.labelRisiko || ''),
      image: String(body.gambar || ''),
      tags: ((body.nilaiGizi as { tags?: string[] } | undefined)?.tags ||
        []) as string[],
    };
    state.products.unshift(created);

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, product: created }),
    });
  });

  await page.route('**/api/admin/products/*', async (route) => {
    const request = route.request();
    const id = new URL(request.url()).pathname.split('/').pop() || '';

    if (request.method() === 'PATCH') {
      const body = request.postDataJSON() as Record<string, unknown>;
      state.productRequests.push({ method: 'PATCH', id, body });
      state.products = state.products.map((product) =>
        product.id === id
          ? {
              ...product,
              name: String(body.namaProduk),
              category: String(body.kategori || product.category),
              price: Number(body.harga),
              stok: Number(body.stok || product.stok),
            }
          : product,
      );

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    if (request.method() === 'DELETE') {
      state.productRequests.push({ method: 'DELETE', id });
      state.products = state.products.filter((product) => product.id !== id);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    await route.fallback();
  });

  await page.route('**/api/admin/orders', async (route) => {
    const request = route.request();

    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orders: state.orders }),
      });
      return;
    }

    if (request.method() === 'PATCH') {
      const body = request.postDataJSON() as {
        orderId: string;
        status: string;
      };
      state.orderRequests.push({ method: 'PATCH', body });
      state.orders = state.orders.map((order) =>
        order.id === body.orderId ? { ...order, status: body.status } : order,
      );

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    await route.fallback();
  });

  await page.route('**/api/admin/users**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname.endsWith('/ban')) {
      const body = request.postDataJSON() as {
        userId: string;
        banned: boolean;
        reason?: string | null;
      };
      state.userRequests.push({ method: 'POST', body });
      state.users = state.users.map((user) =>
        user.id === body.userId
          ? {
              ...user,
              banned: body.banned,
              banReason: body.reason,
            }
          : user,
      );

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: state.users }),
      });
      return;
    }

    if (request.method() === 'DELETE') {
      const userId = url.searchParams.get('userId') || '';
      state.userRequests.push({ method: 'DELETE', query: userId });
      state.users = state.users.filter((user) => user.id !== userId);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    await route.fallback();
  });

  return state;
}
