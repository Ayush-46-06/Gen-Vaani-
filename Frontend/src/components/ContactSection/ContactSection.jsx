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
            <div className="contact-detail-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-text">
                <h3>Jimbaran, Bali</h3>
                <p>Jl. Raya Kampus Unud, Jimbaran, Bali - 80361</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-text">
                <h3>Pakuwon City, Surabaya</h3>
                <p>Jl. Kejawan Putih Indah, Mulyorejo, SBY - 60112</p>
              </div>
            </div>
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
            <h2 className="newsletter-title">Keep Updated<br />About Our Product</h2>
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
