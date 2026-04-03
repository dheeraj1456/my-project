import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

const StudentDashboard = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { username: 'Student' };

  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPasses = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/pass/student/${user.username}`);
      if (res.ok) {
        const data = await res.json();
        setPasses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.username !== 'Student') {
      fetchPasses();
    } else {
      setLoading(false);
    }
  }, [user.username]);

  const handleNewPass = async () => {
    const reason = prompt("Enter reason for gate pass:");
    if (!reason) return;
    const timeSlot = prompt("Enter time slot (e.g. 10:00 AM - 12:00 PM):");
    if (!timeSlot) return;

    try {
      const res = await fetch("http://localhost:8080/api/pass/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: user.username,
          rollNo: user.username,
          reason,
          timeSlot,
          status: "PENDING"
        })
      });
      if (res.ok) {
        alert("Pass requested successfully!");
        fetchPasses();
      } else {
        alert("Failed to request pass.");
      }
    } catch (error) {
       console.error(error);
       alert("Error requesting pass.");
    }
  };

  const pendingCount = passes.filter(p => p.status === 'PENDING' || p.status === 'UNAPPROVED').length;
  const approvedCount = passes.filter(p => p.status === 'APPROVED').length;
  const rejectedCount = passes.filter(p => p.status === 'REJECTED').length;

  return (
    <div className="app-container">
      <Sidebar role="student" />
      
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="slide-up">Student Dashboard</h1>
            <p className="text-muted slide-up" style={{ animationDelay: '0.1s' }}>Welcome back, {user.username}. Here is your gatepass overview.</p>
          </div>
          <button className="btn btn-primary slide-up" style={{ animationDelay: '0.2s' }} onClick={handleNewPass}>
            <Plus size={18} /> New Pass
          </button>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-card slide-up" style={{ padding: '1.5rem', animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                <Clock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{pendingCount}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Pending Passes</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card slide-up" style={{ padding: '1.5rem', animationDelay: '0.4s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{approvedCount}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Approved Passes</p>
              </div>
            </div>
          </div>

          <div className="glass-card slide-up" style={{ padding: '1.5rem', animationDelay: '0.5s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
                <XCircle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{rejectedCount}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Rejected Passes</p>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card slide-up" style={{ padding: '0', overflow: 'hidden', animationDelay: '0.6s' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ margin: 0 }}>Recent Requests</h3>
          </div>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>QR Pass</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : passes.length === 0 ? (
                 <tr><td colSpan="4" style={{ textAlign: 'center' }}>No requests found</td></tr>
              ) : (
                passes.map((pass) => (
                  <tr key={pass.id}>
                    <td>{pass.reason}</td>
                    <td>{pass.timeSlot}</td>
                    <td>
                      <span className={`badge badge-${pass.status === 'APPROVED' ? 'success' : pass.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                        {pass.status === 'UNAPPROVED' ? 'PENDING' : pass.status}
                      </span>
                    </td>
                    <td>
                      {pass.status === 'APPROVED' ? (
                        <div style={{ background: '#fff', padding: '4px', borderRadius: '4px', display: 'inline-block' }}>
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${pass.id}-${pass.rollNo}`} 
                            alt="QR Code" 
                            title={`${pass.id}-${pass.rollNo}`}
                            style={{ display: 'block' }}
                          />
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
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

export default StudentDashboard;
