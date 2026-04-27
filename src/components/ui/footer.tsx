'use client';
import { Apple } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGithub, FaInstagram, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const router = useRouter();
  return (
    <footer className="bg-[#E1EEDD] text-black pb-10 rounded-t-[3rem] mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4">
        {/* Kolom 1: Brand */}
        <div className="md:col-span-1 space-y-2">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 bg-[#1A1A1B] rounded-xl flex items-center justify-center">
              <span className="text-xl">🥗</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#1A1A1B]">
              NutriScale
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Membantu mahasiswa Unpad menjaga gizi dengan teknologi AI. Sehat itu
            mudah, transparan, dan terjangkau.
          </p>
        </div>

        {/* Kolom 2: Marketplace */}
        <div>
          <h4 className="font-bold mb-6 text-[#7CB342] uppercase text-xs tracking-widest">
            Fitur
          </h4>
          <ul className="flex flex-col space-y-4 text-sm text-gray-500 font-bold">
            <Link href="/">
              <li className="hover:text-black cursor-pointer transition-colors">
                Home
              </li>
            </Link>
            <Link href="/marketplace">
              <li className="hover:text-black cursor-pointer transition-colors">
                Marketplace
              </li>
            </Link>
            <Link href="/dashboard">
              <li className="hover:text-black cursor-pointer transition-colors">
                Dashboard
              </li>
            </Link>
          </ul>
        </div>

        {/* Kolom 3: Support */}
        <div>
          <h4 className="font-bold mb-6 text-[#7CB342] uppercase text-xs tracking-widest">
            Support
          </h4>
          <ul className="space-y-4 text-sm text-gray-500 font-bold">
            <li className="hover:text-black cursor-pointer transition-colors">
              Help Center
            </li>
            <li className="hover:text-black cursor-pointer transition-colors">
              Terms of Service
            </li>
            <li className="hover:text-black cursor-pointer transition-colors">
              Privacy Policy
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-[#7CB342] uppercase text-xs tracking-widest">
            Connect With Us
          </h4>
          <div className="flex gap-4">
            {/* Instagram */}
            <Link
              href="#"
              className="p-3 bg-[#7CB342] rounded-2xl hover:bg-white transition-all cursor-pointer group"
            >
              <FaInstagram className="w-5 h-5 text-white group-hover:text-[#7CB342] transition-colors" />
            </Link>
            {/* X (Twitter) */}
            <Link
              href="#"
              className="p-3 bg-[#7CB342] rounded-2xl hover:bg-white transition-all cursor-pointer group"
            >
              <FaXTwitter className="w-5 h-5 text-white group-hover:text-[#7CB342] transition-colors" />
            </Link>
            {/* Github */}
            <Link
              href="#"
              className="p-3 bg-[#7CB342] rounded-2xl hover:bg-white transition-all cursor-pointer group"
            >
              <FaGithub className="w-5 h-5 text-white group-hover:text-[#7CB342] transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500 font-bold">
          © 2026 NutriScale Team - PPL Universitas Padjadjaran
        </p>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <Apple className="w-3 h-3" /> Kontribusi pada SDGs Poin 2: Zero Hunger
        </div>
      </div>
    </footer>
  );
}
