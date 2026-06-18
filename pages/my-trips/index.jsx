import React, { useState } from "react";
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
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import TrainIcon from "@mui/icons-material/Train";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const GREEN = "#16a34a";

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
  { label: "Trains", icon: <TrainIcon /> },
  { label: "Hotels", icon: <HotelIcon /> },
  { label: "Cabs", icon: <DirectionsCarIcon /> },
];

const STATUS_FILTERS = ["Upcoming", "Past", "Cancelled", "Failed"];

const MyTrips = () => {
  const [selectedCategory, setSelectedCategory] = useState("Flights");
  const [selectedStatus, setSelectedStatus] = useState("Upcoming");

  // Get filtered data based on category and status
  const filteredData = STATIC_DATA[selectedCategory]?.filter(
    (item) => item.status === selectedStatus
  ) || [];

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
              {booking.bookingId}
            </Typography>
            <Typography
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                fontSize: 12,
                fontWeight: 600,
                bgcolor:
                  booking.status === "Upcoming"
                    ? "#dbeafe"
                    : booking.status === "Past"
                    ? "#ddd6fe"
                    : booking.status === "Cancelled"
                    ? "#fee2e2"
                    : "#fef3c7",
                color:
                  booking.status === "Upcoming"
                    ? "#0369a1"
                    : booking.status === "Past"
                    ? "#6d28d9"
                    : booking.status === "Cancelled"
                    ? "#dc2626"
                    : "#d97706",
              }}
            >
              {booking.status}
            </Typography>
          </Box>

          {selectedCategory === "Flights" && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Route
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.from} → {booking.to}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Airline
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.airline}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Date & Time
                  </Typography>
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

          {selectedCategory === "Trains" && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Route
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.from} → {booking.to}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Train
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.train}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Departure
                  </Typography>
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
                <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                  Hotel Name
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}>
                  {booking.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#666" }}>
                  📍 {booking.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Check-in / Check-out
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a", fontSize: 13 }}>
                    {booking.checkIn} / {booking.checkOut}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>
                    ({booking.nights} nights)
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>
                    {booking.price}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {selectedCategory === "Cabs" && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Route
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.pickupLocation}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>
                    → {booking.dropLocation}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Car Type
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                    {booking.carType}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                    Date & Time
                  </Typography>
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

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: GREEN,
                color: GREEN,
                fontWeight: 600,
                fontSize: 12,
                textTransform: "none",
                "&:hover": { bgcolor: "#f0fdf4" },
              }}
            >
              View Details
            </Button>
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 3 }}>
      {/* Container wrapper - centered */}
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 } }}>
        {/* Status Filter Buttons - Top Right */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "flex-end" }}>
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
                ...(selectedStatus === status
                  ? {
                      bgcolor: GREEN,
                      color: "#fff",
                      borderColor: GREEN,
                      "&:hover": { bgcolor: "#15803d" },
                    }
                  : {
                      borderColor: "#ddd",
                      color: "#666",
                      "&:hover": { borderColor: GREEN, color: GREEN },
                    }),
              }}
            >
              {status}
            </Button>
          ))}
        </Box>

        {/* Main Content Wrapper - Flex with gap */}
        <Box sx={{ display: "flex", gap: 3, minHeight: "calc(100vh - 150px)" }}>
          {/* Left Sidebar Card */}
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
                      color:
                        selectedCategory === category.label ? GREEN : "#666",
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
                        color:
                          selectedCategory === category.label
                            ? GREEN
                            : "#999",
                      }}
                    >
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={category.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight:
                          selectedCategory === category.label ? 700 : 500,
                        color:
                          selectedCategory === category.label
                            ? GREEN
                            : "#333",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Right Content Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e8e8e8",
              p: 4,
              minHeight: "600px",
            }}
          >
            {/* Booking Cards */}
            {filteredData.length > 0 ? (
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
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    fontSize: 80,
                    opacity: 0.3,
                  }}
                >
                  📅
                </Box>
                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    mb: 1,
                  }}
                >
                  No {selectedStatus} Bookings
                </Typography>
                <Typography sx={{ color: "#666", fontSize: 14 }}>
                  Looks like you don't have any {selectedStatus.toLowerCase()} {selectedCategory.toLowerCase()} bookings yet.
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
  );
};

export default MyTrips;