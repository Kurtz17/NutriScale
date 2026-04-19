'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { HealthFormData } from '../../types/health';

type Props = {
  nextStep: () => void;
  formData: HealthFormData;
  setFormData: React.Dispatch<React.SetStateAction<HealthFormData>>;
};

export default function Step1({ nextStep, formData, setFormData }: Props) {
  const isBalita = formData.category === 'balita';

  const handleNext = () => {
    if (!formData.gender || !formData.category || formData.age === '') {
      alert('Semua field wajib diisi!');
      return;
    }

    const age = Number(formData.age);

    // 🔥 VALIDASI UMUR DINAMIS
    if (isBalita) {
      if (age < 0 || age > 60) {
        alert('Umur balita harus 0 - 60 bulan');
        return;
      }
    } else {
      if (age < 5 || age > 200) {
        alert('Umur harus 5 - 200 tahun');
        return;
      }
    }

    nextStep();
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-2">Basic Information</h2>

      <div className="space-y-4">
        {/* GENDER */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            className="w-full border p-2 rounded"
            value={formData.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value,
              })
            }
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full border p-2 rounded"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as HealthFormData['category'],
                age: '',
              })
            }
          >
            <option value="">Select category</option>
            <option value="umum">Umum</option>
            <option value="balita">Anak Balita (Under 5)</option>
            <option value="ibu_hamil">Ibu Hamil</option>
            <option value="pasca_operasi">Pasien Pasca Operasi</option>
          </select>
        </div>

        {/* AGE */}
        <div>
          <label className="block mb-1 font-medium">
            Age ({isBalita ? 'month' : 'year'})
          </label>

          <Input
            type="number"
            min={isBalita ? 0 : 5}
            max={isBalita ? 60 : 200}
            value={formData.age}
            onChange={(e) =>
              setFormData({
                ...formData,
                age: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
          />

          <p className="text-sm text-gray-500 mt-1">
            {isBalita ? 'Range: 0 - 60 bulan' : 'Range: 5 - 200 tahun'}
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <Button
        className="max-w-md w-full mx-auto block mt-6"
        onClick={handleNext}
      >
        Continue →
      </Button>
    </div>
  );
}
