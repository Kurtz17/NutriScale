import { X } from 'lucide-react';

type ModalHeaderProps = {
  title: string;
  subtitle: string;
  onClose: () => void;
};

export function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-8 border-b border-gray-50">
      <div>
        <h2 className="text-2xl font-black text-[#1A1A1B] tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      </div>
      <button
        onClick={onClose}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export function ErrorDisplay({ error }: { error: string }) {
  if (!error) return null;
  return (
    <div className="bg-red-50 text-red-600 text-xs font-bold px-6 py-4 rounded-2xl animate-in slide-in-from-top-2">
      {error}
    </div>
  );
}
