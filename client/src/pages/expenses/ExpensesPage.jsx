import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useExpenses } from '../../context/ExpenseContext.jsx';
import { CATEGORIES } from '../../utils/constants.js';
import { getMonthRange } from '../../utils/helpers.js';
import ExpenseItem from '../../components/expenses/ExpenseItem.jsx';
import ExpenseForm from '../../components/expenses/ExpenseForm.jsx';
import Modal       from '../../components/ui/Modal.jsx';
import MonthPicker from '../../components/ui/MonthPicker.jsx';
import './ExpensesPage.css';

export default function ExpensesPage() {
  const { user } = useAuth();
  const { expenses, loading, fetchExpenses, createExpense, updateExpense, deleteExpense } = useExpenses();
  const now = new Date();
  const [month,      setMonth]      = useState(now.getMonth());
  const [year,       setYear]       = useState(now.getFullYear());
  const [catFilter,  setCatFilter]  = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modal,      setModal]      = useState(null);
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    const { startDate, endDate } = getMonthRange(month, year);
    fetchExpenses({
      startDate, endDate,
      ...(catFilter  ? { category: catFilter  } : {}),
      ...(typeFilter ? { type:     typeFilter  } : {}),
    });
  }, [month, year, catFilter, typeFilter]);

  const handleAdd = async data => {
    setSaving(true);
    try { await createExpense(data); setModal(null); }
    finally { setSaving(false); }
  };

  const handleUpdate = async data => {
    setSaving(true);
    try { await updateExpense(modal._id, data); setModal(null); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this entry?')) return;
    await deleteExpense(id);
  };

  return (
    <div className="expenses-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-sub">{expenses.length} entries</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <MonthPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
          <button className="btn btn-primary" onClick={() => setModal('add')}>+ Add entry</button>
        </div>
      </div>

      <div className="expense-filters">
        <select className="input filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
        </select>
        <select className="input filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="expense-list">
        {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>}
        {!loading && expenses.length === 0 && (
          <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
            <p>No entries for this period</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setModal('add')}>Add your first entry</button>
          </div>
        )}
        {expenses.map(e => (
          <ExpenseItem key={e._id} expense={e} currency={user?.currency} onEdit={setModal} onDelete={handleDelete} />
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add entry' : 'Edit entry'} onClose={() => setModal(null)}>
          <ExpenseForm
            initial={modal !== 'add' ? modal : undefined}
            onSubmit={modal === 'add' ? handleAdd : handleUpdate}
            onCancel={() => setModal(null)}
            loading={saving}
          />
        </Modal>
      )}
    </div>
  );
}
