'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';

/* Hospital geo-data — Thonburi/south-Bangkok cluster */
const HOSPITALS = [
  {
    name: 'รพ.บางมด', lat: 13.6527, lng: 100.4979, rate: 8, color: '#0F6E56',
    patients: 45, status: 'ดี',
    depts: [
      { name:'LTC / Home Care',       icon:'🏠', color:'#0F6E56' },
      { name:'กายภาพบำบัด',           icon:'🏃', color:'#0EA5E9' },
      { name:'อายุรกรรมทั่วไป',        icon:'🏥', color:'#17A97E' },
    ],
  },
  {
    name: 'รพ.สมเด็จ', lat: 13.6747, lng: 100.5052, rate: 12, color: '#3B82F6',
    patients: 38, status: 'ปกติ',
    depts: [
      { name:'ออร์โธปีดิกส์',         icon:'🦵', color:'#F97316' },
      { name:'กายภาพบำบัด',           icon:'🏃', color:'#0EA5E9' },
    ],
  },
  {
    name: 'รพ.ราษฎร์บูรณะ', lat: 13.6847, lng: 100.5021, rate: 28, color: '#F59E0B',
    patients: 62, status: 'สูง',
    depts: [
      { name:'ศัลยกรรมกระดูก',        icon:'🦴', color:'#F59E0B' },
      { name:'คลินิกเบาหวาน',         icon:'🩸', color:'#EF4444' },
      { name:'อายุรกรรมหัวใจ',        icon:'❤️', color:'#EC4899' },
    ],
  },
  {
    name: 'รพ.ธนบุรี', lat: 13.7271, lng: 100.4731, rate: 41, color: '#EF4444',
    patients: 89, status: 'วิกฤต',
    depts: [
      { name:'จิตเวชศาสตร์',          icon:'🧠', color:'#8B5CF6' },
      { name:'อายุรกรรมประสาทวิทยา', icon:'🧠', color:'#6366F1' },
      { name:'Palliative Care',       icon:'💜', color:'#8B5CF6' },
      { name:'อายุรกรรมหัวใจ',        icon:'❤️', color:'#EC4899' },
    ],
  },
];

const STATUS_BADGE = {
  ดี:    { bg:'#F0FDF9', border:'#0F6E56', text:'#0F6E56' },
  ปกติ:  { bg:'#EFF6FF', border:'#3B82F6', text:'#1D4ED8' },
  สูง:   { bg:'#FFFBEB', border:'#F59E0B', text:'#92400E' },
  วิกฤต: { bg:'#FFF1F2', border:'#EF4444', text:'#991B1B' },
};

/* Hex→rgba helper */
function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* Auto-fit map to all markers */
function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const bounds = HOSPITALS.map(h => [h.lat, h.lng]);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map]);
  return null;
}

export default function HospitalHeatmap() {
  const [activeHospital, setActiveHospital] = useState(null);

  /* Inject Leaflet CSS once */
  useEffect(() => {
    if (document.getElementById('leaflet-css')) return;
    const link = document.createElement('link');
    link.id   = 'leaflet-css';
    link.rel  = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,110,86,0.18)', border: '1.5px solid #D1E8DF', position: 'relative' }}>

      {/* Map header */}
      <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg,#0a3d2e,#0F6E56)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🗺️</div>
        <div>
          <p style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>Hospital Heatmap — Department Load</p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Thonburi cluster · ขนาดวงกลม = จำนวนผู้ป่วย · สี = อัตราปฏิเสธสิทธิ์</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['#0F6E56','ดี (< 15%)'],['#F59E0B','สูง (15–35%)'],['#EF4444','วิกฤต (> 35%)']].map(([c,l]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:c, display:'inline-block' }} />
              <span style={{ color:'rgba(255,255,255,0.8)', fontSize:10, fontWeight:600 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[13.6900, 100.4900]}
        zoom={12}
        style={{ height: 420, width: '100%', background: '#E8F4F1' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <FitBounds />

        {HOSPITALS.map((h) => {
          const baseRadius = 400 + h.patients * 18;
          return (
            <div key={h.name}>
              {/* Outer glow ring */}
              <Circle
                center={[h.lat, h.lng]}
                radius={baseRadius * 2.2}
                pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: 0.04, weight: 0 }}
              />
              {/* Mid glow */}
              <Circle
                center={[h.lat, h.lng]}
                radius={baseRadius * 1.5}
                pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: 0.1, weight: 0 }}
              />
              {/* Core circle */}
              <Circle
                center={[h.lat, h.lng]}
                radius={baseRadius}
                pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: 0.55, weight: 2.5, dashArray: undefined }}
                eventHandlers={{ click: () => setActiveHospital(h) }}
              >
                <Popup maxWidth={300} className="hospital-popup">
                  <div style={{ fontFamily: 'Sarabun, sans-serif', minWidth: 220 }}>
                    {/* Popup header */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                      <span style={{ fontWeight:800, fontSize:15, color:h.color }}>{h.name}</span>
                      <span style={{ padding:'3px 9px', borderRadius:8, fontSize:11, fontWeight:700, background:STATUS_BADGE[h.status].bg, color:STATUS_BADGE[h.status].text, border:`1px solid ${STATUS_BADGE[h.status].border}` }}>{h.status}</span>
                    </div>

                    {/* Rejection rate bar */}
                    <div style={{ marginBottom:10 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:11, color:'#6B9A87', fontWeight:600 }}>อัตราปฏิเสธสิทธิ์</span>
                        <span style={{ fontSize:13, fontWeight:900, color:h.color }}>{h.rate}%</span>
                      </div>
                      <div style={{ height:7, borderRadius:999, background:'#E8F0ED', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${(h.rate/50)*100}%`, background:h.color, borderRadius:999 }} />
                      </div>
                      {h.rate >= 25 && <p style={{ fontSize:10, color:'#EF4444', marginTop:3, fontWeight:600 }}>⚠️ เกินเกณฑ์ สปสช. 25%</p>}
                    </div>

                    <p style={{ fontSize:11, color:'#9BBCAF', fontWeight:700, marginBottom:6 }}>🏥 แผนกที่แนะนำ ({h.patients} ผู้ป่วย)</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                      {h.depts.map((d,i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 9px', borderRadius:9, background:`${d.color}12`, border:`1px solid ${d.color}35` }}>
                          <span style={{ fontSize:14 }}>{d.icon}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:d.color }}>{d.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Circle>
            </div>
          );
        })}
      </MapContainer>

      {/* Side panel — hospital cards */}
      <div style={{ display:'flex', gap:0, background:'#FAFCFB', borderTop:'1px solid #E8F0ED' }}>
        {HOSPITALS.map((h) => (
          <div key={h.name}
            onClick={() => setActiveHospital(h === activeHospital ? null : h)}
            style={{
              flex:1, padding:'12px 10px', cursor:'pointer',
              borderRight:'1px solid #E8F0ED',
              background: activeHospital?.name === h.name ? `${h.color}10` : 'transparent',
              borderBottom: activeHospital?.name === h.name ? `3px solid ${h.color}` : '3px solid transparent',
              transition:'all 0.2s',
            }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, marginBottom:4 }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:h.color, flexShrink:0 }} />
              <span style={{ fontSize:11, fontWeight:700, color:'#1A2E28', textAlign:'center' }}>{h.name}</span>
            </div>
            <div style={{ fontSize:20, fontWeight:900, color:h.color, textAlign:'center', lineHeight:1 }}>{h.rate}%</div>
            <div style={{ fontSize:10, color:'#9BBCAF', textAlign:'center', marginTop:2 }}>{h.patients} ผู้ป่วย</div>
          </div>
        ))}
      </div>

      {/* Department detail panel — expands when hospital selected */}
      {activeHospital && (
        <div style={{ padding:'16px 20px', background:'white', borderTop:`3px solid ${activeHospital.color}` }} className="anim-fade-up">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontWeight:800, fontSize:15, color:activeHospital.color }}>{activeHospital.name}</span>
              <span style={{ padding:'3px 10px', borderRadius:8, fontSize:11, fontWeight:700, background:STATUS_BADGE[activeHospital.status].bg, color:STATUS_BADGE[activeHospital.status].text }}>{activeHospital.status}</span>
            </div>
            <button onClick={() => setActiveHospital(null)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#9BBCAF' }}>✕</button>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {activeHospital.depts.map((d,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:12, background:`${d.color}12`, border:`1.5px solid ${d.color}40`, boxShadow:`0 2px 8px ${d.color}15` }}>
                <span style={{ fontSize:18 }}>{d.icon}</span>
                <span style={{ fontSize:13, fontWeight:700, color:d.color }}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
