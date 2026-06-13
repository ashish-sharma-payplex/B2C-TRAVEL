// import { useState, useMemo } from "react";
// import {
//   Box,
//   Typography,
//   Chip,
//   Button,
//   Divider,
//   Paper,
//   Tooltip,
//   Avatar,
//   Stack,
//   IconButton,
//   Tabs,
//   Tab,
//   Snackbar,
//   Alert,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
// import FlightLandIcon from "@mui/icons-material/FlightLand";
// import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
// import PersonIcon from "@mui/icons-material/Person";
// import ChildCareIcon from "@mui/icons-material/ChildCare";
// import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import CheckIcon from "@mui/icons-material/Check";

// // ─── Theme ───────────────────────────────────────────────────────────────────
// const theme = createTheme({
//   palette: {
//     primary: { main: "#1B6B3A", light: "#2E8B57", contrastText: "#fff" },
//     secondary: { main: "#F5A623", contrastText: "#fff" },
//     background: { default: "#F0F4F8", paper: "#FFFFFF" },
//     text: { primary: "#1A202C", secondary: "#4A5568" },
//   },
//   typography: {
//     fontFamily: "'Inter', 'Roboto', sans-serif",
//     h5: { fontWeight: 700, letterSpacing: "-0.5px" },
//     h6: { fontWeight: 600 },
//     subtitle2: { fontWeight: 600, fontSize: "0.78rem" },
//     caption: { fontSize: "0.72rem" },
//   },
//   shape: { borderRadius: 12 },
//   components: {
//     MuiPaper: { styleOverrides: { root: { boxShadow: "0 2px 16px rgba(0,0,0,0.07)" } } },
//     MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 8, fontWeight: 600 } } },
//     MuiChip: { styleOverrides: { root: { borderRadius: 6 } } },
//   },
// });

// // ─── Constants ────────────────────────────────────────────────────────────────
// const ROWS = 30;
// const COLS = ["A", "B", "C", "D", "E", "F"];
// const EXTRA_LEGROOM_ROWS = [1, 2, 12, 13];
// const EXIT_ROW = 12;

// const SEAT_PRICE = (row, col) => {
//   if (EXTRA_LEGROOM_ROWS.includes(row)) return col < 3 ? 1200 : 1500;
//   if (row <= 5) return 800;
//   if (row <= 15) return 500;
//   return 300;
// };

// const BOOKED_SEATS = new Set([
//   "1A","1D","2B","2E","3C","3F","4A","4B","5D","6C","7A","7F",
//   "8B","8E","9C","10D","10F","11A","12B","12E","13C","14A","14F",
//   "15B","16C","16D","17A","18F","19B","20C","20E","21A","22D","23F",
// ]);

// const SEGMENTS = [
//   { id: 0, from: "DEL", to: "NAG", label: "DEL → NAG", airline: "IndiGo", flight: "6E-5032" },
//   { id: 1, from: "NAG", to: "BOM", label: "NAG → BOM", airline: "IndiGo", flight: "6E-2218" },
// ];

// const PASSENGERS = [
//   { id: "P1", name: "Shivam C", type: "adult", icon: <PersonIcon fontSize="small" /> },
//   { id: "P2", name: "Rahul M", type: "adult", icon: <PersonIcon fontSize="small" /> },
//   { id: "P3", name: "Doney R", type: "adult", icon: <PersonIcon fontSize="small" />  },
// ];

// const FARE = {
//   adultCount: 3, adultPrice: 8866,
//   childCount: 0, childPrice: 4333,
//   infantCount: 0, infantPrice: 2000,
//   taxes: 2946,
// };

// const seatColor = (row, col, isBooked, isSelected, isHovered) => {
//   if (isBooked) return { bg: "#CBD5E0", border: "#A0AEC0", cursor: "not-allowed", text: "#718096" };
//   if (isSelected) return { bg: "#1B6B3A", border: "#145728", cursor: "pointer", text: "#fff" };
//   if (isHovered) return { bg: "#C6F6D5", border: "#1B6B3A", cursor: "pointer", text: "#1A202C" };
//   if (EXTRA_LEGROOM_ROWS.includes(row))
//     return { bg: "#EBF8FF", border: "#90CDF4", cursor: "pointer", text: "#2B6CB0" };
//   const price = SEAT_PRICE(row, col < 3 ? 0 : 3);
//   if (price >= 801) return { bg: "#EBF4FF", border: "#BEE3F8", cursor: "pointer", text: "#2C5282" };
//   if (price >= 301) return { bg: "#F0FFF4", border: "#9AE6B4", cursor: "pointer", text: "#276749" };
//   return { bg: "#FAFAFA", border: "#E2E8F0", cursor: "pointer", text: "#4A5568" };
// };

// // ─── Seat Component ───────────────────────────────────────────────────────────
// function Seat({ row, colIndex, col, selected, onSelect }) {
//   const key = `${row}${col}`;
//   const booked = BOOKED_SEATS.has(key);
//   const isSelected = selected === key;
//   const [hovered, setHovered] = useState(false);
//   const colors = seatColor(row, colIndex, booked, isSelected, hovered && !booked);
//   const price = SEAT_PRICE(row, colIndex);
//   const isXL = EXTRA_LEGROOM_ROWS.includes(row);

//   return (
//     <Tooltip
//       title={booked ? "Already booked" : `${col}${row} · ₹${price.toLocaleString()}${isXL ? " · XL Legroom" : ""}`}
//       arrow
//       placement="top"
//     >
//       <Box
//         onClick={() => !booked && onSelect(key)}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         sx={{
//           width: 36,
//           height: 34,
//           borderRadius: "6px 6px 4px 4px",
//           border: `1.5px solid ${colors.border}`,
//           bgcolor: colors.bg,
//           cursor: colors.cursor,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           transition: "all 0.15s ease",
//           transform: isSelected ? "scale(1.08)" : "scale(1)",
//           position: "relative",
//           flexShrink: 0,
//         }}
//       >
//         {booked ? (
//           <Box sx={{ width: 16, height: 16, position: "relative" }}>
//             <Box sx={{ position: "absolute", inset: 0, "&::before, &::after": {
//               content: '""', position: "absolute", width: "100%", height: "1.5px",
//               bgcolor: "#A0AEC0", top: "50%", left: 0, borderRadius: 1,
//             }, "&::before": { transform: "rotate(45deg)" }, "&::after": { transform: "rotate(-45deg)" } }} />
//           </Box>
//         ) : isSelected ? (
//           <CheckIcon sx={{ fontSize: 16, color: "#fff" }} />
//         ) : (
//           <Typography variant="caption" sx={{ color: colors.text, fontWeight: 600, fontSize: "0.6rem", lineHeight: 1 }}>
//             {isXL ? "XL" : ""}
//           </Typography>
//         )}
//       </Box>
//     </Tooltip>
//   );
// }

// // ─── Cabin Map ────────────────────────────────────────────────────────────────
// function CabinMap({ segmentIdx, passengerSelections, activePassenger, onSeatSelect }) {
//   const selectedForSegment = passengerSelections[segmentIdx] || {};
//   const allSelectedSeats = new Set(Object.values(selectedForSegment));

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
//       {/* Nose */}
//       <Box sx={{ width: 80, height: 40, borderRadius: "50% 50% 0 0", border: "2px solid #CBD5E0", borderBottom: "none", bgcolor: "#F7FAFC", mb: 1 }} />

//       {/* Column headers */}
//       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5, px: 1 }}>
//         {COLS.map((col, i) => (
//           <Box key={col} sx={{ display: "flex", alignItems: "center" }}>
//             {i === 3 && <Box sx={{ width: 28, textAlign: "center" }} />}
//             <Box sx={{ width: 36, textAlign: "center" }}>
//               <Typography variant="caption" sx={{ fontWeight: 700, color: "#718096", fontSize: "0.72rem" }}>{col}</Typography>
//             </Box>
//           </Box>
//         ))}
//       </Box>

//       {/* Rows */}
//       <Box sx={{ overflowY: "auto", maxHeight: 380, pr: 0.5, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#CBD5E0", borderRadius: 2 } }}>
//         {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) => (
//           <Box key={row}>
//             {row === EXIT_ROW && (
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1, px: 1 }}>
//                 <Box sx={{ flex: 1, height: "1px", bgcolor: "#FBD38D" }} />
//                 <Typography variant="caption" sx={{ color: "#C05621", fontWeight: 700, fontSize: "0.6rem", whiteSpace: "nowrap" }}>EXIT ROW</Typography>
//                 <Box sx={{ flex: 1, height: "1px", bgcolor: "#FBD38D" }} />
//               </Box>
//             )}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.4, px: 0.5 }}>
//               {COLS.map((col, i) => {
//                 const seatKey = `${row}${col}`;
//                 const isThisPassenger = selectedForSegment[activePassenger] === seatKey;
//                 const isOtherPassenger = allSelectedSeats.has(seatKey) && !isThisPassenger;

//                 return (
//                   <Box key={col} sx={{ display: "flex", alignItems: "center" }}>
//                     {i === 3 && (
//                       <Box sx={{ width: 28, textAlign: "center" }}>
//                         <Typography variant="caption" sx={{ color: "#A0AEC0", fontWeight: 600, fontSize: "0.62rem" }}>{row}</Typography>
//                       </Box>
//                     )}
//                     <Seat
//                       row={row}
//                       colIndex={i}
//                       col={col}
//                       selected={isThisPassenger ? seatKey : isOtherPassenger ? "__other__" : null}
//                       onSelect={(key) => onSeatSelect(segmentIdx, activePassenger, key)}
//                     />
//                   </Box>
//                 );
//               })}
//             </Box>
//           </Box>
//         ))}
//       </Box>

//       {/* Tail */}
//       <Box sx={{ width: 60, height: 30, borderRadius: "0 0 50% 50%", border: "2px solid #CBD5E0", borderTop: "none", bgcolor: "#F7FAFC", mt: 1 }} />
//     </Box>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function SeatSelection() {
//   const muiTheme = useTheme();
//   const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

//   const [activeSegment, setActiveSegment] = useState(0);
//   const [activePassenger, setActivePassenger] = useState("P1");
//   // { segmentIdx: { passengerId: seatKey } }
//   const [passengerSelections, setPassengerSelections] = useState({ 0: {}, 1: {} });
//   const [snackbar, setSnackbar] = useState({ open: false, message: "" });

//   const handleSeatSelect = (segIdx, passengerId, seatKey) => {
//     setPassengerSelections((prev) => {
//       const segData = { ...prev[segIdx] };
//       // Deselect if same seat clicked
//       if (segData[passengerId] === seatKey) {
//         delete segData[passengerId];
//       } else {
//         // Check not taken by another passenger
//         const takenBy = Object.entries(segData).find(([pid, sk]) => sk === seatKey && pid !== passengerId);
//         if (takenBy) {
//           setSnackbar({ open: true, message: `Seat ${seatKey} is already selected by ${PASSENGERS.find(p => p.id === takenBy[0])?.name}.` });
//           return prev;
//         }
//         segData[passengerId] = seatKey;
//       }
//       return { ...prev, [segIdx]: segData };
//     });
//   };

//   const seatCost = useMemo(() => {
//     let total = 0;
//     Object.entries(passengerSelections).forEach(([segIdx, segData]) => {
//       Object.entries(segData).forEach(([pid, seatKey]) => {
//         const row = parseInt(seatKey.slice(1));
//         const col = COLS.indexOf(seatKey[0]);
//         total += SEAT_PRICE(row, col);
//       });
//     });
//     return total;
//   }, [passengerSelections]);

//   const netTotal = FARE.adultPrice + FARE.childPrice + FARE.infantPrice + FARE.taxes + seatCost;

//   const eligiblePassengers = PASSENGERS.filter((p) => p.type !== "infant");

//   const totalSeatsSelected = Object.values(passengerSelections).reduce((acc, seg) => acc + Object.keys(seg).length, 0);
//   const maxSeats = SEGMENTS.length * eligiblePassengers.length;

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default", fontFamily: "'Inter', sans-serif" }}>
//         {/* ── Nav ── */}
//         <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E2E8F0", px: { xs: 2, md: 4 }, py: 1.5, display: "flex", alignItems: "center", gap: 3 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Box sx={{ bgcolor: "#1B6B3A", borderRadius: 2, p: 0.8 }}>
//               <FlightTakeoffIcon sx={{ color: "#fff", fontSize: 20 }} />
//             </Box>
//             <Typography variant="h6" sx={{ color: "#1B6B3A", fontWeight: 800, letterSpacing: "-0.5px" }}>dealplex</Typography>
//           </Box>
//           <Stack direction="row" spacing={3} sx={{ ml: "auto", display: { xs: "none", sm: "flex" } }}>
//             {["Flights", "Hotels", "Buses", "Trains"].map((item) => (
//               <Typography key={item} variant="body2" sx={{ color: item === "Flights" ? "#1B6B3A" : "#4A5568", fontWeight: item === "Flights" ? 700 : 400, cursor: "pointer" }}>{item}</Typography>
//             ))}
//           </Stack>
//           <Button variant="outlined" size="small" sx={{ ml: { xs: "auto", sm: 2 }, borderColor: "#1B6B3A", color: "#1B6B3A" }}>Login / Signup</Button>
//         </Box>

//         {/* ── Progress breadcrumb ── */}
//         <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E2E8F0", px: { xs: 2, md: 4 }, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
//           {["Flight Selection", "Traveller Details", "Seat Selection", "Payment"].map((step, i) => (
//             <Box key={step} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               {i > 0 && <ArrowForwardIosIcon sx={{ fontSize: 10, color: "#CBD5E0" }} />}
//               <Typography variant="caption" sx={{ fontWeight: i === 2 ? 700 : 400, color: i === 2 ? "#1B6B3A" : i < 2 ? "#A0AEC0" : "#CBD5E0" }}>
//                 {step}
//               </Typography>
//             </Box>
//           ))}
//         </Box>

//         {/* ── Body ── */}
//         <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1.5, md: 3 }, py: 3, display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>

//           {/* ── Left: Seat Selection Panel ── */}
//           <Paper sx={{ flex: 1, borderRadius: 3, overflow: "hidden" }}>
//             {/* Header */}
//             <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid #EDF2F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <AirlineSeatReclineNormalIcon sx={{ color: "#1B6B3A" }} />
//                 <Typography variant="h6" sx={{ color: "#1A202C" }}>Seat Selection</Typography>
//               </Box>
//               <Button size="small" endIcon={<ArrowForwardIosIcon fontSize="inherit" />} sx={{ color: "#1B6B3A" }}>Skip</Button>
//             </Box>

//             {/* Segment tabs */}
//             <Tabs
//               value={activeSegment}
//               onChange={(_, v) => setActiveSegment(v)}
//               variant="fullWidth"
//               sx={{
//                 borderBottom: "1px solid #EDF2F7",
//                 "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.82rem", color: "#718096" },
//                 "& .Mui-selected": { color: "#1B6B3A" },
//                 "& .MuiTabs-indicator": { bgcolor: "#1B6B3A" },
//               }}
//             >
//               {SEGMENTS.map((seg) => (
//                 <Tab
//                   key={seg.id}
//                   label={
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                       <FlightTakeoffIcon sx={{ fontSize: 14 }} />
//                       <span>{seg.label}</span>
//                     </Box>
//                   }
//                 />
//               ))}
//             </Tabs>

//             <Box sx={{ px: { xs: 1.5, md: 3 }, py: 2 }}>
//               {/* Airline info */}
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
//                 <Avatar sx={{ bgcolor: "#1B3A6B", width: 36, height: 36, fontSize: "0.7rem", fontWeight: 700 }}>6E</Avatar>
//                 <Box>
//                   <Typography variant="subtitle2">{SEGMENTS[activeSegment].airline}</Typography>
//                   <Typography variant="caption" sx={{ color: "#718096" }}>{SEGMENTS[activeSegment].flight} · {SEGMENTS[activeSegment].from} → {SEGMENTS[activeSegment].to}</Typography>
//                 </Box>
//               </Box>

//               {/* Passenger selector */}
//               <Typography variant="caption" sx={{ color: "#718096", fontWeight: 600, mb: 1, display: "block" }}>SELECT PASSENGER</Typography>
//               <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
//                 {eligiblePassengers.map((p) => {
//                   const seatKey = passengerSelections[activeSegment]?.[p.id];
//                   return (
//                     <Chip
//                       key={p.id}
//                       icon={p.icon}
//                       label={
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <span>{p.name}</span>
//                           {seatKey && (
//                             <Typography component="span" variant="caption" sx={{ color: activePassenger === p.id ? "#fff" : "#1B6B3A", fontWeight: 700 }}>· {seatKey}</Typography>
//                           )}
//                         </Box>
//                       }
//                       onClick={() => setActivePassenger(p.id)}
//                       variant={activePassenger === p.id ? "filled" : "outlined"}
//                       sx={{
//                         bgcolor: activePassenger === p.id ? "#1B6B3A" : "#fff",
//                         color: activePassenger === p.id ? "#fff" : "#1A202C",
//                         borderColor: activePassenger === p.id ? "#1B6B3A" : "#CBD5E0",
//                         "& .MuiChip-icon": { color: activePassenger === p.id ? "#fff" : "#1B6B3A" },
//                         fontWeight: 600,
//                         transition: "all 0.2s",
//                       }}
//                     />
//                   );
//                 })}
//               </Stack>

//               {/* Map + info */}
//               <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", sm: "row" } }}>
//                 {/* Left: passenger seat list */}
//                 <Box sx={{ minWidth: 160 }}>
//                   <Typography variant="caption" sx={{ color: "#718096", fontWeight: 600, display: "block", mb: 1 }}>ASSIGNED SEATS</Typography>
//                   <Stack spacing={1}>
//                     {eligiblePassengers.map((p) => {
//                       const seat = passengerSelections[activeSegment]?.[p.id];
//                       return (
//                         <Box key={p.id} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1, borderRadius: 2, bgcolor: activePassenger === p.id ? "#F0FFF4" : "#FAFAFA", border: "1px solid", borderColor: activePassenger === p.id ? "#9AE6B4" : "#EDF2F7", cursor: "pointer" }} onClick={() => setActivePassenger(p.id)}>
//                           <Avatar sx={{ width: 28, height: 28, bgcolor: activePassenger === p.id ? "#1B6B3A" : "#E2E8F0", fontSize: "0.65rem" }}>
//                             {p.name.charAt(0)}
//                           </Avatar>
//                           <Box>
//                             <Typography variant="caption" sx={{ fontWeight: 600, display: "block", lineHeight: 1.2 }}>{p.name}</Typography>
//                             {seat ? (
//                               <Typography variant="caption" sx={{ color: "#1B6B3A", fontWeight: 700 }}>Seat {seat}</Typography>
//                             ) : (
//                               <Typography variant="caption" sx={{ color: "#A0AEC0" }}>Not selected</Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       );
//                     })}
//                   </Stack>

//                   <Divider sx={{ my: 2 }} />

//                   {/* Legend */}
//                   <Typography variant="caption" sx={{ color: "#718096", fontWeight: 600, display: "block", mb: 1 }}>SEAT TYPE</Typography>
//                   {[
//                     { color: "#F0FFF4", border: "#9AE6B4", label: "₹300–800" },
//                     { color: "#EBF4FF", border: "#BEE3F8", label: "₹801–1500" },
//                     { color: "#EBF8FF", border: "#90CDF4", label: "XL Legroom" },
//                     { color: "#CBD5E0", border: "#A0AEC0", label: "Booked" },
//                     { color: "#1B6B3A", border: "#145728", label: "Selected" },
//                   ].map((item) => (
//                     <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.6 }}>
//                       <Box sx={{ width: 16, height: 14, borderRadius: "3px 3px 2px 2px", bgcolor: item.color, border: `1.5px solid ${item.border}`, flexShrink: 0 }} />
//                       <Typography variant="caption" sx={{ color: "#4A5568" }}>{item.label}</Typography>
//                     </Box>
//                   ))}
//                 </Box>

//                 {/* Right: cabin map */}
//                 <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
//                   <CabinMap
//                     segmentIdx={activeSegment}
//                     passengerSelections={passengerSelections}
//                     activePassenger={activePassenger}
//                     onSeatSelect={handleSeatSelect}
//                   />
//                 </Box>
//               </Box>
//             </Box>
//           </Paper>

//           {/* ── Right: Fare Summary ── */}
//           <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
//             <Paper sx={{ borderRadius: 3, overflow: "hidden", position: { md: "sticky" }, top: { md: 16 } }}>
//               <Box sx={{ px: 2.5, py: 2, bgcolor: "#1B6B3A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>Fare Summary</Typography>
//                 <Chip label={`${PASSENGERS.length} Travellers`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600, fontSize: "0.72rem" }} />
//               </Box>

//               <Box sx={{ px: 2.5, py: 2 }}>
//                 {/* Fare type */}
//                 <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//                   <Typography variant="body2" sx={{ color: "#718096" }}>Fare Type</Typography>
//                   <Chip label="Partial Refundable" size="small" sx={{ bgcolor: "#F0FFF4", color: "#1B6B3A", fontWeight: 600, border: "1px solid #9AE6B4", fontSize: "0.7rem" }} />
//                 </Box>

//                 <Divider sx={{ mb: 2 }} />

//                 {/* Breakdown */}
//                 {[
//                   { label: `Adult × ${FARE.adultCount}`, value: FARE.adultPrice },
//                   { label: `Child × ${FARE.childCount}`, value: FARE.childPrice },
//                   { label: `Infant × ${FARE.infantCount}`, value: FARE.infantPrice },
//                   { label: "Taxes & Fees", value: FARE.taxes },
//                 ].map((row) => (
//                   <Box key={row.label} sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
//                     <Typography variant="body2" sx={{ color: "#4A5568" }}>{row.label}</Typography>
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>₹{row.value.toLocaleString()}</Typography>
//                   </Box>
//                 ))}

//                 {/* Seat charges */}
//                 {seatCost > 0 && (
//                   <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
//                     <Typography variant="body2" sx={{ color: "#4A5568" }}>Seat Charges</Typography>
//                     <Typography variant="body2" sx={{ fontWeight: 500, color: "#1B6B3A" }}>+ ₹{seatCost.toLocaleString()}</Typography>
//                   </Box>
//                 )}

//                 <Divider sx={{ my: 2 }} />

//                 <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Net Amount Payable</Typography>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1B6B3A" }}>₹{netTotal.toLocaleString()}</Typography>
//                 </Box>

//                 {/* Progress */}
//                 <Box sx={{ mb: 2 }}>
//                   <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
//                     <Typography variant="caption" sx={{ color: "#718096" }}>Seats selected</Typography>
//                     <Typography variant="caption" sx={{ fontWeight: 600 }}>{totalSeatsSelected} / {maxSeats}</Typography>
//                   </Box>
//                   <Box sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", overflow: "hidden" }}>
//                     <Box sx={{ height: "100%", borderRadius: 3, bgcolor: "#1B6B3A", width: `${(totalSeatsSelected / maxSeats) * 100}%`, transition: "width 0.3s ease" }} />
//                   </Box>
//                 </Box>

//                 <Button
//                   fullWidth
//                   variant="contained"
//                   size="large"
//                   sx={{ bgcolor: "#1B6B3A", "&:hover": { bgcolor: "#145728" }, py: 1.4, fontSize: "0.9rem", fontWeight: 700, borderRadius: 2 }}
//                 >
//                   Continue to Payment
//                 </Button>

//                 <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1.5, color: "#A0AEC0" }}>
//                   You can also skip seat selection
//                 </Typography>
//               </Box>
//             </Paper>
//           </Box>
//         </Box>
//       </Box>

//       <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ open: false, message: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
//         <Alert severity="warning" onClose={() => setSnackbar({ open: false, message: "" })} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
//       </Snackbar>
//     </ThemeProvider>
//   );
// }

import { useState, useMemo } from "react";
import {
  Box, Typography, Chip, Button, Divider, Paper,
  Tooltip, Avatar, Stack, Tabs, Tab, Snackbar, Alert,
  useMediaQuery, useTheme,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    primary:    { main: "#1B6B3A", light: "#2E8B57", contrastText: "#fff" },
    secondary:  { main: "#F5A623", contrastText: "#fff" },
    background: { default: "#F0F4F8", paper: "#FFFFFF" },
    text:       { primary: "#1A202C", secondary: "#4A5568" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h6:       { fontWeight: 600 },
    subtitle2: { fontWeight: 600, fontSize: "0.78rem" },
    caption:   { fontSize: "0.72rem" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper:  { styleOverrides: { root: { boxShadow: "0 2px 16px rgba(0,0,0,0.07)" } } },
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 8, fontWeight: 600 } } },
    MuiChip:   { styleOverrides: { root: { borderRadius: 6 } } },
  },
});

// ─── Constants ────────────────────────────────────────────────────────────────
const ROWS                = 30;
const COLS                = ["A", "B", "C", "D", "E", "F"];
const EXTRA_LEGROOM_ROWS  = [1, 2, 12, 13];
const EXIT_ROW            = 12;

const SEAT_PRICE = (row, colIdx) => {
  if (EXTRA_LEGROOM_ROWS.includes(row)) return colIdx < 3 ? 1200 : 1500;
  if (row <= 5)  return 800;
  if (row <= 15) return 500;
  return 300;
};

const BOOKED_SEATS = new Set([
  "1A","1D","2B","2E","3C","3F","4A","4B","5D","6C","7A","7F",
  "8B","8E","9C","10D","10F","11A","12B","12E","13C","14A","14F",
  "15B","16C","16D","17A","18F","19B","20C","20E","21A","22D","23F",
]);

const SEGMENTS = [
  { id: 0, from: "DEL", to: "NAG", label: "DEL → NAG", airline: "IndiGo", flight: "6E-5032" },
  { id: 1, from: "NAG", to: "BOM", label: "NAG → BOM", airline: "IndiGo", flight: "6E-2218" },
];

const PASSENGERS = [
  { id: "P1", name: "Shivam C", type: "adult", icon: <PersonIcon fontSize="small" /> },
  { id: "P2", name: "Rahul M",  type: "adult", icon: <PersonIcon fontSize="small" /> },
  { id: "P3", name: "Doney R",  type: "adult", icon: <PersonIcon fontSize="small" /> },
];

const FARE = {
  adultCount: 3, adultPrice: 8866,
  childCount: 0, childPrice: 0,
  infantCount: 0, infantPrice: 0,
  taxes: 2946,
};

// ─── Seat colours ─────────────────────────────────────────────────────────────
const seatColor = (row, colIdx, isBooked, isSelected, isHovered) => {
  if (isBooked)   return { bg: "#CBD5E0", border: "#A0AEC0", cursor: "not-allowed", text: "#718096" };
  if (isSelected) return { bg: "#1B6B3A", border: "#145728", cursor: "pointer",     text: "#fff"    };
  if (isHovered)  return { bg: "#C6F6D5", border: "#1B6B3A", cursor: "pointer",     text: "#1A202C" };
  if (EXTRA_LEGROOM_ROWS.includes(row))
    return { bg: "#DBEAFE", border: "#93C5FD", cursor: "pointer", text: "#1D4ED8" };
  const price = SEAT_PRICE(row, colIdx);
  if (price >= 801) return { bg: "#EBF4FF", border: "#BEE3F8", cursor: "pointer", text: "#2C5282" };
  if (price >= 301) return { bg: "#F0FFF4", border: "#9AE6B4", cursor: "pointer", text: "#276749" };
  return             { bg: "#FAFAFA",  border: "#E2E8F0", cursor: "pointer", text: "#4A5568" };
};

// ─── Individual Seat ──────────────────────────────────────────────────────────
function Seat({ row, colIndex, col, isThisPassenger, isOtherPassenger, onSelect }) {
  const key     = `${row}${col}`;
  const booked  = BOOKED_SEATS.has(key);
  const [hov, setHov] = useState(false);

  // Treat "other passenger selected" seat as booked-look
  const effectiveBooked   = booked || isOtherPassenger;
  const effectiveSelected = isThisPassenger && !booked;
  const colors = seatColor(row, colIndex, effectiveBooked, effectiveSelected, hov && !effectiveBooked);
  const isXL   = EXTRA_LEGROOM_ROWS.includes(row);
  const price  = SEAT_PRICE(row, colIndex);

  const tooltipTitle = booked
    ? "Already booked"
    : isOtherPassenger
      ? "Selected by another passenger"
      : `${col}${row} · ₹${price.toLocaleString()}${isXL ? " · XL Legroom" : ""}`;

  return (
    <Tooltip title={tooltipTitle} arrow placement="top" enterDelay={300}>
      <Box
        onClick={() => !effectiveBooked && onSelect(key)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        sx={{
          width: 32, height: 30,
          borderRadius: "5px 5px 3px 3px",
          border: `1.5px solid ${colors.border}`,
          bgcolor: colors.bg,
          cursor: colors.cursor,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.13s ease",
          transform: effectiveSelected ? "scale(1.1)" : "scale(1)",
          flexShrink: 0,
          position: "relative",
          "&:hover": { zIndex: 2 },
        }}
      >
        {booked || isOtherPassenger ? (
          // X mark
          <Box sx={{
            width: 14, height: 14, position: "relative",
            "&::before, &::after": {
              content: '""', position: "absolute",
              width: "100%", height: "1.5px",
              bgcolor: "#A0AEC0", top: "50%", left: 0, borderRadius: 1,
            },
            "&::before": { transform: "rotate(45deg)" },
            "&::after":  { transform: "rotate(-45deg)" },
          }} />
        ) : effectiveSelected ? (
          <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
        ) : (
          <Typography sx={{ color: colors.text, fontWeight: 700, fontSize: "0.55rem", lineHeight: 1 }}>
            {isXL ? "XL" : ""}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

// ─── Plane-shaped Cabin Map ───────────────────────────────────────────────────
function CabinMap({ segmentIdx, passengerSelections, activePassenger, onSeatSelect }) {
  const selectedForSegment = passengerSelections[segmentIdx] || {};
  const allSelectedSeats   = new Set(Object.values(selectedForSegment));

  
  const SEAT_W  = 32;
  const GAP     = 4;
  const AISLE   = 24;
  const SIDE_W  = 3 * SEAT_W + 2 * GAP; // 104
  const TOTAL_W = SIDE_W * 2 + AISLE;   // 232
  const ROW_NUM_W = 20;
  const PLANE_W = TOTAL_W + ROW_NUM_W + 24; // extra padding inside plane

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}>

      {/* ── Plane SVG shell (nose + body outline) ── */}
      <Box sx={{ position: "relative", width: PLANE_W + 40 }}>

        {/* Plane nose (SVG arc) */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: "-2px" }}>
          <svg
            width={PLANE_W + 40}
            height={70}
            viewBox={`0 0 ${PLANE_W + 40} 70`}
            style={{ display: "block" }}
          >
            {/* Nose shape: starts as narrow point at top, expands to full width */}
            <path
              d={`M ${(PLANE_W + 40) / 2} 4
                  C ${(PLANE_W + 40) / 2 - 40} 20, ${(PLANE_W + 40) / 2 - 80} 45, 8 68
                  L ${PLANE_W + 32} 68
                  C ${(PLANE_W + 40) / 2 + 80} 45, ${(PLANE_W + 40) / 2 + 40} 20, ${(PLANE_W + 40) / 2} 4 Z`}
              fill="#F7FAFC"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
            {/* Cockpit window hint */}
            <ellipse cx={(PLANE_W + 40) / 2} cy={30} rx={18} ry={10}
              fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="1" />
            {/* Plane icon */}
            <text x={(PLANE_W + 40) / 2} y={34} textAnchor="middle"
              fontSize="11" fill="#4A5568" fontFamily="Arial">✈</text>
          </svg>
        </Box>

        {/* Plane body with seats */}
        <Box sx={{
          border: "1.5px solid #CBD5E0",
          borderTop: "none",
          borderRadius: "0 0 40px 40px",
          bgcolor: "#F7FAFC",
          px: "20px",
          pt: 1,
          pb: 3,
          position: "relative",
        }}>

          {/* Wing marks */}
          <Box sx={{
            position: "absolute", left: -18, top: "38%",
            width: 18, height: 60,
            background: "linear-gradient(to right, transparent, #CBD5E0)",
            borderRadius: "8px 0 0 8px",
          }} />
          <Box sx={{
            position: "absolute", right: -18, top: "38%",
            width: 18, height: 60,
            background: "linear-gradient(to left, transparent, #CBD5E0)",
            borderRadius: "0 8px 8px 0",
          }} />

          {/* Column header row: A B C | [row#] | D E F */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.8, pl: `${ROW_NUM_W / 2}px` }}>
            {/* Left cols A B C */}
            {["A","B","C"].map((col, i) => (
              <Box key={col} sx={{ width: SEAT_W, mr: i < 2 ? `${GAP}px` : 0, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#718096" }}>{col}</Typography>
              </Box>
            ))}
            {/* Aisle with row-number space */}
            <Box sx={{ width: AISLE + ROW_NUM_W, textAlign: "center" }} />
            {/* Right cols D E F */}
            {["D","E","F"].map((col, i) => (
              <Box key={col} sx={{ width: SEAT_W, ml: i > 0 ? `${GAP}px` : 0, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#718096" }}>{col}</Typography>
              </Box>
            ))}
          </Box>

          {/* Seat rows — scrollable */}
          <Box sx={{
            maxHeight: 400,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#CBD5E0", borderRadius: 2 },
          }}>
            {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) => {
              const isExit = row === EXIT_ROW;
              const isXLRow = EXTRA_LEGROOM_ROWS.includes(row);

              return (
                <Box key={row}>
                  {/* Exit row marker */}
                  {isExit && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 0.8, px: 0.5 }}>
                      <Box sx={{ flex: 1, height: "1px", bgcolor: "#FBD38D" }} />
                      <Typography sx={{ fontSize: "0.55rem", color: "#C05621", fontWeight: 800, letterSpacing: 1, whiteSpace: "nowrap" }}>
                        EXIT ROW
                      </Typography>
                      <Box sx={{ flex: 1, height: "1px", bgcolor: "#FBD38D" }} />
                    </Box>
                  )}

                  {/* XL legroom extra space indicator */}
                  {isXLRow && !isExit && (
                    <Box sx={{ height: 6, mx: 1, mb: 0.3,
                      borderBottom: "1.5px dashed #90CDF4",
                      display: "flex", alignItems: "flex-end", justifyContent: "center",
                    }}>
                      <Typography sx={{ fontSize: "0.5rem", color: "#2B6CB0", fontWeight: 600, lineHeight: 1 }}>
                        extra legroom
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", mb: `${GAP}px` }}>
                    {/* Left 3 seats: A B C */}
                    {[0,1,2].map((ci) => {
                      const col    = COLS[ci];
                      const seatKey = `${row}${col}`;
                      const isThis  = selectedForSegment[activePassenger] === seatKey;
                      const isOther = allSelectedSeats.has(seatKey) && !isThis;
                      return (
                        <Box key={col} sx={{ mr: ci < 2 ? `${GAP}px` : 0 }}>
                          <Seat
                            row={row} colIndex={ci} col={col}
                            isThisPassenger={isThis}
                            isOtherPassenger={isOther}
                            onSelect={(k) => onSeatSelect(segmentIdx, activePassenger, k)}
                          />
                        </Box>
                      );
                    })}

                    {/* Aisle + row number */}
                    <Box sx={{
                      width: AISLE + ROW_NUM_W,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Typography sx={{ fontSize: "0.6rem", color: "#A0AEC0", fontWeight: 600 }}>
                        {row}
                      </Typography>
                    </Box>

                    {/* Right 3 seats: D E F */}
                    {[3,4,5].map((ci) => {
                      const col     = COLS[ci];
                      const seatKey = `${row}${col}`;
                      const isThis  = selectedForSegment[activePassenger] === seatKey;
                      const isOther = allSelectedSeats.has(seatKey) && !isThis;
                      return (
                        <Box key={col} sx={{ ml: ci > 3 ? `${GAP}px` : 0 }}>
                          <Seat
                            row={row} colIndex={ci} col={col}
                            isThisPassenger={isThis}
                            isOtherPassenger={isOther}
                            onSelect={(k) => onSeatSelect(segmentIdx, activePassenger, k)}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Plane tail */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: "-2px" }}>
          <svg
            width={PLANE_W + 40}
            height={28}
            viewBox={`0 0 ${PLANE_W + 40} 28`}
            style={{ display: "block" }}
          >
            <path
              d={`M 8 0 L ${PLANE_W + 32} 0
                  C ${(PLANE_W + 40) / 2 + 60} 12, ${(PLANE_W + 40) / 2 + 30} 22, ${(PLANE_W + 40) / 2} 27
                  C ${(PLANE_W + 40) / 2 - 30} 22, ${(PLANE_W + 40) / 2 - 60} 12, 8 0 Z`}
              fill="#F7FAFC"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
          </svg>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SeatSelection() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const [activeSegment,       setActiveSegment]       = useState(0);
  const [activePassenger,     setActivePassenger]     = useState("P1");
  const [passengerSelections, setPassengerSelections] = useState({ 0: {}, 1: {} });
  const [snackbar,            setSnackbar]            = useState({ open: false, message: "" });

  const handleSeatSelect = (segIdx, passengerId, seatKey) => {
    setPassengerSelections((prev) => {
      const segData = { ...prev[segIdx] };
      if (segData[passengerId] === seatKey) {
        delete segData[passengerId];
      } else {
        const takenBy = Object.entries(segData).find(([pid, sk]) => sk === seatKey && pid !== passengerId);
        if (takenBy) {
          setSnackbar({ open: true, message: `Seat ${seatKey} is already selected by ${PASSENGERS.find(p => p.id === takenBy[0])?.name}.` });
          return prev;
        }
        segData[passengerId] = seatKey;
      }
      return { ...prev, [segIdx]: segData };
    });
  };

  const seatCost = useMemo(() => {
    let total = 0;
    Object.entries(passengerSelections).forEach(([, segData]) => {
      Object.entries(segData).forEach(([, seatKey]) => {
        const row    = parseInt(seatKey.slice(1));
        const colIdx = COLS.indexOf(seatKey[0]);
        total += SEAT_PRICE(row, colIdx);
      });
    });
    return total;
  }, [passengerSelections]);

  const netTotal = FARE.adultPrice + FARE.childPrice + FARE.infantPrice + FARE.taxes + seatCost;

  const eligiblePassengers  = PASSENGERS.filter((p) => p.type !== "infant");
  const totalSeatsSelected  = Object.values(passengerSelections).reduce((acc, s) => acc + Object.keys(s).length, 0);
  const maxSeats            = SEGMENTS.length * eligiblePassengers.length;

  const segSelected = passengerSelections[activeSegment] || {};

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>

        {/* ── Breadcrumb bar ── */}
        <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E2E8F0", px: { xs: 2, md: 4 }, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
          {["Flight Selection", "Traveller Details", "Seat Selection", "Payment"].map((step, i) => (
            <Box key={step} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {i > 0 && <ArrowForwardIosIcon sx={{ fontSize: 10, color: "#CBD5E0" }} />}
              <Typography variant="caption" sx={{
                fontWeight: i === 2 ? 700 : 400,
                color: i === 2 ? "#1B6B3A" : i < 2 ? "#A0AEC0" : "#CBD5E0",
              }}>{step}</Typography>
            </Box>
          ))}
        </Box>

        {/* ── Body ── */}
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1.5, md: 3 }, py: 3, display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>

          {/* ════ LEFT: Seat Selection Panel ════ */}
          <Paper sx={{ flex: 1, borderRadius: 3, overflow: "hidden" }}>

            {/* Panel header */}
            <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: "1px solid #EDF2F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AirlineSeatReclineNormalIcon sx={{ color: "#1B6B3A" }} />
                <Typography variant="h6" sx={{ color: "#1A202C", fontWeight: 700 }}>Seat Selection</Typography>
              </Box>
              <Button size="small" endIcon={<ArrowForwardIosIcon fontSize="inherit" />} sx={{ color: "#1B6B3A" }}>
                Skip
              </Button>
            </Box>

            {/* Segment selector — styled like image: flight badge tabs */}
            <Box sx={{ px: 3, pt: 2, pb: 1.5, borderBottom: "1px solid #EDF2F7", display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {SEGMENTS.map((seg) => (
                <Box
                  key={seg.id}
                  onClick={() => setActiveSegment(seg.id)}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    px: 2, py: 0.8,
                    borderRadius: 2,
                    border: "1.5px solid",
                    borderColor: activeSegment === seg.id ? "#1B6B3A" : "#E2E8F0",
                    bgcolor: activeSegment === seg.id ? "#F0FFF4" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <Box sx={{ width: 36, height: 36, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src="/bookflighticon.svg" alt="" style={{ width: 33, height: 33 }}
                      onError={(e) => { e.target.style.display = "none"; }} />
                    <FlightTakeoffIcon sx={{ fontSize: 14, color: "#fff", display: "none" }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ color: activeSegment === seg.id ? "#1B6B3A" : "#4A5568", fontWeight: 700 }}>
                    {seg.from} – {seg.to}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Main content: left info + right plane */}
            <Box sx={{ display: "flex", gap: 0, flexDirection: { xs: "column", sm: "row" } }}>

              {/* ── Left info pane ── */}
              <Box sx={{
                width: { xs: "100%", sm: 210 }, flexShrink: 0,
                borderRight: { sm: "1px solid #EDF2F7" },
                p: 2.5,
              }}>
                {/* Airline badge */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src="/bookflighticon.svg" alt="airline" style={{ width: 32, height: 32 }}
                      onError={(e) => { e.target.style.display = "none"; }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "#1A202C" }}>
                      {SEGMENTS[activeSegment].airline}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#718096" }}>
                      {SEGMENTS[activeSegment].flight}
                    </Typography>
                  </Box>
                </Box>

                {/* Passenger list with seat + price (like image) */}
                <Stack spacing={1} sx={{ mb: 2.5 }}>
                  {eligiblePassengers.map((p) => {
                    const seatKey = segSelected[p.id];
                    const row     = seatKey ? parseInt(seatKey.slice(1)) : null;
                    const colIdx  = seatKey ? COLS.indexOf(seatKey[0]) : null;
                    const price   = seatKey ? SEAT_PRICE(row, colIdx) : null;
                    const isActive = activePassenger === p.id;

                    return (
                      <Box
                        key={p.id}
                        onClick={() => setActivePassenger(p.id)}
                        sx={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          px: 1.5, py: 1,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: isActive ? "#9AE6B4" : "#EDF2F7",
                          bgcolor: isActive ? "#F0FFF4" : "#FAFAFA",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 26, height: 26, bgcolor: isActive ? "#1B6B3A" : "#E2E8F0", fontSize: "0.6rem" }}>
                            {p.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#1A202C", lineHeight: 1.2 }}>
                              {p.name}
                            </Typography>
                            {seatKey && (
                              <Typography sx={{ fontSize: "0.65rem", color: "#718096" }}>
                                Seat {seatKey}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        {price != null ? (
                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#1A202C" }}>
                            ₹{price.toLocaleString()}
                          </Typography>
                        ) : (
                          <Typography sx={{ fontSize: "0.65rem", color: "#A0AEC0" }}>—</Typography>
                        )}
                      </Box>
                    );
                  })}
                </Stack>

                {/* Seat type legend */}
                <Typography variant="caption" sx={{ color: "#718096", fontWeight: 700, display: "block", mb: 1, letterSpacing: 0.3 }}>
                  SEAT TYPE
                </Typography>
                <Stack spacing={0.7}>
                  {[
                    { bg: "#F0FFF4", border: "#9AE6B4", label: "₹300–800",   labelColor: "#276749" },
                    { bg: "#EBF4FF", border: "#BEE3F8", label: "₹801–1500",  labelColor: "#2C5282" },
                    { bg: "#DBEAFE", border: "#93C5FD", label: "XL Legroom", labelColor: "#1D4ED8" },
                    { bg: "#CBD5E0", border: "#A0AEC0", label: "Booked",     labelColor: "#718096" },
                    { bg: "#1B6B3A", border: "#145728", label: "Selected",   labelColor: "#1B6B3A" },
                    { bg: "#FAFAFA", border: "#E2E8F0", label: "Free",       labelColor: "#4A5568" },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{
                        width: 18, height: 16,
                        borderRadius: "4px 4px 3px 3px",
                        bgcolor: item.bg,
                        border: `1.5px solid ${item.border}`,
                        flexShrink: 0,
                      }} />
                      <Typography sx={{ fontSize: "0.68rem", color: item.labelColor, fontWeight: 500 }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                {/* Passenger selector chips */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" sx={{ color: "#718096", fontWeight: 700, display: "block", mb: 1, letterSpacing: 0.3 }}>
                  SELECT PASSENGER
                </Typography>
                <Stack spacing={0.8}>
                  {eligiblePassengers.map((p) => {
                    const seatKey = segSelected[p.id];
                    const isActive = activePassenger === p.id;
                    return (
                      <Chip
                        key={p.id}
                        icon={p.icon}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <span>{p.name}</span>
                            {seatKey && (
                              <Typography component="span" sx={{ fontSize: "0.65rem", fontWeight: 700, color: isActive ? "#fff" : "#1B6B3A" }}>
                                · {seatKey}
                              </Typography>
                            )}
                          </Box>
                        }
                        onClick={() => setActivePassenger(p.id)}
                        size="small"
                        sx={{
                          justifyContent: "flex-start",
                          bgcolor: isActive ? "#1B6B3A" : "#fff",
                          color: isActive ? "#fff" : "#1A202C",
                          border: "1.5px solid",
                          borderColor: isActive ? "#1B6B3A" : "#CBD5E0",
                          "& .MuiChip-icon": { color: isActive ? "#fff" : "#1B6B3A" },
                          fontWeight: 600,
                          fontSize: "0.72rem",
                          transition: "all 0.15s",
                          height: 30,
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>

              {/* ── Right: Plane Map ── */}
              <Box sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                pt: 3,
                pb: 3,
                px: 1,
                bgcolor: "#F7FAFC",
                overflowX: "auto",
              }}>
                <CabinMap
                  segmentIdx={activeSegment}
                  passengerSelections={passengerSelections}
                  activePassenger={activePassenger}
                  onSeatSelect={handleSeatSelect}
                />
              </Box>
            </Box>
          </Paper>

          {/* ════ RIGHT: Fare Summary ════ */}
          <Box sx={{ width: { xs: "100%", md: 290 }, flexShrink: 0 }}>
            <Paper sx={{ borderRadius: 3, overflow: "hidden", position: { md: "sticky" }, top: { md: 16 } }}>

              {/* Header */}
              <Box sx={{ px: 2.5, py: 2, bgcolor: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ color: "#132235", fontWeight: 700 }}>Fare Summary</Typography>
                <Chip
                  label={`${PASSENGERS.length} Travellers`} size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#132235", fontWeight: 600, fontSize: "0.7rem" }}
                />
              </Box>

              <Box sx={{ px: 2.5, py: 2 }}>
                {/* Fare type */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#718096" }}>Fare Type</Typography>
                  <Chip label="Partial Refundable" size="small"
                    sx={{ bgcolor: "#F0FFF4", color: "#1B6B3A", fontWeight: 600, border: "1px solid #9AE6B4", fontSize: "0.68rem" }} />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Breakdown */}
                {[
                  { label: `Adult × ${FARE.adultCount}`,   value: FARE.adultPrice   },
                  FARE.childCount  > 0 ? { label: `Child × ${FARE.childCount}`,   value: FARE.childPrice   } : null,
                  FARE.infantCount > 0 ? { label: `Infant × ${FARE.infantCount}`, value: FARE.infantPrice  } : null,
                  { label: "Taxes & Fees",                  value: FARE.taxes        },
                ].filter(Boolean).map((r) => (
                  <Box key={r.label} sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
                    <Typography variant="body2" sx={{ color: "#4A5568" }}>{r.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>₹{r.value.toLocaleString()}</Typography>
                  </Box>
                ))}

                {seatCost > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
                    <Typography variant="body2" sx={{ color: "#4A5568" }}>Seat Charges</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1B6B3A" }}>
                      + ₹{seatCost.toLocaleString()}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Net Amount Payable</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1B6B3A" }}>
                    ₹{netTotal.toLocaleString()}
                  </Typography>
                </Box>

                {/* Seat selection progress */}
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                    <Typography variant="caption" sx={{ color: "#718096" }}>Seats selected</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {totalSeatsSelected} / {maxSeats}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", overflow: "hidden" }}>
                    <Box sx={{
                      height: "100%", borderRadius: 3, bgcolor: "#1B6B3A",
                      width: `${maxSeats ? (totalSeatsSelected / maxSeats) * 100 : 0}%`,
                      transition: "width 0.35s ease",
                    }} />
                  </Box>
                </Box>

                <Button fullWidth variant="contained" size="large" sx={{
                  bgcolor: "#1B6B3A", "&:hover": { bgcolor: "#145728" },
                  py: 1.4, fontSize: "0.88rem", fontWeight: 700, borderRadius: 2,
                }}>
                  Continue to Payment
                </Button>

                <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1.5, color: "#A0AEC0" }}>
                  You can also skip seat selection
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setSnackbar({ open: false, message: "" })} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}