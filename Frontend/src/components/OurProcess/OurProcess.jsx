import React from 'react';
import './OurProcess.css';

const OurProcess = () => {
  const steps = [
    {
      id: '01',
      title: 'Discovery & Strategy',
      description: 'We dive deep into your business goals, target audience, and market landscape. At GenVaani, our strategic foundation ensures that every digital solution we propose is aligned with your long-term vision and positioned for success.',
      imgUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      align: 'right' // number on right, text on left
    },
    {
      id: '02',
      title: 'UI/UX Design',
      description: 'Our creative team crafts intuitive and user-centric wireframes and prototypes. We focus on seamless navigation and stunning visual aesthetics to ensure your website or application delivers an unforgettable user experience.',
      imgUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop',
      align: 'left' // number on left, text on right
    },
    {
      id: '03',
      title: 'Development & Engineering',
      description: 'Leveraging cutting-edge technologies, our expert developers bring the designs to life. We build robust, scalable, and high-performance applications that are secure and tailored to handle your growing business needs.',
      imgUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
      align: 'right'
    },
    {
      id: '04',
      title: 'Launch & Growth',
      description: 'After rigorous testing, we deploy your product seamlessly. But we don’t stop there—our data-driven digital marketing and SEO strategies ensure your brand maximizes its reach, driving measurable ROI and continuous growth.',
      imgUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
      align: 'left'
    }
  ];

  return (
    <section className="process-section">
      {/* Wave transition from Tech Stack (dark) to Our Process (white) */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="process-container">
        {steps.map((step, index) => (
          <div key={step.id} className={`process-row ${step.align === 'left' ? 'row-reverse' : ''}`}>
            
            <div className="process-text-content">
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.description}</p>
            </div>

            <div className="process-number-wrapper">
              <div 
                className="process-number" 
                style={{ backgroundImage: `url(${step.imgUrl})` }}
              >
                {step.id}
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurProcess;
