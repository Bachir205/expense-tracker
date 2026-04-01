require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connection.js');

connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/auth',      require('./routes/auth'));
app.use('/expenses',  require('./routes/expenses'));
app.use('/budgets',   require('./routes/budgets'));
app.use('/analytics', require('./routes/analytics'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});