import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const GREEN = "#16a34a";
const FONT = "'DM Sans', sans-serif";
const DARK = "#111827";
const LIGHT = "#6b7280";
const BORDER = "#e5e7eb";

const shimmerKeyframes = `
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 0.5; transform: scale(1);    }
  50%       { opacity: 1;   transform: scale(1.15); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
@keyframes spin-in {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1);    }
}
`;

/* ── Responsive QR size hook ─────────────────────────────────────────────
   Uses viewport height so the modal NEVER overflows the screen.
   Formula: take 90vh, subtract fixed chrome (topbar ~110px + footer ~56px
   + UPI label ~28px + timer ~48px + frame padding ~24px = ~266px),
   clamp between 140px and 220px.                                         */
const useQRSize = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));      // <600
  const isSmLaptop = useMediaQuery("(max-height: 680px)");           // e.g. 13" at 125% zoom
  const isMdLaptop = useMediaQuery("(max-height: 800px)");

  if (isMobile) return 180;   // phones — unchanged
  if (isSmLaptop) return 148;   // very small laptop viewport
  if (isMdLaptop) return 168;   // 13–14" normal zoom
  return 190;                     // 15"+ or large monitors
};

/* ── ShimmerBox ──────────────────────────────────────────────────────── */
const ShimmerBox = ({ width, height, borderRadius = 8, sx = {} }) => (
  <Box sx={{
    width, height,
    borderRadius: `${borderRadius}px`,
    background: "linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
    flexShrink: 0,
    ...sx,
  }} />
);

/* ── QRSkeleton ──────────────────────────────────────────────────────── */
const QRSkeleton = ({ qrSize }) => (
  <Box sx={{ animation: "fade-in 0.25s ease" }}>
    {/* Top */}
    <Box sx={{ px: { xs: 2.5, sm: 2 }, pt: { xs: 2.5, sm: 2 }, pb: { xs: 2, sm: 1.5 }, borderBottom: `1px solid ${BORDER}` }}>
      <ShimmerBox width={130} height={12} borderRadius={6} sx={{ mb: 0.8 }} />
      <ShimmerBox width={170} height={30} borderRadius={8} sx={{ mb: 1 }} />
      <ShimmerBox width={105} height={24} borderRadius={12} />
    </Box>
    {/* QR area */}
    <Box sx={{ px: { xs: 2.5, sm: 2 }, pt: { xs: 2, sm: 1.5 }, pb: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ p: { xs: 1.5, sm: 1 }, borderRadius: "16px", border: `2px solid ${BORDER}`, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", mb: { xs: 2, sm: 1.5 }, position: "relative", overflow: "hidden" }}>
        <ShimmerBox width={qrSize} height={qrSize} borderRadius={8} />
        {[{ top: 14, left: 14 }, { top: 14, right: 14 }, { bottom: 14, left: 14 }, { bottom: 14, right: 14 }].map((pos, i) => (
          <Box key={i} sx={{ position: "absolute", ...pos, width: 20, height: 20, borderRadius: "3px", background: "linear-gradient(90deg,#e2e4e8 25%,#d4d6da 50%,#e2e4e8 75%)", backgroundSize: "600px 100%", animation: `shimmer 1.5s ease-in-out ${i * 0.12}s infinite` }} />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 0.8, mb: 1.5 }}>
        {[48, 40, 46, 38].map((w, i) => <ShimmerBox key={i} width={w} height={16} borderRadius={4} sx={{ animationDelay: `${i * 0.08}s` }} />)}
      </Box>
      <ShimmerBox width={150} height={12} borderRadius={6} sx={{ mb: 0.6 }} />
      <ShimmerBox width={100} height={12} borderRadius={6} />
    </Box>
    {/* Footer */}
    <Box sx={{ px: { xs: 2.5, sm: 2 }, py: { xs: 1.8, sm: 1.2 }, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center" }}>
      <ShimmerBox width={110} height={28} borderRadius={8} />
    </Box>
  </Box>
);

/* ── Main Component ──────────────────────────────────────────────────── */
const QRPaymentModal = ({
  open, onClose,
  paymentData, paymentStatus,
  initiating, cancelling,
  isExpired, mins, secs,
  currency = "₹",
  onRetry, onCancel,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const qrSize = useQRSize();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isCancelled = paymentStatus === "CANCELLED";
  const isSuccess = paymentStatus === "SUCCESS";
  const isFailed = paymentStatus === "FAILED";
  const isPending = (paymentStatus === "PENDING" || !paymentStatus) && !isExpired;
  const showBlur = isExpired || isCancelled || initiating || isSuccess || isFailed;

  const statusColor = isSuccess ? GREEN : isFailed ? "#ef4444" : isCancelled ? LIGHT : isExpired ? "#ef4444" : "#92400e";
  const statusBg = isSuccess ? "#dcfce7" : isFailed || isExpired ? "#fef2f2" : isCancelled ? "#f3f4f6" : "#fefce8";
  const statusBorder = isSuccess ? "#bbf7d0" : isFailed || isExpired ? "#fecaca" : isCancelled ? BORDER : "#fde68a";
  const statusText = isSuccess ? "Payment successful" : isFailed ? "Payment failed" : isCancelled ? "Cancelled" : isExpired ? "QR expired" : initiating ? "Generating..." : "Waiting for payment";

  const handleClose = () => {
    if (!initiating && !cancelling) { setShowCancelConfirm(false); onClose(); }
  };

  /* Overlay shared style */
  const overlayBox = { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "8px" };

  return (
    <>
      <style>{shimmerKeyframes}</style>

      {/* ═══════════════════════ QR DIALOG ═══════════════════════ */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: { xs: "20px", sm: "20px" },
            // Width: full on mobile, fixed 350 on desktop — narrow enough to
            // always fit side padding on any laptop
            maxWidth: { xs: "calc(100vw - 32px)", sm: 350 },
            width: "100%",
            m: { xs: "16px auto", sm: 2 },
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.14)",
            // KEY: dialog height capped at 92vh so it never pushes off-screen
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/*
          DialogContent scrolls internally if content somehow overflows.
          This ensures footer (cancel btn) is always sticky at bottom.
        */}
        <DialogContent
          sx={{
            p: 0,
            overflow: "hidden",           // outer wrapper clips
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Skeleton */}
          {initiating && !paymentData && <QRSkeleton qrSize={qrSize} />}

          {paymentData && (
            <Box
              sx={{
                animation: "fade-in 0.3s ease",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* ── TOP BAR (fixed, never scrolls away) ─────────── */}
              <Box sx={{
                px: { xs: 2.5, sm: 2 },
                pt: { xs: 2, sm: 1.8 },
                pb: { xs: 1.5, sm: 1.4 },
                borderBottom: `1px solid ${BORDER}`,
                position: "relative",
                flexShrink: 0,             // never compress
              }}>
                {/* Close btn */}
                <Box onClick={handleClose} sx={{
                  position: "absolute",
                  top: { xs: 14, sm: 12 }, right: { xs: 14, sm: 12 },
                  width: 28, height: 28,
                  borderRadius: "50%", bgcolor: "#f3f4f6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "background 0.18s",
                  "&:hover": { bgcolor: "#e5e7eb" },
                }}>
                  <CloseIcon sx={{ fontSize: 14, color: DARK }} />
                </Box>

                {/* Order ID */}
                <Typography sx={{ fontSize: { xs: 12, sm: 11 }, color: LIGHT, fontFamily: FONT, mb: 0.4, letterSpacing: 0.2 }}>
                  Order · {paymentData.orderId}
                </Typography>

                {/* Amount */}
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4, mb: 1 }}>
                  <Typography sx={{ fontSize: { xs: 13, sm: 12 }, fontWeight: 600, color: LIGHT, fontFamily: FONT }}>
                    {currency}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 26, sm: 24 }, fontWeight: 800, color: DARK, fontFamily: FONT, lineHeight: 1 }}>
                    {Number(paymentData.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>

                {/* Status pill */}
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1.2, py: 0.35, borderRadius: "20px", bgcolor: statusBg, border: `1px solid ${statusBorder}` }}>
                  {isPending && <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#ca8a04", animation: "pulse-dot 1.6s ease-in-out infinite" }} />}
                  {isSuccess && <CheckCircleIcon sx={{ fontSize: 12, color: GREEN }} />}
                  <Typography sx={{ fontSize: { xs: 11.5, sm: 11 }, fontWeight: 700, color: statusColor, fontFamily: FONT }}>
                    {statusText}
                  </Typography>
                </Box>
              </Box>

              {/* ── SCROLLABLE MIDDLE (QR + labels + timer) ──────── */}
              <Box sx={{
                flex: 1,
                overflowY: "auto",         // scrolls if viewport is tiny
                px: { xs: 2.5, sm: 2 },
                pt: { xs: 2, sm: 1.8 },
                pb: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // Hide scrollbar visually but keep function
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}>
                {/* QR frame */}
                <Box sx={{
                  position: "relative",
                  p: { xs: 1.2, sm: 1 },
                  borderRadius: "16px",
                  border: `2px solid ${isExpired ? "#fecaca" : isCancelled ? "#e5e7eb" : isSuccess ? "#bbf7d0" : BORDER}`,
                  bgcolor: "#fff",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  transition: "border-color 0.3s",
                  mb: { xs: 1.8, sm: 1.4 },
                  flexShrink: 0,
                }}>
                  {/* Green corner accents */}
                  {isPending && !initiating && (
                    <>
                      {[
                        { top: -2, left: -2, borderTop: "3px solid", borderLeft: "3px solid", borderRadius: "14px 0 0 0" },
                        { top: -2, right: -2, borderTop: "3px solid", borderRight: "3px solid", borderRadius: "0 14px 0 0" },
                        { bottom: -2, left: -2, borderBottom: "3px solid", borderLeft: "3px solid", borderRadius: "0 0 0 14px" },
                        { bottom: -2, right: -2, borderBottom: "3px solid", borderRight: "3px solid", borderRadius: "0 0 14px 0" },
                      ].map((s, i) => (
                        <Box key={i} sx={{ position: "absolute", width: 20, height: 20, borderColor: GREEN, ...s }} />
                      ))}
                    </>
                  )}

                  {/* QR image */}
                  <Box sx={{ position: "relative" }}>
                    <img
                      key={paymentData._ts}
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(paymentData.upiIntentUrl)}&_t=${paymentData._ts}`}
                      alt="UPI QR Code"
                      width={qrSize}
                      height={qrSize}
                      style={{ display: "block", borderRadius: 6, filter: showBlur ? "blur(5px) brightness(0.45)" : "none", transition: "filter 0.4s ease" }}
                    />

                    {/* EXPIRED overlay */}
                    {isExpired && !initiating && (
                      <Box onClick={onRetry} sx={{ ...overlayBox, gap: 0.8, cursor: "pointer", "&:hover .ri": { transform: "scale(1.1) rotate(-18deg)" } }}>
                        <Box className="ri" sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.28)", transition: "transform 0.25s ease", fontSize: 20, color: DARK }}>↻</Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: FONT }}>Tap to retry</Typography>
                      </Box>
                    )}

                    {/* INITIATING overlay */}
                    {initiating && (
                      <Box sx={{ ...overlayBox, gap: 1.2 }}>
                        <CircularProgress size={30} sx={{ color: "#fff" }} />
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#fff", fontFamily: FONT }}>Generating QR...</Typography>
                      </Box>
                    )}

                    {/* FAILED overlay */}
                    {isFailed && !initiating && (
                      <Box onClick={onRetry} sx={{ ...overlayBox, gap: 0.8, cursor: "pointer", "&:hover .ri2": { transform: "scale(1.1) rotate(-18deg)" } }}>
                        <Box className="ri2" sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.28)", transition: "transform 0.25s ease", fontSize: 20, color: DARK }}>↻</Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: FONT }}>Tap to retry</Typography>
                      </Box>
                    )}

                    {/* CANCELLED overlay */}
                    {isCancelled && (
                      <Box sx={{ ...overlayBox }}>
                        <Typography sx={{ fontSize: { xs: 14, sm: 15 }, fontWeight: 800, color: "#fff", fontFamily: FONT, letterSpacing: 0.5 }}>Cancelled</Typography>
                      </Box>
                    )}

                    {/* SUCCESS overlay */}
                    {isSuccess && (
                      <Box sx={{ ...overlayBox, bgcolor: "rgba(22,163,74,0.88)", gap: 0.8, animation: "spin-in 0.4s ease" }}>
                        <CheckCircleIcon sx={{ fontSize: { xs: 44, sm: 44 }, color: "#fff" }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: FONT }}>Payment done!</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* UPI apps label */}
                {isPending && !initiating && (
                  <Typography sx={{ fontSize: { xs: 12, sm: 11 }, color: LIGHT, fontFamily: FONT, mb: { xs: 1.2, sm: 1 }, textAlign: "center" }}>
                    PhonePe · GPay · Paytm · Any UPI app
                  </Typography>
                )}

                {/* Timer — simple clock style */}
                {isPending && !initiating && (
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.7, mb: { xs: 1.5, sm: 1 } }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: GREEN, flexShrink: 0 }} />
                    <Typography sx={{
                      fontSize: { xs: 15, sm: 14 },
                      fontWeight: 700,
                      color: GREEN,
                      fontFamily: FONT,
                      letterSpacing: 0.5,
                      fontVariantNumeric: "tabular-nums", 
                      minWidth: "3.2ch",                  
                    }}>
                      {mins}:{secs}
                    </Typography>
                  </Box>
                )}

              </Box>

              {/* ── FOOTER (sticky at bottom, always visible) ───── */}
              <Box sx={{
                px: { xs: 2.5, sm: 2 },
                py: { xs: 1.5, sm: 1.2 },
                borderTop: `1px solid ${BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,             // never compress
                bgcolor: "#fff",           // covers scroll content behind it
              }}>
                {isPending && !initiating && (
                  <Button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={cancelling}
                    size="small"
                    sx={{
                      color: "#ef4444", fontFamily: FONT,
                      textTransform: "none",
                      fontSize: { xs: 12.5, sm: 12 }, fontWeight: 600,
                      px: 1.5, py: 0.5,
                      borderRadius: "8px", minWidth: 0,
                      "&:hover": { bgcolor: "#fef2f2" },
                    }}
                  >
                    {cancelling ? <CircularProgress size={13} sx={{ color: "#ef4444" }} /> : "Cancel payment"}
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════ CANCEL CONFIRM DIALOG ═══════════════════ */}
      <Dialog
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            maxWidth: { xs: 300, sm: 280 },
            width: "100%", p: 0,
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2.5, sm: 2 }, textAlign: "center" }}>
          <Box sx={{ width: { xs: 52, sm: 44 }, height: { xs: 52, sm: 44 }, borderRadius: "50%", bgcolor: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: { xs: 1.8, sm: 1.5 }, fontSize: { xs: 24, sm: 20 } }}>
            ⚠️
          </Box>
          <Typography sx={{ fontSize: { xs: 15, sm: 14 }, fontWeight: 700, color: DARK, fontFamily: FONT, mb: 0.6 }}>
            Cancel payment?
          </Typography>
          <Typography sx={{ fontSize: { xs: 12.5, sm: 12 }, color: LIGHT, fontFamily: FONT, mb: { xs: 2.5, sm: 2 }, lineHeight: 1.7 }}>
            Are you sure you want to cancel this payment? This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button fullWidth onClick={() => setShowCancelConfirm(false)}
              sx={{ border: `1px solid ${BORDER}`, color: DARK, fontFamily: FONT, textTransform: "none", fontSize: 13, fontWeight: 600, borderRadius: "8px", py: 0.9, bgcolor: "#fff", "&:hover": { bgcolor: "#f3f4f6" } }}>
              No, go back
            </Button>
            <Button fullWidth onClick={() => { setShowCancelConfirm(false); onCancel(); }} disabled={cancelling}
              sx={{ bgcolor: "#ef4444", color: "#fff", fontFamily: FONT, textTransform: "none", fontSize: 13, fontWeight: 600, borderRadius: "8px", py: 0.9, "&:hover": { bgcolor: "#dc2626" }, "&.Mui-disabled": { bgcolor: "#fca5a5", color: "#fff" } }}>
              {cancelling ? <CircularProgress size={13} sx={{ color: "#fff" }} /> : "Yes, cancel"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRPaymentModal;