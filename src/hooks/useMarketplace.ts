import { useCartStore } from '@/lib/store/useCartStore';
import { Product } from '@/types/marketplace';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useMarketplace() {
  const router = useRouter();
  const { cart, addToCart, updateQuantity, removeFromCart, fetchCart } =
    useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [targetCalories, setTargetCalories] = useState(2000);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const targetCaloriesHeader = res.headers.get('X-Target-Calories');
          if (targetCaloriesHeader) {
            setTargetCalories(Number(targetCaloriesHeader));
          }
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    fetchCart();
  }, [fetchCart]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category)),
    );
    return ['All', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalCalories = useMemo(
    () =>
      cart.reduce((total, item) => total + item.calories * item.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return alert('Keranjang masih kosong!');
    router.push('/checkout');
  }, [cart, router]);

  return {
    products,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    targetCalories,
    categories,
    filteredProducts,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalCalories,
    subtotal,
    handleCheckout,
  };
}
