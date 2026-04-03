import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { username: 'Faculty' };

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/pass/all");
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter(d => d.status === 'PENDING' || d.status === 'UNAPPROVED');
        setRequests(pending);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:8080/api/pass/${action}/${id}`, {
        method: "PUT"
      });
      if (res.ok) {
        alert(`Pass ${action}d successfully.`)
        fetchRequests();
      } else {
        alert(`Failed to ${action} pass.`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error trying to ${action} pass.`);
    }
  };

  return (
    <div className="app-container">
      <Sidebar role="faculty" />
      
      <main className="main-content">
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="slide-up">Faculty Dashboard</h1>
          <p className="text-muted slide-up" style={{ animationDelay: '0.1s' }}>Welcome back, {user.username}. Overview of pending student gatepass requests.</p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-card slide-up" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{requests.length}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Pending Approvals</p>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card slide-up" style={{ padding: '0', overflow: 'hidden', animationDelay: '0.3s' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ margin: 0 }}>Action Required</h3>
          </div>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Reason</th>
                <th>Time Slot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>No pending requests</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id}>
                    <td>{req.studentName || 'Unknown'} ({req.rollNo || 'N/A'})</td>
                    <td>{req.reason}</td>
                    <td>{req.timeSlot}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" onClick={() => handleAction(req.id, 'approve')} style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', cursor: 'pointer' }}><CheckCircle size={16} /></button>
                        <button className="btn" onClick={() => handleAction(req.id, 'reject')} style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', cursor: 'pointer' }}><XCircle size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default FacultyDashboard;
