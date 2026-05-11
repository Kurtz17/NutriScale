'use client';

import ProductStatusBadge from './product-status-badge';

export type Produk = {
  id: string;
  name: string | null;
  category: string | null;
  price: number | null;
  stok: number | null;
  label_risiko: string | null;
  calories: number | null;
  image: string | null;
};

type ProductTableProps = {
  data: Produk[];
  isLoading: boolean;
};

function getKalori(calories: number | null): string {
  if (!calories) return '-';
  return `${calories} kkal`;
}

function formatHarga(price: number | null): string {
  if (!price) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ProductTable({ data, isLoading }: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-400">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 text-center text-gray-400">
          <p className="text-base font-medium">Produk tidak ditemukan</p>
          <p className="text-sm mt-1">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Nama Produk
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Kategori
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Kalori
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Harga
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Stok
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((produk) => (
              <tr
                key={produk.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {produk.name ?? '-'}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {produk.category ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {produk.category}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {getKalori(produk.calories)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatHarga(produk.price)}
                </td>
                <td className="px-4 py-3 text-gray-600">{produk.stok ?? 0}</td>
                <td className="px-4 py-3">
                  <ProductStatusBadge
                    stok={produk.stok}
                    labelRisiko={produk.label_risiko}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer jumlah data */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500">
          Menampilkan <span className="font-medium">{data.length}</span> produk
        </p>
      </div>
    </div>
  );
}
