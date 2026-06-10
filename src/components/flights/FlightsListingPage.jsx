import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Slider,
} from "@mui/material";

const FlightsListingPage = () => {
  const location = useLocation();
  const flights = location.state?.flights || []; // API data

  const checkboxStyle = {
    color: "#B5BAC2",
    "&.Mui-checked": {
      color: "#1A914B",
    },
  };

  // Filters state
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState([]);

  const handlePriceChange = (event, newValue) => setPriceRange(newValue);

  const handleStopChange = (stop) => {
    setSelectedStops((prev) =>
      prev.includes(stop)
        ? prev.filter((s) => s !== stop)
        : [...prev, stop]
    );
  };

  const handleAirlineChange = (airline) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((a) => a !== airline)
        : [...prev, airline]
    );
  };

  const handleAircraftChange = (aircraft) => {
    setSelectedAircraft((prev) =>
      prev.includes(aircraft)
        ? prev.filter((a) => a !== aircraft)
        : [...prev, aircraft]
    );
  };

  // Filter flights based on selected filters
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const firstLeg = flight.Segments?.[0]?.[0];
      if (!firstLeg) return false;

      const depTime = firstLeg.Origin?.DepTime?.split("T")[1]?.substring(0, 5);
      const arrTime = firstLeg.Destination?.ArrTime?.split("T")[1]?.substring(0, 5);

      const price = flight.Fare?.PublishedFare || 0;

      // Filter Price
      if (price < priceRange[0] || price > priceRange[1]) return false;

      // Filter Stops
      if (selectedStops.length > 0) {
        const stopsCount = flight.Segments.length - 1;
        const stopText =
          stopsCount === 0 ? "Nonstop" : stopsCount === 1 ? "1 Stop" : "2+ Stop";
        if (!selectedStops.includes(stopText)) return false;
      }

      // Filter Departure Time
      if (departureTime) {
        if (!depTime) return false;
        const hour = parseInt(depTime.split(":")[0]);
        if (
          (departureTime === "Before 6 AM" && hour >= 6) ||
          (departureTime === "6AM - 12PM" && (hour < 6 || hour >= 12)) ||
          (departureTime === "12PM - 6PM" && (hour < 12 || hour >= 18)) ||
          (departureTime === "6PM - 12AM" && (hour < 18 || hour >= 24))
        )
          return false;
      }

      // Filter Arrival Time
      if (arrivalTime) {
        if (!arrTime) return false;
        const hour = parseInt(arrTime.split(":")[0]);
        if (
          (arrivalTime === "Before 6 AM" && hour >= 6) ||
          (arrivalTime === "6AM - 12PM" && (hour < 6 || hour >= 12)) ||
          (arrivalTime === "12PM - 6PM" && (hour < 12 || hour >= 18)) ||
          (arrivalTime === "6PM - 12AM" && (hour < 18 || hour >= 24))
        )
          return false;
      }

      // Filter Airlines
      if (selectedAirlines.length > 0) {
        if (!selectedAirlines.includes(firstLeg.Airline?.AirlineName)) return false;
      }

      // Filter Aircraft
      if (selectedAircraft.length > 0) {
        const size = flight.AircraftSize || "Small/Mid-size aircraft"; // Replace with actual API field
        if (!selectedAircraft.includes(size)) return false;
      }

      return true;
    });
  }, [
    flights,
    priceRange,
    departureTime,
    arrivalTime,
    selectedStops,
    selectedAirlines,
    selectedAircraft,
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, p: { xs: 2, md: 3 }, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Left Filters */}
      <Paper elevation={0} sx={{ width: { xs: "100%", md: "285px" }, p: 2, borderRadius: "16px", border: "1px solid #E3E8EE", bgcolor: "#fff", height: "fit-content" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#383E48" }}>Filter by:</Typography>
          <Typography sx={{ color: "#1A914B", textDecoration: "underline", cursor: "pointer", fontSize: 14 }} onClick={() => { setPriceRange([0, 100000]); setDepartureTime(""); setArrivalTime(""); setSelectedStops([]); setSelectedAirlines([]); setSelectedAircraft([]); }}>Clear</Typography>
        </Box>

        {/* Price Range */}
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>Price Range</Typography>
        <Slider value={priceRange} onChange={handlePriceChange} min={4526} max={21856} sx={{ color: "#1A914B" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14, mb: 2 }}>
          <Typography>₹ {priceRange[0]}</Typography>
          <Typography>₹ {priceRange[1]}</Typography>
        </Box>
        <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

        {/* Stops */}
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>Stops</Typography>
        {["Nonstop", "1 Stop", "2+ Stop"].map((stop) => (
          <FormControlLabel key={stop} control={<Checkbox size="small" sx={checkboxStyle} checked={selectedStops.includes(stop)} onChange={() => handleStopChange(stop)} />} label={stop} />
        ))}

        {/* Departure & Arrival */}
        <Divider sx={{ borderStyle: "dashed", my: 2 }} />
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>Departure from Delhi</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
          {["Before 6 AM", "6AM - 12PM", "12PM - 6PM", "6PM - 12AM"].map((item) => (
            <Paper key={item} onClick={() => setDepartureTime(item)} sx={{ p: 1.5, textAlign: "center", borderRadius: "8px", cursor: "pointer", border: departureTime === item ? "1px solid #1A914B" : "1px solid #E3E8EE", backgroundColor: departureTime === item ? "#EAF7EF" : "#FFFFFF", "&:hover": { borderColor: "#1A914B" } }}>
              <Typography fontSize={12}>{item}</Typography>
            </Paper>
          ))}
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>Arrival at Mumbai</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
          {["Before 6 AM", "6AM - 12PM", "12PM - 6PM", "6PM - 12AM"].map((item) => (
            <Paper key={item} onClick={() => setArrivalTime(item)} sx={{ p: 1.5, textAlign: "center", borderRadius: "8px", cursor: "pointer", border: arrivalTime === item ? "1px solid #1A914B" : "1px solid #E3E8EE", backgroundColor: arrivalTime === item ? "#EAF7EF" : "#FFFFFF", "&:hover": { borderColor: "#1A914B" } }}>
              <Typography fontSize={12}>{item}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Airlines */}
        <Divider sx={{ borderStyle: "dashed", my: 2 }} />
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>Airlines</Typography>
        
        {["IndiGo", "Air India", "Air India Express", "Spicejet", "Akasa Air"].map((airline) => (
          <FormControlLabel
            key={airline}
            control={
              <Checkbox
                size="small"
                sx={checkboxStyle}
                checked={selectedAirlines.some(a =>
                  flights.some(f => f.Segments?.[0]?.[0]?.Airline?.AirlineName === a)
                ) && selectedAirlines.includes(airline)}
                onChange={() => {
                  if (selectedAirlines.includes(airline)) {
                    setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
                  } else {
                    setSelectedAirlines([...selectedAirlines, airline]);
                  }
                }}
              />
            }
            label={airline}
          />
        ))}

        {/* Aircraft Size */}
        <Divider sx={{ borderStyle: "dashed", my: 2 }} />
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>Aircraft Size</Typography>
        {["Small/Mid-size aircraft", "Large Aircraft"].map((size) => (
          <FormControlLabel key={size} control={<Checkbox size="small" sx={checkboxStyle} checked={selectedAircraft.includes(size)} onChange={() => handleAircraftChange(size)} />} label={size} />
        ))}
      </Paper>

      {/* Right Listing */}
      <Box sx={{ flex: 1 }}>
        {filteredFlights.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6">No Flights Found</Typography>
          </Paper>
        ) : (
          filteredFlights.map((flight, index) => {
            const firstLeg = flight.Segments?.[0]?.[0];
            if (!firstLeg) return null;
            const depTime = firstLeg.Origin?.DepTime?.split("T")[1]?.substring(0, 5);
            const arrTime = firstLeg.Destination?.ArrTime?.split("T")[1]?.substring(0, 5);
            const durationHours = Math.floor(firstLeg.Duration / 60);
            const durationMinutes = firstLeg.Duration % 60;

            return (
              <Paper key={index} elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 3 }}>
                  <Box sx={{ display: "flex", flex: 1, flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, gap: 4 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">{firstLeg.Airline?.AirlineName}</Typography>
                      <Typography variant="body2">{firstLeg.Airline?.FlightNumber}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>{depTime}</Typography>
                      <Typography variant="body2" color="text.secondary">{firstLeg.Origin?.Airport?.CityName}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" fontWeight={600} color="warning.main">{durationHours}h {durationMinutes}m</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {flight.Segments.length === 1 ? "Non-stop" : `${flight.Segments.length - 1} Stop`}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>{arrTime}</Typography>
                      <Typography variant="body2" color="text.secondary">{firstLeg.Destination?.Airport?.CityName}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "flex-end" }, gap: 1 }}>
                    <Typography variant="h5" fontWeight={700} color="primary">₹{flight.Fare?.PublishedFare}</Typography>
                    <Typography variant="caption" color="success.main">Available</Typography>
                    <Button variant="contained" color="success" sx={{ textTransform: "none", px: 3, borderRadius: 2 }}>Book Now</Button>
                  </Box>
                </Box>
              </Paper>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default FlightsListingPage;