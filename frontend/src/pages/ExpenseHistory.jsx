import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const ExpenseHistory = () => {
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedMonth, setSelectedMonth] = useState("All Months");

  // Transactions State
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      desc: "Food",
      category: "Food",
      type: "expense",
      amount: 500,
      date: "28 Jun 2026",
      icon: "restaurant",
      iconBg: "bg-orange-50 text-orange-500"
    },
    {
      id: 2,
      desc: "Salary",
      category: "Salary",
      type: "income",
      amount: 50000,
      date: "27 Jun 2026",
      icon: "payments",
      iconBg: "bg-emerald-50 text-primary"
    },
    {
      id: 3,
      desc: "Fuel",
      category: "Transport",
      type: "expense",
      amount: 200,
      date: "25 Jun 2026",
      icon: "local_gas_station",
      iconBg: "bg-blue-50 text-blue-500"
    },
    {
      id: 4,
      desc: "Netflix",
      category: "Entertainment",
      type: "expense",
      amount: 499,
      date: "24 Jun 2026",
      icon: "movie",
      iconBg: "bg-red-50 text-red-600"
    }
  ]);

  useEffect(() => {
    const cards = document.querySelectorAll(".glass-card, h1, p, button");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      card.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 50 * index);
    });
  }, []);

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      t.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesType =
      selectedType === "All Types" ||
      t.type.toLowerCase() === selectedType.toLowerCase();
    const matchesMonth =
      selectedMonth === "All Months" ||
      t.date.includes(selectedMonth.split(" ")[0]);
    return matchesSearch && matchesCategory && matchesType && matchesMonth;
  });

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-background text-on-surface min-h-screen">
      {/* Side Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-border shadow-sm z-50 flex flex-col py-gutter">
        <div className="px-6 mb-8 flex items-center gap-3">
          <img alt="MoneyMap Logo" className="w-10 h-10 object-contain" src={logo} />
          <span className="font-headline-md text-headline-md font-bold text-primary">MoneyMap</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/transactions">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-medium">Transactions</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/add-transaction">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-body-md">Add Transaction</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/categories">
            <span className="material-symbols-outlined">category</span>
            <span className="font-body-md">Categories</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/reports">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-body-md">Reports</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Settings</span>
          </Link>
        </nav>
        <div className="mt-auto px-6 border-t border-border pt-4">
          <Link className="flex items-center gap-3 py-3 text-text-muted hover:text-error transition-colors" to="/">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Top Navigation */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white border-b border-border shadow-sm z-40 flex justify-between items-center px-gutter">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-border w-80">
            <span className="material-symbols-outlined text-text-muted text-sm mr-2">search</span>
            <input
              className="bg-transparent border-none text-sm text-on-surface focus:ring-0 w-full placeholder:text-text-muted focus:outline-none"
              placeholder="Search transactions..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative text-text-muted hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button className="text-text-muted hover:text-primary transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="h-8 w-px bg-border"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-on-surface font-bold text-sm leading-none">Premium User</p>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mt-1">Tier 1 Analytics</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-container p-0.5">
              <img
                className="w-full h-full rounded-full object-cover"
                alt="Premium User Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCri9PyXic65bVGnjayUMgd-OrCKi034yE8M5MrREU_uBSWzC_1L1nIW6Wqvl9YcrW1mam49lN5yby52zX1SIfFzQYc445pIyO1d6ViYHMCrctSQ3YM3soVbxhnPs1egAJqgCWY3atJ8J3s_EWgVUukzFVw2791cJKRJfmaRLNjg-mHaVT6EyPsSEhkDi1aEIxuLSieWo3nSZpkyQoHM6l5_wJZLIIQKTKArrG5bPleLmY599dGhTy0c5V98l3ctpm2RcllrXtv8I"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64 mt-16 p-gutter min-h-[calc(100vh-4rem)]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary">Expense History</h1>
            <p className="text-text-muted mt-1">View and manage all your transactions</p>
          </div>
          <button
            onClick={() => navigate("/add-transaction")}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-body-md font-bold shadow-sm hover:bg-emerald-600 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Add Transaction
          </button>
        </div>

        {/* Filter Section */}
        <div className="glass-card rounded-xl p-6 mb-stack-lg bg-white shadow-sm border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg">
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted block">Search Transaction</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
                <input
                  className="w-full bg-slate-50 border border-outline rounded-lg pl-9 pr-4 py-2 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Search by title..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted block">Category</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-50 border border-outline rounded-lg px-4 py-2 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Salary">Salary</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted block">Type</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-50 border border-outline rounded-lg px-4 py-2 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All Types">All Types</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted block">Month</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-50 border border-outline rounded-lg px-4 py-2 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="All Months">All Months</option>
                  <option value="June 2026">June 2026</option>
                  <option value="May 2026">May 2026</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List Section */}
        <div className="glass-card rounded-xl overflow-hidden mb-8 bg-white shadow-sm border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-border/30">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.iconBg}`}>
                          <span className="material-symbols-outlined">{t.icon}</span>
                        </div>
                        <div>
                          <p className="text-on-surface font-semibold text-lg">{t.desc}</p>
                          <p className="text-[10px] text-text-muted">Category: {t.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        t.type === "income" ? "bg-emerald-50 text-primary" : "bg-red-50 text-error"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className={`font-data-lg font-bold ${
                        t.type === "income" ? "text-emerald-600" : "text-error"
                      }`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-text-muted">{t.date}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-text-muted hover:text-primary transition-colors border border-outline rounded-lg bg-white">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-2 text-text-muted hover:text-error transition-colors border border-outline rounded-lg bg-white"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-text-muted">
                      No transactions found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-border flex items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-text-muted hover:bg-slate-50 transition-colors font-medium">
              <span className="material-symbols-outlined">chevron_left</span> Previous
            </button>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-lg bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 rounded-lg border border-outline text-text-muted hover:bg-slate-50 transition-colors">2</button>
              <button className="w-10 h-10 rounded-lg border border-outline text-text-muted hover:bg-slate-50 transition-colors">3</button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-text-muted hover:bg-slate-50 transition-colors font-medium">
              Next <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Link
        to="/add-transaction"
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary rounded-full shadow-lg shadow-emerald-200/50 hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-white z-50"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          add
        </span>
      </Link>
    </div>
  );
};

export default ExpenseHistory;
