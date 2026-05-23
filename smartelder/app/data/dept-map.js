export const DEPT_MAP = {
  I63: [
    { name: 'อายุรกรรมประสาทวิทยา', icon: '🧠', color: '#6366F1' },
    { name: 'กายภาพบำบัด',           icon: '🏃', color: '#0EA5E9' },
    { name: 'LTC / Home Care',       icon: '🏠', color: '#0F6E56' },
  ],
  I69: [
    { name: 'อายุรกรรมประสาทวิทยา', icon: '🧠', color: '#6366F1' },
    { name: 'กายภาพบำบัด',           icon: '🏃', color: '#0EA5E9' },
    { name: 'Palliative Care',       icon: '💜', color: '#8B5CF6' },
  ],
  I50: [
    { name: 'อายุรกรรมหัวใจ',        icon: '❤️', color: '#EC4899' },
    { name: 'อายุรกรรมทั่วไป',        icon: '🏥', color: '#0F6E56' },
    { name: 'LTC / Home Care',       icon: '🏠', color: '#17A97E' },
  ],
  F01: [
    { name: 'จิตเวชศาสตร์',          icon: '🧠', color: '#8B5CF6' },
    { name: 'คลินิกผู้สูงอายุ',       icon: '👴', color: '#F59E0B' },
    { name: 'LTC / Home Care',       icon: '🏠', color: '#0F6E56' },
  ],
  F03: [
    { name: 'จิตเวชศาสตร์',          icon: '🧠', color: '#8B5CF6' },
    { name: 'คลินิกผู้สูงอายุ',       icon: '👴', color: '#F59E0B' },
    { name: 'LTC / Home Care',       icon: '🏠', color: '#0F6E56' },
  ],
  S72: [
    { name: 'ศัลยกรรมกระดูก',        icon: '🦴', color: '#F59E0B' },
    { name: 'กายภาพบำบัด',           icon: '🏃', color: '#0EA5E9' },
  ],
  M17: [
    { name: 'ออร์โธปีดิกส์',         icon: '🦵', color: '#F97316' },
    { name: 'กายภาพบำบัด',           icon: '🏃', color: '#0EA5E9' },
  ],
  E11: [
    { name: 'อายุรกรรม',             icon: '💊', color: '#0F6E56' },
    { name: 'คลินิกเบาหวาน',         icon: '🩸', color: '#EF4444' },
  ],
};

export function getDepts(icdCodes) {
  const seen = new Set();
  const result = [];
  for (const code of (icdCodes || [])) {
    const prefix = code.slice(0, 3);
    for (const d of (DEPT_MAP[prefix] || [])) {
      if (!seen.has(d.name)) { seen.add(d.name); result.push(d); }
    }
  }
  return result;
}
