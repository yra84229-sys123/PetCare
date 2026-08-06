import { Link } from 'react-router-dom';

const About = () => {
  return (
    <main>
      {/* Who We Are Hero Section */}
      <section className="hero-image-style">
        <img src={`${import.meta.env.BASE_URL}images/12.jpg`} alt="Husky dog lying on couch" className="hero-bg-img" />
        <div className="hero-overlay">
          <div className="hero-content-wrapper">
            <p className="hero-top-text">Discover Our Story</p>
            <h1 className="hero-main-title">Who we are</h1>
            <p className="hero-description">
              Our love for pets and their owners drives everything we do. We have over <span className="stat-number">4+</span> years of
              experience, <span className="stat-number">20+</span> dedicated employees, and have served over
              <span className="stat-number">46,000+</span> clients.
            </p>
            <Link to="/contact" className="btn-hero-shop">Join Our Family</Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story-section">
        <div className="container">
          <div className="story-grid">
            {/* Left side: Text */}
            <div className="story-text">
              <h2>Our Story</h2>
              <p>Since 2019, we've revolutionized pet care by setting new industry standards. With a nationwide presence, we
                provide exceptional care for your beloved pets in various tailored environments.</p>

              <h3>Our Values</h3>
              <ul className="values-list">
                <li>
                  <span className="value-bullet"><i className="fas fa-chevron-right"></i></span>
                  Always be transparent
                </li>
                <li>
                  <span className="value-bullet"><i className="fas fa-chevron-right"></i></span>
                  Work compassionately
                </li>
                <li>
                  <span className="value-bullet"><i className="fas fa-chevron-right"></i></span>
                  Take pride in our community
                </li>
                <li>
                  <span className="value-bullet"><i className="fas fa-chevron-right"></i></span>
                  Be curious
                </li>
              </ul>
            </div>

            {/* Right side: Images */}
            <div className="story-graphics">
              {/* Dog pill vertical image */}
              <div className="story-img-pill pill-dog">
                <img src={`${import.meta.env.BASE_URL}images/9.jpg`} alt="Dog" />
              </div>
              {/* Cat pill vertical image */}
              <div className="story-img-pill pill-cat">
                <img src={`${import.meta.env.BASE_URL}images/8.jpg`} alt="Cat" />
              </div>
              {/* Floating dots */}
              <div className="dot dot-story-blue"></div>
              <div className="dot dot-story-mint"></div>
              <div className="dot dot-story-yellow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Pet Care Team Section */}
      <section className="team-section">
        <div className="team-bg-decorations">
          <div className="deco-icon deco-paw-1"><i className="fas fa-paw"></i></div>
          <div className="deco-icon deco-paw-2"><i className="fas fa-paw"></i></div>
          <div className="deco-icon deco-paw-3"><i className="fas fa-paw"></i></div>
          <div className="deco-icon deco-heart"><i className="fas fa-heart"></i></div>
          <div className="deco-icon deco-bone"><i className="fas fa-bone"></i></div>
          <div className="deco-line">
            <svg viewBox="0 0 100 100" fill="none" stroke="rgba(107, 114, 128, 0.15)" strokeWidth="2" strokeDasharray="4 4">
              <path d="M 0 50 Q 25 0, 50 50 T 100 50" />
            </svg>
          </div>
        </div>
        <div className="container">
          <div className="team-header text-center">
            <span className="team-subtitle"><i className="fas fa-paw"></i> MEET THE TEAM</span>
            <h2 className="team-title">Our <span className="highlight-blue">Pet Care Team</span></h2>
            <p className="team-desc">Meet the passionate people dedicated to keeping your pets healthy, happy, and safe.</p>
          </div>

          <div className="team-cards-container">
            {/* Team Card */}
            <div className="team-card">
              <div className="team-photo-wrapper">
                <img src={`${import.meta.env.BASE_URL}images/Yura.jpg`} alt="Team member photo" className="team-photo" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Thon Youra</h3>
                <div className="team-role">
                  <span className="role-dash">—</span>
                  <span className="role-text"> Founder & Full Stack Developer </span>
                  <span className="role-dash">—</span>
                </div>
                <p className="team-bio">
                  Information Technology Engineering student passionate about building modern web applications and creating
                  innovative pet care solutions that connect pet owners with trusted veterinary services.
                </p>
                <div className="team-social-links">
                  <a href="#" className="social-link" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="social-link" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="social-link" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Friend Circle CTA Banner */}
      <section className="cta-banner">
        <div className="cta-container">
          <div className="cta-left-img">
            <img src={`${import.meta.env.BASE_URL}images/4.jpg`} alt="Beautiful orange tabby cat looking up" />
          </div>
          <div className="cta-content">
            <h2>Join Our Friend Circle</h2>
            <p>We can't wait to meet our newest BFF</p>
            <Link to="/location" className="btn-mint">Locations & Hours</Link>
          </div>
          <div className="cta-right-img">
            <img src={`${import.meta.env.BASE_URL}images/9.jpg`} alt="Happy corgi dog smiling" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
