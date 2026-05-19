import React from 'react';

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  required?: boolean;
};

export const FormField = ({ label, children, required }: FormFieldProps) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);
