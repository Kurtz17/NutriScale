import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginData } from '@/types/auth';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

interface LoginFormProps {
  loginData: LoginData;
  isLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => void;
  togglePassword: () => void;
}

export default function LoginForm({
  loginData,
  isLoading,
  errorMsg,
  showPassword,
  handleChange,
  handleLogin,
  togglePassword,
}: LoginFormProps) {
  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email" className="font-semibold text-gray-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            required
            value={loginData.email}
            onChange={handleChange}
            className="pl-10 py-6 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#7CB342] transition-all"
          />
        </div>
      </div>

      {/* Password */}
      <div className="grid gap-2">
        <Label
          htmlFor="password"
          title="password"
          className="font-semibold text-gray-700"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
            value={loginData.password}
            onChange={handleChange}
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

      <div className="text-right">
        <Link
          href="/recovery"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-sm py-3 px-4 rounded-xl text-center font-medium">
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-6 text-base font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
      >
        {isLoading ? 'Masuk...' : 'Sign In'}
      </Button>
    </form>
  );
}
