import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import BestDealHotels from "../../src/components/hotel/BestDealHotels";
import DateRangePicker from "../../src/components/hotel/DateRangePicker";
import LocationDropdown from "../../src/components/hotel/LocationDropdown";
import RoomsGuestDropdown from "../../src/components/hotel/Roomsguestselector";
import { useHotelSearch } from "../../src/hooks/hotelhooks/useHotelSearch";
import HotelDetailsPage from "../../src/components/hotel/HotelDetailsPage";
import NoRoomsAvailable from "../../src/components/hotel/NoRoomsAvailable";
import HotelCheckoutPage from "../../src/components/hotel/HotelCheckoutPage";
import BookingSuccessPage from "../../src/components/hotel/BookingSuccessPage";
import PopularDestinations from "../../src/components/hotel/PopularDestination";
import HotelSEOContent from "../../src/components/hotel/HotelContent";

const GREEN = "#16a34a";
const BORDER = "#e5e7eb";

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

function formatDate(date) {
  if (!date) return null;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── Placeholder dates ────────────────────────
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const PLACEHOLDER_CHECKIN = formatDate(today);
const PLACEHOLDER_CHECKOUT = formatDate(tomorrow);

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
      <Box
        component="img"
        src="/navbaricons/dealplexlogo.svg"
        alt="Dealplex"
        sx={{ height: 38, objectFit: "contain", flexShrink: 0, mr: 1 }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
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
            Login / Signuppp
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

// ─── renderFields ─────────────────────────────
function renderFields(
  FIELDS,
  calendarOpen,
  activeField,
  guestsOpen,
  locationOpen,
) {
  return FIELDS.map((field, index) => {
    const isActive =
      (calendarOpen &&
        ((field.id === "checkin" && activeField === "checkin") ||
          (field.id === "checkout" && activeField === "checkout"))) ||
      (field.id === "guests" && guestsOpen) ||
      (field.id === "location" && locationOpen);

    const hasError = !!field.error;

    return (
      <Box
        key={field.id}
        ref={field.ref}
        onClick={field.onClick}
        sx={{
          flex: 1,
          px: 2.5,
          py: 1.8,
          cursor: "pointer",
          borderRight: {
            md:
              index < FIELDS.length - 1
                ? `1.5px solid ${hasError ? "#fecaca" : BORDER}`
                : "none",
            xs: "none",
          },
          borderBottom: {
            xs: `1.5px solid ${hasError ? "#fecaca" : BORDER}`,
            md: "none",
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "5px",
          minWidth: 0,
          transition: "background 0.15s",
          bgcolor: hasError ? "#fff5f5" : isActive ? "#f0fdf4" : "transparent",
          borderRadius: isActive
            ? index === 0
              ? "11px 0 0 11px"
              : index === FIELDS.length - 1
                ? "0 11px 11px 0"
                : "0"
            : "0",
          "&:hover": { background: hasError ? "#fff5f5" : "#f9fafb" },
        }}
      >
        {/* Label */}
        <Typography
          sx={{
            fontSize: "0.71rem",
            fontWeight: 600,
            letterSpacing: "0.15px",
            color: hasError ? "#dc2626" : isActive ? GREEN : "#6b7280",
          }}
        >
          {field.label}
        </Typography>

        {/* Value row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
          {field.icon}
          <Typography
            sx={{
              fontSize: "0.92rem",
              fontWeight: 600,
              // ✅ isPlaceholder ho toh gray, real value ho toh dark
              color: field.isPlaceholder ? "#9ca3af" : "#111827",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {field.value}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              fontSize: 18,
              flexShrink: 0,
              color: hasError ? "#dc2626" : isActive ? GREEN : "#6b7280",
              transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </Box>

        {/* Inline error */}
        {hasError && (
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "#dc2626",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "3px",
              lineHeight: 1.3,
            }}
          >
            ⚠ {field.error}
          </Typography>
        )}
      </Box>
    );
  });
}

// ─── HotelsPage ────────────────────────────────
const HotelsPage = ({ scrolled }) => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [errors, setErrors] = useState({
    location: "",
    checkin: "",
    checkout: "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState({ code: "", name: "" });
  const [guestsLabel, setGuestsLabel] = useState("");
  const [guestsData, setGuestsData] = useState(null);

  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);
  const guestsRef = useRef(null);
  const locationRef = useRef(null);

  const { search: searchHotels, loading: hotelLoading } = useHotelSearch();

  const openCalendar = (field) => {
    const el = field === "checkin" ? checkinRef.current : checkoutRef.current;
    setActiveField(field);
    setCalendarAnchor(el);
    setCalendarOpen(true);
  };

  const handleDateChange = (start, end) => {
    setCheckIn(start);
    setCheckOut(end);
    setErrors((prev) => ({ ...prev, checkin: "", checkout: "" }));
  };

  const handleSearch = async () => {
    const newErrors = { location: "", checkin: "", checkout: "", guests: "" };
    let hasError = false;

    if (!selectedCity.code) {
      newErrors.location = "Please select a location";
      hasError = true;
    }
    if (!checkIn) {
      newErrors.checkin = "Please select a check-in date";
      hasError = true;
    }
    if (!checkOut) {
      newErrors.checkout = "Please select a check-out date";
      hasError = true;
    }
    if (!guestsLabel) {
      // ← guests validation
      newErrors.guests = "Please select rooms & guests";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const loadingToast = toast.loading("Searching hotels...", { icon: "🔍" });
    try {
      const data = await searchHotels(selectedCity.code);
      toast.dismiss(loadingToast);

      const hotels = data?.data ?? data?.hotels ?? data?.results ?? [];
      const total = data?.meta?.total ?? hotels.length ?? 0;

      if (total > 0) {
        toast.success(
          `🏨 ${total} hotels found in ${selectedCity.name.split(",")[0]}!`,
          {
            duration: 3000,
            style: { fontWeight: 600 },
          },
        );
      } else {
        toast("No hotels found for this location.", { icon: "😔" });
      }

      navigate("/hotels/results", {
        state: {
          hotels,
          cityName: selectedCity.name,
          cityCode: selectedCity.code,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests: guestsLabel,
          guestsData,
          total,
        },
      });
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const FIELDS = [
    {
      id: "location",
      label: "Location",
      // ✅ city select nahi ki toh "Mumbai" placeholder
      value: selectedCity.code ? selectedCity.name : "Mumbai",
      isPlaceholder: !selectedCity.code,
      error: errors.location,
      icon: (
        <LocationOnIcon
          sx={{ color: errors.location ? "#dc2626" : GREEN, fontSize: 19 }}
        />
      ),
      ref: locationRef,
      onClick: () => setLocationOpen((o) => !o),
    },
    {
      id: "checkin",
      label: "Check In",
      // ✅ date select nahi ki toh aaj ki date placeholder
      value: checkIn ? formatDate(checkIn) : PLACEHOLDER_CHECKIN,
      isPlaceholder: !checkIn,
      error: errors.checkin,
      icon: (
        <CalendarTodayIcon
          sx={{ color: errors.checkin ? "#dc2626" : GREEN, fontSize: 19 }}
        />
      ),
      ref: checkinRef,
      onClick: () => openCalendar("checkin"),
    },
    {
      id: "checkout",
      label: "Check Out",
      // ✅ date select nahi ki toh kal ki date placeholder
      value: checkOut ? formatDate(checkOut) : PLACEHOLDER_CHECKOUT,
      isPlaceholder: !checkOut,
      error: errors.checkout,
      icon: (
        <CalendarTodayIcon
          sx={{ color: errors.checkout ? "#dc2626" : GREEN, fontSize: 19 }}
        />
      ),
      ref: checkoutRef,
      onClick: () => openCalendar("checkout"),
    },
    {
      id: "guests",
      label: "Rooms & Guests",
      value: guestsLabel || "1 Room, 2 Adults",
      isPlaceholder: !guestsLabel,
      error: errors.guests,
      icon: (
        <PeopleAltIcon
          sx={{ color: errors.guests ? "#dc2626" : GREEN, fontSize: 19 }}
        />
      ),
      ref: guestsRef,
      onClick: () => setGuestsOpen((o) => !o),
    },
  ];

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#1f2937",
            color: "#fff",
            fontSize: "14px",
            padding: "12px 18px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          },
          success: { style: { background: "#166534", color: "#fff" } },
          error: { style: { background: "#991b1b", color: "#fff" } },
          loading: { style: { background: "#1e40af", color: "#fff" } },
        }}
      />

      <StickyRightBar visible={scrolled} />
      <CategoryTabs />

      <Box
        sx={{
         fontFamily: "Inter, sans-serif",
          position: "relative",
          px: { xs: 2, md: 4 },
          pb: { xs: 3, md: 5 },
          pt: { xs: 2, md: 3 },
        }}
      >
        {/* BACKGROUND ONLY TOP HALF (Book a Hotel AREA) */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: { xs: "140px", sm: "160px", md: "100px" },
            bgcolor: "#f0f4f8",
            zIndex: 0,
          }}
        />

        {/* CONTENT LAYER */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            p: { xs: "20px 16px", sm: "24px 24px", md: "28px 32px" },
            maxWidth: 1100,
            mx: "auto",
            width: "100%",
            boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
            position: "relative",
            zIndex: 1,
            backgroundColor: "#fff",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "flex-start" },
              gap: { xs: 1.5, sm: 0 },
              mb: 2.8,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.65rem" },
                  fontWeight: 800,
                  fontFamily: "Inter, sans-serif",
                  color: "#111827",
                  letterSpacing: "-0.3px",
                  lineHeight: 1.2,
                }}
              >
                Book a Hotel
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontFamily: "Inter, sans-serif",
                  color: "#6b7280",
                  mt: 0.5,
                }}
              >
                Discover the perfect space for you!
              </Typography>
            </Box>

            <Button
              disableRipple
              disableElevation
              startIcon={
                <PersonIcon
                  sx={{ color: GREEN, fontSize: "18px !important" }}
                />
              }
              sx={{
                color: GREEN,
                fontWeight: 500,
                fontSize: "0.875rem",
                fontFamily: "Inter, sans-serif",
                textTransform: "none",
                background: "none",
                boxShadow: "none",
                p: 0,
                minWidth: 0,
                "&:hover": { background: "none", opacity: 0.75 },
              }}
            >
              Need some help?
            </Button>
          </Box>

          {/* SEARCH BOX */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "stretch",
              border: `1.5px solid ${BORDER}`,
              borderRadius: "12px",
              overflow: "visible",
              position: "relative",
            }}
          >
            {renderFields(
              FIELDS,
              calendarOpen,
              activeField,
              guestsOpen,
              locationOpen,
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: { xs: 1.5, md: 1.2 },
                py: { xs: 1.2, md: 1 },
                bgcolor: "#fff",
                flexShrink: 0,
              }}
            >
              <Button
                onClick={handleSearch}
                disabled={hotelLoading}
                startIcon={<SearchIcon sx={{ fontSize: "19px !important" }} />}
                sx={{
                  background: GREEN,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  fontFamily: "Inter, sans-serif",
                  textTransform: "none",
                  borderRadius: "10px",
                  px: { xs: 3, md: 3 },
                  py: 1.6,
                  width: { xs: "100%", md: "auto" },
                  minWidth: { xs: 0, md: 130 },
                  "&:hover": { background: "#15803d" },
                  "&:active": { transform: "scale(0.97)" },
                  "&.Mui-disabled": {
                    background: "#86efac",
                    color: "#fff",
                  },
                  transition: "background 0.2s, transform 0.1s",
                }}
              >
                {hotelLoading ? "Searching..." : "Search"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <DateRangePicker
        anchorEl={calendarAnchor}
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        startDate={checkIn}
        endDate={checkOut}
        onChange={handleDateChange}
        activeField={activeField}
      />

      <LocationDropdown
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        anchorEl={locationRef.current}
        onSelect={(city) => {
          setSelectedCity(city);
          setLocationOpen(false);
          setErrors((prev) => ({ ...prev, location: "" }));
        }}
      />

      <RoomsGuestDropdown
        open={guestsOpen}
        onClose={() => setGuestsOpen(false)}
        anchorEl={guestsRef.current}
        onDone={(label, data) => {
          setGuestsLabel(label);
          setGuestsData(data);
          setGuestsOpen(false);
        }}
      />

      {/* <BestDealHotels /> */}
      {/* <BookingSuccessPage/> */}
      <PopularDestinations />
      <HotelSEOContent />
    </>
  );
};

export default HotelsPage;
