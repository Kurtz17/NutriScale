import { formatAddress } from '@/lib/address-utils';
import { useCartStore } from '@/lib/store/useCartStore';
import {
  CheckoutResponse,
  NotificationState,
  ShippingAddress,
  UserResponse,
} from '@/types/checkout';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function useCheckout() {
  const router = useRouter();
  const { cart, fetchCart } = useCartStore();
  const [isPending, setIsPending] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [formData, setFormData] = useState<ShippingAddress>({
    name: '',
    phone: '',
    address: '',
  });

  const [defaultUserAddress, setDefaultUserAddress] = useState<ShippingAddress>(
    {
      name: '',
      phone: '',
      address: '',
    },
  );

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const user: UserResponse = await res.json();
        const fullAddress = formatAddress(user.address);
        setDefaultUserAddress({
          name: user.name || '',
          phone: user.phone || '',
          address: fullAddress,
        });
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchCart();
  }, [fetchUser, fetchCart]);

  const handleToggleDefault = () => {
    const newValue = !useDefaultAddress;
    setUseDefaultAddress(newValue);
    if (newValue) {
      setFormData(defaultUserAddress);
    } else {
      setFormData({ name: '', phone: '', address: '' });
    }
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      return setNotification({
        isOpen: true,
        message: 'Keranjang belanja Anda kosong!',
        type: 'warning',
      });
    }
    if (!formData.name || !formData.phone || !formData.address) {
      return setNotification({
        isOpen: true,
        message:
          'Harap lengkapi nama, nomor telepon, dan alamat pengiriman terlebih dahulu.',
        type: 'warning',
      });
    }
    setIsConfirmOpen(true);
  };

  const processPayment = async () => {
    setIsConfirmOpen(false);
    setIsPending(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart, alamatKirim: formData }),
      });

      const data: CheckoutResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat checkout');
      }

      if (data.snapToken) {
        localStorage.removeItem('nutriscale-cart');

        window.snap.pay(data.snapToken, {
          onSuccess: () => {
            router.push('/order-history');
          },
          onPending: () => {
            router.push('/order-history');
          },
          onError: () => {
            setNotification({
              isOpen: true,
              message: 'Pembayaran gagal. Silakan coba lagi.',
              type: 'error',
            });
            setIsPending(false);
          },
          onClose: () => {
            setIsPending(false);
          },
        });
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setNotification({
        isOpen: true,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat memproses pembayaran',
        type: 'error',
      });
      setIsPending(false);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalCalories = cart.reduce(
    (acc, item) => acc + item.calories * item.quantity,
    0,
  );
  const shipping = 15000;

  return {
    cart,
    formData,
    setFormData,
    useDefaultAddress,
    isPending,
    isConfirmOpen,
    setIsConfirmOpen,
    notification,
    setNotification,
    handleToggleDefault,
    handlePayment,
    processPayment,
    subtotal,
    totalCalories,
    shipping,
  };
}
