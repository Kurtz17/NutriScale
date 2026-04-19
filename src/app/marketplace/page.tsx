'use client';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { SmartCart } from '@/components/marketplace/SmartCard';
import { CartItem, Product } from '@/types/marketplace';
import { Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Data Produk Simulasi sesuai desain kamu
const PRODUCTS = [
  {
    id: '1',
    name: 'Organic Brown Rice',
    category: 'Grains',
    price: 25000,
    calories: 370,
    protein: 7.9,
    image: '🌾',
    tags: ['Low Sodium', 'Whole Grain'],
    isAIRecommended: true,
  },
  {
    id: '2',
    name: 'Fresh Chicken Breast',
    category: 'Protein',
    price: 45000,
    calories: 165,
    protein: 31,
    image: '🍗',
    tags: ['High Protein', 'Low Fat'],
    isAIRecommended: true,
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    category: 'Dairy',
    price: 18000,
    calories: 100,
    protein: 17,
    image: '🥛',
    tags: ['High Protein', 'Probiotic'],
  },
  {
    id: '4',
    name: 'Salmon Fillet',
    category: 'Protein',
    price: 85000,
    calories: 206,
    protein: 22,
    image: '🐟',
    tags: ['Omega-3', 'Heart-Healthy'],
    isAIRecommended: true,
  },
  {
    id: '5',
    name: 'Mixed Vegetables',
    category: 'Vegetables',
    price: 15000,
    calories: 50,
    protein: 3,
    image: '🥗',
    tags: ['Low Calorie', 'High Fiber'],
    isAIRecommended: true,
  },
  {
    id: '6',
    name: 'Almond Milk',
    category: 'Dairy',
    price: 22000,
    calories: 30,
    protein: 1,
    image: '🥛',
    tags: ['Low Calorie', 'Lactose-Free'],
  },
];

export default function MarketplacePage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('nutriscale-cart');
    const timeout = setTimeout(() => {
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setHasHydrated(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      if (cartItems.length > 0) {
        localStorage.setItem('nutriscale-cart', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('nutriscale-cart');
      }
    }
  }, [cartItems, hasHydrated]);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('nutriscale-cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('nutriscale-cart');
    }
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    console.log('Menambahkan produk:', product.name);
    setCartItems((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      if (isExist) {
        // Kalau barang sudah ada, tambah jumlahnya saja
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // Kalau barang baru, masukkan ke array dengan quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 2. Fungsi Update Quantity (Tambah/Kurang)
  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  // 3. Fungsi Hapus Barang
  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return alert('Keranjang masih kosong!');
    localStorage.setItem('nutriscale-cart', JSON.stringify(cartItems));
    router.push('/checkout');
  };
  if (!hasHydrated) return null; //atau nanti ada loading spinner kecil

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Halaman */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1A1A1B] mb-2">
          Health Marketplace
        </h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Curated healthy foods & ingredients for your needs
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Sisi Kiri: Katalog Produk */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Search & Filter Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <button className="bg-white p-4 border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50">
              <Filter className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Grid Produk Responsif */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>

        {/* Sisi Kanan: Smart AI Cart (Sticky) */}
        <div className="w-full lg:w-fit">
          <SmartCart
            items={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
