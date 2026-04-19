'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Progress from './components/progress';
// step components
import Step1 from './components/step-1-basic';
import Step2 from './components/step-2-anthropometry';
import Step3Balita from './components/step-3/balita';
import Step3IbuHamil from './components/step-3/ibu-hamil';
import Step3PascaOperasi from './components/step-3/pasca-operasi';
import Step3Umum from './components/step-3/umum';
// types
import { HealthFormData } from './types/health';

export default function HealthAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<HealthFormData>({
    gender: '',
    category: '',
    age: '',

    weight: '',
    height: '',

    // umum & balita
    kalori: '',

    // ibu hamil
    gestasi: '',

    // pasca operasi
    operasi: '',
    larangan: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E6EFE3] p-6">
      {/* 🔥 BACK BUTTON (LUAR CONTAINER) */}
      {step === 1 && (
        <div className="w-full max-w-xl mx-auto relative">
          <button
            onClick={() => router.push('/')}
            className="absolute -left-10 top-2 text-2xl text-gray-600 hover:text-black transition"
          >
            ←
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <Progress step={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <Step1
          nextStep={nextStep}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Step2
          nextStep={nextStep}
          prevStep={prevStep}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* STEP 3 (DYNAMIC BASED ON CATEGORY) */}
      {step === 3 && (
        <>
          {formData.category === 'umum' && (
            <Step3Umum
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {formData.category === 'balita' && (
            <Step3Balita
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {formData.category === 'ibu_hamil' && (
            <Step3IbuHamil
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {formData.category === 'pasca_operasi' && (
            <Step3PascaOperasi
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </>
      )}
    </div>
  );
}
