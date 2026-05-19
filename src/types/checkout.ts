export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
}

export interface CheckoutResponse {
  snapToken?: string;
  error?: string;
}

export interface UserResponse {
  name?: string;
  phone?: string;
  address?: {
    detailAlamat?: string;
    jalan?: string;
    rt?: string;
    rw?: string;
    kelurahan?: string;
    kecamatan?: string;
    kabupaten?: string;
    provinsi?: string;
    kodePos?: string;
  };
}

export interface NotificationState {
  isOpen: boolean;
  message: string;
  type: 'error' | 'warning' | 'success';
}
