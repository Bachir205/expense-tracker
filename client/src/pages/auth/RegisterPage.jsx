import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { CURRENCIES } from '../../utils/constants.js';
import toast from 'react-hot-toast';
import './Auth.css';

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', currency: 'USD' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.currency);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-card fade-in">
          <div className="auth-logo">
            <div className="auth-logo-icon">💰</div>
            Spendly
          </div>
          <h2>Create account</h2>
          <p>Start taking control of your finances</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Full name</label>
              <input className="input" type="text" placeholder="Jane Doe" value={form.name} onChange={set('name')} required />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="field">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} minLength={6} required />
            </div>
            <div className="field">
              <label className="label">Currency</label>
              <select className="input" value={form.currency} onChange={set('currency')}>
                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.value} ({c.symbol})</option>)}
              </select>
            </div>
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
