import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WindowIcon from "@mui/icons-material/Window";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { hotelFetch } from "../../api/hotelApi";

const GREEN = "#16a34a";
const BORDER = "#e5e7eb";
const LIGHT_BG = "#f4f6f8";
const CARD_BG = "#ffffff";
const TEXT_DARK = "#111827";
const TEXT_MID = "#374151";
const TEXT_LIGHT = "#6b7280";
const ERROR_COLOR = "#dc2626";
const FONT = "'DM Sans', sans-serif";

const FIELD_HEIGHT = 44;

const SALUTATION_TO_TITLE = {
  "Mr.": "Mr",
  "Mrs.": "Mrs",
  "Miss.": "Miss",
};

// ─── Validation helpers ───────────────────────
const validateFirstName = (value) => {
  if (!value || !value.trim()) return "First name is required";
  if (/^\s/.test(value)) return "Cannot start with a space";
  if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) return "Only alphabets are allowed";
  return "";
};

const validateLastName = (value) => {
  if (!value || !value.trim()) return "Last name is required";
  if (/^\s/.test(value)) return "Cannot start with a space";
  if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) return "Only alphabets are allowed";
  return "";
};

const validateEmail = (value) => {
  if (!value || !value.trim()) return "Email is required";
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value.trim())) return "Enter a valid email address";
  return "";
};

const validateMobile = (value) => {
  if (!value || !value.trim()) return "Mobile number is required";
  if (!/^\d{10}$/.test(value.trim())) return "Enter a valid 10-digit mobile number";
  return "";
};

// ─── Sub-components ───────────────────────────
const FieldLabel = ({ children }) => (
  <Typography sx={{ fontSize: 12, color: TEXT_LIGHT, fontWeight: 500, mb: 0.6, fontFamily: FONT }}>
    {children}
  </Typography>
);

const FieldError = ({ message }) =>
  message ? (
    <Typography sx={{ fontSize: 11.5, color: ERROR_COLOR, mt: 0.5, fontFamily: FONT, fontWeight: 500 }}>
      {message}
    </Typography>
  ) : null;

const getInputSx = (hasError) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: 14,
    fontFamily: FONT,
    color: TEXT_DARK,
    bgcolor: "#fafafa",
    height: FIELD_HEIGHT,
    "& fieldset": { borderColor: hasError ? ERROR_COLOR : BORDER },
    "&:hover fieldset": { borderColor: hasError ? ERROR_COLOR : "#9ca3af" },
    "&.Mui-focused fieldset": { borderColor: hasError ? ERROR_COLOR : GREEN, borderWidth: "1.5px" },
  },
  "& .MuiInputBase-input": { py: 0, px: "14px" },
});

const Stars = ({ count = 4 }) =>
  Array.from({ length: 5 }).map((_, i) =>
    i < count
      ? <StarIcon key={i} sx={{ fontSize: 14, color: "#f5a623" }} />
      : <StarBorderIcon key={i} sx={{ fontSize: 14, color: "#d1d5db" }} />
  );

const InclusionChip = ({ label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <CheckIcon sx={{ fontSize: 13, color: GREEN }} />
    <Typography sx={{ fontSize: 12.5, color: TEXT_MID, fontFamily: FONT }}>{label}</Typography>
  </Box>
);

// ─── Single Passenger Form ────────────────────
const PassengerForm = ({ passenger, onChange, errors = {}, onErrorChange, selectBaseSx }) => {
  const isLead = passenger.isLead;
  const isChild = passenger.paxType === 2;

  const handleNameChange = (field, raw) => {
    const updated = { ...passenger, [field]: raw };
    onChange(updated);
    const validator = field === "firstName" ? validateFirstName : validateLastName;
    onErrorChange({ ...errors, [field]: validator(raw) });
  };

  const handleEmailChange = (val) => {
    onChange({ ...passenger, email: val });
    onErrorChange({ ...errors, email: validateEmail(val) });
  };

  const handleMobileChange = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    onChange({ ...passenger, mobile: digits });
    onErrorChange({ ...errors, mobile: validateMobile(digits) });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {isLead && (
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 0.5,
            bgcolor: "#dcfce7", color: GREEN, fontSize: 12, fontWeight: 600,
            px: 1.5, py: 0.4, borderRadius: "20px", fontFamily: FONT,
          }}>
            <CheckIcon sx={{ fontSize: 13 }} /> Lead Passenger
          </Box>
        )}
        {isChild && (
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 0.5,
            bgcolor: "#fef9c3", color: "#ca8a04", fontSize: 12, fontWeight: 600,
            px: 1.5, py: 0.4, borderRadius: "20px", fontFamily: FONT,
          }}>
            🧒 Child • Age: {passenger.age} yrs
          </Box>
        )}
      </Box>

      <RadioGroup
        row value={passenger.salutation}
        onChange={(e) => onChange({ ...passenger, salutation: e.target.value })}
        sx={{ mb: 2, gap: { xs: 0.5, sm: 1.5 } }}
      >
        {["Mr.", "Mrs.", "Miss."].map((s) => (
          <FormControlLabel
            key={s} value={s} label={s}
            control={<Radio size="small" sx={{ color: BORDER, "&.Mui-checked": { color: GREEN }, p: 0.8 }} />}
            sx={{ mr: 0, "& .MuiFormControlLabel-label": { fontSize: 14, color: TEXT_MID, fontFamily: FONT, fontWeight: 500 } }}
          />
        ))}
      </RadioGroup>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
        <Box>
          <FieldLabel>First Name *</FieldLabel>
          <TextField
            fullWidth
            value={passenger.firstName}
            onChange={(e) => handleNameChange("firstName", e.target.value)}
            placeholder="First Name"
            variant="outlined"
            sx={getInputSx(!!errors.firstName)}
            error={!!errors.firstName}
          />
          <FieldError message={errors.firstName} />
        </Box>
        <Box>
          <FieldLabel>Last Name *</FieldLabel>
          <TextField
            fullWidth
            value={passenger.lastName}
            onChange={(e) => handleNameChange("lastName", e.target.value)}
            placeholder="Last Name"
            variant="outlined"
            sx={getInputSx(!!errors.lastName)}
            error={!!errors.lastName}
          />
          <FieldError message={errors.lastName} />
        </Box>
      </Box>

      {isLead && (
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
            <Box>
              <FieldLabel>Email id *</FieldLabel>
              <TextField
                fullWidth
                value={passenger.email ?? ""}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Email"
                type="email"
                variant="outlined"
                sx={getInputSx(!!errors.email)}
                error={!!errors.email}
              />
              <FieldError message={errors.email} />
            </Box>

            <Box>
              <FieldLabel>Mobile Number *</FieldLabel>
              <Box sx={{ display: "flex", height: FIELD_HEIGHT }}>
                <Box sx={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  px: 1.5,
                  height: "100%",
                  borderRadius: "10px 0 0 10px",
                  border: `1.5px solid ${errors.mobile ? ERROR_COLOR : BORDER}`,
                  borderRight: "none",
                  bgcolor: "#f3f4f6",
                  fontSize: 13.5, fontFamily: FONT, color: TEXT_MID, fontWeight: 600,
                  whiteSpace: "nowrap", userSelect: "none",
                  boxSizing: "border-box",
                }}>
                  🇮🇳 +91
                </Box>
                <TextField
                  fullWidth
                  value={passenger.mobile ?? ""}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  placeholder="10-digit number"
                  type="tel"
                  variant="outlined"
                  inputProps={{ maxLength: 10, inputMode: "numeric" }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0 10px 10px 0",
                      fontSize: 14, fontFamily: FONT, color: TEXT_DARK, bgcolor: "#fafafa",
                      height: FIELD_HEIGHT,
                      "& fieldset": { borderColor: errors.mobile ? ERROR_COLOR : BORDER },
                      "&:hover fieldset": { borderColor: errors.mobile ? ERROR_COLOR : "#9ca3af" },
                      "&.Mui-focused fieldset": { borderColor: errors.mobile ? ERROR_COLOR : GREEN, borderWidth: "1.5px" },
                    },
                    "& .MuiInputBase-input": { py: 0, px: "14px" },
                  }}
                  error={!!errors.mobile}
                />
              </Box>
              <FieldError message={errors.mobile} />
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
            <Box>
              <FieldLabel>PAN Card (optional)</FieldLabel>
              <TextField
                fullWidth
                value={passenger.pan ?? ""}
                onChange={(e) => onChange({ ...passenger, pan: e.target.value.toUpperCase() })}
                placeholder="e.g. ABCDE1234F"
                variant="outlined"
                inputProps={{ maxLength: 10 }}
                sx={getInputSx(false)}
              />
            </Box>
            <Box>
              <FieldLabel>Nationality</FieldLabel>
              <Box sx={{
                display: "flex", alignItems: "center",
                height: FIELD_HEIGHT,
                px: "14px",
                borderRadius: "10px",
                border: `1.5px solid ${BORDER}`,
                bgcolor: "#f3f4f6",
                fontSize: 14, fontFamily: FONT, color: TEXT_MID, fontWeight: 500,
                userSelect: "none",
              }}>
                🇮🇳 India
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

// ─── Date helpers ─────────────────────────────
function fmtDay(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  return Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
}

// ─── Main Component ───────────────────────────
const HotelCheckoutPage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const routeState = location.state ?? {};

  const searchId = routeState.searchId ?? props.searchId ?? null;
  const BookingCode = routeState.BookingCode ?? props.BookingCode ?? "";

  const roomSnapshot = routeState.roomSnapshot ?? null;
  const hotelSnapshot = routeState.hotelSnapshot ?? null;
  const guestsData = routeState.guestsData ?? null;

  const hotelName = hotelSnapshot?.hotelName ?? props.hotelName ?? "Hotel";
  const hotelStars = hotelSnapshot?.hotelStars ?? props.hotelStars ?? 4;
  const hotelImage = hotelSnapshot?.hotelImage ?? props.hotelImage ?? "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80";
  const hotelLocation = hotelSnapshot?.hotelLocation ?? props.hotelLocation ?? "";
  const checkInTime = hotelSnapshot?.checkInTime ?? props.checkInTime ?? "2:00 PM";
  const checkOutTime = hotelSnapshot?.checkOutTime ?? props.checkOutTime ?? "12:00 AM";

  const roomName = roomSnapshot?.roomName ?? props.roomName ?? "Room";
  const roomSize = roomSnapshot?.size ?? props.roomSize ?? "";
  const bedType = roomSnapshot?.bedType ?? props.bedType ?? "";
  const sleeps = roomSnapshot?.maxOccupancy ?? props.sleeps ?? 2;
  const viewType = roomSnapshot?.viewType ?? props.viewType ?? "";
  const roomImage = roomSnapshot?.images?.[0] ?? props.roomImage ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80";
  const inclusions = roomSnapshot?.inclusions ?? props.inclusions ?? [];

  const baseAmount = roomSnapshot?.price ?? props.baseAmount ?? 0;
  const taxAmount = roomSnapshot?.taxes ?? props.taxAmount ?? 0;
  const convenienceFee = props.convenienceFee ?? 0;
  const currency = props.currency ?? "₹";
  const isRefundable = roomSnapshot?.isRefundable ?? props.isRefundable ?? false;
  const cancellationDesc = props.cancellationDesc ?? "100% amount will be deducted on cancellations";

  const checkInISO = routeState.checkIn ?? null;
  const checkOutISO = routeState.checkOut ?? null;
  const checkInDay = fmtDay(checkInISO) || props.checkInDay || "";
  const checkInDate = fmtDate(checkInISO) || props.checkInDate || "";
  const checkOutDay = fmtDay(checkOutISO) || props.checkOutDay || "";
  const checkOutDate = fmtDate(checkOutISO) || props.checkOutDate || "";
  const nights = calcNights(checkInISO, checkOutISO);
  const roomQty = props.roomQty ?? routeState.roomQty ?? 1;

  const totalAdults = guestsData?.adults ?? 1;
  const totalChildren = guestsData?.children ?? 0;
  const childAges = guestsData?.childAges ?? [];

  const initPassengers = () => {
    const list = [];
    for (let i = 0; i < totalAdults; i++) {
      list.push({
        paxType: 1, salutation: "Mr.", firstName: "", lastName: "",
        email: i === 0 ? "" : null,
        mobile: i === 0 ? "" : null,
        pan: i === 0 ? "" : null,
        nationality: "India", age: 30, isLead: i === 0,
      });
    }
    for (let i = 0; i < totalChildren; i++) {
      list.push({
        paxType: 2, salutation: "Mr.", firstName: "", lastName: "",
        email: null, mobile: null, pan: null,
        nationality: "India", age: childAges[i] ? parseInt(childAges[i]) : 5, isLead: false,
      });
    }
    return list;
  };

  const [passengers, setPassengers] = useState(initPassengers);
  const [errors, setErrors] = useState(() => passengers.map(() => ({})));
  const [activeTab, setActiveTab] = useState(0);
  const [prebookLoading, setPrebookLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  // ✅ Jab user is page se kisi aur page pe navigate kare (back button etc.)
  // tab sessionStorage clean ho jaye — lekin sirf tab jab hum khud navigate nahi kar rahe
  // isliye ek ref rakhte hain jo navigate ke waqt true ho jaata hai
  const isNavigatingToPayment = React.useRef(false);

  useEffect(() => {
    return () => {
      // Cleanup: agar payment page pe navigate nahi kiya (yani back gaye ya kuch aur)
      // toh sessionStorage clean karo
      if (!isNavigatingToPayment.current) {
        sessionStorage.removeItem("hotel_prebookId");
      }
    };
  }, []);

  const netAmount = baseAmount + taxAmount + convenienceFee;

  const selectBaseSx = {
    borderRadius: "10px", fontFamily: FONT, color: TEXT_DARK, bgcolor: "#fafafa",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GREEN, borderWidth: "1.5px" },
    "& .MuiSvgIcon-root": { color: TEXT_LIGHT },
  };

  const updatePassenger = (index, updated) => {
    const next = [...passengers];
    next[index] = updated;
    setPassengers(next);
  };

  const updateErrors = (index, updatedErrs) => {
    const next = [...errors];
    next[index] = updatedErrs;
    setErrors(next);
  };

  const validateAll = () => {
    let allValid = true;
    let firstErrorTab = null;
    const newErrors = passengers.map((p, i) => {
      const errs = {};
      const fnErr = validateFirstName(p.firstName);
      const lnErr = validateLastName(p.lastName);
      if (fnErr) errs.firstName = fnErr;
      if (lnErr) errs.lastName = lnErr;
      if (p.isLead) {
        const emailErr = validateEmail(p.email);
        const mobileErr = validateMobile(p.mobile);
        if (emailErr) errs.email = emailErr;
        if (mobileErr) errs.mobile = mobileErr;
      }
      if (Object.keys(errs).length > 0) {
        allValid = false;
        if (firstErrorTab === null) firstErrorTab = i;
      }
      return errs;
    });
    setErrors(newErrors);
    if (firstErrorTab !== null) setActiveTab(firstErrorTab);
    return allValid;
  };

  const applyBackendErrors = (backendData) => {
    try {
      const passengerErrList = backendData?.HotelRoomsDetails?.[0]?.HotelPassenger ?? [];
      if (!passengerErrList.length) return false;
      const FIELD_MAP = {
        Email: "email", FirstName: "firstName", LastName: "lastName", Phoneno: "mobile", PAN: "pan",
      };
      let hasAnyErr = false;
      let firstErrTab = null;
      const newErrors = passengers.map((_, i) => {
        const pErr = passengerErrList[i] ?? {};
        const errs = {};
        Object.entries(FIELD_MAP).forEach(([backendKey, frontendKey]) => {
          if (pErr[backendKey] && Array.isArray(pErr[backendKey]) && pErr[backendKey].length) {
            errs[frontendKey] = pErr[backendKey][0];
            hasAnyErr = true;
            if (firstErrTab === null) firstErrTab = i;
          }
        });
        return errs;
      });
      if (hasAnyErr) {
        setErrors(newErrors);
        if (firstErrTab !== null) setActiveTab(firstErrTab);
        return true;
      }
    } catch (_) {}
    return false;
  };

  const handlePayNow = async () => {
    if (!validateAll()) {
      setSnackbar({ open: true, message: "Please fix the highlighted errors before continuing.", severity: "warning" });
      return;
    }
    const apiPassengers = passengers.map((p) => {
      const base = {
        Title: SALUTATION_TO_TITLE[p.salutation] ?? "Mr",
        FirstName: p.firstName.trim(),
        LastName: p.lastName.trim(),
        PaxType: p.paxType,
        LeadPassenger: p.isLead,
        Age: p.age,
      };
      if (p.isLead) {
        base.Email = p.email?.trim() ?? "";
        base.Phoneno = p.mobile?.trim() ?? "";
        base.PAN = p.pan?.trim() ?? "";
      }
      return base;
    });
    const body = {
      searchId, BookingCode, PaymentMode: "Limit",
      HotelRoomsDetails: [{ HotelPassenger: apiPassengers }],
    };
    try {
      setPrebookLoading(true);
      const result = await hotelFetch("/api/hotelv2/prebook/", { body });
      console.log("🔍 Full prebook result:", JSON.stringify(result));

      const prebookId = result?.data?.prebookId ?? result?.prebookId ?? null;
      console.log("🔍 Extracted prebookId:", prebookId);

      // ✅ sessionStorage me save karo taaki payment page pe refresh hone pe bhi mile
      if (prebookId) {
        sessionStorage.setItem("hotel_prebookId", prebookId);
      }

      // ✅ Flag set karo ki hum intentionally payment page pe ja rahe hain
      // isliye cleanup useEffect sessionStorage ko delete nahi karega
      isNavigatingToPayment.current = true;

      navigate("/hotels/payment", {
        state: {
          prebookData: result,
          prebookId,
          roomSnapshot,
          hotelSnapshot,
          searchId,
          BookingCode,
          checkInDay,
          checkInDate,
          checkOutDay,
          checkOutDate,
          nights,
          roomQty,
          baseAmount,
          taxAmount,
          convenienceFee,
          currency,
          isRefundable,
          cancellationDesc,
          leadEmail: passengers[0]?.email ?? "",
        },
      });
    } catch (err) {
      const backendData = err?.response?.data ?? err?.data ?? null;
      const handled = backendData ? applyBackendErrors(backendData) : false;
      if (!handled) {
        setSnackbar({ open: true, message: err.message ?? "Prebook failed. Please try again.", severity: "error" });
      } else {
        setSnackbar({ open: true, message: "Please fix the errors highlighted below.", severity: "error" });
      }
    } finally {
      setPrebookLoading(false);
    }
  };

  // ─── Hotel Info Card ──────────────────────────
  const HotelInfoCard = () => (
    <Box sx={{ bgcolor: CARD_BG, borderRadius: "16px", p: { xs: 2, sm: 2.5 }, border: `1px solid ${BORDER}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 72, height: 65, borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
          <Box component="img" src={hotelImage} alt={hotelName}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200&q=80"; }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 0.4 }}>
            <Stars count={hotelStars} />
            <Typography sx={{ fontSize: 12, color: TEXT_LIGHT, fontFamily: FONT }}>Hotel</Typography>
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: TEXT_DARK, fontFamily: FONT, lineHeight: 1.25, mb: 0.3 }}>
            {hotelName}
          </Typography>
          {hotelLocation && (
            <Typography sx={{ fontSize: 12, color: TEXT_LIGHT, fontFamily: FONT, lineHeight: 1.4 }}>
              {hotelLocation}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 1.5, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.3 }}>
              <CalendarMonthIcon sx={{ fontSize: 13, color: TEXT_LIGHT }} />
              <Typography sx={{ fontSize: 11, color: TEXT_LIGHT, fontFamily: FONT }}>Check-in</Typography>
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: TEXT_DARK, fontFamily: FONT }}>
              {checkInDay}{checkInDay && checkInDate ? ", " : ""}{checkInDate}
            </Typography>
            {checkInTime && <Typography sx={{ fontSize: 11, color: TEXT_LIGHT, fontFamily: FONT, mt: 0.2 }}>{checkInTime}</Typography>}
          </Box>
          <Box sx={{ px: 1.2, py: 0.4, bgcolor: "#dcfce7", color: GREEN, borderRadius: "20px", fontWeight: 700, fontSize: 11, fontFamily: FONT, whiteSpace: "nowrap" }}>
            {nights}N
          </Box>
          <Box sx={{ flex: 1, textAlign: "right" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.3, justifyContent: "flex-end" }}>
              <CalendarMonthIcon sx={{ fontSize: 13, color: TEXT_LIGHT }} />
              <Typography sx={{ fontSize: 11, color: TEXT_LIGHT, fontFamily: FONT }}>Check-out</Typography>
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: TEXT_DARK, fontFamily: FONT }}>
              {checkOutDay}{checkOutDay && checkOutDate ? ", " : ""}{checkOutDate}
            </Typography>
            {checkOutTime && <Typography sx={{ fontSize: 11, color: TEXT_LIGHT, fontFamily: FONT, mt: 0.2 }}>{checkOutTime}</Typography>}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 1.5, borderColor: BORDER }} />
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, mb: 1.2, fontFamily: FONT }}>Room Details</Typography>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Box sx={{ width: 60, height: 55, borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
          <Box component="img" src={roomImage} alt={roomName}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80"; }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, mb: 0.8, fontFamily: FONT }}>
            {roomQty} x {roomName}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", mb: 0.8 }}>
            {roomSize && <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><SquareFootIcon sx={{ fontSize: 13, color: TEXT_LIGHT }} /><Typography sx={{ fontSize: 12, color: TEXT_MID, fontFamily: FONT }}>{roomSize}</Typography></Box>}
            {bedType && <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><KingBedOutlinedIcon sx={{ fontSize: 13, color: TEXT_LIGHT }} /><Typography sx={{ fontSize: 12, color: TEXT_MID, fontFamily: FONT }}>{bedType}</Typography></Box>}
            {sleeps && <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><PeopleAltOutlinedIcon sx={{ fontSize: 13, color: TEXT_LIGHT }} /><Typography sx={{ fontSize: 12, color: TEXT_MID, fontFamily: FONT }}>Sleeps {sleeps}</Typography></Box>}
            {viewType && <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><WindowIcon sx={{ fontSize: 13, color: TEXT_LIGHT }} /><Typography sx={{ fontSize: 12, color: TEXT_MID, fontFamily: FONT }}>{viewType}</Typography></Box>}
          </Box>
          {inclusions.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px 10px" }}>
              {inclusions.map((inc, i) => <InclusionChip key={i} label={inc} />)}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: LIGHT_BG, fontFamily: FONT, px: { xs: 1.5, sm: 3, md: 4, lg: 6 }, py: { xs: 2, sm: 3, md: 4 } }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ fontFamily: FONT }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ maxWidth: 1160, mx: "auto", mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
          sx={{ color: TEXT_MID, fontFamily: FONT, textTransform: "none", fontSize: 14, fontWeight: 600, pl: 0, "&:hover": { bgcolor: "transparent", color: TEXT_DARK } }}
        >
          Back
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 2.5, md: 3 }, maxWidth: 1160, mx: "auto", alignItems: "flex-start" }}>

        {/* ══ LEFT — Passenger Form ══ */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ bgcolor: CARD_BG, borderRadius: "16px", p: { xs: 2, sm: 2.5, md: 3 }, border: `1px solid ${BORDER}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 800, color: TEXT_DARK, mb: 2, fontFamily: FONT }}>
              Enter Passenger Details
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
              {passengers.map((p, i) => {
                const isFilled = p.firstName.trim() && p.lastName.trim();
                const isActive = activeTab === i;
                const hasErr = errors[i] && Object.keys(errors[i]).length > 0;
                return (
                  <Box
                    key={i}
                    onClick={() => setActiveTab(i)}
                    sx={{
                      px: 2, py: 0.8, borderRadius: "20px",
                      border: `1.5px solid ${hasErr ? ERROR_COLOR : isActive ? GREEN : BORDER}`,
                      bgcolor: hasErr ? "#fef2f2" : isActive ? "#dcfce7" : "#fff",
                      color: hasErr ? ERROR_COLOR : isActive ? GREEN : TEXT_MID,
                      fontSize: 13, fontWeight: isActive ? 700 : 500,
                      cursor: "pointer", fontFamily: FONT,
                      display: "flex", alignItems: "center", gap: 0.6,
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: hasErr ? ERROR_COLOR : GREEN,
                        bgcolor: hasErr ? "#fef2f2" : isActive ? "#dcfce7" : "#f0fdf4",
                      },
                    }}
                  >
                    <span>{p.paxType === 2 ? "🧒" : "👤"}</span>
                    <span>{p.paxType === 1 ? `Adult ${i + 1}` : `Child ${i - totalAdults + 1}`}</span>
                    {isFilled && !hasErr && (
                      <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: GREEN, display: "flex", alignItems: "center", justifyContent: "center", ml: 0.3 }}>
                        <CheckIcon sx={{ fontSize: 11, color: "#fff" }} />
                      </Box>
                    )}
                    {hasErr && (
                      <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: ERROR_COLOR, display: "flex", alignItems: "center", justifyContent: "center", ml: 0.3 }}>
                        <Typography sx={{ fontSize: 10, color: "#fff", fontWeight: 700, lineHeight: 1 }}>!</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            {passengers.map((p, i) => (
              <Box key={i} sx={{ display: activeTab === i ? "block" : "none" }}>
                <PassengerForm
                  passenger={p}
                  onChange={(updated) => updatePassenger(i, updated)}
                  errors={errors[i] ?? {}}
                  onErrorChange={(updatedErrs) => updateErrors(i, updatedErrs)}
                  selectBaseSx={selectBaseSx}
                />
              </Box>
            ))}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2.5, pt: 2, borderTop: `1px solid ${BORDER}` }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                {passengers.length > 1 && activeTab > 0 && (
                  <Button
                    onClick={() => setActiveTab((t) => t - 1)}
                    variant="outlined"
                    sx={{
                      borderColor: BORDER, color: TEXT_MID, fontFamily: FONT,
                      textTransform: "none", fontSize: 13, fontWeight: 600,
                      borderRadius: "10px", px: 3.5, py: 1.2,
                      "&:hover": { borderColor: GREEN, color: GREEN, bgcolor: "#f0fdf4" },
                    }}
                  >
                    ← Previous
                  </Button>
                )}
                {passengers.length > 1 && activeTab < passengers.length - 1 && (
                  <Button
                    onClick={() => setActiveTab((t) => t + 1)}
                    variant="contained"
                    disableElevation
                    sx={{
                      bgcolor: GREEN, color: "#fff", fontFamily: FONT,
                      textTransform: "none", fontSize: 13, fontWeight: 600,
                      borderRadius: "10px", px: 3.5, py: 1.2,
                      "&:hover": { bgcolor: "#15803d" },
                    }}
                  >
                    Next →
                  </Button>
                )}
                {passengers.length === 1 && <Box />}
              </Box>

              <Button
                onClick={handlePayNow}
                disabled={prebookLoading}
                sx={{
                  bgcolor: GREEN, color: "#fff", fontWeight: 700, fontSize: 13,
                  textTransform: "none", borderRadius: "10px", px: 3.5, py: 1.2,
                  fontFamily: FONT, boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                  "&:hover": { bgcolor: "#15803d" },
                  "&.Mui-disabled": { bgcolor: "#86efac", color: "#fff" },
                }}
              >
                {prebookLoading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Continue →"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ══ RIGHT — Hotel Info (desktop sticky) ══ */}
        {!isMobile && (
          <Box sx={{ flex: 1, minWidth: 0, position: "sticky", top: 24, alignSelf: "flex-start" }}>
            <HotelInfoCard />
          </Box>
        )}

        {isMobile && (
          <Box sx={{ width: "100%" }}>
            <HotelInfoCard />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HotelCheckoutPage;