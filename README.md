# DogalXaliss — Expense Tracker

> A full-stack personal finance tracker built with the MERN stack. Track income and expenses, manage budgets by category, and get a clear monthly snapshot of your financial health.

🌐 **Live demo:** [expense-tracker-nine-rouge-45.vercel.app](https://expense-tracker-nine-rouge-45.vercel.app)

---

## ✨ Features

- **Dashboard** — monthly financial snapshot with total income, expenses, net balance, and transaction count
- **Expense & income tracking** — add, view, and delete transactions with categories and dates
- **Budget management** — set budgets per category and track spending progress in real time
- **Analytics** — visualize spending patterns over time
- **Authentication** — secure sign-up / login with JWT
- **Multi-currency support** — CFA Franc (XOF) and more
- **Month navigation** — browse history month by month

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Deployment | Vercel (client), Render (server) |

---

## 📁 Project Structure

```
expense-tracker/
├── client/                 # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components (Sidebar, Navbar…)
│       ├── pages/          # Dashboard, Expenses, Budgets, Analytics
│       ├── context/        # Auth & global state
│       └── App.jsx
│
└── server/                 # Express backend
    ├── models/             # Mongoose schemas (User, Transaction, Budget)
    ├── routes/             # API route definitions
    ├── middleware/         # Auth middleware
    └── index.js
```

---

---

## 🗺 Roadmap

- [ ] Profile page with editable user info
- [ ] Dark/light theme toggle
- [ ] Recurring transactions
- [ ] Export data as CSV

---

## 👤 Author

**Bachir** — [@Bachir205](https://github.com/Bachir205)

---
