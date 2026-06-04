import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SearchIcon from "@mui/icons-material/Search";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const GREEN = "#1A914B";
const BORDER = "#E3E8EE";
const LIGHT_BG = "#F7FAFF";
const TRIP_TYPES = ["Oneway", "Round Trip"];

const popularRoutes = [
  { city: "Mumbai",    to: "Bengaluru, Goa, Delhi Hyderabad",           img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/320px-Mumbai_03-2016_30_Gateway_of_India.jpg" },
  { city: "Delhi",     to: "Mumbai, Goa, Banglore, Pune, Hyderabad",    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/India_Gate_in_New_Delhi_03-2016.jpg/320px-India_Gate_in_New_Delhi_03-2016.jpg" },
  { city: "Bengaluru", to: "Mumbai, Goa, Delhi, Hyderabad",             img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GardenCityBangalore.jpg/320px-GardenCityBangalore.jpg" },
  { city: "Chennai",   to: "Delhi, Coimbatore, Mumbai, Madurai",        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Marina_beach_-_panoramio_%282%29.jpg/320px-Marina_beach_-_panoramio_%282%29.jpg" },
  { city: "Pune",      to: "Mumbai, Bengaluru, Goa, Delhi, Hyderabad",  img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Shaniwar_Wada_at_Pune.jpg/320px-Shaniwar_Wada_at_Pune.jpg" },
  { city: "Hyderabad", to: "Mumbai, Delhi, Chennai, Kolkata",           img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Charminar.jpg/320px-Charminar.jpg" },
  { city: "Bengaluru", to: "Hyderabad, Mumbai, Goa, Chennai, Pune",     img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GardenCityBangalore.jpg/320px-GardenCityBangalore.jpg" },
  { city: "Goa",       to: "Hyderabad, Bengaluru, Pune, Mumbai",        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Calangute_beach.jpg/320px-Calangute_beach.jpg" },
  { city: "Ahmedabad", to: "Delhi, Mumbai, Pune, Bangalore",            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sabarmati_Ashram_main_building.jpg/320px-Sabarmati_Ashram_main_building.jpg" },
];

const FlightHome = () => {
  const [tripType, setTripType] = useState("Oneway");

  return (
    <Box sx={{ bgcolor: "#f4f6fa", minHeight: "100vh", pb: 6 }}>

      {/* ── Category Nav ── */}
      <Box sx={{ bgcolor: LIGHT_BG, borderBottom: `1px solid ${BORDER}`, px: { xs: 2, md: "120px" }, py: 3, display: "flex", gap: "36px", flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "Flights", icon: <FlightTakeoffIcon sx={{ color: GREEN, fontSize: 22 }} />, active: true },
          { label: "Trains",  icon: "🚂", active: false },
          { label: "Buses",   icon: "🚌", active: false },
          { label: "Hotels",  icon: "🏨", active: false },
        ].map(({ label, icon, active }) => (
          <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 2, border: active ? `1px solid ${BORDER}` : "none", borderRadius: "60px", px: "20px", py: "12px", bgcolor: active ? "#fff" : "transparent", cursor: "pointer" }}>
            {typeof icon === "string"
              ? <Box sx={{ width: 36, height: 36, bgcolor: "#F1F1F1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</Box>
              : icon}
            <Typography fontWeight={500} fontSize={20}>{label}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ px: { xs: 2, md: "120px" }, mt: 3 }}>

        {/* ── Booking Card ── */}
        <Paper elevation={0} sx={{ border: `1px solid ${BORDER}`, borderRadius: "16px", p: 3, mb: 4 }}>

          {/* Title */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography fontWeight={500} fontSize={20}>Flight Booking</Typography>
              <Typography fontSize={16} color="#5E5E5E">Book International and Domestic Flights</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
              <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: "#48A76F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>?</Box>
              <Typography fontSize={14} color="#737373" fontWeight={500}>Need some help?</Typography>
            </Box>
          </Box>

          {/* Trip Type */}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            {TRIP_TYPES.map((type) => (
              <Box key={type} onClick={() => setTripType(type)} sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
                <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: `1px solid ${tripType === type ? GREEN : "#8F8F8F"}`, bgcolor: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {tripType === type && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: GREEN }} />}
                </Box>
                <Typography fontSize={16} color="rgba(0,0,0,0.8)">{type}</Typography>
              </Box>
            ))}
          </Box>

          {/* Search Fields */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, alignItems: "flex-end" }}>

            {/* From */}
            <Box sx={{ flex: "1 1 200px", position: "relative" }}>
              <Box sx={{ position: "absolute", top: -12, left: 8, zIndex: 1, bgcolor: "#fff", px: 1 }}>
                <Typography variant="caption" sx={{ color: "#555", fontSize: 12 }}>From</Typography>
              </Box>
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, px: 1, py: "10px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}>
                <FlightTakeoffIcon sx={{ color: "#555", fontSize: 20 }} />
                <Typography fontSize={16} color="#333">BOM - Mumbai, IN</Typography>
              </Box>
            </Box>

            {/* Swap */}
            <Box sx={{ position: "relative", width: 0, flexShrink: 0 }}>
              <Box sx={{ position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, border: `1px solid #E6E8E7`, borderRadius: "50%", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, "&:hover": { bgcolor: "#f0faf4" } }}>
                <SwapHorizIcon sx={{ color: GREEN, fontSize: 20 }} />
              </Box>
            </Box>

            {/* To */}
            <Box sx={{ flex: "1 1 200px", position: "relative" }}>
              <Box sx={{ position: "absolute", top: -12, left: 8, zIndex: 1, bgcolor: "#fff", px: 1 }}>
                <Typography variant="caption" sx={{ color: "#555", fontSize: 12 }}>To</Typography>
              </Box>
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, px: 1, py: "10px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}>
                <FlightLandIcon sx={{ color: "#555", fontSize: 20 }} />
                <Typography fontSize={16} color="#333">DEL - New Delhi, IN</Typography>
              </Box>
            </Box>

            {/* Departure */}
            <Box sx={{ flex: "0 1 140px", position: "relative" }}>
              <Box sx={{ position: "absolute", top: -12, left: 8, zIndex: 1, bgcolor: "#fff", px: 1 }}>
                <Typography variant="caption" sx={{ color: "#555", fontSize: 12, fontWeight: 300 }}>Departure</Typography>
              </Box>
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, px: 1, py: "12px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}>
                <CalendarTodayIcon sx={{ color: "#555", fontSize: 18 }} />
                <Typography fontSize={14} color="#191919">Fri, Feb 12</Typography>
              </Box>
            </Box>

            {/* Return */}
            <Box sx={{ flex: "0 1 140px", position: "relative" }}>
              <Box sx={{ position: "absolute", top: -12, left: 8, zIndex: 1, bgcolor: "#fff", px: 1 }}>
                <Typography variant="caption" sx={{ color: "#555", fontSize: 12, fontWeight: 300 }}>Return</Typography>
              </Box>
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, px: 1, py: "12px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", opacity: tripType === "Round Trip" ? 1 : 0.5 }}>
                <CalendarTodayIcon sx={{ color: "#555", fontSize: 18 }} />
                <Typography fontSize={14} color="#aaa">Select date</Typography>
              </Box>
            </Box>

            {/* Travellers */}
            <Box sx={{ flex: "0 1 160px", position: "relative" }}>
              <Box sx={{ position: "absolute", top: -12, left: 8, zIndex: 1, bgcolor: "#fff", px: 1 }}>
                <Typography variant="caption" sx={{ color: "#555", fontSize: 12, fontWeight: 300 }}>Travellers &amp; Class</Typography>
              </Box>
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, px: 1, py: "12px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}>
                <PeopleAltIcon sx={{ color: "#555", fontSize: 18 }} />
                <Typography fontSize={14} color="#191919">1 Adult</Typography>
              </Box>
            </Box>

            {/* Search Btn */}
            <Button variant="contained" startIcon={<SearchIcon />}
              sx={{ bgcolor: GREEN, borderRadius: 2, px: 4, py: 1.5, fontSize: 18, fontWeight: 500, textTransform: "none", height: 48, flexShrink: 0, "&:hover": { bgcolor: "#157a3c" } }}>
              Search
            </Button>
          </Box>
        </Paper>

        {/* ── Popular Flight Routes ── */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Typography fontWeight={500} fontSize={18}>Popular Flight Routes</Typography>
            <LocalFireDepartmentIcon sx={{ color: "#FFA725", fontSize: 22 }} />
          </Box>

          <Grid container spacing={3}>
            {popularRoutes.map((route, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, cursor: "pointer", p: 1, borderRadius: 2, "&:hover": { bgcolor: "#f0faf4" }, transition: "background 0.2s" }}>
                  <Box component="img" src={route.img} alt={route.city}
                    sx={{ width: 70, height: 70, borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/70x70?text=" + route.city; }}
                  />
                  <Box>
                    <Typography fontWeight={500} fontSize={20} color="#000">{route.city}</Typography>
                    <Typography fontSize={16} color="#757575">To: {route.to}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Box>
    </Box>
  );
};

export default FlightHome;