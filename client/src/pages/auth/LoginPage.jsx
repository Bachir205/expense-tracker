import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import './Auth.css';

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h2>Welcome back</h2>
          <p>Sign in to your account to continue</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="field">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </div>
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="auth-footer">No account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
