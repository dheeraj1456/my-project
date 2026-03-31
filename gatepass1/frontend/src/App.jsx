import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import GuardDashboard from './components/GuardDashboard';
import { getSessionUser, ToastProvider } from './api';

function AppContent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const sessionUser = getSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // Route depending on role
  if (user.role === 'STUDENT') {
    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }
  
  if (user.role === 'FACULTY') {
    return <FacultyDashboard user={user} onLogout={handleLogout} />;
  }
  
  if (user.role === 'GUARD') {
    return <GuardDashboard user={user} onLogout={handleLogout} />;
  }

  // Fallback
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Access Denied</h1>
      <button onClick={handleLogout} className="btn btn-outline" style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
