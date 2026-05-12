import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegisterData } from '@/types/auth';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

interface RegisterFormProps {
  registerData: RegisterData;
  isLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegister: (e: React.FormEvent) => void;
  togglePassword: () => void;
  toggleConfirmPassword: () => void;
}

export default function RegisterForm({
  registerData,
  isLoading,
  errorMsg,
  showPassword,
  showConfirmPassword,
  handleChange,
  handleRegister,
  togglePassword,
  toggleConfirmPassword,
}: RegisterFormProps) {
  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      {/* Full Name */}
      <div className="grid gap-2">
        <Label htmlFor="fullName" className="font-semibold text-gray-700">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            required
            id="fullName"
            value={registerData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="pl-10 py-6 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#7CB342] transition-all"
          />
        </div>
      </div>

      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email" className="font-semibold text-gray-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="email"
            required
            id="email"
            value={registerData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
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
            required
            placeholder="••••••••"
            value={registerData.password}
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

      {/* Confirm Password */}
      <div className="grid gap-2">
        <Label
          htmlFor="confirmPassword"
          title="confirmPassword"
          className="font-semibold text-gray-700"
        >
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            value={registerData.confirmPassword}
            onChange={handleChange}
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

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-sm py-3 px-4 rounded-xl text-center font-medium mt-2">
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 py-6 text-base font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
      >
        {isLoading ? 'Memproses...' : 'Sign Up'}
      </Button>
    </form>
  );
}
