import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "What is GenVaani?",
      answer: "GenVaani is a comprehensive consulting and technology platform designed to transform businesses, streamline processes, and scale efficiently with innovative solutions."
    },
    {
      question: "How does GenVaani work?",
      answer: "We work closely with your team to understand your business needs, formulate a strategic plan, and deploy customized technological or consulting solutions."
    },
    {
      question: "Is GenVaani secure?",
      answer: "Yes, security is our top priority. We use enterprise-grade encryption and follow industry best practices to ensure your data is always protected."
    },
    {
      question: "Can GenVaani integrate with other software?",
      answer: "Absolutely. Our solutions are built with flexibility in mind, offering seamless API integrations with most major enterprise software and accounting tools."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section">
      {/* Top Wave */}
      <div className="faq-wave faq-wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="faq-container">

        {/* Left Side: Header & Text */}
        <div className="faq-header">
          <div className="faq-badge">
            <span className="badge-icon">#</span> Frequently asked questions
          </div>
          <h2 className="faq-title">
            Frequently asked <br />
            <span className="faq-title-highlight">questions</span>
          </h2>
          <p className="faq-description">
            Everything you need to know about the product and billing. Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
        </div>

        {/* Right Side: Accordion */}
        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <div className="faq-icon">
                  <svg
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: activeIndex === index ? 'rotate(180deg)' : 'rotate(0)' }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <div
                className="faq-answer-wrapper"
                style={{ maxHeight: activeIndex === index ? '200px' : '0' }}
              >
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Wave */}
      <div className="faq-wave faq-wave-bottom">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,0 420,120 720,60 C1020,0 1120,120 1440,60 L1440,0 L0,0 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default FAQSection;
