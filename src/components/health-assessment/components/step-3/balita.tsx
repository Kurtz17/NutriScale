'use client';

import { saveHealthAssessment } from '@/app/health-assessment/actions';
import {
  HealthFormData,
  StepProps,
} from '@/components/health-assessment/types/health';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Balita({
  formData,
  setFormData,
  prevStep,
  userId,
}: StepProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tidakTahu, setTidakTahu] = useState(false);
  const handleSubmit = async () => {
    if (!tidakTahu) {
      if (formData.kalori === '') {
        toast.error('Target kalori wajib diisi!');
        return;
      }

      const kalori = Number(formData.kalori);

      if (kalori < 300 || kalori > 3000) {
        toast.error('Kalori balita harus antara 300 - 3000 kkal');
        return;
      }
    }

    setLoading(true);
    const dataToSave: HealthFormData = {
      ...formData,
      kalori: tidakTahu ? '' : formData.kalori,
    };
    const res = await saveHealthAssessment(dataToSave, userId || '');
    setLoading(false);

    if (res.success) {
      toast.success('Data berhasil disimpan!');
      router.push('/health-dashboard');
    } else {
      toast.error(res.error || 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-2">More Information (Balita)</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Target Calory (Kkal)</label>

          <Input
            type="number"
            disabled={tidakTahu}
            value={formData.kalori || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                kalori: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
          />

          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={tidakTahu}
              onChange={(e) => {
                setTidakTahu(e.target.checked);
                if (e.target.checked) {
                  setFormData({ ...formData, kalori: '' });
                }
              }}
            />
            dikosongkan bila tidak tahu
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={prevStep}>
          ←
        </Button>

        <Button
          className="max-w-md w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
