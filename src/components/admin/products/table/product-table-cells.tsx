type NutritionDisplayProps = {
  calories: number | null;
  protein: number | null;
};

export function NutritionDisplay({ calories, protein }: NutritionDisplayProps) {
  return (
    <div className="inline-block text-center space-y-1">
      <p className="text-xs font-bold text-gray-700">
        <span className="font-mono">{calories ?? 0}</span>{' '}
        <span className="text-[10px] text-gray-400 uppercase">kkal</span>
      </p>
      <p className="text-[10px] font-bold text-[#7CB342] flex items-center justify-center gap-1">
        <span className="font-mono">{protein ?? 0}</span>
        <span className="uppercase">gr Protein</span>
      </p>
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
