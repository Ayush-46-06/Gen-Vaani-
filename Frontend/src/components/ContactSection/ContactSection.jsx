import React, { useState } from 'react';
import { submitLeadApi } from '../../services/leadApi';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    comments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (feedback.message) {
      setFeedback({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service || !formData.comments) {
      setFeedback({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await submitLeadApi({
        name: formData.name,
        email: formData.email,
        service: formData.service,
        comments: formData.comments,
      });

      if (res && res.success) {
        setFeedback({
          type: 'success',
          message: `Thank you, ${formData.name.split(' ')[0]}! Your inquiry has been sent to our team. We'll be in touch shortly.`,
        });
        setFormData({
          name: '',
          email: '',
          service: '',
          comments: '',
        });
      } else {
        setFeedback({
          type: 'error',
          message: res?.message || 'Unable to submit your inquiry. Please try again.',
        });
      }
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'A network error occurred. Please ensure backend is running.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact-section">
      <div className="contact-container">

        {/* Left Side: Info */}
        <div className="contact-info-wrapper">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-description">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam.
          </p>

          <div className="contact-details">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Jl.+Raya+Kampus+Unud,+Jimbaran,+Bali+80361"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-detail-item contact-detail-link"
              title="Open Jimbaran, Bali location in Google Maps"
              aria-label="Open Jimbaran, Bali location in Google Maps"
            >
              <div className="contact-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-text">
                <h3>Jimbaran, Bali ↗</h3>
                <p>Jl. Raya Kampus Unud, Jimbaran, Bali - 80361</p>
              </div>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Jl.+Kejawan+Putih+Indah,+Mulyorejo,+Surabaya+60112"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-detail-item contact-detail-link"
              title="Open Surabaya location in Google Maps"
              aria-label="Open Surabaya location in Google Maps"
            >
              <div className="contact-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-text">
                <h3>Pakuwon City, Surabaya ↗</h3>
                <p>Jl. Kejawan Putih Indah, Mulyorejo, SBY - 60112</p>
              </div>
            </a>

            <a
              href="mailto:info@genvaani.com"
              className="contact-detail-item contact-detail-link"
              title="Send email to info@genvaani.com"
              aria-label="Send email to info@genvaani.com"
            >
              <div className="contact-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="contact-text">
                <h3>Email Us Directly</h3>
                <p>info@genvaani.com</p>
              </div>
            </a>

            <a
              href="tel:+12125551234"
              className="contact-detail-item contact-detail-link"
              title="Call us at +1 (212) 555-1234"
              aria-label="Call +1 (212) 555-1234"
            >
              <div className="contact-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="contact-text">
                <h3>Call Our Studio</h3>
                <p>+1 (212) 555-1234</p>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-wrapper">
          <h3 className="form-title">Your Detail</h3>

          {feedback.message && (
            <div className={`contact-feedback-banner ${feedback.type}`} role="alert">
              <span>{feedback.type === 'success' ? '✓' : '⚠'}</span>
              <span>{feedback.message}</span>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name <span>*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address <span>*</span></label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email" 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Service <span>*</span></label>
              <input 
                type="text" 
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="Service Required" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Comments / Questions <span>*</span></label>
              <textarea 
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Your Message" 
                rows="4" 
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="contact-submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SENDING INQUIRY...' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>

      </div>

      {/* Map Section */}
      <div className="contact-map-wrapper">
        <iframe
          title="Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126214.39709664654!2d115.08865620959146!3d-8.796013214589254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd244ebbb66e2c5%3A0x88981665a3d70659!2sJimbaran%2C%20South%20Kuta%2C%20Badung%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1714578161556!5m2!1sen!2sid"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="contact-map-iframe"
        ></iframe>

        <div className="newsletter-overlay-wrapper">
          <div className="newsletter-overlay">
            <h2 className="newsletter-title">Let us Keep You<br /> Updated on Our Product</h2>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to newsletter updates!'); }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">SUBMIT</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
