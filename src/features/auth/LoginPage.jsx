// src/features/auth/LoginPage.jsx
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "./authService";
import { useState, useLayoutEffect } from "react";
import { APP_CSS } from "../../components/Common/GlobalCss";

// ─── Forgot‑password service helpers ────────────────────────────────────────
// Replace these with your real API calls
async function ForgotPasswordApi(email) {
  // POST /api/auth/forgot-password  { email }
  // Should send OTP to the user's email
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send reset email.");
  }
}

async function ResetPasswordApi(email, otp, newPassword) {
  // POST /api/auth/reset-password  { email, otp, newPassword }
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Invalid OTP or request expired.");
  }
}
// ────────────────────────────────────────────────────────────────────────────

// View states
const VIEW = { LOGIN: "login", FORGOT: "forgot", RESET: "reset", SUCCESS: "success" };

export default function LoginPage() {
  useLayoutEffect(() => {
    if (!document.getElementById("sv-css")) {
      const s = document.createElement("style");
      s.id = "sv-css";
      s.textContent = APP_CSS;
      document.head.appendChild(s);
    }
    if (!document.getElementById("login-page-css")) {
      const style = document.createElement("style");
      style.id = "login-page-css";
      style.textContent = LOGIN_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  // ── Login state ──
  const [email, setEmail]               = useState("sohan1@gmail.com");
  const [password, setPassword]         = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError]     = useState("");

  // ── Forgot / Reset state ──
  const [view, setView]                 = useState(VIEW.LOGIN);
  const [fpEmail, setFpEmail]           = useState("");
  const [fpLoading, setFpLoading]       = useState(false);
  const [fpError, setFpError]           = useState("");

  const [otp, setOtp]                   = useState("");
  const [newPassword, setNewPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError]     = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);

  // ── Login submit ──
  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await LoginApi(email, password);
      navigate("/dashboard");
    } catch (err) {
      setLoginError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Forgot password: send OTP ──
  const onForgotSubmit = async (e) => {
    e.preventDefault();
    setFpError("");
    setFpLoading(true);
    try {
      await ForgotPasswordApi(fpEmail);
      setView(VIEW.RESET);
      startResendCooldown();
    } catch (err) {
      setFpError(err.message || "Something went wrong.");
    } finally {
      setFpLoading(false);
    }
  };

  // ── Reset password: verify OTP + set new password ──
  const onResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters.");
      return;
    }
    setResetLoading(true);
    try {
      await ResetPasswordApi(fpEmail, otp, newPassword);
      setView(VIEW.SUCCESS);
    } catch (err) {
      setResetError(err.message || "Something went wrong.");
    } finally {
      setResetLoading(false);
    }
  };

  // ── Resend OTP cooldown (60 s) ──
  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const onResendOtp = async () => {
    if (resendCooldown > 0) return;
    setFpError("");
    setFpLoading(true);
    try {
      await ForgotPasswordApi(fpEmail);
      startResendCooldown();
    } catch (err) {
      setFpError(err.message);
    } finally {
      setFpLoading(false);
    }
  };

  // ── Shared left panel ──
  const LeftPanel = () => (
    <div className="lp-left">
      <div className="lp-geo-grid" aria-hidden="true">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="lp-geo-cell" />
        ))}
      </div>
      <div className="lp-left-content">
        <div className="lp-brand">
          <div className="lp-logo-ring">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <rect x="2"  y="2"  width="9" height="9" rx="1.5" fill="white" fillOpacity="0.92"/>
              <rect x="15" y="2"  width="9" height="9" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="2"  y="15" width="9" height="9" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="15" y="15" width="9" height="9" rx="1.5" fill="white" fillOpacity="0.92"/>
            </svg>
          </div>
          <span className="lp-brand-name">SocietyOS</span>
        </div>
        <div className="lp-hero">
          <div className="lp-tagline">RESIDENT MANAGEMENT PLATFORM</div>
          <h1 className="lp-headline">
            Your society,<br />
            <span className="lp-headline-accent">managed with</span><br />
            precision.
          </h1>
          <p className="lp-subtext">
            Streamline maintenance, finances, visitor logs,
            and community communication — all from one portal.
          </p>
        </div>
        <div className="lp-pills">
          {["Maintenance Tickets", "Billing & Dues", "Visitor Logs", "Notices"].map(f => (
            <span key={f} className="lp-pill">
              <span className="lp-pill-dot" />{f}
            </span>
          ))}
        </div>
        <div className="lp-stats-row">
          <div className="lp-stat"><strong>2,400+</strong><span>Societies</span></div>
          <div className="lp-vline" />
          <div className="lp-stat"><strong>1.2M</strong><span>Residents</span></div>
          <div className="lp-vline" />
          <div className="lp-stat"><strong>99.9%</strong><span>Uptime</span></div>
        </div>
      </div>
      <div className="lp-deco-circle lp-dc1" aria-hidden="true" />
      <div className="lp-deco-circle lp-dc2" aria-hidden="true" />
      <div className="lp-deco-circle lp-dc3" aria-hidden="true" />
    </div>
  );

  return (
    <div className="lp-root">
      <LeftPanel />

      <div className="lp-right">

        {/* ══════════ LOGIN VIEW ══════════ */}
        {view === VIEW.LOGIN && (
          <div className="lp-card lp-anim-in">
            <div className="lp-card-accent" />
            <div className="lp-card-body">
              <div className="lp-card-header">
                <div className="lp-avatar-icon">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M3 19c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h2 className="lp-card-title">Sign in to your account</h2>
                  <p className="lp-card-sub">Enter your credentials to continue</p>
                </div>
              </div>

              <form onSubmit={onLoginSubmit} className="lp-form" noValidate>
                <div className="lp-field">
                  <label htmlFor="lp-email" className="lp-label">Email address</label>
                  <div className="lp-input-group">
                    <span className="lp-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M2 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <input id="lp-email" type="email" value={email} placeholder="you@example.com"
                      onChange={(e) => { setEmail(e.target.value); setLoginError(""); }} autoComplete="email" required className="lp-input" />
                  </div>
                </div>

                <div className="lp-field">
                  <label htmlFor="lp-password" className="lp-label">
                    Password
                    <button type="button" className="lp-forgot-link"
                      onClick={() => { setFpEmail(email); setFpError(""); setView(VIEW.FORGOT); }}>
                      Forgot password?
                    </button>
                  </label>
                  <div className="lp-input-group">
                    <span className="lp-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M5.5 7.5V5a2.5 2.5 0 015 0v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        <circle cx="8" cy="11" r="1" fill="currentColor"/>
                      </svg>
                    </span>
                    <input id="lp-password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                      value={password} onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                      autoComplete="current-password" required className="lp-input" />
                    <button type="button" className="lp-eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"} tabIndex={-1}>
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 2l12 12M6.5 6.6A2 2 0 009.4 9.5M4 4.6C2.7 5.6 1.7 7 1 8c1.3 2.2 4 4 7 4a7 7 0 003-.7M7 4.1A7 7 0 0115 8c-.5 1-1.2 1.9-2 2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M1 8c1.3-2.8 4-5 7-5s5.7 2.2 7 5c-1.3 2.8-4 5-7 5S2.3 10.8 1 8z" stroke="currentColor" strokeWidth="1.4"/>
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="lp-error-box">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M7.5 4.5v4M7.5 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {loginError}
                  </div>
                )}

                <button type="submit" className="lp-btn" disabled={loginLoading}>
                  {loginLoading ? <span className="lp-spin" /> : (
                    <><span>Sign In</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="lp-divider"><span>secure portal access</span></div>
              <div className="lp-trust-badges">
                <div className="lp-badge">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <rect x="1.5" y="5.5" width="10" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4 5.5V3.8a2.5 2.5 0 015 0v1.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  SSL Encrypted
                </div>
                <div className="lp-badge">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M6.5 1.2l1.1 2.7 2.9.4-2.1 2 .5 2.9-2.4-1.3L4.1 9.2l.5-2.9L2.5 4.3l2.9-.4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
                  </svg>
                  2FA Ready
                </div>
                <div className="lp-badge">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4 6.5l2 2 3.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  GDPR Compliant
                </div>
              </div>
              <p className="lp-help-text">
                Don't have access?{" "}
                <a href="#" className="lp-link">Contact your society administrator</a>
              </p>
            </div>
          </div>
        )}

        {/* ══════════ FORGOT PASSWORD VIEW ══════════ */}
        {view === VIEW.FORGOT && (
          <div className="lp-card lp-anim-in">
            <div className="lp-card-accent" />
            <div className="lp-card-body">
              <button className="lp-back-btn" onClick={() => setView(VIEW.LOGIN)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Sign In
              </button>

              <div className="lp-card-header">
                <div className="lp-avatar-icon lp-avatar-amber">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="3" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M7 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    <circle cx="11" cy="15" r="1.2" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h2 className="lp-card-title">Forgot your password?</h2>
                  <p className="lp-card-sub">We'll send a reset code to your email</p>
                </div>
              </div>

              <div className="lp-info-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Enter your registered email and we'll send you a one‑time password (OTP) to reset your account.
              </div>

              {fpError && (
                <div className="lp-error-box">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7.5 4.5v4M7.5 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {fpError}
                </div>
              )}

              <form onSubmit={onForgotSubmit} className="lp-form" noValidate>
                <div className="lp-field">
                  <label htmlFor="fp-email" className="lp-label">Registered email address</label>
                  <div className="lp-input-group">
                    <span className="lp-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M2 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <input id="fp-email" type="email" value={fpEmail} placeholder="you@example.com"
                      onChange={(e) => setFpEmail(e.target.value)} autoComplete="email" required className="lp-input" />
                  </div>
                </div>

                <button type="submit" className="lp-btn" disabled={fpLoading}>
                  {fpLoading ? <span className="lp-spin" /> : (
                    <><span>Send Reset Code</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1.5 8h13M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ══════════ RESET PASSWORD VIEW ══════════ */}
        {view === VIEW.RESET && (
          <div className="lp-card lp-anim-in">
            <div className="lp-card-accent" />
            <div className="lp-card-body">
              <button className="lp-back-btn" onClick={() => { setView(VIEW.FORGOT); setOtp(""); setNewPassword(""); setConfirmPassword(""); setResetError(""); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Change email
              </button>

              <div className="lp-card-header">
                <div className="lp-avatar-icon lp-avatar-green">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11.5l4.5 4.5 9.5-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2 className="lp-card-title">Enter your reset code</h2>
                  <p className="lp-card-sub">Code sent to <strong>{fpEmail}</strong></p>
                </div>
              </div>

              {resetError && (
                <div className="lp-error-box">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7.5 4.5v4M7.5 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {resetError}
                </div>
              )}

              <form onSubmit={onResetSubmit} className="lp-form" noValidate>
                {/* OTP field */}
                <div className="lp-field">
                  <label htmlFor="fp-otp" className="lp-label">
                    One‑Time Password (OTP)
                    <button type="button" className="lp-resend-btn"
                      onClick={onResendOtp} disabled={resendCooldown > 0 || fpLoading}>
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                    </button>
                  </label>
                  <div className="lp-input-group">
                    <span className="lp-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1.5" y="4.5" width="13" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <circle cx="4.5" cy="8" r="1" fill="currentColor"/>
                        <circle cx="8" cy="8" r="1" fill="currentColor"/>
                        <circle cx="11.5" cy="8" r="1" fill="currentColor"/>
                      </svg>
                    </span>
                    <input id="fp-otp" type="text" value={otp} placeholder="Enter 6‑digit code"
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6} inputMode="numeric" autoComplete="one-time-code" required className="lp-input lp-input-otp" />
                  </div>
                </div>

                {/* New password */}
                <div className="lp-field">
                  <label htmlFor="fp-newpw" className="lp-label">New Password</label>
                  <div className="lp-input-group">
                    <span className="lp-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M5.5 7.5V5a2.5 2.5 0 015 0v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        <circle cx="8" cy="11" r="1" fill="currentColor"/>
                      </svg>
                    </span>
                    <input id="fp-newpw" type={showNew ? "text" : "password"} value={newPassword}
                      placeholder="Min. 6 characters" onChange={(e) => setNewPassword(e.target.value)}
                      required className="lp-input" />
                    <button type="button" className="lp-eye"
                      onClick={() => setShowNew(!showNew)} aria-label="Toggle" tabIndex={-1}>
                      {showNew ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 2l12 12M6.5 6.6A2 2 0 009.4 9.5M4 4.6C2.7 5.6 1.7 7 1 8c1.3 2.2 4 4 7 4a7 7 0 003-.7M7 4.1A7 7 0 0115 8c-.5 1-1.2 1.9-2 2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M1 8c1.3-2.8 4-5 7-5s5.7 2.2 7 5c-1.3 2.8-4 5-7 5S2.3 10.8 1 8z" stroke="currentColor" strokeWidth="1.4"/>
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {newPassword.length > 0 && (
                    <div className="lp-strength-wrap">
                      {["lp-s1","lp-s2","lp-s3","lp-s4"].map((cls, i) => (
                        <div key={cls} className={`lp-strength-bar ${
                          newPassword.length >= (i+1)*3 ? (
                            newPassword.length < 6 ? "lp-s-weak" :
                            newPassword.length < 9 ? "lp-s-fair" : "lp-s-strong"
                          ) : ""
                        }`} />
                      ))}
                      <span className="lp-strength-label">
                        {newPassword.length < 6 ? "Weak" : newPassword.length < 9 ? "Fair" : "Strong"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="lp-field">
                  <label htmlFor="fp-confirmpw" className="lp-label">Confirm New Password</label>
                  <div className="lp-input-group">
                    <span className="lp-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M5.5 7.5V5a2.5 2.5 0 015 0v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        <path d="M6 11l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <input id="fp-confirmpw" type={showConfirm ? "text" : "password"} value={confirmPassword}
                      placeholder="Re‑enter new password" onChange={(e) => setConfirmPassword(e.target.value)}
                      required className={`lp-input ${confirmPassword && confirmPassword !== newPassword ? "lp-input-error" : confirmPassword && confirmPassword === newPassword ? "lp-input-ok" : ""}`} />
                    <button type="button" className="lp-eye"
                      onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle" tabIndex={-1}>
                      {showConfirm ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 2l12 12M6.5 6.6A2 2 0 009.4 9.5M4 4.6C2.7 5.6 1.7 7 1 8c1.3 2.2 4 4 7 4a7 7 0 003-.7M7 4.1A7 7 0 0115 8c-.5 1-1.2 1.9-2 2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M1 8c1.3-2.8 4-5 7-5s5.7 2.2 7 5c-1.3 2.8-4 5-7 5S2.3 10.8 1 8z" stroke="currentColor" strokeWidth="1.4"/>
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                      )}
                    </button>
                    {confirmPassword && confirmPassword === newPassword && (
                      <span className="lp-match-check" aria-label="Passwords match">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" fill="#16a34a"/>
                          <path d="M4 7l2.5 2.5 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                <button type="submit" className="lp-btn" disabled={resetLoading}>
                  {resetLoading ? <span className="lp-spin" /> : (
                    <><span>Reset Password</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ══════════ SUCCESS VIEW ══════════ */}
        {view === VIEW.SUCCESS && (
          <div className="lp-card lp-anim-in">
            <div className="lp-card-accent lp-accent-green" />
            <div className="lp-card-body lp-success-body">
              <div className="lp-success-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="17" stroke="#16a34a" strokeWidth="1.5"/>
                  <path d="M10 18l5.5 5.5 10.5-10" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="lp-card-title" style={{textAlign:"center"}}>Password reset successfully!</h2>
              <p className="lp-card-sub" style={{textAlign:"center",marginTop:4}}>
                Your password has been updated. You can now sign in with your new credentials.
              </p>
              <button className="lp-btn" style={{marginTop:8}}
                onClick={() => { setView(VIEW.LOGIN); setPassword(""); }}>
                <span>Go to Sign In</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        <p className="lp-copyright">© 2025 SocietyOS. All rights reserved.</p>
      </div>
    </div>
  );
}

const LOGIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    display: flex;
    min-height: 100vh;
    width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #EBF2FB;
  }

  /* ══ LEFT PANEL ══ */
  .lp-left {
    position: relative;
    width: 50%;
    background: #0B2A6B;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .lp-geo-grid {
    position: absolute; inset: 0;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(8, 1fr);
    opacity: 0.08; pointer-events: none;
  }
  .lp-geo-cell { border: 0.5px solid rgba(255,255,255,0.6); }
  .lp-left-content {
    position: relative; z-index: 3;
    padding: 56px 52px;
    width: 100%;
    display: flex; flex-direction: column; gap: 40px;
  }
  .lp-brand { display: flex; align-items: center; gap: 12px; }
  .lp-logo-ring {
    width: 46px; height: 46px; border-radius: 12px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    display: grid; place-items: center;
  }
  .lp-brand-name {
    font-family: 'Outfit', sans-serif; font-weight: 700;
    font-size: 21px; color: #fff; letter-spacing: -0.4px;
  }
  .lp-hero { display: flex; flex-direction: column; gap: 16px; }
  .lp-tagline {
    font-size: 10.5px; font-weight: 600;
    letter-spacing: 2.5px; color: #7BAEE8; text-transform: uppercase;
  }
  .lp-headline {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(32px, 3.2vw, 50px);
    font-weight: 800; line-height: 1.1;
    color: #fff; letter-spacing: -1.5px;
  }
  .lp-headline-accent { color: #5BA3E8; }
  .lp-subtext {
    font-size: 14.5px; line-height: 1.7;
    color: rgba(255,255,255,0.48); font-weight: 300; max-width: 360px;
  }
  .lp-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .lp-pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 14px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px; font-size: 12.5px;
    color: rgba(255,255,255,0.75); font-weight: 400;
  }
  .lp-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: #5BA3E8; flex-shrink: 0; }
  .lp-stats-row {
    display: flex; align-items: center; gap: 24px;
    padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.1);
  }
  .lp-stat { display: flex; flex-direction: column; gap: 3px; }
  .lp-stat strong {
    font-family: 'Outfit', sans-serif; font-size: 24px;
    font-weight: 700; color: #fff; letter-spacing: -0.5px;
  }
  .lp-stat span {
    font-size: 11.5px; font-weight: 500;
    color: rgba(255,255,255,0.38); letter-spacing: 0.6px; text-transform: uppercase;
  }
  .lp-vline { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }
  .lp-deco-circle {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.07); z-index: 1; pointer-events: none;
  }
  .lp-dc1 { width: 500px; height: 500px; right: -180px; top: -120px; }
  .lp-dc2 { width: 340px; height: 340px; right: -80px; bottom: -80px; background: rgba(91,163,232,0.04); }
  .lp-dc3 { width: 180px; height: 180px; left: 40px; bottom: 60px; border-color: rgba(255,255,255,0.04); }

  /* ══ RIGHT PANEL ══ */
  .lp-right {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 28px;
    background: #EBF2FB; gap: 20px;
  }

  /* Card */
  .lp-card {
    width: 100%; max-width: 440px;
    background: #fff; border-radius: 20px; overflow: hidden;
    box-shadow: 0 0 0 1px rgba(11,42,107,0.07), 0 4px 6px rgba(11,42,107,0.04), 0 16px 48px rgba(11,42,107,0.09);
  }
  .lp-anim-in { animation: lp-rise 0.48s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes lp-rise {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .lp-card-accent {
    height: 4px;
    background: linear-gradient(90deg, #0B2A6B 0%, #1A52C0 40%, #5BA3E8 100%);
  }
  .lp-accent-green {
    background: linear-gradient(90deg, #14532d 0%, #16a34a 50%, #4ade80 100%) !important;
  }
  .lp-card-body {
    padding: 32px 38px 38px;
    display: flex; flex-direction: column; gap: 22px;
  }

  /* Back button */
  .lp-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    color: #1A52C0; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    padding: 0; transition: color 0.15s;
    width: fit-content;
  }
  .lp-back-btn:hover { color: #0B2A6B; }

  /* Header */
  .lp-card-header { display: flex; align-items: flex-start; gap: 14px; }
  .lp-avatar-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: #EBF2FB; color: #1A52C0;
    display: grid; place-items: center; flex-shrink: 0;
    border: 1px solid #C3D9F4;
  }
  .lp-avatar-amber { background: #FEF3C7; color: #92400E; border-color: #FDE68A; }
  .lp-avatar-green { background: #DCFCE7; color: #15803D; border-color: #BBF7D0; }
  .lp-card-title {
    font-family: 'Outfit', sans-serif; font-size: 19px; font-weight: 700;
    color: #0B2A6B; letter-spacing: -0.5px; line-height: 1.25; margin-top: 2px;
  }
  .lp-card-sub { font-size: 13px; color: #7A92BB; margin-top: 4px; font-weight: 400; }
  .lp-card-sub strong { color: #1A52C0; font-weight: 600; }

  /* Info / Error boxes */
  .lp-info-box {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px; background: #EBF2FB;
    border: 1px solid #C3D9F4; border-radius: 10px;
    font-size: 13px; color: #3D5899; line-height: 1.55;
  }
  .lp-info-box svg { flex-shrink: 0; margin-top: 1px; color: #1A52C0; }
  .lp-error-box {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px; background: #FEF2F2;
    border: 1px solid #FECACA; border-radius: 10px;
    font-size: 13px; color: #991B1B; line-height: 1.55;
    animation: lp-shake 0.35s ease;
  }
  .lp-error-box svg { flex-shrink: 0; margin-top: 1px; color: #DC2626; }
  @keyframes lp-shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-5px); }
    40%,80%  { transform: translateX(5px); }
  }

  /* Form */
  .lp-form { display: flex; flex-direction: column; gap: 18px; }
  .lp-field { display: flex; flex-direction: column; gap: 7px; }
  .lp-label {
    font-size: 12px; font-weight: 600; color: #3D5899;
    letter-spacing: 0.2px; text-transform: uppercase;
    display: flex; justify-content: space-between; align-items: center;
  }
  .lp-forgot-link {
    font-size: 12px; color: #1A52C0; font-weight: 500;
    text-transform: none; letter-spacing: 0;
    background: none; border: none; cursor: pointer;
    padding: 0; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: color 0.15s;
  }
  .lp-forgot-link:hover { color: #0B2A6B; text-decoration: underline; }
  .lp-resend-btn {
    font-size: 12px; font-weight: 500; color: #1A52C0;
    background: none; border: none; cursor: pointer;
    padding: 0; font-family: 'Plus Jakarta Sans', sans-serif;
    text-transform: none; letter-spacing: 0;
    transition: color 0.15s;
  }
  .lp-resend-btn:disabled { color: #A8BFDB; cursor: default; }
  .lp-resend-btn:not(:disabled):hover { color: #0B2A6B; text-decoration: underline; }

  /* Inputs */
  .lp-input-group { position: relative; display: flex; align-items: center; }
  .lp-icon {
    position: absolute; left: 13px; color: #8AABD4;
    display: flex; pointer-events: none; transition: color 0.2s;
  }
  .lp-input-group:focus-within .lp-icon { color: #1A52C0; }
  .lp-input {
    width: 100%;
    padding: 12px 42px 12px 40px;
    background: #F2F7FD; border: 1.5px solid #C3D9F4;
    border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14.5px; color: #0B2A6B; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .lp-input::placeholder { color: #A8BFDB; }
  .lp-input:focus { border-color: #1A52C0; background: #fff; box-shadow: 0 0 0 4px rgba(26,82,192,0.12); }
  .lp-input:hover:not(:focus) { border-color: #8AABD4; }
  .lp-input-otp { letter-spacing: 6px; font-size: 18px; font-weight: 600; text-align: center; padding-left: 40px; }
  .lp-input-error { border-color: #EF4444 !important; background: #FEF2F2 !important; }
  .lp-input-ok   { border-color: #16A34A !important; }
  .lp-eye {
    position: absolute; right: 12px; background: none; border: none;
    cursor: pointer; color: #8AABD4; display: flex; padding: 3px; transition: color 0.15s;
  }
  .lp-eye:hover { color: #1A52C0; }
  .lp-match-check { position: absolute; right: 38px; display: flex; pointer-events: none; }

  /* Password strength */
  .lp-strength-wrap {
    display: flex; align-items: center; gap: 5px; margin-top: 6px;
  }
  .lp-strength-bar {
    flex: 1; height: 4px; border-radius: 2px;
    background: #D4E4F5; transition: background 0.3s;
  }
  .lp-s-weak   { background: #EF4444; }
  .lp-s-fair   { background: #F59E0B; }
  .lp-s-strong { background: #16A34A; }
  .lp-strength-label { font-size: 11px; font-weight: 600; color: #8AABD4; white-space: nowrap; }

  /* Button */
  .lp-btn {
    width: 100%; padding: 14px; background: #0B2A6B;
    color: #fff; border: none; border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 18px rgba(11,42,107,0.32), 0 1px 4px rgba(11,42,107,0.2);
    margin-top: 4px; position: relative; overflow: hidden;
  }
  .lp-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
    pointer-events: none;
  }
  .lp-btn:hover:not(:disabled) { background: #1A52C0; box-shadow: 0 6px 24px rgba(26,82,192,0.38); transform: translateY(-1px); }
  .lp-btn:active:not(:disabled) { transform: translateY(0); }
  .lp-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .lp-spin {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.28); border-top-color: #fff;
    border-radius: 50%; animation: lp-spin 0.65s linear infinite; display: inline-block;
  }
  @keyframes lp-spin { to { transform: rotate(360deg); } }

  /* Divider */
  .lp-divider {
    display: flex; align-items: center; gap: 12px;
    color: #A8BFDB; font-size: 11px; font-weight: 600;
    letter-spacing: 1.2px; text-transform: uppercase;
  }
  .lp-divider::before, .lp-divider::after {
    content: ''; flex: 1; height: 1px; background: #D4E4F5;
  }
  /* Trust badges */
  .lp-trust-badges { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
  .lp-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; background: #EBF2FB;
    border: 1px solid #C3D9F4; border-radius: 100px;
    font-size: 11.5px; color: #3D5899; font-weight: 500;
  }
  /* Help */
  .lp-help-text { text-align: center; font-size: 13px; color: #7A92BB; line-height: 1.5; }
  .lp-link { color: #1A52C0; text-decoration: none; font-weight: 500; }
  .lp-link:hover { text-decoration: underline; }

  /* Success */
  .lp-success-body { align-items: center; text-align: center; padding: 44px 38px 44px; }
  .lp-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: #DCFCE7; display: grid; place-items: center;
    margin-bottom: 4px;
    animation: lp-pop 0.5s cubic-bezier(0.22,1,0.36,1) both 0.1s;
  }
  @keyframes lp-pop {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  /* Copyright */
  .lp-copyright { font-size: 12px; color: #8AABD4; text-align: center; }

  /* Responsive */
  @media (max-width: 860px) {
    .lp-root { flex-direction: column; }
    .lp-left { width: 100%; min-height: 240px; }
    .lp-left-content { padding: 32px 24px; gap: 22px; }
    .lp-subtext { display: none; }
    .lp-right { padding: 28px 16px; }
    .lp-card-body { padding: 26px 22px 30px; }
    .lp-trust-badges { flex-wrap: wrap; }
    .lp-stats-row { gap: 16px; }
  }
`;