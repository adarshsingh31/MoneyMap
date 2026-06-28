import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import {
  getDashboardSummary,
  getCategorySummary,
  getMonthlySummary,
  getExpenses,
} from "../services/expenseService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PIE_COLORS = ["#10b981","#6366f1","#f59e0b","#ef4444","#8b5cf6","#64748b"];

const DAYS_OF_WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const categorizeTx = (cat, type) => {
  const n = String(cat || "").toLowerCase();
  if (type === "income") {
    if (n.includes("salary")) return "Salary";
    if (n.includes("freelance")) return "Freelance";
    if (n.includes("business")) return "Business";
    if (n.includes("investment")) return "Investment";
    return "Other Income";
  }
  if (n.includes("food") || n.includes("restaurant")) return "Food";
  if (n.includes("shopping")) return "Shopping";
  if (n.includes("fuel")) return "Fuel";
  if (n.includes("travel") || n.includes("transport")) return "Travel";
  if (n.includes("rent")) return "Rent";
  if (n.includes("bill") || n.includes("utilit")) return "Bills";
  if (n.includes("entertainment") || n.includes("movie")) return "Entertainment";
  if (n.includes("subscription")) return "Subscriptions";
  return "Other";
};

const fmt = (n, sym) => `${sym}${Number(n).toLocaleString("en-IN")}`;

// ─── Sub-components ──────────────────────────────────────────────────────────

const SummaryCard = ({ icon, iconBg, label, value, sub }) => (
  <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm flex flex-col gap-2">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} mb-1`}>
      <span className="material-symbols-outlined text-lg">{icon}</span>
    </div>
    <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">{label}</span>
    <span className="font-bold text-2xl text-on-surface leading-tight">{value}</span>
    {sub && <span className="text-text-muted text-xs">{sub}</span>}
  </div>
);

const InsightCard = ({ icon, text, color }) => {
  const colorMap = {
    blue:   "bg-blue-50   border-blue-200   text-blue-700",
    green:  "bg-emerald-50 border-emerald-200 text-emerald-700",
    orange: "bg-amber-50  border-amber-200  text-amber-700",
    red:    "bg-red-50    border-red-200    text-red-700",
  };
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium ${colorMap[color] || colorMap.blue}`}>
      <span className="text-xl leading-none">{icon}</span>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

const RecommendationCard = ({ icon, text }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-slate-50/60 text-sm text-on-surface">
    <span className="text-xl leading-none">{icon}</span>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

const HealthScore = ({ score, sym }) => {
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Needs Attention";
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={90} cy={90} r={r} fill="none" stroke="#e2e8f0" strokeWidth={14} />
        <circle
          cx={90} cy={90} r={r} fill="none"
          stroke={color} strokeWidth={14}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x={90} y={82} textAnchor="middle" fill={color} fontSize={32} fontWeight="bold">{score}</text>
        <text x={90} y={106} textAnchor="middle" fill="#64748b" fontSize={13}>/ 100</text>
      </svg>
      <div className="text-center">
        <p className="font-bold text-base text-on-surface">Financial Health</p>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mt-1 inline-block"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, sym }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-on-surface mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {sym}{Number(p.value).toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const AIAnalytics = () => {
  const { logout, user, currencySymbol: sym } = useAuth();

  const [summary, setSummary] = useState(null);
  const [allTx, setAllTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [summaryRes, , , txRes] = await Promise.all([
          getDashboardSummary(),
          getCategorySummary(),
          getMonthlySummary(),
          getExpenses(),
        ]);
        setSummary(summaryRes);
        setAllTx(txRes || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Entrance animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading) {
      document.querySelectorAll(".glass-card").forEach((card, i) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";
        card.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 60 * i);
      });
    }
  }, [loading]);

  // ── Derived analytics ───────────────────────────────────────────────────────
  const analytics = useMemo(() => {
    if (!allTx.length) return null;

    const expenses = allTx.filter(t => t.type === "expense");
    const incomes  = allTx.filter(t => t.type === "income");

    const now = new Date();
    const currentMonth = MONTHS[now.getMonth()];
    const currentYear  = String(now.getFullYear());
    const prevMonthIdx = (now.getMonth() - 1 + 12) % 12;
    const prevMonth    = MONTHS[prevMonthIdx];
    const prevYear     = prevMonthIdx === 11 ? String(now.getFullYear() - 1) : currentYear;

    const inPeriod = (t, m, y) => {
      const d = new Date(t.date || Date.now());
      const vd = isNaN(d.getTime()) ? new Date() : d;
      return MONTHS[vd.getMonth()] === m && String(vd.getFullYear()) === y;
    };

    // Category totals (all time)
    const catTotals = {};
    expenses.forEach(t => {
      const cat = categorizeTx(t.category, "expense");
      catTotals[cat] = (catTotals[cat] || 0) + t.amount;
    });

    // Category totals (current month)
    const catCurrent = {};
    expenses.filter(t => inPeriod(t, currentMonth, currentYear)).forEach(t => {
      const cat = categorizeTx(t.category, "expense");
      catCurrent[cat] = (catCurrent[cat] || 0) + t.amount;
    });

    // Category totals (previous month)
    const catPrev = {};
    expenses.filter(t => inPeriod(t, prevMonth, prevYear)).forEach(t => {
      const cat = categorizeTx(t.category, "expense");
      catPrev[cat] = (catPrev[cat] || 0) + t.amount;
    });

    // Monthly totals
    const monthlyExp = {};
    const monthlyInc = {};
    allTx.forEach(t => {
      const d = new Date(t.date || Date.now());
      const vd = isNaN(d.getTime()) ? new Date() : d;
      const key = `${vd.getFullYear()}-${String(vd.getMonth()).padStart(2, "0")}`;
      if (t.type === "expense") monthlyExp[key] = (monthlyExp[key] || 0) + t.amount;
      if (t.type === "income")  monthlyInc[key] = (monthlyInc[key] || 0) + t.amount;
    });

    // Line chart: last 12 months
    const lineData = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      return {
        name: MONTHS_SHORT[d.getMonth()],
        Expense: monthlyExp[key] || 0,
        Income:  monthlyInc[key] || 0,
      };
    });

    // Bar chart: last 6 months (income / expense / savings)
    const barData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      const inc = monthlyInc[key] || 0;
      const exp = monthlyExp[key] || 0;
      return {
        name: MONTHS_SHORT[d.getMonth()],
        Income: inc,
        Expense: exp,
        Savings: Math.max(0, inc - exp),
      };
    });

    // Pie chart data
    const pieData = Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    // Biggest expense category
    const biggestCatEntry = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    // Average daily spending (current month)
    const currentExp = expenses.filter(t => inPeriod(t, currentMonth, currentYear));
    const totalCurrentExp = currentExp.reduce((s, t) => s + t.amount, 0);
    const dayOfMonth = now.getDate();
    const avgDaily = dayOfMonth > 0 ? totalCurrentExp / dayOfMonth : 0;

    // Highest spending month
    const monthAmounts = Object.entries(monthlyExp).sort((a, b) => b[1] - a[1]);
    let highestMonth = "—";
    let highestMonthAmt = 0;
    if (monthAmounts.length) {
      const [key, amt] = monthAmounts[0];
      const [yr, mo] = key.split("-");
      highestMonth = `${MONTHS[Number(mo)]} ${yr}`;
      highestMonthAmt = amt;
    }

    // Savings rate (current month)
    const incomeThisMonth = incomes.filter(t => inPeriod(t, currentMonth, currentYear))
      .reduce((s, t) => s + t.amount, 0);
    const savingsRate = incomeThisMonth > 0
      ? Math.max(0, Math.round(((incomeThisMonth - totalCurrentExp) / incomeThisMonth) * 100))
      : 0;

    // Spending habits
    const dayCount = {};
    expenses.forEach(t => {
      const d = new Date(t.date || Date.now());
      const vd = isNaN(d.getTime()) ? new Date() : d;
      const day = DAYS_OF_WEEK[vd.getDay()];
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const monthCount = {};
    expenses.forEach(t => {
      const d = new Date(t.date || Date.now());
      const vd = isNaN(d.getTime()) ? new Date() : d;
      const m = MONTHS[vd.getMonth()];
      monthCount[m] = (monthCount[m] || 0) + 1;
    });
    const mostActiveMonth = Object.entries(monthCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const sortedExpAmounts = expenses.map(t => t.amount).sort((a, b) => a - b);
    const largestExp  = sortedExpAmounts[sortedExpAmounts.length - 1] || 0;
    const smallestExp = sortedExpAmounts[0] || 0;
    const avgTxAmt    = expenses.length ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length : 0;

    // AI Insights
    const insights = [];

    // Biggest category % of current month
    if (biggestCatEntry && totalCurrentExp > 0) {
      const pct = Math.round((catCurrent[biggestCatEntry[0]] || 0) / totalCurrentExp * 100);
      if (pct > 0)
        insights.push({ icon: "🧠", text: `You spent <b>${pct}%</b> of your expenses on <b>${biggestCatEntry[0]}</b> this month.`, color: "blue" });
    }

    // Food trend
    const foodCurr = catCurrent["Food"] || 0;
    const foodPrev = catPrev["Food"] || 0;
    if (foodPrev > 0 && foodCurr !== foodPrev) {
      const delta = Math.abs(Math.round(((foodCurr - foodPrev) / foodPrev) * 100));
      if (foodCurr < foodPrev)
        insights.push({ icon: "💰", text: `Your <b>Food</b> expenses decreased by <b>${delta}%</b> compared to last month.`, color: "green" });
      else
        insights.push({ icon: "⚠️", text: `Your <b>Food</b> expenses increased by <b>${delta}%</b> compared to last month.`, color: "orange" });
    }

    // Income trend
    const incCurr = incomes.filter(t => inPeriod(t, currentMonth, currentYear)).reduce((s, t) => s + t.amount, 0);
    const incPrev = incomes.filter(t => inPeriod(t, prevMonth, prevYear)).reduce((s, t) => s + t.amount, 0);
    if (incPrev > 0 && incCurr > incPrev) {
      const delta = Math.round(((incCurr - incPrev) / incPrev) * 100);
      insights.push({ icon: "📈", text: `Your income increased by <b>${delta}%</b> compared to the previous month.`, color: "green" });
    }

    // Fuel trend (last 3 months)
    const fuelLast3 = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 2 + i, 1);
      const m = MONTHS[d.getMonth()];
      const y = String(d.getFullYear());
      return expenses.filter(t => inPeriod(t, m, y) && categorizeTx(t.category, "expense") === "Fuel")
        .reduce((s, t) => s + t.amount, 0);
    });
    if (fuelLast3[0] < fuelLast3[1] && fuelLast3[1] < fuelLast3[2] && fuelLast3[2] > 0) {
      insights.push({ icon: "⚠️", text: `<b>Fuel</b> spending is increasing steadily over the last three months.`, color: "orange" });
    }

    // Budget check (simple — if savings rate is positive)
    if (savingsRate > 0) {
      insights.push({ icon: "🎯", text: `You stayed within budget this month. Savings rate: <b>${savingsRate}%</b>.`, color: "green" });
    } else if (incomeThisMonth > 0) {
      insights.push({ icon: "🔴", text: `You overspent this month. Consider reducing discretionary expenses.`, color: "red" });
    }

    // Recommendations
    const recommendations = [];
    if (biggestCatEntry) {
      const reducedAmt = Math.round(biggestCatEntry[1] * 0.15);
      recommendations.push({
        icon: "💡",
        text: `Reduce <b>${biggestCatEntry[0]}</b> expenses by 15% to save approximately <b>${fmt(reducedAmt, sym)}</b> over time.`,
      });
    }
    if (!catTotals["Food"]) {
      recommendations.push({ icon: "🍔", text: "Consider setting a <b>Food</b> budget to avoid overspending." });
    }
    const subAmt = catCurrent["Subscriptions"] || 0;
    const subPrevAmt = catPrev["Subscriptions"] || 0;
    if (subAmt > subPrevAmt && subAmt > 0) {
      recommendations.push({ icon: "📊", text: "Your <b>subscription</b> expenses are increasing. Review unused subscriptions." });
    }
    if (savingsRate >= 20) {
      recommendations.push({ icon: "🏆", text: `Great job! Your savings rate of <b>${savingsRate}%</b> improved this month.` });
    }

    // Financial health score (0–100)
    let healthScore = 50;
    if (savingsRate >= 30) healthScore = 90;
    else if (savingsRate >= 20) healthScore = 78;
    else if (savingsRate >= 10) healthScore = 63;
    else if (savingsRate > 0)   healthScore = 52;
    else                        healthScore = 35;

    // Recent trends
    const sortedByAmt = [...expenses].sort((a, b) => b.amount - a.amount);
    const highestExpense = sortedByAmt[0] || null;

    const sortedInc = [...incomes].sort((a, b) => b.amount - a.amount);
    const highestIncome = sortedInc[0] || null;

    // Fastest growing category (compare curr vs prev)
    let fastestGrowing = "—";
    let fastestGrowthPct = 0;
    const allCats = new Set([...Object.keys(catCurrent), ...Object.keys(catPrev)]);
    allCats.forEach(cat => {
      const prev = catPrev[cat] || 0;
      const curr = catCurrent[cat] || 0;
      if (prev > 0) {
        const growth = ((curr - prev) / prev) * 100;
        if (growth > fastestGrowthPct) { fastestGrowthPct = growth; fastestGrowing = cat; }
      }
    });

    // Most reduced category
    let mostReduced = "—";
    let mostReducedPct = 0;
    allCats.forEach(cat => {
      const prev = catPrev[cat] || 0;
      const curr = catCurrent[cat] || 0;
      if (prev > 0 && curr < prev) {
        const reduction = ((prev - curr) / prev) * 100;
        if (reduction > mostReducedPct) { mostReducedPct = reduction; mostReduced = cat; }
      }
    });

    return {
      biggestCatEntry, avgDaily, highestMonth, highestMonthAmt, savingsRate,
      lineData, barData, pieData, catTotals,
      mostActiveDay, mostActiveMonth, largestExp, smallestExp, avgTxAmt,
      insights, recommendations, healthScore,
      highestExpense, highestIncome,
      fastestGrowing, fastestGrowthPct: Math.round(fastestGrowthPct),
      mostReduced, mostReducedPct: Math.round(mostReducedPct),
      totalTransactions: expenses.length + incomes.length,
    };
  }, [allTx, sym]);

  // ── Sidebar nav ─────────────────────────────────────────────────────────────
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
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/budget">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="font-body-md">Budget Planning</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/ai-analytics">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-medium">AI Analytics</span>
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

      {/* Main Content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white/80 backdrop-blur-md border-b border-border shadow-sm z-40 flex justify-between items-center px-gutter">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="font-bold text-lg text-on-surface select-none">AI Analytics</h2>
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
                  alt="User Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCri9PyXic65bVGnjayUMgd-OrCKi034yE8M5MrREU_uBSWzC_1L1nIW6Wqvl9YcrW1mam49lN5yby52zX1SIfFzQYc445pIyO1d6ViYHMCrctSQ3YM3soVbxhnPs1egAJqgCWY3atJ8J3s_EWgVUukzFVw2791cJKRJfmaRLNjg-mHaVT6EyPsSEhkDi1aEIxuLSieWo3nSZpkyQoHM6l5_wJZLIIQKTKArrG5bPleLmY599dGhTy0c5V98l3ctpm2RcllrXtv8I"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="mt-16 p-8 flex-grow space-y-8">
          {/* Page Title */}
          <div>
            <h2 className="font-headline-lg text-headline-lg text-text-primary mb-1">AI Analytics</h2>
            <p className="font-body-md text-text-muted">Get deep insights into where your money goes.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-error-container/30 border border-error/30 rounded-lg text-error text-body-md flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              <span>{error}</span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-text-muted text-sm">Analysing your financial data…</p>
            </div>
          )}

          {!loading && !error && !analytics && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="material-symbols-outlined text-5xl text-text-muted">insights</span>
              <p className="text-text-muted text-sm">No transaction data found. Add some transactions to see analytics.</p>
            </div>
          )}

          {!loading && !error && analytics && (
            <>
              {/* ── Top Summary Cards ────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
                <SummaryCard
                  icon="shopping_bag"
                  iconBg="bg-purple-50 text-purple-600"
                  label="Biggest Expense Category"
                  value={analytics.biggestCatEntry?.[0] || "—"}
                  sub={analytics.biggestCatEntry ? fmt(analytics.biggestCatEntry[1], sym) + " total" : undefined}
                />
                <SummaryCard
                  icon="today"
                  iconBg="bg-blue-50 text-blue-600"
                  label="Avg Daily Spending"
                  value={`${sym}${Math.round(analytics.avgDaily).toLocaleString("en-IN")}/day`}
                  sub="This month"
                />
                <SummaryCard
                  icon="calendar_month"
                  iconBg="bg-amber-50 text-amber-600"
                  label="Highest Spending Month"
                  value={analytics.highestMonth.split(" ")[0]}
                  sub={fmt(analytics.highestMonthAmt, sym)}
                />
                <SummaryCard
                  icon="savings"
                  iconBg="bg-emerald-50 text-emerald-600"
                  label="Savings Rate"
                  value={`${analytics.savingsRate}%`}
                  sub="This month"
                />
              </div>

              {/* ── AI Insights ──────────────────────────────────── */}
              <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <h3 className="font-headline-md text-text-primary">AI Insights</h3>
                </div>
                {analytics.insights.length === 0 ? (
                  <p className="text-text-muted text-sm">Not enough data to generate insights yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analytics.insights.map((ins, i) => (
                      <InsightCard key={i} {...ins} />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Charts Row 1: Line + Pie ─────────────────────── */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
                {/* Line Chart */}
                <div className="xl:col-span-2 glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
                  <h3 className="font-headline-md text-text-primary mb-6">Monthly Spending Trend</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={analytics.lineData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                        tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                      <Tooltip content={<CustomTooltip sym={sym} />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: "#ef4444" }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Income"  stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: "#10b981" }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
                  <h3 className="font-headline-md text-text-primary mb-6">Category Analysis</h3>
                  {analytics.pieData.length === 0 ? (
                    <p className="text-text-muted text-sm text-center py-16">No expense data.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={analytics.pieData}
                          cx="50%" cy="45%"
                          innerRadius={55} outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {analytics.pieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${sym}${Number(v).toLocaleString("en-IN")}`, ""]} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* ── Bar Chart: Income vs Expense ─────────────────── */}
              <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
                <h3 className="font-headline-md text-text-primary mb-6">Income vs Expense (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                      tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                    <Tooltip content={<CustomTooltip sym={sym} />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Income"  fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="Savings" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ── Spending Habits + Health Score ──────────────── */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
                {/* Spending Habits */}
                <div className="xl:col-span-2 glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
                  <h3 className="font-headline-md text-text-primary mb-5">Spending Habits</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Avg Transaction", value: fmt(Math.round(analytics.avgTxAmt), sym), icon: "calculate" },
                      { label: "Most Active Day", value: analytics.mostActiveDay, icon: "today" },
                      { label: "Most Active Month", value: analytics.mostActiveMonth, icon: "event" },
                      { label: "Largest Expense", value: fmt(analytics.largestExp, sym), icon: "trending_up" },
                      { label: "Smallest Expense", value: fmt(analytics.smallestExp, sym), icon: "trending_down" },
                      { label: "Total Transactions", value: analytics.totalTransactions, icon: "receipt_long" },
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50/70 border border-border">
                        <span className="material-symbols-outlined text-primary text-base">{stat.icon}</span>
                        <span className="text-xs text-text-muted font-semibold uppercase tracking-wide">{stat.label}</span>
                        <span className="font-bold text-on-surface text-sm">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Health Score */}
                <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm flex items-center justify-center">
                  <HealthScore score={analytics.healthScore} sym={sym} />
                </div>
              </div>

              {/* ── Smart Recommendations ───────────────────────── */}
              <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-primary">tips_and_updates</span>
                  <h3 className="font-headline-md text-text-primary">Smart Recommendations</h3>
                </div>
                {analytics.recommendations.length === 0 ? (
                  <p className="text-text-muted text-sm">No recommendations at this time. Keep tracking!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analytics.recommendations.map((r, i) => (
                      <RecommendationCard key={i} {...r} />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Recent Financial Trends ─────────────────────── */}
              <div className="glass-card rounded-xl p-6 bg-white border border-border shadow-sm">
                <h3 className="font-headline-md text-text-primary mb-5">Recent Financial Trends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* Highest Expense */}
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-error text-base">arrow_upward</span>
                      <span className="text-xs font-bold text-error uppercase tracking-wide">Highest Expense</span>
                    </div>
                    <p className="font-bold text-on-surface text-sm">{analytics.highestExpense?.title || "—"}</p>
                    <p className="text-text-muted text-xs">{analytics.highestExpense ? fmt(analytics.highestExpense.amount, sym) : "—"}</p>
                  </div>

                  {/* Highest Income */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">payments</span>
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">Highest Income</span>
                    </div>
                    <p className="font-bold text-on-surface text-sm">{analytics.highestIncome?.title || "—"}</p>
                    <p className="text-text-muted text-xs">{analytics.highestIncome ? fmt(analytics.highestIncome.amount, sym) : "—"}</p>
                  </div>

                  {/* Fastest Growing */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-base">trending_up</span>
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Fastest Growing</span>
                    </div>
                    <p className="font-bold text-on-surface text-sm">{analytics.fastestGrowing}</p>
                    <p className="text-text-muted text-xs">
                      {analytics.fastestGrowthPct > 0 ? `+${analytics.fastestGrowthPct}% vs last month` : "No data"}
                    </p>
                  </div>

                  {/* Most Reduced */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-base">trending_down</span>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Most Reduced</span>
                    </div>
                    <p className="font-bold text-on-surface text-sm">{analytics.mostReduced}</p>
                    <p className="text-text-muted text-xs">
                      {analytics.mostReducedPct > 0 ? `-${analytics.mostReducedPct}% vs last month` : "No data"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AIAnalytics;
