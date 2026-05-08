import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfileData } from '@/types/profile';
import {
  AtSign,
  BellRing,
  Calendar,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';

import AddressFields from './address-fields';

interface ProfileFormContentProps {
  initialData: ProfileData;
  isEditing: boolean;
  notification: boolean;
  setNotification: (val: boolean) => void;
}

export default function ProfileFormContent({
  initialData,
  isEditing,
  notification,
  setNotification,
}: ProfileFormContentProps) {
  const inputStyle =
    'w-full bg-[#F8FAFC] rounded-2xl h-14 px-5 text-slate-800 font-bold border-2 border-slate-100 focus:border-[#7CB342] focus:ring-0 transition-all disabled:opacity-50 disabled:bg-slate-50 disabled:border-slate-50';

  const labelStyle =
    'text-sm font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 flex items-center gap-2';

  return (
    <div className="bg-white/90 rounded-[3rem] p-12 shadow-2xl shadow-green-900/5 border border-white/50 backdrop-blur-sm">
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
        {/* Section Header */}
        <div className="md:col-span-2 flex items-center gap-4 mb-2">
          <div className="w-1.5 h-8 bg-[#7CB342] rounded-full"></div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Personal Information
          </h3>
        </div>

        {/* Basic Info Group */}
        <div className="space-y-3">
          <Label className={labelStyle}>
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <User className="w-3.5 h-3.5" />
            </div>
            Full Name
          </Label>
          <Input
            name="name"
            defaultValue={initialData.name}
            disabled={!isEditing}
            className={inputStyle}
          />
        </div>

        <div className="space-y-3">
          <Label className={labelStyle}>
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <AtSign className="w-3.5 h-3.5" />
            </div>
            Username
          </Label>
          <Input
            name="username"
            defaultValue={initialData.username}
            disabled={!isEditing}
            className={inputStyle}
          />
        </div>

        <div className="space-y-3">
          <Label className={labelStyle}>
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            Date of Birth
          </Label>
          <Input
            type="date"
            name="tanggalLahir"
            defaultValue={initialData.tanggalLahir}
            disabled={!isEditing}
            className={inputStyle}
          />
        </div>

        <div className="space-y-3">
          <Label className={labelStyle}>
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <Phone className="w-3.5 h-3.5" />
            </div>
            Phone Number
          </Label>
          <Input
            name="phone"
            defaultValue={initialData.phone}
            disabled={!isEditing}
            className={inputStyle}
          />
        </div>

        {/* Address Section */}
        <div className="md:col-span-2 mt-10 pt-12 border-t border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Shipping Address
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200/50">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Secure Delivery
            </div>
          </div>
          <AddressFields
            initialData={initialData.address}
            disabled={!isEditing}
          />
        </div>

        {/* Notification Toggle */}
        <div className="md:col-span-2 mt-6 pt-10 border-t border-slate-100">
          <div
            className={`flex items-center justify-between p-8 rounded-[2rem] transition-all duration-500 ${notification ? 'bg-green-50/50 border border-green-100/50' : 'bg-slate-50 border border-slate-100'}`}
          >
            <div className="flex items-center gap-6">
              <div
                className={`p-4 rounded-2xl shadow-sm transition-colors ${notification ? 'bg-white text-green-600' : 'bg-white text-slate-400'}`}
              >
                <BellRing className="w-7 h-7" />
              </div>
              <div>
                <Label className="text-xl font-black text-slate-900 leading-none mb-2 block">
                  Activity Alerts
                </Label>
                <p className="text-sm text-slate-500 font-bold">
                  Stay updated with your latest health reports
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-16 h-9 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#7CB342] transition-colors disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
