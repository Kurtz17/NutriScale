import { authClient } from '@/lib/auth-client';
import { HealthFormData } from '@/types/health-assessment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useHealthAssessment() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<HealthFormData>({
    gender: '',
    category: '',
    age: '',
    weight: '',
    height: '',
    kalori: '',
    gestasi: '',
    operasi: '',
    larangan: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const goToHome = () => router.push('/');

  return {
    step,
    setStep,
    formData,
    setFormData,
    nextStep,
    prevStep,
    goToHome,
    userId: session?.user?.id,
  };
}
