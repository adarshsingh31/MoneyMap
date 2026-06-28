import React, { useEffect, useRef } from "react";

/**
 * ConfirmationModal — A reusable, accessible confirmation dialog.
 *
 * Props:
 *   isOpen        {boolean}   — Whether the modal is visible
 *   onClose       {function}  — Called when the user dismisses (Cancel / Escape / backdrop click)
 *   onConfirm     {function}  — Called when the user clicks the confirm button
 *   isLoading     {boolean}   — If true, disables buttons and shows a spinner inside the confirm button
 *   title         {string}    — Modal heading  (default: "Are you sure?")
 *   message       {string}    — Body text
 *   confirmLabel  {string}    — Label for the confirm button (default: "Confirm")
 *   cancelLabel   {string}    — Label for the cancel button  (default: "Cancel")
 *   variant       {string}    — "danger" | "warning" | "info" (default: "danger")
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}) => {
  const cancelBtnRef = useRef(null);
  const overlayRef = useRef(null);

  // ── Focus management ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Focus the Cancel button by default (safer for destructive actions)
      setTimeout(() => cancelBtnRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // ── Escape key & focus trap ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = overlayRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ── Scroll-lock ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Variant config ────────────────────────────────────────────────────────
  const variantConfig = {
    danger: {
      iconBg:      "#FEF2F2",
      iconColor:   "#EF4444",
      icon:        "delete_forever",
      btnBg:       "#EF4444",
      btnHoverBg:  "#DC2626",
      btnRing:     "rgba(239,68,68,0.4)",
    },
    warning: {
      iconBg:      "#FFFBEB",
      iconColor:   "#F59E0B",
      icon:        "warning",
      btnBg:       "#F59E0B",
      btnHoverBg:  "#D97706",
      btnRing:     "rgba(245,158,11,0.4)",
    },
    info: {
      iconBg:      "#EFF6FF",
      iconColor:   "#3B82F6",
      icon:        "info",
      btnBg:       "#3B82F6",
      btnHoverBg:  "#2563EB",
      btnRing:     "rgba(59,130,246,0.4)",
    },
  };
  const cfg = variantConfig[variant] ?? variantConfig.danger;

  return (
    <>
      {/* ─────────────── Keyframe animations (injected once) ─────────────── */}
      <style>{`
        @keyframes _mm_fade_in   { from{opacity:0}          to{opacity:1} }
        @keyframes _mm_scale_in  {
          from { opacity:0; transform:scale(0.95) translateY(-6px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
        @keyframes _mm_spin {
          to { transform: rotate(360deg); }
        }
        ._mm_backdrop {
          animation: _mm_fade_in 180ms ease forwards;
        }
        ._mm_card {
          animation: _mm_scale_in 220ms cubic-bezier(0.34,1.28,0.64,1) forwards;
        }
        ._mm_spinner {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: _mm_spin 0.65s linear infinite;
          flex-shrink: 0;
        }
        ._mm_confirm_btn:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px -4px var(--mm-btn-shadow);
        }
        ._mm_confirm_btn:active:not(:disabled) {
          transform: translateY(0);
        }
        ._mm_cancel_btn:hover:not(:disabled) {
          background-color: #F1F5F9;
          color: #0F172A;
        }
      `}</style>

      {/* ─────────────────────── Backdrop ─────────────────────────────────── */}
      <div
        ref={overlayRef}
        className="_mm_backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mm-title"
        aria-describedby="mm-desc"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          backgroundColor: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        {/* ───────────────────── Modal Card ────────────────────────────── */}
        <div
          className="_mm_card"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--surface, #FFFFFF)",
            borderRadius: "16px",
            boxShadow: "0 24px 64px -16px rgba(0,0,0,0.28), 0 4px 16px -4px rgba(0,0,0,0.12)",
            border: "1px solid var(--border, #E2E8F0)",
            width: "100%",
            maxWidth: "380px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.25rem",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              background: cfg.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "36px",
                color: cfg.iconColor,
                fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
              }}
            >
              {cfg.icon}
            </span>
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <h3
              id="mm-title"
              style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "var(--text-primary, #0F172A)",
                lineHeight: 1.3,
                fontFamily: "inherit",
              }}
            >
              {title}
            </h3>
            <p
              id="mm-desc"
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "var(--text-muted, #64748B)",
                lineHeight: 1.55,
                fontFamily: "inherit",
              }}
            >
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", width: "100%", paddingTop: "0.25rem" }}>
            {/* Cancel */}
            <button
              ref={cancelBtnRef}
              type="button"
              className="_mm_cancel_btn"
              onClick={onClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--border, #E2E8F0)",
                background: "var(--surface-container, #F1F5F9)",
                color: "var(--text-muted, #64748B)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
                transition: "all 150ms ease",
                outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(100,116,139,0.25)"; }}
              onBlur={(e)  => { e.target.style.boxShadow = "none"; }}
            >
              {cancelLabel}
            </button>

            {/* Confirm / Delete */}
            <button
              type="button"
              className="_mm_confirm_btn"
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: cfg.btnBg,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.8 : 1,
                transition: "all 150ms ease",
                outline: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontFamily: "inherit",
                "--mm-btn-shadow": cfg.btnRing,
              }}
              onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${cfg.btnRing}`; }}
              onBlur={(e)  => { e.target.style.boxShadow = "none"; }}
            >
              {isLoading ? (
                <>
                  <span className="_mm_spinner" aria-hidden="true" />
                  <span>Deleting…</span>
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
