'use client';

import { CheckoutModals } from '@/components/checkout/checkout-modals';
import { OrderList } from '@/components/checkout/order-list';
import { PaymentSummary } from '@/components/checkout/payment-summary';
import { ShippingForm } from '@/components/checkout/shipping-form';
import { useCheckout } from '@/hooks/useCheckout';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const {
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
  } = useCheckout();

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
            <OrderList items={cart} />
            <ShippingForm
              formData={formData}
              useDefaultAddress={useDefaultAddress}
              onToggleDefault={handleToggleDefault}
              onFormChange={setFormData}
            />
          </div>

          <PaymentSummary
            totalCalories={totalCalories}
            subtotal={subtotal}
            shipping={shipping}
            cartLength={cart.length}
            isPending={isPending}
            onPayment={handlePayment}
          />
        </div>
      </div>

      <CheckoutModals
        isConfirmOpen={isConfirmOpen}
        onConfirmClose={() => setIsConfirmOpen(false)}
        onProcessPayment={processPayment}
        notification={notification}
        onNotificationClose={() => setNotification(null)}
      />
    </>
  );
}
