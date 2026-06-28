import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions] = useState([
    {
      id: 1,
      desc: "Salary Deposit",
      category: "Monthly Payroll",
      type: "income",
      amount: 50000,
      date: "20 May 2024",
      icon: "payments",
      iconBg: "bg-emerald-50 text-primary"
    },
    {
      id: 2,
      desc: "Gourmet Bistro",
      category: "Food & Drinks",
      type: "expense",
      amount: 1240,
      date: "19 May 2024",
      icon: "restaurant",
      iconBg: "bg-red-50 text-error"
    },
    {
      id: 3,
      desc: "Shell Station",
      category: "Transportation",
      type: "expense",
      amount: 2500,
      date: "19 May 2024",
      icon: "local_gas_station",
      iconBg: "bg-red-50 text-error"
    },
    {
      id: 4,
      desc: "Netflix",
      category: "Entertainment",
      type: "expense",
      amount: 499,
      date: "18 May 2024",
      icon: "smart_display",
      iconBg: "bg-blue-50 text-blue-600"
    },
    {
      id: 5,
      desc: "Freelance Work",
      category: "Digital Design",
      type: "income",
      amount: 8000,
      date: "18 May 2024",
      icon: "work",
      iconBg: "bg-emerald-50 text-primary"
    }
  ]);

  useEffect(() => {
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
  }, []);

  const filteredTransactions = transactions.filter((t) =>
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Welcome Header */}
        <div className="mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-text-primary">Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome back, User! Your financial overview is up to date.</p>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
          {/* Balance Card */}
          <div className="glass-card rounded-xl p-6 relative overflow-hidden group bg-white shadow-sm border border-border">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-primary">account_balance_wallet</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-text-muted text-sm font-medium">Total Balance</span>
              <h2 className="font-data-lg text-headline-lg text-primary">₹142,500</h2>
              <div className="flex items-center gap-1 text-emerald-600 text-xs mt-2 font-medium">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span>+12.5% vs last month</span>
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="glass-card rounded-xl p-6 relative overflow-hidden group bg-white shadow-sm border border-border">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-emerald-500">arrow_downward</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-text-muted text-sm font-medium">Total Income</span>
              <h2 className="font-data-lg text-headline-lg text-emerald-600">₹58,000</h2>
              <p className="text-text-muted text-xs mt-2">Received this month</p>
            </div>
          </div>

          {/* Expense Card */}
          <div className="glass-card rounded-xl p-6 relative overflow-hidden group bg-white shadow-sm border border-border">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-error">arrow_upward</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-text-muted text-sm font-medium">Total Expenses</span>
              <h2 className="font-data-lg text-headline-lg text-error">₹24,350</h2>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-4">
                <div className="bg-error h-full rounded-full w-[42%]"></div>
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
              <h2 className="font-data-lg text-headline-lg text-on-surface">{transactions.length}</h2>
              <p className="text-text-muted text-xs mt-2">Active this billing cycle</p>
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
                <p className="text-text-muted text-sm">Monthly spending trajectory</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-border text-text-muted hover:text-primary hover:border-primary transition-all">Daily</button>
                <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white shadow-sm">Monthly</button>
              </div>
            </div>
            <div className="h-[300px] w-full flex items-end justify-between gap-2 px-2">
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[20%]"></div>
                <span className="text-[10px] text-text-muted">Jan</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[35%]"></div>
                <span className="text-[10px] text-text-muted">Feb</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[25%]"></div>
                <span className="text-[10px] text-text-muted">Mar</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[45%]"></div>
                <span className="text-[10px] text-text-muted">Apr</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[30%]"></div>
                <span className="text-[10px] text-text-muted">May</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-primary rounded-t-lg h-[85%] relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border border-border px-2 py-1 rounded shadow-sm text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">₹8,450</div>
                </div>
                <span className="text-[10px] text-primary font-bold">Jun</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[55%]"></div>
                <span className="text-[10px] text-text-muted">Jul</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[40%]"></div>
                <span className="text-[10px] text-text-muted">Aug</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[60%]"></div>
                <span className="text-[10px] text-text-muted">Sep</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[35%]"></div>
                <span className="text-[10px] text-text-muted">Oct</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[20%]"></div>
                <span className="text-[10px] text-text-muted">Nov</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg group-hover:bg-primary/20 transition-colors h-[15%]"></div>
                <span className="text-[10px] text-text-muted">Dec</span>
              </div>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="lg:col-span-1 glass-card rounded-xl p-8 flex flex-col bg-white shadow-sm border border-border">
            <h3 className="font-headline-md text-text-primary mb-1">Categories</h3>
            <p className="text-text-muted text-sm mb-8">Spending by department</p>
            <div className="flex-1 flex items-center justify-center relative mb-8">
              {/* Donut Mockup */}
              <div className="w-44 h-44 rounded-full border-[20px] border-slate-50 relative flex items-center justify-center">
                <div className="absolute inset-[-20px] rounded-full border-[20px] border-primary border-r-transparent border-b-transparent rotate-45"></div>
                <div className="absolute inset-[-20px] rounded-full border-[20px] border-slate-300 border-l-transparent border-t-transparent -rotate-12"></div>
                <div className="text-center">
                  <span className="text-3xl font-bold font-data-lg text-text-primary">6</span>
                  <p className="text-[10px] text-text-muted uppercase font-semibold">Active</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-on-surface font-medium">Essentials</span>
                </div>
                <span className="font-data-md text-text-muted">45%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <span className="text-on-surface font-medium">Lifestyle</span>
                </div>
                <span className="font-data-md text-text-muted">32%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-200"></div>
                  <span className="text-on-surface font-medium">Subscriptions</span>
                </div>
                <span className="font-data-md text-text-muted">15%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <span className="text-on-surface font-medium">Other</span>
                </div>
                <span className="font-data-md text-text-muted">8%</span>
              </div>
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
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.iconBg}`}>
                          <span className="material-symbols-outlined">{t.icon}</span>
                        </div>
                        <div>
                          <p className="text-on-surface font-semibold">{t.desc}</p>
                          <p className="text-[10px] text-text-muted">{t.category}</p>
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
                      <span className={`font-data-md font-bold ${
                        t.type === "income" ? "text-emerald-600" : "text-error"
                      }`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}.00
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right text-text-muted text-sm">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

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
