import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'SELESAI':
        return 'bg-green-100 text-green-700';
      case 'DIBATALKAN':
        return 'bg-red-100 text-red-700';
      case 'TERTUNDA':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'SELESAI':
        return '✓ Selesai';
      case 'DIBATALKAN':
        return '✕ Dibatalkan';
      case 'DIKIRIM':
        return '● Sedang Dikirim';
      case 'DIPROSES':
        return '● Sedang Diproses';
      default:
        return '● Menunggu Pembayaran';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`px-4 py-1.5 rounded-full font-bold border-none text-xs ${getStatusStyles()}`}
    >
      {getStatusText()}
    </Badge>
  );
}
