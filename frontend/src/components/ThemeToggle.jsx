import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check if the html class contains 'dark'
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-3 bg-surface-container-high/60 backdrop-blur-md border border-outline-variant/30 rounded-xl text-text-primary hover:text-primary transition-all shadow-md focus:outline-none flex items-center justify-center hover:scale-105 active:scale-95"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="material-symbols-outlined text-[20px] select-none">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
