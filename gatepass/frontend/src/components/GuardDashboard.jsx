import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Shield, Maximize, Keyboard, Camera } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const GuardDashboard = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { username: 'Guard' };

  const [entryLogs, setEntryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/entry/all");
      if (res.ok) {
        const data = await res.json();
        data.sort((a, b) => b.id - a.id);
        setEntryLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const processInput = async (input) => {
    if (!input) return;

    try {
      let targetRollNo = input;

      if (input.includes('-') && !isNaN(input.split('-')[0])) {
        const parts = input.split('-');
        const passId = parts[0];
        const rollNo = parts.slice(1).join('-');

        const verifyRes = await fetch(`http://localhost:8080/api/pass/verify/${passId}`);
        const verifyStatus = await verifyRes.text();

        if (verifyStatus !== "APPROVED") {
           alert(`QR Scanner Alert: Pass is ${verifyStatus} ❌`);
           return;
        }

        targetRollNo = rollNo;
        alert("Pass Verified! ✅ Processing exit...");
      }

      const res = await fetch("http://localhost:8080/api/entry/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo: targetRollNo })
      });
      if (res.ok) {
        setManualInput("");
        fetchLogs();
      } else {
        alert("Failed to record entry/exit.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing input.");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    processInput(manualInput);
  };

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          scanner.clear();
          setIsScanning(false);
          processInput(decodedText);
        },
        (err) => {
          // Ignore scanning matching error logs
        }
      );

      return () => {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      };
    }
  }, [isScanning]);

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="app-container">
      <Sidebar role="guard" />
      
      <main className="main-content">
        <header style={{ marginBottom: '2rem' }}>
          <h1 className="slide-up">Guard Dashboard</h1>
          <p className="text-muted slide-up" style={{ animationDelay: '0.1s' }}>Welcome back, {user.username}. Security checkpoint operations.</p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
          
          <div className="glass-card slide-up" style={{ padding: '2rem', animationDelay: '0.2s' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} className="text-primary" /> Security Scanner
            </h3>
            
            {!isScanning ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '150px', height: '150px', border: '2px dashed var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                    <Maximize size={48} className="text-muted" />
                  </div>
                </div>
                <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>Start scanner to scan a student's QR pass.</p>
                <button className="btn btn-primary" onClick={() => setIsScanning(true)} style={{ width: '100%', marginBottom: '1.5rem' }}>
                  <Camera size={18} /> Start Camera Scanner
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <div id="qr-reader" style={{ width: '100%' }}></div>
                <button className="btn text-danger" onClick={() => setIsScanning(false)} style={{ width: '100%', marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                  Cancel Scanner
                </button>
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1.5rem 0' }} />

            <div>
              <p className="text-muted" style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Or enter manually:</p>
              <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Student Username / Roll No" 
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)' }}
                />
                <button type="submit" className="btn" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)' }}>
                  <Keyboard size={18} />
                </button>
              </form>
            </div>
          </div>

          <div className="glass-card slide-up" style={{ padding: '0', overflow: 'hidden', animationDelay: '0.3s' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <h3 style={{ margin: 0 }}>Recent Activity</h3>
            </div>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Student (Roll No)</th>
                  <th>Action</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>Loading...</td></tr>
                ) : entryLogs.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>No recent activity</td></tr>
                ) : (
                  entryLogs.map(log => {
                    const isExit = !!log.exitTime;
                    const actionTime = isExit ? log.exitTime : log.entryTime;
                    return (
                      <tr key={log.id}>
                        <td>{log.rollNo}</td>
                        <td>
                          <span className={`badge badge-${isExit ? 'danger' : 'success'}`}>
                            {isExit ? 'Exit' : 'Entry'}
                          </span>
                        </td>
                        <td>{formatTime(actionTime)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </section>
      </main>
    </div>
  );
};

export default GuardDashboard;
