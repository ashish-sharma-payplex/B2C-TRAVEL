// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Paper,
//   Divider,
//   Button,
//   TextField,
//   MenuItem,
//   IconButton,
//   Collapse,
//   Chip,
//   Stepper,
//   Step,
//   StepLabel,
// } from "@mui/material";
// import {
//   FlightTakeoff,
//   ExpandMore,
//   ExpandLess,
//   ArrowBack,
//   Person,
//   LuggageOutlined,
//   ReceiptLong,
//   CheckCircle,
//   EventSeat,
//   FlightLand,
//   AccessTime,
//   Flight as FlightIcon,
//   Email,
//   Phone,
//   LocationOn,
// } from "@mui/icons-material";

// // Import plane logo image (replace with actual image path if available)
// // For demo, we'll use a data URL or you can replace with your actual image import
// // If you have an actual image file, uncomment the line below and use the variable
// // import planeLogo from "./assets/plane-logo.png"; // Example import
// const planeLogoUrl = "https://img.icons8.com/color/48/000000/airplane-takeoff.png"; // Placeholder URL - replace with actual image

// // ── tiny helpers ──────────────────────────────────────────────
// const fmt = (d) =>
//   d
//     ? new Date(d).toLocaleTimeString("en-IN", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       })
//     : "--";

// const fmtDate = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-IN", {
//         weekday: "short",
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "";

// const fmtDateMonthDay = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//       })
//     : "";

// const dur = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

// // ── passenger form per traveller ───────────────────────────────
// const TravellerForm = ({ index, type, data, onChange, isExpanded, onToggle }) => {
//   const field = (key, label, opts = {}) => (
//     <TextField
//       size="small"
//       label={label}
//       value={data[key] || ""}
//       onChange={(e) => onChange(index, key, e.target.value)}
//       fullWidth
//       sx={{
//         "& .MuiOutlinedInput-root": {
//           borderRadius: "8px",
//           backgroundColor: "#fff",
//         },
//         "& .MuiInputLabel-root": { fontSize: "12px" },
//         "& .MuiOutlinedInput-input": { fontSize: "13px", py: "10px" },
//       }}
//       {...opts}
//     />
//   );

//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         overflow: "hidden",
//         mb: 2,
//         transition: "all 0.2s",
//       }}
//     >
//       <Box
//         onClick={onToggle}
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           px: 2.5,
//           py: 1.5,
//           cursor: "pointer",
//           bgcolor: isExpanded ? "#fafcff" : "#fff",
//           "&:hover": { bgcolor: "#f5f7fa" },
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           <Box
//             sx={{
//               width: 36,
//               height: 36,
//               borderRadius: "50%",
//               bgcolor: "#E8F0FE",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Person sx={{ fontSize: 18, color: "#1A73E8" }} />
//           </Box>
//           <Box>
//             <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>
//               {type} {index + 1}
//               {data.firstName ? ` - ${data.firstName} ${data.lastName || ""}` : ""}
//             </Typography>
//             <Typography sx={{ fontSize: 11, color: "#5f6368" }}>
//               {data.passportNo ? "ID provided" : "ID required for travel"}
//             </Typography>
//           </Box>
//         </Box>
//         <IconButton size="small">
//           {isExpanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
//         </IconButton>
//       </Box>

//       <Collapse in={isExpanded}>
//         <Box
//           sx={{
//             px: 2.5,
//             py: 2.5,
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//             gap: 2,
//             borderTop: "1px solid #f0f0f0",
//             bgcolor: "#fff",
//           }}
//         >
//           <TextField
//             select
//             size="small"
//             label="Title"
//             value={data.title || ""}
//             onChange={(e) => onChange(index, "title", e.target.value)}
//             sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
//           >
//             {["Mr", "Mrs", "Ms", "Dr"].map((t) => (
//               <MenuItem key={t} value={t}>
//                 {t}
//               </MenuItem>
//             ))}
//           </TextField>

//           {field("firstName", "First Name")}
//           {field("lastName", "Last Name")}
//           {field("dob", "Date of Birth", { type: "date", InputLabelProps: { shrink: true } })}
//           {field("nationality", "Nationality")}
//           {field("passportNo", "Passport / ID No.")}
//           {field("passportExpiry", "Passport Expiry", {
//             type: "date",
//             InputLabelProps: { shrink: true },
//           })}
//         </Box>
//       </Collapse>
//     </Paper>
//   );
// };

// // ── flight summary card (like image) ───────────────────────────────────────
// const FlightSummaryCard = ({ flight, searchMeta }) => {
//   const segs = flight.Segments?.[0] || [];
//   const first = segs[0];
//   const last = segs[segs.length - 1];
//   const stopsCount = segs.length - 1;
//   const totalDuration = last?.AccumulatedDuration || first?.Duration || 0;

//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         border: "1px solid #e5e7eb",
//         borderRadius: "16px",
//         overflow: "hidden",
//         mb: 2,
//         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//       }}
//     >
//       {/* Header with route and date */}
//       <Box
//         sx={{
//           px: 2.5,
//           py: 1.5,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           borderBottom: "1px solid #f0f0f0",
//           bgcolor: "#fff",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <Box
//             sx={{
//               width: 28,
//               height: 28,
//               borderRadius: "8px",
//               bgcolor: "#E8F0FE",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <FlightTakeoff sx={{ fontSize: 14, color: "#1A73E8" }} />
//           </Box>
//           <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>
//             {first?.Origin?.Airport?.CityCode || "DEL"} → {last?.Destination?.Airport?.CityCode || "BOM"}
//           </Typography>
//         </Box>
//         <Typography sx={{ fontSize: 12, color: "#5f6368" }}>
//           {fmtDate(first?.Origin?.DepTime)}
//         </Typography>
//       </Box>

//       {/* Flight segments - simplified like image */}
//       <Box sx={{ p: 2.5 }}>
//         {segs.map((seg, idx) => {
//           const segDep = seg.Origin?.DepTime ? new Date(seg.Origin.DepTime) : null;
//           const segArr = seg.Destination?.ArrTime ? new Date(seg.Destination.ArrTime) : null;
//           const groundTime = seg.GroundTime;

//           return (
//             <React.Fragment key={idx}>
//               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#202124" }}>
//                     {fmt(segDep)}
//                   </Typography>
//                   <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#5f6368" }}>
//                     {seg.Origin?.Airport?.CityCode}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ textAlign: "center", flex: 1, mx: 2 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
//                     <FlightTakeoff sx={{ fontSize: 12, color: "#9aa0a6", transform: "rotate(45deg)" }} />
//                     <Typography sx={{ fontSize: 11, color: "#9aa0a6" }}>{dur(seg.Duration)}</Typography>
//                     <FlightLand sx={{ fontSize: 12, color: "#9aa0a6", transform: "rotate(-45deg)" }} />
//                   </Box>
//                   <Typography sx={{ fontSize: 10, color: "#9aa0a6" }}>
//                     {seg.Airline?.AirlineCode} {seg.Airline?.FlightNumber}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ textAlign: "right" }}>
//                   <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#202124" }}>
//                     {fmt(segArr)}
//                   </Typography>
//                   <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#5f6368" }}>
//                     {seg.Destination?.Airport?.CityCode}
//                   </Typography>
//                 </Box>
//               </Box>

//               {/* Baggage info */}
//               <Box
//                 sx={{
//                   mt: 1,
//                   mb: 1.5,
//                   p: 1,
//                   bgcolor: "#F8F9FA",
//                   borderRadius: "8px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                 }}
//               >
//                 <LuggageOutlined sx={{ fontSize: 14, color: "#5f6368" }} />
//                 <Typography sx={{ fontSize: 12, color: "#5f6368" }}>
//                   Cabin: <b>{seg.CabinBaggage || "7 kg"}</b>
//                 </Typography>
//                 <Typography sx={{ fontSize: 12, color: "#5f6368" }}>
//                   Check-in: <b>{seg.Baggage || "15 kg"}</b>
//                 </Typography>
//                 {seg.SupplierFareClass && (
//                   <Chip
//                     label={seg.SupplierFareClass}
//                     size="small"
//                     sx={{ fontSize: 10, height: 20, bgcolor: "#E8F0FE", color: "#1A73E8" }}
//                   />
//                 )}
//               </Box>

//               {/* Layover */}
//               {groundTime > 0 && idx < segs.length - 1 && (
//                 <Box
//                   sx={{
//                     my: 1.5,
//                     px: 2,
//                     py: 0.8,
//                     bgcolor: "#FFF8E7",
//                     borderRadius: "8px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                   }}
//                 >
//                   <AccessTime sx={{ fontSize: 14, color: "#E37400" }} />
//                   <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#E37400" }}>
//                     Layover: {Math.floor(groundTime / 60)}h {groundTime % 60}m at{" "}
//                     {seg.Destination?.Airport?.CityCode}
//                   </Typography>
//                 </Box>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </Box>
//     </Paper>
//   );
// };

// // ── fare summary card ─────────────────────────────────────────
// const FareSummaryCard = ({ flight, totalPassengers }) => {
//   const price = flight.Fare?.PublishedFare;
//   const totalPrice = price * totalPassengers;
//   const baseFare = flight.Fare?.BaseFare || price - (flight.Fare?.Tax || 0);
//   const tax = flight.Fare?.Tax || 0;

//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         border: "1px solid #e5e7eb",
//         borderRadius: "16px",
//         p: 2.5,
//         mb: 2,
//         bgcolor: "#fff",
//       }}
//     >
//       <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//         <ReceiptLong sx={{ fontSize: 18, color: "#1A73E8" }} />
//         <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>Fare Summary</Typography>
//       </Box>

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography sx={{ fontSize: 13, color: "#5f6368" }}>Base Fare × {totalPassengers}</Typography>
//           <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#202124" }}>
//             ₹ {(baseFare * totalPassengers).toLocaleString("en-IN")}
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography sx={{ fontSize: 13, color: "#5f6368" }}>Taxes & Fees</Typography>
//           <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#202124" }}>
//             ₹ {(tax * totalPassengers).toLocaleString("en-IN")}
//           </Typography>
//         </Box>
//         <Divider sx={{ my: 0.5 }} />
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#202124" }}>Total Amount</Typography>
//           <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1A73E8" }}>
//             ₹ {totalPrice.toLocaleString("en-IN")}
//           </Typography>
//         </Box>
//       </Box>

//       <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
//         <Chip
//           icon={flight.IsRefundable ? <CheckCircle sx={{ fontSize: 14 }} /> : null}
//           label={flight.IsRefundable ? "Partial Refundable" : "Non-refundable"}
//           size="small"
//           sx={{
//             fontSize: 11,
//             height: 24,
//             bgcolor: flight.IsRefundable ? "#E6F4EA" : "#FCE8E6",
//             color: flight.IsRefundable ? "#137333" : "#C5221F",
//           }}
//         />
//         <Chip
//           label={`${totalPassengers} Traveller${totalPassengers > 1 ? "s" : ""}`}
//           size="small"
//           sx={{ fontSize: 11, height: 24, bgcolor: "#F1F3F4", color: "#5f6368" }}
//         />
//       </Box>
//     </Paper>
//   );
// };

// // ── main page ─────────────────────────────────────────────────
// const BookTicket = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const flight = state?.flight;
//   const searchMeta = state?.searchMeta;

//   const totalPassengers =
//     (searchMeta?.passengers?.adults || 1) + (searchMeta?.passengers?.children || 0);

//   const [travellers, setTravellers] = useState(
//     Array.from({ length: totalPassengers }, () => ({}))
//   );
//   const [expandedIndex, setExpandedIndex] = useState(0);
//   const [contact, setContact] = useState({ email: "", phone: "+91 " });
//   const [billingAddress, setBillingAddress] = useState({
//     address: "",
//     city: "",
//     state: "",
//     nationality: "Indian",
//   });
//   const [showGST, setShowGST] = useState(false);
//   const [gstNumber, setGstNumber] = useState("");

//   const handleTravellerChange = (idx, key, val) => {
//     setTravellers((prev) => {
//       const updated = [...prev];
//       updated[idx] = { ...updated[idx], [key]: val };
//       return updated;
//     });
//   };

//   if (!flight) {
//     return (
//       <Box sx={{ p: 4, textAlign: "center" }}>
//         <Typography sx={{ color: "#5f6368", mb: 2 }}>
//           No flight data found. Please go back and select a flight.
//         </Typography>
//         <Button
//           variant="outlined"
//           onClick={() => navigate(-1)}
//           sx={{ textTransform: "none", borderRadius: "8px", color: "#1A73E8", borderColor: "#1A73E8" }}
//         >
//           Go Back
//         </Button>
//       </Box>
//     );
//   }

//   const segs = flight.Segments?.[0] || [];
//   const first = segs[0];
//   const last = segs[segs.length - 1];
//   const totalPrice = (flight.Fare?.PublishedFare || 0) * totalPassengers;

//   const passengerTypes = [
//     ...Array(searchMeta?.passengers?.adults || 1).fill("Adult"),
//     ...Array(searchMeta?.passengers?.children || 0).fill("Child"),
//   ];

//   // Steps for stepper
//   const steps = ["Traveller Details", "Contact & Billing", "Payment"];

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#F1F3F4" }}>
//       {/* ── top header like image ── */}
//       <Box
//         sx={{
//           bgcolor: "#fff",
//           px: { xs: 2, md: 4 },
//           py: 1.5,
//           borderBottom: "1px solid #e5e7eb",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <IconButton onClick={() => navigate(-1)} size="small" sx={{ color: "#5f6368" }}>
//             <ArrowBack sx={{ fontSize: 20 }} />
//           </IconButton>
//           {/* Plane Logo Image */}
//           <Box
//             component="img"
//             src={planeLogoUrl}
//             alt="Dealplex"
//             sx={{ height: 32, width: "auto" }}
//           />
//           <Box>
//             <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#202124" }}>
//               Dealplex
//             </Typography>
//             <Typography sx={{ fontSize: 12, color: "#5f6368" }}>
//               {first?.Origin?.Airport?.CityName} to {last?.Destination?.Airport?.CityName}
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Typography sx={{ fontSize: 13, color: "#5f6368", display: { xs: "none", sm: "block" } }}>
//             {fmtDate(first?.Origin?.DepTime)}
//           </Typography>
//           <Chip
//             label={`${totalPassengers} Traveller${totalPassengers > 1 ? "s" : ""}`}
//             size="small"
//             sx={{ bgcolor: "#E8F0FE", color: "#1A73E8" }}
//           />
//         </Box>
//       </Box>

//       {/* ── stepper ── */}
//       <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, pt: 3 }}>
//         <Stepper activeStep={0} alternativeLabel sx={{ mb: 3, "& .MuiStepLabel-label": { fontSize: "12px" } }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       {/* ── body ── */}
//       <Box
//         sx={{
//           maxWidth: 1100,
//           mx: "auto",
//           px: { xs: 2, md: 4 },
//           pb: 4,
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
//           gap: 3,
//           alignItems: "start",
//         }}
//       >
//         {/* ── LEFT: forms ── */}
//         <Box>
//           {/* Traveller Details Header with plane icon like image */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//             <EventSeat sx={{ fontSize: 20, color: "#1A73E8" }} />
//             <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#202124" }}>
//               Traveller Details
//             </Typography>
//             <Typography sx={{ fontSize: 12, color: "#5f6368", ml: "auto" }}>
//               Name should be same as in Government ID proof
//             </Typography>
//           </Box>

//           {travellers.map((t, i) => (
//             <TravellerForm
//               key={i}
//               index={i}
//               type={passengerTypes[i]}
//               data={t}
//               onChange={handleTravellerChange}
//               isExpanded={expandedIndex === i}
//               onToggle={() => setExpandedIndex(expandedIndex === i ? -1 : i)}
//             />
//           ))}

//           {/* Contact Information */}
//           <Paper
//             elevation={0}
//             sx={{
//               border: "1px solid #e5e7eb",
//               borderRadius: "16px",
//               p: 2.5,
//               mt: 2,
//               bgcolor: "#fff",
//             }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//               <Email sx={{ fontSize: 18, color: "#1A73E8" }} />
//               <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>
//                 Contact Information
//               </Typography>
//               <Typography sx={{ fontSize: 11, color: "#5f6368", ml: "auto" }}>
//                 Your ticket & flight details will be shared here
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//                 gap: 2,
//               }}
//             >
//               <TextField
//                 size="small"
//                 label="Mobile Number"
//                 type="tel"
//                 value={contact.phone}
//                 onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
//                 fullWidth
//                 InputProps={{ startAdornment: <Phone sx={{ fontSize: 16, color: "#9aa0a6", mr: 0.5 }} /> }}
//                 sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
//               />
//               <TextField
//                 size="small"
//                 label="Email Address"
//                 type="email"
//                 value={contact.email}
//                 onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
//                 fullWidth
//                 sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
//               />
//             </Box>
//           </Paper>

//           {/* Billing Information */}
//           <Paper
//             elevation={0}
//             sx={{
//               border: "1px solid #e5e7eb",
//               borderRadius: "16px",
//               p: 2.5,
//               mt: 2,
//               bgcolor: "#fff",
//             }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//               <LocationOn sx={{ fontSize: 18, color: "#1A73E8" }} />
//               <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>
//                 Billing Information
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//                 gap: 2,
//               }}
//             >
//               <TextField
//                 size="small"
//                 label="Address"
//                 value={billingAddress.address}
//                 onChange={(e) => setBillingAddress((p) => ({ ...p, address: e.target.value }))}
//                 fullWidth
//                 sx={{ gridColumn: { sm: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
//               />
//               <TextField
//                 size="small"
//                 label="City"
//                 value={billingAddress.city}
//                 onChange={(e) => setBillingAddress((p) => ({ ...p, city: e.target.value }))}
//                 fullWidth
//               />
//               <TextField
//                 size="small"
//                 label="State"
//                 value={billingAddress.state}
//                 onChange={(e) => setBillingAddress((p) => ({ ...p, state: e.target.value }))}
//                 fullWidth
//               />
//               <TextField
//                 size="small"
//                 label="Nationality"
//                 value={billingAddress.nationality}
//                 onChange={(e) => setBillingAddress((p) => ({ ...p, nationality: e.target.value }))}
//                 fullWidth
//               />
//             </Box>
//           </Paper>

//           {/* GST Details */}
//           <Box sx={{ mt: 2 }}>
//             <Button
//               onClick={() => setShowGST(!showGST)}
//               sx={{ textTransform: "none", color: "#1A73E8", fontSize: "13px", p: 0 }}
//             >
//               + I would like to add my GST Number
//             </Button>
//             {showGST && (
//               <TextField
//                 size="small"
//                 label="GST Number"
//                 value={gstNumber}
//                 onChange={(e) => setGstNumber(e.target.value)}
//                 fullWidth
//                 sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
//               />
//             )}
//           </Box>
//         </Box>

//         {/* ── RIGHT: summary ── */}
//         <Box sx={{ position: { md: "sticky" }, top: { md: 80 } }}>
//           <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#202124", mb: 1.5 }}>
//             Flight Summary
//           </Typography>

//           <FlightSummaryCard flight={flight} searchMeta={searchMeta} />
//           <FareSummaryCard flight={flight} totalPassengers={totalPassengers} />

//           {/* Fare Rules like image */}
//           <Paper
//             elevation={0}
//             sx={{
//               border: "1px solid #e5e7eb",
//               borderRadius: "16px",
//               p: 2.5,
//               mb: 2,
//               bgcolor: "#fff",
//             }}
//           >
//             <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#202124", mb: 1.5 }}>
//               Fare Rules
//             </Typography>
//             <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
//               <Box>
//                 <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#5f6368" }}>
//                   Time Frame to cancel
//                 </Typography>
//                 <Typography sx={{ fontSize: 10, color: "#9aa0a6" }}>
//                   Before 24 hrs: ₹3999
//                 </Typography>
//                 <Typography sx={{ fontSize: 10, color: "#9aa0a6" }}>
//                   24-4 hrs: ₹4999
//                 </Typography>
//               </Box>
//               <Box>
//                 <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#5f6368" }}>
//                   Time Frame to reschedule
//                 </Typography>
//                 <Typography sx={{ fontSize: 10, color: "#9aa0a6" }}>
//                   Before 24 hrs: ₹2999
//                 </Typography>
//                 <Typography sx={{ fontSize: 10, color: "#9aa0a6" }}>
//                   24-4 hrs: ₹2999
//                 </Typography>
//               </Box>
//             </Box>
//           </Paper>

//           {/* CTA */}
//           <Button
//             variant="contained"
//             fullWidth
//             sx={{
//               bgcolor: "#1A73E8",
//               "&:hover": { bgcolor: "#1557b0" },
//               textTransform: "none",
//               borderRadius: "12px",
//               py: 1.5,
//               fontSize: 15,
//               fontWeight: 600,
//               boxShadow: "none",
//             }}
//           >
//             Confirm & Pay &nbsp; ₹ {totalPrice.toLocaleString("en-IN")}
//           </Button>
//           <Typography sx={{ fontSize: 11, color: "#9aa0a6", textAlign: "center", mt: 1.5 }}>
//             By proceeding, you agree to our terms and conditions
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default BookTicket;

import { useState } from "react";
import { useLocation } from "react-router-dom";


const flightlogo = "/bookflighticon.svg";
const planlogo = "/planeicon.svg";

const ChevronDown = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlaneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const FARE_RULES = [
  {
    label: "Time Frame to cancel",
    sublabel: "Before scheduled departure time",
    column: "Airlines Fees\nper passenger",
    rows: [
      { desc: "Cancel Before 24 hours of departure time.", fee: "₹ 3999" },
      { desc: "Cancel within 24 hours & before 4 hours of departure time.", fee: "₹ 4999" },
    ],
  },
  {
    label: "Time Frame to rescheduled",
    sublabel: "Before scheduled departure time",
    column: "Airlines Fees\nper passenger",
    rows: [
      { desc: "Reschedule before 24 hours of departure time.", fee: "₹ 2999" },
      { desc: "Reschedule within 24 hours & before 4 hours of departure time.", fee: "₹ 2999" },
    ],
  },
];



export default function BookFlight() {
  const [flightExpanded, setFlightExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("fare");

  const location = useLocation();

const { flight, searchMeta } = location.state || {};

const segs = flight?.Segments?.[0] || [];

const firstSeg = segs[0];
const lastSeg = segs[segs.length - 1];

const totalPassengers =
  (searchMeta?.passengers?.adults || 0) +
  (searchMeta?.passengers?.children || 0) +
  (searchMeta?.passengers?.infants || 0);

  const BAGGAGE_RULES = [
  {
    type: "Cabin",
    allowance: firstSeg?.CabinBaggage || "-",
  },
  {
    type: "Check-in",
    allowance: firstSeg?.Baggage || "-",
  },
];

const formatTime = (date) =>
  date
    ? new Date(date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

const totalFare =
  (flight?.Fare?.PublishedFare || 0) * totalPassengers;



  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f0f4fa", minHeight: "310vh", padding: "24px 0 48px", maxWidth:"1440px" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .bk-container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .bk-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }
        @media (max-width: 768px) {
          .bk-grid { grid-template-columns: 1fr; }
        //   .bk-fare-summary { order: 2; margin-top: 16px; }
        }
        .card { background: #fff; border-radius: 12px; box-shadow: 0 1px 8px rgba(0,0,0,0.07); overflow: hidden; }
        .card + .card { margin-top: 16px; }
        .btn-link { background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
        .tab-active { border-bottom: 2px solid #16a34a; color: #16a34a; font-weight: 600; }
        .tab-inactive { border-bottom: 2px solid transparent; color: #6b7280; }
        .input-field {
          width: 100%; border: 1px solid #d1d5db; border-radius: 8px;
          padding: 11px 14px; font-size: 14px; color: #374151; outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,0.1); }
        .input-field::placeholder { color: #9ca3af; }
        .add-btn { color: #16a34a; font-size: 14px; font-weight: 500; cursor: pointer; background: none; border: none; font-family: inherit; display: flex; align-items: center; gap: 4px; padding: 2px 0; }
        .add-btn:hover { text-decoration: underline; }
        .section-divider { height: 1px; background: #f0f0f0; margin: 0; }
        .pill { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 500; border-radius: 999px; padding: 2px 10px; }
        .layover-badge {
          display: flex; align-items: center; justify-content: center;
          margin: 8px 0; gap: 8px;
        }
        .layover-badge span {
          font-size: 12px; color: #6b7280; background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 999px; padding: 3px 14px; font-weight: 500;
        }
        .layover-badge:before, .layover-badge:after {
          content: ''; flex: 1; height: 1px; background: #e5e7eb;
        }
        .flight-row { display: grid; grid-template-columns: 140px 1fr 1fr; gap: 12px; align-items: center; padding: 18px 20px 10px; }
        @media (max-width: 520px) {
          .flight-row { grid-template-columns: 1fr; gap: 8px; }
        }
        .timeline { display: flex; align-items: center; gap: 8px; }
        .timeline-line { flex: 1; height: 2px; background: #d1d5db; position: relative; }
        .timeline-dot { width: 8px; height: 8px; border-radius: 50%; border: 2px solid #9ca3af; background: #fff; flex-shrink: 0; }
        .fare-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; font-size: 14px; color: #374151; }
        .fare-row:not(:last-child) { border-bottom: 1px solid #f3f4f6; }
        .fare-total { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: #f9fafb; border-top: 2px solid #e5e7eb; }
        .travelers-section { padding: 20px; }
        .traveler-group { margin-bottom: 20px; }
        .traveler-title { font-size: 16px; font-weight: 600; color: #111827; }
        .traveler-count { font-size: 13px; color: #6b7280; }
        .contact-section { padding: 20px; }
        .billing-section { padding: 20px; }
        .input-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .input-grid-2 { grid-template-columns: 1fr; } }
        .section-header { padding: 18px 20px 12px; border-bottom: 1px solid #f3f4f6; }
        .section-header h3 { font-size: 16px; font-weight: 700; color: #111827; }
        .section-header p { font-size: 13px; color: #6b7280; margin-top: 2px; }
        .gst-section { padding: 20px; }
        .toggle { width: 36px; height: 20px; border-radius: 999px; background: #d1d5db; position: relative; cursor: pointer; border: none; transition: background 0.2s; }
        .toggle.on { background: #16a34a; }
        .toggle:after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: left 0.2s; }
        .toggle.on:after { left: 18px; }
        select.input-field { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='4 6 8 10 12 6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
        .mobile-prefix { display: flex; align-items: center; gap: 0; }
        .mobile-prefix select { border-radius: 8px 0 0 8px; border-right: none; width: 80px; background: #f9fafb; }
        .mobile-prefix input { border-radius: 0 8px 8px 0; flex: 1; }
        .rule-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .rule-table th { text-align: left; font-weight: 600; color: #111827; padding: 10px 14px; background: #f9fafb; font-size: 13px; }
        .rule-table th:last-child { text-align: right; }
        .rule-table td { padding: 10px 14px; color: #374151; border-top: 1px solid #f0f0f0; }
        .rule-table td:last-child { text-align: right; font-weight: 500; }
        .rule-group-header { background: #f3f4f6; }
        .rule-group-header td { font-weight: 700; font-size: 13px; color: #111827; padding: 10px 14px; }
      `}</style>

      <div className="bk-container">
        <div className="bk-grid">
          {/* LEFT COLUMN */}
          <div>
            {/* Flight Card */}
            <div className="card">
              {/* Flight Header */}
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", borderBottom: flightExpanded ? "1px solid #f3f4f6" : "none" }}
                onClick={() => setFlightExpanded(v => !v)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                     <img
                        src={flightlogo}
                           alt="Flight"
                       style={{ width: 38, height: 38, objectFit: "contain" }}
                         />
                     </div>
                  <div>
                   <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
  {firstSeg?.Origin?.Airport?.CityName} to{" "}
  {lastSeg?.Destination?.Airport?.CityName}
</div>

<div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
  {formatDate(firstSeg?.Origin?.DepTime)} •{" "}
  {firstSeg?.Airline?.AirlineName} •{" "}
  {Math.floor((lastSeg?.AccumulatedDuration || 0) / 60)}h{" "}
  {(lastSeg?.AccumulatedDuration || 0) % 60}m (
  {segs.length - 1} Stop{segs.length - 1 !== 1 ? "s" : ""})
</div>
                  </div>
                </div>
                <ChevronDown size={20} style={{ color: "#6b7280", transition: "transform 0.2s", transform: flightExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
              </div>

              {flightExpanded && (
                <>
              
                  {/* Flight Leg 1 */}
{segs.map((seg, idx) => (
  <div key={idx}>
    <div className="flight-row">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={flightlogo}
            alt="Flight"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1a56db",
            }}
          >
            {seg?.Airline?.AirlineName} ·{" "}
            {seg?.Airline?.AirlineCode}-{seg?.Airline?.FlightNumber}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            {seg?.Craft || ""}
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          {formatTime(seg?.Origin?.DepTime)}
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {seg?.Origin?.Airport?.CityName} (
          {seg?.Origin?.Airport?.AirportCode})
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          {seg?.Origin?.Airport?.AirportName}
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
              marginBottom: 6,
            }}
          >
            {Math.floor(seg.Duration / 60)}h {seg.Duration % 60}m
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div className="timeline-dot" />
            <div className="timeline-line" />
            <img
              src={planlogo}
              alt=""
              style={{
                width: 18,
                height: 18,
              }}
            />
            <div className="timeline-line" />
            <div className="timeline-dot" />
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {formatTime(seg?.Destination?.ArrTime)}
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {seg?.Destination?.Airport?.CityName} (
            {seg?.Destination?.Airport?.AirportCode})
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            {seg?.Destination?.Airport?.AirportName}
          </div>
        </div>
      </div>
    </div>

    {seg?.GroundTime > 0 && idx < segs.length - 1 && (
      <div style={{ padding: "0 20px" }}>
        <div className="layover-badge">
          <span>
            {Math.floor(seg.GroundTime / 60)}h {seg.GroundTime % 60}m
            {" "}Layover at{" "}
            {seg?.Destination?.Airport?.CityName}
          </span>
        </div>
      </div>
    )}
  </div>
))}
                  {/* Fare Rules / Baggage Tabs */}
                  <div style={{ borderTop: "1px solid #f3f4f6", margin: "0 0 0 0" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", padding: "0 20px", gap: 24 }}>
                      {["fare", "baggage"].map(tab => (
                        <button
                          key={tab}
                          className={`btn-link ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
                          style={{ padding: "13px 0", fontSize: 14, fontWeight: activeTab === tab ? 600 : 400, letterSpacing: 0.1 }}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab === "fare" ? "Fare Rules" : "Baggage"}
                        </button>
                      ))}
                    </div>

                    {activeTab === "fare" && (
                      <div style={{ padding: "0 0 12px" }}>
                        {FARE_RULES.map((group, gi) => (
                          <table key={gi} className="rule-table" style={{ marginBottom: gi === 0 ? 8 : 0 }}>
                            <thead>
                              <tr>
                                <th style={{ width: "60%" }}>
                                  <div style={{ fontWeight: 700, color: "#111827" }}>{group.label}</div>
                                  <div style={{ fontWeight: 400, color: "#9ca3af", fontSize: 12 }}>{group.sublabel}</div>
                                </th>
                                <th>
                                  <div style={{ whiteSpace: "pre-line", textAlign: "right" }}>{group.column}</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.rows.map((row, ri) => (
                                <tr key={ri}>
                                  <td>{row.desc}</td>
                                  <td style={{ fontWeight: 600, color: "#111827" }}>{row.fee}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ))}
                      </div>
                    )}

                    {activeTab === "baggage" && (
                      <div style={{ padding: "12px 20px" }}>
                        <table className="rule-table">
                          <thead>
                            <tr>
                              <th>Baggage Type</th>
                              <th style={{ textAlign: "right" }}>Allowance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {baggageRules.map((r, i) => (
                              <tr key={i}>
                                <td>{r.type}</td>
                                <td style={{ fontWeight: 600 }}>{r.allowance}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Travellers Details */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Travellers Details</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                  <UserIcon />
                  <span>Name should be same as in Government ID proof</span>
                </div>
              </div>
              <div className="travelers-section">
                {[
                  { label: "Adult (12+ yrs)", total: 2 },
                  { label: "Child (2-12 yrs)", total: 1 },
                  { label: "Infant (0-2 yrs)", total: 1 },
                ].map((g, i) => (
                  <div key={i} className="traveler-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span className="traveler-title">{g.label}</span>
                      <span className="traveler-count">0/{g.total} Added</span>
                    </div>
                    <button className="add-btn">
                      <span style={{ fontSize: 18, lineHeight: 1, marginRight: 2 }}>+</span>
                      {g.label === "Infant (0-2 yrs)" ? "Add Child" : `Add ${g.label.split(" ")[0]}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="section-header">
                <h3>Contact Information</h3>
                <p>Your ticket &amp; Flight details will be shared here</p>
              </div>
              <div className="contact-section">
                <div className="input-grid-2" style={{ marginBottom: 12 }}>
                  <div>
                    <div className="mobile-prefix">
                      <select className="input-field" style={{ width: 88, borderRadius: "8px 0 0 8px", borderRight: "none", background: "#f9fafb", paddingRight: 8 }}>
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+971</option>
                      </select>
                      <input className="input-field" style={{ borderRadius: "0 8px 8px 0", flex: 1 }} placeholder="8529637412" defaultValue="8529637412" type="tel" />
                    </div>
                  </div>
                  <input className="input-field" placeholder="Email Address" type="email" />
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="section-header">
                <h3>Billing Information</h3>
                <p>Your ticket &amp; Flight details will be shared here</p>
              </div>
              <div className="billing-section">
                <div style={{ marginBottom: 12 }}>
                  <input className="input-field" placeholder="Address" />
                </div>
                <div className="input-grid-2" style={{ marginBottom: 12 }}>
                  <input className="input-field" placeholder="City" />
                  <input className="input-field" placeholder="State" />
                </div>
                <div className="input-grid-2">
                  <div />
                  <select className="input-field">
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>UAE</option>
                    <option>Singapore</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GST Details */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="gst-section">
                <div style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 4 }}>GST Details</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>Use GST number to avail GST Benefits &amp; additional savings</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <GSTToggle />
                  <span style={{ fontSize: 14, color: "#374151" }}>I would like to add my GST Number</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Fare Summary */}
          <div className="bk-fare-summary">
            <div className="card" style={{ position: "sticky", top: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Fare Summary</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{totalPassengers} Traveller {totalPassengers > 1 ? "s" : ""}</span>
              </div>
              <div style={{ padding: "10px 0 0" }}>
                <div className="fare-row">
                  <span style={{ color: "#6b7280" }}>Fare Type</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>{flight?.IsRefundable ? "Refundable" : "Non Refundable"}</span>
                </div>
                <div className="fare-row">
  <span>Base Fare</span>
  <span style={{ fontWeight: 600 }}>
    ₹ {flight?.Fare?.BaseFare?.toLocaleString("en-IN")}
  </span>
</div>

<div className="fare-row">
  <span>Taxes & Fees</span>
  <span style={{ fontWeight: 600 }}>
    ₹ {flight?.Fare?.Tax?.toLocaleString("en-IN")}
  </span>
</div>
 </div>
              <div className="fare-total">
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Net Amount Payable</span>
                <span style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}>₹ {totalFare.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <button
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 8,
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#fff", fontSize: 15, fontWeight: 700, border: "none",
                    cursor: "pointer", letterSpacing: 0.3, boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
                    transition: "opacity 0.15s"
                  }}
                  onMouseOver={e => e.currentTarget.style.opacity = "0.92"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}
                >
                  Proceed to Payment
                </button>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Secured &amp; Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
}

function GSTToggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      className={`toggle${on ? " on" : ""}`}
      onClick={() => setOn(v => !v)}
      aria-pressed={on}
      aria-label="Toggle GST"
    />
  );
}



