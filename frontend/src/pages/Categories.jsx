import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Categories = () => {
  const navigate = useNavigate();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Categories State
  const [expenseCategories, setExpenseCategories] = useState([
    { id: 1, name: "Food", amount: 4500, count: 18, icon: "restaurant", iconBg: "bg-orange-50 text-orange-500" },
    { id: 2, name: "Fuel", amount: 2300, count: 10, icon: "local_gas_station", iconBg: "bg-blue-50 text-blue-500" },
    { id: 3, name: "Shopping", amount: 7800, count: 12, icon: "shopping_bag", iconBg: "bg-slate-100 text-slate-600" }
  ]);

  const [incomeCategories, setIncomeCategories] = useState([
    { id: 1, name: "Salary", amount: 50000, count: 1, icon: "payments", iconBg: "bg-emerald-50 text-primary" },
    { id: 2, name: "Freelance", amount: 1200, count: 3, icon: "work", iconBg: "bg-blue-50 text-blue-600" }
  ]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState("expense");
  const [newCatIcon, setNewCatIcon] = useState("category");

  useEffect(() => {
    // Smooth reveal animation
    const cards = document.querySelectorAll(".glass-card, h2, p, button");
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

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCategory = {
      id: Date.now(),
      name: newCatName,
      amount: 0,
      count: 0,
      icon: newCatIcon,
      iconBg: "bg-slate-100 text-slate-600"
    };

    if (newCatType === "expense") {
      setExpenseCategories([...expenseCategories, newCategory]);
    } else {
      setIncomeCategories([...incomeCategories, newCategory]);
    }

    setNewCatName("");
    setNewCatIcon("category");
    setShowAddModal(false);
  };

  const handleDeleteExpense = (id) => {
    setExpenseCategories(expenseCategories.filter((c) => c.id !== id));
  };

  const handleDeleteIncome = (id) => {
    setIncomeCategories(incomeCategories.filter((c) => c.id !== id));
  };

  const filteredExpenses = expenseCategories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIncomes = incomeCategories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-background text-on-surface min-h-screen">
      {/* Side Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-border shadow-sm z-50 flex flex-col py-gutter">
        <div className="px-6 mb-8 flex flex-col items-center gap-2">
          <img alt="MoneyMap Logo" className="w-12 h-12 object-contain" src={logo} />
          <h1 className="font-headline-md text-headline-md font-bold text-primary">MoneyMap</h1>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/transactions">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-body-md">Transactions</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/add-transaction">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-body-md">Add Transaction</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/categories">
            <span className="material-symbols-outlined">category</span>
            <span className="font-medium">Categories</span>
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

      {/* Main Content Wrapper */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white border-b border-border shadow-sm z-40 flex justify-between items-center px-gutter">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-border w-80">
              <span className="material-symbols-outlined text-text-muted text-sm mr-2">search</span>
              <input
                className="bg-transparent border-none text-sm text-on-surface focus:ring-0 w-full placeholder:text-text-muted focus:outline-none"
                placeholder="Search categories..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="relative text-text-muted hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button className="text-text-muted hover:text-primary transition-colors">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-on-surface font-bold text-sm leading-none">Premium User</p>
                <p className="text-text-muted text-[10px] uppercase tracking-wider mt-1">ELITE STATUS</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary p-0.5">
                <img
                  className="w-full h-full rounded-full object-cover"
                  alt="Premium User Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCri9PyXic65bVGnjayUMgd-OrCKi034yE8M5MrREU_uBSWzC_1L1nIW6Wqvl9YcrW1mam49lN5yby52zX1SIfFzQYc445pIyO1d6ViYHMCrctSQ3YM3soVbxhnPs1egAJqgCWY3atJ8J3s_EWgVUukzFVw2791cJKRJfmaRLNjg-mHaVT6EyPsSEhkDi1aEIxuLSieWo3nSZpkyQoHM6l5_wJZLIIQKTKArrG5bPleLmY599dGhTy0c5V98l3ctpm2RcllrXtv8I"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mt-16 p-8 flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-text-primary mb-1">Categories</h2>
              <p className="font-body-md text-text-muted">Manage your income and expense categories for better financial mapping.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold font-body-md flex items-center gap-2 hover:bg-emerald-600 shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 gap-gutter">
            {/* Expense Categories Section */}
            <section className="glass-card rounded-xl overflow-hidden bg-white border border-border shadow-sm">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50/50">
                <h3 className="font-headline-md text-headline-md text-text-primary">Expense Categories</h3>
                <span className="font-label-sm text-label-sm text-text-muted">{filteredExpenses.length} Total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-text-muted font-label-sm border-b border-border">
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Total Amount</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Transactions</th>
                      <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredExpenses.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.iconBg}`}>
                              <span className="material-symbols-outlined">{c.icon}</span>
                            </div>
                            <span className="font-body-md font-semibold">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-data-md text-error">₹{c.amount.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 font-body-md text-text-muted">{c.count} Transactions</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-text-muted hover:text-primary transition-colors border border-outline rounded-lg bg-white shadow-sm">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(c.id)}
                              className="p-2 text-text-muted hover:text-error transition-colors border border-outline rounded-lg bg-white shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                          No expense categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Income Categories Section */}
            <section className="glass-card rounded-xl overflow-hidden bg-white border border-border shadow-sm">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50/50">
                <h3 className="font-headline-md text-headline-md text-text-primary">Income Categories</h3>
                <span className="font-label-sm text-label-sm text-text-muted">{filteredIncomes.length} Total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-text-muted font-label-sm border-b border-border">
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Total Amount</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Transactions</th>
                      <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredIncomes.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.iconBg}`}>
                              <span className="material-symbols-outlined">{c.icon}</span>
                            </div>
                            <span className="font-body-md font-semibold">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-data-md text-emerald-600">₹{c.amount.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 font-body-md text-text-muted">{c.count} Transactions</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-text-muted hover:text-primary transition-colors border border-outline rounded-lg bg-white shadow-sm">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteIncome(c.id)}
                              className="p-2 text-text-muted hover:text-error transition-colors border border-outline rounded-lg bg-white shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredIncomes.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                          No income categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Category Distribution Chart mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-8">
              <section className="lg:col-span-2 glass-card rounded-xl p-8 bg-white border border-border shadow-sm">
                <h3 className="font-headline-md text-headline-md text-text-primary mb-8">Category Distribution (Expense)</h3>
                <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                  {/* Circular Visualization */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth="3.5"
                      />
                      {/* Food segment (approx 50%) */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#F59E0B"
                        strokeDasharray="52, 100"
                        strokeDashoffset="0"
                        strokeWidth="3.5"
                      />
                      {/* Fuel segment (approx 20%) */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3B82F6"
                        strokeDasharray="18, 100"
                        strokeDashoffset="-52"
                        strokeWidth="3.5"
                      />
                      {/* Shopping segment (approx 30%) */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#64748B"
                        strokeDasharray="30, 100"
                        strokeDashoffset="-70"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-bold font-data-lg text-text-primary">3</span>
                      <p className="text-[10px] text-text-muted uppercase font-semibold">Expense Categories</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex-grow max-w-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="font-semibold text-on-surface">Food</span>
                      </div>
                      <span className="font-data-md text-text-muted">52%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-semibold text-on-surface">Fuel</span>
                      </div>
                      <span className="font-data-md text-text-muted">18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                        <span className="font-semibold text-on-surface">Shopping</span>
                      </div>
                      <span className="font-data-md text-text-muted">30%</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-text-primary">Add New Category</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-muted hover:text-on-surface p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Category Name</label>
                <input
                  required
                  placeholder="e.g. Subscriptions"
                  className="w-full border-border rounded-lg px-4 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Type</label>
                <div className="relative">
                  <select
                    className="w-full border-border rounded-lg pl-4 pr-10 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                    value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value)}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                </div>
              </div>
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Icon</label>
                <div className="relative">
                  <select
                    className="w-full border-border rounded-lg pl-4 pr-10 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                  >
                    <option value="category">Category Default</option>
                    <option value="bolt">Bolt / Utility</option>
                    <option value="movie">Movie / Leisure</option>
                    <option value="flight">Flight / Travel</option>
                    <option value="shopping_bag">Shopping</option>
                    <option value="medical_services">Medical</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-3 border border-border text-text-muted hover:bg-slate-50 hover:text-on-surface rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-primary text-white font-bold rounded-lg hover:bg-emerald-600 shadow-sm transition-all"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
