'use client';
import { useState } from 'react';

/* Simulated HOSxP feed — Anonymized, No Hospital */
const HIS_FEED = [
  { ts: '22:14', hn: 'HN-2024-001', age: 72, icd: 'I63.9', desc: 'Cerebral infarction, unspecified',   diaper: true,  mapped: true },
  { ts: '21:47', hn: 'HN-2024-007', age: 68, icd: 'I63.5', desc: 'Cerebral infarction due to occlusio', diaper: true,  mapped: true },
  { ts: '21:30', hn: 'HN-2024-012', age: 81, icd: 'I61.0', desc: 'Intracerebral hemorrhage',            diaper: true,  mapped: true },
  { ts: '20:55', hn: 'HN-2024-019', age: 76, icd: 'I69.3', desc: 'Sequelae of cerebral infarction',     diaper: true,  mapped: true },
  { ts: '20:10', hn: 'HN-2024-023', age: 74, icd: 'I63.9', desc: 'Cerebral infarction, unspecified',    diaper: true,  mapped: true },
  { ts: '19:45', hn: 'HN-2024-031', age: 70, icd: 'E11.9', desc: 'Type 2 diabetes mellitus',            diaper: false, mapped: false },
  { ts: '19:20', hn: 'HN-2024-035', age: 78, icd: 'M17.1', desc: 'Primary gonarthrosis, unilateral',    diaper: false, mapped: false },
  { ts: '18:50', hn: 'HN-2024-041', age: 82, icd: 'I50.0', desc: 'Congestive heart failure',             diaper: false, mapped: false },
];

export default function HISGatewayTab() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'diaper' ? HIS_FEED.filter(f => f.diaper) : HIS_FEED;

  return (
    <div>
      {/* HIS Interface Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>HOSxP API Gateway (Clinical View)</h1>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Real-time HL7 FHIR sync — Auto-detecting Diaper Rights</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="chip chip-blue">Sync Active</span>
        </div>
      </div>

      <div className="card" style={{ padding: '14px 18px', marginBottom: 16, borderLeft: '3px solid var(--blue)' }}>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ink)' }}>Plugin Active:</strong> Synapse x Right Add-on is intercepting ICD codes. 
          Patients mapped to Stroke (I60-I69) will automatically trigger the <strong>Diaper Auto-Referral Pipeline</strong>.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[
          { id: 'all', label: `All Patients (${HIS_FEED.length})` },
          { id: 'diaper', label: `Diaper Eligible (${HIS_FEED.filter(f => f.diaper).length})` },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={filter === f.id ? 'chip chip-blue' : 'chip chip-gray'}
            style={{ cursor: 'pointer', border: 'none' }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 100px 60px 80px 1fr 140px',
          padding: '10px 16px', fontSize: 11, fontWeight: 600, color: 'var(--ink-4)',
          background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          <span>TIME</span><span>HN</span><span>AGE</span><span>ICD-10</span><span>DESCRIPTION</span><span>SYNAPSE ADD-ON</span>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((r, i) => (
            <div key={i} className="anim-slide-right" style={{
              animationDelay: `${i * 40}ms`,
              display: 'grid', gridTemplateColumns: '60px 100px 60px 80px 1fr 140px',
              alignItems: 'center', padding: '12px 16px',
              background: r.diaper ? 'var(--blue-light)' : 'var(--surface)',
              borderBottom: i === filtered.length - 1 ? 'none' : '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'monospace' }}>{r.ts}</span>
              <span style={{ fontSize: 12, color: 'var(--ink)', fontFamily: 'monospace', fontWeight: 600 }}>{r.hn}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{r.age}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: r.diaper ? 'var(--blue)' : 'var(--ink-2)' }}>{r.icd}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{r.desc}</span>
              <div>
                {r.diaper ? (
                  <span className="chip chip-green" style={{ fontSize: 10 }}>Trigger: สิทธิ์ผ้าอ้อม</span>
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>No Action</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
