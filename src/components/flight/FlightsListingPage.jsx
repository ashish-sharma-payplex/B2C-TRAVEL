import React, { useState } from "react";
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

const flightsData = [
  {
    id: 1,
    airline: "IndiGo",
    flightNo: "6E-2156",
    departure: "06:30",
    arrival: "09:15",
    from: "New Delhi",
    to: "Mumbai",
    duration: "2h 45m",
    stop: "Non-stop",
    price: 1650,
    seats: 5,
  },
  {
    id: 2,
    airline: "Akasa",
    flightNo: "6E-6218",
    departure: "06:30",
    arrival: "09:15",
    from: "New Delhi",
    to: "Mumbai",
    duration: "2h 45m",
    stop: "Non-stop",
    price: 1650,
    seats: 5,
  },
  {
    id: 3,
    airline: "IndiGo",
    flightNo: "6E-2156",
    departure: "06:30",
    arrival: "09:15",
    from: "New Delhi",
    to: "Mumbai",
    duration: "2h 45m",
    stop: "1 Stop",
    price: 1650,
    seats: 5,
  },
  {
    id: 4,
    airline: "IndiGo",
    flightNo: "6E-2156",
    departure: "06:30",
    arrival: "09:15",
    from: "New Delhi",
    to: "Mumbai",
    duration: "2h 45m",
    stop: "1 Stop",
    price: 1650,
    seats: 5,
  },
  {
    id: 5,
    airline: "IndiGo",
    flightNo: "6E-2156",
    departure: "06:30",
    arrival: "09:15",
    from: "New Delhi",
    to: "Mumbai",
    duration: "2h 45m",
    stop: "Non-stop",
    price: 1650,
    seats: 5,
  },
  {
    id: 6,
    airline: "IndiGo",
    flightNo: "6E-2156",
    departure: "06:30",
    arrival: "09:15",
    from: "New Delhi",
    to: "Mumbai",
    duration: "2h 45m",
    stop: "Non-stop",
    price: 1650,
    seats: 5,
  },
  {
    id: 7,
    airline: "Air India",
    flightNo: "AI 2945",
    departure: "06:30",
    arrival: "09:15",
    from: "New Delhi",
    to: "Mumbai",
    duration: "2h 45m",
    stop: "Non-stop",
    price: 1650,
    seats: 5,
  },
  {
    id: 8,
    airline: "Air India Express",
    flightNo: "IX 1242",
    departure: "06:30",
    arrival: "09:15",
    from: "New Delhi",
    to: "Mumbai",
    duration: "2h 45m",
    stop: "Non-stop",
    price: 1650,
    seats: 5,
  },
];

const FlightsListingPage = ({ searchParams }) => {

    const checkboxStyle = {
    color: "#B5BAC2",
    "&.Mui-checked": {
        color: "#1A914B",
    },
    };
  const [filteredFlights] = useState(flightsData);
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        p: { xs: 2, md: 3 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      
{/* Left Filters */}
<Paper
  elevation={0}
  sx={{
    width: { xs: "100%", md: "285px" },
    p: 2,
    borderRadius: "16px",
    border: "1px solid #E3E8EE",
    bgcolor: "#fff",
    height: "fit-content",
  }}
>
  {/* Header */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Typography
      sx={{
        fontSize: "18px",
        fontWeight: 500,
        color: "#383E48",
      }}
    >
      Filter by:
    </Typography>

    <Typography
      sx={{
        color: "#1A914B",
        textDecoration: "underline",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      Clear
    </Typography>
  </Box>

  {/* Price */}
  <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
    Price Range
  </Typography>

  <Slider
    value={priceRange}
    onChange={handlePriceChange}
    min={4526}
    max={21856}
    sx={{
      color: "#1A914B",
    }}
  />

  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: 14,
      mb: 2,
    }}
  >
    <Typography>₹ 4,526</Typography>
    <Typography>₹ 21,856</Typography>
  </Box>

  <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

  {/* Stops */}
  <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
    Stops
  </Typography>

 <FormControlLabel
  control={
    <Checkbox
      size="small"
      sx={{
        color: "#B5BAC2",
        "&.Mui-checked": {
          color: "#1A914B",
        },
      }}
    />
  }
  label="Nonstop"
/>

<FormControlLabel
  control={
    <Checkbox
      size="small"
      sx={{
        color: "#B5BAC2",
        "&.Mui-checked": {
          color: "#1A914B",
        },
      }}
    />
  }
  label="1 Stop"
/>

<FormControlLabel
  control={
    <Checkbox
      size="small"
      sx={{
        color: "#B5BAC2",
        "&.Mui-checked": {
          color: "#1A914B",
        },
      }}
    />
  }
  label="2+ Stop"
/>

  <Divider sx={{ borderStyle: "dashed", my: 2 }} />

  {/* Nearby Airport */}
  <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
    Nearby Airport
  </Typography>

  <Typography sx={{ mb: 1 }}>Delhi</Typography>

  <FormControlLabel
    control={<Checkbox size="small" sx={checkboxStyle} />}
    label="DEL: New Delhi"
  />

  <FormControlLabel
    control={<Checkbox size="small" sx={checkboxStyle} />}
    label="HDO: Ghaziabad"
  />

  <Typography sx={{ mt: 2, mb: 1 }}>Mumbai</Typography>

  <FormControlLabel
    control={<Checkbox size="small" sx={checkboxStyle} />}
    label="BOM: Mumbai"
  />

  <FormControlLabel
    control={<Checkbox size="small" sx={checkboxStyle} />}
    label="NMI: Navi Mumbai"
  />

  <Divider sx={{ borderStyle: "dashed", my: 2 }} />

  {/* Departure */}
  <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
    Departure from Delhi
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 1.5,
    }}
  >
{[
  "Before 6 AM",
  "6AM - 12PM",
  "12PM - 6PM",
  "6PM - 12AM",
].map((item) => (
  <Paper
    key={item}
    onClick={() => setDepartureTime(item)}
    sx={{
      p: 1.5,
      textAlign: "center",
      borderRadius: "8px",
      cursor: "pointer",
      border:
        departureTime === item
          ? "1px solid #1A914B"
          : "1px solid #E3E8EE",
      backgroundColor:
        departureTime === item
          ? "#EAF7EF"
          : "#FFFFFF",
      transition: "all .2s",
      "&:hover": {
        borderColor: "#1A914B",
      },
    }}
  >
        <Typography fontSize={12}>
          {item}
        </Typography>
      </Paper>
    ))}
  </Box>

  <Divider sx={{ borderStyle: "dashed", my: 2 }} />

  {/* Arrival */}
  <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
    Arrival at Mumbai
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 1.5,
    }}
  >
{[
  "Before 6 AM",
  "6AM - 12PM",
  "12PM - 6PM",
  "6PM - 12AM",
].map((item) => (
  <Paper
    key={item}
    onClick={() => setArrivalTime(item)}
    sx={{
      p: 1.5,
      textAlign: "center",
      borderRadius: "8px",
      cursor: "pointer",
      border:
        arrivalTime === item
          ? "1px solid #1A914B"
          : "1px solid #E3E8EE",
      backgroundColor:
        arrivalTime === item
          ? "#EAF7EF"
          : "#FFFFFF",
      transition: "all .2s",
      "&:hover": {
        borderColor: "#1A914B",
      },
    }}
  >
        <Typography fontSize={12}>
          {item}
        </Typography>
      </Paper>
    ))}
  </Box>

  <Divider sx={{ borderStyle: "dashed", my: 2 }} />

  {/* Airlines */}
  <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
    Airlines
  </Typography>

  {[
    "IndiGo",
    "Air India",
    "Air India Express",
    "Spicejet",
    "Akasa Air",
  ].map((airline) => (
    <FormControlLabel
      key={airline}
      control={<Checkbox size="small" sx={checkboxStyle} />}
      label={airline}
    />
  ))}

  <Divider sx={{ borderStyle: "dashed", my: 2 }} />

  {/* Aircraft */}
  <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
    Aircraft Size
  </Typography>

  <FormControlLabel
    control={<Checkbox size="small" sx={checkboxStyle} />}
    label="Small/Mid-size aircraft"
  />

  <FormControlLabel
    control={<Checkbox size="small" sx={checkboxStyle} />}
    label="Large Aircraft"
  />
</Paper>

      {/* Right Listing */}
      <Box sx={{ flex: 1 }}>
        {filteredFlights.map((flight) => (
          <Paper
            key={flight.id}
            elevation={2}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                gap: 3,
              }}
            >
              {/* Flight Details */}
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  gap: 4,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    {flight.airline}
                  </Typography>

                  <Typography variant="body2">
                    {flight.flightNo}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    {flight.departure}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {flight.from}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="warning.main"
                  >
                    {flight.duration}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {flight.nonstop ? "Non-stop" : "1 Stop"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    {flight.arrival}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {flight.to}
                  </Typography>
                </Box>
              </Box>

              {/* Price + Button */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: {
                    xs: "flex-start",
                    md: "flex-end",
                  },
                  gap: 1,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="primary"
                >
                  ₹{flight.price}
                </Typography>

                <Typography
                  variant="caption"
                  color="success.main"
                >
                  {flight.seats} seats left
                </Typography>

                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    textTransform: "none",
                    px: 3,
                    borderRadius: 2,
                  }}
                >
                  Book Now
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default FlightsListingPage;