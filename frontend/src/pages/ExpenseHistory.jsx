import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { getExpenses, deleteExpense, updateExpense } from "../services/expenseService";
import ConfirmationModal from "../components/ConfirmationModal";

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

const expenseCategoriesList = [
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

const incomeCategoriesList = [
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

const ExpenseHistory = () => {
  const navigate = useNavigate();
  const { logout, user, currencySymbol } = useAuth();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedMonth, setSelectedMonth] = useState("All Months");

  // Transactions & Loading States
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("🍔 Food");
  const [editType, setEditType] = useState("expense");
  const [editDate, setEditDate] = useState("");

  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses();
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!loading) {
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
    }
  }, [loading]);

  // Opens the confirmation modal for the given transaction id
  const requestDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  // Called when the user confirms deletion inside the modal
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteExpense(deletingId);
      setShowDeleteModal(false);
      setDeletingId(null);
      showToast("Transaction deleted successfully.", "success");
      await fetchTransactions();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletingId(null);
      showToast(err.message || "Failed to delete transaction.", "error");
      setError(err.message || "Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (t) => {
    setEditingTransaction(t);
    setEditTitle(t.title);
    setEditAmount(t.amount);
    setEditCategory(t.category);
    setEditType(t.type);
    
    // Format date to yyyy-mm-dd
    const rawDate = new Date(t.date || Date.now());
    const validDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;
    const yyyy = validDate.getFullYear();
    const mm = String(validDate.getMonth() + 1).padStart(2, "0");
    const dd = String(validDate.getDate()).padStart(2, "0");
    setEditDate(`${yyyy}-${mm}-${dd}`);
    
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateExpense(editingTransaction._id, {
        title: editTitle,
        amount: Number(editAmount),
        category: editCategory,
        type: editType,
        date: editDate
      });
      setShowEditModal(false);
      setEditingTransaction(null);
      await fetchTransactions();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All Categories" ||
      (t.category || "").toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesType =
      selectedType === "All Types" ||
      (t.type || "").toLowerCase() === selectedType.toLowerCase();
    
    let matchesMonth = true;
    if (selectedMonth !== "All Months") {
      const rawDate = new Date(t.date || Date.now());
      const validDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;
      const monthYear = `${validDate.toLocaleString("default", { month: "long" })} ${validDate.getFullYear()}`;
      matchesMonth = monthYear.toLowerCase() === selectedMonth.toLowerCase();
    }

    return matchesSearch && matchesCategory && matchesType && matchesMonth;
  });

  // Extract unique months for filter safely
  const uniqueMonths = Array.from(new Set(transactions.map(t => {
    const rawDate = new Date(t.date || Date.now());
    const validDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;
    return `${validDate.toLocaleString("default", { month: "long" })} ${validDate.getFullYear()}`;
  })));

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-text-muted font-body-md">Loading transaction history...</span>
        </div>
      </div>
    );
  }

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
              <p className="text-on-surface font-bold text-sm leading-none">{user?.name || "Premium User"}</p>
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

        {error && (
          <div className="p-4 mb-6 bg-error-container/30 border border-error/30 rounded-lg text-error text-body-md flex items-start gap-2 max-w-container-max">
            <span className="material-symbols-outlined text-[20px] shrink-0">warning</span>
            <span>{error}</span>
          </div>
        )}

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
                  className="w-full bg-slate-50 border border-outline rounded-lg px-4 py-2 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none font-semibold text-on-surface"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All Categories">All Categories</option>
                  <option disabled>-- Expenses --</option>
                  {expenseCategoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option disabled>-- Income --</option>
                  {incomeCategoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
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
                  {uniqueMonths.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
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
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${style.iconBg}`}>
                            <span className="material-symbols-outlined">{style.icon}</span>
                          </div>
                          <div>
                            <p className="text-on-surface font-semibold text-lg capitalize">{t.title}</p>
                            <p className="text-[10px] text-text-muted capitalize">Category: {t.category}</p>
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
                        <div className={`font-data-lg font-bold ${
                          t.type === "income" ? "text-emerald-600" : "text-error"
                        }`}>
                          {t.type === "income" ? "+" : "-"}{currencySymbol}{t.amount.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-text-muted">{formattedDate}</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(t);
                            }}
                            className="p-2 text-text-muted hover:text-primary transition-colors border border-outline rounded-lg bg-white"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              requestDelete(t._id);
                            }}
                            className="p-2 text-text-muted hover:text-error transition-colors border border-outline rounded-lg bg-white"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* ── Delete Confirmation Modal ────────────────────────────────── */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!isDeleting) {
            setShowDeleteModal(false);
            setDeletingId(null);
          }
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Transaction?"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />

      {/* ── Toast Notification ──────────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            background: toast.type === "success" ? "#0F172A" : "#EF4444",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 600,
            boxShadow: "0 8px 32px -8px rgba(0,0,0,0.35)",
            animation: "_mm_fade_in 200ms ease forwards",
            whiteSpace: "nowrap",
            fontFamily: "inherit",
          }}
          role="status"
          aria-live="polite"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "18px",
              fontVariationSettings: "'FILL' 1",
              color: toast.type === "success" ? "#10B981" : "#fff",
            }}
          >
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          {toast.message}
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-text-primary">Edit Transaction</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTransaction(null);
                }}
                className="text-text-muted hover:text-on-surface p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Title</label>
                <input
                  required
                  className="w-full border-border rounded-lg px-4 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Amount ({currencySymbol})</label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="any"
                  className="w-full border-border rounded-lg px-4 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Date</label>
                <input
                  required
                  type="date"
                  className="w-full border-border rounded-lg px-4 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Type</label>
                  <div className="relative">
                    <select
                      className="w-full border-border rounded-lg pl-4 pr-10 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                      value={editType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setEditType(newType);
                        setEditCategory(newType === "expense" ? "🍔 Food" : "💼 Salary");
                      }}
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-text-muted uppercase tracking-widest mb-2">Category</label>
                  <div className="relative">
                    <select
                      className="w-full border-border rounded-lg pl-4 pr-10 py-2.5 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    >
                      {(editType === "expense" ? expenseCategoriesList : incomeCategoriesList).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTransaction(null);
                  }}
                  className="w-1/2 py-3 border border-border text-text-muted hover:bg-slate-50 hover:text-on-surface rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-primary text-white font-bold rounded-lg hover:bg-emerald-600 shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseHistory;
