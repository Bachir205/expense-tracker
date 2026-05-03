import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import LoginPage     from './pages/auth/LoginPage.jsx';
import RegisterPage  from './pages/auth/RegisterPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import ExpensesPage  from './pages/expenses/ExpensesPage.jsx';
import BudgetsPage   from './pages/budgets/BudgetsPage.jsx';
import AnalyticsPage from './pages/analytics/AnalyticsPage.jsx';
import Layout        from './components/layout/Layout.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div className="spinner" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index               element={<DashboardPage />} />
        <Route path="expenses"     element={<ExpensesPage />} />
        <Route path="budgets"      element={<BudgetsPage />} />
        <Route path="analytics"    element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            style: { background:'var(--bg2)', color:'var(--text1)', border:'1px solid var(--border2)', fontSize:'14px' }
          }}/>
          <AppRoutes />
          <Analytics />
        </BrowserRouter>
      </ExpenseProvider>
    </AuthProvider>
  );
}
