'use client';

import { HealthFormData } from '@/components/health-assessment/types/health';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  formData: HealthFormData;
  setFormData: React.Dispatch<React.SetStateAction<HealthFormData>>;
  prevStep: () => void;
};

export default function Balita({ formData, setFormData, prevStep }: Props) {
  const handleSubmit = () => {
    if (formData.kalori === '') {
      alert('Target kalori wajib diisi!');
      return;
    }

    const kalori = Number(formData.kalori);

    if (kalori < 300 || kalori > 3000) {
      alert('Kalori balita harus antara 300 - 3000 kkal');
      return;
    }

    console.log('FINAL DATA:', formData);
    alert('Data berhasil disimpan!');
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-2">More Information (Balita)</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Target Calory (Kkal)</label>

          <Input
            type="number"
            value={formData.kalori || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                kalori: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={prevStep}>
          ←
        </Button>

        <Button className="max-w-md w-full" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}
