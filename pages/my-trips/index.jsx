import React, { useEffect, useState } from "react";
import { getMyTrips, getBookingDetails } from "../../src/api/myTripsApi";
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
import flightRouteBg from "/mapbgg.png";

const GREEN = "#16a34a";

// ── Ticket Section (Dialog ke andar) ──
const TicketSection = ({ title, children }) => (
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
      "&:hover": { boxShadow: "0 4px 10px rgba(0,0,0,0.08)" },
    }}
  >
    <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#166534", mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

// ── Skeleton Card (shimmer) ──
const FlightCardSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      position: "relative",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      borderLeft: "4px solid #d1fae5",
      borderRadius: "14px",
    }}
  >
    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
      {/* Row 1 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              bgcolor: "#f3f4f6",
            }}
          />
          <Box
            sx={{ width: 100, height: 14, borderRadius: 2, bgcolor: "#f3f4f6" }}
          />
        </Box>
        <Box
          sx={{
            width: 70,
            height: 22,
            borderRadius: "20px",
            bgcolor: "#f3f4f6",
          }}
        />
      </Box>
      {/* Row 2 - route */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box
          sx={{ width: 40, height: 13, borderRadius: 2, bgcolor: "#f3f4f6" }}
        />
        <Box
          sx={{ width: 16, height: 13, borderRadius: 2, bgcolor: "#f3f4f6" }}
        />
        <Box
          sx={{ width: 40, height: 13, borderRadius: 2, bgcolor: "#f3f4f6" }}
        />
      </Box>
      {/* Row 3 - date + id */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Box
          sx={{ width: 90, height: 12, borderRadius: 2, bgcolor: "#f3f4f6" }}
        />
        <Box
          sx={{ width: 70, height: 12, borderRadius: 2, bgcolor: "#f3f4f6" }}
        />
      </Box>
      {/* Row 4 - fare */}
      <Box
        sx={{
          width: 80,
          height: 18,
          borderRadius: 2,
          bgcolor: "#f3f4f6",
          mb: 1.5,
        }}
      />
      <Divider sx={{ mb: 1.5 }} />
      {/* Row 5 - buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 90,
            height: 30,
            borderRadius: "8px",
            bgcolor: "#f3f4f6",
          }}
        />
        <Box
          sx={{ width: 60, height: 12, borderRadius: 2, bgcolor: "#f3f4f6" }}
        />
      </Box>
    </CardContent>

    {/* Shimmer sweep */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      }}
    />
  </Card>
);

// ── Static data (Trains, Hotels, Cabs) ──
const STATIC_DATA = {
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
  { label: "Cabs", icon: <DirectionsCarIcon /> },
];

const STATUS_FILTERS = ["Upcoming", "Past", "Cancelled", "Failed"];

const MyTrips = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedCategory, setSelectedCategory] = useState("Flights");
  const [selectedStatus, setSelectedStatus] = useState("Upcoming");
  const [flightBookings, setFlightBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  // ── Pagination states ──
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  // ── Fetch ──
  const fetchFlightBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyTrips();
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

  // ── Status map ──
  const statusMap = {
    Upcoming: "BOOKED",
    Past: "TICKETED",
    Cancelled: "CANCELLED",
    Failed: "FAILED",
  };

  // ── Filtered + sliced data ──
  const filteredData =
    selectedCategory === "Flights"
      ? flightBookings.filter(
          (item) => item.status === statusMap[selectedStatus],
        )
      : STATIC_DATA[selectedCategory]?.filter(
          (item) => item.status === selectedStatus,
        ) || [];

  const visibleData =
    selectedCategory === "Flights"
      ? filteredData.slice(0, visibleCount)
      : filteredData;

  // ── Handlers ──
  const handleSortSelect = (status) => {
    setSelectedStatus(status);
    setVisibleCount(6);
    setSortDrawerOpen(false);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setLoadingMore(false);
    }, 1200);
  };

  const handleOpenDetails = async (booking) => {
    try {
      setDetailsLoading(true);
      const response = await getBookingDetails(booking.booking_id);
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

  // ── Sidebar ──
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
              setVisibleCount(6);
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

  // ── Flight Card (API data) ──
  const renderFlightCard = (booking) => {
    const statusColors = {
      BOOKED: { bg: "#fef3c7", color: "#b45309" },
      TICKETED: { bg: "#dbeafe", color: "#0369a1" },
      CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
      FAILED: { bg: "#f3f4f6", color: "#374151" },
    };
    const sc = statusColors[booking.status] || statusColors.FAILED;

    return (
      <Card
        key={booking.booking_id}
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderLeft: `4px solid ${GREEN}`,
          borderRadius: "14px",
          transition: "all 0.2s ease",
          "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.09)" },
        }}
      >
        {/* BG image — white fade on left & right */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `url(${flightRouteBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.18,
            maskImage:
              "linear-gradient(to right, white 0%, black 25%, black 75%, white 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, white 0%, black 25%, black 75%, white 100%)",
          }}
        />

        <CardContent
          sx={{ position: "relative", p: 2, "&:last-child": { pb: 2 } }}
        >
          {/* Row 1: icon + PNR + status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  bgcolor: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FlightIcon
                  sx={{
                    fontSize: 18,
                    color: GREEN,
                    transform: "rotate(45deg)",
                  }}
                />
              </Box>
              <Typography
                sx={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}
              >
                PNR {booking.pnr || "—"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.5,
                py: 0.4,
                borderRadius: "20px",
                fontSize: 11,
                fontWeight: 700,
                bgcolor: sc.bg,
                color: sc.color,
              }}
            >
              {booking.status}
              {(booking.status === "BOOKED" ||
                booking.status === "TICKETED") && (
                <span style={{ fontWeight: 800 }}>✓</span>
              )}
            </Box>
          </Box>

          {/* Row 2: Origin → Destination */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}
            >
              {booking.origin || "—"}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#aaa" }}>✈</Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}
            >
              {booking.destination || "—"}
            </Typography>
          </Box>

          {/* Row 3: Date + Booking ID */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography sx={{ fontSize: 12, color: "#666" }}>
              {booking.created_at
                ? new Date(booking.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#aaa" }}>
              #{booking.booking_id}
            </Typography>
          </Box>

          {/* Row 4: Fare */}
          {booking.fare?.published_fare && (
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 800,
                color: GREEN,
                mb: 1.5,
                lineHeight: 1,
              }}
            >
              ₹{booking.fare.published_fare.toLocaleString("en-IN")}
              <Typography
                component="span"
                sx={{ fontSize: 11, color: "#888", fontWeight: 400, ml: 0.5 }}
              >
                paid
              </Typography>
            </Typography>
          )}

          <Divider sx={{ mb: 1.5 }} />

          {/* Row 5: Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenDetails(booking)}
              disabled={detailsLoading}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: 12.5,
                borderRadius: "8px",
                px: 2,
                py: 0.6,
                bgcolor: GREEN,
                boxShadow: "none",
                "&:hover": { bgcolor: "#15803d", boxShadow: "none" },
              }}
            >
              {detailsLoading ? "Loading..." : "View Details"}
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                color: "#555",
                "&:hover": { color: GREEN },
              }}
            >
              <Typography sx={{ fontSize: 13 }}>⬇</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                E-Ticket
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // ── Static Card (Trains / Hotels / Cabs) ──
  const renderStaticCard = (booking) => (
    <Card
      key={booking.id}
      elevation={0}
      sx={{
        mb: 2,
        border: "1px solid #eee",
        borderLeft: `5px solid ${GREEN}`,
        borderRadius: "16px",
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: "0 8px 22px rgba(0,0,0,0.08)" },
      }}
    >
      <CardContent
        sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: { xs: 2, sm: 3 } } }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
          <Box
            sx={{
              px: 2,
              py: 0.7,
              borderRadius: "20px",
              fontSize: 13,
              fontWeight: 700,
              bgcolor:
                booking.status === "Upcoming"
                  ? "#fef3c7"
                  : booking.status === "Past"
                    ? "#dbeafe"
                    : booking.status === "Cancelled"
                      ? "#fee2e2"
                      : "#f3f4f6",
              color:
                booking.status === "Upcoming"
                  ? "#b45309"
                  : booking.status === "Past"
                    ? "#0369a1"
                    : booking.status === "Cancelled"
                      ? "#dc2626"
                      : "#374151",
            }}
          >
            {booking.status}
          </Box>
        </Box>

        {selectedCategory === "Trains" && (
          <>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
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
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                  Departure
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                  {booking.date} • {booking.time}
                </Typography>
              </Box>
              <Box sx={{ ml: "auto", textAlign: "right" }}>
                <Typography
                  sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}
                >
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                  Check-in / Check-out
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, color: "#1a1a1a", fontSize: 13 }}
                >
                  {booking.checkIn} / {booking.checkOut}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>
                  ({booking.nights} nights)
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}
                >
                  {booking.price}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {selectedCategory === "Cabs" && (
          <>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
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
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography sx={{ fontSize: 12, color: "#666", mb: 0.5 }}>
                  Date & Time
                </Typography>
                <Typography sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                  {booking.date} • {booking.time}
                </Typography>
              </Box>
              <Box sx={{ ml: "auto", textAlign: "right" }}>
                <Typography
                  sx={{ fontSize: 12, color: GREEN, fontWeight: 700 }}
                >
                  {booking.price}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        <Divider sx={{ my: 1.5 }} />
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

  // ── Main Return ──
  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 3 }}>
        <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 1.5, sm: 2, md: 4 } }}>
          {/* Top bar */}
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
                  "&:hover": { bgcolor: "#f0fdf4" },
                }}
              >
                Categories
              </Button>
            )}

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
                    variant={
                      selectedStatus === status ? "contained" : "outlined"
                    }
                    onClick={() => {
                      setSelectedStatus(status);
                      setVisibleCount(6);
                    }}
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
            )}

            {isMobile && (
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
                  px: 2,
                  "&:hover": { borderColor: GREEN, bgcolor: "#f0fdf4" },
                }}
              >
                Sort
              </Button>
            )}
          </Box>

          {/* Main layout */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              minHeight: "calc(100vh - 150px)",
              alignItems: "flex-start",
            }}
          >
            {/* Sidebar desktop */}
            {!isMobile && (
              <Paper
                elevation={0}
                sx={{
                  width: 300,
                  bgcolor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e8e8e8",
                  flexShrink: 0,
                  height: "fit-content",
                  position: "sticky",
                  top: 24,
                }}
              >
                <SidebarContent />
              </Paper>
            )}

            {/* Mobile drawer - categories */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{ sx: { width: 260, borderRadius: "0 16px 16px 0" } }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <SidebarContent onSelect={() => setDrawerOpen(false)} />
            </Drawer>

            {/* Sort drawer */}
            <Drawer
              anchor="right"
              open={sortDrawerOpen}
              onClose={() => setSortDrawerOpen(false)}
              PaperProps={{ sx: { width: 220 } }}
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
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  Sort
                </Typography>
                <IconButton onClick={() => setSortDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <List sx={{ p: 0 }}>
                {STATUS_FILTERS.map((status) => (
                  <ListItem key={status} disablePadding>
                    <ListItemButton
                      onClick={() => handleSortSelect(status)}
                      sx={{
                        py: 1.8,
                        bgcolor:
                          selectedStatus === status ? "#f0fdf4" : "transparent",
                      }}
                    >
                      <ListItemText
                        primary={status}
                        primaryTypographyProps={{
                          fontWeight: selectedStatus === status ? 700 : 500,
                          color: selectedStatus === status ? GREEN : "#333",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>

            {/* Right content */}
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
                  <Typography
                    sx={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}
                  >
                    {selectedCategory}
                  </Typography>
                </Box>
              )}

              {selectedCategory === "Bus" ? (
                <BusBooking />
              ) : filteredData.length > 0 ? (
                selectedCategory === "Flights" ? (
                  <>
                    {/* ── 2-col flight grid ── */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      {visibleData.map((booking) => renderFlightCard(booking))}

                      {/* Skeleton cards while loading more */}
                      {loadingMore &&
                        Array.from({ length: 2 }).map((_, i) => (
                          <FlightCardSkeleton key={`skel-${i}`} />
                        ))}
                    </Box>

                    {/* Load More button */}
                    {!loadingMore && visibleCount < filteredData.length && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={handleLoadMore}
                          sx={{
                            borderColor: GREEN,
                            color: GREEN,
                            fontWeight: 600,
                            fontSize: 14,
                            textTransform: "none",
                            borderRadius: "10px",
                            px: 4,
                            py: 1,
                            "&:hover": {
                              bgcolor: "#f0fdf4",
                              borderColor: GREEN,
                            },
                          }}
                        >
                          Load More ({filteredData.length - visibleCount}{" "}
                          remaining)
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box>
                    {filteredData.map((booking) => renderStaticCard(booking))}
                  </Box>
                )
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
                  <Typography
                    sx={{
                      fontSize: { xs: 18, sm: 24 },
                      fontWeight: 700,
                      color: "#1a1a1a",
                      mb: 1,
                    }}
                  >
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

      {/* Booking Details Dialog */}
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
                <Box
                  sx={{
                    position: "relative",
                    Width: 800,
                    minHeight: 300,
                    mx: "auto",
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    border: "1px solid #dbe7dd",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  {/* top green strip */}
                  <Box
                    sx={{
                      height: 8,
                      background:
                        "linear-gradient(90deg, #15803d 0%, #166534 100%)",
                    }}
                  />

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1.45fr 1fr" },
                      minHeight: { xs: "auto", md: 300 },
                    }}
                  >
                    {/* ── LEFT STUB ── */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "rgba(255,255,255,0.92)",
                        borderRight: { xs: "none", md: "2px dashed #cfe7d4" },
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* decorative circles */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0.06,
                          pointerEvents: "none",
                          backgroundImage:
                            "radial-gradient(circle at 20% 25%, #15803d 0 10px, transparent 10px), radial-gradient(circle at 80% 75%, #15803d 0 14px, transparent 14px)",
                        }}
                      />
                      {/* plane watermark */}
                      <Typography
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          right: -10,
                          opacity: 0.04,
                          fontSize: 70,
                          transform: "rotate(-20deg)",
                          pointerEvents: "none",
                          lineHeight: 1,
                        }}
                      >
                        ✈
                      </Typography>

                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: 11,
                            letterSpacing: 2.5,
                            color: "#111827",
                            textTransform: "uppercase",
                            fontWeight: 800,
                          }}
                        >
                          Boarding Pass
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 19,
                            fontWeight: 800,
                            color: "#111827",
                            mt: 0.5,
                          }}
                        >
                          Flight Ticket
                        </Typography>

                        <Box
                          sx={{
                            mt: 3,
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                          }}
                        >
                          {/* barcode bars */}
                          <Box
                            sx={{
                              width: 12,
                              height: 130,
                              flexShrink: 0,
                              opacity: 0.85,
                              background:
                                "repeating-linear-gradient(to bottom, #111827 0px, #111827 3px, transparent 3px, transparent 6px)",
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#6b7280",
                                textTransform: "uppercase",
                                letterSpacing: 1.2,
                              }}
                            >
                              Passenger
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 17,
                                fontWeight: 800,
                                color: "#111827",
                                mt: 0.35,
                              }}
                            >
                              {passenger?.Title} {passenger?.FirstName}{" "}
                              {passenger?.LastName}
                            </Typography>

                            <Box sx={{ mt: 2.25 }}>
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: "#6b7280",
                                  textTransform: "uppercase",
                                  letterSpacing: 1.2,
                                }}
                              >
                                From
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 16,
                                  fontWeight: 800,
                                  color: "#111827",
                                }}
                              >
                                {selectedBooking.origin}
                              </Typography>
                              <Typography
                                sx={{ fontSize: 12, color: "#475569" }}
                              >
                                {segment?.Origin?.Airport?.CityName}
                              </Typography>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: "#6b7280",
                                  textTransform: "uppercase",
                                  letterSpacing: 1.2,
                                }}
                              >
                                To
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 16,
                                  fontWeight: 800,
                                  color: "#111827",
                                }}
                              >
                                {selectedBooking.destination}
                              </Typography>
                              <Typography
                                sx={{ fontSize: 12, color: "#475569" }}
                              >
                                {segment?.Destination?.Airport?.CityName}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* ── CENTER MAIN ── */}
                    <Box
                      sx={{
                        px: 3,
                        py: 2,
                        position: "relative",
                        bgcolor: "rgba(240, 253, 244, 0.72)",
                        borderRight: { xs: "none", md: "2px dashed #cfe7d4" },
                        overflow: "hidden",
                      }}
                    >
                      {/* plane SVG watermark */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.045,
                          pointerEvents: "none",
                        }}
                      >
                        <svg
                          viewBox="0 0 300 180"
                          width="260"
                          height="150"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 90 L180 20 L230 45 L130 80 L200 110 L160 115 L115 90 L60 130 Z"
                            fill="#111827"
                          />
                          <path
                            d="M125 90 L230 45 L240 65 L160 90 Z"
                            fill="#111827"
                          />
                          <rect
                            x="155"
                            y="78"
                            width="50"
                            height="5"
                            rx="2"
                            fill="#111827"
                            transform="rotate(-10,155,78)"
                          />
                          <path
                            d="M10 90 L60 130 L55 140 L20 105 Z"
                            fill="#111827"
                          />
                        </svg>
                      </Box>
                      {/* grid texture */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0.03,
                          pointerEvents: "none",
                          backgroundImage:
                            "linear-gradient(#15803d 1px,transparent 1px),linear-gradient(90deg,#15803d 1px,transparent 1px)",
                          backgroundSize: "28px 28px",
                        }}
                      />

                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        {/* PNR + Booking Ref */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontSize: 11,
                                letterSpacing: 2,
                                color: "#111827",
                                textTransform: "uppercase",
                                fontWeight: 800,
                              }}
                            >
                              PNR
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 22,
                                fontWeight: 900,
                                color: "#111827",
                                fontFamily: "monospace",
                                letterSpacing: 2,
                                mt: 0.25,
                              }}
                            >
                              {selectedBooking.pnr}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontSize: 11,
                                letterSpacing: 2,
                                color: "#111827",
                                textTransform: "uppercase",
                                fontWeight: 800,
                              }}
                            >
                              Booking Ref
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: "#111827",
                                mt: 0.25,
                              }}
                            >
                              {selectedBooking.booking_id}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Airport codes */}
                        <Box
                          sx={{
                            mt: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: 38,
                                fontWeight: 900,
                                color: "#111827",
                                lineHeight: 1,
                                letterSpacing: -1,
                              }}
                            >
                              {selectedBooking.origin}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 13,
                                color: "#374151",
                                mt: 1,
                                fontWeight: 600,
                              }}
                            >
                              {new Date(
                                segment?.Origin?.DepTime,
                              ).toLocaleDateString([], {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                              {" · "}
                              {new Date(
                                segment?.Origin?.DepTime,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: 170,
                              textAlign: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#111827",
                                fontWeight: 900,
                                letterSpacing: 1.2,
                                textTransform: "uppercase",
                              }}
                            >
                              {segment?.Airline?.AirlineName}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                my: 1.25,
                              }}
                            >
                              <Box
                                sx={{ flex: 1, height: 2, bgcolor: "#bbf7d0" }}
                              />
                              <Typography
                                sx={{
                                  px: 1,
                                  color: "#111827",
                                  fontSize: 22,
                                  transform: "rotate(0deg)",
                                }}
                              >
                                ✈
                              </Typography>
                              <Box
                                sx={{ flex: 1, height: 2, bgcolor: "#bbf7d0" }}
                              />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#4b5563",
                                fontWeight: 800,
                                letterSpacing: 1,
                              }}
                            >
                              Flight {segment?.Airline?.FlightNumber}
                            </Typography>
                          </Box>

                          <Box sx={{ flex: 1, textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontSize: 38,
                                fontWeight: 900,
                                color: "#111827",
                                lineHeight: 1,
                                letterSpacing: -1,
                              }}
                            >
                              {selectedBooking.destination}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 13,
                                color: "#374151",
                                mt: 1,
                                fontWeight: 600,
                              }}
                            >
                              {new Date(
                                segment?.Destination?.ArrTime,
                              ).toLocaleDateString([], {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                              {" · "}
                              {new Date(
                                segment?.Destination?.ArrTime,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Seat & Class */}
                        <Box
                          sx={{
                            mt: 4,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            pt: 2.5,
                            borderTop: "1px dashed #d1fae5",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#6b7280",
                                textTransform: "uppercase",
                                letterSpacing: 1.2,
                              }}
                            >
                              Seat
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 17,
                                fontWeight: 800,
                                color: "#111827",
                              }}
                            >
                              {segment?.SeatNo || "—"}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#6b7280",
                                textTransform: "uppercase",
                                letterSpacing: 1.2,
                              }}
                            >
                              Class
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 17,
                                fontWeight: 800,
                                color: "#111827",
                              }}
                            >
                              {segment?.Class || "Economy"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* ── RIGHT STUB ── */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "rgba(255,255,255,0.94)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0.06,
                          pointerEvents: "none",
                          backgroundImage:
                            "radial-gradient(circle at 75% 20%, #15803d 0 12px, transparent 12px), radial-gradient(circle at 40% 80%, #15803d 0 16px, transparent 16px)",
                        }}
                      />
                      <Typography
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          left: "50%",
                          transform: "translateX(-50%)",
                          opacity: 0.04,
                          fontSize: 55,
                          pointerEvents: "none",
                          lineHeight: 1,
                        }}
                      >
                        ✈
                      </Typography>

                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: 11,
                            letterSpacing: 2,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            fontWeight: 800,
                          }}
                        >
                          Passenger
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#111827",
                            mt: 0.75,
                          }}
                        >
                          {passenger?.Title} {passenger?.FirstName}{" "}
                          {passenger?.LastName}
                        </Typography>

                        <Box sx={{ mt: 2.25 }}>
                          <Typography
                            sx={{
                              fontSize: 11,
                              letterSpacing: 2,
                              color: "#6b7280",
                              textTransform: "uppercase",
                              fontWeight: 800,
                            }}
                          >
                            Route
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#111827",
                              mt: 0.75,
                            }}
                          >
                            {selectedBooking.origin} →{" "}
                            {selectedBooking.destination}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2.25 }}>
                          <Typography
                            sx={{
                              fontSize: 11,
                              letterSpacing: 2,
                              color: "#6b7280",
                              textTransform: "uppercase",
                              fontWeight: 800,
                            }}
                          >
                            Boarding
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 900,
                              color: "#111827",
                              mt: 0.5,
                            }}
                          >
                            {new Date(
                              segment?.Origin?.DepTime,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2.25 }}>
                          <Typography
                            sx={{
                              fontSize: 11,
                              letterSpacing: 2,
                              color: "#6b7280",
                              textTransform: "uppercase",
                              fontWeight: 800,
                            }}
                          >
                            Ticket
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#111827",
                              mt: 0.5,
                            }}
                          >
                            {ticket?.TicketNumber}
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              display: "inline-flex",
                              px: 1.25,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: "#dcfce7",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 900,
                                color: "#111827",
                                textTransform: "uppercase",
                              }}
                            >
                              {ticket?.Status}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mt: 2.25 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              letterSpacing: 2,
                              color: "#6b7280",
                              textTransform: "uppercase",
                              fontWeight: 800,
                            }}
                          >
                            Baggage
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#111827",
                              mt: 0.75,
                              fontWeight: 600,
                            }}
                          >
                            Check-in: {segment?.Baggage}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#111827",
                              mt: 0.25,
                              fontWeight: 600,
                            }}
                          >
                            Cabin: {segment?.CabinBaggage}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* bottom green strip */}
                  <Box
                    sx={{
                      height: 8,
                      background:
                        "linear-gradient(90deg, #15803d 0%, #166534 100%)",
                    }}
                  />
                </Box>
              );
            })()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyTrips;
