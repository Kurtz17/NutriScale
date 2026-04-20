'use client';

import { saveHealthAssessment } from '@/app/health-assessment/actions';
import { StepProps } from '@/components/health-assessment/types/health';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const OPERASI_OPTIONS = [
  'Operasi Lambung (Gastrektomi)',
  'Operasi Usus Besar / Kolon',
  'Operasi Usus Buntu (Apendektomi)',
  'Operasi Wasir (Hemoroidektomi)',
  'Operasi Batu Empedu (Kolesistektomi)',
  'Operasi Hernia',
  'Operasi Hati / Liver',
  'Operasi Ginjal / Batu Ginjal',
  'Operasi Pankreas',
  'Operasi Limpa',
  'Operasi Jantung (Bypass / Katup)',
  'Operasi Pembuluh Darah',
  'Operasi Tulang / Fraktur',
  'Operasi Sendi Lutut / Pinggul',
  'Operasi Tulang Belakang',
  'Operasi Caesar (SC)',
  'Operasi Rahim / Histerektomi',
  'Operasi Prostat',
  'Operasi Kandung Kemih',
  'Operasi Tiroid',
  'Operasi Paru-paru',
  'Operasi Otak / Saraf',
  'Operasi Mata',
  'Operasi Amandel (Tonsilektomi)',
  'Operasi Umum / Lainnya',
];

const LARANGAN_OPTIONS = [
  'Tinggi Purin',
  'Tinggi Natrium',
  'Tinggi Kalium',
  'Tinggi Fosfor',
  'Tinggi Kolesterol',
  'Tinggi Lemak Jenuh',
  'Tinggi Gula',
  'Tinggi Protein',
  'Tinggi Serat Kasar',
  'Rendah Serat',
  'Pedas',
  'Asam',
  'Bergas',
  'Keras',
  'Berminyak',
  'Mentah',
  'Fermentasi',
  'Alergi Seafood',
  'Alergi Kacang',
  'Laktosa',
  'Gluten',
  'Telur',
  'Kafein',
  'Alkohol',
  'Pengawet',
  'MSG',
];

export default function PascaOperasi({
  formData,
  setFormData,
  prevStep,
  userId,
}: StepProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleCheckbox = (item: string) => {
    const current = formData.larangan || [];

    let updated: string[] = [];

    if (current.includes(item)) {
      updated = current.filter((i) => i !== item);
    } else {
      updated = [...current, item];
    }

    setFormData({
      ...formData,
      larangan: updated,
    });
  };

  const handleSubmit = async () => {
    if (!formData.operasi || !formData.kalori) {
      alert('Operasi & kalori wajib diisi!');
      return;
    }

    setLoading(true);
    const res = await saveHealthAssessment(formData, userId || '');
    setLoading(false);

    if (res.success) {
      alert('Data berhasil disimpan!');
      router.push('/health-dashboard');
    } else {
      alert(res.error || 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-2">
        More Information (Pasca Operasi)
      </h2>

      <div className="space-y-4">
        {/* OPERASI */}
        <div>
          <label className="block mb-1 font-medium">Jenis Operasi</label>

          <select
            className="w-full border p-2 rounded"
            value={formData.operasi || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                operasi: e.target.value,
              })
            }
          >
            <option value="">Pilih operasi</option>
            {OPERASI_OPTIONS.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>

        {/* LARANGAN */}
        <div>
          <label className="block mb-2 font-medium">
            Pantangan Dokter (optional)
          </label>

          <div className="grid grid-cols-2 gap-2">
            {LARANGAN_OPTIONS.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(formData.larangan || []).includes(item)} // 🔥 FIX
                  onChange={() => handleCheckbox(item)}
                />
                {item}
              </label>
            ))}
          </div>
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
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
