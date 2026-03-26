import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useExpenses } from '../../context/ExpenseContext.jsx';
import { getCategoryMeta, formatCurrency } from '../../utils/constants.js';
import { formatDate, getMonthRange } from '../../utils/helpers.js';
import MonthPicker from '../../components/ui/MonthPicker.jsx';
import './DashboardPage.css';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { fetchExpenses, fetchSummary, fetchBudgets, expenses, summary, budgets } = useExpenses();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());

  useEffect(() => {
    const { startDate, endDate } = getMonthRange(month, year);
    fetchExpenses({ startDate, endDate, limit: 5 });
    fetchSummary(month, year);
    fetchBudgets(month, year);
  }, [month, year]);

  const alertBudgets = budgets.filter(b => b.percentage >= b.alertAt);

  return (
    <div className="dashboard fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good {greeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-sub">Here's your financial snapshot</p>
        </div>
        <MonthPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </div>

      {alertBudgets.length > 0 && (
        <div className="alert-banner">
          <span>⚠️</span>
          <span><strong>{alertBudgets.length} budget{alertBudgets.length > 1 ? 's' : ''}</strong> near or over limit</span>
          <Link to="/budgets" className="alert-link">View budgets →</Link>
        </div>
      )}

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Expenses', value: summary?.totalExpenses, color: 'var(--red)' },
          { label: 'Total Income',   value: summary?.totalIncome,   color: 'var(--green)' },
          { label: 'Net Balance',    value: summary?.balance,       color: (summary?.balance ?? 0) >= 0 ? 'var(--green)' : 'var(--red)' },
          { label: 'Transactions',   value: summary?.count,         color: 'var(--accent)', isCnt: true },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>
              {s.isCnt ? (s.value ?? 0) : formatCurrency(s.value ?? 0, user?.currency)}
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent transactions</h3>
            <Link to="/expenses" className="card-link">View all →</Link>
          </div>
          {expenses.length === 0
            ? <p className="empty-state">No transactions this month</p>
            : expenses.slice(0, 5).map(e => {
                const cat = getCategoryMeta(e.category);
                return (
                  <div key={e._id} className="recent-item">
                    <div className="recent-icon" style={{ background: cat.color + '22', color: cat.color }}>{cat.emoji}</div>
                    <div className="recent-info">
                      <div className="recent-title">{e.title}</div>
                      <div className="recent-date">{formatDate(e.date, 'MMM d')}</div>
                    </div>
                    <div className="recent-amount" style={{ color: e.type === 'income' ? 'var(--green)' : 'var(--text1)' }}>
                      {e.type === 'income' ? '+' : '-'}{formatCurrency(e.amount, user?.currency)}
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Budget status</h3>
            <Link to="/budgets" className="card-link">Manage →</Link>
          </div>
          {budgets.length === 0
            ? <p className="empty-state">No budgets set for this month</p>
            : budgets.slice(0, 4).map(b => {
                const cat   = getCategoryMeta(b.category);
                const pct   = Math.min(b.percentage ?? 0, 100);
                const color = b.percentage > 100 ? 'var(--red)' : b.percentage >= b.alertAt ? 'var(--amber)' : 'var(--green)';
                return (
                  <div key={b._id} className="budget-mini">
                    <div className="budget-mini-top">
                      <span>{cat.emoji} {cat.label}</span>
                      <span style={{ color, fontSize: '12px' }}>{b.percentage ?? 0}%</span>
                    </div>
                    <div className="budget-bar-track">
                      <div className="budget-bar-fill" style={{ width: pct + '%', background: color }} />
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
