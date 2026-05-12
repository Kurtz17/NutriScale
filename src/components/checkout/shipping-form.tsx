import { ShippingAddress } from '@/types/checkout';
import { CheckCircle2, MapPin } from 'lucide-react';

interface ShippingFormProps {
  formData: ShippingAddress;
  useDefaultAddress: boolean;
  onToggleDefault: () => void;
  onFormChange: (data: ShippingAddress) => void;
}

export function ShippingForm({
  formData,
  useDefaultAddress,
  onToggleDefault,
  onFormChange,
}: ShippingFormProps) {
  return (
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

        <button
          onClick={onToggleDefault}
          className="flex items-center gap-2 group"
          type="button"
        >
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              useDefaultAddress
                ? 'bg-[#7CB342] border-[#7CB342]'
                : 'border-gray-200'
            }`}
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
          onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          disabled={useDefaultAddress}
          className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#7CB342] outline-none disabled:opacity-50"
        />
        <input
          type="text"
          placeholder="Nomor Telepon"
          value={formData.phone}
          onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
          disabled={useDefaultAddress}
          className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#7CB342] outline-none disabled:opacity-50"
        />
        <textarea
          placeholder="Alamat Lengkap"
          value={formData.address}
          onChange={(e) =>
            onFormChange({ ...formData, address: e.target.value })
          }
          disabled={useDefaultAddress}
          className="md:col-span-2 bg-gray-50 border-none rounded-2xl p-4 h-32 focus:ring-2 focus:ring-[#7CB342] outline-none disabled:opacity-50"
        />
      </div>
    </div>
  );
}
