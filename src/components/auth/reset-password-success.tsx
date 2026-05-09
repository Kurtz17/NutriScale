import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10 max-w-[400px] w-full bg-white rounded-[32px] shadow-2xl shadow-green-900/10">
      <div className="bg-[#E8F4FF] p-6 rounded-full flex items-center justify-center shadow-inner">
        <CheckCircle2 className="w-12 h-12 text-blue-500" />
      </div>
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-black text-gray-900">
          Sandi Berhasil Diubah!
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Kata sandi akun Anda telah diperbarui dengan aman. Silakan gunakan
          sandi baru untuk masuk.
        </p>
      </div>
      <Button
        onClick={() => router.push('/login')}
        className="w-full font-bold py-6 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
      >
        Masuk Sekarang
      </Button>
    </div>
  );
}
