import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

const Header = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("petcare_logged_in_user");
    if (userJson) {
      try {
        setLoggedInUser(JSON.parse(userJson));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <div 
            className="hamburger" 
            id="nav-hamburger" 
            onClick={() => setIsMenuOpen(true)}
          >
            <i className="fas fa-bars"></i>
          </div>
          <Link to="/" className="logo header-logo">
            <span className="logo-text">PAWBUDDY</span>
            <span className="logo-subtext-container">
              <span className="logo-line"></span>
              <span className="logo-subtext">OF PHNOM PENH </span>
              <span className="logo-line"></span>
            </span>
          </Link>
        </div>
        <div className="header-center">
        </div>
        <div className="header-right">
          {loggedInUser ? (
            <Link to={loggedInUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="header-icon-link">
              <i className="far fa-user"></i> <span>Account</span>
            </Link>
          ) : (
            <Link 
              to="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                setIsAuthModalOpen(true); 
              }} 
              className="header-icon-link"
            >
              <i className="far fa-user"></i> <span>Account</span>
            </Link>
          )}
        </div>
      </div>

      <div 
        className={`secondary-nav-container ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <ul 
          className={`secondary-nav nav-links ${isMenuOpen ? 'active' : ''}`} 
          id="nav-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="nav-menu-close" 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
          <li><NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/services" onClick={() => setIsMenuOpen(false)}>Services</NavLink></li>
          <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About us</NavLink></li>
          <li><NavLink to="/location" onClick={() => setIsMenuOpen(false)}>Location & hours</NavLink></li>
          <li><NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
        </ul>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={(userData) => setLoggedInUser(userData)}
      />
    </header>
  );
};

export default Header;

