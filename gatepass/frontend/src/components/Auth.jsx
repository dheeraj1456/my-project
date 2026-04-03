import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Auth = () => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role
        })
      });

      if (!response.ok) {
        throw new Error("HTTP Error " + response.status);
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (data) {
        if (isLogin) {
          alert("Login Successful ✅");
          
          localStorage.setItem("user", JSON.stringify(data));

          const finalRole = data.role || role;

          if (finalRole === 'faculty') {
            navigate('/faculty');
          } else if (finalRole === 'guard') {
            navigate('/guard');
          } else {
            navigate('/student');
          }
        } else {
          alert("Registration Successful ✅ Please login.");
          setIsLogin(true);
        }
      } else {
        alert(isLogin ? "Invalid credentials ❌" : "Registration failed ❌");
      }

    } catch (error) {
      console.error("Backend error:", error);
      alert(isLogin ? "Error connecting to backend or invalid credentials ❌" : "Error during registration ❌");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', border: '1px solid #ccc', borderRadius: '10px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={32} color="#3b82f6" />
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <p>{isLogin ? 'Select your role and enter credentials' : 'Create a new account'}</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '1rem' }}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="guard">Security Guard</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Auth;