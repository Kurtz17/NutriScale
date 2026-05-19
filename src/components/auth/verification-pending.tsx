import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VerificationPendingProps {
  email: string;
}

export default function VerificationPending({
  email,
}: VerificationPendingProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 justify-center items-center text-center">
      <div className="bg-[#E8F4FF] p-8 rounded-full mb-2 flex items-center justify-center shadow-inner">
        <Mail className="text-blue-500 w-16 h-16" />
      </div>
      <h3 className="text-2xl font-black text-gray-900">Periksa Email Anda</h3>
      <p className="text-gray-600 text-center text-sm leading-relaxed max-w-[280px]">
        Kami telah mengirimkan tautan verifikasi ke email <br />
        <strong className="text-blue-600 font-bold underline decoration-blue-200 underline-offset-4">
          {email}
        </strong>
        . <br />
        Silakan periksa kotak masuk atau folder spam Anda.
      </p>

      <div className="bg-amber-50 border border-amber-100 text-amber-700 p-5 rounded-2xl w-full flex flex-col text-left gap-2 shadow-sm mt-2">
        <strong className="text-sm font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          Status: Menunggu Verifikasi
        </strong>
        <p className="text-xs leading-relaxed opacity-90">
          Halaman ini akan otomatis dialihkan ke Beranda apabila verifikasi
          berhasil, atau Anda dapat melanjutkan dengan masuk.
        </p>
      </div>

      <Button
        onClick={() => router.push('/login')}
        variant="outline"
        className="w-full mt-4 font-bold border-2 border-gray-100 rounded-2xl py-6 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]"
      >
        Menuju Halaman Login
      </Button>
    </div>
  );
}
