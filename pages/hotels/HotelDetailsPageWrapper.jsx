import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Paper,
  IconButton, useMediaQuery, useTheme,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import DateRangePicker from "../../src/components/hotel/DateRangePicker";
import LocationDropdown from "../../src/components/hotel/LocationDropdown";
import RoomsGuestDropdown from "../../src/components/hotel/Roomsguestselector";
import HotelDetailsPage from "../../src/components/hotel/HotelDetailsPage";
import { useHotelDetails } from "../../src/hooks/hotelhooks/useHotelDetails";

const GREEN = "#16a34a";
const BORDER = "#e5e7eb";

const CATEGORIES = [
  { label: "Flights", img: "/navbaricons/flightslogo.svg", path: "/flights", emoji: "✈️" },
  { label: "Hotels", img: "/navbaricons/hotelslogo.svg", path: "/hotels", emoji: "🏨" },
  { label: "Buses", img: "/navbaricons/buseslogo.svg", path: "/buses", emoji: "🚌" },
  { label: "Trains", img: "/navbaricons/trainslogo.svg", path: "/trains", emoji: "🚆" },
];

function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

// ─── Top Navbar ────────────────────────────────
const TopNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{
      bgcolor: "#ffffff", borderBottom: "1px solid #e8e8e8",
      px: { xs: 2, md: 4 }, display: "flex", alignItems: "center",
      gap: 2, minHeight: "64px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      position: "sticky", top: 0, zIndex: 1300,
    }}>
      <Box component="img" src="/navbaricons/dealplexlogo.svg" alt="Dealplex"
        sx={{ height: 38, objectFit: "contain", flexShrink: 0, mr: 1 }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      {!isMobile && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {CATEGORIES.map((cat) => {
            const isActive = location.pathname.startsWith(cat.path);
            return (
              <Box key={cat.label} onClick={() => navigate(cat.path)}
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2.5, py: 1, cursor: "pointer", borderRadius: "10px", transition: "background 0.15s", "&:hover": { bgcolor: "#f5f5f5" } }}
              >
                <Box component="img" src={cat.img} alt={cat.label} sx={{ width: 28, height: 28, objectFit: "contain", mb: 0.4 }} onError={(e) => { e.target.style.display = "none"; }} />
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
            sx={{ ml: 1, borderRadius: "8px", borderColor: GREEN, color: GREEN, fontWeight: 600, fontSize: 13, textTransform: "none", px: 2, py: 0.9, whiteSpace: "nowrap", "&:hover": { borderColor: "#15803d", bgcolor: "#f0fdf4" } }}
          >
            Login / Signup
          </Button>
        </Box>
      )}
      {isMobile && <IconButton sx={{ color: "#333", ml: "auto" }}><MenuIcon /></IconButton>}
    </Box>
  );
};

// ─── Search Bar Strip ──────────────────────────
const DetailsSearchBar = ({ initialData, hotelCode }) => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(initialData.checkIn ? new Date(initialData.checkIn) : null);
  const [checkOut, setCheckOut] = useState(initialData.checkOut ? new Date(initialData.checkOut) : null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [guestsLabel, setGuestsLabel] = useState(initialData.guests ?? "1 Room, 2 Adults");
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState({
    code: initialData.cityCode ?? "",
    name: initialData.cityName ?? "Select Location",
  });

  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);
  const guestsRef = useRef(null);
  const locationRef = useRef(null);

  const openCalendar = (field) => {
    const el = field === "checkin" ? checkinRef.current : checkoutRef.current;
    setActiveField(field);
    setCalendarAnchor(el);
    setCalendarOpen(true);
  };

  const handleModifySearch = () => {
    if (!selectedCity.code || !checkIn || !checkOut) {
      toast.error("Please fill all search fields!");
      return;
    }
    navigate(`/hotels/details/${hotelCode}`, {
      state: {
        hotel: initialData.hotel,
        searchParams: {
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests: guestsLabel,
          cityName: selectedCity.name,
          cityCode: selectedCity.code,
        },
      },
      replace: true,
    });
  };

  const FIELDS = [
    {
      id: "location", label: "Location", value: selectedCity.name,
      icon: <LocationOnIcon sx={{ color: GREEN, fontSize: 19 }} />,
      ref: locationRef, onClick: () => setLocationOpen((o) => !o),
    },
    {
      id: "checkin", label: "Check In", value: checkIn ? formatDate(checkIn) : "Select date",
      icon: <CalendarTodayIcon sx={{ color: GREEN, fontSize: 19 }} />,
      ref: checkinRef, onClick: () => openCalendar("checkin"),
    },
    {
      id: "checkout", label: "Check Out", value: checkOut ? formatDate(checkOut) : "Select date",
      icon: <CalendarTodayIcon sx={{ color: GREEN, fontSize: 19 }} />,
      ref: checkoutRef, onClick: () => openCalendar("checkout"),
    },
    {
      id: "guests", label: "Rooms & Guests", value: guestsLabel,
      icon: <PeopleAltIcon sx={{ color: GREEN, fontSize: 19 }} />,
      ref: guestsRef, onClick: () => setGuestsOpen((o) => !o),
    },
  ];

  return (
    <>
      <Box sx={{ bgcolor: "#f0f4f8", px: { xs: 2, md: 4 }, py: { xs: 1.5, md: 2 } }}>
        <Paper elevation={0} sx={{ borderRadius: "12px", maxWidth: 1100, mx: "auto", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "visible" }}>
          <Box sx={{
            display: "flex", flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch", border: `1.5px solid ${BORDER}`,
            borderRadius: "12px", overflow: "visible", position: "relative",
          }}>
            {FIELDS.map((field, index) => {
              const isActive =
                (calendarOpen && ((field.id === "checkin" && activeField === "checkin") || (field.id === "checkout" && activeField === "checkout"))) ||
                (field.id === "guests" && guestsOpen) ||
                (field.id === "location" && locationOpen);
              return (
                <Box key={field.id} ref={field.ref} onClick={field.onClick}
                  sx={{
                    flex: 1, px: 2.5, py: 1.5, cursor: "pointer",
                    borderRight: { md: index < FIELDS.length - 1 ? `1.5px solid ${BORDER}` : "none", xs: "none" },
                    borderBottom: { xs: `1.5px solid ${BORDER}`, md: "none" },
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    gap: "5px", minWidth: 0, transition: "background 0.15s",
                    bgcolor: isActive ? "#f0fdf4" : "transparent",
                    borderRadius: isActive ? (index === 0 ? "11px 0 0 11px" : index === FIELDS.length - 1 ? "0 11px 11px 0" : "0") : "0",
                    "&:hover": { background: "#f9fafb" },
                  }}
                >
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: isActive ? GREEN : "#6b7280", letterSpacing: "0.15px" }}>
                    {field.label}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    {field.icon}
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: (field.value === "Select date" || field.value === "Select Location") ? "#9ca3af" : "#111827", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {field.value}
                    </Typography>
                    <KeyboardArrowDownIcon sx={{ color: isActive ? GREEN : "#6b7280", fontSize: 18, flexShrink: 0, transform: isActive ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </Box>
                </Box>
              );
            })}
            <Box sx={{ display: "flex", alignItems: "center", px: { xs: 1.5, md: 1.2 }, py: { xs: 1.2, md: 1 }, bgcolor: "#fff", flexShrink: 0, borderRadius: "0 11px 11px 0" }}>
              <Button onClick={handleModifySearch}
                startIcon={<SearchIcon sx={{ fontSize: "19px !important" }} />}
                sx={{
                  background: GREEN, color: "#fff", fontWeight: 700, fontSize: "0.95rem",
                  textTransform: "none", borderRadius: "10px",
                  px: { xs: 3, md: 3 }, py: 1.4,
                  width: { xs: "100%", md: "auto" }, minWidth: { xs: 0, md: 155 },
                  "&:hover": { background: "#15803d" }, "&:active": { transform: "scale(0.97)" },
                  transition: "background 0.2s, transform 0.1s",
                }}
              >
                Modify Search
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <DateRangePicker
        anchorEl={calendarAnchor} open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        startDate={checkIn} endDate={checkOut}
        onChange={(s, e) => { setCheckIn(s); setCheckOut(e); }}
        activeField={activeField}
      />
      <LocationDropdown
        open={locationOpen} onClose={() => setLocationOpen(false)}
        anchorEl={locationRef.current}
        onSelect={(city) => { setSelectedCity(city); setLocationOpen(false); }}
      />
      <RoomsGuestDropdown
        open={guestsOpen} onClose={() => setGuestsOpen(false)}
        anchorEl={guestsRef.current}
        onDone={(label) => { setGuestsLabel(label); setGuestsOpen(false); }}
      />
    </>
  );
};

// ─── Main Wrapper ──────────────────────────────
const HotelDetailsPageWrapper = ({ scrolled }) => {
  const { hotelCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { hotelDetail, roomsData, loading, error, fetchDetails } = useHotelDetails();

  const searchParams = state?.searchParams ?? {};

  useEffect(() => {
    if (!hotelCode) return;

    const guestsData = state?.guestsData ?? null;

    const adults = guestsData?.adults ?? 2;
    const children = guestsData?.children ?? 0;
    const childAges = (guestsData?.childAges ?? [])
      .map(a => a === "" ? 1 : parseInt(a) || 1);

    fetchDetails(hotelCode, {
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      adults,
      children,
      childrenAges: childAges,
    });
  }, [hotelCode, searchParams.checkIn, searchParams.checkOut]);

  // ── Extract searchId from API response ──────
  // Try common paths your backend might return it under
  const searchId =
    roomsData?.data?.searchId ??
    roomsData?.data?.SearchId ??
    roomsData?.searchId ??
    roomsData?.SearchId ??
    roomsData?.data?.tboResponse?.SearchId ??
    hotelDetail?.data?.searchId ??
    hotelDetail?.data?.SearchId ??
    null;

  if (!hotelCode) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography sx={{ fontSize: 40, mb: 2 }}>🏨</Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#374151", mb: 1 }}>Hotel not found</Typography>
        <Typography sx={{ fontSize: 14, color: "#9ca3af", mb: 3 }}>Please search and select a hotel</Typography>
        <Button onClick={() => navigate("/hotels")} startIcon={<ArrowBackIcon />}
          variant="contained" disableElevation
          sx={{ bgcolor: GREEN, color: "#fff", fontWeight: 600, textTransform: "none", borderRadius: "8px", px: 3, py: 1.2, "&:hover": { bgcolor: "#15803d" } }}
        >
          Back to Search
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { borderRadius: "12px", background: "#1f2937", color: "#fff", fontSize: "14px", padding: "12px 18px" },
        success: { style: { background: "#166534", color: "#fff" } },
        error: { style: { background: "#991b1b", color: "#fff" } },
        loading: { style: { background: "#1e40af", color: "#fff" } },
      }} />

      <TopNavbar />

      <DetailsSearchBar
        initialData={searchParams}
        hotelCode={hotelCode}
      />

      <HotelDetailsPage
        hotelDetail={hotelDetail}
        roomsData={roomsData}
        detailLoading={loading}
        roomsLoading={loading}
        searchId={searchId}
        guestsData={state?.guestsData ?? null}
        searchParams={searchParams} 
      />
    </>
  );
};

export default HotelDetailsPageWrapper;