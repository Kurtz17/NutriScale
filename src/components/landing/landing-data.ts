import type { LucideIcon } from 'lucide-react';
import {
  Apple,
  Baby,
  BrainCircuit,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  Globe2,
  HeartPulse,
  Hospital,
  Leaf,
  Salad,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tags,
  TrendingUp,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';

export type LandingNavItem = {
  label: string;
  href: string;
};

export type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type CategoryCard = IconCard & {
  tint: string;
  iconWrap: string;
  accent: string;
};

export type FeatureCard = IconCard & {
  surface: string;
  iconSurface: string;
  titleColor: string;
};

export type StepCard = IconCard & {
  step: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

export const navItems: LandingNavItem[] = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Fitur', href: '#fitur' },
  { label: 'Kategori', href: '#kategori' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Tentang Kami', href: '#tentang' },
  { label: 'Artikel', href: '#artikel' },
];

export const trustItems: IconCard[] = [
  {
    title: 'AI Driven',
    description: 'Analisis cerdas berbasis data dan pola kesehatan personal.',
    icon: BrainCircuit,
  },
  {
    title: 'Tinjauan Medis',
    description: 'Direview oleh ahli gizi dan pendekatan klinis terpercaya.',
    icon: Stethoscope,
  },
  {
    title: 'Personal & Akurat',
    description: 'Rekomendasi sesuai kondisi unik setiap pengguna.',
    icon: UserRoundCheck,
  },
  {
    title: 'WHO Aligned',
    description: 'Selaras dengan standar gizi global WHO.',
    icon: Globe2,
  },
  {
    title: '10.000+ Pengguna Aktif',
    description: 'Dipercaya untuk memulai perubahan pola makan sehat.',
    icon: UsersRound,
  },
];

export const categories: CategoryCard[] = [
  {
    title: 'Anak Balita',
    description:
      'Dukung tumbuh kembang optimal dengan nutrisi tepat dan seimbang.',
    icon: Baby,
    tint: 'bg-[#fff5ef] border-[#f4c9ad] hover:border-[#e89b66]',
    iconWrap: 'bg-[#ffe1cf] text-[#c95f22]',
    accent: 'bg-[#fff0e5] text-[#c95f22]',
  },
  {
    title: 'Ibu Hamil',
    description: 'Penuhi kebutuhan gizi ibu dan janin untuk kehamilan sehat.',
    icon: HeartPulse,
    tint: 'bg-[#f1f8ff] border-[#bfdcf5] hover:border-[#6fb2e6]',
    iconWrap: 'bg-[#dcefff] text-[#1972b8]',
    accent: 'bg-[#e8f4ff] text-[#1972b8]',
  },
  {
    title: 'Pasien Pasca-Operasi',
    description:
      'Nutrisi tepat untuk mempercepat pemulihan dan menjaga daya tahan tubuh.',
    icon: Hospital,
    tint: 'bg-[#f8f4ff] border-[#d9c9f2] hover:border-[#a985dc]',
    iconWrap: 'bg-[#ece2ff] text-[#7352b5]',
    accent: 'bg-[#f0e8ff] text-[#7352b5]',
  },
  {
    title: 'Umum',
    description:
      'Kelola pola makan sehat untuk menjaga kebugaran dan kualitas hidup.',
    icon: UserRound,
    tint: 'bg-[#f2fbf4] border-[#bfdfc7] hover:border-[#70bd83]',
    iconWrap: 'bg-[#dff3e5] text-[#16833a]',
    accent: 'bg-[#e8f7ec] text-[#16833a]',
  },
];

export const benefitChecklist = [
  'Asesmen kesehatan personal terperinci',
  'Target nutrisi sesuai standar WHO',
  'Rekomendasi berbasis AI dan tinjauan medis',
  'Label produk transparan dan mudah dipahami',
];

export const featureCards: FeatureCard[] = [
  {
    title: 'Hasil Nyata',
    description:
      'Pantau perkembangan kesehatan dengan insight yang terukur dan mudah dipahami.',
    icon: TrendingUp,
    surface: 'bg-[#f0fbf4] border-[#cfeedd]',
    iconSurface: 'bg-[#d8f3e2] text-[#16833a]',
    titleColor: 'text-[#0f7a35]',
  },
  {
    title: 'Pendekatan Medis',
    description:
      'Setiap rekomendasi disusun berdasarkan pedoman gizi klinis dan ditinjau ahli.',
    icon: Stethoscope,
    surface: 'bg-[#f3f8ff] border-[#cfe0f7]',
    iconSurface: 'bg-[#dcecff] text-[#1a68a8]',
    titleColor: 'text-[#155c96]',
  },
  {
    title: 'Rekomendasi Personal',
    description:
      'Rencana nutrisi dipersonalisasi sesuai kondisi, tujuan, dan preferensi Anda.',
    icon: ChartNoAxesCombined,
    surface: 'bg-[#fff8ec] border-[#efd8ad]',
    iconSurface: 'bg-[#ffedc7] text-[#b36a00]',
    titleColor: 'text-[#9b5b00]',
  },
  {
    title: 'Label Transparan',
    description:
      'Pahami kandungan gizi dengan informasi label yang jelas dan transparan.',
    icon: Tags,
    surface: 'bg-[#f7f4ff] border-[#d8cdf1]',
    iconSurface: 'bg-[#ebe4ff] text-[#6d4db0]',
    titleColor: 'text-[#5d4299]',
  },
];

export const steps: StepCard[] = [
  {
    step: '1',
    title: 'Isi Profil & Data Kesehatan',
    description:
      'Jawab beberapa pertanyaan sederhana tentang kondisi, kebiasaan makan, dan tujuan kesehatan Anda.',
    icon: ClipboardCheck,
  },
  {
    step: '2',
    title: 'Analisis Cerdas oleh AI',
    description:
      'AI menganalisis data Anda untuk memberikan gambaran kondisi gizi yang lebih akurat.',
    icon: Cpu,
  },
  {
    step: '3',
    title: 'Dapatkan Rekomendasi',
    description:
      'Terima rencana nutrisi personal, target harian, dan rekomendasi makanan yang mudah diterapkan.',
    icon: Salad,
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Dewi Lestari',
    role: 'Ibu Rumah Tangga',
    quote:
      'Setelah dua bulan pakai NutriScale, pola makan keluarga saya jauh lebih terarah dan anak saya lebih mudah mengikuti menu sehat.',
    initials: 'DL',
  },
  {
    name: 'Rina A.',
    role: 'Ibu Hamil',
    quote:
      'Rekomendasi nutrisi untuk kehamilan saya sangat membantu. Penjelasannya detail dan saya merasa lebih tenang menjalani kehamilan.',
    initials: 'RA',
  },
  {
    name: 'Budi Santoso',
    role: 'Pasien Pasca-Operasi',
    quote:
      'Sebagai pasien pasca operasi, NutriScale membantu saya pulih lebih cepat dengan rencana makan yang tepat dan bergizi.',
    initials: 'BS',
  },
];

export const heroTrustChips = [
  { label: 'WHO Aligned', icon: CheckCircle2 },
  { label: 'AI Driven', icon: Sparkles },
  { label: 'Medically Reviewed', icon: ShieldCheck },
];

export const footerColumns = [
  {
    title: 'Produk',
    links: ['Fitur', 'Kategori', 'Cara Kerja', 'Harga'],
  },
  {
    title: 'Perusahaan',
    links: ['Tentang Kami', 'Blog', 'Kontak'],
  },
  {
    title: 'Bantuan',
    links: ['FAQ', 'Kebijakan Privasi', 'Syarat & Ketentuan'],
  },
];

export const decorativeIcons = {
  apple: Apple,
  leaf: Leaf,
};
