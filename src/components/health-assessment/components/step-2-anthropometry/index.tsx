'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getHealthLimits,
  validateAnthropometry,
} from '@/lib/health-assessment-limits';
import { HealthFormData } from '@/types/health-assessment';
import { toast } from 'sonner';

type Props = {
  nextStep: () => void;
  prevStep: () => void;
  formData: HealthFormData;
  setFormData: React.Dispatch<React.SetStateAction<HealthFormData>>;
};

export default function Step2({
  nextStep,
  prevStep,
  formData,
  setFormData,
}: Props) {
  const limits = getHealthLimits(formData.category, Number(formData.age));

  const handleNext = () => {
    if (formData.weight === '' || formData.height === '') {
      toast.error('Semua field wajib diisi!');
      return;
    }

    const error = validateAnthropometry(formData);
    if (error) {
      toast.error(error);
      return;
    }

    nextStep();
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-2">Antropometri</h2>

      <div className="space-y-4">
        {/* WEIGHT */}
        <div>
          <label className="block mb-1 font-medium">Body Weight (Kg)</label>

          <Input
            type="number"
            min={limits.weight.min}
            max={limits.weight.max}
            step={0.1}
            value={formData.weight}
            onChange={(e) =>
              setFormData({
                ...formData,
                weight: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
          />
        </div>

        {/* HEIGHT */}
        <div>
          <label className="block mb-1 font-medium">Body Height (cm)</label>

          <Input
            type="number"
            min={limits.height.min}
            max={limits.height.max}
            step={0.1}
            value={formData.height}
            onChange={(e) =>
              setFormData({
                ...formData,
                height: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={prevStep}>
          ←
        </Button>

        <Button className="max-w-md w-full" onClick={handleNext}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
