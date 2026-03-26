import { useState } from 'react';
import { CATEGORIES } from '../../utils/constants.js';
import { format } from 'date-fns';
import './ExpenseForm.css';

const blank = () => ({
  title: '', amount: '', type: 'expense',
  category: 'Food', tags: '', note: '',
  date: format(new Date(), 'yyyy-MM-dd'),
});

export default function ExpenseForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial ? {
    ...initial,
    tags: initial.tags?.join(', ') || '',
    date: format(new Date(initial.date), 'yyyy-MM-dd'),
  } : blank());

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Type</label>
        <div className="type-toggle">
          {['expense', 'income'].map(t => (
            <button key={t} type="button"
              className={`type-btn ${form.type === t ? 'active-' + t : ''}`}
              onClick={() => setForm(p => ({ ...p, type: t }))}>
              {t === 'expense' ? '↓ Expense' : '↑ Income'}
            </button>
          ))}
        </div>
      </div>
      <div className="form-row">
        <div className="field" style={{ flex: 2 }}>
          <label className="label">Title</label>
          <input className="input" placeholder="e.g. Grocery run" value={form.title} onChange={set('title')} required />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="label">Amount</label>
          <input className="input" type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={set('amount')} required />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label">Date</label>
          <input className="input" type="date" value={form.date} onChange={set('date')} required />
        </div>
      </div>
      <div className="field">
        <label className="label">Tags (comma separated)</label>
        <input className="input" placeholder="work, recurring, …" value={form.tags} onChange={set('tags')} />
      </div>
      <div className="field">
        <label className="label">Note</label>
        <textarea className="input" rows={2} placeholder="Optional note…" value={form.note} onChange={set('note')} style={{ resize: 'vertical' }} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : (initial ? 'Update' : 'Add entry')}
        </button>
      </div>
    </form>
  );
}
