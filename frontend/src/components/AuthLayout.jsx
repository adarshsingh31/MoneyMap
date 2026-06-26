import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.png";


const AuthLayout = ({ children }) => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      const orbs = document.querySelectorAll(".orb");
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 30;
        orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden relative transition-colors duration-300">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="orb absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full transition-transform duration-200 ease-out"></div>
        <div
          className="orb absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary rounded-full transition-transform duration-200 ease-out"
          style={{ animationDelay: "-5s" }}
        ></div>
      </div>

      {/* Floating Theme Toggle in Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row relative z-10 min-h-screen">
        {/* Left Side: Branding & Dashboard Visuals */}
        <section className="hidden md:flex flex-1 flex-col justify-center px-gutter overflow-hidden relative border-r border-outline-variant/20 select-none">
          <div className="max-w-xl mx-auto w-full space-y-stack-lg">
            <div className="flex items-center gap-stack-md mb-8">
              <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <img
                  alt="MoneyMap Logo"
                  className="h-12 w-auto"
                  src={logo}
                />
                <span className="font-headline-md text-headline-md font-bold text-text-primary tracking-tight">
                  MoneyMap
                </span>
              </Link>
            </div>
            
            <h1 className="font-display-hero text-display-hero text-text-primary leading-tight">
              Take Control of Your <span className="text-primary font-bold">Money</span>
            </h1>
            
            <p className="font-body-lg text-body-lg text-text-muted max-w-md">
              Join over 250,000+ users managing their wealth with clinical precision and AI-driven insights.
            </p>

            {/* Floating Cards Visual */}
            <div className="relative mt-stack-lg h-96 w-full">
              {/* Total Balance Card */}
              <div
                className="absolute top-10 left-0 glass p-gutter rounded-xl w-64 shadow-2xl animate-bounce"
                style={{ animationDuration: "8s" }}
              >
                <div className="flex justify-between items-center mb-stack-sm">
                  <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                    Total Balance
                  </span>
                  <span className="material-symbols-outlined text-primary">
                    account_balance_wallet
                  </span>
                </div>
                <div className="font-data-lg text-data-lg text-text-primary">
                  $124,592.00
                </div>
                <div className="mt-stack-sm flex items-center text-tertiary text-label-sm">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  <span className="ml-1 font-medium">+12.5% this month</span>
                </div>
              </div>

              {/* Analytics Card */}
              <div
                className="absolute bottom-10 right-0 glass p-gutter rounded-xl w-80 shadow-2xl animate-pulse"
                style={{ animationDuration: "6s" }}
              >
                <div className="flex justify-between items-center mb-stack-md">
                  <span className="font-label-sm text-label-sm text-text-muted uppercase">
                    Expense Analytics
                  </span>
                  <span className="material-symbols-outlined text-secondary">
                    insights
                  </span>
                </div>
                <div className="space-y-stack-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-body-md text-text-muted">Housing</span>
                    <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-md text-text-muted">Leisure</span>
                    <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Card */}
              <div className="absolute top-1/2 left-1/3 glass p-stack-md rounded-xl w-56 shadow-2xl border-primary/20 backdrop-blur-xl">
                <div className="flex items-center gap-stack-sm">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">
                      savings
                    </span>
                  </div>
                  <div>
                    <div className="font-label-sm text-label-sm text-text-muted">
                      Monthly Savings
                    </div>
                    <div className="font-data-md text-data-md text-text-primary">
                      $4,200.00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Auth Form */}
        <section className="flex-1 flex flex-col items-center justify-center p-gutter min-h-screen md:min-h-0">
          {/* Mobile Logo */}
          <div className="md:hidden mb-stack-lg flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img alt="MoneyMap Logo" className="h-10" src={logo} />
              <span className="font-headline-md text-headline-md font-bold text-text-primary tracking-tight">
                MoneyMap
              </span>
            </Link>
          </div>

          {/* Children (AuthCard containing forms) */}
          {children}

          {/* Secure Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-text-muted select-none">
            <span
              className="material-symbols-outlined text-[18px] text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="font-label-sm text-label-sm">
              256-bit AES Encryption Verified
            </span>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center select-none">
            <p className="font-label-sm text-label-sm text-text-muted opacity-60">
              © 2026 MoneyMap AI. Precision in every penny. •{" "}
              <a className="hover:text-primary transition-colors" href="#">
                Privacy
              </a>{" "}
              •{" "}
              <a className="hover:text-primary transition-colors" href="#">
                Security
              </a>
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default AuthLayout;
