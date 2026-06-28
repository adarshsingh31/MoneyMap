import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import {
  getDashboardSummary,
  getRecentTransactions,
  getCategorySummary,
  getExpenses
} from "../services/expenseService";

const categoryStyles = {
  food: { icon: "restaurant", iconBg: "bg-orange-50 text-orange-500" },
  shopping: { icon: "shopping_bag", iconBg: "bg-slate-100 text-slate-600" },
  transport: { icon: "directions_car", iconBg: "bg-blue-50 text-blue-500" },
  utilities: { icon: "bolt", iconBg: "bg-yellow-50 text-yellow-600" },
  entertainment: { icon: "movie", iconBg: "bg-red-50 text-red-600" },
  salary: { icon: "payments", iconBg: "bg-emerald-50 text-primary" },
  freelance: { icon: "work", iconBg: "bg-blue-50 text-blue-600" }
};

const getCategoryStyle = (cat) => {
  const normalized = String(cat || "").toLowerCase();
  if (normalized.includes("food")) return categoryStyles.food;
  if (normalized.includes("shopping")) return categoryStyles.shopping;
  if (normalized.includes("travel") || normalized.includes("transport") || normalized.includes("fuel")) return categoryStyles.transport;
  if (normalized.includes("bills") || normalized.includes("utilities") || normalized.includes("rent")) return categoryStyles.utilities;
  if (normalized.includes("entertainment") || normalized.includes("movie")) return categoryStyles.entertainment;
  if (normalized.includes("salary") || normalized.includes("payment")) return categoryStyles.salary;
  if (normalized.includes("freelance") || normalized.includes("work")) return categoryStyles.freelance;
  return { icon: "category", iconBg: "bg-slate-100 text-slate-600" };
};

const getEmojiCategory = (cat, type) => {
  const normalized = String(cat || "").toLowerCase();
  if (type === "income") {
    if (normalized.includes("salary")) return "💼 Salary";
    if (normalized.includes("freelance")) return "💻 Freelance";
    if (normalized.includes("business")) return "🏢 Business";
    if (normalized.includes("investment")) return "📈 Investment";
    if (normalized.includes("interest")) return "🏦 Interest";
    if (normalized.includes("gift")) return "🎁 Gift";
    if (normalized.includes("refund")) return "💸 Refund";
    if (normalized.includes("bonus")) return "🪙 Bonus";
    if (normalized.includes("rental")) return "💰 Rental Income";
    if (normalized.includes("online") || normalized.includes("earnings")) return "📱 Online Earnings";
    if (normalized.includes("prize")) return "🏆 Prize";
    return "📦 Other";
  } else {
    if (normalized.includes("food") || normalized.includes("restaurant")) return "🍔 Food";
    if (normalized.includes("shopping")) return "🛒 Shopping";
    if (normalized.includes("travel") || normalized.includes("transport")) return "🚗 Travel";
    if (normalized.includes("fuel")) return "⛽ Fuel";
    if (normalized.includes("rent")) return "🏠 Rent";
    if (normalized.includes("bill") || normalized.includes("utility") || normalized.includes("utilities")) return "💡 Bills";
    if (normalized.includes("entertainment") || normalized.includes("movie")) return "🎬 Entertainment";
    if (normalized.includes("healthcare") || normalized.includes("medical")) return "🏥 Healthcare";
    if (normalized.includes("education") || normalized.includes("book")) return "📚 Education";
    if (normalized.includes("personal") || normalized.includes("care")) return "🛍 Personal Care";
    if (normalized.includes("gift")) return "🎁 Gifts";
    if (normalized.includes("subscription")) return "📱 Subscriptions";
    if (normalized.includes("business")) return "💼 Business";
    return "📦 Other";
  }
};

const Dashboard = () => {
  const { logout, user, currencySymbol } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Graph Mode State
  const [viewMode, setViewMode] = useState("monthly"); // "daily" or "monthly"

  // Dynamic API States
  const [summary, setSummary] = useState({ balance: 0, totalIncome: 0, totalExpense: 0, transactionCount: 0 });
  const [transactions, setTransactions] = useState([]);
  const [categorySummary, setCategorySummary] = useState({});
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, recentRes, categoryRes, allExpensesRes] = await Promise.all([
        getDashboardSummary(),
        getRecentTransactions(),
        getCategorySummary(),
        getExpenses(),
      ]);

      setSummary(summaryRes);
      setAllExpenses(allExpensesRes || []);
      
      const normalizedTransactions = (recentRes.transactions || []).map((t) => ({
        ...t,
        category: getEmojiCategory(t.category, t.type)
      }));
      setTransactions(normalizedTransactions);

      const normalizedCatSummary = {};
      Object.entries(categoryRes.categorySummary || {}).forEach(([cat, amount]) => {
        const emojiCat = getEmojiCategory(cat, "expense");
        normalizedCatSummary[emojiCat] = (normalizedCatSummary[emojiCat] || 0) + amount;
      });
      setCategorySummary(normalizedCatSummary);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const cards = document.querySelectorAll(".glass-card");
      cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";
        card.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 80 * index);
      });
    }
  }, [loading]);

  const filteredTransactions = transactions.filter((t) =>
    (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expensePercentage = summary.totalIncome > 0 
    ? Math.min((summary.totalExpense / summary.totalIncome) * 100, 100) 
    : (summary.totalExpense > 0 ? 100 : 0);

  // Compute graph data based on selected view mode
  const monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let dataPoints = [];
  let maxVal = 1000;

  if (viewMode === "monthly") {
    const monthlyExpenses = {};
    allExpenses.forEach((t) => {
      if (t.type === "expense") {
        const d = new Date(t.date || Date.now());
        const validDate = isNaN(d.getTime()) ? new Date() : d;
        const m = validDate.toLocaleString("default", { month: "long" });
        monthlyExpenses[m] = (monthlyExpenses[m] || 0) + t.amount;
      }
    });

    maxVal = Math.max(...Object.values(monthlyExpenses), 1000);

    dataPoints = monthsAbbr.map((abbr, index) => {
      const fullName = fullMonthNames[index];
      const amount = monthlyExpenses[fullName] || 0;
      const percentage = Math.min((amount / maxVal) * 100, 100);
      const isCurrent = new Date().getMonth() === index;
      return {
        label: abbr,
        amount,
        percentage: Math.max(percentage, 2),
        isCurrent
      };
    });
  } else {
    // Daily View - Last 7 Days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d);
    }

    const dailyExpenses = {};
    last7Days.forEach((date) => {
      dailyExpenses[date.toDateString()] = 0;
    });

    allExpenses.forEach((t) => {
      if (t.type === "expense") {
        const d = new Date(t.date || Date.now());
        const validDate = isNaN(d.getTime()) ? new Date() : d;
        const tDate = validDate.toDateString();
        if (dailyExpenses[tDate] !== undefined) {
          dailyExpenses[tDate] += t.amount;
        }
      }
    });

    maxVal = Math.max(...Object.values(dailyExpenses), 1000);

    dataPoints = last7Days.map((date) => {
      const amount = dailyExpenses[date.toDateString()] || 0;
      const percentage = Math.min((amount / maxVal) * 100, 100);
      const label = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
      const isCurrent = new Date().toDateString() === date.toDateString();
      return {
        label,
        amount,
        percentage: Math.max(percentage, 2),
        isCurrent
      };
    });
  }

  const formatAmount = (num) => {
    if (num >= 100000) return (num / 1000).toFixed(0) + "K";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
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
          {/* Active: Dashboard */}
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium">Dashboard</span>
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
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/budget">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="font-body-md">Budget Planning</span>
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
        <main className="mt-16 p-8 flex-grow">
          {/* Greeting */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-text-primary mb-1">
                Welcome back, {user?.name || "Premium User"}!
              </h2>
              <p className="font-body-md text-text-muted">Here's your real-time financial breakdown for this month.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-error-container/30 border border-error/30 rounded-lg text-error text-body-md flex items-start gap-2">
              <span className="material-symbols-outlined text-[20px] shrink-0">warning</span>
              <span>{error}</span>
            </div>
          )}

          {/* Mini Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
            {/* Balance Card */}
            <div className="glass-card rounded-xl p-6 relative overflow-hidden group bg-white shadow-sm border border-border">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-5xl text-primary">account_balance_wallet</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-text-muted text-sm font-medium">Net Balance</span>
                <h2 className="font-data-lg text-headline-lg text-on-surface">{currencySymbol}{summary.balance.toLocaleString("en-IN")}</h2>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-primary text-[10px] font-bold">Safe to Spend</span>
                </div>
              </div>
            </div>

            {/* Income Card */}
            <div className="glass-card rounded-xl p-6 relative overflow-hidden group bg-white shadow-sm border border-border">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-5xl text-emerald-500">trending_up</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-text-muted text-sm font-medium">Total Income</span>
                <h2 className="font-data-lg text-headline-lg text-on-surface">{currencySymbol}{summary.totalIncome.toLocaleString("en-IN")}</h2>
                <p className="text-text-muted text-xs mt-2">All incoming streams</p>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="glass-card rounded-xl p-6 relative overflow-hidden group bg-white shadow-sm border border-border">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-5xl text-error">trending_down</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-text-muted text-sm font-medium">Total Expenses</span>
                <h2 className="font-data-lg text-headline-lg text-on-surface">{currencySymbol}{summary.totalExpense.toLocaleString("en-IN")}</h2>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    style={{ width: `${expensePercentage}%` }} 
                    className="bg-error h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>

            {/* Transactions Card */}
            <div className="glass-card rounded-xl p-6 relative overflow-hidden group bg-white shadow-sm border border-border">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-5xl text-secondary">swap_horiz</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-text-muted text-sm font-medium">Transactions</span>
                <h2 className="font-data-lg text-headline-lg text-on-surface">{summary.transactionCount}</h2>
                <p className="text-text-muted text-xs mt-2">Total registered transactions</p>
              </div>
            </div>
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
            {/* Monthly Trend */}
            <div className="lg:col-span-2 glass-card rounded-xl p-8 bg-white shadow-sm border border-border">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-headline-md text-text-primary">Expense Analytics</h3>
                  <p className="text-text-muted text-sm">{viewMode === "monthly" ? "Monthly" : "Daily"} spending trajectory</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMode("daily")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      viewMode === "daily" ? "bg-primary text-white border-primary shadow-sm" : "border-border text-text-muted hover:text-primary hover:border-primary"
                    }`}
                  >
                    Daily
                  </button>
                  <button 
                    onClick={() => setViewMode("monthly")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      viewMode === "monthly" ? "bg-primary text-white border-primary shadow-sm" : "border-border text-text-muted hover:text-primary hover:border-primary"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex h-[300px] w-full gap-4 pt-4">
                {/* Y-axis Labels */}
                <div className="flex flex-col justify-between h-[250px] text-[10px] text-text-muted select-none w-10 text-right pr-2 border-r border-border/30 pb-2">
                  <div>{currencySymbol}{formatAmount(maxVal)}</div>
                  <div>{currencySymbol}{formatAmount(maxVal * 0.75)}</div>
                  <div>{currencySymbol}{formatAmount(maxVal * 0.5)}</div>
                  <div>{currencySymbol}{formatAmount(maxVal * 0.25)}</div>
                  <div>{currencySymbol}0</div>
                </div>

                {/* Chart Bars */}
                <div className="flex-1 h-[250px] flex items-end justify-between gap-3 relative pb-2 pr-2">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 pr-2">
                    <div className="border-b border-dashed border-slate-100 dark:border-slate-800/50 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 dark:border-slate-800/50 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 dark:border-slate-800/50 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 dark:border-slate-800/50 w-full h-0"></div>
                    <div className="border-b border-solid border-slate-200 dark:border-slate-800 w-full h-0"></div>
                  </div>

                  {/* Bars */}
                  {dataPoints.map((dp) => (
                    <div key={dp.label} className="flex-1 flex flex-col items-center gap-2 group z-10 h-full justify-end">
                      <div 
                        style={{ height: `${dp.percentage}%` }} 
                        className={`w-full max-w-[24px] rounded-t-lg transition-all duration-300 relative ${
                          dp.isCurrent ? "bg-primary" : "bg-emerald-100 dark:bg-emerald-950/40 group-hover:bg-primary/30"
                        }`}
                      >
                        {dp.amount > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-1 rounded shadow-lg text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            {currencySymbol}{dp.amount.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                      <span className={`text-[9px] whitespace-nowrap mt-2 ${dp.isCurrent ? "text-primary font-bold" : "text-text-muted"}`}>
                        {dp.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="lg:col-span-1 glass-card rounded-xl p-8 flex flex-col bg-white shadow-sm border border-border">
              <h3 className="font-headline-md text-text-primary mb-1">Categories</h3>
              <p className="text-text-muted text-sm mb-8">Spending by category</p>
              <div className="flex-1 flex items-center justify-center relative mb-8">
                <div className="w-44 h-44 rounded-full border-[20px] border-slate-50 relative flex items-center justify-center">
                  <div className="absolute inset-[-20px] rounded-full">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#F1F5F9" strokeWidth="4"></circle>
                      {(() => {
                        let currentOffset = 0;
                        const segmentColors = {
                          "🍔 food": "#F59E0B",
                          "🛒 shopping": "#64748B",
                          "🚗 travel": "#3B82F6",
                          "💡 bills": "#10B981",
                          "🎬 entertainment": "#EF4444"
                        };
                        return Object.entries(categorySummary).map(([cat, amount]) => {
                          const pct = summary.totalExpense > 0 ? (amount / summary.totalExpense) * 100 : 0;
                          if (pct <= 0) return null;
                          const strokeColor = segmentColors[cat.toLowerCase()] || "#8B5CF6";
                          const dashArray = `${pct} ${100 - pct}`;
                          const dashOffset = -currentOffset;
                          currentOffset += pct;
                          return (
                            <circle
                              key={cat}
                              cx="18"
                              cy="18"
                              fill="transparent"
                              r="15.915"
                              stroke={strokeColor}
                              strokeDasharray={dashArray}
                              strokeDashoffset={dashOffset}
                              strokeWidth="4"
                              className="transition-all duration-300"
                            ></circle>
                          );
                        });
                      })()}
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold font-data-lg text-text-primary">
                      {Object.keys(categorySummary).length}
                    </span>
                    <p className="text-[10px] text-text-muted uppercase font-semibold">Active</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {Object.entries(categorySummary).map(([cat, amount]) => {
                  const percentage = summary.totalExpense > 0 ? Math.round((amount / summary.totalExpense) * 100) : 0;
                  const dotColors = {
                    "🍔 food": "bg-amber-500",
                    "🛒 shopping": "bg-slate-400",
                    "🚗 travel": "bg-blue-500",
                    "💡 bills": "bg-emerald-400",
                    "🎬 entertainment": "bg-red-500"
                  };
                  const dotColor = dotColors[cat.toLowerCase()] || "bg-violet-400";
                  return (
                    <div key={cat} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
                        <span className="text-on-surface font-medium capitalize">{cat}</span>
                      </div>
                      <span className="font-data-md text-text-muted">{percentage}%</span>
                    </div>
                  );
                })}
                {Object.keys(categorySummary).length === 0 && (
                  <p className="text-center text-text-muted text-xs">No active categories</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <section className="glass-card rounded-xl overflow-hidden mb-8 bg-white shadow-sm border border-border">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-headline-md text-text-primary">Recent Transactions</h3>
              <Link className="text-primary hover:text-emerald-700 text-sm font-semibold flex items-center gap-1 transition-colors" to="/transactions">
                View All Transactions <span className="material-symbols-outlined text-xs">chevron_right</span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-text-muted text-[10px] uppercase tracking-widest border-b border-border/50 bg-slate-50">
                    <th className="px-6 py-4 font-bold">Description</th>
                    <th className="px-6 py-4 font-bold">Type</th>
                    <th className="px-6 py-4 font-bold text-right">Amount</th>
                    <th className="px-6 py-4 font-bold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredTransactions.map((t) => {
                    const style = getCategoryStyle(t.category);
                    const rawDate = new Date(t.date || Date.now());
                    const validDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;
                    const formattedDate = validDate.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    });
                    return (
                      <tr key={t._id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.iconBg}`}>
                              <span className="material-symbols-outlined">{style.icon}</span>
                            </div>
                            <div>
                              <p className="text-on-surface font-semibold capitalize">{t.title}</p>
                              <p className="text-[10px] text-text-muted capitalize">{t.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            t.type === "income" ? "bg-emerald-50 text-primary" : "bg-red-50 text-error"
                          }`}>
                            {t.type || "expense"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`font-data-md font-bold ${
                            t.type === "income" ? "text-emerald-600" : "text-error"
                          }`}>
                            {t.type === "income" ? "+" : "-"}{currencySymbol}{t.amount.toLocaleString("en-IN")}.00
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right text-text-muted text-sm">{formattedDate}</td>
                      </tr>
                    );
                  })}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-text-muted text-sm">
                        No recent transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Action Button */}
      <Link to="/add-transaction" className="fixed bottom-8 right-8 w-16 h-16 bg-primary rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-white z-50">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          add
        </span>
      </Link>
    </div>
  );
};

export default Dashboard;
