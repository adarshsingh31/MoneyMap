import React from "react";

const SocialLogin = ({ type = "login", onSocialClick }) => {
  const label = type === "login" ? "Login" : "Sign Up";
  
  const handleGoogleClick = () => {
    if (onSocialClick) {
      onSocialClick("google");
    } else {
      console.log(`Google ${label} clicked`);
    }
  };

  const handleGithubClick = () => {
    if (onSocialClick) {
      onSocialClick("github");
    } else {
      console.log(`GitHub ${label} clicked`);
    }
  };

  return (
    <div className="space-y-4 w-full font-body-md">
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/30"></div>
        </div>
        <span className="relative px-3 bg-surface/80 backdrop-blur-md text-label-sm text-text-muted uppercase tracking-wider">
          Or continue with
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleGoogleClick}
          className="flex items-center justify-center gap-2 py-3 bg-surface-container-high/50 hover:bg-surface-container-highest border border-outline-variant/30 rounded-lg text-text-primary transition-all hover:scale-[1.02] active:scale-95"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="h-5 w-5"
            alt="Google"
          />
          <span className="text-body-md font-medium">{label}</span>
        </button>
        
        <button
          type="button"
          onClick={handleGithubClick}
          className="flex items-center justify-center gap-2 py-3 bg-surface-container-high/50 hover:bg-surface-container-highest border border-outline-variant/30 rounded-lg text-text-primary transition-all hover:scale-[1.02] active:scale-95"
        >
          <img
            src="https://www.svgrepo.com/show/512317/github-142.svg"
            className="h-5 w-5 dark:invert"
            alt="GitHub"
          />
          <span className="text-body-md font-medium">{label}</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
