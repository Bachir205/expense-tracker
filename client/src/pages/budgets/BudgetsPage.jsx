import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useExpenses } from '../../context/ExpenseContext.jsx';
import { CATEGORIES } from '../../utils/constants.js';
import BudgetCard  from '../../components/budget/BudgetCard.jsx';
import Modal       from '../../components/ui/Modal.jsx';
import MonthPicker from '../../components/ui/MonthPicker.jsx';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import './BudgetsPage.css';

export default function BudgetsPage() {
  const { user } = useAuth();
  const { budgets, fetchBudgets } = useExpenses();
  const now = new Date();
  const [month,  setMonth]  = useState(now.getMonth());
  const [year,   setYear]   = useState(now.getFullYear());
  const [modal,  setModal]  = useState(null);
  const [saving, setSaving] = useState(false);
  const [form,   setForm]   = useState({ category: 'Food', limit: '', alertAt: 80 });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => { fetchBudgets(month, year); }, [month, year]);

  const usedCategories      = budgets.map(b => b.category);
  const availableCategories = CATEGORIES.filter(c => !usedCategories.includes(c.value));

  const openAdd = () => {
    if (availableCategories.length === 0) {
      toast.error('All categories already have a budget this month');
      return;
    }
    // Default to the first available category, not hardcoded 'Food'
    setForm({ category: availableCategories[0].value, limit: '', alertAt: 80 });
    setModal('add');
  };

  const openEdit = b => {
    setForm({ category: b.category, limit: b.limit, alertAt: b.alertAt });
    setModal(b);
  };

  const handleSave = async () => {
    if (!form.limit || parseFloat(form.limit) <= 0) {
      toast.error('Please enter a valid limit');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        category: form.category,
        limit:    parseFloat(form.limit),
        alertAt:  Number(form.alertAt),
        month,
        year,
      };
      if (modal === 'add') {
        await api.post('/budgets', payload);
        toast.success('Budget created');
      } else {
        await api.put(`/budgets/${modal._id}`, payload);
        toast.success('Budget updated');
      }
      setModal(null);
      fetchBudgets(month, year);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Remove this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      toast.success('Budget removed');
      fetchBudgets(month, year);
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="budgets-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-sub">{budgets.length} of {CATEGORIES.length} categories set</p>
        </div>
        <div className="page-header-actions">
          <MonthPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
          <button className="btn btn-primary" onClick={openAdd}
            disabled={availableCategories.length === 0}>
            + New budget
          </button>
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="empty-full">
          <div className="empty-icon">◎</div>
          <p>No budgets yet for this month</p>
          <button className="btn btn-primary" onClick={openAdd}>Set your first budget</button>
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map(b => (
            <BudgetCard key={b._id} budget={b} currency={user?.currency}
              onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'New budget' : 'Edit budget'} onClose={() => setModal(null)}>
          <div className="budget-form">
            <div className="field">
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={set('category')}
                disabled={modal !== 'add'}>
                {(modal === 'add' ? availableCategories : CATEGORIES).map(c => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">Monthly limit</label>
              <input className="input" type="number" min="1" step="0.01"
                placeholder="e.g. 500" value={form.limit} onChange={set('limit')} required />
            </div>
            <div className="field">
              <label className="label">Alert at {form.alertAt}%</label>
              <input type="range" min="10" max="100" step="5" value={form.alertAt}
                onChange={set('alertAt')}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}
                disabled={saving || !form.limit}>
                {saving ? 'Saving…' : (modal === 'add' ? 'Create' : 'Update')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
