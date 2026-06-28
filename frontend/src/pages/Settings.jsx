import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../services/authService";

const Settings = () => {
  const { user, setUser, logout, currency, setCurrency } = useAuth();

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preferences State (now loaded from AuthContext)

  // Notifications State
  const [emailNotif, setEmailNotif] = useState(true);
  const [reminderNotif, setReminderNotif] = useState(true);

  // Toast State
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Trigger Toast Notification
  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Theme change function
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const applyTheme = (t) => {
      if (t === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else if (t === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        // System default
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemPrefersDark) {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
        }
      }
    };

    applyTheme(newTheme);
    triggerToast(`Theme preference updated to ${newTheme}`);
  };

  // Listen to system theme changes in real-time if system default is active
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      triggerToast("Please enter current password");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast("Passwords do not match!");
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword });
      triggerToast("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to update password");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await updateProfile({ name: fullName, email });
      setUser(response.user);
      setIsEditingProfile(false);
      triggerToast("Profile details saved successfully!");
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to update profile details");
    }
  };

  return (
    <div className="font-body-md text-on-surface bg-background dark:bg-on-background min-h-screen">
      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border dark:border-border/10 flex flex-col py-gutter z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <img alt="MoneyMap Logo" className="w-10 h-10 object-contain" src={logo} />
          <span className="font-headline-md text-headline-md font-bold text-primary">MoneyMap</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-all" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-sm text-label-sm">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-all" to="/transactions">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-label-sm text-label-sm">Transactions</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-all" to="/add-transaction">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-label-sm text-label-sm">Add Transaction</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-all" to="/categories">
            <span className="material-symbols-outlined">category</span>
            <span className="font-label-sm text-label-sm">Categories</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-all" to="/reports">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-label-sm text-label-sm">Reports</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-all" to="/budget">
            <span className="material-symbols-outlined">account_balance</span>
            <span className="font-label-sm text-label-sm">Budget Planning</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-all" to="/ai-analytics">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-label-sm text-label-sm">AI Analytics</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50/50 text-primary border-r-4 border-primary font-bold transition-all sidebar-active" to="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-sm text-label-sm">Settings</span>
          </Link>
        </nav>
        <div className="px-3 mt-auto pt-6 border-t border-border space-y-1">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-all w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-sm text-label-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[256px] min-h-screen">
        {/* Top Navigation */}
        <header className="fixed top-0 right-0 w-[calc(100%-256px)] h-16 bg-white/80 backdrop-blur-md border-b border-border flex items-center justify-between px-gutter z-40">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="font-headline-md text-headline-md text-on-surface">Settings</h1>
              <p className="font-label-sm text-label-sm text-secondary">Manage your account and preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-full text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-64"
                placeholder="Search settings..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <div className="flex flex-col items-end hidden lg:flex">
                <span className="font-label-sm text-label-sm font-bold">{fullName}</span>
                <span className="text-[10px] text-secondary uppercase tracking-wider">Premium Member</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border-2 border-primary-container">
                <span className="material-symbols-outlined text-primary">account_circle</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="pt-[96px] pb-20 px-gutter flex justify-center">
          <div className="w-full max-w-[1000px] space-y-stack-lg">
            {/* 1. Profile Section */}
            <section className="glass-card rounded-xl p-stack-lg bg-white border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary">person</span>
                <h2 className="font-headline-md text-[20px]">Profile</h2>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-low shadow-sm">
                    <img
                      className="w-full h-full object-cover"
                      alt="Premium User Avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu68mnF-XytQL1fWr8dAf85-Ot_3tSHhxNnZQScwXfyaBoikr8dl87UN1yE803MaFp-fqN4ZZeuzGDJ73SiKePf4_tsoEjS1IZsVuA2wHXVFGfPyhd-lNOlzZfL8wh7X7HJd1ugIRmvpPsUbBxQoanM8cJETzxj3zdDVQVdH6-sNinyblRZRYaiTX3ZcDGQOR7Tjdzbydcj0DsaoIw-8GhpKc5VM6Jpz-UyE-e3laA_feyAVife6mRpOaCbWy5GvduK4_XS4AP7WM"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-secondary uppercase tracking-wider block">Full Name</label>
                      {isEditingProfile ? (
                        <input
                          className="w-full border-border rounded-lg px-3 py-1 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      ) : (
                        <p className="font-body-lg text-on-surface font-semibold">{fullName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-secondary uppercase tracking-wider block">Email Address</label>
                      {isEditingProfile ? (
                        <input
                          className="w-full border-border rounded-lg px-3 py-1 text-on-surface bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      ) : (
                        <p className="font-body-lg text-on-surface font-semibold">{email}</p>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end md:justify-start">
                    {isEditingProfile ? (
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-emerald-600 transition-colors active:scale-95 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[20px]">save</span>
                        <span>Save Profile</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary/5 transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit_square</span>
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Security Section */}
            <section className="glass-card rounded-xl p-stack-lg bg-white border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary">lock_open</span>
                <h2 className="font-headline-md text-[20px]">Security</h2>
              </div>
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <h3 className="font-label-sm text-secondary uppercase tracking-widest border-b border-border pb-2">Change Password</h3>
                <div className="grid grid-cols-1 gap-5 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant block">Current Password</label>
                    <div className="relative">
                      <input
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all pr-12"
                        placeholder="Enter current password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                      >
                        <span className="material-symbols-outlined">{showCurrentPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant block">New Password</label>
                    <div className="relative">
                      <input
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all pr-12"
                        placeholder="Enter new password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                      >
                        <span className="material-symbols-outlined">{showNewPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant block">Confirm Password</label>
                    <div className="relative">
                      <input
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all pr-12"
                        placeholder="Confirm new password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                      >
                        <span className="material-symbols-outlined">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </section>

            {/* 3. Preferences Section */}
            <section className="glass-card rounded-xl p-stack-lg bg-white border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary">tune</span>
                <h2 className="font-headline-md text-[20px]">Preferences</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-on-surface-variant block">Default Currency</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none px-4 py-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all cursor-pointer"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="₹ Indian Rupee (INR)">₹ Indian Rupee (INR)</option>
                      <option value="$ US Dollar (USD)">$ US Dollar (USD)</option>
                      <option value="€ Euro (EUR)">€ Euro (EUR)</option>
                      <option value="£ British Pound (GBP)">£ British Pound (GBP)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">expand_more</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-on-surface-variant block">Theme Mode</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={theme === "light"}
                        onChange={() => handleThemeChange("light")}
                        className="w-5 h-5 text-primary border-border focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="font-body-md group-hover:text-primary transition-colors">Light</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={theme === "dark"}
                        onChange={() => handleThemeChange("dark")}
                        className="w-5 h-5 text-primary border-border focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="font-body-md group-hover:text-primary transition-colors">Dark</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={theme === "light"}
                        onChange={() => handleThemeChange("light")}
                        className="w-5 h-5 text-primary border-border focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="font-body-md group-hover:text-primary transition-colors">Light Theme</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Toast Notification Container */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-primary text-[20px]">info</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
