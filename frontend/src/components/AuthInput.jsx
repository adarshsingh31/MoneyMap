import React from "react";

const AuthInput = ({ label, type = "text", placeholder, value, onChange, error, name, required = false, ...props }) => {
  const inputId = props.id || name;
  
  return (
    <div className="space-y-stack-sm w-full">
      {label && (
        <label htmlFor={inputId} className="block font-label-sm text-label-sm text-text-muted uppercase">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-surface-container-low border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:ring-0 transition-all placeholder:text-text-muted/40 font-body-md"
        {...props}
      />
      {error && (
        <p className="text-xs text-error mt-1 flex items-center gap-1 font-body-md">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
