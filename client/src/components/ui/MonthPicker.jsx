import { MONTHS } from '../../utils/constants.js';

export default function MonthPicker({ month, year, onChange }) {
  const prev = () => { const d = new Date(year, month - 1); onChange(d.getMonth(), d.getFullYear()); };
  const next = () => { const d = new Date(year, month + 1); onChange(d.getMonth(), d.getFullYear()); };

  return (
    <div className="month-picker">
      <button className="btn btn-ghost btn-sm" onClick={prev}>‹</button>
      <select className="input" style={{ width:'auto', padding:'0.35rem 0.6rem', fontSize:'13px' }}
        value={month} onChange={e => onChange(Number(e.target.value), year)}>
        {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
      </select>
      <select className="input" style={{ width:'auto', padding:'0.35rem 0.6rem', fontSize:'13px' }}
        value={year} onChange={e => onChange(month, Number(e.target.value))}>
        {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <button className="btn btn-ghost btn-sm" onClick={next}>›</button>
    </div>
  );
}
