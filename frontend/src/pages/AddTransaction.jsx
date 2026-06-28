import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const AddTransaction = () => {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2026-06-28");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [description, setDescription] = useState("");

  const categoryIcons = {
    food: "restaurant",
    shopping: "shopping_bag",
    transport: "directions_car",
    utilities: "bolt",
    entertainment: "movie"
  };

  useEffect(() => {
    const card = document.querySelector(".glass-card");
    if (card) {
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      card.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate transaction saving
    console.log("Saving transaction:", { title, amount, date, type, category, description });
    // Redirect back to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-background text-on-background min-h-screen">
      {/* Side Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-border shadow-sm z-50 flex flex-col py-gutter">
        <div className="px-6 mb-8 flex items-center gap-3">
          <img alt="MoneyMap Logo" className="w-10 h-10 object-contain" src={logo} />
          <span className="font-headline-md text-headline-md font-bold text-primary">MoneyMap</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/transactions">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-body-md">Transactions</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/add-transaction">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-medium">Add Transaction</span>
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
            <input className="bg-transparent border-none text-sm text-on-surface focus:ring-0 w-full placeholder:text-text-muted focus:outline-none" placeholder="Search transactions..." type="text" />
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
        <div className="max-w-3xl mx-auto py-stack-lg">
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-text-muted hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Back to Dashboard</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-xl overflow-hidden bg-white shadow-sm border border-border">
            <div className="p-8 border-b border-border bg-slate-50/50">
              <div className="flex flex-col items-center text-center">
                <img alt="MoneyMap" className="w-16 h-16 mb-4" src={logo} />
                <h2 className="text-headline-lg font-headline-lg text-text-primary">Add New Transaction</h2>
                <p className="text-text-muted mt-2">Log your daily expenses and income precisely.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Title <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">description</span>
                  <input
                    required
                    className="w-full border-border rounded-lg pl-12 pr-4 py-3 form-input-focus transition-all text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Grocery Shopping"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Amount <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-data-lg text-data-lg">₹</span>
                    <input
                      required
                      min="0.01"
                      step="any"
                      className="w-full border-border rounded-lg pl-10 pr-4 py-3 font-data-lg text-data-lg form-input-focus transition-all text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="0.00"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Date <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">calendar_today</span>
                    <input
                      required
                      className="w-full border-border rounded-lg pl-12 pr-4 py-3 form-input-focus transition-all text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Dropdown */}
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Type <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 ${
                      type === "expense" ? "text-error" : "text-primary"
                    }`}>
                      {type === "expense" ? "trending_down" : "trending_up"}
                    </span>
                    <select
                      className="w-full border-border rounded-lg pl-12 pr-10 py-3 form-input-focus transition-all text-on-surface appearance-none bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Category <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary" id="category-icon">
                      {categoryIcons[category] || "category"}
                    </span>
                    <select
                      className="w-full border-border rounded-lg pl-12 pr-10 py-3 form-input-focus transition-all text-on-surface appearance-none bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      id="category-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="food">Food</option>
                      <option value="shopping">Shopping</option>
                      <option value="transport">Transport</option>
                      <option value="utilities">Utilities</option>
                      <option value="entertainment">Entertainment</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Description (Optional)</label>
                <textarea
                  className="w-full border-border rounded-lg px-4 py-3 form-input-focus transition-all text-on-surface resize-none bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Add a note about this transaction..."
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full sm:w-1/2 py-4 border border-border text-text-muted hover:bg-slate-50 hover:text-on-surface rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
                  type="button"
                >
                  <span>Cancel</span>
                </button>
                <button
                  className="w-full sm:w-1/2 py-4 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center space-x-2"
                  type="submit"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                  <span>Save Transaction</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer Message */}
          <p className="text-center text-label-sm text-text-muted mt-8">
            Your transaction will be encrypted and synced across all devices.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AddTransaction;
