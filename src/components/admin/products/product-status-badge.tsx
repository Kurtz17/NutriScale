type StatusBadgeProps = {
  stok: number | null;
  labelRisiko?: string | null;
};

export default function ProductStatusBadge({
  stok,
  labelRisiko,
}: StatusBadgeProps) {
  const isActive = stok !== null && stok > 0;

  return (
    <div className="flex flex-col gap-1">
      {/* Status stok */}
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {isActive ? 'Aktif' : 'Habis'}
      </span>

      {/* Label risiko (opsional) */}
      {labelRisiko && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
          {labelRisiko}
        </span>
      )}
    </div>
  );
}
