// import React, { useState } from "react";



// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   ToggleButton,
//   ToggleButtonGroup,
// } from "@mui/material";
// import SwapHorizIcon         from "@mui/icons-material/SwapHoriz";
// import LocationOnIcon        from "@mui/icons-material/LocationOn";
// import CalendarTodayIcon     from "@mui/icons-material/CalendarToday";
// import PeopleAltIcon         from "@mui/icons-material/PeopleAlt";
// import SearchIcon            from "@mui/icons-material/Search";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import FlightTakeoffIcon     from "@mui/icons-material/FlightTakeoff";
// import FlightLandIcon        from "@mui/icons-material/FlightLand";

// const GREEN  = "#16a34a";
// const BORDER = "#e5e7eb";

// const TRIP_TYPES = ["One Way", "Round Trip", "Multi City"];

// const FIELDS_ONEWAY = [
//   { id: "from",    label: "From",         value: "Mumbai (BOM)",     icon: <FlightTakeoffIcon sx={{ color: GREEN, fontSize: 19 }} /> },
//   { id: "to",      label: "To",           value: "Delhi (DEL)",      icon: <FlightLandIcon    sx={{ color: GREEN, fontSize: 19 }} /> },
//   { id: "depart",  label: "Depart Date",  value: "02 January 2024",  icon: <CalendarTodayIcon sx={{ color: GREEN, fontSize: 19 }} /> },
//   { id: "guests",  label: "Travellers & Class", value: "1 Adult · Economy", icon: <PeopleAltIcon sx={{ color: GREEN, fontSize: 19 }} /> },
// ];

// const FIELDS_ROUND = [
//   { id: "from",    label: "From",         value: "Mumbai (BOM)",     icon: <FlightTakeoffIcon sx={{ color: GREEN, fontSize: 19 }} /> },
//   { id: "to",      label: "To",           value: "Delhi (DEL)",      icon: <FlightLandIcon    sx={{ color: GREEN, fontSize: 19 }} /> },
//   { id: "depart",  label: "Depart Date",  value: "02 January 2024",  icon: <CalendarTodayIcon sx={{ color: GREEN, fontSize: 19 }} /> },
//   { id: "return",  label: "Return Date",  value: "09 January 2024",  icon: <CalendarTodayIcon sx={{ color: GREEN, fontSize: 19 }} /> },
//   { id: "guests",  label: "Travellers & Class", value: "1 Adult · Economy", icon: <PeopleAltIcon sx={{ color: GREEN, fontSize: 19 }} /> },
// ];

// const FlightsPage = () => {
//   const [tripType, setTripType] = useState("One Way");

//   const fields = tripType === "Round Trip" ? FIELDS_ROUND : FIELDS_ONEWAY;

//   return (
//     <Box sx={{ bgcolor: "#f0f4f8", minHeight: "100vh", px: { xs: 2, md: 4 }, pt: { xs: 2, md: 3 }, pb: { xs: 3, md: 5 } }}>
//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: "16px",
//           p: { xs: "20px 16px", sm: "24px 24px", md: "28px 32px" },
//           maxWidth: 1100,
//           mx: "auto",
//           width: "100%",
//           boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
//         }}
//       >
//         {/* ── Header ── */}
//         <Box sx={{ mb: 2.5 }}>
//           <Typography
//             sx={{
//               fontSize: { xs: "1.25rem", md: "1.65rem" },
//               fontWeight: 800,
//               color: "#111827",
//               letterSpacing: "-0.3px",
//               lineHeight: 1.2,
//             }}
//           >
//             Book a Flight
//           </Typography>
//           <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", mt: 0.5 }}>
//             Fly smart, travel far!
//           </Typography>
//         </Box>

//         {/* ── Trip Type Toggle ── */}
//         <Box sx={{ mb: 3 }}>
//           <ToggleButtonGroup
//             value={tripType}
//             exclusive
//             onChange={(e, val) => { if (val) setTripType(val); }}
//             sx={{
//               bgcolor: "#f3f4f6",
//               borderRadius: "10px",
//               p: "4px",
//               gap: 0.5,
//               "& .MuiToggleButtonGroup-grouped": {
//                 border: "none !important",
//                 borderRadius: "8px !important",
//               },
//             }}
//           >
//             {TRIP_TYPES.map((type) => (
//               <ToggleButton
//                 key={type}
//                 value={type}
//                 sx={{
//                   px: { xs: 2, md: 3 },
//                   py: 0.8,
//                   fontSize: 13,
//                   fontWeight: 600,
//                   textTransform: "none",
//                   color: "#555",
//                   "&.Mui-selected": {
//                     bgcolor: "#ffffff",
//                     color: GREEN,
//                     boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
//                   },
//                   "&.Mui-selected:hover": {
//                     bgcolor: "#ffffff",
//                   },
//                 }}
//               >
//                 {type}
//               </ToggleButton>
//             ))}
//           </ToggleButtonGroup>
//         </Box>

//         {/* ── Search Fields ── */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", md: "row" },
//             alignItems: "stretch",
//             border: `1.5px solid ${BORDER}`,
//             borderRadius: "12px",
//             overflow: "hidden",
//             position: "relative",
//           }}
//         >
//           {fields.map((field, index) => (
//             <React.Fragment key={field.id}>

//               {/* Swap button — From aur To ke beech */}
//               {index === 1 && (
//                 <Box
//                   sx={{
//                     display: { xs: "none", md: "flex" },
//                     alignItems: "center",
//                     justifyContent: "center",
//                     position: "absolute",
//                     left: `calc(${(1 / fields.length) * 100}% - 18px)`,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     zIndex: 10,
//                     width: 36,
//                     height: 36,
//                     bgcolor: "#fff",
//                     border: `1.5px solid ${BORDER}`,
//                     borderRadius: "50%",
//                     cursor: "pointer",
//                     "&:hover": { bgcolor: "#f0fdf4", borderColor: GREEN },
//                     transition: "all 0.15s",
//                   }}
//                 >
//                   <SwapHorizIcon sx={{ fontSize: 18, color: GREEN }} />
//                 </Box>
//               )}

//               <Box
//                 sx={{
//                   flex: 1,
//                   px: 2.5, py: 1.8,
//                   cursor: "pointer",
//                   borderRight: {
//                     md: index < fields.length - 1 ? `1.5px solid ${BORDER}` : "none",
//                     xs: "none",
//                   },
//                   borderBottom: { xs: `1.5px solid ${BORDER}`, md: "none" },
//                   display: "flex", flexDirection: "column", justifyContent: "center",
//                   gap: "7px", minWidth: 0,
//                   transition: "background 0.15s",
//                   "&:hover": { background: "#f9fafb" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "0.71rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.15px" }}>
//                   {field.label}
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
//                   {field.icon}
//                   <Typography sx={{ fontSize: "0.92rem", fontWeight: 600, color: "#111827", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                     {field.value}
//                   </Typography>
//                   <KeyboardArrowDownIcon sx={{ color: "#6b7280", fontSize: 18, flexShrink: 0 }} />
//                 </Box>
//               </Box>
//             </React.Fragment>
//           ))}

//           {/* Search Button */}
//           <Box sx={{ display: "flex", alignItems: "center", px: { xs: 1.5, md: 1.2 }, py: { xs: 1.2, md: 1 }, bgcolor: "#fff", flexShrink: 0 }}>
//             <Button
//               startIcon={<SearchIcon sx={{ fontSize: "19px !important" }} />}
//               sx={{
//                 background: GREEN, color: "#fff", fontWeight: 700,
//                 fontSize: "0.95rem", textTransform: "none",
//                 borderRadius: "10px",
//                 px: { xs: 3, md: 3 }, py: 1.6,
//                 width: { xs: "100%", md: "auto" },
//                 minWidth: { xs: 0, md: 130 },
//                 "&:hover": { background: "#15803d" },
//                 "&:active": { transform: "scale(0.97)" },
//                 transition: "background 0.2s, transform 0.1s",
//               }}
//             >
//               Search
//             </Button>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default FlightsPage;




// import FlightHome from "../../src/components/flights/FlightHome.jsx";


// import Navbar from '../../components/Navbar/Navbar';

// const FlightsPage = () => {
//   return (
//     <>
//       {/* Tumcha existing Navbar */}
//       {/* <Navbar /> */}
      
//       {/* Flight Home Component */}
//       <FlightHome />
//     </>
//   );
// };

// export default FlightsPage;


  




import React, { useState } from "react";

// import CityDropdown from "../../src/components/flights/CityDropdown";
// import FlightDatePicker from "../../src/components/flights/DatePicker";
// import TravellersDropdown from "../../src/components/flights/TravellersDropdown";

import CityDropdown from "@/components/flights/CityDropdown";
import FlightDatePicker from "@/components/flights/DatePicker";
import TravellersDropdown from "@/components/flights/TravellersDropdown";

import { Box, Typography, Button, Paper, Grid } from "@mui/material";
import SwapHorizIcon           from "@mui/icons-material/SwapHoriz";
import CalendarTodayIcon       from "@mui/icons-material/CalendarToday";
import PeopleAltIcon           from "@mui/icons-material/PeopleAlt";
import SearchIcon              from "@mui/icons-material/Search";
import FlightTakeoffIcon       from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon          from "@mui/icons-material/FlightLand";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DirectionsRailwayIcon   from "@mui/icons-material/DirectionsRailway";
import DirectionsBusIcon       from "@mui/icons-material/DirectionsBus";
import HotelIcon               from "@mui/icons-material/Hotel";
import { useNavigate } from "react-router-dom";
const GREEN   = "#1A914B";
const BORDER  = "#E3E8EE";
const LIGHT_BG = "#F7FAFF";

const TRIP_TYPES = ["Oneway", "Round Trip"];

const popularRoutes = [
  { city: "Mumbai",    to: "Bengaluru, Goa, Delhi, Hyderabad",          img: "/mumbai.svg"    },
  { city: "New Delhi", to: "Mumbai, Goa, Banglore, Pune, Hyderabad",    img: "/newdelhi.svg"  },
  { city: "Ahmedabad", to: "Delhi, Mumbai, Pune, Bangalore",            img: "/ahmedabad.svg" },
  { city: "Pune",      to: "Mumbai, Bengaluru, Goa, Delhi, Hyderabad",  img: "/pune.svg"      },
  { city: "Jaipur",    to: "Delhi, Mumbai, Agra, Udaipur",              img: "/jaipur.svg"    },
  { city: "Goa",       to: "Hyderabad, Bengaluru, Pune, Mumbai",        img: "/panjigoa.svg"  },
  { city: "Shimla",    to: "Delhi, Chandigarh, Manali",                 img: "/shimla.svg"    },
  { city: "Manali",    to: "Delhi, Shimla, Chandigarh",                 img: "/manali.svg"    },
  { city: "Varanasi",  to: "Delhi, Mumbai, Kolkata, Lucknow",           img: "/varanasi.svg"  },
];

const navItems = [
  { label: "Flights", icon: <FlightTakeoffIcon sx={{ color: GREEN, fontSize: 20 }} />,        active: true  },
  { label: "Trains",  icon: <DirectionsRailwayIcon sx={{ color: "#555", fontSize: 20 }} />,   active: false },
  { label: "Buses",   icon: <DirectionsBusIcon sx={{ color: "#555", fontSize: 20 }} />,       active: false },
  { label: "Hotels",  icon: <HotelIcon sx={{ color: "#555", fontSize: 20 }} />,               active: false },
];

const FlightsPage = () => {


  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/flights/listing", {
      state: {
        tripType,
        fromCity,
        toCity,
        departureDate,
        returnDate,
      },
    });
  };




  const [tripType, setTripType] = useState("Oneway");

  
  const [fromCity, setFromCity] = useState({ code: "BOM", city: "Mumbai",   airport: "Chhatrapati Shivaji Maharaj Intl Airport", state: "Maharashtra" });
  const [toCity,   setToCity]   = useState({ code: "DEL", city: "New Delhi", airport: "Indira Gandhi International Airport",      state: "Delhi" });
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  return (
    <Box sx={{ bgcolor: "#f4f6fa", minHeight: "100vh", pb: 6 }}>

      {/* ── Category Nav ── */}
      <Box
        sx={{
          bgcolor: LIGHT_BG,
          borderBottom: `1px solid ${BORDER}`,
          px: { xs: 2, md: "120px" },
          py: 3,
          display: "flex",
          gap: "36px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {navItems.map(({ label, icon, active }) => (
          <Box
            key={label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              border: active ? `1px solid ${BORDER}` : "none",
              borderRadius: "60px",
              px: "20px",
              py: "12px",
              bgcolor: active ? "#fff" : "transparent",
              cursor: "pointer",
              "&:hover": { bgcolor: active ? "#fff" : "#edf5ff" },
              transition: "background 0.2s",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#F1F1F1",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
            <Typography fontWeight={500} fontSize={20}>{label}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ px: { xs: 2, md: "120px" }, mt: 3 }}>

        {/* ── Booking Card ── */}
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            p: 3,
            mb: 4,
            bgcolor: "#fff",
          }}
        >
          {/* Title Row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Typography fontWeight={500} fontSize={20} mb={0.5}>
                Flight Booking
              </Typography>
              <Typography fontSize={16} color="#5E5E5E">
                Book International and Domestic Flights
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: "#48A76F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                ?
              </Box>
              <Typography fontSize={14} color="#737373" fontWeight={500}>
                Need some help?
              </Typography>
            </Box>
          </Box>

          {/* Trip Type Radio */}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            {TRIP_TYPES.map((type) => (
              <Box
                key={type}
                onClick={() => setTripType(type)}
                sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `1px solid ${tripType === type ? GREEN : "#8F8F8F"}`,
                    bgcolor: "#F8F8F8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {tripType === type && (
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: GREEN }} />
                  )}
                </Box>
                <Typography fontSize={16} color="rgba(0,0,0,0.8)">{type}</Typography>
              </Box>
            ))}
          </Box>

          {/* Search Fields Row */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, alignItems: "flex-end" }}>

            {/* From */}
            <CityDropdown
              label="From"
              value={fromCity}
              onChange={setFromCity}
              excludeCode={toCity?.code}
              icon={<FlightTakeoffIcon sx={{ color: "#555", fontSize: 20 }} />}
            />

            {/* Swap */}

              <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box
                onClick={() => {
                  const temp = fromCity;
                  setFromCity(toCity);
                  setToCity(temp);
                }}
                sx={{
                  width: 36,
                  height: 36,
                  border: `1px solid #E6E8E7`,
                  borderRadius: "50%",
                  bgcolor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "#f0faf4", borderColor: GREEN },
                  transition: "all 0.2s",
                }}
              >
                <SwapHorizIcon sx={{ color: GREEN, fontSize: 20 }} />
              </Box>
            </Box>

            {/* To */}
            <CityDropdown
              label="To"
              value={toCity}
              onChange={setToCity}
              excludeCode={fromCity?.code}
              icon={<FlightLandIcon sx={{ color: "#555", fontSize: 20 }} />}
            />

            {/* Departure */}
            {/* <Box sx={{ flex: "0 1 150px", position: "relative" }}>
              <Box sx={{ position: "absolute", top: -12, left: 8, zIndex: 1, bgcolor: "#fff", px: 1, borderRadius: 1 }}>
                <Typography sx={{ color: "#555", fontSize: 12, fontWeight: 300 }}>Departure</Typography>
              </Box>
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, px: 1.5, py: "12px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", "&:hover": { borderColor: GREEN } }}>
                <CalendarTodayIcon sx={{ color: "#555", fontSize: 18 }} />
                <Typography fontSize={14} color="#191919">Fri, Feb 12</Typography>
              </Box>
            </Box> */}

            {/* Return — only Round Trip */}
            {/* {tripType === "Round Trip" && (
              <Box sx={{ flex: "0 1 150px", position: "relative" }}>
                <Box sx={{ position: "absolute", top: -12, left: 8, zIndex: 1, bgcolor: "#fff", px: 1, borderRadius: 1 }}>
                  <Typography sx={{ color: "#555", fontSize: 12, fontWeight: 300 }}>Return</Typography>
                </Box>
                <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, px: 1.5, py: "12px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", "&:hover": { borderColor: GREEN } }}>
                  <CalendarTodayIcon sx={{ color: "#555", fontSize: 18 }} />
                  <Typography fontSize={14} color="#aaa">Select date</Typography>
                </Box>
              </Box>
            )} */}

            <Box sx={{ display: "flex", gap: 2 }}>
              <FlightDatePicker
                label="Departure"
                value={departureDate}
                onChange={(newDate) => setDepartureDate(newDate)}
              />
              {tripType === "Round Trip" && (
                <FlightDatePicker
                  label="Return"
                  value={returnDate}
                  onChange={(newDate) => setReturnDate(newDate)}
                />
              )}
            </Box>


            

            {/* Travellers & Class */}
            <Box sx={{ flex: "0 1 170px", position: "relative" }}>
              <Box sx={{ position: "absolute", top: -12, left: 8, zIndex: 1, bgcolor: "#fff", px: 1, borderRadius: 1 }}>
                <Typography sx={{ color: "#555", fontSize: 12, fontWeight: 300 }}>Travellers &amp; Class</Typography>
              </Box>
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, px: 1.5, py: "12px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", "&:hover": { borderColor: GREEN } }}>
                <PeopleAltIcon sx={{ color: "#555", fontSize: 18 }} />
                <Typography fontSize={14} color="#191919">1 Adult · Economy</Typography>
              </Box>
            </Box>



            {/* Search Button */}
            {/* <Button
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{
                bgcolor: GREEN,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: 18,
                fontWeight: 500,
                textTransform: "none",
                height: 48,
                flexShrink: 0,
                "&:hover": { bgcolor: "#157a3c" },
              }}
            >
              Search
            </Button> */}
{/* 
        <Button
          variant="contained"
          color="success"
          onClick={handleSearch}
          
        >
          Search
        </Button> */}

<Button
  variant="contained"
  onClick={handleSearch}
  sx={{
    width: "120px",
    height: "48px", // MUI button practical height
    backgroundColor: "#1A914B",
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "18px",
    fontWeight: 500,
    fontFamily: "Inter",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#157a3c",
      boxShadow: "none",
    },
  }}
>
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    cursor: "pointer",
                    p: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#f0faf4" },
                    transition: "background 0.2s",
                  }}
                >

                  {/* <Box sx={{ display: "flex", gap: 2 }}>
                  <FlightDatePicker
                    label="Departure"
                    value={departureDate}
                    onChange={(newDate) => setDepartureDate(newDate)}
                  />
                  <FlightDatePicker
                    label="Return"
                    value={returnDate}
                    onChange={(newDate) => setReturnDate(newDate)}
                  />
                 </Box> */}


                  <Box
                    component="img"
                    src={route.img}
                    alt={route.city}
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "10px",
                      objectFit: "cover",
                      flexShrink: 0,
                      bgcolor: "#f0f4f8",
                    }}
                  />
                  <Box>
                    <Typography fontWeight={500} fontSize={20} color="#000">{route.city}</Typography>
                    <Typography fontSize={16} color="#757575" lineHeight="22px">To: {route.to}</Typography>
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

export default FlightsPage;