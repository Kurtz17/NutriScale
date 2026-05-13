import Image from 'next/image';

import ProductStatusBadge from './product-status-badge';

type ProductInfoCellProps = {
  name: string | null;
  image: string | null;
  stok: number | null;
  labelRisiko: string | null;
};

export function ProductInfoCell({
  name,
  image,
  stok,
  labelRisiko,
}: ProductInfoCellProps) {
  const isImageValid =
    image && (image.startsWith('http') || image.startsWith('/'));

  return (
    <div className="flex items-center gap-4 text-left">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
        {isImageValid ? (
          <Image
            src={image as string}
            alt={name ?? 'Produk'}
            width={48}
            height={48}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="text-2xl">{image || name?.charAt(0)}</div>
        )}
      </div>
      <div>
        <p className="font-black text-[#1A1A1B] text-sm truncate max-w-[200px]">
          {name ?? '-'}
        </p>
        <div className="mt-1">
          <ProductStatusBadge stok={stok} labelRisiko={labelRisiko} />
        </div>
      </div>
    </div>
  );
}
