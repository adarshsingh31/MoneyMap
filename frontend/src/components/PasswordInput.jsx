import React, { useState } from "react";

const PasswordInput = ({ label, placeholder = "••••••••", value, onChange, error, name, required = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputId = props.id || name || "password-input";

  return (
    <div className="space-y-stack-sm w-full">
      {label && (
        <label htmlFor={inputId} className="block font-label-sm text-label-sm text-text-muted uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full bg-surface-container-low border-border rounded-lg px-4 py-3 pr-12 text-text-primary focus:border-primary focus:ring-0 transition-all placeholder:text-text-muted/40 font-body-md"
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none transition-colors"
        >
          <span className="material-symbols-outlined text-[20px] select-none">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
      {error && (
        <p className="text-xs text-error mt-1 flex items-center gap-1 font-body-md">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
