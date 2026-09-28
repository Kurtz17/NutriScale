'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HealthFormData } from '@/types/health-assessment';
import { toast } from 'sonner';

type Props = {
  nextStep: () => void;
  formData: HealthFormData;
  setFormData: React.Dispatch<React.SetStateAction<HealthFormData>>;
};

export default function Step1({ nextStep, formData, setFormData }: Props) {
  const isBalita = formData.category === 'balita';

  const handleNext = () => {
    if (!formData.gender || !formData.category || formData.age === '') {
      toast.error('Semua field wajib diisi!');
      return;
    }

    const age = Number(formData.age);

    // 🔥 VALIDASI UMUR DINAMIS
    if (isBalita) {
      if (age < 0 || age > 60) {
        toast.error('Umur balita harus 0 - 60 bulan');
        return;
      }
    } else {
      if (age < 5 || age > 110) {
        toast.error('Umur harus 5 - 110 tahun');
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
            {formData.gender !== 'male' && (
              <option value="ibu_hamil">Ibu Hamil</option>
            )}
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
            max={isBalita ? 60 : 110}
            value={formData.age}
            onChange={(e) =>
              setFormData({
                ...formData,
                age: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
          />

          <p className="text-sm text-gray-500 mt-1">
            {isBalita ? 'Range: 0 - 60 bulan' : 'Range: 5 - 110 tahun'}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 my-2" />

        {/* Activity Factor */}
        <div>
          <label className="block mb-1 font-medium text-sm">
            Activity Factor
          </label>
          <select
            className="w-full border p-2 rounded text-sm bg-white"
            value={formData.activityFactor ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                activityFactor:
                  e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
          >
            <option value="">Select activity factor</option>
            <option value="1.2">Istirahat Total / Bedrest (1.2)</option>
            <option value="1.375">
              Aktivitas Ringan / Kerja Kantor (1.375)
            </option>
            <option value="1.55">
              Aktivitas Sedang / Olahraga Ringan (1.55)
            </option>
            <option value="1.725">
              Aktivitas Berat / Olahraga Rutin (1.725)
            </option>
          </select>
        </div>

        {/* Stress Factor */}
        <div>
          <label className="block mb-1 font-medium text-sm">
            Stress Factor
          </label>
          <select
            className="w-full border p-2 rounded text-sm bg-white"
            value={formData.stressFactor ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                stressFactor:
                  e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
          >
            <option value="">Select stress factor</option>
            <option value="1.0">Normal / Tanpa Stres Fisik (1.0)</option>
            <option value="1.2">Stres Ringan / Infeksi Ringan (1.2)</option>
            <option value="1.3">Stres Sedang / Operasi Ringan (1.3)</option>
            <option value="1.5">Stres Berat / Trauma / Luka Bakar (1.5)</option>
          </select>
        </div>

        <div className="pt-2 border-t border-gray-100 my-2" />
        {/* Alergi */}
        <div>
          <label className="block mb-1 font-medium text-sm">
            Alergi Makanan{' '}
            <span className="text-gray-400 font-normal">(Opsional)</span>
          </label>
          <Input
            type="text"
            placeholder="Contoh: Udang, Kacang, Susu"
            value={formData.allergies ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                allergies: e.target.value,
              })
            }
          />
        </div>
        {/* Pantangan Tipe Makanan */}
        <div>
          <label className="block mb-1 font-medium text-sm">
            Pantangan Tipe Makanan{' '}
            <span className="text-gray-400 font-normal">(Opsional)</span>
          </label>
          <Input
            type="text"
            placeholder="Contoh: Pedas, Daging Merah, Gluten"
            value={formData.dietaryRestrictions ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                dietaryRestrictions: e.target.value,
              })
            }
          />
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
