import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset login page opacity when it loads
    const authSection = document.querySelector('.auth-section');
    if (authSection) {
      authSection.style.opacity = '1';
      authSection.style.transition = 'none';
    }

    const userJson = localStorage.getItem("petcare_logged_in_user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.role === "admin") navigate('/admin/dashboard');
        else navigate('/user/dashboard');
      } catch (_e) {
        // invalid json
      }
    }
  }, [navigate]);

  const handleSuccessfulLogin = async (user) => {
    const userEmail = user.email ? user.email.toLowerCase() : '';
    const role = (userEmail === "admin@petcare.com") ? "admin" : "user";

    const userData = {
      id: user.uid,
      name: user.displayName || (userEmail ? userEmail.split('@')[0] : 'User'),
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
    alert("Login Successful! Redirecting...");
    
    // Smooth fade-out of login page before navigation
    const authSection = document.querySelector('.auth-section');
    if (authSection) {
      authSection.style.opacity = '0';
      authSection.style.transition = 'opacity 0.28s ease-out';
    }
    
    // Wait for fade to complete before navigating
    setTimeout(() => {
      if (role === "admin") {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }, 280);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleSuccessfulLogin(userCredential.user);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSuccessfulLogin(result.user);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main>
      <section className="auth-section">
        <div className="login-bg-decor left-decor"></div>
        <div className="login-bg-decor right-decor"></div>

        <div className="login-page-wrapper">
          <div className="login-card">
            <div className="auth-badge">
              <i className="fas fa-paw"></i>
            </div>
            <h2>Login</h2>
            <p className="login-subtitle">Welcome back! Please login to your account.</p>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group auth-password-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>
                  <Link to="#" className="forgot-link">Forgot Password?</Link>
                </div>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i
                    className={`far ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-pw`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>

              <button type="submit" className="btn-primary login-btn">Login</button>

              <div className="auth-divider">
                <hr className="auth-divider-line" />
                <span className="auth-divider-text">OR</span>
                <hr className="auth-divider-line" />
              </div>

              <button type="button" onClick={handleGoogleLogin} className="btn-outline login-btn google-btn">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                Sign in with Google
              </button>

              <div className="register-prompt">
                Don't have an account? <Link to="/register">Register here</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
