'use client';

import { StepProps } from '@/app/health-assessment/types/health';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IbuHamil({
  formData,
  setFormData,
  prevStep,
}: StepProps) {
  const handleSubmit = () => {
    if (!formData.gestasi || !formData.kalori) {
      alert('Semua field wajib diisi!');
      return;
    }

    const gestasi = Number(formData.gestasi);
    const kalori = Number(formData.kalori);

    if (gestasi < 1 || gestasi > 42) {
      alert('Umur kehamilan harus 1 - 42 minggu');
      return;
    }

    if (kalori < 500 || kalori > 5000) {
      alert('Kalori harus antara 500 - 5000 kkal');
      return;
    }

    console.log('FINAL DATA:', formData);
    alert('Data berhasil disimpan!');
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-2">
        More Information (Ibu Hamil)
      </h2>

      <div className="space-y-4">
        {/* GESTASI */}
        <div>
          <label className="block mb-1 font-medium">Gestasi (minggu)</label>

          <Input
            type="number"
            min={1}
            max={42}
            value={formData.gestasi || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                gestasi: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
          />
        </div>

        {/* KALORI */}
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

      <div className="flex gap-2 mt-6">
        <Button variant="outline" onClick={() => prevStep?.()}>
          ← Back
        </Button>

        <Button
          className="max-w-md w-full mx-auto block"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
