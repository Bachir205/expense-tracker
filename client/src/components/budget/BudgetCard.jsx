import { getCategoryMeta, formatCurrency } from '../../utils/constants.js';
import './BudgetCard.css';

export default function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const cat  = getCategoryMeta(budget.category);
  const pct  = Math.min(budget.percentage ?? 0, 100);
  const over = budget.percentage > 100;
  const warn = budget.percentage >= budget.alertAt && !over;
  const barColor = over ? 'var(--red)' : warn ? 'var(--amber)' : 'var(--green)';

  return (
    <div className="budget-card fade-in">
      <div className="budget-card-header">
        <div className="budget-cat">
          <span className="budget-emoji">{cat.emoji}</span>
          <span className="budget-cat-name">{cat.label}</span>
        </div>
        {over && <span className="chip chip-red">Over budget</span>}
        {warn && <span className="chip chip-amber">Alert</span>}
      </div>
      <div className="budget-amounts">
        <span className="budget-spent">{formatCurrency(budget.spent ?? 0, currency)}</span>
        <span className="budget-limit"> / {formatCurrency(budget.limit, currency)}</span>
      </div>
      <div className="budget-bar-track">
        <div className="budget-bar-fill" style={{ width: pct + '%', background: barColor }} />
      </div>
      <div className="budget-footer">
        <span style={{ color: 'var(--text3)', fontSize: '12px' }}>{budget.percentage ?? 0}% used</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(budget)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(budget._id)}>Remove</button>
        </div>
      </div>
    </div>
  );
}
