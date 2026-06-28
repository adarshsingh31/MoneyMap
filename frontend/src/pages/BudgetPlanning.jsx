import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { getExpenses } from "../services/expenseService";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetService";

const getEmojiCategory = (cat, type) => {
  const normalized = String(cat || "").toLowerCase();
  if (type === "income") {
    if (normalized.includes("salary")) return "💼 Salary";
    if (normalized.includes("freelance")) return "💻 Freelance";
    if (normalized.includes("business")) return "🏢 Business";
    if (normalized.includes("investment")) return "📈 Investment";
    return "📦 Other";
  } else {
    if (normalized.includes("food") || normalized.includes("restaurant")) return "🍔 Food";
    if (normalized.includes("shopping")) return "🛒 Shopping";
    if (normalized.includes("travel") || normalized.includes("transport")) return "🚗 Travel";
    if (normalized.includes("fuel")) return "⛽ Fuel";
    if (normalized.includes("rent")) return "🏠 Rent";
    if (normalized.includes("bill") || normalized.includes("utility") || normalized.includes("utilities")) return "💡 Bills";
    if (normalized.includes("entertainment") || normalized.includes("movie")) return "🎬 Entertainment";
    return "📦 Other";
  }
};

const BudgetPlanning = () => {
  const { logout, user, currencySymbol } = useAuth();
  
  // Budget Form State
  const [budgetAmount, setBudgetAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return new Date().toLocaleString("default", { month: "long" });
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return String(new Date().getFullYear());
  });
  
  // Category Budget Allocations (State defaults)
  const [categoryBudgets, setCategoryBudgets] = useState({
    "🍔 Food": 8000,
    "⛽ Fuel": 3000,
    "🛒 Shopping": 10000,
    "💡 Bills": 5000,
  });

  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Month & Year Options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = ["2025", "2026", "2027", "2028"];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [budgetsRes, expensesRes] = await Promise.all([
        getBudgets(),
        getExpenses()
      ]);
      
      setBudgets(budgetsRes || []);
      setExpenses(expensesRes || []);
      
      // Auto-populate form if budget exists for currently selected month/year
      const currentBudget = (budgetsRes || []).find(
        (b) => b.month === selectedMonth && b.year === selectedYear
      );
      if (currentBudget) {
        setBudgetAmount(currentBudget.amount);
        setEditingId(currentBudget._id);
        setIsEditing(true);
        if (currentBudget.categoryBudgets) {
          setCategoryBudgets(currentBudget.categoryBudgets);
        }
      } else {
        setBudgetAmount("");
        setIsEditing(false);
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load budget data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  // Animation Trigger
  useEffect(() => {
    if (!loading) {
      const cards = document.querySelectorAll(".glass-card");
      cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";
        card.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 50 * index);
      });
    }
  }, [loading]);

  // Compute Total Spent for Selected Month & Year
  const getSpentForPeriod = () => {
    let total = 0;
    const categoryTotals = {};
    
    expenses.forEach((e) => {
      if (e.type === "expense") {
        const d = new Date(e.date || Date.now());
        const validDate = isNaN(d.getTime()) ? new Date() : d;
        const m = validDate.toLocaleString("default", { month: "long" });
        const y = String(validDate.getFullYear());
        
        if (m === selectedMonth && y === selectedYear) {
          total += e.amount;
          const emojiCat = getEmojiCategory(e.category, "expense");
          categoryTotals[emojiCat] = (categoryTotals[emojiCat] || 0) + e.amount;
        }
      }
    });
    
    return { total, categoryTotals };
  };

  const { total: totalSpent, categoryTotals } = getSpentForPeriod();
  const currentBudgetLimit = Number(budgetAmount) || 0;
  const remainingBudget = currentBudgetLimit - totalSpent;
  const percentUsed = currentBudgetLimit > 0 ? (totalSpent / currentBudgetLimit) * 100 : 0;

  // Progress Bar color rules
  const getProgressColor = (pct) => {
    if (pct <= 60) return "bg-primary"; // green
    if (pct <= 85) return "bg-amber-500"; // orange
    if (pct <= 100) return "bg-error"; // red
    return "bg-rose-950"; // dark red
  };

  const getProgressTextColor = (pct) => {
    if (pct <= 60) return "text-primary";
    if (pct <= 85) return "text-amber-500";
    if (pct <= 100) return "text-error";
    return "text-rose-950 font-black";
  };

  // Save budget handler
  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!budgetAmount || Number(budgetAmount) <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }
    
    setError(null);
    setSuccess(null);
    try {
      const budgetData = {
        amount: Number(budgetAmount),
        month: selectedMonth,
        year: selectedYear,
        categoryBudgets,
      };

      if (isEditing && editingId) {
        await updateBudget(editingId, budgetData);
        setSuccess("Budget updated successfully!");
      } else {
        const newBudget = await createBudget(budgetData);
        setEditingId(newBudget._id);
        setIsEditing(true);
        setSuccess("Budget saved successfully!");
      }
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    } catch (err) {
      console.error(err);
      setError("Failed to save budget.");
    }
  };

  // Reset budget handler
  const handleResetBudget = async () => {
    if (!isEditing || !editingId) return;
    if (!window.confirm("Are you sure you want to reset the budget for this period?")) return;
    
    setError(null);
    setSuccess(null);
    try {
      await deleteBudget(editingId);
      setBudgetAmount("");
      setIsEditing(false);
      setEditingId(null);
      setCategoryBudgets({
        "🍔 Food": 8000,
        "⛽ Fuel": 3000,
        "🛒 Shopping": 10000,
        "💡 Bills": 5000,
      });
      setSuccess("Budget reset successfully!");
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    } catch (err) {
      console.error(err);
      setError("Failed to reset budget.");
    }
  };

  // Category Budgets config
  const defaultCategories = ["🍔 Food", "⛽ Fuel", "🛒 Shopping", "💡 Bills"];

  // Custom inline warning alerts logic
  const getAlerts = () => {
    const alerts = [];

    // Overall monthly budget alert
    if (currentBudgetLimit > 0 && percentUsed > 100) {
      const overBy = (percentUsed - 100).toFixed(1);
      alerts.push({
        type: "danger",
        text: `⚠️ You have exceeded your monthly budget by ${overBy}%! (Spent ${currencySymbol}${totalSpent.toLocaleString()} / Limit ${currencySymbol}${currentBudgetLimit.toLocaleString()})`,
        icon: "🔴"
      });
    } else if (currentBudgetLimit > 0 && percentUsed >= 80) {
      alerts.push({
        type: "warning",
        text: `Monthly budget has reached ${Math.round(percentUsed)}%. Watch your spending!`,
        icon: "🟠"
      });
    }

    defaultCategories.forEach((cat) => {
      const limit = categoryBudgets[cat] || 0;
      const spent = categoryTotals[cat] || 0;
      if (limit > 0) {
        const pct = (spent / limit) * 100;
        if (pct > 100) {
          const overBy = (pct - 100).toFixed(1);
          alerts.push({
            type: "danger",
            text: `You exceeded the ${cat.split(" ").slice(1).join(" ")} budget by ${overBy}%! (Spent ${currencySymbol}${spent.toLocaleString()} / Limit ${currencySymbol}${limit.toLocaleString()})`,
            icon: "🔴"
          });
        } else if (pct >= 80) {
          alerts.push({
            type: "warning",
            text: `${cat.split(" ").slice(1).join(" ")} budget has reached ${Math.round(pct)}%.`,
            icon: "🟠"
          });
        } else {
          alerts.push({
            type: "success",
            text: `${cat.split(" ").slice(1).join(" ")} budget is healthy.`,
            icon: "🟢"
          });
        }
      }
    });
    return alerts;
  };

  const currentAlerts = getAlerts();

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
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/categories">
            <span className="material-symbols-outlined">category</span>
            <span className="font-body-md">Categories</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/reports">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-body-md">Reports</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/budget">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="font-medium">Budget Planning</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/ai-analytics">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-body-md">AI Analytics</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Settings</span>
          </Link>
        </nav>
        <div className="mt-auto px-6 border-t border-border pt-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 py-3 text-text-muted hover:text-error transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white/80 backdrop-blur-md border-b border-border shadow-sm z-40 flex justify-between items-center px-gutter">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="font-bold text-lg text-on-surface select-none">Budget Planner</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-on-surface font-bold text-sm leading-none">{user?.name || "Premium User"}</p>
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

        {/* Content Canvas */}
        <main className="mt-16 p-8 flex-grow space-y-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-text-primary mb-1">
              Budget Planning
            </h2>
            <p className="font-body-md text-text-muted">
              Set limits and get real-time alerts before you overspend.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-error-container/30 border border-error/30 rounded-lg text-error text-body-md flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-primary/35 rounded-lg text-primary text-body-md flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          {/* ── Summary Cards Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Monthly Budget Card */}
            <div className="glass-card rounded-xl p-6 bg-white shadow-sm border border-border flex flex-col gap-1">
              <span className="text-text-muted text-sm font-medium">Monthly Budget</span>
              <h2 className="font-data-lg text-headline-lg text-on-surface">
                {currencySymbol}{currentBudgetLimit.toLocaleString("en-IN")}
              </h2>
              <div className="text-[10px] text-text-muted mt-2">
                Active limit for {selectedMonth} {selectedYear}
              </div>
            </div>

            {/* Spent Card */}
            <div className="glass-card rounded-xl p-6 bg-white shadow-sm border border-border flex flex-col gap-1">
              <span className="text-text-muted text-sm font-medium">Amount Spent</span>
              <h2 className="font-data-lg text-headline-lg text-on-surface">
                {currencySymbol}{totalSpent.toLocaleString("en-IN")}
              </h2>
              <div className="text-[10px] text-text-muted mt-2">
                Aggregated expenses in period
              </div>
            </div>

            {/* Remaining Card */}
            <div className="glass-card rounded-xl p-6 bg-white shadow-sm border border-border flex flex-col gap-1">
              <span className="text-text-muted text-sm font-medium">Remaining Budget</span>
              <h2 className={`font-data-lg text-headline-lg ${remainingBudget >= 0 ? "text-primary" : "text-error"}`}>
                {currencySymbol}{remainingBudget.toLocaleString("en-IN")}
              </h2>
              <div className="text-[10px] text-text-muted mt-2">
                {remainingBudget >= 0 ? "Under limit" : "Exceeded limit"}
              </div>
            </div>
          </div>

          {/* ── Progress Card ── */}
          <div className="glass-card rounded-xl p-8 bg-white border border-border shadow-sm space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-on-surface">Budget Utilization</span>
              <span className={getProgressTextColor(percentUsed)}>
                {percentUsed > 100
                  ? `⚠️ ${(percentUsed - 100).toFixed(1)}% over budget!`
                  : `${Math.round(percentUsed)}% of monthly budget used.`}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentUsed)}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>{currencySymbol}{totalSpent.toLocaleString("en-IN")} spent</span>
              <span>Limit: {currencySymbol}{currentBudgetLimit.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* ── Form Section and Category budges in columns ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Set Budget Form Card */}
            <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm flex flex-col justify-between">
              <h3 className="font-headline-md text-text-primary mb-4">Set Monthly Budget</h3>
              <form onSubmit={handleSaveBudget} className="space-y-4">
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">
                    Budget Amount ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 50000"
                    className="w-full border-border rounded-lg px-4 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Month</label>
                    <select
                      className="w-full border-border rounded-lg pl-4 pr-10 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Year</label>
                    <select
                      className="w-full border-border rounded-lg pl-4 pr-10 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub category sliders inside Budget setup */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Allocate Categories</h4>
                  {defaultCategories.map((cat) => (
                    <div key={cat} className="flex justify-between items-center text-xs">
                      <span>{cat}</span>
                      <input
                        type="number"
                        className="w-20 text-right border border-border rounded px-1.5 py-0.5 text-xs text-on-surface"
                        value={categoryBudgets[cat] ?? 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCategoryBudgets(prev => ({
                            ...prev,
                            [cat]: val
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-border mt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-emerald-600 shadow-sm transition-all"
                  >
                    Save Budget
                  </button>
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Simple edit trigger (already binds form values)
                          setSuccess("Editing Mode Active.");
                          setTimeout(() => setSuccess(null), 2000);
                        }}
                        className="flex-1 py-2.5 border border-border text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-all font-semibold"
                      >
                        Edit Budget
                      </button>
                      <button
                        type="button"
                        onClick={handleResetBudget}
                        className="flex-1 py-2.5 bg-red-50 text-error rounded-lg text-sm hover:bg-red-100 transition-all font-semibold"
                      >
                        Reset Budget
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Category Budgets List */}
            <div className="lg:col-span-2 glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
              <h3 className="font-headline-md text-text-primary mb-6">Category Budgets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defaultCategories.map((cat) => {
                  const limit = categoryBudgets[cat] || 0;
                  const spent = categoryTotals[cat] || 0;
                  const catPct = limit > 0 ? (spent / limit) * 100 : 0;
                  
                  return (
                    <div key={cat} className="p-4 border border-border rounded-xl space-y-3 bg-slate-50/50">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-on-surface">{cat}</span>
                        <span className="text-xs text-text-muted">
                          {Math.round(catPct)}% used
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Budget: {currencySymbol}{limit.toLocaleString()}</span>
                        <span>Spent: {currencySymbol}{spent.toLocaleString()}</span>
                      </div>
                      
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${getProgressColor(catPct)}`}
                          style={{ width: `${Math.min(catPct, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Budget Alerts & Alerts Feed ── */}
          <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
            <h3 className="font-headline-md text-text-primary mb-4">Budget Alerts</h3>
            <div className="space-y-3">
              {currentAlerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-lg flex items-center gap-3 text-sm font-semibold border ${
                    alert.type === "danger" 
                      ? "bg-red-50 border-red-200 text-error" 
                      : alert.type === "warning" 
                      ? "bg-amber-50 border-amber-200 text-amber-600" 
                      : "bg-emerald-50 border-emerald-250 text-primary"
                  }`}
                >
                  <span className="text-lg">{alert.icon}</span>
                  <span>{alert.text}</span>
                </div>
              ))}
              {currentAlerts.length === 0 && (
                <p className="text-center text-text-muted text-sm py-4">
                  No budget alerts available. Set limits to view alerts.
                </p>
              )}
            </div>
          </div>

          {/* ── History Card ── */}
          <div className="glass-card rounded-xl overflow-hidden bg-white border border-border shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-slate-50/50">
              <h3 className="font-headline-md text-text-primary">Budget History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-text-muted font-label-sm border-b border-border">
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Month</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Budget</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Spent</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Remaining</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {budgets.map((b) => {
                    // Quick period spending count
                    let periodSpent = 0;
                    expenses.forEach((e) => {
                      if (e.type === "expense") {
                        const d = new Date(e.date || Date.now());
                        const validDate = isNaN(d.getTime()) ? new Date() : d;
                        const m = validDate.toLocaleString("default", { month: "long" });
                        const y = String(validDate.getFullYear());
                        if (m === b.month && y === b.year) periodSpent += e.amount;
                      }
                    });
                    
                    const rem = b.amount - periodSpent;
                    const remPct = b.amount > 0 ? (periodSpent / b.amount) * 100 : 0;
                    
                    return (
                      <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-data-md text-data-md text-on-surface">
                          {b.month} {b.year}
                        </td>
                        <td className="px-6 py-4 font-data-md text-data-md text-on-surface">
                          {currencySymbol}{b.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-data-md text-data-md text-on-surface">
                          {currencySymbol}{periodSpent.toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 font-data-md text-data-md ${rem >= 0 ? "text-primary" : "text-error"}`}>
                          {currencySymbol}{rem.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            remPct <= 60 
                              ? "bg-emerald-50 text-primary" 
                              : remPct <= 85 
                              ? "bg-amber-50 text-amber-500" 
                              : "bg-red-50 text-error"
                          }`}>
                            {remPct <= 60 ? "Healthy" : remPct <= 85 ? "Warning" : "Exceeded"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {budgets.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                        No budget history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BudgetPlanning;
