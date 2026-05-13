type NutritionDisplayProps = {
  calories: number | null;
  protein: number | null;
  tags?: string[];
};

export function NutritionDisplay({
  calories,
  protein,
  tags = [],
}: NutritionDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-center">
        <p className="text-xs font-black text-gray-900">
          <span className="font-mono text-base">{calories ?? 0}</span>{' '}
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
            kkal
          </span>
        </p>
        <p className="text-[10px] font-black text-[#7CB342] uppercase tracking-tighter">
          {protein ?? 0}g Protein
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 max-w-[150px]">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-50 text-[9px] font-black text-gray-500 rounded-md border border-gray-100 uppercase"
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-[9px] font-black text-gray-400">
              +{tags.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

type StockDisplayProps = {
  stok: number | null;
};

export function StockDisplay({ stok }: StockDisplayProps) {
  const isLowStock = (stok ?? 0) <= 5;
  return (
    <div className="flex flex-col items-center">
      <span
        className={`text-sm font-black font-mono ${
          isLowStock ? 'text-red-500' : 'text-gray-700'
        }`}
      >
        {stok ?? 0}
      </span>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
        Available Unit
      </span>
    </div>
  );
}
