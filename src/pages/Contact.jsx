import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you shortly.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      {/* Welcome / Hero Section */}
      <section className="hero-image-style">
        <img src={`${import.meta.env.BASE_URL}images/HOME1.jpg`} alt="Dogs resting" className="hero-bg-img" />
        <div className="hero-overlay">
          <div className="hero-content-wrapper">
            <p className="hero-top-text"></p>
            <h1 className="hero-main-title">PawBuddy of<br />Phnom Penh</h1>
            <p className="hero-description">We provide quality pet care and personalized treatment plans for your pet. From
              bathing and grooming to vaccinations and checkups, we keep them happy and healthy.</p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Grid */}
      <main className="container contact-section">
        <div className="contact-grid">
          {/* Contact Info Details */}
          <div className="contact-info-list" id="contact-details">
            <h2>Get in Touch</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
              We respond to all inquiries within 24 hours. For emergencies, please call us directly.
            </p>

            <div className="contact-info-item">
              <div className="contact-info-icon"><i className="fas fa-phone-alt"></i></div>
              <div className="contact-info-text">
                <h3>Phone Number</h3>
                <p>+1 (555) 123-4567</p>
                <p>+1 (555) 987-6543 (Emergency)</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon"><i className="fas fa-envelope"></i></div>
              <div className="contact-info-text">
                <h3>Email Address</h3>
                <p>info@pawbuddy.com</p>
                <p>support@pawbuddy.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="contact-info-text">
                <h3>Our Location</h3>
                <p>123 Street 271, Sangkat Boeung Keng Kang, Phnom Penh, Cambodia</p>
              </div>
            </div>
          </div>

          {/* Contact Form Container */}
          <div className="contact-form-container">
            <h2>Send a Message</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              Fill out the form below and we will contact you shortly.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-control" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="form-control" 
                  required 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea 
                  id="message" 
                  className="form-control" 
                  rows="5" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
