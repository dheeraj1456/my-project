import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, BookOpen, Shield, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ role }) => {

  const getLinks = () => {
    switch(role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student', icon: <Home size={20} /> },
          { name: 'My Passes', path: '#', icon: <BookOpen size={20} /> },
        ];
      case 'faculty':
        return [
          { name: 'Dashboard', path: '/faculty', icon: <Home size={20} /> },
          { name: 'Approve Passes', path: '#', icon: <Users size={20} /> },
        ];
      case 'guard':
        return [
          { name: 'Dashboard', path: '/guard', icon: <Home size={20} /> },
          { name: 'Scan QR', path: '#', icon: <Shield size={20} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <aside className="sidebar fade-in">
      <div style={{ padding: '1rem 0 2rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Shield size={28} className="text-gradient" color="#3b82f6" />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }} className="text-gradient">GatePass</h2>
      </div>

      <nav style={{ flex: 1 }}>
        <div style={{ marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Menu
        </div>
        {getLinks().map((link, idx) => (
          <NavLink 
            key={idx} 
            to={link.path} 
            className={({isActive}) => `sidebar-link ${isActive && link.path !== '#' ? 'active' : ''}`}
            end
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <NavLink to="/settings" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <NavLink to="/" className="sidebar-link" style={{ color: 'var(--danger)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
