import { Product } from '@/components/ui/productCard';
import { create } from 'zustand';

export type CartItem = Product & {
  quantity: number;
};

interface CartState {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product) => Promise<void>;
  updateQuantity: (
    productId: string | number,
    quantity: number,
  ) => Promise<void>;
  removeFromCart: (productId: string | number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        set({ cart: data.cart || [] });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (product) => {
    const { cart } = get();
    const existing = cart.find((item) => item.id === product.id);
    const stok = product.stok;

    // Jangan tambah jika sudah mencapai batas stok
    if (existing && stok !== null && existing.quantity >= stok) {
      return;
    }

    // Optimistic update
    if (existing) {
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: String(product.id), quantity: 1 }),
      });
    } catch (error) {
      console.error('Failed to add to cart on server', error);
      // Rollback could be implemented here
    }
  },

  updateQuantity: async (productId, quantity) => {
    const { cart } = get();
    const item = cart.find((i) => i.id === productId);
    const stok = item?.stok;

    // Batasi quantity sesuai stok yang tersedia
    const clampedQty =
      stok !== null && stok !== undefined
        ? Math.min(Math.max(1, quantity), stok)
        : Math.max(1, quantity);

    set({
      cart: cart.map((i) =>
        i.id === productId ? { ...i, quantity: clampedQty } : i,
      ),
    });

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: String(productId),
          quantity: clampedQty,
          setExact: true,
        }),
      });
    } catch (error) {
      console.error('Failed to update quantity on server', error);
    }
  },

  removeFromCart: async (productId) => {
    set({
      cart: get().cart.filter((item) => item.id !== productId),
    });

    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: String(productId) }),
      });
    } catch (error) {
      console.error('Failed to remove from cart on server', error);
    }
  },

  clearCart: () => set({ cart: [] }),
}));
