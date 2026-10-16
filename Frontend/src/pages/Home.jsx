import React from 'react';
import HeroSection from '../components/HeroSection/HeroSection';
import AboutSection from '../components/AboutSection/AboutSection';
import TechStackSection from '../components/TechStackSection/TechStackSection';
import ServicesSection from '../components/ServicesSection/ServicesSection';
import TestimonialSection from '../components/TestimonialSection/TestimonialSection';
import FAQSection from '../components/FAQSection/FAQSection';
import ContactSection from '../components/ContactSection/ContactSection';
import HowWeBuildSection from '../components/HowWeBuildSection/HowWeBuildSection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TechStackSection />
      <ServicesSection />
      <TestimonialSection />
      <HowWeBuildSection />
      <FAQSection />
      <ContactSection />
    </>
  );
};

export default Home;
