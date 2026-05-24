import Step1 from '@/components/health-assessment/components/step-1-basic';
import Step2 from '@/components/health-assessment/components/step-2-anthropometry';
import { HealthFormData } from '@/types/health-assessment';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastMocks.error,
  },
}));

const baseFormData: HealthFormData = {
  gender: 'female',
  category: 'umum',
  age: 25,
  weight: 55,
  height: 160,
  kalori: '',
  gestasi: '',
  operasi: '',
  larangan: [],
};

describe('health assessment steps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Step1 should show validation error for missing basic fields', () => {
    render(
      <Step1
        nextStep={vi.fn()}
        formData={{ ...baseFormData, gender: '', category: '', age: '' }}
        setFormData={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(toastMocks.error).toHaveBeenCalledWith('Semua field wajib diisi!');
  });

  it('Step1 should validate toddler age range before continuing', () => {
    const nextStep = vi.fn();

    render(
      <Step1
        nextStep={nextStep}
        formData={{ ...baseFormData, category: 'balita', age: 61 }}
        setFormData={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(toastMocks.error).toHaveBeenCalledWith(
      'Umur balita harus 0 - 60 bulan',
    );
    expect(nextStep).not.toHaveBeenCalled();
  });

  it('Step1 should continue when basic fields are valid', () => {
    const nextStep = vi.fn();

    render(
      <Step1
        nextStep={nextStep}
        formData={baseFormData}
        setFormData={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(nextStep).toHaveBeenCalledTimes(1);
  });

  it('Step2 should validate anthropometry fields and continue when valid', () => {
    const nextStep = vi.fn();
    const { rerender } = render(
      <Step2
        nextStep={nextStep}
        prevStep={vi.fn()}
        formData={{ ...baseFormData, weight: '', height: '' }}
        setFormData={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(toastMocks.error).toHaveBeenCalledWith('Semua field wajib diisi!');

    rerender(
      <Step2
        nextStep={nextStep}
        prevStep={vi.fn()}
        formData={baseFormData}
        setFormData={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(nextStep).toHaveBeenCalledTimes(1);
  });
});
