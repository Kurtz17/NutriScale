import Image from 'next/image';

import ProductStatusBadge from './product-status-badge';

type ProductInfoCellProps = {
  name: string | null;
  image: string | null;
  stok: number | null;
  labelRisiko: string | null;
  aiRecommended?: boolean;
};

export function ProductInfoCell({
  name,
  image,
  stok,
  labelRisiko,
  aiRecommended,
}: ProductInfoCellProps) {
  const isImageValid =
    image && (image.startsWith('http') || image.startsWith('/'));

  return (
    <div className="flex items-center gap-4 text-left">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group">
        {isImageValid ? (
          <Image
            src={image as string}
            alt={name ?? 'Produk'}
            width={56}
            height={56}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="text-2xl">{image || name?.charAt(0)}</div>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <p className="font-black text-[#1A1A1B] text-sm truncate max-w-[180px]">
            {name ?? '-'}
          </p>
          <div className="flex gap-1 shrink-0">
            {aiRecommended && (
              <div
                title="Rekomendasi AI"
                className="p-0.5 bg-[#1A1A1B] text-white rounded-md"
              >
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
        <ProductStatusBadge stok={stok} labelRisiko={labelRisiko} />
      </div>
    </div>
  );
}
