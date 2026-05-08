import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface RecoveryFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  errorMsg: string;
  handleResetPassword: (e: React.FormEvent) => void;
}

export default function RecoveryForm({
  email,
  setEmail,
  isLoading,
  errorMsg,
  handleResetPassword,
}: RecoveryFormProps) {
  return (
    <form
      onSubmit={handleResetPassword}
      className="flex flex-col gap-6 w-full max-w-[400px]"
    >
      <div className="grid gap-2">
        <Label htmlFor="email" className="font-semibold text-gray-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
            className="pl-10 py-6 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#7CB342] transition-all"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-sm py-3 px-4 rounded-xl text-center font-medium">
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-6 text-base font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
      >
        {isLoading ? 'Sedang mengirim...' : 'Kirim Link Reset'}
      </Button>
    </form>
  );
}
