import { useEffect, useRef, useState } from 'react';
import { useHome } from '../../HomeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useHeroNote } from './heroNotes';

/* HMSflo hero demo — a working slice of the HMSflo OPD module, styled after
   the owner's HMSflo design (teal accent, 242px-style white sidebar, 60px top
   bar, 14px cards, status tones from the OPD slot board / queue / ED board).
   Patients, consultants and today's appointments are local demo state (reset
   on reload); two floating cards run a live OPD token queue and the ER
   tracking board. Everything renders at fixed heights (the frame is
   1040×580, the float lists always hold 4 rows, modals and the toast overlay
   the frame) so HeroSection's height probe stays exact while timers tick. */

const TEAL = '#0f766e';
const TINT = '#f0fdfa';
const BD = '#eef1f6';
const RULE = '#f2f4f8';
const MUT = '#9aa1ae';
const FAINT = '#aeb5c2';
const SEC = '#5b6b82';
const B = { fontFamily: 'inherit', cursor: 'pointer', border: 0, background: 'none', padding: 0, color: 'inherit', textAlign: 'start', lineHeight: 1.3 };
const ROW = { display: 'flex', alignItems: 'center' };
const ELL = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const BLK = { display: 'block' };
const LAB = { fontSize: '9px', fontWeight: 700, letterSpacing: '.09em', color: FAINT };
const pill = (fg, bg) => ({ fontSize: '9px', fontWeight: 700, letterSpacing: '.03em', color: fg, background: bg, borderRadius: '5px', padding: '2px 6px', flex: '0 0 auto', whiteSpace: 'nowrap', lineHeight: 1.35 });
const BTN = { ...B, ...ROW, gap: '6px', height: '32px', padding: '0 13px', borderRadius: '9px', background: TEAL, color: '#fff', fontSize: '11.5px', fontWeight: 600, flex: '0 0 auto', whiteSpace: 'nowrap' };
const GHOST = { ...BTN, background: '#fff', color: '#3d4757', border: '1px solid #e6eaf2' };
const CARD = { background: '#fff', border: `1px solid ${BD}`, borderRadius: '14px' };
const INP = { width: '100%', height: '36px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#e2e8f0', borderRadius: '10px', padding: '0 11px', background: '#fcfefe', fontFamily: 'inherit', fontSize: '12px', color: '#1a1d23', boxSizing: 'border-box' };
const HUES = [['#ddf4f0', TEAL], ['#f1edfe', '#7a5af8'], ['#fff6e5', '#b45309'], ['#e0f2fe', '#0284c7'], ['#feeceb', '#dc2626'], ['#e7f8ee', '#0f8a6d']];
const chip = (on) => ({ ...B, height: '30px', padding: '0 11px', borderRadius: '9px', fontSize: '11px', border: `1px solid ${on ? '#99f6e4' : BD}`, background: on ? TINT : '#fff', color: on ? TEAL : '#64748b', fontWeight: on ? 600 : 500, whiteSpace: 'nowrap' });

const IC = {
  plus: 'M12 5v14M5 12h14',
  search: 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-4.2-4.2',
  addUser: 'M6.6 8a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0-6.8 0M4 20c0-3.4 2.7-5.6 6-5.6 1.2 0 2.3.3 3.2.8M17 14.5v5M14.5 17h5',
  users: 'M5.6 8a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0-6.8 0M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 4.6a3.2 3.2 0 0 1 0 6.3M18 14.8c1.9.6 3 2.4 3 5.2',
  steth: 'M6 3v5a4 4 0 0 0 8 0V3M10 12v2.5a5 5 0 0 0 10 0V12M18 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
  cal: 'M5.5 5h13A2.5 2.5 0 0 1 21 7.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-11A2.5 2.5 0 0 1 5.5 5zM8 3v4M16 3v4M3 10.5h18',
  queue: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  amb: 'M2 16V7h11v9M13 10h4.5l3.5 3.5V16h-7.5M7.5 9.5v4M5.5 11.5h4M4.7 17.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M14.7 17.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  x: 'M6 6l12 12M18 6L6 18',
  hosp: 'M5 3h14v18H5zM12 8v6M9 11h6',
  check: 'M5 12.5l4.5 4.5L19 7',
  next: 'M5 5l7 7-7 7M13 5l7 7-7 7',
};
function Ic({ d, s = 15, w = 2, style }) {
  'use no memo';
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: '0 0 auto', ...style }}><path d={d} /></svg>;
}

const inits = (n) => n.replace(/^Dr\.?\s*/, '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const toM = (s) => { const [h, m] = s.split(':'); return +h * 60 + +m; };
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const rs = (n) => `Rs ${Number(n).toLocaleString('en-US')}`;
const perDay = (c) => Math.max(0, Math.floor((toM(c.to) - toM(c.from)) / c.slot));
const slotsOf = (c) => (c.days[0] ? Array.from({ length: Math.min(8, perDay(c)) }, (_, i) => hhmm(toM(c.from) + i * c.slot)) : []);
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SPECS = ['Cardiology', 'Gynecology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'ENT', 'Neurology', 'General Medicine'];
const GROUPS = ['General', 'Corporate', 'Panel', 'Staff'];
const BLOODS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

/* ---- seed data (fictional) ---- */
const P0 = [
  ['Hamza Tariq', 'M', 34, 'B+', 'MR-104233', '0300 4127781', 'General', '12 Sep'],
  ['Fatima Noor', 'F', 29, 'O+', 'MR-104251', '0321 5580934', 'Corporate', '03 Sep'],
  ['Usman Ali', 'M', 46, 'A+', 'MR-104262', '0333 1904476', 'General', '21 Aug'],
  ['Ayesha Siddiqui', 'F', 52, 'AB+', 'MR-104198', '0345 7712208', 'Panel', '18 Sep'],
  ['Zain Mahmood', 'M', 8, 'O-', 'MR-104277', '0301 6635129', 'General', '09 Sep'],
  ['Mehwish Anwar', 'F', 38, 'B-', 'MR-104180', '0312 4489021', 'Staff', '15 Sep'],
  ['Imran Baig', 'M', 67, 'A-', 'MR-104145', '0300 9023317', 'Panel', '26 Sep'],
  ['Hira Saleem', 'F', 24, 'O+', 'MR-104290', '0322 8746612', 'General', '—'],
].map(([name, g, age, blood, mr, mob, grp, last]) => ({ name, g, age, blood, mr, mob, grp, last }));
const C0 = [
  { id: 'CON-00004', name: 'Dr. Sana Iqbal', spec: 'Cardiology', room: '204', fee: 3000, slot: 15, from: '09:00', to: '13:00', days: [1, 1, 1, 1, 1, 0, 0], type: 'Internal' },
  { id: 'CON-00006', name: 'Dr. Bilal Ahmed', spec: 'Gynecology', room: '112', fee: 2500, slot: 15, from: '09:00', to: '12:00', days: [1, 1, 0, 1, 0, 1, 0], type: 'Internal' },
  { id: 'CON-00007', name: 'Dr. Hira Khan', spec: 'Orthopedics', room: '118', fee: 2500, slot: 15, from: '09:00', to: '12:00', days: [1, 0, 1, 0, 1, 0, 0], type: 'Internal' },
  { id: 'CON-00009', name: 'Dr. Kamran Shah', spec: 'Pediatrics', room: '106', fee: 2000, slot: 20, from: '10:00', to: '13:00', days: [1, 1, 1, 1, 1, 1, 0], type: 'External' },
].map((c, i) => ({ ...c, hue: i }));
const A0 = [
  ['CON-00004', '09:00', 'MR-104233', 'Follow-up', 'ARRIVED'], ['CON-00004', '09:15', 'MR-104290', 'New', 'BOOKED'],
  ['CON-00004', '09:45', 'MR-104145', 'Follow-up', 'BOOKED'], ['CON-00006', '09:30', 'MR-104180', 'New', 'ARRIVED'],
  ['CON-00006', '10:00', 'MR-104251', 'Follow-up', 'BOOKED'], ['CON-00007', '09:15', 'MR-104198', 'Follow-up', 'ARRIVED'],
  ['CON-00007', '10:15', 'MR-104262', 'New', 'BOOKED'], ['CON-00009', '10:00', 'MR-104277', 'New', 'BOOKED'],
].map(([con, time, mr, type, st], i) => ({ id: `APT-00${131 + i}`, con, time, mr, type, st }));
/* appointment status tones — OpdSchedule's BOOKED / ARRIVED */
const TONE = { BOOKED: ['#f1fbf9', '#c3ebe5', TEAL, TINT], ARRIVED: ['#faf5ff', '#e9d5ff', '#6b21a8', '#f3e8ff'] };

const QPOOL = [['Maham Zafar', 'Dr. Sana Iqbal'], ['Ali Hassan', 'Dr. Hira Khan'], ['Sadia Karim', 'Dr. Bilal Ahmed'], ['Arham Qureshi', 'Dr. Kamran Shah'], ['Rabia Saleem', 'Dr. Sana Iqbal'], ['Taimoor Aslam', 'Dr. Hira Khan'], ['Iqra Nadeem', 'Dr. Kamran Shah'], ['Bilal Yousaf', 'Dr. Bilal Ahmed']];
const Q0 = {
  rows: [['Mehwish Anwar', 'Dr. Bilal Ahmed', 'done'], ['Hamza Tariq', 'Dr. Sana Iqbal', 'with'], ['Ayesha Siddiqui', 'Dr. Hira Khan', 'wait'], ['Imran Baig', 'Dr. Sana Iqbal', 'wait']]
    .map(([n, d, st], i) => ({ tk: 40 + i, n, d, st })),
  done: 17, seq: 44, pi: 0,
};
const nextQ = (q) => {
  const [, w, a, b] = q.rows;
  const [n, d] = QPOOL[q.pi % QPOOL.length];
  return { rows: [{ ...w, st: 'done' }, { ...a, st: 'with' }, b, { tk: q.seq, n, d, st: 'wait' }], done: q.done + 1, seq: q.seq + 1, pi: q.pi + 1 };
};
const QST = { wait: ['#5b6b82', '#f1f3f9', 'Waiting'], with: ['#6b21a8', '#f3e8ff', 'With doctor'], done: ['#15803d', '#dcfce7', 'Done'] };

/* ED — ESI 1–5 hue / tint / target minutes (EdTrackingBoard's ESI table) */
const ESI = { 1: ['#7f1d1d', '#fee2e2', 0], 2: ['#c2410c', '#ffedd5', 10], 3: ['#b45309', '#fef3c7', 30], 4: ['#15803d', '#dcfce7', 60], 5: ['#1d4ed8', '#dbeafe', 120] };
const STAGE = [['Triage', '#c2410c', '#ffedd5'], ['Treatment', TEAL, TINT], ['Disposition', '#6b21a8', '#f3e8ff']];
const ER0 = [
  ['Tahir Javed', 'Shortness of breath', 1, 'ER-R1', 1, 2292], ['Saad Rehman', 'Chest pain, left arm', 2, 'ER-B2', 0, 845],
  ['Zainab Sultan', 'Abdominal pain, right side', 3, 'ER-B4', 1, 1530], ['Waleed Akram', 'Fall, wrist swelling', 4, 'ER-B5', 2, 3010],
].map(([n, cc, esi, bay, s, el], i) => ({ id: i, n, cc, esi, bay, s, b: -el }));
const ERPOOL = [['Mariam Khalid', 'Seizure at home', 2, 'ER-B1'], ['Kashif Riaz', 'Laceration, left forearm', 4, 'ER-B6'], ['Noor Fatima', 'Minor burn, right hand', 5, 'ER-B3'], ['Faisal Mehmood', 'High fever, vomiting', 3, 'ER-B2']];
const clock = (s) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const ss = String(s % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`; };

/* Scroll `el` into view inside `box` only (never the frame's overflow:hidden
   ancestors, which scrollIntoView would also move). Works under the phone
   transform:scale by converting screen px back to layout px. */
function reveal(box, el) {
  if (!box || !el) return;
  const b = box.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const k = b.width / box.offsetWidth || 1;
  if (r.top < b.top || r.bottom > b.bottom) box.scrollTop += (r.top - b.top) / k - 8;
  if (r.left < b.left || r.right > b.right) box.scrollLeft += (r.left + r.width / 2 - b.left - b.width / 2) / k;
}

/* Dialog contained in the demo frame: focus moves in on open and back on
   close, Tab / Shift+Tab cycle inside, Esc and a backdrop click close it. */
function Modal({ title, sub, badge, icon, tone, onClose, onSubmit, foot, children }) {
  'use no memo';
  const { t } = useLanguage();
  const ref = useRef(null);
  const [w, setW] = useState(560);
  useEffect(() => {
    const prev = document.activeElement;
    // Phones: the scaled frame scrolls sideways — fit the dialog to the part in view.
    const wrap = ref.current?.closest('.hm-scale-scroll-wrap');
    const k = wrap ? wrap.getBoundingClientRect().width / wrap.offsetWidth || 1 : 1;
    const frame = ref.current?.parentElement?.parentElement;
    const fk = frame ? frame.getBoundingClientRect().width / frame.offsetWidth || 1 : 1;
    if (wrap && wrap.scrollWidth > wrap.clientWidth + 1) setW(Math.min(560, Math.floor((wrap.clientWidth * k) / fk) - 24));
    ref.current?.querySelector('input,select,[data-first]')?.focus();
    return () => { if (prev && document.contains(prev)) prev.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => { reveal(ref.current?.closest('.hm-scale-scroll-wrap'), ref.current); }, [w]);
  const onKey = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    if (e.key !== 'Tab') return;
    const f = [...ref.current.querySelectorAll('button:not([disabled]),input,select')];
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  };
  return (
    <div onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(15,23,42,.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', animation: 'hmsFade .14s ease both' }}>
      <form ref={ref} role="dialog" aria-modal="true" aria-label={title} noValidate onKeyDown={onKey} onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ width: `${w}px`, maxHeight: '100%', background: '#fff', borderRadius: '18px', boxShadow: '0 26px 64px rgba(16,24,40,.26)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'hmsPop .18s ease both' }}>
        <div style={{ ...ROW, gap: '11px', padding: '13px 18px', borderBottom: '1px solid #f1f5f9', flex: '0 0 auto' }}>
          <span style={{ ...ROW, justifyContent: 'center', width: '32px', height: '32px', borderRadius: '10px', background: tone[0], color: tone[1] }}><Ic d={icon} s={16} w={1.9} /></span>
          <span style={{ flex: 1, minWidth: 0 }}><span style={{ ...BLK, fontSize: '14.5px', fontWeight: 600 }}>{title}</span><span style={{ ...BLK, ...ELL, fontSize: '10.5px', color: '#94a3b8' }}>{sub}</span></span>
          {badge && <span style={{ ...pill(TEAL, TINT), fontSize: '10px', padding: '4px 8px' }}>{badge}</span>}
          <button type="button" onClick={onClose} aria-label={t('Close')} style={{ ...B, ...ROW, justifyContent: 'center', width: '30px', height: '30px', borderRadius: '9px', background: '#f1f5f9', color: '#64748b' }}><Ic d={IC.x} s={14} w={2.4} /></button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 18px 16px' }}>{children}</div>
        <div style={{ ...ROW, gap: '8px', padding: '11px 18px', borderTop: '1px solid #f1f5f9', background: '#fbfcfe', flex: '0 0 auto' }}>{foot}</div>
      </form>
    </div>
  );
}

function Field({ label, req, err, children, style }) {
  'use no memo';
  const { t } = useLanguage();
  return (
    <label style={{ ...BLK, minWidth: 0, ...style }}>
      <span style={{ ...BLK, fontSize: '10px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>{t(label)}{req && <span style={{ color: '#ef4444' }}> *</span>}</span>
      {children}
      {err && <span role="alert" style={{ ...BLK, fontSize: '10px', fontWeight: 600, color: '#ef4444', marginTop: '3px' }}>{t(err)}</span>}
    </label>
  );
}
function Chips({ label, req, bare, opts, val, set, fmt }) {
  'use no memo';
  const { t } = useLanguage();
  return (
    <div role="group" aria-label={t(label)}>
      {!bare && <span style={{ ...BLK, fontSize: '10px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>{t(label)}{req && <span style={{ color: '#ef4444' }}> *</span>}</span>}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {opts.map((o, i) => (<button type="button" key={o} aria-pressed={Array.isArray(val) ? !!val[i] : val === o} onClick={() => set(o, i)} style={{ ...chip(Array.isArray(val) ? val[i] : val === o), height: '32px' }}>{fmt ? fmt(o) : o}</button>))}
      </div>
    </div>
  );
}
const G2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px', marginTop: '11px' };
const ageOf = (iso) => { if (!iso) return null; const d = new Date(iso); const n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a >= 0 && a < 130 ? a : null; };

function PatientModal({ mr, onClose, onSave }) {
  'use no memo';
  const { t } = useLanguage();
  const [f, setF] = useState({ first: '', last: '', g: '', dob: '', mob: '', blood: '', grp: 'General' });
  const [tried, setTried] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target ? e.target.value : e });
  const digits = f.mob.replace(/\D/g, '').replace(/^0/, '');
  const err = {
    first: !f.first.trim() && 'Enter a first name',
    last: !f.last.trim() && 'Enter a last name',
    g: !f.g && 'Pick a gender',
    mob: !/^3\d{9}$/.test(digits) && 'Enter a 10-digit mobile, e.g. 300 1234567',
  };
  const ok = !Object.values(err).some(Boolean);
  const age = ageOf(f.dob);
  const save = (book) => {
    setTried(true);
    if (!ok) { document.getElementById(`hms-p-${Object.keys(err).find((k) => err[k])}`)?.focus(); return; }
    onSave({ name: `${f.first.trim()} ${f.last.trim()}`, g: f.g, age: age ?? '—', blood: f.blood || '—', mr, mob: `0${digits.slice(0, 3)} ${digits.slice(3)}`, grp: f.grp, last: '—' }, book);
  };
  const bd = (k) => ({ ...INP, borderColor: tried && err[k] ? '#fca5a5' : '#e2e8f0' });
  return (
    <Modal title={t('Register patient')} sub={t('Patient register · the MR number is issued on save')} badge={mr} icon={IC.addUser} tone={['#dcfce7', '#15803d']} onClose={onClose} onSubmit={() => save(false)}
      foot={<>
        <span style={{ flex: 1, fontSize: '10.5px', color: MUT }}>{t('Fields marked * are required')}</span>
        <button type="button" onClick={onClose} style={GHOST}>{t('Cancel')}</button>
        <button type="button" onClick={() => save(true)} style={{ ...GHOST, color: TEAL, borderColor: '#99f6e4', background: TINT }}>{t('Save & book')}</button>
        <button type="submit" style={BTN}>{t('Register patient')}</button>
      </>}>
      <div style={LAB}>{t('IDENTITY')}</div>
      <div style={G2}>
        <Field label="First name" req err={tried && err.first}><input id="hms-p-first" value={f.first} onChange={set('first')} placeholder="Ali" autoComplete="off" aria-invalid={!!(tried && err.first)} style={bd('first')} /></Field>
        <Field label="Last name" req err={tried && err.last}><input id="hms-p-last" value={f.last} onChange={set('last')} placeholder="Raza" autoComplete="off" aria-invalid={!!(tried && err.last)} style={bd('last')} /></Field>
      </div>
      <div style={G2}>
        <div>
          <Chips label="Gender" req opts={['M', 'F']} val={f.g} set={set('g')} fmt={(o) => t(o === 'M' ? 'Male' : 'Female')} />
          {tried && err.g && <span id="hms-p-g" tabIndex={-1} role="alert" style={{ ...BLK, fontSize: '10px', fontWeight: 600, color: '#ef4444', marginTop: '3px' }}>{t(err.g)}</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px', gap: '8px' }}>
          <Field label="Date of birth"><input type="date" value={f.dob} onChange={set('dob')} max={new Date().toISOString().slice(0, 10)} style={{ ...INP, padding: '0 8px' }} /></Field>
          <div><span style={{ ...BLK, fontSize: '10px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>{t('Age')}</span><div style={{ ...INP, ...ROW, background: '#f8fafc', fontWeight: 600, color: age == null ? FAINT : '#1a1d23' }}>{age == null ? '—' : age}</div></div>
        </div>
      </div>
      <div style={{ ...LAB, marginTop: '16px' }}>{t('CONTACT & GROUP')}</div>
      <div style={G2}>
        <Field label="Mobile" req err={tried && err.mob}>
          <span style={{ ...INP, ...ROW, padding: 0, overflow: 'hidden', direction: 'ltr', borderColor: tried && err.mob ? '#fca5a5' : '#e2e8f0' }}>
            <span style={{ padding: '0 9px', height: '100%', ...ROW, background: '#f1f5f9', color: '#475569', fontWeight: 600, borderInlineEnd: '1px solid #e2e8f0' }}>+92</span>
            <input id="hms-p-mob" value={f.mob} onChange={set('mob')} placeholder="300 1234567" inputMode="tel" maxLength={13} autoComplete="off" aria-invalid={!!(tried && err.mob)} style={{ ...INP, borderWidth: 0, height: '34px', background: 'transparent' }} />
          </span>
        </Field>
        <Chips label="Patient group" opts={GROUPS} val={f.grp} set={set('grp')} fmt={t} />
      </div>
      <div style={{ marginTop: '11px' }}><Chips label="Blood group" opts={BLOODS} val={f.blood} set={(o) => setF({ ...f, blood: f.blood === o ? '' : o })} /></div>
    </Modal>
  );
}

function ConsultantModal({ id, onClose, onSave }) {
  'use no memo';
  const { t } = useLanguage();
  const [f, setF] = useState({ name: '', spec: '', type: 'Internal', room: '', from: '09:00', to: '13:00', slot: 15, fee: '', days: [1, 1, 1, 1, 1, 0, 0] });
  const [tried, setTried] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e && e.target ? e.target.value : e });
  const nm = f.name.trim().replace(/^Dr\.?\s*/i, '');
  const span = toM(f.to) - toM(f.from);
  const err = {
    name: nm.length < 3 && 'Enter the consultant’s name',
    spec: !f.spec && 'Pick a specialization',
    to: span <= 0 && 'Session must end after it starts',
    fee: !(+f.fee > 0) && 'Enter the consultation fee',
    days: !f.days.some(Boolean) && 'Pick at least one day',
  };
  const ok = !Object.values(err).some(Boolean);
  const day = span > 0 ? Math.floor(span / f.slot) : 0;
  const week = day * f.days.filter(Boolean).length;
  const save = () => {
    setTried(true);
    if (!ok) { document.getElementById(`hms-c-${Object.keys(err).find((k) => err[k])}`)?.focus(); return; }
    onSave({ id, name: `Dr. ${nm}`, spec: f.spec, room: f.room.trim() || '210', fee: +f.fee, slot: +f.slot, from: f.from, to: f.to, days: f.days, type: f.type });
  };
  const bd = (k) => ({ ...INP, borderColor: tried && err[k] ? '#fca5a5' : '#e2e8f0' });
  return (
    <Modal title={t('Add consultant')} sub={t('One save creates the profile, weekly availability and pricing')} badge={id} icon={IC.steth} tone={['#ddf4f0', TEAL]} onClose={onClose} onSubmit={save}
      foot={<>
        <span style={{ flex: 1, fontSize: '11px', fontWeight: 600, color: day ? TEAL : MUT }}>{day ? `${day} ${t('slots a day')} · ${week} ${t('a week')}` : t('Set the session to see capacity')}</span>
        <button type="button" onClick={onClose} style={GHOST}>{t('Cancel')}</button>
        <button type="submit" style={BTN}>{t('Add consultant')}</button>
      </>}>
      <div style={{ ...G2, marginTop: 0 }}>
        <Field label="Consultant name" req err={tried && err.name}><input id="hms-c-name" value={f.name} onChange={set('name')} placeholder="Dr. Nadia Hussain" autoComplete="off" aria-invalid={!!(tried && err.name)} style={bd('name')} /></Field>
        <Field label="Specialization" req err={tried && err.spec}>
          <select id="hms-c-spec" value={f.spec} onChange={set('spec')} aria-invalid={!!(tried && err.spec)} style={bd('spec')}>
            <option value="">{t('Select…')}</option>
            {SPECS.map((s) => <option key={s} value={s}>{t(s)}</option>)}
          </select>
        </Field>
      </div>
      <div style={G2}>
        <Chips label="Type" opts={['Internal', 'External']} val={f.type} set={set('type')} fmt={t} />
        <Field label="Room"><input value={f.room} onChange={set('room')} placeholder="210" autoComplete="off" style={INP} /></Field>
      </div>
      <div style={{ ...LAB, marginTop: '16px' }}>{t('AVAILABILITY')}</div>
      <div style={{ marginTop: '8px' }}>
        <Chips label="Days worked" opts={DAYS} val={f.days} set={(o, i) => setF({ ...f, days: f.days.map((v, j) => (j === i ? (v ? 0 : 1) : v)) })} fmt={t} />
        {tried && err.days && <span id="hms-c-days" tabIndex={-1} role="alert" style={{ ...BLK, fontSize: '10px', fontWeight: 600, color: '#ef4444', marginTop: '3px' }}>{t(err.days)}</span>}
      </div>
      <div style={{ ...G2, gridTemplateColumns: '1fr 1fr 1.4fr' }}>
        <Field label="Session from"><select value={f.from} onChange={set('from')} style={INP}>{HOURS.slice(0, -1).map((h) => <option key={h}>{h}</option>)}</select></Field>
        <Field label="Session to" err={tried && err.to}><select id="hms-c-to" value={f.to} onChange={set('to')} style={bd('to')}>{HOURS.slice(1).map((h) => <option key={h}>{h}</option>)}</select></Field>
        <Chips label="Slot length (min)" opts={[10, 15, 20, 30]} val={f.slot} set={set('slot')} />
      </div>
      <div style={{ ...LAB, marginTop: '16px' }}>{t('PRICING')}</div>
      <div style={G2}>
        <Field label="Consultation fee (Rs)" req err={tried && err.fee}><input id="hms-c-fee" value={f.fee} onChange={(e) => set('fee')(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="2500" autoComplete="off" aria-invalid={!!(tried && err.fee)} style={bd('fee')} /></Field>
        <div><span style={{ ...BLK, fontSize: '10px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>{t('Follow-up fee')}</span><div style={{ ...INP, ...ROW, background: '#f8fafc', color: SEC }}>{+f.fee > 0 ? rs(Math.round(f.fee * 0.006) * 100) : '—'}<span style={{ marginInlineStart: 'auto', fontSize: '10px', color: FAINT }}>{t('60% within 14 days')}</span></div></div>
      </div>
    </Modal>
  );
}

function BookModal({ pre, pts, cons, appts, id, onClose, onSave }) {
  'use no memo';
  const { t } = useLanguage();
  const [mr, setMr] = useState(pre.mr || '');
  const [con, setCon] = useState(pre.con || '');
  const [time, setTime] = useState(pre.time || '');
  const [type, setType] = useState('New');
  const c = cons.find((x) => x.id === con);
  const taken = (cid, tm) => appts.some((a) => a.con === cid && a.time === tm);
  const free = (x) => slotsOf(x).filter((tm) => !taken(x.id, tm)).length;
  const p = pts.find((x) => x.mr === mr);
  const fee = c ? (type === 'Follow-up' ? Math.round(c.fee * 0.006) * 100 : c.fee) : 0;
  const ok = p && c && time && !taken(con, time);
  const step = (n, label, done) => (
    <div style={{ ...ROW, gap: '7px', margin: n > 1 ? '14px 0 7px' : '0 0 7px' }}>
      <span style={{ ...ROW, justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', fontSize: '10px', fontWeight: 700, background: done ? TEAL : '#eef1f6', color: done ? '#fff' : SEC }}>{done ? <Ic d={IC.check} s={11} w={3} /> : n}</span>
      <span style={{ fontSize: '11.5px', fontWeight: 600 }}>{t(label)}</span>
    </div>
  );
  return (
    <Modal title={t('Book appointment')} sub={t('Today · OPD')} badge={id} icon={IC.cal} tone={['#ddf4f0', TEAL]} onClose={onClose} onSubmit={() => ok && onSave({ id, con, time, mr, type, st: 'BOOKED' })}
      foot={<>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ ...BLK, ...ELL, fontSize: '11px', fontWeight: 600 }}>{ok ? `${p.name} · ${c.name} · ${time}` : t('Pick a patient, a consultant and a free slot')}</span>
          <span style={{ ...BLK, fontSize: '10.5px', color: MUT }}>{t('Payable')} <b style={{ color: '#1a1d23' }}>{c ? rs(fee) : '—'}</b></span>
        </span>
        <button type="button" onClick={onClose} style={GHOST}>{t('Cancel')}</button>
        <button type="submit" disabled={!ok} style={{ ...BTN, opacity: ok ? 1 : 0.45, cursor: ok ? 'pointer' : 'not-allowed' }}>{t('Confirm booking')}</button>
      </>}>
      {step(1, 'Patient', !!p)}
      <select aria-label={t('Patient')} value={mr} onChange={(e) => setMr(e.target.value)} style={INP}>
        <option value="">{t('Select a patient…')}</option>
        {pts.map((x) => <option key={x.mr} value={x.mr}>{`${x.name} — ${x.mr}`}</option>)}
      </select>
      {step(2, 'Consultant', !!c)}
      <div role="group" aria-label={t('Consultant')} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {cons.map((x) => {
          const on = x.id === con; const n = free(x);
          return (
            <button type="button" key={x.id} aria-pressed={on} disabled={!n} onClick={() => { setCon(x.id); setTime(''); }} style={{ ...B, ...ROW, gap: '8px', padding: '7px 9px', borderRadius: '10px', border: `1px solid ${on ? '#5fc4b8' : BD}`, background: on ? TINT : '#fff', opacity: n ? 1 : 0.5, cursor: n ? 'pointer' : 'not-allowed' }}>
              <span style={{ ...ROW, justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: HUES[x.hue % 6][0], color: HUES[x.hue % 6][1], fontSize: '10px', fontWeight: 700 }}>{inits(x.name)}</span>
              <span style={{ flex: 1, minWidth: 0 }}><span style={{ ...BLK, ...ELL, fontSize: '11.5px', fontWeight: 600 }}>{x.name}</span><span style={{ ...BLK, ...ELL, fontSize: '10px', color: MUT }}>{t(x.spec)}</span></span>
              <span style={pill(n ? TEAL : SEC, n ? '#e6f7f4' : '#f1f3f9')}>{n ? `${n} ${t('open')}` : t('No session')}</span>
            </button>
          );
        })}
      </div>
      {step(3, 'Slot', !!(c && time))}
      {c ? (
        <div role="group" aria-label={t('Slot')} style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '5px' }}>
          {slotsOf(c).map((tm) => { const x = taken(con, tm); const on = tm === time; return (<button type="button" key={tm} disabled={x} aria-pressed={on} onClick={() => setTime(tm)} style={{ ...B, height: '32px', borderRadius: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', border: `1px solid ${on ? TEAL : BD}`, background: on ? TEAL : x ? '#f6f7fb' : '#fff', color: on ? '#fff' : x ? '#c7cdd8' : '#1a1d23', textDecoration: x ? 'line-through' : 'none', cursor: x ? 'not-allowed' : 'pointer' }}>{tm}</button>); })}
        </div>
      ) : <div style={{ fontSize: '11px', color: FAINT, padding: '8px 0' }}>{t('Pick a consultant to see today’s slots')}</div>}
      {step(4, 'Visit type', true)}
      <Chips label="Visit type" bare opts={['New', 'Follow-up', 'Walk-in']} val={type} set={setType} fmt={t} />
    </Modal>
  );
}

/* ---- floating card: live OPD token queue ---- */
function QueueCard({ q, onNext }) {
  'use no memo';
  const { t } = useLanguage();
  return (
    <div className="hm-float" style={{ position: 'absolute', top: '-126px', insetInlineEnd: '-24px', zIndex: 8, width: '262px', ...CARD, borderRadius: '18px', boxShadow: '0 40px 78px -24px rgba(15,23,41,.42)', padding: '13px 13px 12px', animation: 'floatY 7s ease-in-out infinite', textAlign: 'start' }}>
      <div style={{ ...ROW, gap: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#12b76a', animation: 'pulseDot 1.8s ease-in-out infinite', flex: '0 0 auto' }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f1729', lineHeight: 1.25 }}>{t('Live OPD queue')}</span>
        <button type="button" onClick={onNext} style={{ ...BTN, height: '28px', padding: '0 10px', fontSize: '11px', gap: '5px' }}><Ic d={IC.next} s={12} w={2.4} />{t('Call next')}</button>
      </div>
      <div aria-live="polite" style={{ fontSize: '10px', color: MUT, margin: '3px 0 8px', lineHeight: 1.3 }}>{`${q.done} ${t('completed today')} · ${t('avg wait')} 14 ${t('min')}`}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {q.rows.map((r, i) => {
          const [fg, bg, label] = QST[r.st];
          return (
            <div key={r.tk} style={{ ...ROW, gap: '8px', height: '34px', padding: '0 8px', borderRadius: '10px', background: r.st === 'with' ? '#faf8ff' : '#fbfcfe', border: `1px solid ${r.st === 'with' ? '#e9d5ff' : RULE}`, opacity: r.st === 'done' ? 0.62 : 1, animation: i === 3 ? 'hmsIn .35s ease both' : undefined }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: TEAL, background: TINT, borderRadius: '6px', padding: '2px 5px', fontVariantNumeric: 'tabular-nums', flex: '0 0 auto', lineHeight: 1.3 }}>{`T-0${r.tk}`}</span>
              <span style={{ flex: 1, minWidth: 0 }}><span style={{ ...BLK, ...ELL, fontSize: '11.5px', fontWeight: 600, lineHeight: 1.2 }}>{r.n}</span><span style={{ ...BLK, ...ELL, fontSize: '9.5px', color: MUT, lineHeight: 1.2 }}>{r.d}</span></span>
              <span style={pill(fg, bg)}>{t(label)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- floating card: ER tracking board (own 1s clock, so only it re-renders) ---- */
function ErCard() {
  'use no memo';
  const { t } = useLanguage();
  const [sec, setSec] = useState(0);
  const [er, setEr] = useState({ cases: ER0, pi: 0 });
  useEffect(() => { const id = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(id); }, []);
  const advance = (id) => setEr((st) => {
    let pi = st.pi;
    const cases = st.cases.map((c) => {
      if (c.id !== id) return c;
      if (c.s < 2) return { ...c, s: c.s + 1 };
      const [n, cc, esi, bay] = ERPOOL[pi++ % ERPOOL.length];
      return { id: 10 + pi, n, cc, esi, bay, s: 0, b: sec };
    });
    return { cases, pi };
  });
  const list = [...er.cases].sort((a, b) => a.esi - b.esi || a.b - b.b);
  const late = list.filter((c) => c.s === 0 && (sec - c.b) / 60 > ESI[c.esi][2]).length;
  return (
    <div className="hm-float" style={{ position: 'absolute', bottom: '-40px', insetInlineStart: '-26px', zIndex: 8, width: '238px', ...CARD, borderRadius: '18px', boxShadow: '0 40px 78px -24px rgba(15,23,41,.42)', padding: '13px 12px 11px', animation: 'floatY 7.5s ease-in-out infinite', textAlign: 'start' }}>
      <div style={{ ...ROW, gap: '8px' }}>
        <span style={{ ...ROW, justifyContent: 'center', width: '26px', height: '26px', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c' }}><Ic d={IC.amb} s={15} /></span>
        <span style={{ flex: 1, minWidth: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f1729', lineHeight: 1.25 }}>{t('ER tracking')}</span>
        <span style={pill('#b91c1c', '#fef2f2')}>{t('LIVE')}</span>
      </div>
      <div style={{ fontSize: '10px', color: late ? '#b91c1c' : MUT, margin: '4px 0 8px', lineHeight: 1.3 }}>{`${list.length} ${t('in department')} · ${late} ${t('past ESI target')}`}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {list.map((c) => {
          const [hue, tint, target] = ESI[c.esi]; const [sl, sf, sb] = STAGE[c.s]; const el = sec - c.b;
          return (
            <button type="button" key={c.id} onClick={() => advance(c.id)} title={t(c.s < 2 ? 'Move to the next stage' : 'Close the case')} style={{ ...B, ...ROW, gap: '8px', height: '42px', padding: '0 8px 0 6px', borderRadius: '11px', border: `1px solid ${RULE}`, borderInlineStart: `3px solid ${hue}`, background: '#fff', animation: el < 2 ? 'hmsIn .35s ease both' : undefined }}>
              <span aria-label={`ESI ${c.esi}`} style={{ width: '28px', height: '32px', borderRadius: '8px', background: tint, color: hue, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', lineHeight: 1 }}><span style={{ fontSize: '6.5px', fontWeight: 700, letterSpacing: '.08em' }}>ESI</span><span style={{ fontSize: '14px', fontWeight: 700, marginTop: '1px' }}>{c.esi}</span></span>
              <span style={{ flex: 1, minWidth: 0 }}><span style={{ ...BLK, ...ELL, fontSize: '11.5px', fontWeight: 600, lineHeight: 1.2 }}>{c.n}</span><span style={{ ...BLK, ...ELL, fontSize: '9.5px', color: MUT, lineHeight: 1.25 }}>{`${c.bay} · ${t(c.cc)}`}</span></span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flex: '0 0 auto' }}>
                <span style={pill(sf, sb)}>{t(sl)}</span>
                <span style={{ fontSize: '9.5px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: c.s === 0 && el / 60 > target ? '#b91c1c' : SEC, lineHeight: 1.1, direction: 'ltr' }}>{clock(el)}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ ...ELL, fontSize: '9.5px', color: FAINT, marginTop: '6px', lineHeight: 1.3 }}>{t('Tap a case to move it along')}</div>
    </div>
  );
}

/* Hand-drawn note (text only); its arrow is a separate <Curve> so the tip can
   be pinned to the exact element it points at. */
const Anno = ({ text, sub, style }) => (
  <div className="hm-annotate" style={{ position: 'absolute', zIndex: 60, pointerEvents: 'none', ...style }}>
    <div style={{ fontFamily: 'Caveat,cursive', fontWeight: 700, fontSize: '28px', letterSpacing: '.4px', color: '#1a56db', lineHeight: 1.05 }}>{text}</div>
    {sub && <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: '12px', fontWeight: 500, color: '#1a56db', lineHeight: 1.35, marginTop: '3px' }}>{sub}</div>}
  </div>
);
/* Cubic arrow [start, c1, c2, end] in its own w×h box, positioned so `end`
   lands on `tip` (frame coords). The head follows the curve's end tangent;
   RTL mirrors both the position (inline-start) and the drawing (.anno-arrow). */
const Curve = ({ tip, pts, w, h }) => {
  const [s, c1, c2, e] = pts;
  const a = Math.atan2(e[1] - c2[1], e[0] - c2[0]);
  const hd = (o) => `${(e[0] - 15 * Math.cos(a + o)).toFixed(1)} ${(e[1] - 15 * Math.sin(a + o)).toFixed(1)}`;
  return (
    <svg className="anno-arrow hm-annotate" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none"
      style={{ position: 'absolute', insetInlineStart: `${tip[0] - e[0]}px`, top: `${tip[1] - e[1]}px`, zIndex: 60, pointerEvents: 'none', overflow: 'visible' }}>
      <path d={`M${s} C${c1} ${c2} ${e}`} pathLength="240" stroke="#1a56db" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: '240', animation: 'drawCurve 2.6s ease-in-out infinite' }} />
      <path d={`M${hd(-0.5)} L${e[0]} ${e[1]} L${hd(0.5)}`} stroke="#1a56db" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'drawHead 2.6s ease-in-out infinite' }} />
    </svg>
  );
};

const SCREENS = [['pt', 'Patients', 'HMPT', IC.users], ['co', 'Consultants', 'HMCO', IC.steth], ['ap', 'Appointments', 'OPAP', IC.cal]];

/* HMSflo hero mockup. Rendered by HeroSection while HMSflo is the active product. */
export default function HmsMockup({ scrollRegion, notes }) {
  'use no memo'; // Compiler skipped these inline-style-heavy mockups; memoizing them adds ~20 KB each.
  const { state: home } = useHome();
  const { t } = useLanguage();
  const note = useHeroNote(notes); // CMS notes: 0 = Live OPD queue, 1 = switch screens, 2 = tap to triage
  const [scr, setScr] = useState('pt');
  const [pts, setPts] = useState(P0);
  const [cons, setCons] = useState(C0);
  const [appts, setAppts] = useState(A0);
  const [modal, setModal] = useState(null);
  const [hi, setHi] = useState(null);
  const [toast, setToast] = useState(null);
  const [q, setQ] = useState(Q0);
  const [find, setFind] = useState('');
  const [spec, setSpec] = useState('');
  const hover = useRef(false);
  const body = useRef(null);

  // Queue auto-advance: gentle, and only while the hero itself is playing,
  // nobody is hovering the demo, the tab is visible and motion is welcome.
  useEffect(() => {
    if (!home.playing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => { if (!hover.current && !document.hidden) setQ(nextQ); }, 4000);
    return () => clearInterval(id);
  }, [home.playing]);
  useEffect(() => { if (!toast) return undefined; const id = setTimeout(() => setToast(null), 3600); return () => clearTimeout(id); }, [toast]);
  useEffect(() => {
    if (!hi) return undefined;
    reveal(body.current, body.current?.querySelector('[data-hi]'));
    const id = setTimeout(() => setHi(null), 2600);
    return () => clearTimeout(id);
  }, [hi]);

  const pName = (mr) => pts.find((p) => p.mr === mr)?.name || mr;
  const cOf = (id) => cons.find((c) => c.id === id);
  const go = (s) => { setScr(s); setHi(null); if (body.current) body.current.scrollTop = 0; };
  const nextMr = `MR-${104291 + pts.length - P0.length}`;
  const nextCon = `CON-000${10 + cons.length - C0.length}`;
  const nextApt = `APT-00${131 + appts.length}`;
  const upcoming = (mr) => appts.find((a) => a.mr === mr && a.st === 'BOOKED');

  const addPatient = (p, book) => {
    setPts([p, ...pts]); setFind(''); setScr('pt'); setHi(p.mr);
    setToast(`${p.name} ${t('registered')} — ${p.mr}`);
    setModal(book ? { k: 'bk', mr: p.mr } : null);
  };
  const addCon = (c) => {
    setCons([...cons, { ...c, hue: cons.length }]); setSpec(''); setScr('co'); setHi(c.id); setModal(null);
    setToast(`${c.name} ${t('added')} — ${c.id} · ${perDay(c)} ${t('slots a day')}`);
  };
  const book = (a) => {
    setAppts([...appts, a]); setScr('ap'); setHi(a.id); setModal(null);
    setToast(`${pName(a.mr)} ${t('booked with')} ${cOf(a.con).name} — ${a.id} · ${a.time}`);
  };
  const checkIn = (a) => {
    setAppts(appts.map((x) => (x.id === a.id ? { ...x, st: 'ARRIVED' } : x))); setHi(a.id);
    setToast(`${pName(a.mr)} ${t('checked in')} — ${a.id}`);
  };

  const cur = SCREENS.find((s) => s[0] === scr);
  const list = pts.filter((p) => !find || `${p.name} ${p.mr} ${p.mob}`.toLowerCase().includes(find.trim().toLowerCase()));
  const conList = cons.filter((c) => !spec || c.spec === spec);
  const counts = { pt: pts.length, co: cons.length, ap: appts.length };
  const waiting = q.rows.filter((r) => r.st === 'wait').length + 4;
  const navBtn = (on) => ({ ...B, ...ROW, gap: '10px', width: '100%', height: '34px', padding: '0 11px', borderRadius: '10px', fontSize: '12.5px', background: on ? TINT : 'transparent', color: on ? TEAL : '#3d4757', fontWeight: on ? 600 : 500 });
  const cnt = (on, red) => ({ marginInlineStart: 'auto', fontSize: '10px', fontWeight: 700, borderRadius: '999px', padding: '1px 7px', background: red ? '#fef2f2' : on ? '#ccfbf1' : '#f4f6fa', color: red ? '#b91c1c' : on ? TEAL : '#8b93a3', lineHeight: 1.4 });
  const head = (sub, tools) => (
    <>
      <div style={{ ...ROW, height: '38px', gap: '10px', fontSize: '11.5px', color: MUT }}><span style={{ ...ELL, flex: 1 }}>{t(sub)}</span></div>
      <div style={{ ...ROW, gap: '8px', height: '36px', margin: '8px 0 10px' }}>{tools}</div>
    </>
  );

  let screen;
  if (scr === 'pt') {
    const COLS = { display: 'grid', gridTemplateColumns: '2fr 96px 1.2fr 80px 1.6fr 64px', gap: '10px', alignItems: 'center', padding: '0 14px' };
    screen = (<>
      {head('The patient register · an MR number identifies a person for life', <>
        <label style={{ ...ROW, gap: '8px', flex: 1, maxWidth: '340px', height: '34px', padding: '0 11px', border: '1px solid #e6eaf2', borderRadius: '10px', background: '#fbfcfe', color: FAINT }}>
          <Ic d={IC.search} s={14} /><input value={find} onChange={(e) => setFind(e.target.value)} placeholder={t('Name, MR number or mobile…')} aria-label={t('Search patients')} style={{ ...INP, borderWidth: 0, height: '32px', padding: 0, background: 'transparent' }} />
        </label>
        <span style={{ fontSize: '11px', color: MUT }}>{`${list.length} ${t('patients')}`}</span>
        <span style={{ flex: 1 }} />
        <button type="button" onClick={() => setModal({ k: 'pt' })} style={BTN}><Ic d={IC.addUser} s={15} w={2.1} />{t('Register patient')}</button>
      </>)}
      <div style={{ ...CARD, overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...COLS, height: '30px', background: '#fbfcfe', borderBottom: `1px solid ${RULE}`, flex: '0 0 auto' }}>
          {['PATIENT', 'MR NUMBER', 'CONTACT', 'GROUP', 'NEXT VISIT', ''].map((h, i) => <span key={i} style={{ ...LAB, fontSize: '9.5px', letterSpacing: '.05em', color: MUT }}>{h && t(h)}</span>)}
        </div>
        <div ref={body} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {list.map((p, i) => {
            const nx = upcoming(p.mr); const [tint, hue] = HUES[i % 6]; const on = hi === p.mr;
            return (
              <div key={p.mr} data-hi={on ? '' : undefined} style={{ ...COLS, height: '46px', borderBottom: '1px solid #f5f7fa', animation: on ? 'hmsFlash 2.6s ease both' : undefined }}>
                <span style={{ ...ROW, gap: '9px', minWidth: 0 }}>
                  <span style={{ ...ROW, justifyContent: 'center', width: '30px', height: '30px', flex: '0 0 auto', borderRadius: '10px', background: tint, color: hue, fontSize: '11px', fontWeight: 700 }}>{inits(p.name)}</span>
                  <span style={{ minWidth: 0 }}><span style={{ ...BLK, ...ELL, fontSize: '12px', fontWeight: 600 }}>{p.name}</span><span style={{ ...BLK, ...ELL, fontSize: '10px', color: MUT }}>{`${t(p.g === 'M' ? 'Male' : 'Female')} · ${p.age} ${t('yrs')} · ${p.blood}`}</span></span>
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: TEAL, fontVariantNumeric: 'tabular-nums' }}>{p.mr}</span>
                <span style={{ ...ELL, fontSize: '11px', unicodeBidi: 'plaintext' }}>{p.mob}</span>
                <span><span style={pill(TEAL, TINT)}>{t(p.grp)}</span></span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ ...BLK, ...ELL, fontSize: '11px', color: nx ? TEAL : FAINT, fontWeight: nx ? 600 : 400 }}>{nx ? `${t('Today')} ${nx.time} · ${cOf(nx.con)?.name}` : t('No upcoming visit')}</span>
                  <span style={{ ...BLK, ...ELL, fontSize: '10px', color: MUT }}>{`${t('Last visit')} ${p.last}`}</span>
                </span>
                <button type="button" onClick={() => setModal({ k: 'bk', mr: p.mr })} aria-label={`${t('Book')} — ${p.name}`} style={{ ...GHOST, height: '28px', padding: '0 11px', fontSize: '11px' }}>{t('Book')}</button>
              </div>
            );
          })}
          {!list.length && <div style={{ padding: '40px 10px', textAlign: 'center' }}><div style={{ fontSize: '12.5px', fontWeight: 600 }}>{t('No patient matches that search')}</div><div style={{ fontSize: '11px', color: MUT, marginTop: '3px' }}>{t('Try the MR number, or register a new patient.')}</div></div>}
        </div>
      </div>
    </>);
  } else if (scr === 'co') {
    screen = (<>
      {head('Consultant directory · availability, fees and today’s load', <>
        <div role="group" aria-label={t('Specialization')} style={{ display: 'flex', gap: '5px', minWidth: 0, overflow: 'hidden' }}>
          {['', ...new Set(cons.map((c) => c.spec))].map((s) => <button type="button" key={s} aria-pressed={spec === s} onClick={() => setSpec(s)} style={{ ...chip(spec === s), borderRadius: '999px' }}>{s ? t(s) : t('All')}</button>)}
        </div>
        <span style={{ flex: 1 }} />
        <button type="button" onClick={() => setModal({ k: 'co' })} style={BTN}><Ic d={IC.plus} s={15} w={2.4} />{t('Add consultant')}</button>
      </>)}
      <div ref={body} style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', alignContent: 'start', paddingBottom: '14px' }}>
        {conList.map((c) => {
          const sl = slotsOf(c); const bk = sl.filter((tm) => appts.some((a) => a.con === c.id && a.time === tm)).length;
          const nf = sl.find((tm) => !appts.some((a) => a.con === c.id && a.time === tm)); const [tint, hue] = HUES[c.hue % 6]; const on = hi === c.id;
          return (
            <div key={c.id} data-hi={on ? '' : undefined} style={{ ...CARD, overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: on ? 'hmsFlash 2.6s ease both' : undefined }}>
              <div style={{ display: 'flex', gap: '10px', padding: '12px 13px 9px' }}>
                <span style={{ ...ROW, justifyContent: 'center', width: '40px', height: '40px', borderRadius: '13px', background: tint, color: hue, fontSize: '13.5px', fontWeight: 700, flex: '0 0 auto' }}>{inits(c.name)}</span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ ...ROW, gap: '6px' }}><span style={{ ...ELL, fontSize: '13px', fontWeight: 600 }}>{c.name}</span><span style={pill('#15803d', '#dcfce7')}>{t('ACTIVE')}</span></span>
                  <span style={{ ...BLK, ...ELL, fontSize: '10.5px', color: '#8b93a3' }}>{`${t(c.spec)} · ${t('Room')} ${c.room}`}</span>
                  <span style={{ ...BLK, ...ELL, fontSize: '10px', color: FAINT }}>{`${c.id} · ${t(c.type)}`}</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', padding: '0 13px 10px' }}>
                {DAYS.map((d, i) => <span key={d} style={{ flex: 1, height: '20px', borderRadius: '6px', ...ROW, justifyContent: 'center', fontSize: '8.5px', fontWeight: 700, background: c.days[i] ? TINT : '#f6f7fb', color: c.days[i] ? TEAL : '#c7cdd8' }}>{t(d)}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: `1px solid ${RULE}` }}>
                {[['FEE', rs(c.fee)], ['SLOT', `${c.slot} ${t('min')}`], ['TODAY', sl.length ? `${bk}/${sl.length}` : '—']].map(([k, v], i) => (
                  <span key={k} style={{ padding: '7px 11px', borderInlineStart: i ? `1px solid ${RULE}` : 0 }}><span style={{ ...BLK, ...LAB, fontSize: '8.5px', letterSpacing: '.06em' }}>{t(k)}</span><span style={{ ...BLK, fontSize: '12px', fontWeight: 600, marginTop: '1px' }}>{v}</span></span>
                ))}
              </div>
              <div style={{ ...ROW, gap: '7px', padding: '8px 11px', borderTop: `1px solid ${RULE}`, background: '#fbfcfe', marginTop: 'auto' }}>
                <span style={{ flex: 1, minWidth: 0 }}><span style={{ ...BLK, fontSize: '9.5px', color: FAINT }}>{t('Next available')}</span><span style={{ ...BLK, ...ELL, fontSize: '11.5px', fontWeight: 600, color: nf ? TEAL : SEC }}>{nf ? `${t('Today')} ${nf}` : t('Fully booked today')}</span></span>
                <button type="button" disabled={!nf} onClick={() => setModal({ k: 'bk', con: c.id, time: nf })} aria-label={`${t('Book')} — ${c.name}`} style={{ ...BTN, height: '28px', padding: '0 12px', fontSize: '11px', opacity: nf ? 1 : 0.45 }}>{t('Book')}</button>
              </div>
            </div>
          );
        })}
      </div>
    </>);
  } else {
    screen = (<>
      {head('Today’s slot board · click an open slot to book, a booking to check the patient in', <>
        <span style={{ ...ROW, gap: '2px', height: '32px', padding: '0 4px', border: `1px solid ${BD}`, borderRadius: '10px', background: '#fff', fontSize: '11.5px', fontWeight: 600, color: TEAL }}>
          <span aria-hidden="true" style={{ color: FAINT, padding: '0 6px' }}>‹</span>{t('Today')}<span aria-hidden="true" style={{ color: FAINT, padding: '0 6px' }}>›</span>
        </span>
        {[['BOOKED', TEAL], ['ARRIVED', '#6b21a8'], ['OPEN', '#c7cdd8']].map(([k, c]) => <span key={k} style={{ ...ROW, gap: '5px', fontSize: '10.5px', color: MUT, marginInlineStart: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '3px', background: c }} />{t(k === 'OPEN' ? 'Open slot' : k === 'BOOKED' ? 'Booked' : 'Arrived')}</span>)}
        <span style={{ flex: 1 }} />
        <button type="button" onClick={() => setModal({ k: 'bk' })} style={BTN}><Ic d={IC.cal} s={14} />{t('Book appointment')}</button>
      </>)}
      <div ref={body} style={{ ...CARD, flex: 1, minHeight: 0, display: 'flex', overflowX: 'auto', overflowY: 'hidden', marginBottom: '14px' }}>
        {cons.map((c, ci) => {
          const sl = slotsOf(c); const [tint, hue] = HUES[c.hue % 6];
          const bk = sl.filter((tm) => appts.some((a) => a.con === c.id && a.time === tm)).length;
          return (
            <div key={c.id} data-hi={hi === c.id ? '' : undefined} style={{ flex: '1 0 190px', minWidth: '190px', borderInlineStart: ci ? `1px solid ${RULE}` : 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ ...ROW, gap: '8px', height: '50px', padding: '0 10px', borderBottom: `1px solid ${RULE}`, flex: '0 0 auto' }}>
                <span style={{ ...ROW, justifyContent: 'center', width: '30px', height: '30px', borderRadius: '50%', background: tint, color: hue, fontSize: '10.5px', fontWeight: 700, flex: '0 0 auto' }}>{inits(c.name)}</span>
                <span style={{ minWidth: 0, flex: 1 }}><span style={{ ...BLK, ...ELL, fontSize: '11.5px', fontWeight: 600 }}>{c.name}</span><span style={{ ...BLK, ...ELL, fontSize: '9.5px', color: MUT }}>{`${t(c.spec)} · ${c.room}`}</span></span>
                <span style={pill(hue, tint)}>{`${bk}/${sl.length}`}</span>
              </div>
              <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {!sl.length && <div style={{ margin: '4px', padding: '10px', border: '1px dashed #e6eaf2', borderRadius: '10px', fontSize: '11px', color: MUT }}>{t('No session today')}</div>}
                {sl.map((tm) => {
                  const a = appts.find((x) => x.con === c.id && x.time === tm); const [bg, bd, edge, pb] = a ? TONE[a.st] : ['#fff', BD, '#e6eaf2', '#f4f6fa']; const on = a && hi === a.id;
                  return (
                    <button type="button" key={tm} data-hi={on ? '' : undefined} onClick={() => (a ? a.st === 'BOOKED' && checkIn(a) : setModal({ k: 'bk', con: c.id, time: tm }))} aria-label={a ? `${tm} ${pName(a.mr)} — ${t(a.st === 'BOOKED' ? 'Check in' : 'Arrived')}` : `${tm} ${t('Open slot')} — ${t('Book')}`}
                      style={{ ...B, ...ROW, position: 'relative', overflow: 'hidden', gap: '7px', height: '36px', flex: '0 0 auto', padding: '0 7px', paddingInlineStart: '10px', borderRadius: '9px', border: `1px solid ${bd}`, background: bg, cursor: a && a.st !== 'BOOKED' ? 'default' : 'pointer', animation: on ? 'hmsFlash 2.6s ease both' : undefined }}>
                      <span style={{ position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, width: '3px', background: edge }} />
                      <span style={{ fontSize: '10px', fontWeight: 600, color: a ? edge : FAINT, flex: '0 0 34px', fontVariantNumeric: 'tabular-nums' }}>{tm}</span>
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ ...BLK, ...ELL, fontSize: '11px', fontWeight: a ? 600 : 500, color: a ? '#1a1d23' : FAINT, lineHeight: 1.25 }}>{a ? pName(a.mr) : t('Open slot')}</span>
                        <span style={{ ...ROW, gap: '5px', fontSize: '9px', color: a ? MUT : '#c7cdd8', lineHeight: 1.25 }}><span style={{ ...ELL, flex: 1, minWidth: 0 }}>{a ? a.mr : `${c.slot} ${t('min')}`}</span><span style={{ ...pill(a ? edge : FAINT, pb), fontSize: '8px', padding: '0 5px' }}>{t(a ? a.st : 'FREE')}</span></span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>);
  }

  return (
    <div className="hm-float-wrap hms-demo" onMouseEnter={() => { hover.current = true; }} onMouseLeave={() => { hover.current = false; }} style={{ position: 'relative', animation: 'slideInR .55s cubic-bezier(.2,.7,.3,1) both' }}>
      {/* Tips are pinned to measured targets in the 1040×580 frame: queue card
          left edge (x 802), sidebar "Consultants" item (13, 187), first ER case
          row (card edge x −26, row centre y 426). */}
      <Anno text={note(0, 'text', ['Live OPD queue'])} sub={note(0, 'sub', ['Call the next token in one tap'])} style={{ top: '-112px', insetInlineEnd: '300px', width: '230px', textAlign: 'end' }} />
      <Curve tip={[795, -66]} w={56} h={32} pts={[[4, 8], [20, 4], [38, 10], [50, 26]]} />
      <Anno text={note(1, 'text', ['switch screens'])} style={{ top: '83px', insetInlineStart: '-176px', width: '150px', textAlign: 'center' }} />
      <Curve tip={[8, 187]} w={120} h={56} pts={[[4, 6], [40, 2], [84, 20], [114, 46]]} />
      <Anno text={note(2, 'text', ['tap to triage'])} style={{ top: '326px', insetInlineStart: '-178px', width: '140px', textAlign: 'center' }} />
      <Curve tip={[-32, 426]} w={110} h={52} pts={[[4, 6], [34, 2], [76, 18], [104, 44]]} />

      <div className="hm-scale-scroll-wrap hm-float-main" {...scrollRegion} style={{ '--hm-w': '1040px', '--hm-h': '580px' }}>
        <div className="hm-scale-scroll" style={{ position: 'relative', isolation: 'isolate', display: 'flex', height: '580px', background: '#f4f6fa', border: '1px solid #e7ecf5', borderRadius: '16px', boxShadow: '0 50px 100px -40px rgba(15,23,41,.35)', overflow: 'hidden', color: '#1a1d23', fontSize: '12px', lineHeight: 1.4, textAlign: 'start' }}>
          <aside style={{ width: '220px', flex: '0 0 220px', background: '#fff', borderInlineEnd: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', padding: '0 12px 12px' }}>
            <div style={{ ...ROW, gap: '10px', height: '56px', padding: '0 6px', flex: '0 0 auto' }}>
              <span style={{ ...ROW, justifyContent: 'center', width: '30px', height: '30px', borderRadius: '9px', background: '#134e4a', color: '#fff' }}><Ic d={IC.plus} s={17} w={2.4} /></span>
              <span><span style={{ ...BLK, fontSize: '16px', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.1 }}>HMSflo</span><span style={{ ...BLK, fontSize: '9.5px', color: MUT }}>{t('Hospital management')}</span></span>
            </div>
            <div style={{ ...ROW, gap: '9px', padding: '9px 10px', border: `1px solid ${BD}`, borderRadius: '11px', flex: '0 0 auto' }}>
              <span style={{ ...ROW, justifyContent: 'center', width: '26px', height: '26px', borderRadius: '8px', background: '#f4f6fa', color: '#6b7280' }}><Ic d={IC.hosp} s={14} w={1.8} /></span>
              <span style={{ minWidth: 0 }}><span style={{ ...BLK, ...ELL, fontSize: '11px', fontWeight: 600 }}>{t('Northline General Hospital, Lahore')}</span><span style={{ ...BLK, fontSize: '9.5px', color: MUT }}>NGH · OPD</span></span>
            </div>
            <nav aria-label={t('HMSflo demo screens')} style={{ marginTop: '12px' }}>
              <div style={{ ...LAB, padding: '0 11px 6px', letterSpacing: '.12em' }}>{t('OUTPATIENT · OPD')}</div>
              {SCREENS.map(([k, label, , ic]) => (
                <button type="button" key={k} aria-current={scr === k ? 'page' : undefined} onClick={() => go(k)} style={navBtn(scr === k)}>
                  <Ic d={ic} s={16} w={1.8} />{t(label)}<span style={cnt(scr === k)}>{counts[k]}</span>
                </button>
              ))}
              <div style={{ ...LAB, padding: '10px 11px 5px', letterSpacing: '.12em' }}>{t('CLINICAL')}</div>
              <div style={{ ...navBtn(false), cursor: 'default' }}><Ic d={IC.queue} s={16} w={1.8} />{t('Live queue')}<span style={cnt(false)}>{waiting}</span></div>
              <div style={{ ...navBtn(false), cursor: 'default' }}><Ic d={IC.amb} s={16} w={1.8} />{t('Emergency')}<span style={cnt(false, true)}>4</span></div>
            </nav>
            <div style={{ ...ROW, gap: '9px', marginTop: 'auto', padding: '10px 6px 0', borderTop: `1px solid ${RULE}` }}>
              <span style={{ ...ROW, justifyContent: 'center', width: '30px', height: '30px', borderRadius: '50%', background: TEAL, color: '#fff', fontSize: '10.5px', fontWeight: 700 }}>AR</span>
              <span style={{ minWidth: 0 }}><span style={{ ...BLK, ...ELL, fontSize: '11.5px', fontWeight: 600 }}>Dr. Ayesha Raza</span><span style={{ ...BLK, fontSize: '9.5px', color: MUT }}>{t('Medical Director')}</span></span>
            </div>
          </aside>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <header style={{ ...ROW, gap: '14px', height: '56px', flex: '0 0 auto', padding: '0 20px', background: '#fff', borderBottom: `1px solid ${BD}` }}>
              <span style={{ ...ROW, gap: '9px', flex: '0 0 auto' }}><span style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-.02em' }}>{t(cur[1])}</span><span style={{ ...pill('#8b93a3', '#f4f6fa'), fontSize: '9.5px', padding: '3px 7px' }}>{cur[2]}</span></span>
              <span style={{ ...ROW, gap: '8px', flex: 1, maxWidth: '300px', height: '36px', padding: '0 14px', borderRadius: '999px', background: '#f4f6fa', color: FAINT, fontSize: '11.5px' }}><Ic d={IC.search} s={14} /><span style={ELL}>{t('Search patients, MR#, doctors…')}</span></span>
              <span style={{ flex: 1 }} />
              <span style={{ position: 'relative', color: '#6b7280', ...ROW }}><Ic d={IC.bell} s={18} w={1.8} /><span style={{ position: 'absolute', top: '-1px', insetInlineEnd: '-1px', width: '7px', height: '7px', borderRadius: '50%', background: '#f04438', border: '1.5px solid #fff' }} /></span>
              <span style={{ ...ROW, justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: TEAL, color: '#fff', fontSize: '11px', fontWeight: 700 }}>AR</span>
            </header>
            <div key={scr} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '8px 20px 0', animation: 'hmsIn .22s ease both' }}>{screen}</div>
          </div>

          <div role="status" aria-live="polite" style={{ position: 'absolute', bottom: '18px', insetInlineStart: '240px', insetInlineEnd: '20px', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 20 }}>
            {toast && <span key={toast} style={{ ...ROW, gap: '8px', maxWidth: '100%', background: '#0f3d3a', color: '#fff', fontSize: '11.5px', fontWeight: 500, borderRadius: '11px', padding: '9px 14px', boxShadow: '0 14px 34px rgba(16,24,40,.24)', animation: 'hmsPop .2s ease both' }}><span style={{ ...ROW, justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: '#12b76a' }}><Ic d={IC.check} s={11} w={3} /></span><span style={ELL}>{toast}</span></span>}
          </div>

          {modal?.k === 'pt' && <PatientModal mr={nextMr} onClose={() => setModal(null)} onSave={addPatient} />}
          {modal?.k === 'co' && <ConsultantModal id={nextCon} onClose={() => setModal(null)} onSave={addCon} />}
          {modal?.k === 'bk' && <BookModal pre={modal} pts={pts} cons={cons} appts={appts} id={nextApt} onClose={() => setModal(null)} onSave={book} />}
        </div>
      </div>

      <span className="hm-float-caption">{t('🩺 Live OPD queue')}</span>
      <QueueCard q={q} onNext={() => setQ(nextQ)} />
      <span className="hm-float-caption">{t('🚑 ER tracking board')}</span>
      <ErCard />
    </div>
  );
}
