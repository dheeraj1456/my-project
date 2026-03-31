import React, { useState, useEffect } from 'react';
import { Student, SignOut, PaperPlaneTilt, MagicWand, ClockCounterClockwise, Spinner, Calendar, Empty } from '@phosphor-icons/react';
import { API_BASE_URL, useToast, clearSession } from '../api';

const StudentDashboard = ({ user, onLogout }) => {
  const [passes, setPasses] = useState([]);
  const [loadingPasses, setLoadingPasses] = useState(true);
  
  const [formData, setFormData] = useState({ reason: '', timeSlot: '' });
  const [aiPrediction, setAiPrediction] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { addToast } = useToast();

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  const fetchPasses = async () => {
    setLoadingPasses(true);
    try {
      const res = await fetch(`${API_BASE_URL}/pass/student/${user.username}`);
      const data = await res.json();
      setPasses(data.sort((a,b) => b.id - a.id));
    } catch (err) {
      addToast('Failed to load past requests.', 'error');
    } finally {
      setLoadingPasses(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleAiPredict = async () => {
    if (!formData.reason.trim()) {
      addToast('Please enter a reason first.', 'error');
      return;
    }
    setLoadingAi(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: formData.reason })
      });
      const text = await res.text();
      setAiPrediction(text);
    } catch (err) {
      addToast('AI service currently unavailable.', 'error');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        studentName: user.username,
        rollNo: user.username,
        reason: formData.reason,
        timeSlot: new Date(formData.timeSlot).toLocaleString(),
        status: 'PENDING',
        aiSuggestion: aiPrediction || 'Not checked'
      };
      const res = await fetch(`${API_BASE_URL}/pass/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        addToast('Gate pass requested successfully!', 'success');
        setFormData({ reason: '', timeSlot: '' });
        setAiPrediction('');
        fetchPasses();
      } else {
        addToast('Failed to submit request.', 'error');
      }
    } catch (err) {
      addToast('Server configuration issue.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Student weight="fill" size={28} /> Student Portal
        </div>
        <div className="flex items-center gap-4">
          <span>Welcome, <strong className="display-username text-gradient">{user.username}</strong></span>
          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            <SignOut weight="bold" size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="container grid" style={{ gridTemplateColumns: '1fr 2fr', marginTop: '2rem' }}>
        
        {/* Left Col - Form */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 animate-fade-in" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PaperPlaneTilt weight="fill" /> Request Gate Pass
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="input-group">
                <textarea 
                  name="reason" 
                  value={formData.reason} 
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })} 
                  className={`input-control ${formData.reason ? 'has-value' : ''}`} 
                  rows="3" 
                  placeholder=" " 
                  required 
                  style={{ resize: 'none' }}
                />
                <label>Reason for leaving</label>
              </div>

              <button 
                type="button" 
                onClick={handleAiPredict} 
                disabled={loadingAi}
                className="btn btn-outline" 
                style={{ fontSize: '0.85rem', padding: '0.5rem', justifyContent: 'center', width: '100%', marginTop: '-10px', marginBottom: '10px' }}
              >
                {loadingAi ? <Spinner className="ph-spin" size={16} /> : <MagicWand weight="fill" className="text-gradient" size={16} />}
                {loadingAi ? ' Analyzing...' : ' Get AI Approval Probability'}
              </button>

              {aiPrediction && (
                <div style={{ fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '3px solid var(--primary)', marginBottom: '10px', borderRadius: '4px' }}>
                  <strong>AI Prediction:</strong> {aiPrediction}
                </div>
              )}

              <div className="input-group">
                <input 
                  type="datetime-local" 
                  value={formData.timeSlot} 
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })} 
                  className={`input-control ${formData.timeSlot ? 'has-value' : ''}`} 
                  required 
                />
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col - Passes */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClockCounterClockwise weight="fill" /> My Gate Passes
          </h3>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {loadingPasses ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                <Spinner className="ph-spin" size={32} />
                <p>Loading passes...</p>
              </div>
            ) : passes.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                <Empty weight="fill" size={48} style={{ opacity: 0.5 }} />
                <p>No gate passes requested yet.</p>
              </div>
            ) : (
              passes.map(pass => (
                <div key={pass.id} className="glass-card flex flex-col gap-2">
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${pass.status === 'APPROVED' ? 'approved' : pass.status === 'REJECTED' || pass.status === 'UNAPPROVED' ? 'rejected' : 'pending'}`}>
                      {pass.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{pass.id}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', flexGrow: 1 }}>{pass.reason}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Calendar weight="fill" /> {pass.timeSlot}
                  </div>
                  {pass.aiSuggestion && pass.aiSuggestion !== 'Not checked' && (
                    <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '4px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MagicWand weight="fill" className="text-gradient" /> AI: {pass.aiSuggestion}
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

export default StudentDashboard;
