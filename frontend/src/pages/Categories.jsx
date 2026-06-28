import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { getExpenses } from "../services/expenseService";

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

const defaultExpenses = [
  "🍔 Food",
  "🛒 Shopping",
  "🚗 Travel",
  "⛽ Fuel",
  "🏠 Rent",
  "💡 Bills",
  "🎬 Entertainment",
  "🏥 Healthcare",
  "📚 Education",
  "🛍 Personal Care",
  "🎁 Gifts",
  "📱 Subscriptions",
  "💼 Business",
  "📦 Other"
];

const defaultIncomes = [
  "💼 Salary",
  "💻 Freelance",
  "🏢 Business",
  "📈 Investment",
  "🏦 Interest",
  "🎁 Gift",
  "💸 Refund",
  "🪙 Bonus",
  "💰 Rental Income",
  "📱 Online Earnings",
  "🏆 Prize",
  "📦 Other"
];

const Categories = () => {
  const navigate = useNavigate();
  const { logout, user, currencySymbol } = useAuth();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // States
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const expensesRes = await getExpenses();
      setTransactions(expensesRes || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load category analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (!loading) {
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
    }
  }, [loading]);

  // Aggregate Category Data Dynamically
  const categoryMap = {};

  transactions.forEach((t) => {
    const emojiCat = getEmojiCategory(t.category, t.type);
    const key = `${t.type}_${emojiCat.toLowerCase()}`;

    if (!categoryMap[key]) {
      categoryMap[key] = {
        name: emojiCat,
        type: t.type,
        amount: 0,
        count: 0
      };
    }
    categoryMap[key].amount += t.amount;
    categoryMap[key].count += 1;
  });

  const expenseCategories = defaultExpenses.map((name) => {
    const key = `expense_${name.toLowerCase()}`;
    const data = categoryMap[key] || { amount: 0, count: 0 };
    return {
      name,
      amount: data.amount,
      count: data.count,
      ...getCategoryStyle(name)
    };
  });

  const incomeCategories = defaultIncomes.map((name) => {
    const key = `income_${name.toLowerCase()}`;
    const data = categoryMap[key] || { amount: 0, count: 0 };
    return {
      name,
      amount: data.amount,
      count: data.count,
      ...getCategoryStyle(name)
    };
  });

  const filteredExpenses = expenseCategories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIncomes = incomeCategories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExpense = expenseCategories.reduce((sum, c) => sum + c.amount, 0);
  const activeExpenses = expenseCategories.filter(c => c.amount > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-text-muted font-body-md">Loading categories...</span>
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
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/categories">
            <span className="material-symbols-outlined">category</span>
            <span className="font-medium">Categories</span>
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

        {/* Page Content */}
        <main className="mt-16 p-8 flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-text-primary mb-1">Categories</h2>
              <p className="font-body-md text-text-muted">Manage your income and expense categories for better financial mapping.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-error-container/30 border border-error/30 rounded-lg text-error text-body-md flex items-start gap-2">
              <span className="material-symbols-outlined text-[20px] shrink-0">warning</span>
              <span>{error}</span>
            </div>
          )}

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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredExpenses.map((c) => (
                      <tr key={c.name} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.iconBg}`}>
                              <span className="material-symbols-outlined">{c.icon}</span>
                            </div>
                            <span className="font-body-md font-semibold">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-data-md text-error">{currencySymbol}{c.amount.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 font-body-md text-text-muted">{c.count} Transactions</td>
                      </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-text-muted">
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredIncomes.map((c) => (
                      <tr key={c.name} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.iconBg}`}>
                              <span className="material-symbols-outlined">{c.icon}</span>
                            </div>
                            <span className="font-body-md font-semibold">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-data-md text-emerald-600">{currencySymbol}{c.amount.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 font-body-md text-text-muted">{c.count} Transactions</td>
                      </tr>
                    ))}
                    {filteredIncomes.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-text-muted">
                          No income categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Category Distribution Chart */}
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
                      {(() => {
                        let currentOffset = 0;
                        const colors = {
                          "🍔 food": "#F59E0B",
                          "🛒 shopping": "#64748B",
                          "🚗 travel": "#3B82F6",
                          "⛽ fuel": "#3B82F6",
                          "🏠 rent": "#10B981",
                          "💡 bills": "#10B981",
                          "🎬 entertainment": "#EF4444",
                          "🏥 healthcare": "#EF4444",
                          "📚 education": "#8B5CF6",
                          "🛍 personal care": "#8B5CF6",
                          "🎁 gifts": "#EC4899",
                          "📱 subscriptions": "#EC4899",
                          "💼 business": "#6366F1"
                        };
                        return activeExpenses.map((c) => {
                          const percentage = totalExpense > 0 ? (c.amount / totalExpense) * 100 : 0;
                          if (percentage <= 0) return null;
                          const strokeDasharray = `${percentage}, 100`;
                          const strokeDashoffset = -currentOffset;
                          currentOffset += percentage;
                          const strokeColor = colors[c.name.toLowerCase()] || "#A78BFA";
                          return (
                            <path
                              key={c.name}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={strokeColor}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              strokeWidth="3.5"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-bold font-data-lg text-text-primary">
                        {activeExpenses.length}
                      </span>
                      <p className="text-[10px] text-text-muted uppercase font-semibold">Expense Categories</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex-grow max-w-xs">
                    {expenseCategories.map((c) => {
                      const percentage = totalExpense > 0 ? Math.round((c.amount / totalExpense) * 100) : 0;
                      const dotColors = {
                        "🍔 food": "bg-amber-500",
                        "🛒 shopping": "bg-slate-500",
                        "🚗 travel": "bg-blue-500",
                        "⛽ fuel": "bg-blue-500",
                        "🏠 rent": "bg-emerald-500",
                        "💡 bills": "bg-emerald-500",
                        "🎬 entertainment": "bg-red-500",
                        "🏥 healthcare": "bg-red-500",
                        "📚 education": "bg-violet-500",
                        "🛍 personal care": "bg-violet-500",
                        "🎁 gifts": "bg-pink-500",
                        "📱 subscriptions": "bg-pink-500",
                        "💼 business": "bg-indigo-500"
                      };
                      const dotColor = dotColors[c.name.toLowerCase()] || "bg-slate-400";
                      return (
                        <div key={c.name} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
                            <span className="font-semibold text-on-surface capitalize">{c.name}</span>
                          </div>
                          <span className="font-data-md text-text-muted">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Categories;
