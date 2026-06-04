import { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useBusSearch } from "../../hooks/buseshooks/useBusSearch";
import { useBusCitySearch } from "../../hooks/buseshooks/useBusCitySearch";

// ─── MUI Theme ────────────────────────────────
const muiTheme = createTheme({
  palette: {
    primary: { main: "#2e7d32" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#fff",
          "& fieldset": { borderColor: "#d0d0d0" },
          "&:hover fieldset": { borderColor: "#2e7d32" },
          "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
        },
      },
    },
  },
});

// ─── Constants ────────────────────────────────
const GREEN = "#16a34a";

const CATEGORIES = [
  {
    label: "Flights",
    img: "/navbaricons/flightslogo.svg",
    path: "/flights",
    emoji: "✈️",
  },
  {
    label: "Hotels",
    img: "/navbaricons/hotelslogo.svg",
    path: "/hotels",
    emoji: "🏨",
  },
  {
    label: "Buses",
    img: "/navbaricons/buseslogo.svg",
    path: "/buses",
    emoji: "🚌",
  },
  {
    label: "Trains",
    img: "/navbaricons/trainslogo.svg",
    path: "/trains",
    emoji: "🚆",
  },
];

// ─── SVG Icons ────────────────────────────────
const LocationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9e9e9e"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="3" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="21" />
    <line x1="3" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="21" y2="12" />
  </svg>
);

const PinIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9e9e9e"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s-8-6.686-8-12a8 8 0 1 1 16 0c0 5.314-8 12-8 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const SwapIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2e7d32"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 16V4m0 0L3 8m4-4l4 4" />
    <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9e9e9e"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="#2e7d32"
    stroke="#2e7d32"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Date Helpers ─────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateChips(centerDate) {
  const result = [];
  for (let i = -1; i <= 1; i++) {
    const d = new Date(centerDate);
    d.setDate(d.getDate() + i);
    result.push({ dayLabel: DAYS[d.getDay()], date: d, offset: i });
  }
  return result;
}

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ─── BusCityDropdown ──────────────────────────
const BusCityDropdown = ({ open, onClose, anchorEl, onSelect, label }) => {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const { query, setQuery, cities, loading } = useBusCitySearch(open);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      setPosition({
        top: rect.bottom + scrollY + 8,
        left: rect.left + scrollX,
      });
    }
  }, [open, anchorEl]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorEl &&
        !anchorEl.contains(e.target)
      )
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorEl]);

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 9999,
        width: 320,
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid #f0f0f0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        overflow: "hidden",
      }}
    >
      {/* Search Input */}
      <div style={{ padding: "14px 14px 10px" }}>
        <div style={{ position: "relative" }}>
          <svg
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={`Search ${label}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              outline: "none",
              fontSize: 14,
              color: "#111827",
              boxSizing: "border-box",
              background: "#fafafa",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>
      </div>

      {/* Section Label */}
      <div
        style={{
          padding: "8px 16px 6px",
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
        }}
      >
        {query ? "Search Results" : "Popular Cities"}
      </div>

      {/* City List */}
      <div style={{ paddingBottom: 8, maxHeight: 280, overflowY: "auto" }}>
        {loading ? (
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            Searching...
          </div>
        ) : cities.length > 0 ? (
          cities.map((city, idx) => (
            <div key={city.CityId}>
              <div
                onClick={() => {
                  onSelect({ id: city.CityId, name: city.CityName });
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 16px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}
                >
                  {city.CityName}
                </span>
              </div>
              {idx < cities.length - 1 && (
                <div
                  style={{ height: 1, background: "#f3f4f6", margin: "0 16px" }}
                />
              )}
            </div>
          ))
        ) : (
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            No city found
          </div>
        )}
      </div>
    </div>
  );
};

// ─── BusDatePicker ────────────────────────────
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}
function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const BusDatePicker = ({ anchorEl, open, onClose, selectedDate, onChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      setPos({ top: rect.bottom + scrollY + 8, left: rect.left + scrollX });
      // Reset to selected date's month or today
      const base = selectedDate || today;
      setViewMonth({ year: base.getFullYear(), month: base.getMonth() });
    }
  }, [open, anchorEl]);

  // Outside click to close
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      const popup = document.getElementById("bus-drp-popup");
      if (
        anchorEl &&
        !anchorEl.contains(e.target) &&
        popup &&
        !popup.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose, anchorEl]);

  const canGoPrev =
    viewMonth.year > today.getFullYear() ||
    (viewMonth.year === today.getFullYear() &&
      viewMonth.month > today.getMonth());

  const goPrev = () => {
    if (!canGoPrev) return;
    setViewMonth((prev) => {
      let m = prev.month - 1;
      let y = prev.year;
      if (m < 0) {
        m = 11;
        y--;
      }
      if (
        y < today.getFullYear() ||
        (y === today.getFullYear() && m < today.getMonth())
      ) {
        return { year: today.getFullYear(), month: today.getMonth() };
      }
      return { year: y, month: m };
    });
  };

  const goNext = () => {
    setViewMonth((prev) => {
      let m = prev.month + 1;
      let y = prev.year;
      if (m > 11) {
        m = 0;
        y++;
      }
      return { year: y, month: m };
    });
  };

  if (!open) return null;

  const { year, month } = viewMonth;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <Paper
      id="bus-drp-popup"
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
      }}
    >
      {/* Month header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <IconButton
          onClick={goPrev}
          disabled={!canGoPrev}
          size="small"
          sx={{
            width: 28,
            height: 28,
            color: canGoPrev ? "#6b7280" : "#d1d5db",
            "&:hover": canGoPrev ? { bgcolor: "#f9fafb", color: "#111" } : {},
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Typography
          sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}
        >
          {MONTH_NAMES[month]} {year}
        </Typography>

        <IconButton
          onClick={goNext}
          size="small"
          sx={{
            width: 28,
            height: 28,
            color: "#6b7280",
            "&:hover": { bgcolor: "#f9fafb", color: "#111" },
          }}
        >
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Day labels */}
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}
      >
        {DAY_LABELS.map((d) => (
          <Typography
            key={d}
            sx={{
              textAlign: "center",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#9ca3af",
              py: 0.5,
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* Day cells */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {cells.map((date, idx) => {
          if (!date) return <Box key={`empty-${idx}`} />;
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isPast = date < today && !isToday;

          return (
            <Box
              key={date.toISOString()}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                onClick={() => {
                  if (!isPast) {
                    onChange(date);
                    onClose();
                  }
                }}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isPast ? "default" : "pointer",
                  bgcolor: isSelected ? GREEN : "transparent",
                  my: 0.3,
                  transition: "background 0.12s, transform 0.1s",
                  "&:hover": !isPast
                    ? {
                        bgcolor: isSelected ? GREEN : "#f0fdf4",
                        transform: "scale(1.08)",
                      }
                    : {},
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: isSelected || isToday ? 700 : 400,
                    color: isSelected
                      ? "#fff"
                      : isPast
                        ? "#d1d5db"
                        : isToday
                          ? GREEN
                          : "#111827",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {date.getDate()}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Select date of journey"}
        </Typography>
      </Box>
    </Paper>
  );
};

// ─── StickyRightBar ───────────────────────────
const StickyRightBar = ({ visible }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e8e8e8",
        px: { xs: 2, md: 4 },
        display: "flex",
        alignItems: "center",
        gap: 2,
        minHeight: "64px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        transition:
          "transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/navbaricons/dealplexlogo.svg"
        alt="Dealplex"
        sx={{ height: 38, objectFit: "contain", flexShrink: 0, mr: 1 }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />

      {/* Category tabs — desktop only */}
      {!isMobile && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {CATEGORIES.map((cat) => {
            const isActive =
              location.pathname === cat.path ||
              location.pathname.startsWith(cat.path + "/");
            return (
              <Box
                key={cat.label}
                onClick={() => navigate(cat.path)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  px: 2.5,
                  py: 1,
                  cursor: "pointer",
                  borderRadius: "10px",
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <Box
                  component="img"
                  src={cat.img}
                  alt={cat.label}
                  sx={{ width: 28, height: 28, objectFit: "contain", mb: 0.4 }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <Typography
                  sx={{ fontSize: 20, lineHeight: 1, display: "none" }}
                >
                  {cat.emoji}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? GREEN : "#444",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Right actions — desktop only */}
      {!isMobile && (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}
        >
          {[
            {
              icon: (
                <LocalOfferOutlinedIcon sx={{ fontSize: 20, color: "#555" }} />
              ),
              label: "Offers",
            },
            {
              icon: (
                <HeadsetMicOutlinedIcon sx={{ fontSize: 20, color: "#555" }} />
              ),
              label: "Support",
            },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                px: 1.5,
                py: 0.8,
                cursor: "pointer",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              {item.icon}
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#333" }}>
                {item.label}
              </Typography>
            </Box>
          ))}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.5,
              py: 0.8,
              cursor: "pointer",
              borderRadius: "8px",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <LuggageOutlinedIcon sx={{ fontSize: 20, color: "#555" }} />
            <Box>
              <Typography
                sx={{
                  fontSize: 10,
                  color: GREEN,
                  fontWeight: 600,
                  lineHeight: 1,
                  mb: 0.2,
                }}
              >
                Manage Booking
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#333",
                  lineHeight: 1,
                }}
              >
                My Trips
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            startIcon={<PersonOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              ml: 1,
              borderRadius: "8px",
              borderColor: GREEN,
              color: GREEN,
              fontWeight: 600,
              fontSize: 13,
              textTransform: "none",
              px: 2,
              py: 0.9,
              whiteSpace: "nowrap",
              "&:hover": { borderColor: "#15803d", bgcolor: "#f0fdf4" },
            }}
          >
            Login / Signup
          </Button>
        </Box>
      )}

      {/* Hamburger — mobile only */}
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
    <Box
      sx={{
        bgcolor: "#f0f4f8",
        py: { xs: 1.5, md: 2 },
        px: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, md: 1.5 },
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive =
            location.pathname === cat.path ||
            location.pathname.startsWith(cat.path + "/");
          return (
            <Box
              key={cat.label}
              onClick={() => navigate(cat.path)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.8, md: 1 },
                px: { xs: 1.8, md: 2.5 },
                py: { xs: 0.8, md: 1.1 },
                borderRadius: "50px",
                cursor: "pointer",
                bgcolor: isActive ? "#ffffff" : "transparent",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.10)" : "none",
                transition: "all 0.18s",
                "&:hover": {
                  bgcolor: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                },
              }}
            >
              {cat.img && (
                <Box
                  component="img"
                  src={cat.img}
                  alt={cat.label}
                  sx={{
                    width: { xs: 24, md: 30 },
                    height: { xs: 24, md: 30 },
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              )}
              <Typography
                sx={{
                  fontSize: { xs: 22, md: 26 },
                  lineHeight: 1,
                  display: cat.img ? "none" : "block",
                }}
              >
                {cat.emoji}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 13, md: 15 },
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#111827" : "#555",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// ─── BusSearch (Main Component) ───────────────
export default function BusSearch() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  // ── City state ──
  const [fromCity, setFromCity] = useState(null); // { id, name }
  const [toCity, setToCity] = useState(null); // { id, name }
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);

  // ── Validation errors ──
  const [errors, setErrors] = useState({ from: "", to: "" });

  // ── Date state ──
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateFieldRef = useRef(null);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // ── Bus search hook ──
  const { search: searchBuses, loading: busLoading } = useBusSearch();

  // ── Scroll listener for StickyRightBar ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dateChips = getDateChips(selectedDate);

  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };
  // BusSearch.jsx mein sirf handleSearch function replace karo

  const transformBus = (bus, fromCityName, toCityName, traceId) => {
    // ← traceId parameter
    const dep = new Date(bus.departure_time);
    const arr = new Date(bus.arrival_time);
    const durationMs = arr - dep;
    const hrs = Math.floor(Math.abs(durationMs) / 3600000);
    const mins = Math.floor((Math.abs(durationMs) % 3600000) / 60000);

    return {
      id: bus.result_index,
      traceId: traceId, // ← search API se aaya
      resultIndex: bus.result_index, // ← bus ka apna index
      operatorName: bus.operator,
      busType: bus.bus_type,
      departureTime: dep.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      departureDate: dep.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      arrivalTime: arr.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      arrivalDate: arr.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      from: fromCityName || "",
      to: toCityName || "",
      duration: `${hrs}h ${mins}m`,
      price: Math.round(bus.price),
      seatsAvailable: bus.available_seats,
      priceTiers: [],
      footerTags: ["Boarding & Dropping points", "Cancellation Policy"],
      // ← bus.raw se boarding/dropping points
      boardingPoints: (bus.raw?.BoardingPointsDetails || []).map((p) => ({
        name: p.CityPointName,
        subLabel: p.CityPointLocation,
        time: new Date(p.CityPointTime).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      })),
      droppingPoints: (bus.raw?.DroppingPointsDetails || []).map((p) => ({
        name: p.CityPointName,
        subLabel: p.CityPointLocation,
        time: new Date(p.CityPointTime).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      })),
      seatLayout: [],
    };
  };

  const handleSearch = async () => {
    const newErrors = { from: "", to: "" };
    let hasError = false;
    if (!fromCity) {
      newErrors.from = "Please select departure city";
      hasError = true;
    }
    if (!toCity) {
      newErrors.to = "Please select destination city";
      hasError = true;
    }
    setErrors(newErrors);
    if (hasError) return;

    try {
      const data = await searchBuses({
        sourceId: fromCity.id,
        destinationId: toCity.id,
        date: selectedDate,
      });

      const resultsData = data?.data?.results;
      const traceId = resultsData?.trace_id; // ← top level trace_id
      const rawBuses = resultsData?.results ?? [];

      console.log("[handleSearch] traceId:", traceId);
      console.log("[handleSearch] rawBuses[0]:", rawBuses[0]);

      const transformedBuses = rawBuses.map((bus) =>
        transformBus(bus, fromCity.name, toCity.name, traceId),
      );

      navigate("/buses/results", {
        state: {
          buses: transformedBuses,
          fromCity,
          toCity,
          date: selectedDate.toISOString(),
        },
      });
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <>
        {/* ── StickyRightBar ── */}
        <StickyRightBar visible={scrolled} />

        {/* ── CategoryTabs ── */}
        <CategoryTabs />

        {/* ── Main Content ── */}
        <Box
          sx={{
            backgroundColor: "#f0f2f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 1100,
              borderRadius: { xs: 3, sm: 4 },
              border: "1px solid #e8e8e8",
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2.5, sm: 3 },
              position: "relative",
              backgroundColor: "#fff",
            }}
          >
            {/* ── Header ── */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: { xs: 2, sm: 2.5 },
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  fontSize={{ xs: "1.25rem", sm: "1.5rem" }}
                  color="#1a1a1a"
                  lineHeight={1.2}
                >
                  Search buses
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={{ xs: "0.78rem", sm: "0.875rem" }}
                  mt={0.4}
                >
                  Enjoy hassle free bookings with Dealplex
                </Typography>
              </Box>

              {/* Help link — desktop */}
              <Link
                href="#"
                underline="none"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 0.6,
                  color: "#555",
                  fontSize: "0.85rem",
                  mt: 0.5,
                  "&:hover": { color: "#2e7d32" },
                }}
              >
                <UserIcon />
                Need some help?
              </Link>
            </Box>

            {/* ── Search Row ── */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                gap: { xs: 1.5, md: 2 },
                "& fieldset": { padding: 0 },
              }}
            >
              {/* FROM + SWAP + TO */}
              <Box
                sx={{
                  display: "flex",
                  flex: { md: "1 1 auto" },
                  alignItems: "center",
                  position: "relative",
                  gap: 0,
                }}
              >
                {/* FROM fieldset */}
                <Box
                  ref={fromRef}
                  component="fieldset"
                  onClick={() => {
                    setFromOpen((o) => !o);
                    setToOpen(false);
                  }}
                  sx={{
                    flex: 1,
                    border: `1px solid ${errors.from ? "#dc2626" : "#c8c8c8"}`,
                    borderRadius: "12px",
                    m: 0,
                    pl: "14px",
                    pr: "30px",
                    height: 50,
                    minHeight: 50,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: errors.from ? "#fff5f5" : "#fff",
                    minWidth: 0,
                    mr: "8px",
                    lineHeight: 1,
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: errors.from ? "#dc2626" : "#2e7d32",
                    },
                    transition: "border-color 0.15s",
                  }}
                >
                  <legend
                    style={{
                      fontSize: "0.72rem",
                      color: errors.from ? "#dc2626" : "#6b6b6b",
                      padding: "0 3px",
                      lineHeight: 1,
                      marginLeft: "30px",
                    }}
                  >
                    From
                  </legend>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <LocationIcon />
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        color: fromCity ? "#111827" : "#9ca3af",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                      }}
                    >
                      {fromCity ? fromCity.name : "Leaving From"}
                    </Typography>
                  </Box>
                  {errors.from && (
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        color: "#dc2626",
                        position: "absolute",
                        bottom: -18,
                        left: 4,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⚠ {errors.from}
                    </Typography>
                  )}
                </Box>

                {/* Swap button */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                    flexShrink: 0,
                  }}
                >
                  <IconButton
                    onClick={handleSwap}
                    sx={{
                      border: "1px solid #d4d4d4",
                      backgroundColor: "#fff",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      boxShadow: "0 0 0 3px #fff",
                      "&:hover": {
                        backgroundColor: "#f1f8f1",
                        borderColor: "#2e7d32",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <SwapIcon />
                  </IconButton>
                </Box>

                {/* TO fieldset */}
                <Box
                  ref={toRef}
                  component="fieldset"
                  onClick={() => {
                    setToOpen((o) => !o);
                    setFromOpen(false);
                  }}
                  sx={{
                    flex: 1,
                    border: `1px solid ${errors.to ? "#dc2626" : "#c8c8c8"}`,
                    borderRadius: "12px",
                    m: 0,
                    pl: "30px",
                    pr: "14px",
                    height: 50,
                    minHeight: 50,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: errors.to ? "#fff5f5" : "#fff",
                    minWidth: 0,
                    lineHeight: 1,
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: errors.to ? "#dc2626" : "#2e7d32",
                    },
                    transition: "border-color 0.15s",
                  }}
                >
                  <legend
                    style={{
                      fontSize: "0.72rem",
                      color: errors.to ? "#dc2626" : "#6b6b6b",
                      padding: "0 3px",
                      lineHeight: 1,
                      marginLeft: "44px",
                    }}
                  >
                    To
                  </legend>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <PinIcon />
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        color: toCity ? "#111827" : "#9ca3af",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        // whiteSpace: "nowrap",
                        userSelect: "none",
                      }}
                    >
                      {toCity ? toCity.name : "Going To"}
                    </Typography>
                  </Box>
                  {errors.to && (
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        color: "#dc2626",
                        position: "absolute",
                        bottom: -18,
                        // left: 4,
                        // whiteSpace: "nowrap",
                      }}
                    >
                      ⚠ {errors.to}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Date + chips group */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: { xs: 1, sm: 1.5 },
                  flex: { md: "0 0 auto" },
                  height: { sm: 50 },
                }}
              >
                {/* Date field */}
                <Box
                  ref={dateFieldRef}
                  onClick={() => setDatePickerOpen((o) => !o)}
                  sx={{
                    position: "relative",
                    border: "1px solid #c8c8c8",
                    borderRadius: "12px",
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    gap: 1,
                    backgroundColor: "#fff",
                    width: { xs: "100%", sm: 180 },
                    cursor: "pointer",
                    "&:hover": { borderColor: "#2e7d32" },
                    transition: "border-color 0.15s",
                  }}
                >
                  <Box
                    component="legend"
                    sx={{
                      position: "absolute",
                      top: -9,
                      left: 10,
                      fontSize: "0.72rem",
                      color: "#6b6b6b",
                      backgroundColor: "#fff",
                      px: 0.5,
                      lineHeight: 1,
                    }}
                  >
                    Date of Journey
                  </Box>
                  <CalendarIcon />
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#1a1a1a",
                      fontFamily: "inherit",
                    }}
                  >
                    {formatDate(selectedDate)}
                  </Typography>
                </Box>

                {/* Date chips */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {dateChips.map(({ dayLabel, date, offset }) => {
                    const isSelected = offset === 0;
                    const isPastChip = date < todayDate;
                    return (
                      <Box
                        key={offset}
                        onClick={() => {
                          if (isPastChip) return;
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() + offset);
                          setSelectedDate(newDate);
                        }}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: { xs: 50, sm: 54 },
                          height: { xs: 44, sm: 48 },
                          borderRadius: 2,
                          border: isSelected
                            ? "1.5px solid #bdbdbd"
                            : "1px solid #e8e8e8",
                          backgroundColor: isSelected ? "#f5f5f5" : "#fff",
                          cursor: isPastChip ? "default" : "pointer",
                          opacity: isPastChip ? 0.4 : 1,
                          transition: "all 0.15s",
                          "&:hover": !isPastChip
                            ? {
                                borderColor: "#2e7d32",
                                backgroundColor: "#f1f8f1",
                              }
                            : {},
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          fontSize="0.9rem"
                          fontWeight={700}
                          color="#1a1a1a"
                          lineHeight={1.2}
                        >
                          {String(date.getDate()).padStart(2, "0")}
                        </Typography>
                        <Typography
                          fontSize="0.7rem"
                          color="text.secondary"
                          lineHeight={1.2}
                        >
                          {dayLabel}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Search Button */}
              <Button
                variant="contained"
                disableElevation
                onClick={handleSearch}
                sx={{
                  backgroundColor: "#2e7d32",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.05rem" },
                  borderRadius: 2.5,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: "13px" },
                  minWidth: { xs: "100%", md: 120 },
                  height: { sm: 50 },
                  flexShrink: 0,
                  letterSpacing: 0.3,
                  "&:hover": { backgroundColor: "#1b5e20" },
                  transition: "background 0.2s",
                  textTransform: "none",
                }}
              >
                {busLoading ? "Searching..." : "Search"}
              </Button>
            </Box>

            {/* Help link — mobile */}
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Link
                href="#"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                  color: "#555",
                  fontSize: "0.82rem",
                  "&:hover": { color: "#2e7d32" },
                }}
              >
                <UserIcon />
                Need some help?
              </Link>
            </Box>
          </Paper>
        </Box>

        {/* ── BusDatePicker ── */}
        {/* ── BusDatePicker ── */}
        <BusDatePicker
          anchorEl={dateFieldRef.current}
          open={datePickerOpen}
          onClose={() => setDatePickerOpen(false)}
          selectedDate={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
          }}
        />

        {/* ── From City Dropdown ── */}
        <BusCityDropdown
          open={fromOpen}
          onClose={() => setFromOpen(false)}
          anchorEl={fromRef.current}
          onSelect={(city) => {
            setFromCity(city);
            setErrors((e) => ({ ...e, from: "" }));
          }}
          label="departure city"
        />

        {/* ── To City Dropdown ── */}
        <BusCityDropdown
          open={toOpen}
          onClose={() => setToOpen(false)}
          anchorEl={toRef.current}
          onSelect={(city) => {
            setToCity(city);
            setErrors((e) => ({ ...e, to: "" }));
          }}
          label="destination city"
        />
      </>
    </ThemeProvider>
  );
}
