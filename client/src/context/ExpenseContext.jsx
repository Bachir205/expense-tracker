import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [expenses,  setExpenses]  = useState([]);
  const [summary,   setSummary]   = useState(null);
  const [budgets,   setBudgets]   = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(false);

  const fetchExpenses = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/expenses', { params });
      setExpenses(res.data.expenses);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = async (data) => {
    const res = await api.post('/expenses', data);
    setExpenses(prev => [res.data.expense, ...prev]);
    toast.success('Expense added!');
    return res.data.expense;
  };

  const updateExpense = async (id, data) => {
    const res = await api.put(`/expenses/${id}`, data);
    setExpenses(prev => prev.map(e => e._id === id ? res.data.expense : e));
    toast.success('Expense updated!');
    return res.data.expense;
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    setExpenses(prev => prev.filter(e => e._id !== id));
    toast.success('Expense deleted');
  };

  const fetchSummary = useCallback(async (month, year) => {
    const res = await api.get('/analytics/summary', { params: { month, year } });
    setSummary(res.data);
    return res.data;
  }, []);

  const fetchBudgets = useCallback(async (month, year) => {
    const res = await api.get('/budgets', { params: { month, year } });
    setBudgets(res.data.budgets);
    return res.data.budgets;
  }, []);

  const fetchAnalytics = useCallback(async (month, year) => {
    const [catRes, trendRes] = await Promise.all([
      api.get('/analytics/by-category', { params: { month, year } }),
      api.get('/analytics/trend'),
    ]);
    const data = { byCategory: catRes.data.data, trend: trendRes.data.data };
    setAnalytics(data);
    return data;
  }, []);

  return (
    <ExpenseContext.Provider value={{
      expenses, summary, budgets, analytics, loading,
      fetchExpenses, createExpense, updateExpense, deleteExpense,
      fetchSummary, fetchBudgets, fetchAnalytics,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
