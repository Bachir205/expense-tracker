import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

export const formatDate = (date, fmt = 'MMM d, yyyy') =>
  format(typeof date === 'string' ? parseISO(date) : date, fmt);

export const getMonthRange = (month, year) => ({
  startDate: format(startOfMonth(new Date(year, month)), 'yyyy-MM-dd'),
  endDate:   format(endOfMonth(new Date(year, month)),   'yyyy-MM-dd'),
});

export const groupByDate = (expenses) => {
  return expenses.reduce((groups, expense) => {
    const date = formatDate(expense.date, 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(expense);
    return groups;
  }, {});
};
