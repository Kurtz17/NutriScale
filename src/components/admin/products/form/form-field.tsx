import { Label } from '@/components/ui/label';
import React from 'react';

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

export function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}
