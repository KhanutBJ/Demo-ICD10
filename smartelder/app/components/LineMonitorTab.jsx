'use client';
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';

export default function LineMonitorTab() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/alerts`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (e) {
      console.error("Failed to fetch alerts:", e);
      // Fallback mock
      setAlerts([
        { ID: '1', Timestamp: '2026-06-23 09:23:00', VHV_Name: 'อสม.สมหมาย', Patient_HN: 'HN-001', Message: 'ปัสสาวะอุดตัน สีขุ่นข้น', Alert_Level: 'Red', Status_NHSO: 'Pending', Status_Hospital: 'Pending' },
        { ID: '2', Timestamp: '2026-06-23 11:45:00', VHV_Name: 'อสม.สมศรี', Patient_HN: 'HN-003', Message: 'ไม่รับประทานอาหาร 2 วัน อ่อนเพลีย', Alert_Level: 'Orange', Status_NHSO: 'Pending', Status_Hospital: 'Pending' },
        { ID: '3', Timestamp: '2026-06-23 08:00:00', VHV_Name: 'อสม.สมชาย', Patient_HN: 'HN-002', Message: 'กินยาครบ เปลี่ยนผ้าอ้อมปกติ ✓', Alert_Level: 'Green', Status_NHSO: 'Acknowledged', Status_Hospital: 'Acknowledged' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  const handleAck = async (alertId, role) => {
    try {
      const res = await fetch(`${API_BASE}/api/alerts/${alertId}/ack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        fetchAlerts();
      }
    } catch (e) {
      console.error("Failed to acknowledge alert:", e);
    }
  };

  const getAlertConfig = (level) => {
    switch (level) {
      case 'Red':
        return {
          color: '#E11D48',
          bg: '#FFF1F2',
          icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />'
        };
      case 'Orange':
        return {
          color: '#D97706',
          bg: '#FEF3C7',
          icon: '<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />'
        };
      case 'Green':
      default:
        return {
          color: '#059669',
          bg: '#F0FDF4',
          icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />'
        };
    }
  };

  const redCount = alerts.filter(a => a.Alert_Level === 'Red').length;
  const orangeCount = alerts.filter(a => a.Alert_Level === 'Orange').length;
  const greenCount = alerts.filter(a => a.Alert_Level === 'Green').length;

  return (
    <div className="anim-fade-up">
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)' }}>อสม. Line Monitor</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Real-time field tracking via LINE Official Account</p>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, background: '#D1FAE5', color: '#00B87C', padding: '6px 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00B87C' }} /> Live Feed
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        
        {/* Main Feed */}
        <div className="card" style={{ background: 'white', overflow: 'hidden' }}>
          <div style={{ background: '#00C300', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 6, display: 'flex' }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Alerts</h2>
             </div>
             <div style={{ fontSize: 13, opacity: 0.9 }}>อสม. แจ้ง → สปสช. + รพ. เห็นพร้อมกัน</div>
          </div>

          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
             {loading && <p style={{ color: 'var(--ink-4)', fontSize: 13 }}>Loading alerts...</p>}
             {!loading && alerts.length === 0 && <p style={{ color: 'var(--ink-4)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>ไม่มีการแจ้งเตือนจาก อสม.</p>}
             {alerts.map((a, i) => {
               const config = getAlertConfig(a.Alert_Level);
               return (
                 <div key={i} style={{ padding: 16, background: 'white', border: `1px solid ${config.color}`, borderLeft: `6px solid ${config.color}`, borderRadius: 6, position: 'relative' }}>
                    <div style={{ position: 'absolute', right: 16, top: 16, display: 'flex', color: config.color, opacity: 0.2 }}>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: config.icon }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingRight: 40 }}>
                       <div style={{ fontSize: 13, fontWeight: 700, color: config.color }}>{a.VHV_Name} <span style={{ color: '#6B7280', fontWeight: 500 }}>· {a.Patient_HN}</span></div>
                       <div style={{ fontSize: 12, color: '#6B7280' }}>{a.Timestamp.split(' ')[1] || a.Timestamp}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{a.Message}</div>
                    
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                       {a.Status_NHSO === 'Acknowledged' ? (
                         <span style={{ fontSize: 11, background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            ✓ สปสช. รับทราบแล้ว
                         </span>
                       ) : (
                         <button onClick={() => handleAck(a.ID, 'NHSO')} style={{ fontSize: 11, background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '4px 8px', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>
                            🔔 คลิกเพื่อรับทราบ (สปสช.)
                         </button>
                       )}
                       
                       {a.Status_Hospital === 'Acknowledged' ? (
                         <span style={{ fontSize: 11, background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            ✓ รพ. รับทราบแล้ว
                         </span>
                       ) : (
                         <button onClick={() => handleAck(a.ID, 'Hospital')} style={{ fontSize: 11, background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '4px 8px', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>
                            🔔 คลิกเพื่อรับทราบ (รพ.)
                         </button>
                       )}
                    </div>
                 </div>
               );
             })}
          </div>
        </div>

        {/* Side Panel: QR and Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div className="card" style={{ padding: 24, textAlign: 'center' }}>
             <div style={{ background: '#00C300', color: 'white', width: 120, height: 120, margin: '0 auto 16px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, flexDirection: 'column', lineHeight: 1 }}>
                LINE<br/><span style={{ fontSize: 14, marginTop: 4 }}>LA-AGENT</span>
             </div>
             <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginBottom: 8 }}>LaPooPoo Agent Bot</h3>
             <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
               ให้อสม. พยาบาล และ CM แสกนเพื่อประสานงาน คุ้มครองสิทธิผ้าอ้อมผู้สูงอายุ และประเมิน ADL แบบเรียลไทม์
             </p>
           </div>

           <div className="card" style={{ overflow: 'hidden' }}>
             <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '12px 16px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>สรุปการแจ้งเตือน (วันนี้)</h3>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E11D48' }}/> ฉุกเฉิน (สีแดง)</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#E11D48' }}>{redCount}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D97706' }}/> เฝ้าระวัง (สีส้ม)</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#D97706' }}>{orangeCount}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00B87C' }}/> ปกติ (สีเขียว)</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#00B87C' }}>{greenCount}</span>
                 </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
