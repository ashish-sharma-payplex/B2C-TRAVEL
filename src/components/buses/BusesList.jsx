// import React, { useState } from "react";
// import { Box, Typography, Button } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import EastIcon from "@mui/icons-material/East";
// import CommonBusFilterPanel from "./CustomFilterPanel";

// const GREEN = "#16a34a";

// // ─── Bus Card ─────────────────────────────────
// const BusCard = ({ bus }) => {
//   return (
//     <Box
//       sx={{
//         bgcolor: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         overflow: "hidden",
//         boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
//         transition: "box-shadow 0.2s",
//         "&:hover": { boxShadow: "0 6px 24px rgba(0,0,0,0.12)" },
//       }}
//     >
//       {/* Main Content */}
//       <Box sx={{ px: "18px", py: "16px" }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//           }}
//         >
//           {/* Left — Operator Info + Journey */}
//           <Box sx={{ flex: 1 }}>
//             <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#111" }}>
//               {bus.operatorName}
//             </Typography>
//             <Typography sx={{ fontSize: 13, color: "#6b7280", mt: "2px" }}>
//               {bus.busType}
//             </Typography>

//             {/* Journey Row */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 mt: "14px",
//               }}
//             >
//               {/* Departure */}
//               <Box>
//                 <Typography
//                   sx={{
//                     fontSize: 22,
//                     fontWeight: 700,
//                     color: "#111",
//                     lineHeight: 1,
//                   }}
//                 >
//                   {bus.departureTime}
//                 </Typography>
//                 <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "3px" }}>
//                   {bus.departureDate}, {bus.from}
//                 </Typography>
//               </Box>

//               {/* Duration + Arrow */}
//               <Box
//                 sx={{
//                   flex: 1,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: "4px",
//                 }}
//               >
//                 <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
//                   {bus.duration}
//                 </Typography>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     width: "100%",
//                   }}
//                 >
//                   <Box sx={{ flex: 1, height: "1px", bgcolor: "#d1d5db" }} />
//                   <EastIcon
//                     sx={{ fontSize: 14, color: "#9ca3af", mx: "2px" }}
//                   />
//                 </Box>
//               </Box>

//               {/* Arrival */}
//               <Box sx={{ textAlign: "right" }}>
//                 <Typography
//                   sx={{
//                     fontSize: 22,
//                     fontWeight: 700,
//                     color: "#111",
//                     lineHeight: 1,
//                   }}
//                 >
//                   {bus.arrivalTime}
//                 </Typography>
//                 <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "3px" }}>
//                   {bus.arrivalDate}, {bus.to}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>

//           {/* Right — Price + Button */}
//           <Box sx={{ textAlign: "right", ml: "24px", flexShrink: 0 }}>
//             <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
//               from
//             </Typography>
//             <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
//               ₹ {bus.price.toLocaleString("en-IN")}
//             </Typography>
//             <Button
//               variant="contained"
//               disableElevation
//               sx={{
//                 bgcolor: GREEN,
//                 color: "#fff",
//                 fontWeight: 600,
//                 fontSize: "0.8rem",
//                 textTransform: "none",
//                 borderRadius: "8px",
//                 px: 2,
//                 py: 0.7,
//                 mt: "8px",
//                 "&:hover": { bgcolor: "#15803d" },
//               }}
//             >
//               Select seats
//             </Button>
//             <Typography sx={{ fontSize: 12, color: "#6b7280", mt: "6px" }}>
//               {bus.seatsAvailable} Seats Available
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Footer Tags */}
//       <Box
//         sx={{
//           borderTop: "1px solid #f3f4f6",
//           px: "18px",
//           py: "10px",
//           display: "flex",
//           gap: "20px",
//           flexWrap: "wrap",
//         }}
//       >
//         {bus.footerTags.map((tag) => (
//           <Box
//             key={tag}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: "4px",
//               cursor: "pointer",
//               "&:hover .tag-text": { color: GREEN },
//             }}
//           >
//             <Typography
//               className="tag-text"
//               sx={{
//                 fontSize: 13,
//                 color: "#6b7280",
//                 transition: "color 0.15s",
//               }}
//             >
//               {tag}
//             </Typography>
//             <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// // ─── Main BusListing ──────────────────────────
// const BusListing = ({ buses = [], from = "", to = "" }) => {
//   const [filters, setFilters] = useState({
//     depSlots: { slot1: false, slot2: false, slot3: false, slot4: false },
//     busTypes: { ac: false, nonAc: false, seater: false, sleeper: false },
//     boardingPoints: [],
//     droppingPoints: [],
//   });

//   return (
//     <Box
//       sx={{
//         px: { xs: 2, md: 4 },
//         py: { xs: 3, md: 4 },
//         maxWidth: 1300,
//         mx: "auto",
//         display: "flex",
//         gap: 3,
//         alignItems: "flex-start",
//       }}
//     >
//       {/* LEFT — Common Filter Panel */}
//       <Box
//         sx={{
//           width: { xs: "100%", md: "260px" },
//           flexShrink: 0,
//           display: { xs: "none", md: "block" },
//           position: "sticky",
//           top: 80,
//         }}
//       >
//         <CommonBusFilterPanel filters={filters} setFilters={setFilters} />
//       </Box>

//       {/* RIGHT — Bus Cards */}
//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
//         {/* Header */}
//         <Box>
//           <Typography
//             sx={{
//               fontSize: { xs: 16, md: 20 },
//               fontWeight: 700,
//               color: "#111",
//             }}
//           >
//             {from && to ? `Buses from ${from} to ${to}` : "Available Buses"}
//           </Typography>
//           <Typography sx={{ fontSize: 13, color: "#6b7280", mt: 0.3 }}>
//             {buses.length} buses found
//           </Typography>
//         </Box>

//         {/* No Results */}
//         {buses.length === 0 && (
//           <Box
//             sx={{
//               textAlign: "center",
//               py: 8,
//               bgcolor: "#fff",
//               borderRadius: "12px",
//               border: "1px solid #e5e7eb",
//             }}
//           >
//             <Typography sx={{ fontSize: 40, mb: 2 }}>🚌</Typography>
//             <Typography
//               sx={{ fontSize: 16, fontWeight: 600, color: "#374151" }}
//             >
//               No buses found
//             </Typography>
//             <Typography sx={{ fontSize: 13, color: "#9ca3af", mt: 1 }}>
//               Try a different route or date
//             </Typography>
//           </Box>
//         )}

//         {/* Bus Cards */}
//         {buses.map((bus, index) => (
//           <BusCard key={bus.id ?? index} bus={bus} />
//         ))}

//         {/* All Loaded */}
//         {buses.length > 0 && (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               py: 2,
//               gap: 1.5,
//             }}
//           >
//             <Box sx={{ height: "1px", width: 60, bgcolor: "#e5e7eb" }} />
//             <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
//               All buses loaded
//             </Typography>
//             <Box sx={{ height: "1px", width: 60, bgcolor: "#e5e7eb" }} />
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default BusListing;
