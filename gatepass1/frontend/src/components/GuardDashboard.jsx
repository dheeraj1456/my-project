import React, { useState, useEffect } from 'react';
import { ShieldStar, SignOut, QrCode, SignIn, ClipboardText, ArrowsClockwise, Spinner, Scan } from '@phosphor-icons/react';
import { API_BASE_URL, useToast, clearSession } from '../api';

const GuardDashboard = ({ user, onLogout }) => {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [scanRollNo, setScanRollNo] = useState('');
  const [scanning, setScanning] = useState(false);

  const { addToast } = useToast();

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  const loadLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch(`${API_BASE_URL}/entry/all`);
      const data = await res.json();
      setLogs(data.sort((a,b) => b.id - a.id));
    } catch (err) {
      addToast('Failed to load entry logs.', 'error');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyResult('');
    try {
      const res = await fetch(`${API_BASE_URL}/pass/verify/${verifyId}`);
      const statusText = await res.text();
      setVerifyResult(statusText);
      
      if(statusText === 'APPROVED') {
        addToast('Pass Valid.', 'success');
      } else if(statusText === 'NOT APPROVED') {
        addToast('Pass not approved yet.', 'warning');
      } else {
        addToast('Invalid / Fake Pass!', 'error');
      }
    } catch (err) {
      setVerifyResult('ERROR');
      addToast('Verification error.', 'error');
    } finally {
      setVerifying(false);
      setVerifyId('');
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setScanning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/entry/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo: scanRollNo })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exitTime) {
          addToast(`${scanRollNo} EXITED the campus successfully.`, 'info');
        } else {
          addToast(`${scanRollNo} ENTERED the campus successfully.`, 'success');
        }
        loadLogs();
      } else {
        addToast('Failed to record scan.', 'error');
      }
    } catch (err) {
      addToast('Scan error.', 'error');
    } finally {
      setScanning(false);
      setScanRollNo('');
    }
  };

  // Helper for status styling
  const getVerifyStyle = (status) => {
    if(status === 'APPROVED') return { background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', border: '1px solid var(--success)' };
    if(status === 'NOT APPROVED') return { background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', border: '1px solid var(--warning)' };
    if(status === 'ERROR') return { background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: '1px solid var(--danger)' };
    return { background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: '1px solid var(--danger)' }; // FAKE QR
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <ShieldStar weight="fill" size={28} /> Security Portal
        </div>
        <div className="flex items-center gap-4">
          <span>Welcome, <strong className="display-username text-gradient">{user.username}</strong></span>
          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            <SignOut weight="bold" size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="container grid" style={{ gridTemplateColumns: '1fr 1.5fr', marginTop: '2rem' }}>
        
        {/* Left Col - Scanning Actions */}
        <div className="flex flex-col gap-4">
          
          <div className="glass-panel p-6 animate-fade-in" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QrCode weight="fill" /> Verify Gate Pass ID
            </h3>
            <form onSubmit={handleVerify} className="flex flex-col gap-3">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <input 
                  type="number" 
                  value={verifyId} 
                  onChange={(e) => setVerifyId(e.target.value)} 
                  className={`input-control ${verifyId ? 'has-value' : ''}`} 
                  placeholder=" " 
                  required 
                />
                <label>Gate Pass ID</label>
              </div>
              <button type="submit" disabled={verifying} className="btn btn-primary">
                {verifying ? <Spinner className="ph-spin" /> : 'Verify Pass'}
              </button>
            </form>
            
            {verifyResult && (
              <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 600, fontSize: '1.2rem', ...getVerifyStyle(verifyResult) }}>
                {verifyResult}
              </div>
            )}
          </div>

          <div className="glass-panel p-6 animate-fade-in" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SignIn weight="fill" /> Campus Entry/Exit Scan
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Scan Student ID/Roll No to automatically log entry or exit.
            </p>
            <form onSubmit={handleScan} className="flex flex-col gap-3">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <input 
                  type="text" 
                  value={scanRollNo} 
                  onChange={(e) => setScanRollNo(e.target.value)} 
                  className={`input-control ${scanRollNo ? 'has-value' : ''}`} 
                  placeholder=" " 
                  required 
                  autoComplete="off"
                />
                <label>Student Roll No.</label>
              </div>
              <button type="submit" disabled={scanning} className="btn btn-primary" style={{ background: 'var(--primary)', color: 'white' }}>
                {scanning ? <Spinner className="ph-spin" /> : <><Scan weight="bold" /> Scan ID</>}
              </button>
            </form>
          </div>

        </div>

        {/* Right Col - Logs */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ClipboardText weight="fill" /> Live Access Logs</h3>
            <button className="btn btn-outline" onClick={loadLogs} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <ArrowsClockwise weight="bold" /> Refresh
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>Log ID</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>Roll No</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>Entry Time</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>Exit Time</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingLogs ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      <Spinner className="ph-spin" size={24} /> Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>#{log.id}</td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{log.rollNo}</td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>
                        {log.entryTime ? new Date(log.entryTime).toLocaleString() : '-'}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {log.exitTime ? new Date(log.exitTime).toLocaleString() : '-'}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {log.exitTime ? (
                          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)' }}>LEFT</span>
                        ) : (
                          <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>INSIDE</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default GuardDashboard;
