import { CheckCircle2 } from 'lucide-react';

interface RecoverySuccessProps {
  email: string;
}

export default function RecoverySuccess({ email }: RecoverySuccessProps) {
  return (
    <div className="bg-white p-10 rounded-[32px] shadow-2xl shadow-green-900/10 w-full max-w-[440px] text-center flex flex-col gap-6 items-center">
      <div className="bg-[#E8F4FF] p-6 rounded-full flex items-center justify-center shadow-inner">
        <CheckCircle2 className="w-12 h-12 text-blue-500" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-gray-900">
          Cek Kotak Masuk Anda
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Tautan instruksi untuk mengatur ulang kata sandi Anda telah berhasil
          dikirim ke{' '}
          <strong className="text-blue-600 font-bold underline decoration-blue-200 underline-offset-4">
            {email}
          </strong>
          . <br />
          Mohon cek juga folder Spam Anda bila belum menemukannya.
        </p>
      </div>
    </div>
  );
}
