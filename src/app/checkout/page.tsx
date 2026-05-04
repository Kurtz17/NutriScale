'use client';
import { useCartStore } from '@/lib/store/useCartStore';
import {
  CheckCircle2,
  ChevronLeft,
  MapPin,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

// Type declaration untuk Midtrans Snap.js
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart } = useCartStore();
  const [isPending, setIsPending] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: 'error' | 'warning' | 'success';
  } | null>(null);

  // --- TUGAS ARYA: FITUR ALAMAT DEFAULT ---
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [defaultUserAddress, setDefaultUserAddress] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const user = await res.json();
          let fullAddress = '';
          if (user.address) {
            const addr = user.address;
            const parts = [];
            if (addr.detailAlamat) parts.push(addr.detailAlamat);
            if (addr.jalan) parts.push(addr.jalan);
            if (addr.rt || addr.rw)
              parts.push(`RT ${addr.rt || '-'} / RW ${addr.rw || '-'}`);
            if (addr.kelurahan) parts.push(addr.kelurahan);
            if (addr.kecamatan) parts.push(addr.kecamatan);
            if (addr.kabupaten) parts.push(addr.kabupaten);
            if (addr.provinsi) parts.push(addr.provinsi);
            if (addr.kodePos) parts.push(addr.kodePos);
            fullAddress = parts.join(', ');
          }
          setDefaultUserAddress({
            name: user.name || '',
            phone: user.phone || '',
            address: fullAddress,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  const handleToggleDefault = () => {
    setUseDefaultAddress(!useDefaultAddress);
    if (!useDefaultAddress) {
      setFormData(defaultUserAddress);
    } else {
      setFormData({ name: '', phone: '', address: '' });
    }
  };

  const handlePayment = () => {
    if (cart.length === 0)
      return setNotification({
        isOpen: true,
        message: 'Keranjang belanja Anda kosong!',
        type: 'warning',
      });
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

      const data = await response.json();

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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalCalories = cart.reduce(
    (acc, item) => acc + item.calories * item.quantity,
    0,
  );
  const shipping = 15000;

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      <div className="max-w-7xl mx-auto px-4 py-10 pb-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Kembali ke Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Daftar Pesanan */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#E1EEDD] rounded-2xl">
                  <ShoppingCart className="w-6 h-6 text-[#7CB342]" />
                </div>
                <h2 className="text-xl font-black text-[#1A1A1B]">
                  Daftar Pesanan
                </h2>
              </div>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <h4 className="font-bold text-sm text-[#1A1A1B]">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          {item.quantity} pcs
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-sm text-[#1A1A1B]">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alamat Pengiriman + Fitur Centang Alamat Default */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#E1EEDD] rounded-2xl">
                    <MapPin className="w-6 h-6 text-[#7CB342]" />
                  </div>
                  <h2 className="text-xl font-black text-[#1A1A1B]">
                    Alamat Pengiriman
                  </h2>
                </div>

                {/* --- CHECKBOX ALAMAT DEFAULT --- */}
                <button
                  onClick={handleToggleDefault}
                  className="flex items-center gap-2 group"
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${useDefaultAddress ? 'bg-[#7CB342] border-[#7CB342]' : 'border-gray-200'}`}
                  >
                    {useDefaultAddress && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-[#7CB342]">
                    Gunakan Alamat Default
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nama Penerima"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={useDefaultAddress}
                  className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#7CB342] outline-none disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="Nomor Telepon"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={useDefaultAddress}
                  className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#7CB342] outline-none disabled:opacity-50"
                />
                <textarea
                  placeholder="Alamat Lengkap"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={useDefaultAddress}
                  className="md:col-span-2 bg-gray-50 border-none rounded-2xl p-4 h-32 focus:ring-2 focus:ring-[#7CB342] outline-none disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* KANAN: Ringkasan Tagihan */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#1A1A1B] text-white rounded-[2rem] p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-[#7CB342]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  AI Nutrition Summary
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold">Total Kalori</span>
                <span className="text-xl font-black text-[#7CB342]">
                  {totalCalories} kcal
                </span>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
              <h3 className="font-black text-lg text-[#1A1A1B]">
                Ringkasan Tagihan
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-400">
                  <span>Subtotal ({cart.length} item)</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-400">
                  <span>Ongkos Kirim</span>
                  <span>Rp {shipping.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                  <span className="font-black text-[#1A1A1B]">
                    Total Pembayaran
                  </span>
                  <span className="font-black text-[#1A1A1B] text-xl">
                    Rp {(subtotal + shipping).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isPending || cart.length === 0}
                className="w-full bg-[#1A1A1B] text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
              >
                {isPending ? 'Processing...' : 'Bayar Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up Konfirmasi Pesanan */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-[#1A1A1B] mb-2 text-center">
              Konfirmasi Pesanan
            </h3>
            <p className="text-gray-500 text-center mb-8 font-medium">
              Apakah Anda yakin ingin memproses pesanan ini? Pastikan keranjang
              dan alamat pengiriman sudah sesuai.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-4 rounded-2xl font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={processPayment}
                className="flex-1 py-4 rounded-2xl font-black text-white bg-[#1A1A1B] hover:bg-gray-800 transition-colors shadow-lg"
              >
                Ya, Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Notification Modal */}
      {notification?.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${notification.type === 'error' ? 'bg-red-100' : notification.type === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`}
            >
              <ShieldCheck
                className={`w-8 h-8 ${notification.type === 'error' ? 'text-red-600' : notification.type === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}
              />
            </div>
            <h3 className="text-xl font-black text-[#1A1A1B] mb-2">
              {notification.type === 'error'
                ? 'Oops! Terjadi Kesalahan'
                : notification.type === 'warning'
                  ? 'Perhatian'
                  : 'Berhasil'}
            </h3>
            <p className="text-gray-500 font-medium mb-8">
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className="w-full py-4 rounded-2xl font-black text-white bg-[#1A1A1B] hover:bg-gray-800 transition-colors shadow-lg"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
