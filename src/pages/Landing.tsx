
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

import Navbar from '@/components/landing/Navbar';
import BackgroundEffects from '@/components/landing/BackgroundEffects';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import ContactForm from '@/components/landing/ContactForm';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import TipsSection from '@/components/landing/TipsSection';
import Footer from '@/components/landing/Footer';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans overflow-hidden">
      <BackgroundEffects />
      <Navbar isScrolled={isScrolled} />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <ContactForm />
      <TestimonialsSection />
      <TipsSection />
      <Footer />
    </div>
  );
};

export default Landing;
