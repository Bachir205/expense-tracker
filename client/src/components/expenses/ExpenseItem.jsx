import { getCategoryMeta, formatCurrency } from '../../utils/constants.js';
import { formatDate } from '../../utils/helpers.js';
import './ExpenseItem.css';

export default function ExpenseItem({ expense, currency, onEdit, onDelete }) {
  const cat = getCategoryMeta(expense.category);
  const isIncome = expense.type === 'income';

  return (
    <div className="expense-item fade-in">
      <div className="expense-cat-icon" style={{ background: cat.color + '22', color: cat.color }}>
        {cat.emoji}
      </div>
      <div className="expense-info">
        <div className="expense-title">{expense.title}</div>
        <div className="expense-meta">
          <span style={{ color: cat.color }}>{cat.label}</span>
          {expense.tags?.map(t => <span key={t} className="expense-tag">{t}</span>)}
          <span>{formatDate(expense.date)}</span>
        </div>
      </div>
      <div className="expense-amount" style={{ color: isIncome ? 'var(--green)' : 'var(--text1)' }}>
        {isIncome ? '+' : '-'}{formatCurrency(expense.amount, currency)}
      </div>
      <div className="expense-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(expense)}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(expense._id)}>Del</button>
      </div>
    </div>
  );
}
