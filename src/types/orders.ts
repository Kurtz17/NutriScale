export type OrderItem = {
  name: string;
  price: number;
  qty: number;
};

export type OrderHistory = {
  id: string;
  date: string;
  rawDate: string;
  totalPrice: number;
  totalCalories: number;
  status: string;
  snapToken: string | null;
  alamatKirim?: { name: string; phone: string; address: string } | null;
  items: OrderItem[];
};

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
