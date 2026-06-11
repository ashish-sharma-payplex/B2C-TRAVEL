import React, { useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Slider,
  Drawer,
  IconButton,
} from "@mui/material";
import {
  WbSunny,
  Brightness3,
  Brightness5,
  NightsStay,
  Close,
  FlightTakeoff,
  FlightLand,
} from "@mui/icons-material";
import FlightSearch from "./FlightSearch"; // ← apna actual path adjust karo

// ─── Airline logo map ─────────────────────────────────────────────────────────
const AIRLINE_LOGO_MAP = {
  indigo: "/navbaricons/indigo.png",
  "6e": "/navbaricons/indigo.png",
  spicejet: "/navbaricons/spicejet.png",
  sg: "/navbaricons/spicejet.png",
  "air india": "/navbaricons/airindia.png",
  ai: "/navbaricons/airindia.png",
  "air india express": "/navbaricons/airindia.png",
  ix: "/navbaricons/airindia.png",
  "air asia": "/navbaricons/airasia.png",
  i5: "/navbaricons/airasia.png",
  "fly dubai": "/navbaricons/flydubai.png",
  flydubai: "/navbaricons/flydubai.png",
  fz: "/navbaricons/flydubai.png",
  "go air": "/navbaricons/goair.png",
  goair: "/navbaricons/goair.png",
  g8: "/navbaricons/goair.png",
};

const getAirlineLogo = (name = "", code = "") => {
  const key = name.toLowerCase();
  const codeKey = code.toLowerCase();
  return AIRLINE_LOGO_MAP[key] || AIRLINE_LOGO_MAP[codeKey] || null;
};

// ─── Airline Logo component ───────────────────────────────────────────────────
const AirlineLogo = ({ name, code, size = 44 }) => {
  const [imgError, setImgError] = useState(false);
  const logoSrc = getAirlineLogo(name, code);

  const colors = {
    indigo: "#2B3D8F",
    "6e": "#2B3D8F",
    spicejet: "#FF0000",
    sg: "#FF0000",
    "air india": "#E31837",
    ai: "#E31837",
    "akasa air": "#FF6B00",
  };
  const fallbackBg =
    colors[name?.toLowerCase()] || colors[code?.toLowerCase()] || "#555";
  const initials = (code || name || "??")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (logoSrc && !imgError) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "10px",
          overflow: "hidden",
          flexShrink: 0,
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
        }}
      >
        <Box
          component="img"
          src={logoSrc}
          alt={name}
          onError={() => setImgError(true)}
          sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5 }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "10px",
        bgcolor: fallbackBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.3,
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  );
};

// ─── Airplane Loader ──────────────────────────────────────────────────────────
const AirplaneLoader = () => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      bgcolor: "rgba(255,255,255,0.92)",
      zIndex: 2000,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
    }}
  >
    {/* Runway */}
    <Box sx={{ position: "relative", width: 340, height: 80 }}>
      {/* Airplane */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-60%)",
          animation: "flyAcross 1.8s ease-in-out infinite",
          "@keyframes flyAcross": {
            "0%": { left: "-60px", opacity: 0 },
            "10%": { opacity: 1 },
            "90%": { opacity: 1 },
            "100%": { left: "360px", opacity: 0 },
          },
        }}
      >
        <FlightTakeoff sx={{ fontSize: 48, color: "#1A914B" }} />
      </Box>
      {/* Dashed line */}
      <Box
        sx={{
          position: "absolute",
          top: "70%",
          left: 0,
          right: 0,
          height: 2,
          backgroundImage:
            "repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 12px, transparent 12px, transparent 22px)",
        }}
      />
      {/* Dots */}
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: "64%",
            left: `${20 + i * 40}%`,
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "#d1d5db",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            "@keyframes pulse": {
              "0%, 100%": { bgcolor: "#d1d5db", transform: "scale(1)" },
              "50%": { bgcolor: "#1A914B", transform: "scale(1.4)" },
            },
          }}
        />
      ))}
    </Box>

    <Box sx={{ textAlign: "center" }}>
      <Typography
        sx={{ fontSize: 20, fontWeight: 700, color: "#111827", mb: 0.5 }}
      >
        Searching Best Flights...
      </Typography>
      <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
        Checking availability across airlines
      </Typography>
    </Box>

    {/* Loading bar */}
    <Box
      sx={{
        width: 280,
        height: 4,
        bgcolor: "#e5e7eb",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          bgcolor: "#1A914B",
          borderRadius: 2,
          animation: "loadBar 1.8s ease-in-out infinite",
          "@keyframes loadBar": {
            "0%": { width: "0%", marginLeft: "0%" },
            "50%": { width: "60%", marginLeft: "20%" },
            "100%": { width: "0%", marginLeft: "100%" },
          },
        }}
      />
    </Box>
  </Box>
);

// ─── Flight Detail Sidebar ────────────────────────────────────────────────────
const FlightDetailSidebar = ({ open, onClose, flight, searchMeta }) => {
  if (!flight) return null;
  const segs = flight.Segments?.[0] || [];
  const first = segs[0];
  const last = segs[segs.length - 1];
  const price = flight.Fare?.PublishedFare;
  const totalPassengers =
    (searchMeta?.passengers?.adults || 1) +
    (searchMeta?.passengers?.children || 0);
  const totalPrice = price * totalPassengers;

  const depDate = first?.Origin?.DepTime
    ? new Date(first.Origin.DepTime)
    : null;
  const arrDate = last?.Destination?.ArrTime
    ? new Date(last.Destination.ArrTime)
    : null;

  const formatTime = (d) =>
    d
      ? d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--";
  const formatDateShort = (d) =>
    d
      ? d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "";

  const totalDuration = last?.AccumulatedDuration || first?.Duration || 0;
  const dh = Math.floor(totalDuration / 60);
  const dm = totalDuration % 60;
  const stopsCount = segs.length - 1;
  const stopLabel =
    stopsCount === 0
      ? "non-stop"
      : `${stopsCount} stop${stopsCount > 1 ? "s" : ""}`;

  const originCity = first?.Origin?.Airport?.CityName || "";
  const destCity = last?.Destination?.Airport?.CityName || "";
  const airlineName = first?.Airline?.AirlineName || "";
  const airlineCode = first?.Airline?.AirlineCode || "";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          borderRadius: { sm: "16px 0 0 16px" },
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#fff",
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
              {originCity}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#555",
              }}
            >
              <FlightTakeoff sx={{ fontSize: 18, color: "#1A914B" }} />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
              {destCity}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#555" }}>
            <Close />
          </IconButton>
        </Box>
        <Typography sx={{ fontSize: 13, color: "#888" }}>
          {formatDateShort(depDate)} &nbsp;·&nbsp;
          {totalPassengers} Adult{totalPassengers > 1 ? "s" : ""} &nbsp;·&nbsp;
          {searchMeta?.cabinClass || "Economy"} &nbsp;·&nbsp;
          {searchMeta?.tripType === "roundtrip" ? "Round Trip" : "Oneway"}
        </Typography>
      </Box>

      {/* Body */}
      <Box
        sx={{ overflowY: "auto", flex: 1, px: 3, py: 2.5, bgcolor: "#fafafa" }}
      >
        {/* Date pill */}
        <Paper
          elevation={0}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#EAF7EF",
            px: 2,
            py: 0.8,
            borderRadius: "50px",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1A914B" }}>
            {formatDateShort(depDate)}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#555" }}>
            {originCity} – {destCity} &bull; {dh}h {dm}m ({stopLabel})
          </Typography>
        </Paper>

        {/* Segments timeline */}
        {segs.map((seg, idx) => {
          const segDepTime = seg.Origin?.DepTime
            ? new Date(seg.Origin.DepTime)
            : null;
          const segArrTime = seg.Destination?.ArrTime
            ? new Date(seg.Destination.ArrTime)
            : null;
          const segDh = Math.floor(seg.Duration / 60);
          const segDm = seg.Duration % 60;
          const groundTime = seg.GroundTime;

          return (
            <React.Fragment key={idx}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                {/* Timeline dot-line */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: 0.5,
                    minWidth: 20,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#1A914B",
                      flexShrink: 0,
                    }}
                  />
                  <Box
                    sx={{
                      width: 2,
                      flex: 1,
                      bgcolor: "#d1d5db",
                      my: 0.5,
                      minHeight: 60,
                    }}
                  />
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#1A914B",
                      flexShrink: 0,
                    }}
                  />
                </Box>

                {/* Seg info */}
                <Box sx={{ flex: 1, pb: 1 }}>
                  {/* Departure */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "#111",
                          lineHeight: 1,
                        }}
                      >
                        {formatTime(segDepTime)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#222",
                          mt: 0.3,
                        }}
                      >
                        {seg.Origin?.Airport?.CityName} (
                        {seg.Origin?.Airport?.AirportCode})
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#888" }}>
                        {seg.Origin?.Airport?.AirportName}
                        {seg.Origin?.Airport?.Terminal
                          ? `, Terminal ${seg.Origin.Airport.Terminal}`
                          : ""}
                      </Typography>
                    </Box>
                    <AirlineLogo
                      name={seg.Airline?.AirlineName}
                      code={seg.Airline?.AirlineCode}
                      size={40}
                    />
                  </Box>

                  {/* Flight info badge */}
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#f3f4f6",
                      borderRadius: "10px",
                      px: 2,
                      py: 1,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <AirlineLogo
                      name={seg.Airline?.AirlineName}
                      code={seg.Airline?.AirlineCode}
                      size={28}
                    />
                    <Box>
                      <Typography
                        sx={{ fontSize: 12.5, fontWeight: 600, color: "#333" }}
                      >
                        {seg.Airline?.AirlineName} &bull;{" "}
                        {seg.Airline?.AirlineCode}-{seg.Airline?.FlightNumber}
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: "#888" }}>
                        {segDh}h {segDm}m &bull; {seg.CabinBaggage} cabin &bull;{" "}
                        {seg.Baggage} check-in
                        {seg.SupplierFareClass
                          ? ` · ${seg.SupplierFareClass}`
                          : ""}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Arrival */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#111",
                        lineHeight: 1,
                      }}
                    >
                      {formatTime(segArrTime)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#222",
                        mt: 0.3,
                      }}
                    >
                      {seg.Destination?.Airport?.CityName} (
                      {seg.Destination?.Airport?.AirportCode})
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#888" }}>
                      {seg.Destination?.Airport?.AirportName}
                      {seg.Destination?.Airport?.Terminal
                        ? `, Terminal ${seg.Destination.Airport.Terminal}`
                        : ""}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Layover badge */}
              {groundTime > 0 && idx < segs.length - 1 && (
                <Box
                  sx={{
                    mx: "auto",
                    my: 1.5,
                    px: 2.5,
                    py: 1,
                    bgcolor: "#FFF7ED",
                    border: "1px dashed #FCD34D",
                    borderRadius: "50px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 600, color: "#92400E" }}
                  >
                    ⏱ Layover: {Math.floor(groundTime / 60)}h {groundTime % 60}m
                    at {seg.Destination?.Airport?.CityCode}
                  </Typography>
                </Box>
              )}
            </React.Fragment>
          );
        })}

        {/* Fare info */}
        <Divider sx={{ my: 2, borderStyle: "dashed" }} />
        <Typography
          sx={{ fontSize: 14, fontWeight: 600, color: "#333", mb: 1.5 }}
        >
          Fare Summary
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 13, color: "#555" }}>
              Base Fare × {totalPassengers}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#222", fontWeight: 500 }}>
              ₹{" "}
              {(flight.Fare?.BaseFare * totalPassengers).toLocaleString(
                "en-IN",
              )}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 13, color: "#555" }}>
              Taxes & Fees
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#222", fontWeight: 500 }}>
              ₹ {(flight.Fare?.Tax * totalPassengers).toLocaleString("en-IN")}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
              Total
            </Typography>
            <Typography
              sx={{ fontSize: 16, fontWeight: 700, color: "#1A914B" }}
            >
              ₹ {totalPrice.toLocaleString("en-IN")}
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: 11, color: "#9ca3af", textAlign: "right" }}
          >
            For {totalPassengers} traveller{totalPassengers > 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Refund tag */}
        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "50px",
              bgcolor: flight.IsRefundable ? "#EAF7EF" : "#FEF2F2",
              border: `1px solid ${flight.IsRefundable ? "#86EFAC" : "#FECACA"}`,
            }}
          >
            <Typography
              sx={{
                fontSize: 11.5,
                fontWeight: 600,
                color: flight.IsRefundable ? "#166534" : "#991B1B",
              }}
            >
              {flight.IsRefundable ? "✓ Refundable" : "✗ Non-refundable"}
            </Typography>
          </Box>
          {segs[0]?.SupplierFareClass && (
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "50px",
                bgcolor: "#EFF6FF",
                border: "1px solid #BFDBFE",
              }}
            >
              <Typography
                sx={{ fontSize: 11.5, fontWeight: 600, color: "#1D4ED8" }}
              >
                {segs[0].SupplierFareClass}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer CTA */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          bgcolor: "#fff",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111" }}>
            ₹ {totalPrice.toLocaleString("en-IN")}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#888" }}>
            For {totalPassengers} Traveller{totalPassengers > 1 ? "s" : ""}
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#1A914B",
            "&:hover": { bgcolor: "#157a3e" },
            textTransform: "none",
            borderRadius: "10px",
            px: 3.5,
            py: 1.3,
            fontSize: 15,
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          Continue
        </Button>
      </Box>
    </Drawer>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const timeSlots = [
  { label: "Before 6 AM", icon: <NightsStay sx={{ fontSize: 18 }} /> },
  { label: "6AM - 12PM", icon: <WbSunny sx={{ fontSize: 18 }} /> },
  { label: "12PM - 6PM", icon: <Brightness5 sx={{ fontSize: 18 }} /> },
  { label: "6PM - 12AM", icon: <Brightness3 sx={{ fontSize: 18 }} /> },
];

const checkboxStyle = {
  color: "#B5BAC2",
  "&.Mui-checked": { color: "#1A914B" },
  padding: "4px 8px",
};

const getFlightMeta = (flight) => {
  const segs = flight.Segments?.[0] || [];
  if (!segs.length) return null;
  const first = segs[0];
  const last = segs[segs.length - 1];
  const depTime = first.Origin?.DepTime?.split("T")[1]?.substring(0, 5) || "--";
  const arrTime =
    last.Destination?.ArrTime?.split("T")[1]?.substring(0, 5) || "--";
  const totalDuration = last.AccumulatedDuration || first.Duration || 0;
  const durationHours = Math.floor(totalDuration / 60);
  const durationMinutes = totalDuration % 60;
  const stopsCount = segs.length - 1;
  const stopLabel =
    stopsCount === 0
      ? "Non-stop"
      : `${stopsCount} Stop${stopsCount > 1 ? "s" : ""}`;
  return {
    depTime,
    arrTime,
    durationHours,
    durationMinutes,
    stopsCount,
    stopLabel,
    airlineName: first.Airline?.AirlineName || "",
    airlineCode: first.Airline?.AirlineCode || "",
    flightNumber: first.Airline?.FlightNumber || "",
    originCity: first.Origin?.Airport?.CityName || "",
    destCity: last.Destination?.Airport?.CityName || "",
    segs,
    first,
    last,
  };
};

const getPriceRange = (flights) => {
  if (!flights.length) return [0, 100000];
  const prices = flights.map((f) => f.Fare?.PublishedFare || 0);
  return [Math.min(...prices), Math.max(...prices)];
};

const getUniqueAirlines = (flights) => {
  const set = new Set();
  flights.forEach((f) => {
    const name = f.Segments?.[0]?.[0]?.Airline?.AirlineName;
    if (name) set.add(name);
  });
  return Array.from(set);
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const FlightsListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const rawFlights = useMemo(() => {
    const state = location.state || {};
    return state.flights || state.searchResult?.data?.results?.Results || [];
  }, [location.state]);

  const searchMeta = location.state || {};

  const [minP, maxP] = useMemo(() => getPriceRange(rawFlights), [rawFlights]);
  const [priceRange, setPriceRange] = useState(null);
  const effectivePriceRange = priceRange || [minP, maxP];

  const uniqueAirlines = useMemo(
    () => getUniqueAirlines(rawFlights),
    [rawFlights],
  );

  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const clearAll = () => {
    setPriceRange(null);
    setDepartureTime("");
    setArrivalTime("");
    setSelectedStops([]);
    setSelectedAirlines([]);
  };

  const toggleItem = (setter, arr, val) =>
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  // ── Called by embedded FlightSearch on search ──
  const handleNewSearch = useCallback(
    (result, params) => {
      setIsSearching(true);
      setTimeout(() => {
        navigate("/flights/listing", {
          state: {
            searchResult: result,
            flights: result?.data?.results?.Results || [],
            ...params,
          },
          replace: true,
        });
        setIsSearching(false);
      }, 200);
    },
    [navigate],
  );

  const filteredFlights = useMemo(() => {
    return rawFlights.filter((flight) => {
      const meta = getFlightMeta(flight);
      if (!meta) return false;
      const price = flight.Fare?.PublishedFare || 0;
      if (price < effectivePriceRange[0] || price > effectivePriceRange[1])
        return false;
      if (selectedStops.length > 0) {
        const stopText =
          meta.stopsCount === 0
            ? "Nonstop"
            : meta.stopsCount === 1
              ? "1 Stop"
              : "2+ Stop";
        if (!selectedStops.includes(stopText)) return false;
      }
      if (departureTime) {
        const h = parseInt(meta.depTime.split(":")[0]);
        if (
          (departureTime === "Before 6 AM" && h >= 6) ||
          (departureTime === "6AM - 12PM" && (h < 6 || h >= 12)) ||
          (departureTime === "12PM - 6PM" && (h < 12 || h >= 18)) ||
          (departureTime === "6PM - 12AM" && h < 18)
        )
          return false;
      }
      if (arrivalTime) {
        const h = parseInt(meta.arrTime.split(":")[0]);
        if (
          (arrivalTime === "Before 6 AM" && h >= 6) ||
          (arrivalTime === "6AM - 12PM" && (h < 6 || h >= 12)) ||
          (arrivalTime === "12PM - 6PM" && (h < 12 || h >= 18)) ||
          (arrivalTime === "6PM - 12AM" && h < 18)
        )
          return false;
      }
      if (
        selectedAirlines.length > 0 &&
        !selectedAirlines.includes(meta.airlineName)
      )
        return false;
      return true;
    });
  }, [
    rawFlights,
    effectivePriceRange,
    selectedStops,
    departureTime,
    arrivalTime,
    selectedAirlines,
  ]);

  // ─── Filter Panel ─────────────────────────────────────────────────────────
  const FilterPanel = () => (
    <Paper
      elevation={0}
      sx={{
        width: { xs: "100%", md: "260px" },
        minWidth: { md: "240px" },
        p: 2.5,
        borderRadius: "16px",
        border: "1px solid #E3E8EE",
        bgcolor: "#fff",
        height: "fit-content",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: 17, fontWeight: 600, color: "#383E48" }}>
          Filter by:
        </Typography>
        <Typography
          onClick={clearAll}
          sx={{
            color: "#1A914B",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Clear
        </Typography>
      </Box>

      <Typography
        sx={{ fontSize: 15, fontWeight: 600, mb: 1.5, color: "#222" }}
      >
        Price Range
      </Typography>
      <Slider
        value={effectivePriceRange}
        onChange={(_, v) => setPriceRange(v)}
        min={minP}
        max={maxP}
        sx={{
          color: "#1A914B",
          "& .MuiSlider-thumb": { width: 18, height: 18 },
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: 13, color: "#555" }}>
          ₹ {effectivePriceRange[0].toLocaleString("en-IN")}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "#555" }}>
          ₹ {effectivePriceRange[1].toLocaleString("en-IN")}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

      <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1, color: "#222" }}>
        Stops
      </Typography>
      {["Nonstop", "1 Stop", "2+ Stop"].map((stop) => (
        <FormControlLabel
          key={stop}
          control={
            <Checkbox
              size="small"
              sx={checkboxStyle}
              checked={selectedStops.includes(stop)}
              onChange={() => toggleItem(setSelectedStops, selectedStops, stop)}
            />
          }
          label={
            <Typography sx={{ fontSize: 13.5, color: "#444" }}>
              {stop}
            </Typography>
          }
          sx={{ ml: 0, display: "flex" }}
        />
      ))}

      <Divider sx={{ borderStyle: "dashed", my: 2 }} />

      <Typography
        sx={{ fontSize: 15, fontWeight: 600, mb: 1.5, color: "#222" }}
      >
        Departure from {searchMeta.fromCity?.code || "Origin"}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.2,
          mb: 2,
        }}
      >
        {timeSlots.map(({ label, icon }) => (
          <Paper
            key={label}
            onClick={() =>
              setDepartureTime(departureTime === label ? "" : label)
            }
            elevation={0}
            sx={{
              p: 1.2,
              textAlign: "center",
              borderRadius: "10px",
              cursor: "pointer",
              border:
                departureTime === label
                  ? "1.5px solid #1A914B"
                  : "1px solid #E3E8EE",
              backgroundColor: departureTime === label ? "#EAF7EF" : "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.3,
              "&:hover": { borderColor: "#1A914B" },
              transition: "all .15s",
            }}
          >
            <Box sx={{ color: departureTime === label ? "#1A914B" : "#888" }}>
              {icon}
            </Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: departureTime === label ? "#1A914B" : "#555",
                lineHeight: 1.3,
              }}
            >
              {label}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Typography
        sx={{ fontSize: 15, fontWeight: 600, mb: 1.5, color: "#222" }}
      >
        Arrival at {searchMeta.toCity?.code || "Destination"}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.2,
          mb: 2,
        }}
      >
        {timeSlots.map(({ label, icon }) => (
          <Paper
            key={label}
            onClick={() => setArrivalTime(arrivalTime === label ? "" : label)}
            elevation={0}
            sx={{
              p: 1.2,
              textAlign: "center",
              borderRadius: "10px",
              cursor: "pointer",
              border:
                arrivalTime === label
                  ? "1.5px solid #1A914B"
                  : "1px solid #E3E8EE",
              backgroundColor: arrivalTime === label ? "#EAF7EF" : "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.3,
              "&:hover": { borderColor: "#1A914B" },
              transition: "all .15s",
            }}
          >
            <Box sx={{ color: arrivalTime === label ? "#1A914B" : "#888" }}>
              {icon}
            </Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: arrivalTime === label ? "#1A914B" : "#555",
                lineHeight: 1.3,
              }}
            >
              {label}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ borderStyle: "dashed", my: 2 }} />

      <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1, color: "#222" }}>
        Airlines
      </Typography>
      {uniqueAirlines.map((airline) => (
        <FormControlLabel
          key={airline}
          control={
            <Checkbox
              size="small"
              sx={checkboxStyle}
              checked={selectedAirlines.includes(airline)}
              onChange={() =>
                toggleItem(setSelectedAirlines, selectedAirlines, airline)
              }
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AirlineLogo name={airline} code="" size={24} />
              <Typography sx={{ fontSize: 13.5, color: "#444" }}>
                {airline}
              </Typography>
            </Box>
          }
          sx={{ ml: 0, display: "flex" }}
        />
      ))}
    </Paper>
  );

  // ─── Flight Card ──────────────────────────────────────────────────────────
  const FlightCard = ({ flight }) => {
    const meta = getFlightMeta(flight);
    if (!meta) return null;
    const {
      depTime,
      arrTime,
      durationHours,
      durationMinutes,
      stopsCount,
      stopLabel,
      airlineName,
      airlineCode,
      flightNumber,
      originCity,
      destCity,
      segs,
    } = meta;
    const price = flight.Fare?.PublishedFare;
    const baggage = segs[0]?.Baggage || "15 KG";
    const cabinBag = segs[0]?.CabinBaggage || "7 KG";
    const fareClass = segs[0]?.SupplierFareClass || "";
    const seatsLeft = segs[0]?.NoOfSeatAvailable;

    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 1.5,
          borderRadius: "14px",
          border: "1px solid #E3E8EE",
          bgcolor: "#fff",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            borderColor: "#ccc",
          },
          transition: "box-shadow .2s, border-color .2s",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1.8fr 1.2fr 1.4fr 1.2fr 1.4fr",
            },
            alignItems: "center",
            gap: { xs: 1.5, sm: 0 },
          }}
        >
          {/* Airline */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AirlineLogo name={airlineName} code={airlineCode} size={44} />
            <Box>
              <Typography
                sx={{ fontSize: 14.5, fontWeight: 600, color: "#222" }}
              >
                {airlineName}
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: "#888" }}>
                {airlineCode}-{flightNumber}
                {stopsCount > 0 &&
                  ` · ${stopsCount} stop${stopsCount > 1 ? "s" : ""}`}
              </Typography>
              <Box
                sx={{ display: "flex", gap: 0.5, mt: 0.3, flexWrap: "wrap" }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    color: flight.IsRefundable ? "#1A914B" : "#E57373",
                    fontWeight: 500,
                  }}
                >
                  {flight.IsRefundable ? "Refundable" : "Non-refundable"}
                </Typography>
                {fareClass && (
                  <Typography sx={{ fontSize: 11, color: "#888" }}>
                    · {fareClass}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Departure */}
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 13, sm: 17 },
                fontWeight: 700,
                color: "#222",
              }}
            >
              {depTime}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#888" }}>
              {originCity}
            </Typography>
          </Box>

          {/* Duration */}
          <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: "#F59E0B" }}
            >
              {durationHours}h {durationMinutes}m
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.3,
                my: 0.4,
                justifyContent: { xs: "flex-start", sm: "center" },
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#D1D5DB",
                }}
              />
              {segs.slice(0, -1).map((_, i) => (
                <React.Fragment key={i}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 1,
                      bgcolor: "#E5E7EB",
                      maxWidth: 40,
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#9CA3AF",
                    }}
                  />
                </React.Fragment>
              ))}
              <Box
                sx={{ flex: 1, height: 1, bgcolor: "#E5E7EB", maxWidth: 40 }}
              />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#D1D5DB",
                }}
              />
            </Box>
            <Typography sx={{ fontSize: 11.5, color: "#888" }}>
              {stopLabel}
            </Typography>
            {stopsCount > 0 && (
              <Typography sx={{ fontSize: 10.5, color: "#aaa" }}>
                via{" "}
                {segs
                  .slice(0, -1)
                  .map((s) => s.Destination?.Airport?.CityCode)
                  .join(", ")}
              </Typography>
            )}
          </Box>

          {/* Arrival */}
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 13, sm: 17 },
                fontWeight: 700,
                color: "#222",
              }}
            >
              {arrTime}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#888" }}>
              {destCity}
            </Typography>
          </Box>

          {/* Price + CTA */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              alignItems: { xs: "center", sm: "flex-end" },
              justifyContent: { xs: "space-between", sm: "center" },
              gap: 0.8,
            }}
          >
            <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
              <Typography
                sx={{
                  fontSize: { xs: 17, sm: 20 },
                  fontWeight: 700,
                  color: "#222",
                }}
              >
                ₹ {price?.toLocaleString("en-IN")}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                {seatsLeft <= 5 ? (
                  <span style={{ color: "#E57373", fontWeight: 600 }}>
                    {seatsLeft} seats left!
                  </span>
                ) : (
                  `${seatsLeft} seats`
                )}
              </Typography>
              <Typography sx={{ fontSize: 10.5, color: "#9ca3af" }}>
                Cabin: {cabinBag} · Check-in: {baggage}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedFlight(flight);
                setSidebarOpen(true);
              }}
              sx={{
                bgcolor: "#1A914B",
                "&:hover": { bgcolor: "#157a3e" },
                textTransform: "none",
                borderRadius: "8px",
                px: { xs: 2.5, sm: 3 },
                py: 1,
                fontSize: 13.5,
                fontWeight: 600,
                whiteSpace: "nowrap",
                boxShadow: "none",
              }}
            >
              Book Now
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      {/* ── Airplane Loader ── */}
      {isSearching && <AirplaneLoader />}

      {/* ── Embedded FlightSearch ── */}
      <FlightSearch
        initialFrom={searchMeta.fromCity}
        initialTo={searchMeta.toCity}
        initialDate={searchMeta.departureDate}
        onSearch={(result, params) => {
          setIsSearching(true);
          // loader thoda dikhao fir navigate
          setTimeout(() => {
            navigate("/flights/listing", {
              state: {
                searchResult: result,
                flights: result?.data?.results?.Results || [],
                ...params,
              },
              replace: true,
            });
            setIsSearching(false);
          }, 1500);
        }}
      />

      {/* Header info bar */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid #E3E8EE",
          px: { xs: 2, md: 4 },
          py: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 14, color: "#555" }}>
          <strong style={{ color: "#111" }}>
            {searchMeta.fromCity?.name || searchMeta.fromCity?.code || "Origin"}
          </strong>
          {" → "}
          <strong style={{ color: "#111" }}>
            {searchMeta.toCity?.name ||
              searchMeta.toCity?.code ||
              "Destination"}
          </strong>
          {searchMeta.departureDate && (
            <span style={{ marginLeft: 8, color: "#888" }}>
              {new Date(searchMeta.departureDate).toDateString()}
            </span>
          )}
          {searchMeta.passengers && (
            <span style={{ marginLeft: 8, color: "#888" }}>
              · {searchMeta.passengers.adults} Adult
              {searchMeta.passengers.children
                ? `, ${searchMeta.passengers.children} Child`
                : ""}
            </span>
          )}
          <span style={{ marginLeft: 8, color: "#1A914B", fontWeight: 600 }}>
            {rawFlights.length} flights found
          </span>
        </Typography>
      </Box>

      {/* Mobile Filter Toggle */}
      <Box sx={{ display: { xs: "flex", md: "none" }, px: 2, pt: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => setFilterOpen((p) => !p)}
          sx={{
            borderColor: "#1A914B",
            color: "#1A914B",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {filterOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        <Typography
          sx={{ fontSize: 13.5, color: "#555", alignSelf: "center", ml: 1 }}
        >
          {filteredFlights.length} results
        </Typography>
      </Box>

      {/* Main Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
          p: { xs: 2, sm: 2.5, md: 3 },
          maxWidth: 1280,
          mx: "auto",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: { xs: filterOpen ? "block" : "none", md: "block" },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <FilterPanel />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {filteredFlights.length > 0 && (
            <Box
              sx={{
                display: { xs: "none", sm: "grid" },
                gridTemplateColumns: "1.8fr 1.2fr 1.4fr 1.2fr 1.4fr",
                px: 2.5,
                py: 1.2,
                mb: 0.5,
              }}
            >
              {["Airline", "Departure", "Duration", "Arrival", "Price"].map(
                (h) => (
                  <Typography
                    key={h}
                    sx={{
                      fontSize: 12.5,
                      color: "#9CA3AF",
                      fontWeight: 500,
                      textAlign: h === "Price" ? "right" : "left",
                    }}
                  >
                    {h}
                  </Typography>
                ),
              )}
            </Box>
          )}

          {filteredFlights.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: "14px",
                border: "1px solid #E3E8EE",
                bgcolor: "#fff",
              }}
            >
              <Typography sx={{ fontSize: 17, color: "#555", fontWeight: 500 }}>
                {rawFlights.length === 0
                  ? "No flights data received"
                  : "No flights match your filters"}
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: "#9CA3AF", mt: 1 }}>
                {rawFlights.length === 0
                  ? "Please search again"
                  : "Try adjusting your filters"}
              </Typography>
            </Paper>
          ) : (
            filteredFlights.map((flight, i) => (
              <FlightCard key={flight.ResultIndex || i} flight={flight} />
            ))
          )}
        </Box>
      </Box>

      {/* ── Flight Detail Sidebar ── */}
      <FlightDetailSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        flight={selectedFlight}
        searchMeta={searchMeta}
      />
    </Box>
  );
};

export default FlightsListingPage;
