import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const UserLayout = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      if (window.PetCareDB) {
        const sessionUser = await window.PetCareDB.auth.checkSession(["user", "admin"]);
        if (sessionUser) {
          setUser(sessionUser);
        } else {
          navigate('/login');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      if (window.PetCareDB) {
        await window.PetCareDB.auth.logout();
      }
      localStorage.removeItem('petcare_logged_in_user');
      // Add fade-out animation before navigation
      const wrapper = document.querySelector('.dashboard-wrapper');
      if (wrapper) {
        wrapper.style.opacity = '0';
        wrapper.style.transition = 'opacity 0.28s ease-out';
      }
      // Wait for fade to complete before navigating
      setTimeout(() => navigate('/login'), 280);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) return (
    <div className="dashboard-shell-loading" aria-live="polite">
      <div className="dashboard-loading-card">
        <div className="dashboard-loading-icon"><i className="fas fa-paw"></i></div>
        <h3>Preparing your account</h3>
        <p>Please wait while we load your dashboard.</p>
      </div>
    </div>
  );

  const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "U";

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="logo">
            <span className="logo-paw"><i className="fas fa-paw"></i></span> PawBuddy
          </NavLink>
          <button className="sidebar-close" onClick={toggleSidebar} aria-label="Close menu" style={{ display: isSidebarOpen ? 'block' : 'none' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/user/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="fas fa-home"></i> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className="sidebar-link">
              <i className="fas fa-concierge-bell"></i> Available Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="fas fa-calendar-alt"></i> My Bookings
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="fas fa-user-circle"></i> My Profile
            </NavLink>
          </li>
          <li style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
            <NavLink to="/" className="sidebar-link">
              <i className="fas fa-globe"></i> Back to Website
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer">
          <a href="#" className="sidebar-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="dashboard-title">
            <button className="btn-icon dashboard-hamburger" onClick={toggleSidebar}><i className="fas fa-bars"></i></button>
            <div>
              <h1 id="page-title">Welcome to Your Portal</h1>
              <p id="page-desc">Manage your pets, book services, and keep track of appointments.</p>
            </div>
          </div>
          
          <div className="user-profile-header">
            <div className="user-avatar-text">{initials}</div>
            <div className="user-info-text">
              <h4>{user.name}</h4>
              <span>{user.email}</span>
            </div>
          </div>
        </header>

        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default UserLayout;
