import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { getExpenses } from "../services/expenseService";
import { generateFinancialReport } from "../utils/pdfGenerator";
import { downloadTransactionsCSV } from "../utils/csvGenerator";

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

const Reports = () => {
  const { logout, user, currencySymbol } = useAuth();

  // Date States
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}-01`;
  });
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState(null);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses();
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const cards = document.querySelectorAll(".glass-card");
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.style.transform = "translateY(-2px)";
          card.style.transition = "transform 0.2s ease-out";
        });
        card.style.transition = "transform 0.2s ease-out";
        card.addEventListener("mouseleave", () => {
          card.style.transform = "translateY(0)";
        });
      });
    }
  }, [loading]);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchReportData();
  };

  const handleDownloadPDF = async () => {
    setPdfError(null);
    setIsPdfLoading(true);
    try {
      await generateFinancialReport({
        currencySymbol,
        userName: user?.name ?? "",
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      setPdfError("Failed to generate PDF. Please try again.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setCsvError(null);
    setIsCsvLoading(true);
    try {
      await downloadTransactionsCSV();
    } catch (err) {
      console.error("CSV export failed:", err);
      setCsvError(err.message || "Failed to export CSV. Please try again.");
    } finally {
      setIsCsvLoading(false);
    }
  };

  // Filter and compute stats
  const dateRangeFilteredTransactions = transactions.filter((t) => {
    const rowDate = new Date(t.date || Date.now());
    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    return rowDate >= start && rowDate <= end;
  });

  const filteredRows = dateRangeFilteredTransactions.filter(
    (row) =>
      (row.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  let income = 0;
  let expense = 0;
  const categoryTotals = {};
  const monthlyData = {};

  dateRangeFilteredTransactions.forEach((t) => {
    const emojiCat = getEmojiCategory(t.category, t.type);
    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
      categoryTotals[emojiCat] = (categoryTotals[emojiCat] || 0) + t.amount;
    }

    const d = new Date(t.date || Date.now());
    const validDate = isNaN(d.getTime()) ? new Date() : d;
    const m = validDate.toLocaleString("default", { month: "long" });
    if (!monthlyData[m]) {
      monthlyData[m] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      monthlyData[m].income += t.amount;
    } else {
      monthlyData[m].expense += t.amount;
    }
  });

  const savings = income - expense;

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => {
      const percentage = expense > 0 ? (amount / expense) * 100 : 0;
      return { name, amount, percentage };
    });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let maxMonthlyVal = 1000;
  Object.values(monthlyData).forEach((data) => {
    if (data.income > maxMonthlyVal) maxMonthlyVal = data.income;
    if (data.expense > maxMonthlyVal) maxMonthlyVal = data.expense;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-text-muted font-body-md">Loading reports...</span>
        </div>
      </div>
    );
  }

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
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/reports">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-medium">Reports</span>
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

      {/* Main Content Wrapper */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white/80 backdrop-blur-md border-b border-border shadow-sm z-40 flex justify-between items-center px-gutter">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-border w-80">
              <span className="material-symbols-outlined text-text-muted text-sm mr-2">search</span>
              <input
                className="bg-transparent border-none text-sm text-on-surface focus:ring-0 w-full placeholder:text-text-muted focus:outline-none"
                placeholder="Search reports..."
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

        <main className="mt-16 p-8 flex-1">
          <div className="mb-8">
            <h2 className="font-headline-lg text-headline-lg text-text-primary mb-1">Reports</h2>
            <p className="font-body-md text-text-muted">Detailed insights about your income and expenses</p>
          </div>

          <div className="space-y-8 max-w-container-max">
            {/* Date Range Selector */}
            <form onSubmit={handleGenerateReport} className="glass-card p-6 rounded-xl flex flex-wrap items-end gap-6 bg-white border border-border shadow-sm">
              <div className="flex-1 min-w-[200px]">
                <label className="block font-label-sm text-label-sm text-text-muted mb-2 uppercase tracking-wider">From Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">calendar_today</span>
                  <input
                    className="w-full bg-slate-50 border border-outline rounded-lg pl-10 pr-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block font-label-sm text-label-sm text-text-muted mb-2 uppercase tracking-wider">To Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">calendar_month</span>
                  <input
                    className="w-full bg-slate-50 border border-outline rounded-lg pl-10 pr-4 py-2 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">analytics</span>
                Generate Report
              </button>
            </form>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              <div className="glass-card p-6 rounded-xl space-y-4 bg-white border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Total Income</p>
                    <h3 className="font-data-lg text-data-lg text-emerald-600">{currencySymbol}{income.toLocaleString("en-IN")}</h3>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-emerald-600 font-label-sm text-label-sm flex items-center gap-1">
                    Active Period
                  </span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-4 bg-white border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error">trending_down</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Total Expense</p>
                    <h3 className="font-data-lg text-data-lg text-error">{currencySymbol}{expense.toLocaleString("en-IN")}</h3>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-error font-label-sm text-label-sm flex items-center gap-1">
                    Active Period
                  </span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-4 bg-white border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600">account_balance_wallet</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Net Balance</p>
                    <h3 className="font-data-lg text-data-lg text-blue-600">{currencySymbol}{savings.toLocaleString("en-IN")}</h3>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-blue-600 font-label-sm text-label-sm flex items-center gap-1">
                    Active Period
                  </span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-4 bg-white border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">savings</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Savings</p>
                    <h3 className="font-data-lg text-data-lg text-primary">{currencySymbol}{savings.toLocaleString("en-IN")}</h3>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-primary font-label-sm text-label-sm flex items-center gap-1">
                    Active Period
                  </span>
                </div>
              </div>
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
              {/* Bar Chart */}
              <div className="glass-card p-6 rounded-xl bg-white border border-border shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-headline-md text-headline-md text-text-primary">Monthly Income vs Expense</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                      <span className="font-label-sm text-label-sm text-text-muted">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-error"></span>
                      <span className="font-label-sm text-label-sm text-text-muted">Expense</span>
                    </div>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between px-2 gap-4">
                  {months.map((monthAbbr, index) => {
                    const fullName = fullMonthNames[index];
                    const data = monthlyData[fullName] || { income: 0, expense: 0 };
                    const incomePct = Math.min((data.income / maxMonthlyVal) * 100, 100);
                    const expensePct = Math.min((data.expense / maxMonthlyVal) * 100, 100);
                    const isCurrentMonth = new Date().getMonth() === index;

                    return (
                      <div key={monthAbbr} className="flex-1 flex flex-col items-center justify-end gap-1 h-full animate-fade-in">
                        <div className="w-full flex justify-center gap-1 h-full items-end">
                          <div 
                            style={{ height: `${Math.max(incomePct, 2)}%` }} 
                            className={`w-3 rounded-t transition-all duration-300 ${isCurrentMonth ? "bg-primary" : "bg-emerald-200"}`}
                            title={`Income: ${currencySymbol}${data.income}`}
                          ></div>
                          <div 
                            style={{ height: `${Math.max(expensePct, 2)}%` }} 
                            className={`w-3 rounded-t transition-all duration-300 ${isCurrentMonth ? "bg-error" : "bg-red-200"}`}
                            title={`Expense: ${currencySymbol}${data.expense}`}
                          ></div>
                        </div>
                        <span className={`text-[10px] mt-2 ${isCurrentMonth ? "text-on-surface font-bold" : "text-text-muted"}`}>
                          {monthAbbr}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Doughnut Chart */}
              <div className="glass-card p-6 rounded-xl bg-white border border-border shadow-sm">
                <h3 className="font-headline-md text-headline-md text-text-primary mb-8">Category-wise Expense</h3>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#F1F5F9" strokeWidth="3"></circle>
                      {(() => {
                        let currentOffset = 0;
                        const colors = {
                          "🍔 food": "#10B981", // Emerald-500
                          "🛒 shopping": "#3B82F6", // Blue-500
                          "🚗 travel": "#F59E0B", // Amber-500
                          "⛽ fuel": "#F59E0B",
                          "🏠 rent": "#EF4444",
                          "💡 bills": "#EF4444",
                          "🎬 entertainment": "#A78BFA"
                        };
                        return topCategories.map((c) => {
                          const percentage = expense > 0 ? (c.amount / expense) * 100 : 0;
                          const strokeColor = colors[c.name.toLowerCase()] || "#64748B";
                          const strokeDasharray = `${percentage} ${100 - percentage}`;
                          const strokeDashoffset = -currentOffset;
                          currentOffset += percentage;
                          return (
                            <circle
                              key={c.name}
                              cx="18"
                              cy="18"
                              fill="transparent"
                              r="15.915"
                              stroke={strokeColor}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              strokeWidth="4"
                              className="transition-all duration-300"
                            ></circle>
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-data-md text-data-md text-on-surface font-bold">{currencySymbol}{expense.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] text-text-muted">Total Exp</span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                    {topCategories.map((c) => {
                      const colors = {
                        "🍔 food": "bg-emerald-500",
                        "🛒 shopping": "bg-blue-500",
                        "🚗 travel": "bg-amber-500",
                        "⛽ fuel": "bg-amber-500",
                        "🏠 rent": "bg-error",
                        "💡 bills": "bg-error",
                        "🎬 entertainment": "bg-violet-500"
                      };
                      const bgColor = colors[c.name.toLowerCase()] || "bg-slate-500";
                      return (
                        <div key={c.name} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${bgColor}`}></span>
                          <span className="font-label-sm text-label-sm text-text-muted capitalize">{c.name}</span>
                          <span className="font-data-md text-data-md text-on-surface ml-auto">{Math.round(c.percentage)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Top Spending Categories */}
            <section className="glass-card p-6 rounded-xl bg-white border border-border shadow-sm">
              <h3 className="font-headline-md text-headline-md text-text-primary mb-6">Top Spending Categories</h3>
              <div className="space-y-6">
                {topCategories.slice(0, 3).map((c) => {
                  const style = getCategoryStyle(c.name);
                  const colors = {
                    "🍔 food": "bg-emerald-500",
                    "🛒 shopping": "bg-blue-500",
                    "🚗 travel": "bg-amber-500",
                    "⛽ fuel": "bg-amber-500",
                    "🏠 rent": "bg-error",
                    "💡 bills": "bg-error",
                    "🎬 entertainment": "bg-violet-500"
                  };
                  const barColor = colors[c.name.toLowerCase()] || "bg-slate-500";
                  return (
                    <div key={c.name} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined ${style.iconBg.split(" ")[1]}`}>{style.icon}</span>
                          <span className="font-label-sm text-label-sm text-on-surface capitalize">{c.name}</span>
                        </div>
                        <span className="font-data-md text-data-md text-on-surface font-semibold">
                          {currencySymbol}{c.amount.toLocaleString("en-IN")} <span className="text-text-muted ml-2 font-normal">{c.percentage.toFixed(1)}%</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div style={{ width: `${c.percentage}%` }} className={`h-full rounded-full ${barColor}`}></div>
                      </div>
                    </div>
                  );
                })}
                {topCategories.length === 0 && (
                  <p className="text-center text-text-muted text-xs">No active categories</p>
                )}
              </div>
            </section>

            {/* Recent Report Table */}
            <section className="glass-card rounded-xl overflow-hidden bg-white border border-border shadow-sm">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50/50">
                <h3 className="font-headline-md text-headline-md text-text-primary">Recent Report</h3>
                <Link className="text-primary font-label-sm text-label-sm hover:underline font-bold" to="/transactions">
                  View All Transactions
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-text-muted font-label-sm border-b border-border">
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Date</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Title</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Type</th>
                      <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider text-[10px]">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredRows.map((row) => {
                      const style = getCategoryStyle(row.category);
                      const rawDate = new Date(row.date || Date.now());
                      const validDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;
                      const formattedDate = validDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      });
                      return (
                        <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-data-md text-data-md text-on-surface">{formattedDate}</td>
                          <td className="px-6 py-4 font-body-md text-on-surface font-semibold capitalize">{row.title}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${style.iconBg}`}>
                                <span className="material-symbols-outlined text-[18px]">{style.icon}</span>
                              </div>
                              <span className="text-sm font-medium capitalize">{row.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                              row.type === "income" ? "bg-emerald-50 text-primary" : "bg-red-50 text-error"
                            }`}>
                              {row.type || "expense"}
                            </span>
                          </td>
                          <td className={`px-6 py-4 font-data-md text-data-md text-right font-bold ${
                            row.type === "income" ? "text-emerald-600" : "text-error"
                          }`}>
                            {row.type === "income" ? "+" : "-"}{currencySymbol}{row.amount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                          No reports found matching the query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Export Section */}
            <footer className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 bg-white border border-border shadow-sm mb-8">
              <div className="text-center md:text-left">
                <h4 className="font-headline-md text-headline-md text-text-primary">Export Report</h4>
                <p className="font-label-sm text-label-sm text-text-muted">Download your financial report in different formats for external audit.</p>
              </div>
              <div className="flex gap-4">
                {pdfError && (
                  <p className="text-error text-xs self-center">{pdfError}</p>
                )}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isPdfLoading}
                  className="flex items-center gap-2 px-6 py-2.5 border border-outline text-text-muted rounded-lg font-bold hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPdfLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                      Download PDF
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  disabled={isCsvLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-emerald-600 transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCsvLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">table_chart</span>
                      Download CSV
                    </>
                  )}
                </button>
                {csvError && (
                  <p className="text-error text-xs self-center">{csvError}</p>
                )}
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
