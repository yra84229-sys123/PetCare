import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-info">
            <Link to="/" className="logo">
              <span className="logo-paw"><i className="fas fa-paw"></i></span> PawBuddy
            </Link>
            <p className="footer-tagline">
              Caring for your pets like family, every step of the way. From routine
              checkups to emergency care, our licensed vets and groomers treat every
              visit like your pet is one of our own.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link to="/services">Services</Link>
              <Link to="/about">About us</Link>
              <Link to="/location">Location &amp; hours</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div className="footer-col footer-contact">
            <h4>Contact</h4>
            <p><i className="fas fa-map-marker-alt"></i> 123 Street 271, Sangkat Boeung Keng Kang, Phnom Penh, Cambodia</p>
            <p><i className="fas fa-envelope"></i> info@pawbuddy.com</p>
            <p><i className="fas fa-phone"></i> (+855) 12 345 678</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 PawBuddy, Inc. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
          <div className="social-links">
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
