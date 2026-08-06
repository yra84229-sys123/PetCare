import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main>
      <section className="hero-image-style">
        <img src="/images/HOME1.jpg" alt="Dogs resting" className="hero-bg-img" />
        <div className="hero-overlay">
          <div className="hero-content-wrapper">
            <p className="hero-top-text"></p>
            <h1 className="hero-main-title">PawBuddy of<br />Phnom Penh</h1>
            <p className="hero-description">
              We provide quality pet care and personalized treatment plans for your pet. From
              bathing and grooming to vaccinations and checkups, we keep them happy and healthy.
            </p>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="services-layout">
            <div className="services-heading">
              <h2>Optimal Health for Furry Friends: Comprehensive Veterinary Services</h2>
              <p>
                Explore our premium services tailored specifically for the wellness and hygiene of your pets. We ensure
                top-tier care from experienced professionals who love animals.
              </p>
              <Link to="/services" className="btn-primary" id="btn-view-services">View more</Link>
            </div>
            <div className="services-grid">
              <div className="service-card" id="card-grooming">
                <div className="service-icon"><i className="fas fa-scissors"></i></div>
                <h3>Pet Grooming</h3>
                <p>Complete styling, coat trimming, and cleaning to keep your pet looking and smelling absolutely wonderful.</p>
                <Link to="/services" className="view-more">View details</Link>
              </div>
              <div className="service-card" id="card-bathing">
                <div className="service-icon"><i className="fas fa-bath"></i></div>
                <h3>Warm Bathing</h3>
                <p>Relaxing bubble baths with hypoallergenic shampoo, blow-dry, and brush out to prevent matting.</p>
                <Link to="/services" className="view-more">View details</Link>
              </div>
              <div className="service-card" id="card-vaccination">
                <div className="service-icon"><i className="fas fa-syringe"></i></div>
                <h3>Pet Vaccination</h3>
                <p>Comprehensive immunization checkups and schedule tracking to shield your pet from common viral illnesses.</p>
                <Link to="/services" className="view-more">View details</Link>
              </div>
              <div className="service-card" id="card-boarding">
                <div className="service-icon"><i className="fas fa-home"></i></div>
                <h3>Pet Boarding</h3>
                <p>Spacious, clean, and comfortable overnight boarding where your pet is treated like a beloved family member.</p>
                <Link to="/services" className="view-more">View details</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner" id="friend-circle-cta">
        <div className="cta-container">
          <div className="cta-left-img">
            <img src="/images/4.jpg" alt="Beautiful orange tabby cat looking up" />
          </div>
          <div className="cta-content">
            <h2>Join Our Friend Circle</h2>
            <p>We can't wait to meet our newest BFF. Book your slot today!</p>
          </div>
          <div className="cta-right-img">
            <img src="/images/9.jpg" alt="Happy corgi dog smiling" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
