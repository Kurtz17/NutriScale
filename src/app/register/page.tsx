'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Section } from '@/components/ui/section';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNextStep = async () => {
    setErrorMsg('');

    if (
      !registerData.fullName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setErrorMsg('Mohon isi semua data akun.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMsg('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    setIsLoading(true);

    const { data, error } = await authClient.signUp.email({
      name: registerData.fullName,
      email: registerData.email,
      password: registerData.password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message ?? 'Registrasi gagal. Coba lagi.');
      return;
    }

    if (data) {
      setStep(2);
    }
  };

  const handleCompleteRegistration = () => {
    if (!selectedCategory) return;
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col m-28 gap-5">
      {step === 1 ? (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="flex gap-2 px-0 text-black hover:bg-transparent"
        >
          <span className="material-symbols-outlined text-black">
            arrow_left_alt
          </span>
          <span className="items-start text-black">Back</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 px-0 text-black hover:bg-transparent"
          onClick={() => setStep(1)}
        >
          <span className="material-symbols-outlined text-black">
            arrow_left_alt
          </span>
          <span className="items-start text-black">Back</span>
        </Button>
      )}

      <div className="justify-center items-center text-center flex flex-col">
        <h1 className="font-bold text-3xl text-black">Create Account</h1>
        <p className="font-normal text-base text-black">
          Join NutriScale Today!
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-4xl w-10 h-10 flex items-center bg-black text-white justify-center">
            1
          </div>
          <span className="text-black">Account Info</span>
        </div>
        <div
          className={`w-16 h-1 rounded-2xl ${step === 2 ? 'bg-black' : 'bg-[#E5E7EB]'}`}
        ></div>
        <div className="flex items-center gap-2">
          <div
            className={`rounded-4xl w-10 h-10 flex items-center justify-center ${step === 2 ? 'bg-black text-white' : 'bg-[#E5E7EB] text-[#6A7282]'}`}
          >
            2
          </div>
          <span className={step === 2 ? 'text-black' : 'text-[#6A7282]'}>
            Category
          </span>
        </div>
      </div>

      <Section
        title={step === 1 ? 'Account Information' : 'Select Category'}
        description={
          step === 1
            ? undefined
            : 'Select the category that best describes your nutritional needs'
        }
        className="flex flex-col min-h-124 max-h-124 gap-3.5 justify-center align-middle"
      >
        {step === 1 ? (
          <div className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div className="flex flex-col">
              <Label htmlFor="fullName" className="text-black font-medium">
                Full Name
              </Label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-gray-400 text-xs">
                  person
                </span>
                <Input
                  type="text"
                  required
                  id="fullName"
                  value={registerData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border-[#E5E7EB] bg-[#F3F3F5] py-2 pl-11 pr-3 text-black focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <Label htmlFor="email" className="text-black font-medium">
                Email
              </Label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-gray-400 text-xs">
                  mail
                </span>
                <Input
                  type="email"
                  required
                  id="email"
                  value={registerData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full rounded-2xl border-[#E5E7EB] bg-[#F3F3F5] py-2 pl-11 pr-3 text-black focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Label className="text-black font-medium" htmlFor="password">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-gray-400 pointer-events-none text-xs">
                    lock
                  </span>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full rounded-2xl border-[#E5E7EB] bg-[#F3F3F5] py-2 pl-11 pr-11 text-black"
                    placeholder="Create a strong password"
                    value={registerData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 flex items-center justify-center p-0 border-none bg-transparent outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px] leading-none block">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <Label
                  className="text-black font-medium"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-gray-400 pointer-events-none text-xs">
                    lock
                  </span>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="w-full rounded-2xl border-[#E5E7EB] bg-[#F3F3F5] py-2 pl-11 pr-11 text-black"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 flex items-center justify-center p-0 border-none bg-transparent outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px] leading-none block">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            <Button
              onClick={handleNextStep}
              disabled={isLoading}
              className="rounded-2xl py-2 font-bold disabled:opacity-60"
            >
              {isLoading ? 'Memproses...' : 'Next Step'}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: 'ANAK_BALITA',
                  label: 'Anak Balita',
                  icon: '👶',
                  color: '#FFE8E8',
                  desc: 'Nutrition for children under 5 years',
                },
                {
                  id: 'IBU_HAMIL',
                  label: 'Ibu Hamil',
                  icon: '🤰',
                  color: '#E8F4FF',
                  desc: 'Nutrition for pregnant women',
                },
                {
                  id: 'PASCA_OPERASI',
                  label: 'Pasca Operasi',
                  icon: '🏥',
                  color: '#FFF4E8',
                  desc: 'Post-operative recovery nutrition',
                },
                {
                  id: 'UMUM',
                  label: 'Umum',
                  icon: '🧍',
                  color: '#E1EEDD',
                  desc: 'General health & wellness',
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 border-2 rounded-2xl flex flex-row items-left gap-2 transition-all ${selectedCategory === cat.id ? 'border-black' : 'border-[#E5E7EB]'}`}
                  style={{ backgroundColor: cat.color }}
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <div className="flex flex-col gap-1 text-left">
                    <span className="font-bold text-lg text-black">
                      {cat.label}
                    </span>
                    <span className="text-sm text-gray-500">{cat.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button
              disabled={!selectedCategory}
              onClick={handleCompleteRegistration}
              className="rounded-2xl py-2 font-bold disabled:bg-gray-300"
            >
              Complete Registration
            </Button>
          </>
        )}

        <div className="flex flex-row justify-center gap-1">
          <span className="text-black">Already have an account?</span>
          <Link href="/login" className="text-blue-500">
            Sign In
          </Link>
        </div>
      </Section>
    </div>
  );
}
