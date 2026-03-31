import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, UserPlus, Spinner } from '@phosphor-icons/react';
import { API_BASE_URL, useToast, setSessionUser } from '../api';

const Auth = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });
      const data = await res.text();
      if (data) {
        const user = JSON.parse(data);
        setSessionUser(user);
        addToast(`Welcome back, ${user.username}!`, 'success');
        onLoginSuccess(user);
      } else {
        addToast('Invalid credentials.', 'error');
      }
    } catch (err) {
      addToast('Server error. Backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password, 
          role: formData.role 
        })
      });
      if (res.ok) {
        addToast('Registration successful! Please login.', 'success');
        setActiveTab('login');
        setFormData({ username: '', password: '', role: '' });
      } else {
        addToast('Registration failed.', 'error');
      }
    } catch (err) {
      addToast('Server error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} weight="fill" style={{ color: 'var(--primary)', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }} />
          <h1 className="text-gradient">GatePass Pro</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Secure campus movement.</p>
        </div>

        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '0.3rem', marginBottom: '2rem' }}>
          <div 
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1, padding: '0.8rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 500, transition: 'var(--transition-fast)',
              color: activeTab === 'login' ? 'white' : 'var(--text-muted)',
              background: activeTab === 'login' ? 'rgba(255,255,255,0.1)' : 'transparent',
              boxShadow: activeTab === 'login' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
            }}>
            Login
          </div>
          <div 
            onClick={() => setActiveTab('register')}
            style={{
              flex: 1, padding: '0.8rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 500, transition: 'var(--transition-fast)',
              color: activeTab === 'register' ? 'white' : 'var(--text-muted)',
              background: activeTab === 'register' ? 'rgba(255,255,255,0.1)' : 'transparent',
              boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
            }}>
            Register
          </div>
        </div>

        {activeTab === 'login' ? (
          <form className="animate-fade-in" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <input type="text" name="username" value={formData.username} onChange={handleChange} className={`input-control ${formData.username ? 'has-value' : ''}`} placeholder=" " required />
              <label>Username / Roll No.</label>
            </div>
            <div className="input-group">
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={`input-control ${formData.password ? 'has-value' : ''}`} placeholder=" " required />
              <label>Password</label>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {loading ? <><Spinner className="ph-spin" size={20} /> Authenticating...</> : <>Sign In <ArrowRight weight="bold" size={20} /></>}
            </button>
          </form>
        ) : (
          <form className="animate-fade-in" onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <input type="text" name="username" value={formData.username} onChange={handleChange} className={`input-control ${formData.username ? 'has-value' : ''}`} placeholder=" " required />
              <label>Username / Roll No.</label>
            </div>
            <div className="input-group">
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={`input-control ${formData.password ? 'has-value' : ''}`} placeholder=" " required />
              <label>Password</label>
            </div>
            <div className="input-group">
              <select name="role" value={formData.role} onChange={handleChange} className={`input-control ${formData.role ? 'has-value' : ''}`} required style={{ paddingTop: '1.2rem' }}>
                <option value="" disabled></option>
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="GUARD">Security Guard</option>
              </select>
              <label>Role</label>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {loading ? <><Spinner className="ph-spin" size={20} /> Registering...</> : <>Create Account <UserPlus weight="bold" size={20} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
