'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  AdminOrderStatus,
  AdminPaymentStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
} from '@/types/admin-orders';

interface OrderStatusDropdownProps {
  value: AdminOrderStatus;
  paymentStatus: AdminPaymentStatus;
  onChange: (status: AdminOrderStatus) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default';
}

export function OrderStatusDropdown({
  value,
  paymentStatus,
  onChange,
  disabled = false,
  className,
  size = 'sm',
}: OrderStatusDropdownProps) {
  const isPendingUnpaid = value === 'TERTUNDA' && paymentStatus !== 'BERHASIL';

  const availableOptions = ORDER_STATUS_OPTIONS.filter((option) => {
    if (option.value === 'DIBATALKAN') {
      return false;
    }
    if (paymentStatus === 'BERHASIL' && option.value === 'TERTUNDA') {
      return false;
    }
    if (value === 'DIKIRIM' && option.value === 'DIPROSES') {
      return false;
    }
    return true;
  });

  const isTerminal = value === 'SELESAI' || value === 'DIBATALKAN';

  if (isTerminal) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-bold w-fit min-w-[140px]',
          value === 'SELESAI'
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700',
          className,
        )}
      >
        {ORDER_STATUS_LABELS[value]}
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        setTimeout(() => {
          onChange(next as AdminOrderStatus);
        }, 150);
      }}
      disabled={disabled || isPendingUnpaid}
    >
      <SelectTrigger
        size={size}
        className={cn(
          'min-w-[140px] rounded-xl border-gray-200 bg-white text-[13px] font-medium',
          className,
        )}
      >
        <SelectValue placeholder="Pilih status" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
        {availableOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-[13px] font-medium"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
