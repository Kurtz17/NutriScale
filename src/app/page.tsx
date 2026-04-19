'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth-client';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle,
  Heart,
  LogOut,
  ShieldCheck,
  ShoppingCart,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsDropdownOpen(false);
          router.refresh(); // Segarkan halaman untuk menghapus sisa state
        },
      },
    });
  };

  const features = [
    {
      icon: Brain,
      title: 'Analisis Berbasis AI',
      description:
        'Algoritma canggih menghitung WHO Z-Score, BMI, dan kebutuhan nutrisi personal Anda.',
      color: 'bg-blue-500',
    },
    {
      icon: Target,
      title: 'Meal Plan Personal',
      description:
        'Dapatkan rekomendasi menu makan harian yang dikurasi khusus oleh sistem AI.',
      color: 'bg-green-600',
    },
    {
      icon: ShoppingCart,
      title: 'Marketplace Sehat',
      description:
        'Belanja bahan makanan dengan label transparansi nutrisi dan peringatan risiko.',
      color: 'bg-orange-500',
    },
    {
      icon: Activity,
      title: 'Pelacakan Real-Time',
      description:
        'Pantau perkembangan metrik kesehatan dan asupan kalori harian secara berkelanjutan.',
      color: 'bg-red-500',
    },
  ];

  const categories = [
    {
      id: 'ANAK_BALITA',
      icon: '👶',
      title: 'Anak Balita',
      description:
        'Pemantauan tumbuh kembang berbasis Z-Score WHO untuk mencegah stunting.',
      color: 'bg-[#FFE8E8]',
      borderColor: 'border-[#FF6B6B]',
    },
    {
      id: 'IBU_HAMIL',
      icon: '🤰',
      title: 'Ibu Hamil',
      description:
        'Panduan nutrisi spesifik untuk kesehatan janin dan pencegahan anemia.',
      color: 'bg-[#E8F4FF]',
      borderColor: 'border-[#4A90E2]',
    },
    {
      id: 'PASCA_OPERASI',
      icon: '🏥',
      title: 'Pasien Pasca-Operasi',
      description:
        'Optimasi diet tinggi protein untuk mempercepat pemulihan jaringan tubuh.',
      color: 'bg-[#FFF4E8]',
      borderColor: 'border-[#FFA726]',
    },
    {
      id: 'UMUM',
      icon: '👤',
      title: 'Umum',
      description:
        'Manajemen berat badan ideal dan edukasi gaya hidup sehat masyarakat.',
      color: 'bg-[#E1EEDD]',
      borderColor: 'border-[#7CB342]',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A1B]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#E1EEDD] to-white py-24 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs mb-8 border border-blue-100 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Powered by AI & WHO Standards
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-8">
              Solusi Cerdas Kelola{' '}
              <span className="text-green-700">Gizi & Kesehatan</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Bantuan nutrisi personal berbasis medis untuk setiap fase
              kehidupan Anda. Mulai dari kehamilan hingga pemulihan
              pasca-operasi .
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="bg-[#1A1A1B] text-white px-10 py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl active:scale-95"
              >
                Mulai Analisis Gratis <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-white border-2 border-[#1A1A1B] px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all active:scale-95"
              >
                Sign In
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-semibold text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> WHO Certified
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> AI Driven
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> Medical
                Approved
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Kategori Nutrisi Khusus
            </h2>
            <p className="text-gray-500 text-lg">
              Pilih profil yang sesuai dengan kondisi klinis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => router.push('/register')}
                className={`${cat.color} border-2 ${cat.borderColor} p-8 rounded-4xl shadow-sm hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-2 group`}
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black leading-tight">
                Kenapa Memilih{' '}
                <span className="text-green-700">NutriScale?</span>
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed">
                Kami menggabungkan keahlian medis dengan teknologi AI untuk
                memberikan panduan gizi paling akurat yang tersedia di pasar.
              </p>

              <div className="grid gap-6">
                {[
                  'Asesmen kesehatan personal terperinci ',
                  'Target nutrisi otomatis standar WHO ',
                  'Rekomendasi Meal Plan cerdas ',
                  'Labeling produk transparan ',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="p-8 bg-blue-50 rounded-4xl border border-blue-100 relative overflow-hidden">
                <TrendingUp className="w-12 h-12 text-blue-500 mb-4" />
                <h4 className="text-2xl font-bold mb-2">Hasil Nyata</h4>
                <p className="text-gray-600">
                  Pengguna kami melihat peningkatan metrik kesehatan yang
                  terukur dalam bulan pertama.
                </p>
              </div>
              <div className="p-8 bg-green-50 rounded-4xl border border-green-100">
                <Stethoscope className="w-12 h-12 text-green-600 mb-4" />
                <h4 className="text-2xl font-bold mb-2">Pendekatan Medis</h4>
                <p className="text-gray-600">
                  Seluruh algoritma dikembangkan berdasarkan pedoman gizi klinis
                  resmi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-[#1A1A1B] rounded-[3rem] p-12 md:p-20 text-center text-white relative shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-green-900/20 to-transparent pointer-events-none"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">
            Siap Transformasi Kesehatan Anda?
          </h2>
          <p className="text-xl text-gray-400 mb-12 relative z-10">
            Bergabunglah dengan ribuan pengguna yang sudah mencapai target
            nutrisinya bersama NutriScale.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-[#1A1A1B] px-12 py-5 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all active:scale-95"
            >
              Mulai Sekarang
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-transparent border-2 border-white text-white px-12 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all active:scale-95"
            >
              Hubungi Spesialis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
