import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhrDKZV_BDbDy9hDmcU6_MneQKx8aiijE",
  authDomain: "petcare-e518d.firebaseapp.com",
  projectId: "petcare-e518d",
  storageBucket: "petcare-e518d.firebasestorage.app",
  messagingSenderId: "1024623908060",
  appId: "1:1024623908060:web:a294146194b01407991019",
  measurementId: "G-FLQHNL3EHT"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  const navigate = useNavigate();


  const handleSuccessfulAuth = async (user, displayName = null) => {
    const userEmail = user.email ? user.email.toLowerCase() : '';
    const role = (userEmail === "admin@petcare.com") ? "admin" : "user";

    const userData = {
      id: user.uid,
      name: displayName || user.displayName || (userEmail ? userEmail.split('@')[0] : 'User'),
      email: userEmail,
      role: role,
      status: "Active"
    };

    if (window.PetCareDB) {
      try {
        await window.PetCareDB.usersManager.ensureUserExists(userData);
      } catch (e) {
        console.error("Failed to ensure user in Firestore:", e);
      }
    }

    localStorage.setItem("petcare_logged_in_user", JSON.stringify(userData));
    onLoginSuccess(userData);
    onClose();
    
    // Redirect to dashboard
    if (role === "admin") {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      await handleSuccessfulAuth(userCredential.user);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      await handleSuccessfulAuth(userCredential.user, regName);
    } catch (err) {
      alert("Error during registration: " + err.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSuccessfulAuth(result.user, result.user.displayName);
    } catch (error) {
      alert("Error with Google authentication: " + error.message);
    }
  };

  return (
    <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          <i className="fas fa-times"></i>
        </button>

        <div className="auth-modal-badge">
          <i className="fas fa-paw"></i>
        </div>

        <div className="auth-modal-tabs">
          <button 
            type="button"
            className={`auth-modal-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            type="button"
            className={`auth-modal-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <div className="auth-modal-body">
            <h2>Welcome Back</h2>
            <p className="auth-modal-subtitle">Login to manage your pets and appointments.</p>
            
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="modal-email">Email</label>
                <input
                  type="email"
                  id="modal-email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="form-group auth-password-group">
                <div className="password-header">
                  <label htmlFor="modal-password">Password</label>
                </div>
                <div className="auth-input-wrapper">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    id="modal-password"
                    className="form-control"
                    placeholder="Enter your password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <i
                    className={`far ${showLoginPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-pw`}
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  ></i>
                </div>
              </div>

              <button type="submit" className="btn-primary login-btn">Login</button>
            </form>
          </div>
        ) : (
          <div className="auth-modal-body">
            <h2>Create Account</h2>
            <p className="auth-modal-subtitle">Join us to easily book and manage pet appointments.</p>
            
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="modal-reg-name">Full Name</label>
                <input
                  type="text"
                  id="modal-reg-name"
                  className="form-control"
                  placeholder="Enter your name"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-reg-email">Email</label>
                <input
                  type="email"
                  id="modal-reg-email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="form-group auth-password-group">
                <div className="password-header">
                  <label htmlFor="modal-reg-password">Password</label>
                </div>
                <div className="auth-input-wrapper">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    id="modal-reg-password"
                    className="form-control"
                    placeholder="Create a password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <i
                    className={`far ${showRegPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-pw`}
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  ></i>
                </div>
              </div>

              <button type="submit" className="btn-primary login-btn">Register</button>
            </form>
          </div>
        )}

        <div className="auth-divider">
          <hr className="auth-divider-line" />
          <span className="auth-divider-text">OR</span>
          <hr className="auth-divider-line" />
        </div>

        <button type="button" onClick={handleGoogleAuth} className="btn-outline login-btn google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
