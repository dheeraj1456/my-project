import React, { useState, useEffect } from 'react';
import {
  ChalkboardTeacher,
  SignOut,
  ListChecks,
  ArrowsClockwise,
  Spinner,
  Calendar,
  MagicWand,
  Check,
  X,
  Empty
} from '@phosphor-icons/react';
import { API_BASE_URL, useToast, clearSession } from '../api';

const FacultyDashboard = ({ user, onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    id: null,
    type: null
  });

  const { addToast } = useToast();

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  // ✅ LOAD REQUESTS (NO LOOP)
  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/pass/all`);
      const data = await res.json();

      const formatted = data.map(r => ({
        ...r,
        status: r.status || 'PENDING'
      }));

      setRequests(formatted.sort((a, b) => b.id - a.id));
    } catch {
      console.error;
      addToast('Failed to load requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ RUN ONLY ONCE
  useEffect(() => {
    loadRequests();
  }, []);

  // ✅ APPROVE / REJECT HANDLER
  const handleAction = async (id, action) => {
    setActionLoading({ id, type: action });

    try {
      const endpoint =
        action === 'approve'
          ? `${API_BASE_URL}/pass/approve/${id}`
          : `${API_BASE_URL}/pass/reject/${id}`;

      const res = await fetch(endpoint, { method: 'PUT' });

      if (!res.ok) throw new Error('API failed');

      addToast(`Request ${action}d successfully`, 'success');

      setRequests(prev =>
        prev.map(r =>
          r.id === id
            ? {
                ...r,
                status: action === 'approve' ? 'APPROVED' : 'REJECTED'
              }
            : r
        )
      );
    } catch (err) {
      console.error(err);
      addToast('Action failed. Check backend.', 'error');
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <ChalkboardTeacher weight="fill" size={28} /> Faculty Portal
        </div>

        <div className="flex items-center gap-4">
          <span>
            Welcome,{' '}
            <strong className="text-gradient">
              {user.username}
            </strong>
          </span>

          <button className="btn btn-outline" onClick={handleLogout}>
            <SignOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="glass-panel">

          {/* HEADER */}
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3>
              <ListChecks /> Pending Requests
            </h3>

            <button className="btn btn-outline" onClick={loadRequests}>
              <ArrowsClockwise /> Refresh
            </button>
          </div>

          {/* CONTENT */}
          <div className="grid">

            {loading ? (
              <div style={{ textAlign: 'center' }}>
                <Spinner className="ph-spin" size={32} />
                <p>Loading requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div style={{ textAlign: 'center' }}>
                <Empty size={48} />
                <p>No requests found</p>
              </div>
            ) : (
              requests.map(pass => (
                <div key={pass.id} className="glass-card">

                  {/* STATUS */}
                  <div className="flex justify-between">
                    <span className={`badge ${
                      pass.status === 'APPROVED'
                        ? 'badge-approved'
                        : pass.status === 'REJECTED'
                        ? 'badge-rejected'
                        : 'badge-pending'
                    }`}>
                      {pass.status}
                    </span>

                    <span>ID: #{pass.id}</span>
                  </div>

                  {/* NAME */}
                  <div>
                    <strong>{pass.studentName}</strong>
                    <span> ({pass.rollNo})</span>
                  </div>

                  {/* REASON */}
                  <p>"{pass.reason}"</p>

                  {/* INFO */}
                  <div className="flex justify-between">
                    <span>
                      <Calendar /> {pass.timeSlot}
                    </span>

                    {pass.aiSuggestion && (
                      <span>
                        <MagicWand /> AI Checked
                      </span>
                    )}
                  </div>

                  {/* ACTIONS */}
                  {pass.status !== 'APPROVED' && pass.status !== 'REJECTED' ? (
                    <div className="flex gap-2" style={{ marginTop: '1rem' }}>

                      <button
                        className="btn btn-success"
                        disabled={actionLoading.id === pass.id}
                        onClick={() => handleAction(pass.id, 'approve')}
                      >
                        {actionLoading.id === pass.id &&
                        actionLoading.type === 'approve'
                          ? 'Processing...'
                          : 'Approve'}
                      </button>

                      <button
                        className="btn btn-danger"
                        disabled={actionLoading.id === pass.id}
                        onClick={() => handleAction(pass.id, 'reject')}
                      >
                        {actionLoading.id === pass.id &&
                        actionLoading.type === 'reject'
                          ? 'Processing...'
                          : 'Reject'}
                      </button>

                    </div>
                  ) : (
                    <div style={{ marginTop: '1rem' }}>
                      <button className="btn btn-outline">
                        {pass.status === 'APPROVED'
                          ? 'Approved ✅'
                          : 'Rejected ❌'}
                      </button>
                    </div>
                  )}

                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;