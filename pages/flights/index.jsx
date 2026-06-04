import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SwapHorizIcon         from "@mui/icons-material/SwapHoriz";
import LocationOnIcon        from "@mui/icons-material/LocationOn";
import CalendarTodayIcon     from "@mui/icons-material/CalendarToday";
import PeopleAltIcon         from "@mui/icons-material/PeopleAlt";
import SearchIcon            from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FlightTakeoffIcon     from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon        from "@mui/icons-material/FlightLand";

const GREEN  = "#16a34a";
const BORDER = "#e5e7eb";

const TRIP_TYPES = ["One Way", "Round Trip", "Multi City"];

const FIELDS_ONEWAY = [
  { id: "from",    label: "From",         value: "Mumbai (BOM)",     icon: <FlightTakeoffIcon sx={{ color: GREEN, fontSize: 19 }} /> },
  { id: "to",      label: "To",           value: "Delhi (DEL)",      icon: <FlightLandIcon    sx={{ color: GREEN, fontSize: 19 }} /> },
  { id: "depart",  label: "Depart Date",  value: "02 January 2024",  icon: <CalendarTodayIcon sx={{ color: GREEN, fontSize: 19 }} /> },
  { id: "guests",  label: "Travellers & Class", value: "1 Adult · Economy", icon: <PeopleAltIcon sx={{ color: GREEN, fontSize: 19 }} /> },
];

const FIELDS_ROUND = [
  { id: "from",    label: "From",         value: "Mumbai (BOM)",     icon: <FlightTakeoffIcon sx={{ color: GREEN, fontSize: 19 }} /> },
  { id: "to",      label: "To",           value: "Delhi (DEL)",      icon: <FlightLandIcon    sx={{ color: GREEN, fontSize: 19 }} /> },
  { id: "depart",  label: "Depart Date",  value: "02 January 2024",  icon: <CalendarTodayIcon sx={{ color: GREEN, fontSize: 19 }} /> },
  { id: "return",  label: "Return Date",  value: "09 January 2024",  icon: <CalendarTodayIcon sx={{ color: GREEN, fontSize: 19 }} /> },
  { id: "guests",  label: "Travellers & Class", value: "1 Adult · Economy", icon: <PeopleAltIcon sx={{ color: GREEN, fontSize: 19 }} /> },
];

const FlightsPage = () => {
  const [tripType, setTripType] = useState("One Way");

  const fields = tripType === "Round Trip" ? FIELDS_ROUND : FIELDS_ONEWAY;

  return (
    <Box sx={{ bgcolor: "#f0f4f8", minHeight: "100vh", px: { xs: 2, md: 4 }, pt: { xs: 2, md: 3 }, pb: { xs: 3, md: 5 } }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          p: { xs: "20px 16px", sm: "24px 24px", md: "28px 32px" },
          maxWidth: 1100,
          mx: "auto",
          width: "100%",
          boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Header ── */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{
              fontSize: { xs: "1.25rem", md: "1.65rem" },
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}
          >
            Book a Flight
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", mt: 0.5 }}>
            Fly smart, travel far!
          </Typography>
        </Box>

        {/* ── Trip Type Toggle ── */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={tripType}
            exclusive
            onChange={(e, val) => { if (val) setTripType(val); }}
            sx={{
              bgcolor: "#f3f4f6",
              borderRadius: "10px",
              p: "4px",
              gap: 0.5,
              "& .MuiToggleButtonGroup-grouped": {
                border: "none !important",
                borderRadius: "8px !important",
              },
            }}
          >
            {TRIP_TYPES.map((type) => (
              <ToggleButton
                key={type}
                value={type}
                sx={{
                  px: { xs: 2, md: 3 },
                  py: 0.8,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#555",
                  "&.Mui-selected": {
                    bgcolor: "#ffffff",
                    color: GREEN,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "#ffffff",
                  },
                }}
              >
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* ── Search Fields ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            border: `1.5px solid ${BORDER}`,
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>

              {/* Swap button — From aur To ke beech */}
              {index === 1 && (
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    left: `calc(${(1 / fields.length) * 100}% - 18px)`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    width: 36,
                    height: 36,
                    bgcolor: "#fff",
                    border: `1.5px solid ${BORDER}`,
                    borderRadius: "50%",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f0fdf4", borderColor: GREEN },
                    transition: "all 0.15s",
                  }}
                >
                  <SwapHorizIcon sx={{ fontSize: 18, color: GREEN }} />
                </Box>
              )}

              <Box
                sx={{
                  flex: 1,
                  px: 2.5, py: 1.8,
                  cursor: "pointer",
                  borderRight: {
                    md: index < fields.length - 1 ? `1.5px solid ${BORDER}` : "none",
                    xs: "none",
                  },
                  borderBottom: { xs: `1.5px solid ${BORDER}`, md: "none" },
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  gap: "7px", minWidth: 0,
                  transition: "background 0.15s",
                  "&:hover": { background: "#f9fafb" },
                }}
              >
                <Typography sx={{ fontSize: "0.71rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.15px" }}>
                  {field.label}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  {field.icon}
                  <Typography sx={{ fontSize: "0.92rem", fontWeight: 600, color: "#111827", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {field.value}
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ color: "#6b7280", fontSize: 18, flexShrink: 0 }} />
                </Box>
              </Box>
            </React.Fragment>
          ))}

          {/* Search Button */}
          <Box sx={{ display: "flex", alignItems: "center", px: { xs: 1.5, md: 1.2 }, py: { xs: 1.2, md: 1 }, bgcolor: "#fff", flexShrink: 0 }}>
            <Button
              startIcon={<SearchIcon sx={{ fontSize: "19px !important" }} />}
              sx={{
                background: GREEN, color: "#fff", fontWeight: 700,
                fontSize: "0.95rem", textTransform: "none",
                borderRadius: "10px",
                px: { xs: 3, md: 3 }, py: 1.6,
                width: { xs: "100%", md: "auto" },
                minWidth: { xs: 0, md: 130 },
                "&:hover": { background: "#15803d" },
                "&:active": { transform: "scale(0.97)" },
                transition: "background 0.2s, transform 0.1s",
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FlightsPage;