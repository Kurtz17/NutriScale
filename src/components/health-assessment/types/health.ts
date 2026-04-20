export type Category = 'umum' | 'balita' | 'ibu_hamil' | 'pasca_operasi';

export interface HealthFormData {
  gender: string;
  category: Category | '';
  age: number | '';

  weight: number | '';
  height: number | '';

  kalori?: number | '';
  gestasi?: number | '';
  operasi?: string;
  larangan?: string[];
}

// 🔥 TYPE UNTUK SEMUA STEP (biar ga pakai any lagi)
export interface StepProps {
  formData: HealthFormData;
  setFormData: (data: HealthFormData) => void;
  nextStep?: () => void;
  prevStep?: () => void;
  userId?: string;
}
