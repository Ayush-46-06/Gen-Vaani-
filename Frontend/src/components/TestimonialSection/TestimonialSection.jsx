import React from 'react';
import './TestimonialSection.css';

const TestimonialSection = () => {
  const images = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80'
  ];

  const testimonials = [
    {
      id: 1,
      text: "GenVaani built our e-commerce platform from scratch. It's incredibly fast, and their UI/UX team made it look stunning. Highly recommend for any web project!",
      name: "David M.",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
    },
    {
      id: 2,
      text: "We needed a robust mobile application to scale our business, and GenVaani delivered flawlessly. The process was smooth and the final app exceeded our expectations.",
      name: "Sarah K.",
      role: "Product Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
    },
    {
      id: 3,
      text: "Their digital marketing and SEO strategies transformed our online presence. Our organic traffic doubled in just 3 months. Truly an exceptional and dedicated team.",
      name: "Michael A.",
      role: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    }
  ];

  return (
    <section className="testimonials-section">
      {/* Top Wave */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="testimonials-container">

        {/* Collage Top */}
        <div className="collage-grid">
          <div className="collage-col col-1">
            <img src={images[0]} alt="Team" className="img-small" />
            <img src={images[1]} alt="Meeting" className="img-medium" />
          </div>
          <div className="collage-col col-2">
            <img src={images[2]} alt="Working" className="img-large" />
          </div>
          <div className="collage-col col-3">
            <img src={images[3]} alt="Collaboration" className="img-tall" />
          </div>
          <div className="collage-col col-4">
            <img src={images[4]} alt="Design" className="img-medium" />
            <img src={images[5]} alt="Strategy" className="img-small" />
          </div>
          <div className="collage-col col-5">
            <img src={images[6]} alt="Success" className="img-large" />
          </div>
        </div>

        {/* Heading */}
        <div className="testimonials-header">
          {/* <span className="badge">Testimonials</span> */}
          <h2 className="testimonials-title">
            Trusted by startups and enterprises <br />
            <span className="text-gray">for digital excellence</span>
          </h2>
        </div>

        {/* Testimonials List */}
        <div className="testimonials-list">
          {testimonials.map((testi) => (
            <div key={testi.id} className="testimonial-card">
              <div className="stars">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="testimonial-text">"{testi.text}"</p>
              <div className="testimonial-author">
                <img src={testi.avatar} alt={testi.name} className="author-avatar" />
                <div className="author-info">
                  <h4 className="author-name">{testi.name}</h4>
                  <p className="author-role">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Wave */}
      <div className="wave-divider wave-bottom">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default TestimonialSection;
