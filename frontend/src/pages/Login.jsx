import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(email, password);
      setSuccessMessage(`Login successful! Welcome back, ${response.user.name}.`);
      
      // Navigate to dashboard page after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setErrors({ form: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthLayout>
      <AuthCard>
        {successMessage ? (
          <div className="space-y-4 py-8 text-center animate-pulse">
            <div className="inline-flex items-center justify-center p-3 bg-tertiary/10 rounded-full text-tertiary mb-2">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-text-primary">
              Success
            </h3>
            <p className="font-body-md text-text-muted">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-stack-md form-transition" id="loginForm">
            {errors.form && (
              <div className="p-4 bg-error-container/30 border border-error/30 rounded-lg text-error text-body-md flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px] shrink-0">warning</span>
                <span>{errors.form}</span>
              </div>
            )}

            <AuthInput
              label="Email Address"
              type="email"
              name="email"
              id="loginEmail"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <PasswordInput
              label="Password"
              name="password"
              id="loginPass"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between font-body-md select-none">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border bg-surface-container-low text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-label-sm text-text-muted group-hover:text-text-primary transition-colors">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-label-sm text-primary hover:underline transition-all">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                "Secure Login"
              )}
            </button>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
