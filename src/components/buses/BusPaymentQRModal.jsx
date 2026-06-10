// components/buses/BusPaymentQRModal.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import Swal from "sweetalert2";
import { useBusPaymentCancel } from "../../hooks/buseshooks/useBusPaymentCancel";


// ─── Theme tokens ─────────────────────────────────────────────────────────────
const G = {
  green: "#16a34a",
  greenLight: "#f0fdf4",
  greenBorder: "#bbf7d0",
  greenDark: "#15803d",
  text: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f9fafb",
  white: "#ffffff",
  red: "#ef4444",
  redLight: "#fef2f2",
  amber: "#f59e0b",
  amberLight: "#fffbeb",
};

// ─── Inject modal styles once ─────────────────────────────────────────────────
const MODAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

/* ── Force SweetAlert2 above our modal ── */
.swal2-container {
  z-index: 99999 !important;
}

.bpq-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  animation: bpqFadeIn 0.22s ease;
}
@keyframes bpqFadeIn { from { opacity:0 } to { opacity:1 } }

.bpq-sheet {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
  overflow: hidden;
  animation: bpqSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1);
  font-family: 'DM Sans', sans-serif;
  position: relative;
}
@keyframes bpqSlideUp {
  from { transform: translateY(32px) scale(0.97); opacity:0 }
  to   { transform: translateY(0) scale(1); opacity:1 }
}

.bpq-header {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  padding: 18px 20px 16px;
  display: flex; align-items: center; gap: 12px;
  position: relative;
}
.bpq-header-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.bpq-header-title { font-size: 15px; font-weight: 700; color: #fff; line-height: 1.2 }
.bpq-header-sub { font-size: 12px; color: rgba(255,255,255,0.78); margin-top: 2px }
.bpq-close-btn {
  position: absolute; right: 14px; top: 14px;
  background: rgba(255,255,255,0.15); border: none;
  width: 30px; height: 30px; border-radius: 8px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.bpq-close-btn:hover { background: rgba(255,255,255,0.28) }

.bpq-amount-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px 10px;
  border-bottom: 1px solid #f3f4f6;
}
.bpq-amount-label { font-size: 12px; color: #6b7280; font-weight: 500 }
.bpq-amount-value { font-size: 22px; font-weight: 700; color: #111827; font-family: 'JetBrains Mono', monospace }

.bpq-timer-bar {
  padding: 10px 20px 8px;
  display: flex; align-items: center; gap: 10px;
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
}
.bpq-timer-bar.danger { background: #fef2f2; border-bottom-color: #fecaca }
.bpq-timer-icon { flex-shrink: 0 }
.bpq-timer-text { font-size: 12px; color: #92400e; font-weight: 600 }
.bpq-timer-bar.danger .bpq-timer-text { color: #991b1b }
.bpq-timer-progress {
  height: 3px; background: #fde68a; border-radius: 2px; overflow: hidden;
  margin: 0 20px 10px;
}
.bpq-timer-bar.danger + .bpq-timer-progress { background: #fecaca }
.bpq-timer-fill {
  height: 100%; background: #f59e0b; border-radius: 2px;
  transition: width 1s linear;
}
.bpq-timer-bar.danger + .bpq-timer-progress .bpq-timer-fill { background: #ef4444 }

.bpq-qr-area {
  padding: 18px 20px 14px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.bpq-qr-wrap {
  position: relative; border-radius: 16px;
  border: 2px solid #e5e7eb;
  padding: 10px; background: #fff;
  box-shadow: 0 4px 24px rgba(22,163,74,0.08);
}
.bpq-qr-canvas { display: block; border-radius: 8px }
.bpq-qr-overlay {
  position: absolute; inset: 0; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 8px;
}
.bpq-qr-overlay-inner {
  background: rgba(255,255,255,0.96);
  border-radius: 14px;
  padding: 18px 22px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.bpq-retry-btn {
  margin-top: 4px;
  background: #16a34a; color: #fff; border: none;
  border-radius: 8px; padding: 9px 20px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, transform 0.1s;
}
.bpq-retry-btn:hover { background: #15803d; transform: scale(1.03) }
.bpq-retry-btn:active { transform: scale(0.98) }

.bpq-scan-hint {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #6b7280; font-weight: 500;
}

.bpq-upi-row {
  display: flex; gap: 8px; align-items: center; justify-content: center;
  padding: 0 20px 12px; flex-wrap: wrap;
}
.bpq-upi-chip {
  display: flex; align-items: center; gap: 5px;
  background: #f9fafb; border: 1px solid #e5e7eb;
  border-radius: 20px; padding: 5px 10px;
  font-size: 11px; font-weight: 600; color: #374151;
}

.bpq-order-row {
  margin: 0 20px 12px;
  background: #f9fafb; border: 1px solid #e5e7eb;
  border-radius: 10px; padding: 10px 14px;
  display: flex; justify-content: space-between; align-items: center;
}
.bpq-order-label { font-size: 11px; color: #9ca3af; font-weight: 500 }
.bpq-order-value { font-size: 12px; color: #111827; font-weight: 700; font-family: 'JetBrains Mono', monospace }

/* ── Pay Now button — mobile only ── */
.bpq-paynow-row {
  padding: 0 20px 10px;
  display: none; /* hidden on desktop */
}
@media (max-width: 768px) {
  .bpq-paynow-row {
    display: block;
  }
}
.bpq-paynow-btn {
  width: 100%;
  padding: 13px 0;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 16px rgba(22,163,74,0.35);
  transition: opacity 0.15s, transform 0.1s;
  letter-spacing: 0.01em;
}
.bpq-paynow-btn:hover { opacity: 0.93 }
.bpq-paynow-btn:active { transform: scale(0.98) }
.bpq-paynow-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}
.bpq-paynow-hint {
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 6px;
  font-family: 'DM Sans', sans-serif;
}

/* Cancel button row */
.bpq-cancel-row {
  padding: 0 20px 20px;
}
.bpq-cancel-btn {
  width: 100%;
  padding: 10px 0;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
}
.bpq-cancel-btn:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #fca5a5;
}
.bpq-cancel-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  color: #9ca3af;
}

.bpq-status-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #16a34a;
  animation: bpqPulse 1.4s infinite;
  flex-shrink: 0;
}
@keyframes bpqPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.5) }
  50%      { box-shadow: 0 0 0 5px rgba(22,163,74,0) }
}

.bpq-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: bpqSpin 0.8s linear infinite;
}
@keyframes bpqSpin { to { transform: rotate(360deg) } }

@media (max-width: 480px) {
  .bpq-sheet { border-radius: 16px }
  .bpq-amount-value { font-size: 18px }
}
@media (max-width: 360px) {
  .bpq-sheet { max-width: 100% }
  .bpq-qr-wrap { padding: 8px }
}
`;

function injectModalStyles() {
  if (typeof document !== "undefined" && !document.getElementById("bpq-styles")) {
    const tag = document.createElement("style");
    tag.id = "bpq-styles";
    tag.innerHTML = MODAL_CSS;
    document.head.appendChild(tag);
  }
}

// ─── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown(expiryDateStr) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    if (!expiryDateStr) return;
    const expiry = new Date(expiryDateStr).getTime();
    const now = Date.now();
    const initial = Math.max(0, Math.floor((expiry - now) / 1000));
    setTotalSeconds(initial);
    setSecondsLeft(initial);

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDateStr]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const pct = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  const isDanger = secondsLeft <= 60 && secondsLeft > 0;
  const isExpired = secondsLeft === 0 && totalSeconds > 0;

  return { mm, ss, pct, isDanger, isExpired, secondsLeft };
}

// ─── QR Canvas ────────────────────────────────────────────────────────────────
function QRCanvas({ upiUrl, size = 220 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!upiUrl || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, upiUrl, {
      width: size,
      margin: 1,
      color: { dark: "#111827", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).catch(console.error);
  }, [upiUrl, size]);

  return <canvas ref={canvasRef} className="bpq-qr-canvas" width={size} height={size} />;
}

// ─── Main Modal Component ─────────────────────────────────────────────────────
export default function BusPaymentQRModal({
  visible,
  onClose,
  paymentData,
  onRetry,
  onSuccess,
  onFailed,
  retrying = false,
  paymentStatus,
  traceId,
  resultIndex,
}) {
  injectModalStyles();

  const { cancelPayment, loading: cancelling } = useBusPaymentCancel();

  const { mm, ss, pct, isDanger, isExpired } = useCountdown(paymentData?.expiryDate);

  const showExpired = isExpired || paymentStatus === "EXPIRED";
  const showFailed = paymentStatus === "FAILED";
  const showSuccess = paymentStatus === "SUCCESS";

  // Cancel button is enabled only while QR is active
  const cancelEnabled = !showExpired && !showFailed && !showSuccess && !retrying && !cancelling;

  // Pay Now enabled only when QR is active
  const payNowEnabled = !showExpired && !showFailed && !showSuccess && !retrying;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  // ── Pay Now: open UPI intent URL — browser shows installed UPI app picker ──
  const handlePayNow = () => {
    const upiUrl = paymentData?.upiIntentUrl ?? "";
    if (!upiUrl) return;

    // On mobile, this triggers the OS UPI app chooser (GPay, PhonePe, Paytm etc.)
    window.location.href = upiUrl;
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Cancel Payment?",
      text: "Are you sure you want to cancel this payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No, Go Back",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#16a34a",
      reverseButtons: true,
      customClass: { container: "bpq-swal-container" },
      didOpen: () => {
        const container = document.querySelector(".bpq-swal-container");
        if (container) container.style.zIndex = "99999";
      },
    });

    if (!result.isConfirmed) return;

    try {
      console.log("🔴 CANCEL props:", { traceId, resultIndex }); // props se aa raha hai
      await cancelPayment({ traceId, resultIndex });


      Swal.fire({
        icon: "success",
        title: "Payment Cancelled",
        text: "Your payment has been cancelled successfully.",
        confirmButtonColor: "#16a34a",
        timer: 2500,
        timerProgressBar: true,
        customClass: { container: "bpq-swal-container" },
        didOpen: () => {
          const container = document.querySelector(".bpq-swal-container");
          if (container) container.style.zIndex = "99999";
        },
      });

      onClose?.();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#16a34a",
        customClass: { container: "bpq-swal-container" },
        didOpen: () => {
          const container = document.querySelector(".bpq-swal-container");
          if (container) container.style.zIndex = "99999";
        },
      });
    }
  };

  if (!visible) return null;

  const amount = paymentData?.amount ?? "0";
  const orderId = paymentData?.orderId ?? "";
  const upiUrl = paymentData?.upiIntentUrl ?? "";

  return (
    <div className="bpq-overlay" onClick={handleBackdrop}>
      <div className="bpq-sheet" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="bpq-header">
          <div className="bpq-header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <div>
            <div className="bpq-header-title">Scan & Pay with UPI</div>
            <div className="bpq-header-sub">Open any UPI app and scan the QR code</div>
          </div>
          <button className="bpq-close-btn" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Amount ── */}
        <div className="bpq-amount-row">
          <div>
            <div className="bpq-amount-label">Total Payable</div>
            <div className="bpq-amount-value">
              ₹{Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              className="bpq-status-dot"
              style={{
                background: showExpired || showFailed ? "#ef4444" : showSuccess ? "#16a34a" : "#f59e0b",
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: showExpired || showFailed ? "#ef4444" : showSuccess ? "#16a34a" : "#92400e" }}>
              {showFailed ? "Failed" : showSuccess ? "Paid" : showExpired ? "Expired" : "Awaiting Payment"}
            </span>
          </div>
        </div>

        {/* ── Timer bar ── */}
        {!showExpired && !showFailed && !showSuccess && (
          <>
            <div className={`bpq-timer-bar${isDanger ? " danger" : ""}`}>
              <svg className="bpq-timer-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDanger ? "#991b1b" : "#92400e"} strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="bpq-timer-text">QR expires in {mm}:{ss}</span>
            </div>
            <div className="bpq-timer-progress">
              <div className="bpq-timer-fill" style={{ width: `${pct}%` }} />
            </div>
          </>
        )}

        {/* ── QR Area ── */}
        <div className="bpq-qr-area">
          <div className="bpq-qr-wrap">
            {retrying ? (
              <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="bpq-spinner" />
              </div>
            ) : (
              <QRCanvas upiUrl={upiUrl} size={220} />
            )}

            {/* Expired overlay */}
            {showExpired && !retrying && (
              <div className="bpq-qr-overlay">
                <div className="bpq-qr-overlay-inner">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>QR Expired</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: -2 }}>Generate a new QR code</div>
                  <button className="bpq-retry-btn" onClick={onRetry}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Retry Payment
                  </button>
                </div>
              </div>
            )}

            {/* Success overlay */}
            {showSuccess && (
              <div className="bpq-qr-overlay">
                <div className="bpq-qr-overlay-inner">
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Payment Successful!</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Redirecting to ticket...</div>
                </div>
              </div>
            )}
          </div>

          {/* Scan hint */}
          {!showExpired && !showSuccess && !showFailed && !retrying && (
            <div className="bpq-scan-hint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Waiting for payment confirmation...
            </div>
          )}
        </div>

        {/* ── UPI app chips ── */}
        <div className="bpq-upi-row">
          {[
            { name: "GPay", color: "#4285F4" },
            { name: "PhonePe", color: "#5F259F" },
            { name: "Paytm", color: "#00BAF2" },
            { name: "BHIM", color: "#138808" },
          ].map((app) => (
            <div key={app.name} className="bpq-upi-chip">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: app.color, flexShrink: 0 }} />
              {app.name}
            </div>
          ))}
        </div>

        {/* ── Order ID ── */}
        {orderId && (
          <div className="bpq-order-row">
            <span className="bpq-order-label">Order ID</span>
            <span className="bpq-order-value">{orderId}</span>
          </div>
        )}

        {/* ── Pay Now — mobile only ── */}
        {!showExpired && !showFailed && !showSuccess && (
          <div className="bpq-paynow-row">
            <button
              className="bpq-paynow-btn"
              disabled={!payNowEnabled}
              onClick={handlePayNow}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay Now with UPI
            </button>
            <div className="bpq-paynow-hint">
              Opens your installed UPI app automatically
            </div>
          </div>
        )}

        {/* ── Cancel Button ── */}
        <div className="bpq-cancel-row">
          <button
            className="bpq-cancel-btn"
            disabled={!cancelEnabled}
            onClick={handleCancel}
          >
            {cancelling ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid #d1d5db", borderTopColor: "#ef4444", borderRadius: "50%", animation: "bpqSpin 0.8s linear infinite" }} />
                Cancelling...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cancel Payment
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}