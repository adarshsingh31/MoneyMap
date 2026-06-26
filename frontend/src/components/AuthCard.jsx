import React from "react";
import { Link, useLocation } from "react-router-dom";

const AuthCard = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="w-full max-w-md glass rounded-xl p-stack-lg shadow-2xl relative overflow-hidden">
      {/* Inner Glow Decor */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Auth Toggle */}
      <div className="flex border-b border-outline-variant/30 mb-8 select-none">
        <Link
          to="/login"
          id="loginTab"
          className={`flex-1 pb-stack-sm font-headline-md text-headline-md text-center transition-all ${
            isLogin ? "active-tab font-semibold" : "text-text-muted"
          }`}
        >
          Login
        </Link>
        <Link
          to="/register"
          id="registerTab"
          className={`flex-1 pb-stack-sm font-headline-md text-headline-md text-center transition-all ${
            !isLogin ? "active-tab font-semibold" : "text-text-muted"
          }`}
        >
          Register
        </Link>
      </div>

      {children}
    </div>
  );
};

export default AuthCard;
