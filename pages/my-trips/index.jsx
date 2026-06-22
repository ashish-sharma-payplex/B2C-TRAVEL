// import React, { useEffect, useState } from "react";

// import {
//   getMyTrips,
//   getBookingDetails,
// } from "../../src/api/myTripsApi";

// import {
//   Box,
//   Paper,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Button,
//   Typography,
//   Card,
//   CardContent,
//   Divider,
//   Dialog,
//   DialogContent,
//   IconButton,
//   Grid,
// } from "@mui/material";
// import FlightIcon from "@mui/icons-material/Flight";
// import TrainIcon from "@mui/icons-material/Train";
// import HotelIcon from "@mui/icons-material/Hotel";
// import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import BusBooking from "../my-trips booking details/BusBooking";

// const GREEN = "#16a34a";

// const TicketSection = ({
//   title,
//   children,
// }) => {

//   return (

//     <Paper

//       elevation={0}

// sx={{

// p:2.5,

// border:"1px solid #e5e7eb",

// borderRadius:3,

// height:"170px",

// display:"flex",

// flexDirection:"column",

// justifyContent:"flex-start",

// boxSizing:"border-box",

// transition:"0.2s ease",

// "&:hover":{

// boxShadow:

// "0 4px 10px rgba(0,0,0,0.08)"

// }

// }}

//     >

//       <Typography

//         sx={{

//           fontWeight:700,

//           fontSize:16,

//           color:"#166534",

//           mb:2

//         }}

//       >

//         {title}

//       </Typography>

//       {children}

//     </Paper>

//   );

// };

// // Static data for different categories
// const STATIC_DATA = {
//   Flights: [
//     {
//       id: 1,
//       bookingId: "FL-2024-001",
//       from: "Mumbai (BOM)",
//       to: "Delhi (DEL)",
//       date: "2024-07-15",
//       time: "14:30",
//       airline: "IndiGo",
//       status: "Upcoming",
//       price: "₹4,500",
//     },
//     {
//       id: 2,
//       bookingId: "FL-2024-002",
//       from: "Bangalore (BLR)",
//       to: "Mumbai (BOM)",
//       date: "2024-06-20",
//       time: "10:15",
//       airline: "SpiceJet",
//       status: "Past",
//       price: "₹3,200",
//     },
//   ],
//   Trains: [
//     {
//       id: 3,
//       bookingId: "TR-2024-001",
//       from: "Delhi (DLI)",
//       to: "Agra (AGR)",
//       date: "2024-07-20",
//       time: "06:00",
//       train: "Rajdhani Express",
//       status: "Upcoming",
//       price: "₹1,200",
//     },
//     {
//       id: 4,
//       bookingId: "TR-2024-002",
//       from: "Mumbai (CSMT)",
//       to: "Pune (PHC)",
//       date: "2024-06-10",
//       time: "15:30",
//       train: "Intercity Express",
//       status: "Cancelled",
//       price: "₹800",
//     },
//   ],
//   Hotels: [
//     {
//       id: 5,
//       bookingId: "HT-2024-001",
//       name: "Taj Mahal Hotel",
//       location: "Delhi",
//       checkIn: "2024-07-15",
//       checkOut: "2024-07-18",
//       nights: 3,
//       status: "Upcoming",
//       price: "₹15,000/night",
//     },
//     {
//       id: 6,
//       bookingId: "HT-2024-002",
//       name: "Oberoi Mumbai",
//       location: "Mumbai",
//       checkIn: "2024-06-01",
//       checkOut: "2024-06-03",
//       nights: 2,
//       status: "Past",
//       price: "₹12,000/night",
//     },
//   ],
//   Cabs: [
//     {
//       id: 7,
//       bookingId: "CB-2024-001",
//       pickupLocation: "Mumbai Airport",
//       dropLocation: "Bandra",
//       date: "2024-07-16",
//       time: "18:00",
//       carType: "Sedan",
//       status: "Upcoming",
//       price: "₹800",
//     },
//     {
//       id: 8,
//       bookingId: "CB-2024-002",
//       pickupLocation: "Colaba",
//       dropLocation: "Fort",
//       date: "2024-06-15",
//       time: "10:30",
//       carType: "Hatchback",
//       status: "Failed",
//       price: "₹400",
//     },
//   ],
// };

// const CATEGORIES = [
//   { label: "Flights", icon: <FlightIcon /> },
//   { label: "Bus", icon: <TrainIcon /> },
//   { label: "Hotels", icon: <HotelIcon /> },
//   { label: "Trains", icon: <TrainIcon /> },
//   { label: "Cabs", icon: <DirectionsCarIcon /> },
// ];

// const STATUS_FILTERS = ["Upcoming", "Past", "Cancelled", "Failed"];

// const MyTrips = () => {


//   const [selectedCategory, setSelectedCategory] = useState("Flights");

//   const [selectedStatus, setSelectedStatus] = useState("Upcoming");

//   const [flightBookings, setFlightBookings] = useState([]);

//   const [selectedBooking, setSelectedBooking] = useState(null);

//   const [openDetails, setOpenDetails] = useState(false);

//   const [detailsLoading, setDetailsLoading] = useState(false);

//   const [loading, setLoading] = useState(false);



//       const fetchFlightBookings = async () => {

//       try {

//         setLoading(true);

//         const response = await getMyTrips();

//         console.log("API Response :", response);

//         if (response.results?.length > 0) {

//           const firstBooking = response.results[0];

//           const details = await getBookingDetails(
//             firstBooking.booking_id
//           );

//           console.log("Booking Details :", details);

//         }

//         setFlightBookings(response.results || []);

//       } catch (error) {

//         console.log("Flight Booking Error :", error);

//       } finally {

//         setLoading(false);

//       }

//     };

//       useEffect(() => {

//         fetchFlightBookings();

//       }, []);



//       const statusMap = {
//       Upcoming: "BOOKED",
//       Past: "TICKETED",
//       Cancelled: "CANCELLED",
//       Failed: "FAILED",
//     };



//   const filteredData =
//   selectedCategory === "Flights"

//     ? flightBookings.filter(
//         (item) => item.status === statusMap[selectedStatus]
//       )

//     : STATIC_DATA[selectedCategory]?.filter(
//         (item) => item.status === selectedStatus
//       ) || [];



//   console.log("Flight Bookings :", flightBookings);

//   const handleViewDetails = async (bookingId) => {

//   try {

//     setDetailsLoading(true);

//     const response = await getBookingDetails(bookingId);

//     console.log(
//       "Booking Details :",
//       response
//     );

//     setSelectedBooking(response.data);

//     setOpenDetails(true);

//   } catch (error) {

//     console.log(error);

//   } finally {

//     setDetailsLoading(false);

//   }

// };




// const handleOpenDetails = async (booking) => {

//   try {

//     setDetailsLoading(true);

//     const response = await getBookingDetails(
//       booking.booking_id
//     );

//     console.log(
//       "Booking Details :",
//       response
//     );

//     setSelectedBooking(
//       response.data
//     );

//     setOpenDetails(true);

//   } catch (error) {

//     console.log(error);

//   } finally {

//     setDetailsLoading(false);

//   }

// };

// const handleCloseDetails = () => {

//   setOpenDetails(false);

//   setSelectedBooking(null);

// };

//   const renderBookingCard = (booking) => {
//     return (
//       <Card
//         key={booking.id}
//         sx={{
//           mb: 2,
//           borderLeft: `4px solid ${GREEN}`,
//           transition: "all 0.3s ease",
//           "&:hover": {
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             transform: "translateY(-2px)",
//           },
//         }}
//       >
//         <CardContent>
//           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
//             <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
//               {/* {booking.bookingId} */}
//               {booking.booking_id}
//             </Typography>
//             <Typography
//               sx={{
//                 px: 1.5,
//                 py: 0.5,
//                 borderRadius: "6px",
//                 fontSize: 12,
//                 fontWeight: 600,

//                 bgcolor:
//                     booking.status === "BOOKED"
//                       ? "#fef3c7"
//                       : booking.status === "TICKETED"
//                       ? "#dbeafe"
//                       : booking.status === "CANCELLED"
//                       ? "#fee2e2"
//                       : "#f3f4f6",

//                   color:
//                     booking.status === "BOOKED"
//                       ? "#d97706"
//                       : booking.status === "TICKETED"
//                       ? "#0369a1"
//                       : booking.status === "CANCELLED"
//                       ? "#dc2626"
//                       : "#374151",




//               }}
//             >
//               {booking.status}
//             </Typography>
//           </Box>

//           {/* {selectedCategory === "Flights" && (
//             <>
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Route
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.from} → {booking.to}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ textAlign: "right" }}>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Airline
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.airline}
//                   </Typography>
//                 </Box>
//               </Box>
//               <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Date & Time
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.date} • {booking.time}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: "auto", textAlign: "right" }}>
//                   <Typography sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>
//                     {booking.price}
//                   </Typography>
//                 </Box>
//               </Box>
//             </>
//           )} */}

//           {selectedCategory === "Flights" && (

// <Box
//   sx={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexWrap: "wrap",
//     gap: 2,
//   }}
// >

// {/* Left */}

// <Box sx={{ flex: 3 }}>

//   <Typography
//     sx={{
//       fontSize: 18,
//       fontWeight: 700,
//       color: "#166534",
//       mb: 1,
//     }}
//   >
//     ✈️ Booking #{booking.booking_id}
//   </Typography>

//   <Box
//     sx={{
//       display: "flex",
//       flexWrap: "wrap",
//       gap: 4,
//     }}
//   >

//     <Box>

//       <Typography
//         sx={{
//           fontSize: 12,
//           color: "#666",
//         }}
//       >
//         PNR
//       </Typography>

//       <Typography
//         sx={{
//           fontWeight: 700,
//         }}
//       >
//         {booking.pnr}
//       </Typography>

//     </Box>

//     <Box>

//       <Typography
//         sx={{
//           fontSize: 12,
//           color: "#666",
//         }}
//       >
//         Created
//       </Typography>

//       <Typography
//         sx={{
//           fontWeight: 600,
//         }}
//       >
//         {new Date(
//           booking.created_at
//         ).toLocaleDateString()}
//       </Typography>

//     </Box>

//   </Box>

//   <Typography
//     sx={{
//       mt: 1,
//       fontSize: 13,
//       color: "#666",
//       wordBreak: "break-all",
//     }}
//   >

//     Order : {booking.order_id}

//   </Typography>

// </Box>


// {/* Right */}

// <Box
//   sx={{
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-end",
//     gap: 2,
//   }}
// >

// {/* <Typography

//   sx={{

//     px: 2,

//     py: 0.7,

//     borderRadius: 5,

//     fontWeight: 700,

//     fontSize: 12,

//     bgcolor:
//       booking.status === "TICKETED"
//         ? "#dcfce7"
//         : "#fef3c7",

//     color:
//       booking.status === "TICKETED"
//         ? "#166534"
//         : "#b45309",

//   }}

// >

// {booking.status}

// </Typography> */}

// <Button

// variant="contained"

// size="small"

// onClick={() => handleOpenDetails(booking)}

// sx={{

// textTransform:"none",

// bgcolor:"#16a34a",

// "&:hover":{

// bgcolor:"#15803d"

// }

// }}

// >

// {detailsLoading
//  ? "Loading..."
//  : "View Details"}

// </Button>

// </Box>

// </Box>

// )}

//           {selectedCategory === "Trains" && (
//             <>
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Route
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.from} → {booking.to}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ textAlign: "right" }}>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Train
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.train}
//                   </Typography>
//                 </Box>
//               </Box>
//               <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Departure
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.date} • {booking.time}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: "auto", textAlign: "right" }}>
//                   <Typography sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>
//                     {booking.price}
//                   </Typography>
//                 </Box>
//               </Box>
//             </>
//           )}

//           {selectedCategory === "Hotels" && (
//             <>
//               <Box sx={{ mb: 1 }}>
//                 <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                   Hotel Name
//                 </Typography>
//                 <Typography sx={{ fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}>
//                   {booking.name}
//                 </Typography>
//                 <Typography sx={{ fontSize: 12, color: "#666" }}>
//                   📍 {booking.location}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Check-in / Check-out
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a", fontSize: 13 }}>
//                     {booking.checkIn} / {booking.checkOut}
//                   </Typography>
//                   <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>
//                     ({booking.nights} nights)
//                   </Typography>
//                 </Box>
//                 <Box sx={{ textAlign: "right" }}>
//                   <Typography sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>
//                     {booking.price}
//                   </Typography>
//                 </Box>
//               </Box>
//             </>
//           )}

//           {selectedCategory === "Cabs" && (
//             <>
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Route
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.pickupLocation}
//                   </Typography>
//                   <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>
//                     → {booking.dropLocation}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ textAlign: "right" }}>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Car Type
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.carType}
//                   </Typography>
//                 </Box>
//               </Box>
//               <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
//                     Date & Time
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
//                     {booking.date} • {booking.time}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: "auto", textAlign: "right" }}>
//                   <Typography sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>
//                     {booking.price}
//                   </Typography>
//                 </Box>
//               </Box>
//             </>
//           )}

//           <Divider sx={{ my: 1 }} />

//           <Box sx={{ display: "flex", gap: 1 }}>
//             {/* <Button
//               size="small"
//               variant="outlined"
//               sx={{
//                 borderColor: GREEN,
//                 color: GREEN,
//                 fontWeight: 600,
//                 fontSize: 12,
//                 textTransform: "none",
//                 "&:hover": { bgcolor: "#f0fdf4" },
//               }}
//             >
//               View Details
//             </Button> */}
//             {booking.status === "Upcoming" && (
//               <Button
//                 size="small"
//                 variant="outlined"
//                 sx={{
//                   borderColor: "#ccc",
//                   color: "#666",
//                   fontWeight: 600,
//                   fontSize: 12,
//                   textTransform: "none",
//                   "&:hover": { borderColor: "#999" },
//                 }}
//               >
//                 Modify
//               </Button>
//             )}
//           </Box>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <>
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 3 }}>
//       {/* Container wrapper - centered */}
//       <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 } }}>
//         {/* Status Filter Buttons - Top Right */}
//         <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "flex-end" }}>
//           {STATUS_FILTERS.map((status) => (
//             <Button
//               key={status}
//               variant={selectedStatus === status ? "contained" : "outlined"}
//               onClick={() => setSelectedStatus(status)}
//               sx={{
//                 borderRadius: "20px",
//                 fontWeight: 600,
//                 fontSize: 13,
//                 textTransform: "none",
//                 px: 2.5,
//                 py: 1,
//                 ...(selectedStatus === status
//                   ? {
//                       bgcolor: GREEN,
//                       color: "#fff",
//                       borderColor: GREEN,
//                       "&:hover": { bgcolor: "#15803d" },
//                     }
//                   : {
//                       borderColor: "#ddd",
//                       color: "#666",
//                       "&:hover": { borderColor: GREEN, color: GREEN },
//                     }),
//               }}
//             >
//               {status}
//             </Button>
//           ))}
//         </Box>

//         {/* Main Content Wrapper - Flex with gap */}
//         <Box sx={{ display: "flex", gap: 3, minHeight: "calc(100vh - 150px)" }}>
//           {/* Left Sidebar Card */}
//           <Paper
//             elevation={0}
//             sx={{
//               width: 300,
//               bgcolor: "#ffffff",
//               borderRadius: "16px",
//               border: "1px solid #e8e8e8",
//               flexShrink: 0,
//               display: "flex",
//               flexDirection: "column",
//               height: "fit-content",
//               position: "sticky",
//               top: 24,
//             }}
//           >
//             <Box sx={{ p: 2.5, pb: 1.5 }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <CalendarMonthIcon sx={{ fontSize: 24, color: GREEN }} />
//                 <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
//                   My Trips
//                 </Typography>
//               </Box>
//             </Box>

//             <Divider />

//             <List sx={{ p: 0 }}>
//               {CATEGORIES.map((category) => (
//                 <ListItem
//                   key={category.label}
//                   disablePadding
//                   onClick={() => {
//                     setSelectedCategory(category.label);
//                     setSelectedStatus("Upcoming");
//                   }}
//                   sx={{
//                     bgcolor:
//                       selectedCategory === category.label ? "#f0fdf4" : "transparent",
//                   }}
//                 >
//                   <ListItemButton
//                     sx={{
//                       py: 1.5,
//                       px: 2,
//                       color:
//                         selectedCategory === category.label ? GREEN : "#666",
//                       fontWeight: selectedCategory === category.label ? 700 : 500,
//                       borderLeft:
//                         selectedCategory === category.label
//                           ? `3px solid ${GREEN}`
//                           : "3px solid transparent",
//                       transition: "all 0.2s ease",
//                       "&:hover": { bgcolor: "#fafafa" },
//                     }}
//                   >
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 40,
//                         color:
//                           selectedCategory === category.label
//                             ? GREEN
//                             : "#999",
//                       }}
//                     >
//                       {category.icon}
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={category.label}
//                       primaryTypographyProps={{
//                         fontSize: 14,
//                         fontWeight:
//                           selectedCategory === category.label ? 700 : 500,
//                         color:
//                           selectedCategory === category.label
//                             ? GREEN
//                             : "#333",
//                       }}
//                     />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//             </List>
//           </Paper>

//           {/* Right Content Card */}
//           <Paper
//             elevation={0}
//             sx={{
//               flex: 1,
//               bgcolor: "#ffffff",
//               borderRadius: "16px",
//               border: "1px solid #e8e8e8",
//               p: 4,
//               minHeight: "600px",
//             }}
//           >
//             {/* Booking Cards */}

//             {selectedCategory === "Bus" ? (

//   <BusBooking />

// ) : (

//   filteredData.length > 0 ? (

//     <Box>

//       {filteredData.map((booking) =>

//         renderBookingCard(booking)

//       )}

//     </Box>

//   ) : (

//     <Box

//       sx={{

//         display: "flex",

//         flexDirection: "column",

//         alignItems: "center",

//         justifyContent: "center",

//         minHeight: "500px",

//       }}

//     >

//       <Box

//         sx={{

//           mb: 3,

//           fontSize: 80,

//           opacity: 0.3,

//         }}

//       >

//         📅

//       </Box>

//       <Typography

//         sx={{

//           fontSize: 24,

//           fontWeight: 700,

//           color: "#1a1a1a",

//           mb: 1,

//         }}

//       >

//         No {selectedStatus} Bookings

//       </Typography>

//       <Typography

//         sx={{

//           color: "#666",

//           fontSize: 14,

//         }}

//       >

//         Looks like you don't have any{" "}

//         {selectedStatus.toLowerCase()}{" "}

//         {selectedCategory.toLowerCase()} bookings yet.

//       </Typography>

//       <Button

//         variant="contained"

//         sx={{

//           mt: 3,

//           bgcolor: GREEN,

//           textTransform: "none",

//           fontWeight: 600,

//           "&:hover": {

//             bgcolor: "#15803d",

//           },

//         }}

//       >

//         Book your next trip

//       </Button>

//     </Box>

//   )

// )}


//             {selectedCategory !== "Bus" && (

//             filteredData.length > 0 ? (
//               <Box>
//                 {filteredData.map((booking) => renderBookingCard(booking))}
//               </Box>
//             ) : (
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   minHeight: "500px",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     mb: 3,
//                     fontSize: 80,
//                     opacity: 0.3,
//                   }}
//                 >
//                   📅
//                 </Box>
//                 <Typography
//                   sx={{
//                     fontSize: 24,
//                     fontWeight: 700,
//                     color: "#1a1a1a",
//                     mb: 1,
//                   }}
//                 >
//                   No {selectedStatus} Bookings
//                 </Typography>
//                 <Typography sx={{ color: "#666", fontSize: 14 }}>
//                   Looks like you don't have any {selectedStatus.toLowerCase()} {selectedCategory.toLowerCase()} bookings yet.
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   sx={{
//                     mt: 3,
//                     bgcolor: GREEN,
//                     textTransform: "none",
//                     fontWeight: 600,
//                     "&:hover": { bgcolor: "#15803d" },
//                   }}
//                 >
//                   Book your next trip
//                 </Button>
//               </Box>
//             )
//             )}
          
//           </Paper>
//         </Box>
//       </Box>
//     </Box>

// <Dialog

// open={openDetails}

// onClose={handleCloseDetails}

// fullWidth

// maxWidth="lg"

// PaperProps={{

// sx:{

// borderRadius:6,

// overflow:"hidden",

// width:"100%",

// maxWidth:"950px",

// maxHeight:"85vh",

// boxShadow:

// "0 20px 50px rgba(0,0,0,0.15)"

// }

// }}

// >

// <DialogContent sx={{ p: 0 }}>

// {selectedBooking && (

// (() => {

// const itinerary =
// selectedBooking.raw?.FlightItinerary;

// const segment =
// itinerary?.Segments?.[0];

// const passenger =
// itinerary?.Passenger?.[0];

// const fare =
// itinerary?.Fare;

// const invoice =
// itinerary?.Invoice?.[0];

// const ticket =
// passenger?.Ticket;

// return (

// <Box>

// <Box

// sx={{

// bgcolor:"#16a34a",

// color:"#fff",

// p:3

// }}

// >

// <Typography

// sx={{

// fontSize:24,

// fontWeight:700

// }}

// >

// ✈️ Flight Ticket

// </Typography>

// <Typography>

// PNR : {selectedBooking.pnr}

// </Typography>

// </Box>


// <Box

// sx={{

// p:4,

// bgcolor:"#fafafa"

// }}

// >

// <Grid

// container

// spacing={3}

// alignItems="stretch"

// >


// <Grid item xs={12} md={6}>

// <TicketSection title="Flight Details">

// <Typography>

// Booking :

// {selectedBooking.booking_id}

// </Typography>

// <Typography>

// Route :

// {selectedBooking.origin}

// {" → "}

// {selectedBooking.destination}

// </Typography>

// </TicketSection>

// </Grid>


// <Grid item xs={12} md={6}>

// <TicketSection title="Passenger Details">

// <Typography>

// {passenger?.Title}

// {" "}

// {passenger?.FirstName}

// {" "}

// {passenger?.LastName}

// </Typography>

// <Typography>

// {passenger?.Email}

// </Typography>

// <Typography>

// {passenger?.ContactNo}

// </Typography>

// </TicketSection>

// </Grid>


// <Grid item xs={12} md={6}>

// <TicketSection title="Departure">

// <Typography>

// {

// segment?.Origin

// ?.Airport

// ?.CityName

// }

// </Typography>

// <Typography>

// {

// new Date(

// segment?.Origin

// ?.DepTime

// ).toLocaleString()

// }

// </Typography>

// </TicketSection>

// </Grid>


// <Grid item xs={12} md={6}>

// <TicketSection title="Arrival">

// <Typography>

// {

// segment?.Destination

// ?.Airport

// ?.CityName

// }

// </Typography>

// <Typography>

// {
  
// new Date(

// segment?.Destination

// ?.ArrTime

// ).toLocaleString()

// }

// </Typography>

// </TicketSection>

// </Grid>


// <Grid item xs={12} md={6}>

// <TicketSection title="Airline">

// <Typography>

// {

// segment?.Airline

// ?.AirlineName

// }

// </Typography>

// <Typography>

// Flight :

// {

// segment?.Airline

// ?.FlightNumber

// }

// </Typography>

// </TicketSection>

// </Grid>


// <Grid item xs={12} md={6}>

// <TicketSection title="Baggage">

// <Typography>

// Check In :

// {segment?.Baggage}

// </Typography>

// <Typography>

// Cabin :

// {segment?.CabinBaggage}

// </Typography>

// </TicketSection>

// </Grid>


// <Grid item xs={12} md={6}>

// <TicketSection title="Fare">

// <Typography>

// Base :

// ₹{fare?.BaseFare}

// </Typography>

// <Typography>

// Tax :

// ₹{fare?.Tax}

// </Typography>

// <Typography>

// Total :

// ₹{fare?.PublishedFare}

// </Typography>

// </TicketSection>

// </Grid>


// <Grid item xs={12} md={6}>

// <TicketSection title="Invoice">

// <Typography>

// {invoice?.InvoiceNo}

// </Typography>

// <Typography>

// ₹{invoice?.InvoiceAmount}

// </Typography>

// </TicketSection>

// </Grid>


// <Grid item xs={12}>

// <TicketSection title="Ticket Details">

// <Typography>

// Ticket :

// {ticket?.TicketNumber}

// </Typography>

// <Typography>

// Status :

// {ticket?.Status}

// </Typography>

// </TicketSection>

// </Grid>


// </Grid>

// </Box>

// </Box>

// );

// })()

// )}

// </DialogContent>

// </Dialog>
// </>

//   );
// };

// export default MyTrips;

import React, { useEffect, useState } from "react";

import {
  getMyTrips,
  getBookingDetails,
} from "../../src/api/myTripsApi";

import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  Drawer,
  useMediaQuery,
  useTheme,

} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import TrainIcon from "@mui/icons-material/Train";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuIcon from "@mui/icons-material/Menu";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import BusBooking from "../my-trips booking details/BusBooking";

const GREEN = "#16a34a";

const TicketSection = ({ title, children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        height: "170px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        boxSizing: "border-box",
        transition: "0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#166534", mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

// Static data for different categories
const STATIC_DATA = {
  Flights: [
    {
      id: 1,
      bookingId: "FL-2024-001",
      from: "Mumbai (BOM)",
      to: "Delhi (DEL)",
      date: "2024-07-15",
      time: "14:30",
      airline: "IndiGo",
      status: "Upcoming",
      price: "₹4,500",
    },
    {
      id: 2,
      bookingId: "FL-2024-002",
      from: "Bangalore (BLR)",
      to: "Mumbai (BOM)",
      date: "2024-06-20",
      time: "10:15",
      airline: "SpiceJet",
      status: "Past",
      price: "₹3,200",
    },
  ],
  Trains: [
    {
      id: 3,
      bookingId: "TR-2024-001",
      from: "Delhi (DLI)",
      to: "Agra (AGR)",
      date: "2024-07-20",
      time: "06:00",
      train: "Rajdhani Express",
      status: "Upcoming",
      price: "₹1,200",
    },
    {
      id: 4,
      bookingId: "TR-2024-002",
      from: "Mumbai (CSMT)",
      to: "Pune (PHC)",
      date: "2024-06-10",
      time: "15:30",
      train: "Intercity Express",
      status: "Cancelled",
      price: "₹800",
    },
  ],
  Hotels: [
    {
      id: 5,
      bookingId: "HT-2024-001",
      name: "Taj Mahal Hotel",
      location: "Delhi",
      checkIn: "2024-07-15",
      checkOut: "2024-07-18",
      nights: 3,
      status: "Upcoming",
      price: "₹15,000/night",
    },
    {
      id: 6,
      bookingId: "HT-2024-002",
      name: "Oberoi Mumbai",
      location: "Mumbai",
      checkIn: "2024-06-01",
      checkOut: "2024-06-03",
      nights: 2,
      status: "Past",
      price: "₹12,000/night",
    },
  ],
  Cabs: [
    {
      id: 7,
      bookingId: "CB-2024-001",
      pickupLocation: "Mumbai Airport",
      dropLocation: "Bandra",
      date: "2024-07-16",
      time: "18:00",
      carType: "Sedan",
      status: "Upcoming",
      price: "₹800",
    },
    {
      id: 8,
      bookingId: "CB-2024-002",
      pickupLocation: "Colaba",
      dropLocation: "Fort",
      date: "2024-06-15",
      time: "10:30",
      carType: "Hatchback",
      status: "Failed",
      price: "₹400",
    },
  ],
};

const CATEGORIES = [
  { label: "Flights", icon: <FlightIcon /> },
  { label: "Bus", icon: <TrainIcon /> },
  { label: "Hotels", icon: <HotelIcon /> },
  { label: "Trains", icon: <TrainIcon /> },
  { label: "Cabs", icon: <DirectionsCarIcon /> },
];

const STATUS_FILTERS = ["Upcoming", "Past", "Cancelled", "Failed"];

const MyTrips = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // <960px
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));  // <600px

  const [selectedCategory, setSelectedCategory] = useState("Flights");
  const [selectedStatus, setSelectedStatus] = useState("Upcoming");
  const [flightBookings, setFlightBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

const handleSortSelect = (status) => {
  setSelectedStatus(status);
  setSortDrawerOpen(false);
};

  const fetchFlightBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyTrips();
      console.log("API Response :", response);
      if (response.results?.length > 0) {
        const firstBooking = response.results[0];
        const details = await getBookingDetails(firstBooking.booking_id);
        console.log("Booking Details :", details);
      }
      setFlightBookings(response.results || []);
    } catch (error) {
      console.log("Flight Booking Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightBookings();
  }, []);

  const statusMap = {
    Upcoming: "BOOKED",
    Past: "TICKETED",
    Cancelled: "CANCELLED",
    Failed: "FAILED",
  };

  const filteredData =
    selectedCategory === "Flights"
      ? flightBookings.filter((item) => item.status === statusMap[selectedStatus])
      : STATIC_DATA[selectedCategory]?.filter((item) => item.status === selectedStatus) || [];

  console.log("Flight Bookings :", flightBookings);

  const handleViewDetails = async (bookingId) => {
    try {
      setDetailsLoading(true);
      const response = await getBookingDetails(bookingId);
      console.log("Booking Details :", response);
      setSelectedBooking(response.data);
      setOpenDetails(true);
    } catch (error) {
      console.log(error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleOpenDetails = async (booking) => {
    try {
      setDetailsLoading(true);
      const response = await getBookingDetails(booking.booking_id);
      console.log("Booking Details :", response);
      setSelectedBooking(response.data);
      setOpenDetails(true);
    } catch (error) {
      console.log(error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedBooking(null);
  };

  // Sidebar content — shared between sticky panel and Drawer
  const SidebarContent = ({ onSelect }) => (
    <>
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarMonthIcon sx={{ fontSize: 24, color: GREEN }} />
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
            My Trips
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ p: 0 }}>
        {CATEGORIES.map((category) => (
          <ListItem
            key={category.label}
            disablePadding
            onClick={() => {
              setSelectedCategory(category.label);
              setSelectedStatus("Upcoming");
              if (onSelect) onSelect();
            }}
            sx={{
              bgcolor:
                selectedCategory === category.label ? "#f0fdf4" : "transparent",
            }}
          >
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2,
                color: selectedCategory === category.label ? GREEN : "#666",
                fontWeight: selectedCategory === category.label ? 700 : 500,
                borderLeft:
                  selectedCategory === category.label
                    ? `3px solid ${GREEN}`
                    : "3px solid transparent",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "#fafafa" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selectedCategory === category.label ? GREEN : "#999",
                }}
              >
                {category.icon}
              </ListItemIcon>
              <ListItemText
                primary={category.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: selectedCategory === category.label ? 700 : 500,
                  color: selectedCategory === category.label ? GREEN : "#333",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  const renderBookingCard = (booking) => {
    return (
      <Card
        key={booking.id}
        sx={{
          mb: 2,
          borderLeft: `4px solid ${GREEN}`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
              {booking.booking_id}
            </Typography>
            <Typography
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                fontSize: 12,
                fontWeight: 600,
                bgcolor:
                  booking.status === "BOOKED"
                    ? "#fef3c7"
                    : booking.status === "TICKETED"
                    ? "#dbeafe"
                    : booking.status === "CANCELLED"
                    ? "#fee2e2"
                    : "#f3f4f6",
                color:
                  booking.status === "BOOKED"
                    ? "#d97706"
                    : booking.status === "TICKETED"
                    ? "#0369a1"
                    : booking.status === "CANCELLED"
                    ? "#dc2626"
                    : "#374151",
              }}
            >
              {booking.status}
            </Typography>
          </Box>

          {selectedCategory === "Flights" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              {/* Left */}
              <Box sx={{ flex: 3, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 15, sm: 18 },
                    fontWeight: 700,
                    color: "#166534",
                    mb: 1,
                    wordBreak: "break-word",
                  }}
                >
                  ✈️ Booking #{booking.booking_id}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 4 } }}>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: "#666" }}>PNR</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{booking.pnr}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: "#666" }}>Created</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {new Date(booking.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 13,
                    color: "#666",
                    wordBreak: "break-all",
                  }}
                >
                  Order : {booking.order_id}
                </Typography>
              </Box>

              {/* Right */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  alignItems: { xs: "center", sm: "flex-end" },
                  gap: 2,
                  flexShrink: 0,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleOpenDetails(booking)}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#16a34a",
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#15803d" },
                  }}
                >
                  {detailsLoading ? "Loading..." : "View Details"}
                </Button>
              </Box>
            </Box>
          )}

          {selectedCategory === "Trains" && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>Route</Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.from} → {booking.to}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>Train</Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>{booking.train}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>Departure</Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.date} • {booking.time}
                  </Typography>
                </Box>
                <Box sx={{ ml: "auto", textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>
                    {booking.price}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {selectedCategory === "Hotels" && (
            <>
              <Box sx={{ mb: 1 }}>
                <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>Hotel Name</Typography>
                <Typography sx={{ fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}>{booking.name}</Typography>
                <Typography sx={{ fontSize: 12, color: "#666" }}>📍 {booking.location}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>Check-in / Check-out</Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a", fontSize: 13 }}>
                    {booking.checkIn} / {booking.checkOut}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>({booking.nights} nights)</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>{booking.price}</Typography>
                </Box>
              </Box>
            </>
          )}

          {selectedCategory === "Cabs" && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>Route</Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>{booking.pickupLocation}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>→ {booking.dropLocation}</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>Car Type</Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>{booking.carType}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>Date & Time</Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.date} • {booking.time}
                  </Typography>
                </Box>
                <Box sx={{ ml: "auto", textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>{booking.price}</Typography>
                </Box>
              </Box>
            </>
          )}

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            {booking.status === "Upcoming" && (
              <Button
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "#ccc",
                  color: "#666",
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: "none",
                  "&:hover": { borderColor: "#999" },
                }}
              >
                Modify
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 3 }}>
        {/* Container wrapper */}
        <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 1.5, sm: 2, md: 4 } }}>

          {/* ── Top bar: status filters + mobile menu button ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              mb: 3,
              justifyContent: { xs: "space-between", md: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            {/* Hamburger — mobile only */}
            {isMobile && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<MenuIcon />}
                onClick={() => setDrawerOpen(true)}
                sx={{
                  borderColor: GREEN,
                  color: GREEN,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  flexShrink: 0,
                  "&:hover": { bgcolor: "#f0fdf4" },
                }}
              >
                Categories
              </Button>
            )}

            {/* Status filter pills */}


{/* Desktop */}
{!isMobile && (
  <Box
    sx={{
      display: "flex",
      gap: { xs: 0.8, sm: 2 },
      flexWrap: "wrap",
    }}
  >
    {STATUS_FILTERS.map((status) => (
      <Button
        key={status}
        variant={selectedStatus === status ? "contained" : "outlined"}
        onClick={() => setSelectedStatus(status)}
        sx={{
          borderRadius: "20px",
          fontWeight: 600,
          fontSize: 13,
          textTransform: "none",
          px: 2.5,
          py: 1,
          minWidth: 0,

          ...(selectedStatus === status
            ? {
                bgcolor: GREEN,
                color: "#fff",
                borderColor: GREEN,

                "&:hover": {
                  bgcolor: "#15803d",
                },
              }
            : {
                borderColor: "#ddd",
                color: "#666",

                "&:hover": {
                  borderColor: GREEN,
                  color: GREEN,
                },
              }),
        }}
      >
        {status}
      </Button>
    ))}
  </Box>
)}

{/* Mobile */}
{/* Mobile */}
{isMobile && (
  <>
    <Button
      variant="outlined"
      startIcon={<SortIcon />}
      onClick={() => setSortDrawerOpen(true)}
      sx={{
        borderColor: GREEN,
        color: GREEN,
        textTransform: "none",
        fontWeight: 600,
        fontSize: 13,
        borderRadius: "10px",
        minWidth: "90px",
        px: 2,

        "&:hover": {
          borderColor: GREEN,
          bgcolor: "#f0fdf4",
        },
      }}
    >
      Sort
    </Button>
  </>
)}

          </Box>

          {/* ── Main layout ── */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              minHeight: "calc(100vh - 150px)",
              alignItems: "flex-start",
            }}
          >
            {/* ── Left Sidebar — desktop only ── */}
            {!isMobile && (
              <Paper
                elevation={0}
                sx={{
                  width: 300,
                  bgcolor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e8e8e8",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  height: "fit-content",
                  position: "sticky",
                  top: 24,
                }}
              >
                <SidebarContent />
              </Paper>
            )}

            {/* ── Mobile Drawer sidebar ── */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: 260,
                  borderRadius: "0 16px 16px 0",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <SidebarContent onSelect={() => setDrawerOpen(false)} />
            </Drawer>

            {/* ── Sort Drawer ── */}

<Drawer
  anchor="right"
  open={sortDrawerOpen}
  onClose={() => setSortDrawerOpen(false)}
  PaperProps={{
    sx: {
      width: 220,
    },
  }}
>
  <Box
    sx={{
      p: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #eee",
    }}
  >
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: 18,
      }}
    >
      Sort
    </Typography>

    <IconButton
      onClick={() =>
        setSortDrawerOpen(false)
      }
    >
      <CloseIcon />
    </IconButton>
  </Box>

  <List sx={{ p: 0 }}>
    {STATUS_FILTERS.map((status) => (
      <ListItem
        key={status}
        disablePadding
      >
        <ListItemButton
          onClick={() =>
            handleSortSelect(status)
          }
          sx={{
            py: 1.8,

            bgcolor:
              selectedStatus === status
                ? "#f0fdf4"
                : "transparent",
          }}
        >
          <ListItemText
            primary={status}
            primaryTypographyProps={{
              fontWeight:
                selectedStatus === status
                  ? 700
                  : 500,

              color:
                selectedStatus === status
                  ? GREEN
                  : "#333",
            }}
          />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
</Drawer>

            {/* ── Right Content ── */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                bgcolor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e8e8e8",
                p: { xs: 2, sm: 3, md: 4 },
                minHeight: "600px",
                minWidth: 0,
              }}
            >
              {/* Mobile: show active category label */}
              {isMobile && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                    pb: 1.5,
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 18, color: GREEN }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>
                    {selectedCategory}
                  </Typography>
                </Box>
              )}

              {selectedCategory === "Bus" ? (
                <BusBooking />
              ) : filteredData.length > 0 ? (
                <Box>
                  {filteredData.map((booking) => renderBookingCard(booking))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "500px",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Box sx={{ mb: 3, fontSize: 80, opacity: 0.3 }}>📅</Box>
                  <Typography sx={{ fontSize: { xs: 18, sm: 24 }, fontWeight: 700, color: "#1a1a1a", mb: 1 }}>
                    No {selectedStatus} Bookings
                  </Typography>
                  <Typography sx={{ color: "#666", fontSize: 14 }}>
                    Looks like you don't have any {selectedStatus.toLowerCase()}{" "}
                    {selectedCategory.toLowerCase()} bookings yet.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 3,
                      bgcolor: GREEN,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#15803d" },
                    }}
                  >
                    Book your next trip
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* ── Booking Details Dialog ── */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 6,
            overflow: "hidden",
            width: "100%",
            maxWidth: "950px",
            maxHeight: "85vh",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            mx: { xs: 1, sm: 2 },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedBooking &&
            (() => {
              const itinerary = selectedBooking.raw?.FlightItinerary;
              const segment = itinerary?.Segments?.[0];
              const passenger = itinerary?.Passenger?.[0];
              const fare = itinerary?.Fare;
              const invoice = itinerary?.Invoice?.[0];
              const ticket = passenger?.Ticket;

              return (
                <Box>
                  <Box sx={{ bgcolor: "#16a34a", color: "#fff", p: 3 }}>
                    <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
                      ✈️ Flight Ticket
                    </Typography>
                    <Typography>PNR : {selectedBooking.pnr}</Typography>
                  </Box>

                  <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#fafafa" }}>
                    <Grid container spacing={3} alignItems="stretch">
                      <Grid item xs={12} md={6}>
                        <TicketSection title="Flight Details">
                          <Typography>Booking : {selectedBooking.booking_id}</Typography>
                          <Typography>
                            Route : {selectedBooking.origin} {" → "} {selectedBooking.destination}
                          </Typography>
                        </TicketSection>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TicketSection title="Passenger Details">
                          <Typography>
                            {passenger?.Title} {passenger?.FirstName} {passenger?.LastName}
                          </Typography>
                          <Typography>{passenger?.Email}</Typography>
                          <Typography>{passenger?.ContactNo}</Typography>
                        </TicketSection>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TicketSection title="Departure">
                          <Typography>{segment?.Origin?.Airport?.CityName}</Typography>
                          <Typography>
                            {new Date(segment?.Origin?.DepTime).toLocaleString()}
                          </Typography>
                        </TicketSection>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TicketSection title="Arrival">
                          <Typography>{segment?.Destination?.Airport?.CityName}</Typography>
                          <Typography>
                            {new Date(segment?.Destination?.ArrTime).toLocaleString()}
                          </Typography>
                        </TicketSection>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TicketSection title="Airline">
                          <Typography>{segment?.Airline?.AirlineName}</Typography>
                          <Typography>Flight : {segment?.Airline?.FlightNumber}</Typography>
                        </TicketSection>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TicketSection title="Baggage">
                          <Typography>Check In : {segment?.Baggage}</Typography>
                          <Typography>Cabin : {segment?.CabinBaggage}</Typography>
                        </TicketSection>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TicketSection title="Fare">
                          <Typography>Base : ₹{fare?.BaseFare}</Typography>
                          <Typography>Tax : ₹{fare?.Tax}</Typography>
                          <Typography>Total : ₹{fare?.PublishedFare}</Typography>
                        </TicketSection>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TicketSection title="Invoice">
                          <Typography>{invoice?.InvoiceNo}</Typography>
                          <Typography>₹{invoice?.InvoiceAmount}</Typography>
                        </TicketSection>
                      </Grid>

                      <Grid item xs={12}>
                        <TicketSection title="Ticket Details">
                          <Typography>Ticket : {ticket?.TicketNumber}</Typography>
                          <Typography>Status : {ticket?.Status}</Typography>
                        </TicketSection>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              );
            })()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyTrips;
