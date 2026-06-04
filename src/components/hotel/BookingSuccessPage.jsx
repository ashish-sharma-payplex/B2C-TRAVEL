import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { usePayment } from "../../hooks/hotelhooks/usePayment";
import { useCountdown } from "../../hooks/hotelhooks/useCountdown";
import { hotelFetch } from "../../api/hotelApi";
import QRPaymentModal from "./QRPaymentModal";

const GREEN = "#16a34a";
const BORDER = "#e5e7eb";
const LIGHT = "#6b7280";
const DARK = "#111827";
const BG = "#f5f7fa";
const FONT = "'DM Sans', sans-serif";

const InfoItem = ({ icon, text }) =>
  text ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
      {icon}
      <Typography sx={{ fontSize: 13, color: "#374151", fontFamily: FONT }}>
        {text}
      </Typography>
    </Box>
  ) : null;

const Facility = ({ label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <CheckCircleIcon sx={{ fontSize: 14, color: GREEN }} />
    <Typography sx={{ fontSize: 12.5, color: "#374151", fontFamily: FONT }}>
      {label}
    </Typography>
  </Box>
);

const Stars = ({ count = 4 }) => (
  <Box
    sx={{
      px: 1,
      py: 0.3,
      bgcolor: "#fef3c7",
      borderRadius: "6px",
      fontSize: 12,
      fontWeight: 700,
      fontFamily: FONT,
    }}
  >
    {count} ★
  </Box>
);

// ── Dynamic CancelTimeline ──────────────────────────────────
const CancelTimeline = ({ cancelPolicies, isRefundable }) => {
  const lastPolicy = cancelPolicies?.[cancelPolicies?.length - 1];

  return (
    <Box sx={{ bgcolor: "#fef2f2", borderRadius: "14px", p: 2, mb: 2 }}>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 13,
          color: "#374151",
          mb: 1.5,
          fontFamily: FONT,
        }}
      >
        {isRefundable ? "Partially Refundable" : "Non Refundable"}
      </Typography>

      <Box sx={{ position: "relative", height: 24, mb: 1 }}>
        {/* Line */}
        <Box
          sx={{
            position: "absolute",
            left: 12,
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            height: 2,
            bgcolor: "#ef4444",
          }}
        />
        {/* Left dot — Now */}
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#ef4444",
            position: "absolute",
            left: 0,
            top: 3,
          }}
        />
        {/* Right dot — Check-in (hollow center) */}
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#ef4444",
            position: "absolute",
            right: 0,
            top: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#fff" }}
          />
        </Box>
      </Box>

      {/* Labels */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 12, color: LIGHT, fontFamily: FONT }}>
          Now
        </Typography>
        <Typography sx={{ fontSize: 12, color: LIGHT, fontFamily: FONT }}>
          Check-in
        </Typography>
      </Box>
    </Box>
  );
};

// ── Dynamic cancellation description from CancelPolicies ───
const getCancellationDesc = (cancelPolicies, fallbackDesc) => {
  if (!cancelPolicies || cancelPolicies.length === 0) return fallbackDesc;
  const last = cancelPolicies[cancelPolicies.length - 1];
  if (last.CancellationCharge === 0) return "Free cancellation available";
  if (last.ChargeType === "Percentage")
    return `${last.CancellationCharge}% amount will be deducted on cancellations`;
  return `₹${Number(last.CancellationCharge).toLocaleString("en-IN")} will be deducted on cancellations`;
};

const StatusHeader = ({ paymentStatus, leadEmail, isCancelled }) => {
  if (paymentStatus === "SUCCESS")
    return (
      <Box
        sx={{
          bgcolor: "#dcfce7",
          px: { xs: 2, sm: 3 },
          py: 2.5,
          display: "flex",
          gap: 1.5,
          alignItems: "flex-start",
        }}
      >
        <CheckCircleIcon sx={{ color: GREEN, fontSize: 30, mt: "2px" }} />
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 800,
              color: GREEN,
              fontFamily: FONT,
            }}
          >
            Booking Confirmed
          </Typography>
          <Typography
            sx={{
              fontSize: 13.5,
              color: "#374151",
              mt: 0.5,
              lineHeight: 1.6,
              fontFamily: FONT,
            }}
          >
            Your booking is confirmed.
            {leadEmail &&
              ` A confirmation mail will be sent to ${leadEmail}.`}
          </Typography>
        </Box>
      </Box>
    );

  if (paymentStatus === "FAILED")
    return (
      <Box
        sx={{
          bgcolor: "#fef2f2",
          px: { xs: 2, sm: 3 },
          py: 2.5,
          display: "flex",
          gap: 1.5,
          alignItems: "flex-start",
        }}
      >
        <ErrorOutlinedIcon sx={{ color: "#ef4444", fontSize: 30, mt: "2px" }} />
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 800,
              color: "#ef4444",
              fontFamily: FONT,
            }}
          >
            Payment Failed
          </Typography>
          <Typography
            sx={{
              fontSize: 13.5,
              color: "#374151",
              mt: 0.5,
              lineHeight: 1.6,
              fontFamily: FONT,
            }}
          >
            Your payment could not be processed. Please try again.
          </Typography>
        </Box>
      </Box>
    );

  if (isCancelled)
    return (
      <Box
        sx={{
          bgcolor: "#f3f4f6",
          px: { xs: 2, sm: 3 },
          py: 2.5,
          display: "flex",
          gap: 1.5,
          alignItems: "flex-start",
        }}
      >
        <ErrorOutlinedIcon sx={{ color: LIGHT, fontSize: 30, mt: "2px" }} />
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 800,
              color: DARK,
              fontFamily: FONT,
            }}
          >
            Payment Cancelled
          </Typography>
          <Typography
            sx={{
              fontSize: 13.5,
              color: "#374151",
              mt: 0.5,
              lineHeight: 1.6,
              fontFamily: FONT,
            }}
          >
            You have cancelled the payment.
          </Typography>
        </Box>
      </Box>
    );

  if (paymentStatus === "PENDING")
    return (
      <Box
        sx={{
          bgcolor: "#fefce8",
          px: { xs: 2, sm: 3 },
          py: 2.5,
          display: "flex",
          gap: 1.5,
          alignItems: "flex-start",
        }}
      >
        <CircularProgress
          size={28}
          sx={{ color: "#ca8a04", mt: "2px", flexShrink: 0 }}
        />
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 800,
              color: "#ca8a04",
              fontFamily: FONT,
            }}
          >
            Payment Pending
          </Typography>
          <Typography
            sx={{
              fontSize: 13.5,
              color: "#374151",
              mt: 0.5,
              lineHeight: 1.6,
              fontFamily: FONT,
            }}
          >
            Your payment is being processed. Please wait...
          </Typography>
        </Box>
      </Box>
    );

  return null;
};

const BookingSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    initiatePayment,
    cancelPayment,
    cancelling,
    initiating,
    paymentStatus,
    paymentData,
    resetKey,
    handleClientExpiry,
  } = usePayment();

  const [qrOpen, setQrOpen] = useState(false);

  const { mins, secs, isExpired } = useCountdown(
    paymentData?.expiryDate ?? null,
    paymentData?._ts ?? null,
    false,
    resetKey,
    handleClientExpiry,
  );

  const prebookData = state?.prebookData ?? null;
  const prebookId =
    state?.prebookId ??
    prebookData?.data?.prebookId ??
    sessionStorage.getItem("hotel_prebookId") ??
    null;

  const hotelSnapshot = state?.hotelSnapshot ?? {};
  const roomSnapshot = state?.roomSnapshot ?? {};

  const hotelName = hotelSnapshot.hotelName ?? "Hotel";
  const hotelStars = hotelSnapshot.hotelStars ?? 4;
  const hotelImage =
    hotelSnapshot.hotelImage ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80";
  const hotelLocation = hotelSnapshot.hotelLocation ?? "";
  const checkInTime = hotelSnapshot.checkInTime ?? "";
  const checkOutTime = hotelSnapshot.checkOutTime ?? "";

  const roomName = roomSnapshot.roomName ?? "Room";
  const roomSize = roomSnapshot.size ?? "";
  const bedType = roomSnapshot.bedType ?? "";
  const sleeps = roomSnapshot.maxOccupancy ?? "";
  const viewType = roomSnapshot.viewType ?? "";
  const inclusions = roomSnapshot.inclusions ?? [];
  const roomImage =
    roomSnapshot.images?.[0] ??
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80";

  const checkInDay = state?.checkInDay ?? "";
  const checkInDate = state?.checkInDate ?? "";
  const checkOutDay = state?.checkOutDay ?? "";
  const checkOutDate = state?.checkOutDate ?? "";
  const nights = state?.nights ?? 1;
  const roomQty = state?.roomQty ?? 1;
  const currency = state?.currency ?? "₹";

  const prebookRoom =
    prebookData?.data?.tboResponse?.HotelResult?.[0]?.Rooms?.[0] ?? {};
  const confirmedFare = prebookRoom.TotalFare ?? state?.baseAmount ?? 0;
  const confirmedTax = prebookRoom.TotalTax ?? state?.taxAmount ?? 0;
  const confirmedNet = prebookRoom.NetAmount ?? confirmedFare + confirmedTax;
  const convenienceFee = state?.convenienceFee ?? 0;
  const isRefundable = prebookRoom.IsRefundable ?? state?.isRefundable ?? false;
  const cancelPolicies = prebookRoom.CancelPolicies ?? [];
  const cancellationDesc =
    state?.cancellationDesc ?? "100% amount will be deducted on cancellations";
  const bookingId = prebookId ?? "—";
  const leadEmail = state?.leadEmail ?? "";

  const isCancelled = paymentStatus === "CANCELLED";
  const showExpiredState = paymentStatus === "EXPIRED" && !initiating;

  // Dynamic description from CancelPolicies
  const dynamicCancellationDesc = getCancellationDesc(cancelPolicies, cancellationDesc);

  // Auto cancel on page leave if PENDING
  useEffect(() => {
    return () => {
      if (prebookId && paymentStatus === "PENDING") {
        hotelFetch("/api/hotelv2/payment/cancel/", {
          body: { prebookId: String(prebookId) },
        }).catch(() => {});
      }
    };
  }, [prebookId, paymentStatus]);

  // Close QR on success
  useEffect(() => {
    if (paymentStatus === "SUCCESS") {
      setTimeout(() => setQrOpen(false), 2500);
      sessionStorage.removeItem("hotel_prebookId");
    }
  }, [paymentStatus]);

  const handlePayNow = async () => {
    if (!prebookId) {
      alert("Prebook ID not found. Please go back and try again.");
      return;
    }
    try {
      await initiatePayment(prebookId, { onSuccess: () => setQrOpen(true) });
    } catch (err) {
      console.error("Payment initiation failed:", err);
    }
  };

  const handleRetry = async () => {
    if (!prebookId || initiating) return;
    try {
      await initiatePayment(prebookId, { onSuccess: () => setQrOpen(true) });
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  const handleCancel = async () => {
    if (!prebookId || cancelling) return;
    await cancelPayment(prebookId);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: BG,
        p: { xs: 1.5, sm: 2.5, md: 4 },
        fontFamily: FONT,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 2.5,
          alignItems: "flex-start",
        }}
      >
        {/* ══ LEFT ══ */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            bgcolor: "#fff",
            borderRadius: "18px",
            border: `1px solid ${BORDER}`,
            overflow: "hidden",
          }}
        >
          <StatusHeader
            paymentStatus={paymentStatus}
            leadEmail={leadEmail}
            isCancelled={isCancelled}
          />

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography
              sx={{ fontSize: 13, color: LIGHT, mb: 2.5, fontFamily: FONT }}
            >
              Booking ID : {bookingId}
            </Typography>

            {/* Hotel info */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box
                component="img"
                src={hotelImage}
                alt={hotelName}
                sx={{
                  width: { xs: "100%", sm: 100 },
                  height: { xs: 200, sm: 90 },
                  borderRadius: "12px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200&q=80";
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Stars count={hotelStars} />
                  <Typography
                    sx={{ fontSize: 12.5, color: LIGHT, fontFamily: FONT }}
                  >
                    Hotel
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: 18, sm: 22 },
                    fontWeight: 800,
                    color: DARK,
                    fontFamily: FONT,
                    lineHeight: 1.3,
                  }}
                >
                  {hotelName}
                </Typography>
                {hotelLocation && (
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: LIGHT,
                      mt: 0.5,
                      lineHeight: 1.6,
                      fontFamily: FONT,
                    }}
                  >
                    {hotelLocation}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Check-in / Check-out */}
            <Box
              sx={{
                mt: 3,
                pt: 3,
                pb: 3,
                borderTop: `1px dashed ${BORDER}`,
                borderBottom: `1px dashed ${BORDER}`,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: { md: "center" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                    mb: 0.5,
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 14, color: LIGHT }}
                  />
                  <Typography
                    sx={{ fontSize: 12, color: LIGHT, fontFamily: FONT }}
                  >
                    Check-in
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: 20, sm: 24 },
                    fontWeight: 800,
                    color: DARK,
                    fontFamily: FONT,
                  }}
                >
                  {checkInDay}
                  {checkInDay && checkInDate ? ", " : ""}
                  {checkInDate}
                </Typography>
                {checkInTime && (
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: LIGHT,
                      mt: 0.3,
                      fontFamily: FONT,
                    }}
                  >
                    {checkInTime}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  px: 2.5,
                  py: 0.8,
                  bgcolor: "#dcfce7",
                  color: GREEN,
                  borderRadius: "30px",
                  fontWeight: 700,
                  fontSize: 13,
                  width: "fit-content",
                  fontFamily: FONT,
                }}
              >
                {nights} Night{nights > 1 ? "s" : ""}
              </Box>

              <Box sx={{ flex: 1, textAlign: { md: "right" } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { md: "flex-end" },
                    alignItems: "center",
                    gap: 0.7,
                    mb: 0.5,
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 14, color: LIGHT }}
                  />
                  <Typography
                    sx={{ fontSize: 12, color: LIGHT, fontFamily: FONT }}
                  >
                    Check-out
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: 20, sm: 24 },
                    fontWeight: 800,
                    color: DARK,
                    fontFamily: FONT,
                  }}
                >
                  {checkOutDay}
                  {checkOutDay && checkOutDate ? ", " : ""}
                  {checkOutDate}
                </Typography>
                {checkOutTime && (
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: LIGHT,
                      mt: 0.3,
                      fontFamily: FONT,
                    }}
                  >
                    {checkOutTime}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Room info */}
            <Box sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1.5, sm: 2 },
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: 100 },
                    height: { xs: 160, sm: 80 },
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={roomImage}
                    alt={roomName}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80";
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: DARK,
                      mb: 1.2,
                      fontFamily: FONT,
                    }}
                  >
                    {roomQty} x {roomName}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px 18px",
                      mb: 1.2,
                    }}
                  >
                    <InfoItem
                      icon={
                        <SquareFootOutlinedIcon
                          sx={{ fontSize: 15, color: LIGHT }}
                        />
                      }
                      text={roomSize}
                    />
                    <InfoItem
                      icon={
                        <BedOutlinedIcon sx={{ fontSize: 15, color: LIGHT }} />
                      }
                      text={bedType}
                    />
                    <InfoItem
                      icon={
                        <PeopleOutlineOutlinedIcon
                          sx={{ fontSize: 15, color: LIGHT }}
                        />
                      }
                      text={sleeps ? `Sleeps ${sleeps}` : ""}
                    />
                    <InfoItem
                      icon={
                        <ApartmentOutlinedIcon
                          sx={{ fontSize: 15, color: LIGHT }}
                        />
                      }
                      text={viewType}
                    />
                  </Box>
                  {inclusions.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px 14px",
                      }}
                    >
                      {inclusions.map((inc, i) => (
                        <Facility key={i} label={inc} />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Cancellation dates — left card mein detail table */}
            {cancelPolicies.length > 0 && (
              <Box sx={{ mt: 3, pt: 2.5, borderTop: `1px dashed ${BORDER}` }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: DARK,
                    mb: 1.2,
                    fontFamily: FONT,
                  }}
                >
                  Cancellation Dates
                </Typography>
                {cancelPolicies.map((p, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.8,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 13, color: LIGHT, fontFamily: FONT }}
                    >
                      From {p.FromDate}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: FONT,
                        color: p.CancellationCharge > 0 ? "#ef4444" : GREEN,
                      }}
                    >
                      {p.CancellationCharge === 0
                        ? "Free"
                        : p.ChargeType === "Percentage"
                          ? `${p.CancellationCharge}%`
                          : `₹${Number(p.CancellationCharge).toLocaleString("en-IN")}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* ══ RIGHT ══ */}
        <Box
          sx={{
            width: { xs: "100%", lg: 330 },
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: { lg: "sticky" },
            top: 20,
          }}
        >
          {/* Fare summary */}
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: "18px",
              border: `1px solid ${BORDER}`,
              p: 2.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 800,
                color: DARK,
                mb: 2,
                fontFamily: FONT,
              }}
            >
              Fare Summary
            </Typography>
            {[
              {
                label: `${roomQty} Room, ${nights} Night${nights > 1 ? "s" : ""}`,
                value: `${currency}${Number(confirmedFare).toLocaleString("en-IN")}`,
              },
              {
                label: "Taxes & Charges",
                value: `${currency}${Number(confirmedTax).toLocaleString("en-IN")}`,
              },
            ].map((row, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.4,
                }}
              >
                <Typography
                  sx={{ fontSize: 13.5, color: "#374151", fontFamily: FONT }}
                >
                  {row.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: DARK,
                    fontFamily: FONT,
                  }}
                >
                  {row.value}
                </Typography>
              </Box>
            ))}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography
                sx={{ fontSize: 13.5, color: "#374151", fontFamily: FONT }}
              >
                Convenience Fee
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {convenienceFee === 0 && (
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "#9ca3af",
                      textDecoration: "line-through",
                      fontFamily: FONT,
                    }}
                  >
                    ₹100
                  </Typography>
                )}
                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    fontFamily: FONT,
                    color: convenienceFee === 0 ? GREEN : DARK,
                  }}
                >
                  {currency}
                  {convenienceFee === 0
                    ? "0"
                    : Number(convenienceFee).toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2, borderColor: "#f3f4f6" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: DARK,
                  fontFamily: FONT,
                }}
              >
                Net Amount Payable
              </Typography>
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: DARK,
                  fontFamily: FONT,
                }}
              >
                {currency}
                {Number(confirmedNet + convenienceFee).toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Box>

          {/* ══ Cancellation Policy — right sidebar ══ */}
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: "18px",
              border: `1px solid ${BORDER}`,
              p: 2.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 800,
                color: DARK,
                mb: 1,
                fontFamily: FONT,
              }}
            >
              Cancellation Policy
            </Typography>

            {/* Dynamic description from CancelPolicies */}
            <Typography
              sx={{
                fontSize: 13,
                color: LIGHT,
                mb: 2,
                lineHeight: 1.7,
                fontFamily: FONT,
              }}
            >
              {dynamicCancellationDesc}
            </Typography>

            {/* Timeline — same design, dynamic data */}
            <CancelTimeline
              cancelPolicies={cancelPolicies}
              isRefundable={isRefundable}
            />

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: GREEN,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              View Cancellation Policy
            </Typography>
          </Box>

          {/* Pay Now button */}
          <Button
            fullWidth
            onClick={handlePayNow}
            disabled={initiating || paymentStatus === "SUCCESS" || isCancelled}
            sx={{
              bgcolor: GREEN,
              color: "#fff",
              borderRadius: "12px",
              py: 1.6,
              fontWeight: 700,
              textTransform: "none",
              fontSize: 16,
              fontFamily: FONT,
              boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
              "&:hover": { bgcolor: "#15803d" },
              "&.Mui-disabled": { bgcolor: "#86efac", color: "#fff" },
            }}
          >
            {initiating ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : paymentStatus === "SUCCESS" ? (
              "Payment Successful"
            ) : isCancelled ? (
              "Payment Cancelled"
            ) : (
              "Pay Now"
            )}
          </Button>

          {paymentStatus &&
            !["PENDING", "SUCCESS", "CANCELLED"].includes(paymentStatus) && (
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "#ef4444",
                  fontFamily: FONT,
                }}
              >
                Payment {paymentStatus.toLowerCase()}. Please try again.
              </Typography>
            )}
        </Box>
      </Box>

      {/* ══ QR Modal ══ */}
      <QRPaymentModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        paymentData={paymentData}
        paymentStatus={paymentStatus}
        initiating={initiating}
        cancelling={cancelling}
        isExpired={showExpiredState}
        mins={mins}
        secs={secs}
        currency={currency}
        onRetry={handleRetry}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default BookingSuccessPage;