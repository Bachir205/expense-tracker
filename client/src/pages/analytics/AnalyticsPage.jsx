import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useExpenses } from '../../context/ExpenseContext.jsx';
import { getCategoryMeta, formatCurrency, MONTHS } from '../../utils/constants.js';
import MonthPicker from '../../components/ui/MonthPicker.jsx';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import './AnalyticsPage.css';

const CHART_COLORS = ['#7c6aff','#22d3a0','#ff5f7e','#ffb347','#3b8bd4','#d4537e','#85b7eb','#1d9e75','#5f5e5a'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { fetchAnalytics, analytics, fetchSummary, summary } = useExpenses();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());

  useEffect(() => {
    fetchAnalytics(month, year);
    fetchSummary(month, year);
  }, [month, year]);

  const pieData = (analytics?.byCategory || []).map(d => ({
    name:  getCategoryMeta(d._id).label,
    value: d.total,
    emoji: getCategoryMeta(d._id).emoji,
  }));

  const trendMap = {};
  (analytics?.trend || []).forEach(d => {
    const key = `${MONTHS[d._id.month - 1].slice(0, 3)} ${d._id.year}`;
    if (!trendMap[key]) trendMap[key] = { name: key, expense: 0, income: 0 };
    trendMap[key][d._id.type] = d.total;
  });
  const trendData = Object.values(trendMap);

  const tooltipStyle = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' };

  return (
    <div className="analytics-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Visual breakdown of your spending</p>
        </div>
        <MonthPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total spent</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{formatCurrency(summary?.totalExpenses ?? 0, user?.currency)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total income</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{formatCurrency(summary?.totalIncome ?? 0, user?.currency)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Net balance</div>
          <div className="stat-value" style={{ color: (summary?.balance ?? 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {formatCurrency(summary?.balance ?? 0, user?.currency)}
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Spending by category</h3></div>
          {pieData.length === 0 ? <p className="empty-state">No expense data this month</p> : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => formatCurrency(v, user?.currency)} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map((d, i) => (
                  <div key={i} className="pie-legend-item">
                    <span className="pie-dot" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span>{d.emoji} {d.name}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                      {formatCurrency(d.value, user?.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">6-month trend</h3></div>
          {trendData.length === 0 ? <p className="empty-state">Not enough data yet</p> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '$' + v} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => formatCurrency(v, user?.currency)} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="expense" name="Expenses" fill="var(--red)"   radius={[4,4,0,0]} maxBarSize={32} />
                <Bar dataKey="income"  name="Income"   fill="var(--green)" radius={[4,4,0,0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
