import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface ResetPasswordFormProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  isLoading: boolean;
  errorMsg: string;
  handleResetPassword: (e: React.FormEvent) => void;
  togglePassword: () => void;
  toggleConfirmPassword: () => void;
}

export default function ResetPasswordForm({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  setPassword,
  setConfirmPassword,
  isLoading,
  errorMsg,
  handleResetPassword,
  togglePassword,
  toggleConfirmPassword,
}: ResetPasswordFormProps) {
  return (
    <form
      onSubmit={handleResetPassword}
      className="flex flex-col gap-5 w-full max-w-[400px] bg-white p-10 rounded-[32px] shadow-2xl shadow-green-900/10"
    >
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Ubah Kata Sandi</h2>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Buat kata sandi baru untuk akun Anda.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Sandi Baru</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-12 py-6 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#7CB342] transition-all"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer hover:text-gray-700 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Konfirmasi Sandi Baru</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-12 py-6 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#7CB342] transition-all"
          />
          <button
            type="button"
            onClick={toggleConfirmPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer hover:text-gray-700 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </button>
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
        className="w-full mt-2 py-6 text-base rounded-xl font-bold shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
      >
        {isLoading ? 'Menyimpan...' : 'Simpan Sandi Baru'}
      </Button>
    </form>
  );
}
