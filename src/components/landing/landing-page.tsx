'use client';

import { BenefitsSection } from '@/components/landing/benefits-section';
import { CategorySection } from '@/components/landing/category-section';
import { CTASection } from '@/components/landing/cta-section';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { TrustStrip } from '@/components/landing/trust-strip';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router, session]);

  const handleStartAnalysis = () => {
    router.push(isLoggedIn ? '/health-assessment' : '/register');
  };

  const handleLogin = () => {
    router.push(isLoggedIn ? '/health-dashboard' : '/login');
  };

  const handleLearnMore = () => {
    document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbfdf8] text-[#142018]">
      <LandingNavbar
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onStartAnalysis={handleStartAnalysis}
      />
      <main>
        <HeroSection
          onLearnMore={handleLearnMore}
          onStartAnalysis={handleStartAnalysis}
        />
        <TrustStrip />
        <CategorySection onStartAnalysis={handleStartAnalysis} />
        <BenefitsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection onStartAnalysis={handleStartAnalysis} />
      </main>
      <LandingFooter />
    </div>
  );
}
