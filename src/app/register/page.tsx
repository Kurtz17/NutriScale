'use client';
import { useState } from 'react';

export default function Register() {
  interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    category:
      | ['Anak Balita', 'Ibu Hamil', 'Pasien Pasca-Operasi', 'Umum']
      | string;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: 'Umum',
  });

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNextStep = () => {
    if (registerData.password !== registerData.confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok!');
      return;
    }
    if (!registerData.fullName || !registerData.email) {
      alert('Mohon isi semua data akun.');
      return;
    }
    setStep(2);
  };
  return (
    <div className="flex flex-col m-28 gap-5">
      {step === 1 ? (
        <div className="flex gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-black">
            arrow_left_alt
          </span>
          <h4 className="items-start text-black">Back</h4>
        </div>
      ) : (
        <div className="flex gap-2 cursor-pointer" onClick={() => setStep(1)}>
          <span className="material-symbols-outlined text-black">
            arrow_left_alt
          </span>
          <h4 className="items-start text-black">Back</h4>
        </div>
      )}
      <div className="justify-center items-center text-center flex flex-col">
        <h1 className="font-bold text-3xl text-black">Create Account</h1>
        <p className="font-normal text-base text-black">
          Join NutriScale Today!
        </p>
      </div>
      {step === 1 ? (
        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-4xl w-10 h-10 flex items-center bg-black text-white justify-center">
              1
            </div>
            <span className="text-black">Account Info</span>
          </div>
          <div className="w-16 h-1 bg-[#E5E7EB] rounded-2xl"></div>
          <div className="flex items-center gap-2">
            <div className="rounded-4xl w-10 h-10 flex bg-[#E5E7EB] text-[#6A7282] items-center justify-center">
              2
            </div>
            <span className="text-[#6A7282]">Category</span>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-4xl w-10 h-10 flex items-center bg-black text-white justify-center">
              1
            </div>
            <span className="text-black">Account Info</span>
          </div>
          <div className="w-16 h-1 bg-black rounded-2xl"></div>
          <div className="flex items-center gap-2">
            <div className="rounded-4xl w-10 h-10 flex bg-black text-white items-center justify-center">
              2
            </div>
            <span className="text-black">Category</span>
          </div>
        </div>
      )}

      {/* Ini step nya buat iniannya */}
      <div className="flex flex-col min-h-124 max-h-124 bg-white rounded-2xl p-8 gap-3.5 justify-center align-middle shadow-lg">
        {step === 1 ? (
          <div className="flex flex-col gap-3.5">
            <h2 className="text-black text-2xl font-bold">
              Account Information
            </h2>
            <div className="flex flex-col">
              <label htmlFor="fullName" className="text-black font-medium">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-gray-400 text-xs">
                  person
                </span>
                <input
                  type="text"
                  required
                  id="fullName"
                  value={registerData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border bg-[#F3F3F5] text-black border-[#E5E7EB] rounded-2xl py-2 pl-11 pr-3 focus:outline-none focus:ring-2 focus:ring-gray-400-100"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-black font-medium">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-gray-400 text-xs">
                  mail
                </span>

                <input
                  type="email"
                  required
                  id="email"
                  value={registerData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full border bg-[#F3F3F5] text-black border-[#E5E7EB] rounded-2xl py-2 pl-11 pr-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {/* Field Password Utama */}
              <div className="flex flex-col">
                <label className="text-black font-medium">Password</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-gray-400 pointer-events-none text-xs">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full border bg-[#F3F3F5] text-black border-[#E5E7EB] rounded-2xl py-2 pl-11 pr-11"
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

              {/* Field Confirm Password */}
              <div className="flex flex-col">
                <label className="text-black font-medium">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-gray-400 pointer-events-none text-xs">
                    lock
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="w-full border bg-[#F3F3F5] text-black border-[#E5E7EB] rounded-2xl py-2 pl-11 pr-11"
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
            <div className="flex flex-col">
              <button
                className="bg-black text-white font-bold py-2 px-4 rounded-2xl"
                onClick={handleNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col  rounded-2xl p-8 gap-5">
            <h2 className="text-black text-2xl font-bold">Select Category</h2>
            <p className="text-gray-500 -mt-3">
              Select the category that best describes your nutritional needs
            </p>

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
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 border-2 rounded-2xl cursor-pointer flex flex-row items-left gap-2 transition-all ${selectedCategory === cat.id ? `border-black` : 'border-[#E5E7EB]'}`}
                  style={{ backgroundColor: cat.color }}
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg text-black">
                      {cat.label}
                    </span>
                    <span className="text-sm text-gray-500 ">{cat.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={!selectedCategory}
              className="bg-black text-white font-bold py-2 px-4 rounded-2xl disabled:bg-gray-300"
            >
              Complete Registration
            </button>
          </div>
        )}

        <div className="flex flex-row justify-center gap-1">
          <span className="text-black ">Already have an account?</span>
          <a href="/login" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
