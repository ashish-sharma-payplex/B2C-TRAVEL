import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Link,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SearchIcon from "@mui/icons-material/Search";
import { useFlightCities } from "../../hooks/flighthooks/useFlightCities";
import { useFlightSearch } from "../../hooks/flighthooks/useFlightSearch";

// ─── MUI Theme ────────────────────────────────
const muiTheme = createTheme({
  palette: {
    primary: { main: "#2e7d32" },
    background: { default: "#f0f4f8" },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
});

// ─── Constants ────────────────────────────────
const GREEN = "#16a34a";

const CATEGORIES = [
  { label: "Flights", img: "/navbaricons/flightslogo.svg", path: "/flights", emoji: "✈️" },
  { label: "Hotels",  img: "/navbaricons/hotelslogo.svg",  path: "/hotels",  emoji: "🏨" },
  { label: "Buses",   img: "/navbaricons/buseslogo.svg",   path: "/buses",   emoji: "🚌" },
  { label: "Trains",  img: "/navbaricons/trainslogo.svg",  path: "/trains",  emoji: "🚆" },
];

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];

// ─── SVG Icons ────────────────────────────────
const FlightTakeoffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7z" />
  </svg>
);

const FlightLandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l-3.5 3.5-2 4.8" />
    <path d="m2 9 7.7-1.4 3-5.3 1.3 3.5-4 7.2L2 9z" />
    <line x1="2" y1="19" x2="22" y2="19" />
  </svg>
);

const SwapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4l4 4" />
    <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#2e7d32" stroke="#2e7d32" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PassengerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Date Helpers ─────────────────────────────
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS  = ["Mo","Tu","We","Th","Fr","Sa","Su"];
const DAYS_FULL   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { const d = new Date(year, month, 1).getDay(); return (d + 6) % 7; }
function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatDisplayDate(date) {
  if (!date) return "";
  return `${DAYS_FULL[date.getDay()]}, ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}

// ─── CitySearchDropdown ───────────────────────
const CitySearchDropdown = ({
  anchorEl,
  open,
  onClose,
  onSelect,
  cities,
  loading,
  placeholder = "Search city or airport...",
}) => {
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, width: 320 });
  const inputRef = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      setPos({
        top: rect.bottom + scrollY + 6,
        left: rect.left + scrollX,
        width: Math.max(rect.width, 320),
      });
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, anchorEl]);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (
        ref.current && !ref.current.contains(e.target) &&
        anchorEl && !anchorEl.contains(e.target)
      ) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose, anchorEl]);

  // API response shape: { name: "Afghanistan", code: "AF", phone: "93", label: "...", value: "AF" }
  const normalize = (c) => ({
    code:    c.code  || c.value || "",
    name:    c.name  || c.label || "",
    country: "",
    airport: "",
  });

  // Filter by name or code
  const filtered = useMemo(() => {
    if (!query.trim()) return cities.slice(0, 50);
    const q = query.toLowerCase();
    return cities.filter((c) => {
      const name = (c.name || c.label || "").toLowerCase();
      const code = (c.code || c.value || "").toLowerCase();
      return name.includes(q) || code.includes(q);
    }).slice(0, 50);
  }, [query, cities]);

  if (!open) return null;

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        position: "absolute",
        top: pos.top,
        left: { xs: 8, md: pos.left },
        right: { xs: 8, md: "auto" },
        width: { xs: "calc(100vw - 16px)", md: pos.width },
        zIndex: 9999,
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)",
        bgcolor: "#fff",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Search Input */}
      <Box sx={{
        display: "flex", alignItems: "center", gap: 1,
        px: 2, py: 1.5, borderBottom: "1px solid #f3f4f6",
      }}>
        <SearchIcon sx={{ fontSize: 18, color: "#9ca3af", flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, border: "none", outline: "none",
            fontSize: 14, fontFamily: "'Inter', sans-serif",
            color: "#111827", background: "transparent",
          }}
        />
        {query && (
          <Box
            onClick={() => setQuery("")}
            sx={{ cursor: "pointer", color: "#9ca3af", fontSize: 18, lineHeight: 1, "&:hover": { color: "#374151" } }}
          >×</Box>
        )}
      </Box>

      {/* Results */}
      <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} sx={{ color: GREEN }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Typography sx={{ fontSize: 13, color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>
              No cities found
            </Typography>
          </Box>
        ) : (
          filtered.map((city, idx) => {
            const { code, name, country, airport } = normalize(city);

            return (
              <Box
                key={`${code}-${idx}`}
                onClick={() => {
                  // For countries API: name is country name, code is country code (AF, IN etc.)
                  onSelect({ code, name: country ? `${name}, ${country}` : name });
                  onClose();
                }}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 2, py: 1.2,
                  cursor: "pointer",
                  borderBottom: "1px solid #f9fafb",
                  transition: "background 0.12s",
                  "&:hover": { bgcolor: "#f0fdf4" },
                }}
              >
                {/* Airport Code badge */}
                <Box sx={{
                  minWidth: 42, height: 42, borderRadius: "10px",
                  bgcolor: "#f0fdf4", border: "1px solid #bbf7d0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: GREEN, fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>
                    {code || "—"}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{
                    fontSize: 13, fontWeight: 600, color: "#111827",
                    fontFamily: "'Inter', sans-serif",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {name}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

// ─── FlightDatePicker ─────────────────────────
const FlightDatePicker = ({ anchorEl, open, onClose, selectedDate, onChange, minDate }) => {
  const today = minDate ? new Date(minDate) : new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      setPos({ top: rect.bottom + scrollY + 8, left: rect.left + scrollX });
      const base = selectedDate || today;
      setViewMonth({ year: base.getFullYear(), month: base.getMonth() });
    }
  }, [open, anchorEl]);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      const popup = document.getElementById("flight-drp-popup");
      if (anchorEl && !anchorEl.contains(e.target) && popup && !popup.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose, anchorEl]);

  const canGoPrev =
    viewMonth.year > today.getFullYear() ||
    (viewMonth.year === today.getFullYear() && viewMonth.month > today.getMonth());

  const goPrev = () => {
    if (!canGoPrev) return;
    setViewMonth((prev) => {
      let m = prev.month - 1; let y = prev.year;
      if (m < 0) { m = 11; y--; }
      if (y < today.getFullYear() || (y === today.getFullYear() && m < today.getMonth()))
        return { year: today.getFullYear(), month: today.getMonth() };
      return { year: y, month: m };
    });
  };

  const goNext = () => {
    setViewMonth((prev) => {
      let m = prev.month + 1; let y = prev.year;
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  };

  if (!open) return null;

  const { year, month } = viewMonth;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <Paper
      id="flight-drp-popup"
      elevation={0}
      sx={{
        position: "absolute",
        top: pos.top,
        left: { xs: 8, md: pos.left },
        right: { xs: 8, md: "auto" },
        zIndex: 9999,
        borderRadius: "16px",
        p: { xs: "20px 16px", md: "24px 28px" },
        boxShadow: "0 8px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)",
        border: "1px solid #f3f4f6",
        bgcolor: "#ffffff",
        width: { xs: "calc(100vw - 16px)", md: "auto" },
        minWidth: { md: 300 },
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <IconButton onClick={goPrev} disabled={!canGoPrev} size="small"
          sx={{ width: 28, height: 28, color: canGoPrev ? "#6b7280" : "#d1d5db" }}>
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827", fontFamily: "inherit" }}>
          {MONTH_NAMES[month]} {year}
        </Typography>
        <IconButton onClick={goNext} size="small"
          sx={{ width: 28, height: 28, color: "#6b7280" }}>
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
        {DAY_LABELS.map((d) => (
          <Typography key={d} sx={{ textAlign: "center", fontSize: "0.78rem", fontWeight: 600, color: "#9ca3af", py: 0.5 }}>
            {d}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {cells.map((date, idx) => {
          if (!date) return <Box key={`empty-${idx}`} />;
          const isSelected = isSameDay(date, selectedDate);
          const isToday    = isSameDay(date, new Date());
          const isPast     = date < today && !isToday;
          return (
            <Box key={date.toISOString()} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box
                onClick={() => { if (!isPast) { onChange(date); onClose(); } }}
                sx={{
                  width: 34, height: 34, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: isPast ? "default" : "pointer",
                  bgcolor: isSelected ? GREEN : "transparent",
                  my: 0.3, transition: "background 0.12s, transform 0.1s",
                  "&:hover": !isPast ? { bgcolor: isSelected ? GREEN : "#f0fdf4", transform: "scale(1.08)" } : {},
                }}
              >
                <Typography sx={{
                  fontSize: "0.85rem",
                  fontWeight: isSelected || isToday ? 700 : 400,
                  color: isSelected ? "#fff" : isPast ? "#d1d5db" : isToday ? GREEN : "#111827",
                  lineHeight: 1, userSelect: "none",
                }}>
                  {date.getDate()}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : "Select date"}
        </Typography>
      </Box>
    </Paper>
  );
};

// ─── PassengerClassDropdown ───────────────────
const PassengerClassDropdown = ({ anchorEl, open, onClose, passengers, setPassengers, cabinClass, setCabinClass }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      setPos({ top: rect.bottom + scrollY + 8, left: rect.left + scrollX });
    }
  }, [open, anchorEl]);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target) && anchorEl && !anchorEl.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose, anchorEl]);

  if (!open) return null;

  const types = [
    { key: "adults",   label: "Adults",   sub: "12+ years"  },
    { key: "children", label: "Children", sub: "2-12 years" },
    { key: "infants",  label: "Infants",  sub: "Under 2"    },
  ];

  return (
    <div ref={ref} style={{
      position: "absolute", top: pos.top, left: pos.left, zIndex: 9999,
      width: 300, background: "#fff", borderRadius: 16,
      border: "1px solid #f0f0f0", boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      overflow: "hidden", fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ padding: "16px 16px 10px", fontWeight: 700, fontSize: 14, color: "#374151" }}>
        Travellers
      </div>

      {types.map(({ key, label, sub }) => (
        <div key={key} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px", borderBottom: "1px solid #f3f4f6",
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{label}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{sub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setPassengers((p) => ({ ...p, [key]: Math.max(key === "adults" ? 1 : 0, p[key] - 1) }))}
              style={{
                width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #d1d5db",
                background: "#fff", fontSize: 18, cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", color: "#374151", lineHeight: 1,
              }}
            >−</button>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827", minWidth: 20, textAlign: "center" }}>
              {passengers[key]}
            </span>
            <button
              onClick={() => setPassengers((p) => ({ ...p, [key]: p[key] + 1 }))}
              style={{
                width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #d1d5db",
                background: "#fff", fontSize: 18, cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", color: "#374151", lineHeight: 1,
              }}
            >+</button>
          </div>
        </div>
      ))}

      <div style={{ padding: "12px 16px 8px", fontWeight: 700, fontSize: 14, color: "#374151" }}>
        Cabin Class
      </div>
      <div style={{ padding: "0 16px 16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {CABIN_CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => setCabinClass(cls)}
            style={{
              padding: "6px 14px", borderRadius: 50,
              border: `1.5px solid ${cabinClass === cls ? GREEN : "#d1d5db"}`,
              background: cabinClass === cls ? "#f0fdf4" : "#fff",
              color: cabinClass === cls ? GREEN : "#374151",
              fontWeight: cabinClass === cls ? 700 : 500,
              fontSize: 13, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}
          >{cls}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px 14px" }}>
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "10px", borderRadius: 10,
            background: GREEN, color: "#fff", border: "none",
            fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif",
          }}
        >Done</button>
      </div>
    </div>
  );
};

// ─── StickyRightBar ───────────────────────────
const StickyRightBar = ({ visible }) => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300,
      bgcolor: "#ffffff", borderBottom: "1px solid #e8e8e8",
      px: { xs: 2, md: 4 }, display: "flex", alignItems: "center",
      gap: 2, minHeight: "64px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      opacity: visible ? 1 : 0, visibility: visible ? "visible" : "hidden",
      transition: "transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease",
    }}>
      <Box component="img" src="/navbaricons/dealplexlogo.svg" alt="Dealplex"
        sx={{ height: 38, objectFit: "contain", flexShrink: 0, mr: 1 }}
        onError={(e) => { e.target.style.display = "none"; }} />

      {!isMobile && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {CATEGORIES.map((cat) => {
            const isActive = location.pathname === cat.path || location.pathname.startsWith(cat.path + "/");
            return (
              <Box key={cat.label} onClick={() => navigate(cat.path)}
                sx={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  px: 2.5, py: 1, cursor: "pointer", borderRadius: "10px",
                  transition: "background 0.15s", "&:hover": { bgcolor: "#f5f5f5" },
                }}>
                <Box component="img" src={cat.img} alt={cat.label}
                  sx={{ width: 28, height: 28, objectFit: "contain", mb: 0.4 }}
                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
                <Typography sx={{ fontSize: 20, lineHeight: 1, display: "none" }}>{cat.emoji}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? GREEN : "#444", lineHeight: 1, whiteSpace: "nowrap" }}>
                  {cat.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {!isMobile && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
          {[
            { icon: <LocalOfferOutlinedIcon sx={{ fontSize: 20, color: "#555" }} />, label: "Offers" },
            { icon: <HeadsetMicOutlinedIcon sx={{ fontSize: 20, color: "#555" }} />, label: "Support" },
          ].map((item) => (
            <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 0.8, px: 1.5, py: 0.8, cursor: "pointer", borderRadius: "8px", "&:hover": { bgcolor: "#f5f5f5" } }}>
              {item.icon}
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#333" }}>{item.label}</Typography>
            </Box>
          ))}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, px: 1.5, py: 0.8, cursor: "pointer", borderRadius: "8px", "&:hover": { bgcolor: "#f5f5f5" } }}>
            <LuggageOutlinedIcon sx={{ fontSize: 20, color: "#555" }} />
            <Box>
              <Typography sx={{ fontSize: 10, color: GREEN, fontWeight: 600, lineHeight: 1, mb: 0.2 }}>Manage Booking</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#333", lineHeight: 1 }}>My Trips</Typography>
            </Box>
          </Box>
          <Button variant="outlined" startIcon={<PersonOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{ ml: 1, borderRadius: "8px", borderColor: GREEN, color: GREEN, fontWeight: 600, fontSize: 13, textTransform: "none", px: 2, py: 0.9, whiteSpace: "nowrap", "&:hover": { borderColor: "#15803d", bgcolor: "#f0fdf4" } }}>
            Login / Signup
          </Button>
        </Box>
      )}

      {isMobile && (
        <IconButton sx={{ color: "#333", ml: "auto" }}>
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );
};

// ─── CategoryTabs ─────────────────────────────
const CategoryTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ bgcolor: "#f0f4f8", py: { xs: 1.5, md: 2 }, px: 2, display: "flex", justifyContent: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 1.5 }, flexWrap: "wrap", justifyContent: "center" }}>
        {CATEGORIES.map((cat) => {
          const isActive = location.pathname === cat.path || location.pathname.startsWith(cat.path + "/");
          return (
            <Box key={cat.label} onClick={() => navigate(cat.path)}
              sx={{
                display: "flex", alignItems: "center", gap: { xs: 0.8, md: 1 },
                px: { xs: 1.8, md: 2.5 }, py: { xs: 0.8, md: 1.1 },
                borderRadius: "50px", cursor: "pointer",
                bgcolor: isActive ? "#ffffff" : "transparent",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.10)" : "none",
                transition: "all 0.18s",
                "&:hover": { bgcolor: isActive ? "#ffffff" : "rgba(255,255,255,0.6)" },
              }}>
              {cat.img && (
                <Box component="img" src={cat.img} alt={cat.label}
                  sx={{ width: { xs: 24, md: 30 }, height: { xs: 24, md: 30 }, objectFit: "contain" }}
                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
              )}
              <Typography sx={{ fontSize: { xs: 22, md: 26 }, lineHeight: 1, display: cat.img ? "none" : "block" }}>
                {cat.emoji}
              </Typography>
              <Typography sx={{ fontSize: { xs: 13, md: 15 }, fontWeight: isActive ? 700 : 500, color: isActive ? "#111827" : "#555", whiteSpace: "nowrap" }}>
                {cat.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// ─── FieldBox helper ──────────────────────────
const FieldBox = ({ legend, legendColor = "#6b6b6b", children, onClick, error, fieldRef, sx = {} }) => (
  <Box
    ref={fieldRef}
    onClick={onClick}
    sx={{
      position: "relative",
      border: `1px solid ${error ? "#dc2626" : "#c8c8c8"}`,
      borderRadius: "12px",
      height: 58,
      minHeight: 58,
      display: "flex",
      alignItems: "center",
      px: "14px",
      backgroundColor: error ? "#fff5f5" : "#fff",
      cursor: "pointer",
      transition: "border-color 0.15s",
      "&:hover": { borderColor: error ? "#dc2626" : "#2e7d32" },
      boxSizing: "border-box",
      ...sx,
    }}
  >
    <Box component="span" sx={{
      position: "absolute", top: -9, left: 10,
      fontSize: "0.72rem", color: error ? "#dc2626" : legendColor,
      backgroundColor: error ? "#fff5f5" : "#fff",
      px: 0.5, lineHeight: 1, fontFamily: "'Inter', sans-serif", fontWeight: 500,
    }}>
      {legend}
    </Box>
    {children}
  </Box>
);

// ─── FlightSearch (Main Component) ───────────
export default function FlightSearch({
  initialFrom = null,
  initialTo   = null,
  initialDate = null,
}) {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  // ── Hooks ──
  const { cities, loading: citiesLoading } = useFlightCities();
  const { searchFlights, loading: searchLoading } = useFlightSearch();

  // ── Trip type ──
  const [tripType, setTripType] = useState("oneway");

  // ── City state ──
  const [fromCity, setFromCity] = useState(initialFrom || { code: "BOM", name: "Mumbai, IN" });
  const [toCity,   setToCity]   = useState(initialTo   || { code: "DEL", name: "New Delhi, IN" });

  // ── City dropdown open state ──
  const [fromDropOpen, setFromDropOpen] = useState(false);
  const [toDropOpen,   setToDropOpen]   = useState(false);

  // ── Refs for city fields ──
  const fromFieldRef = useRef(null);
  const toFieldRef   = useRef(null);

  // ── Validation errors ──
  const [errors, setErrors] = useState({ from: "", to: "" });

  // ── Date state ──
  const [departureDate, setDepartureDate] = useState(() => {
    if (initialDate) { const d = new Date(initialDate); d.setHours(0,0,0,0); return d; }
    const d = new Date(); d.setHours(0,0,0,0); return d;
  });
  const [returnDate, setReturnDate] = useState(null);

  // ── Dropdown open state ──
  const [depPickerOpen, setDepPickerOpen] = useState(false);
  const [retPickerOpen, setRetPickerOpen] = useState(false);
  const [paxDropOpen,   setPaxDropOpen]   = useState(false);

  // ── Refs ──
  const depDateRef = useRef(null);
  const retDateRef = useRef(null);
  const paxRef     = useRef(null);

  // ── Passengers & class ──
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass]  = useState("Economy");

  // ── Scroll listener ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const passengerLabel = () => {
    const parts = [];
    if (passengers.adults)   parts.push(`${passengers.adults} Adult${passengers.adults > 1 ? "s" : ""}`);
    if (passengers.children) parts.push(`${passengers.children} Child${passengers.children > 1 ? "ren" : ""}`);
    if (passengers.infants)  parts.push(`${passengers.infants} Infant${passengers.infants > 1 ? "s" : ""}`);
    return `${parts.join(", ")} · ${cabinClass}`;
  };

  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const handleRoundTripToggle = (type) => {
    setTripType(type);
    if (type === "oneway") setReturnDate(null);
    if (type === "roundtrip" && !returnDate) {
      const next = new Date(departureDate);
      next.setDate(next.getDate() + 1);
      setReturnDate(next);
    }
  };

  // Close all dropdowns helper
  const closeAll = () => {
    setFromDropOpen(false);
    setToDropOpen(false);
    setDepPickerOpen(false);
    setRetPickerOpen(false);
    setPaxDropOpen(false);
  };

  const handleSearch = async () => {
    const newErrors = { from: "", to: "" };
    let hasError = false;
    if (!fromCity?.code) { newErrors.from = "Please select departure city"; hasError = true; }
    if (!toCity?.code)   { newErrors.to   = "Please select destination city"; hasError = true; }
    setErrors(newErrors);
    if (hasError) return;

    // Call search API
    const result = await searchFlights({
      fromCity,
      toCity,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
      tripType,
    });

    // Navigate to listing page with results + search params
    navigate("/flights/listing", {
      state: {
        searchResult: result,
        fromCity,
        toCity,
        departureDate: departureDate.toISOString(),
        returnDate: returnDate?.toISOString() ?? null,
        passengers,
        cabinClass,
        tripType,
      },
    });
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <>
        <StickyRightBar visible={scrolled} />
        <CategoryTabs />

        <Box sx={{ backgroundColor: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Paper elevation={0} sx={{
            width: "100%", maxWidth: 1280,
            borderRadius: { xs: 3, sm: 4 },
            border: "1px solid #e8e8e8",
            px: { xs: 2, sm: 3, md: 3 },
            py: { xs: 2.5, sm: 3 },
            position: "relative",
            backgroundColor: "#fff",
            fontFamily: "'Inter', sans-serif",
          }}>

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: { xs: 1.5, sm: 2 } }}>
              <Box>
                <Typography variant="h5" fontWeight={700} fontSize={{ xs: "1.25rem", sm: "1.5rem" }} color="#1a1a1a" lineHeight={1.2} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Flight Booking
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize={{ xs: "0.78rem", sm: "0.875rem" }} mt={0.4} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Book International and Domestic Flights
                </Typography>
              </Box>
              <Link href="#" underline="none"
                sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 0.6, color: "#555", fontSize: "0.85rem", mt: 0.5, "&:hover": { color: "#2e7d32" }, fontFamily: "'Inter', sans-serif" }}>
                <UserIcon /> Need some help?
              </Link>
            </Box>

            {/* Trip type radios */}
            <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 2.5 } }}>
              {[
                { val: "oneway",    label: "Oneway"     },
                { val: "roundtrip", label: "Round Trip" },
              ].map(({ val, label }) => (
                <Box key={val} onClick={() => handleRoundTripToggle(val)}
                  sx={{ display: "flex", alignItems: "center", gap: 0.8, cursor: "pointer" }}>
                  {tripType === val
                    ? <RadioButtonCheckedIcon  sx={{ fontSize: 20, color: GREEN }} />
                    : <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
                  }
                  <Typography sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" }, fontWeight: tripType === val ? 600 : 500, color: tripType === val ? "#111827" : "#6b7280", fontFamily: "'Inter', sans-serif", userSelect: "none" }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Search row */}
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              gap: { xs: 1.5, md: 1 },
            }}>

              {/* FROM + SWAP + TO */}
              <Box sx={{
                display: "flex",
                flex: { md: "1 1 auto" },
                alignItems: "center",
                position: "relative",
                gap: 0,
                mt: "-6px",
              }}>
                {/* FROM fieldset */}
                <Box
                  component="fieldset"
                  ref={fromFieldRef}
                  onClick={() => { closeAll(); setFromDropOpen(true); }}
                  sx={{
                    flex: 1,
                    border: `1px solid ${errors.from ? "#dc2626" : "#c8c8c8"}`,
                    borderRadius: "12px",
                    m: 0, pl: "14px", pr: "30px",
                    height: 58, minHeight: 58,
                    boxSizing: "border-box",
                    display: "flex", alignItems: "center",
                    backgroundColor: errors.from ? "#fff5f5" : "#fff",
                    minWidth: 0, mr: "8px", lineHeight: 1,
                    cursor: "pointer",
                    "&:hover": { borderColor: errors.from ? "#dc2626" : "#2e7d32" },
                    transition: "border-color 0.15s",
                  }}
                >
                  <legend style={{
                    fontSize: "0.72rem", color: errors.from ? "#dc2626" : "#6b6b6b",
                    padding: "0 3px", lineHeight: 1, marginLeft: "30px",
                    fontFamily: "'Inter', sans-serif",
                  }}>From</legend>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", marginLeft: "18px" }}>
                    <FlightTakeoffIcon />
                    <Typography sx={{
                      fontSize: "0.95rem", fontWeight: 600,
                      color: fromCity ? "#111827" : "#9ca3af",
                      flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      userSelect: "none", fontFamily: "'Inter', sans-serif",
                    }}>
                      {fromCity ? `${fromCity.code} - ${fromCity.name}` : "Leaving From"}
                    </Typography>
                  </Box>
                  {errors.from && (
                    <Typography sx={{ fontSize: "0.68rem", color: "#dc2626", position: "absolute", bottom: -18, left: 4, whiteSpace: "nowrap" }}>
                      ⚠ {errors.from}
                    </Typography>
                  )}
                </Box>

                {/* Swap button */}
                <Box sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 5, flexShrink: 0 }}>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleSwap(); }}
                    sx={{
                      border: "1px solid #d4d4d4", backgroundColor: "#fff",
                      width: 40, height: 40, borderRadius: "50%", boxShadow: "0 0 0 3px #fff",
                      "&:hover": { backgroundColor: "#f1f8f1", borderColor: "#2e7d32" },
                      transition: "all 0.2s",
                    }}>
                    <SwapIcon />
                  </IconButton>
                </Box>

                {/* TO fieldset */}
                <Box
                  component="fieldset"
                  ref={toFieldRef}
                  onClick={() => { closeAll(); setToDropOpen(true); }}
                  sx={{
                    flex: 1,
                    border: `1px solid ${errors.to ? "#dc2626" : "#c8c8c8"}`,
                    borderRadius: "12px",
                    m: 0, pl: "30px", pr: "14px",
                    height: 58, minHeight: 58,
                    boxSizing: "border-box",
                    display: "flex", alignItems: "center",
                    backgroundColor: errors.to ? "#fff5f5" : "#fff",
                    minWidth: 0, lineHeight: 1,
                    cursor: "pointer",
                    "&:hover": { borderColor: errors.to ? "#dc2626" : "#2e7d32" },
                    transition: "border-color 0.15s",
                  }}
                >
                  <legend style={{
                    fontSize: "0.72rem", color: errors.to ? "#dc2626" : "#6b6b6b",
                    padding: "0 3px", lineHeight: 1, marginLeft: "44px",
                    fontFamily: "'Inter', sans-serif",
                  }}>To</legend>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", marginLeft: "24px" }}>
                    <FlightLandIcon />
                    <Typography sx={{
                      fontSize: "0.95rem", fontWeight: 600,
                      color: toCity ? "#111827" : "#9ca3af",
                      flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      userSelect: "none", fontFamily: "'Inter', sans-serif",
                    }}>
                      {toCity ? `${toCity.code} - ${toCity.name}` : "Going To"}
                    </Typography>
                  </Box>
                  {errors.to && (
                    <Typography sx={{ fontSize: "0.68rem", color: "#dc2626", position: "absolute", bottom: -18, whiteSpace: "nowrap" }}>
                      ⚠ {errors.to}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Date + Pax row */}
              <Box sx={{
                display: "flex",
                flex: { md: "0 0 auto" },
                alignItems: "center",
                gap: 1.5,
                flexDirection: { xs: "column", sm: "row" },
              }}>
                {/* Departure date */}
                <FieldBox
                  legend="Departure"
                  fieldRef={depDateRef}
                  onClick={() => { closeAll(); setDepPickerOpen((o) => !o); }}
                  sx={{ width: { xs: "100%", sm: 150, md: 150 }, cursor: "pointer" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon />
                    <Box>
                      <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1, mb: 0.3, fontFamily: "'Inter', sans-serif" }}>Departure</Typography>
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.2, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
                        {formatDisplayDate(departureDate)}
                      </Typography>
                    </Box>
                  </Box>
                </FieldBox>

                {/* Return date */}
                <FieldBox
                  legend="Return"
                  fieldRef={retDateRef}
                  onClick={() => {
                    if (tripType === "oneway") { handleRoundTripToggle("roundtrip"); closeAll(); setRetPickerOpen(true); return; }
                    closeAll(); setRetPickerOpen((o) => !o);
                  }}
                  sx={{ width: { xs: "100%", sm: 150, md: 150 }, cursor: "pointer", bgcolor: tripType === "oneway" ? "#fafafa" : "#fff" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon />
                    <Box>
                      <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1, mb: 0.3, fontFamily: "'Inter', sans-serif" }}>Return</Typography>
                      {returnDate ? (
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.2, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
                          {formatDisplayDate(returnDate)}
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af", lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>Add date</Typography>
                      )}
                    </Box>
                  </Box>
                </FieldBox>

                {/* Travellers & Class */}
                <FieldBox
                  legend="Travellers & Class"
                  fieldRef={paxRef}
                  onClick={() => { closeAll(); setPaxDropOpen((o) => !o); }}
                  sx={{ width: { xs: "100%", sm: 175, md: 180 }, cursor: "pointer" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                    <PassengerIcon />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1, mb: 0.3, fontFamily: "'Inter', sans-serif" }}>Travellers & Class</Typography>
                      <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>
                        {passengerLabel()}
                      </Typography>
                    </Box>
                    <ChevronDownIcon />
                  </Box>
                </FieldBox>
              </Box>

              {/* Search Button */}
              <Button
                variant="contained"
                disableElevation
                onClick={handleSearch}
                disabled={searchLoading}
                startIcon={searchLoading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : null}
                sx={{
                  backgroundColor: "#2e7d32", color: "#fff",
                  fontWeight: 700, fontSize: { xs: "1rem", sm: "1.05rem" },
                  borderRadius: 2.5, px: { xs: 3, sm: 4 }, py: { xs: 1.5, sm: "13px" },
                  minWidth: { xs: "100%", md: 120 }, height: { sm: 50 },
                  flexShrink: 0, letterSpacing: 0.3,
                  "&:hover": { backgroundColor: "#1b5e20" },
                  transition: "background 0.2s", textTransform: "none",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {searchLoading ? "Searching..." : "Search"}
              </Button>
            </Box>

            {/* Help link mobile */}
            <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "center", mt: 2 }}>
              <Link href="#" underline="none"
                sx={{ display: "flex", alignItems: "center", gap: 0.6, color: "#555", fontSize: "0.82rem", "&:hover": { color: "#2e7d32" }, fontFamily: "'Inter', sans-serif" }}>
                <UserIcon /> Need some help?
              </Link>
            </Box>
          </Paper>
        </Box>

        {/* ── City Dropdowns ── */}
        <CitySearchDropdown
          anchorEl={fromFieldRef.current}
          open={fromDropOpen}
          onClose={() => setFromDropOpen(false)}
          onSelect={(city) => { setFromCity(city); setErrors((e) => ({ ...e, from: "" })); }}
          cities={cities}
          loading={citiesLoading}
          placeholder="Search departure city..."
        />

        <CitySearchDropdown
          anchorEl={toFieldRef.current}
          open={toDropOpen}
          onClose={() => setToDropOpen(false)}
          onSelect={(city) => { setToCity(city); setErrors((e) => ({ ...e, to: "" })); }}
          cities={cities}
          loading={citiesLoading}
          placeholder="Search destination city..."
        />

        {/* ── Date Pickers ── */}
        <FlightDatePicker
          anchorEl={depDateRef.current}
          open={depPickerOpen}
          onClose={() => setDepPickerOpen(false)}
          selectedDate={departureDate}
          onChange={(date) => {
            setDepartureDate(date);
            if (returnDate && date >= returnDate) {
              const next = new Date(date);
              next.setDate(next.getDate() + 1);
              setReturnDate(next);
            }
          }}
        />

        <FlightDatePicker
          anchorEl={retDateRef.current}
          open={retPickerOpen}
          onClose={() => setRetPickerOpen(false)}
          selectedDate={returnDate}
          onChange={(date) => setReturnDate(date)}
          minDate={departureDate}
        />

        {/* ── Passenger & Class Dropdown ── */}
        <PassengerClassDropdown
          anchorEl={paxRef.current}
          open={paxDropOpen}
          onClose={() => setPaxDropOpen(false)}
          passengers={passengers}
          setPassengers={setPassengers}
          cabinClass={cabinClass}
          setCabinClass={setCabinClass}
        />
      </>
    </ThemeProvider>
  );
}