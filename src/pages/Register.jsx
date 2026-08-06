import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleSuccessfulRegistration = async (user, displayName) => {
    const userEmail = user.email.toLowerCase();
    const role = (userEmail === "admin@petcare.com") ? "admin" : "user";

    const userData = {
      id: user.uid,
      name: displayName || user.displayName || userEmail.split('@')[0],
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
    alert("Registration successful! Redirecting...");
    navigate('/user/dashboard');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await handleSuccessfulRegistration(userCredential.user, name);
    } catch (err) {
      alert("Error during registration: " + err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSuccessfulRegistration(result.user, result.user.displayName);
    } catch (error) {
      alert("Error with Google Sign-In: " + error.message);
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
            <h2>Create Account</h2>
            <p className="login-subtitle">Join us to easily book and manage pet appointments.</p>

            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="regName">Full Name</label>
                <input
                  type="text"
                  id="regName"
                  className="form-control"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="regEmail">Email Address</label>
                <input
                  type="email"
                  id="regEmail"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group auth-password-group">
                <label htmlFor="regPassword">Password</label>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="regPassword"
                    className="form-control"
                    placeholder="Create a password"
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

              <button type="submit" className="btn-primary login-btn">Sign Up</button>

              <div className="auth-divider">
                <hr className="auth-divider-line" />
                <span className="auth-divider-text">OR</span>
                <hr className="auth-divider-line" />
              </div>

              <button type="button" onClick={handleGoogleRegister} className="btn-outline login-btn google-btn">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                Sign up with Google
              </button>

              <div className="register-prompt">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
