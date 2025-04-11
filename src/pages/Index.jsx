import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import TherapistNavbar from '../components/layout/TherapistNavbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import MentalHealthSection from '@/components/home/MentalHealthSection';

const Index = () => {
  const [isTherapist, setIsTherapist] = useState(false);

  useEffect(() => {
    const therapist = localStorage.getItem("therapist");
    setIsTherapist(!!therapist);

    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isTherapist ? <TherapistNavbar /> : <Navbar />}
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <MentalHealthSection />
        <StatsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
