import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';

import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Location from './pages/Location';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// User Dashboard imports
import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/Dashboard';
import UserBookings from './pages/user/Bookings';
import UserProfile from './pages/user/Profile';

// Admin Dashboard imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPets from './pages/admin/Pets';
import AdminOwners from './pages/admin/Owners';
import AdminBookings from './pages/admin/Bookings';
import AdminMessages from './pages/admin/Messages';
import AdminUsers from './pages/admin/Users';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* User Dashboard Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pets" element={<AdminPets />} />
          <Route path="owners" element={<AdminOwners />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="/login.html" element={<Navigate to="/login" replace />} />
        <Route path="/register.html" element={<Navigate to="/register" replace />} />
        <Route path="/admin/dashboard.html" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '50px', marginTop: '100px' }}>
            <h2>404 - Page Not Found</h2>
            <p>The page you are looking for does not exist. Note: The new system no longer uses .html extensions.</p>
            <a href="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Return to Home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
