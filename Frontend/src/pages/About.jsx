import React from 'react';
import AboutHero from '../components/AboutHero/AboutHero';
import MissionSection from '../components/MissionSection/MissionSection';
import OurProcess from '../components/OurProcess/OurProcess';
import MeetFounders from '../components/MeetFounders/MeetFounders';
import TechStackSection from '../components/TechStackSection/TechStackSection';

const About = () => {
  return (
    <div className="about-page">
      <AboutHero />
      <MissionSection />
      <MeetFounders />
      <TechStackSection />
      
      <OurProcess />
    </div>
  );
};

export default About;
