import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Reports = () => {
  // Date State
  const [fromDate, setFromDate] = useState("2026-06-01");
  const [toDate, setToDate] = useState("2026-06-28");
  const [searchQuery, setSearchQuery] = useState("");

  // Summary Metrics State
  const [income, setIncome] = useState(62500);
  const [expense, setExpense] = useState(19200);
  const [savings, setSavings] = useState(8750);

  // Recent Report Rows State
  const [reportRows, setReportRows] = useState([
    {
      id: 1,
      date: "28 Jun 2026",
      title: "Grocery Shopping",
      category: "Food",
      type: "expense",
      amount: 850,
      icon: "restaurant"
    },
    {
      id: 2,
      date: "27 Jun 2026",
      title: "Salary Deposit",
      category: "Salary",
      type: "income",
      amount: 50000,
      icon: "payments"
    }
  ]);

  useEffect(() => {
    // Smooth hover effects on cards
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
  }, []);

  const handleGenerateReport = () => {
    // Basic interaction simulation
    alert(`Generating report from ${fromDate} to ${toDate}`);
  };

  const filteredRows = reportRows.filter(
    (row) =>
      row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.category.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Link className="flex items-center gap-3 px-6 py-3 text-text-muted hover:bg-surface-variant hover:text-on-surface transition-colors" to="/categories">
            <span className="material-symbols-outlined">category</span>
            <span className="font-body-md">Categories</span>
          </Link>
          <Link className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 text-primary border-r-4 border-primary transition-all duration-200" to="/reports">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-medium">Reports</span>
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
        {/* Top Navigation Bar */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white border-b border-border shadow-sm z-40 flex justify-between items-center px-gutter">
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

        <main className="mt-16 p-8 flex-1">
          <div className="mb-8">
            <h2 className="font-headline-lg text-headline-lg text-text-primary mb-1">Reports</h2>
            <p className="font-body-md text-text-muted">Detailed insights about your income and expenses</p>
          </div>

          <div className="space-y-8 max-w-container-max">
            {/* Date Range Selector */}
            <section className="glass-card p-6 rounded-xl flex flex-wrap items-end gap-6 bg-white border border-border shadow-sm">
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
                onClick={handleGenerateReport}
                className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">analytics</span>
                Generate Report
              </button>
            </section>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              <div className="glass-card p-6 rounded-xl space-y-4 bg-white border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Total Income</p>
                    <h3 className="font-data-lg text-data-lg text-emerald-600">₹{income.toLocaleString("en-IN")}</h3>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-emerald-600 font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span> 12.5%
                  </span>
                  <span className="text-text-muted text-[10px]">vs last period</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-4 bg-white border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error">trending_down</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Total Expense</p>
                    <h3 className="font-data-lg text-data-lg text-error">₹{expense.toLocaleString("en-IN")}</h3>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-error font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">arrow_downward</span> 8.3%
                  </span>
                  <span className="text-text-muted text-[10px]">vs last period</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-4 bg-white border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600">account_balance_wallet</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Net Balance</p>
                    <h3 className="font-data-lg text-data-lg text-blue-600">₹{(income - expense).toLocaleString("en-IN")}</h3>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-blue-600 font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span> 15.7%
                  </span>
                  <span className="text-text-muted text-[10px]">vs last period</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-4 bg-white border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">savings</span>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Savings</p>
                    <h3 className="font-data-lg text-data-lg text-primary">₹{savings.toLocaleString("en-IN")}</h3>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-primary font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span> 10.2%
                  </span>
                  <span className="text-text-muted text-[10px]">vs last period</span>
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
                  <div className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-full flex justify-center gap-1 h-full items-end">
                      <div className="w-3 bg-emerald-100 rounded-t h-[70%]"></div>
                      <div className="w-3 bg-red-100 rounded-t h-[30%]"></div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-2">Jan</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-full flex justify-center gap-1 h-full items-end">
                      <div className="w-3 bg-emerald-100 rounded-t h-[60%]"></div>
                      <div className="w-3 bg-red-100 rounded-t h-[40%]"></div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-2">Feb</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-full flex justify-center gap-1 h-full items-end">
                      <div className="w-3 bg-emerald-100 rounded-t h-[65%]"></div>
                      <div className="w-3 bg-red-100 rounded-t h-[35%]"></div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-2">Mar</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-full flex justify-center gap-1 h-full items-end">
                      <div className="w-3 bg-emerald-100 rounded-t h-[80%]"></div>
                      <div className="w-3 bg-red-100 rounded-t h-[20%]"></div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-2">Apr</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-full flex justify-center gap-1 h-full items-end">
                      <div className="w-3 bg-emerald-100 rounded-t h-[75%]"></div>
                      <div className="w-3 bg-red-100 rounded-t h-[45%]"></div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-2">May</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-full flex justify-center gap-1 h-full items-end">
                      <div className="w-3 bg-primary rounded-t h-[90%]"></div>
                      <div className="w-3 bg-error rounded-t h-[50%]"></div>
                    </div>
                    <span className="text-[10px] text-on-surface font-bold mt-2">Jun</span>
                  </div>
                </div>
              </div>

              {/* Doughnut Chart */}
              <div className="glass-card p-6 rounded-xl bg-white border border-border shadow-sm">
                <h3 className="font-headline-md text-headline-md text-text-primary mb-8">Category-wise Expense</h3>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#F1F5F9" strokeWidth="3"></circle>
                      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#3B82F6" strokeDasharray="40 60" strokeDashoffset="0" strokeWidth="4"></circle>
                      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#10B981" strokeDasharray="23 77" strokeDashoffset="-40" strokeWidth="4"></circle>
                      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#EF4444" strokeDasharray="16 84" strokeDashoffset="-63" strokeWidth="4"></circle>
                      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#64748B" strokeDasharray="21 79" strokeDashoffset="-79" strokeWidth="4"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-data-md text-data-md text-on-surface font-bold">₹19,200</span>
                      <span className="text-[10px] text-text-muted">Total Exp</span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="font-label-sm text-label-sm text-text-muted">Shopping</span>
                      <span className="font-data-md text-data-md text-on-surface ml-auto">40%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-label-sm text-label-sm text-text-muted">Food</span>
                      <span className="font-data-md text-data-md text-on-surface ml-auto">23%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      <span className="font-label-sm text-label-sm text-text-muted">Bills</span>
                      <span className="font-data-md text-data-md text-on-surface ml-auto">16%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      <span className="font-label-sm text-label-sm text-text-muted">Others</span>
                      <span className="font-data-md text-data-md text-on-surface ml-auto">21%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Top Spending Categories */}
            <section className="glass-card p-6 rounded-xl bg-white border border-border shadow-sm">
              <h3 className="font-headline-md text-headline-md text-text-primary mb-6">Top Spending Categories</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">shopping_bag</span>
                      <span className="font-label-sm text-label-sm text-on-surface">Shopping</span>
                    </div>
                    <span className="font-data-md text-data-md text-on-surface font-semibold">₹7,800 <span class="text-text-muted ml-2 font-normal">40.6%</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[40.6%] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">restaurant</span>
                      <span className="font-label-sm text-label-sm text-on-surface">Food</span>
                    </div>
                    <span className="font-data-md text-data-md text-on-surface font-semibold">₹4,500 <span class="text-text-muted ml-2 font-normal">23.4%</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[23.4%] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">electric_bolt</span>
                      <span className="font-label-sm text-label-sm text-on-surface">Bills</span>
                    </div>
                    <span className="font-data-md text-data-md text-on-surface font-semibold">₹3,100 <span class="text-text-muted ml-2 font-normal">16.1%</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-error w-[16.1%] rounded-full"></div>
                  </div>
                </div>
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
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-data-md text-data-md text-on-surface">{row.date}</td>
                        <td className="px-6 py-4 font-body-md text-on-surface font-semibold">{row.title}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-[18px]">{row.icon}</span>
                            </div>
                            <span className="text-sm font-medium">{row.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            row.type === "income" ? "bg-emerald-50 text-primary" : "bg-red-50 text-error"
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 font-data-md text-data-md text-right font-bold ${
                          row.type === "income" ? "text-emerald-600" : "text-error"
                        }`}>
                          {row.type === "income" ? "+" : "-"}₹{row.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
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
                <button
                  onClick={() => alert("Downloading PDF...")}
                  className="flex items-center gap-2 px-6 py-2.5 border border-outline text-text-muted rounded-lg font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                  Download PDF
                </button>
                <button
                  onClick={() => alert("Downloading CSV...")}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-emerald-600 transition-all shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">table_chart</span>
                  Download CSV
                </button>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
