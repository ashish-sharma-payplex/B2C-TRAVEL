import React from "react";
import { Box, Typography } from "@mui/material";

// Images from public folder
const routes = [
  { city: "Bengaluru", to: "Hyderabad, Mumbai, Goa, Chennai, Pune", img: "/bengaluru.svg" },
  { city: "Hyderabad", to: "Bengaluru, Mumbai, Goa, Chennai, Pune", img: "/hyderabad.svg" },
  { city: "Pune", to: "Mumbai, Bengaluru, Goa, Indore, Hyderabad", img: "/pune.svg" },
  { city: "Chennai", to: "Bengaluru, Coimbatore, Hyderabad, Madurai", img: "/chennai.svg" },
  { city: "Delhi", to: "Manali, Jaipur, Amritsar, Lucknow, Shimla", img: "/delhi.svg" },
  { city: "Mumbai", to: "Bengaluru, Goa, Indore, Hyderabad", img: "/mumbai.svg" },
  { city: "Jaipur", to: "Delhi, Bikaner, Luknow, Jodhpur, Indore", img: "/jaipur.svg" },
  { city: "Goa", to: "Hyderabad, Bengaluru, Pune, Mumbai, Kolhapur", img: "/goa.svg" },
  { city: "Ahmedabad", to: "Porbandar, Jamnagar, Udaipur, Indore, Rajkot", img: "/ahmedabad.svg" },
  { city: "Coimbatore", to: "Chennai, Bengaluru, Hyderabad, Sivakasi", img: "/coimbatore.svg" },
  { city: "Indore", to: "Mumbai, Pune, Nagpur, Ahmedabad, Ahmednagar", img: "/indore.svg" },
  { city: "Nagpur", to: "Mumbai, Bengaluru, Goa, Indore, Hyderabad", img: "/nagpur.svg" },
];

const PopularRoutes = () => {
  return (
    <Box sx={{ mt: 6, px: { xs: 2, sm: 3, md: 0 } }}>
      <Typography sx={{ fontSize: { xs: 20, sm: 22, md: 24 }, fontWeight: 600, mb: 3 }}>
        Popular Routes🔥
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {routes.map((route) => (
          <Box
            key={route.city}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Box
              component="img"
              src={route.img}
              alt={route.city}
              sx={{ width: 70, height: 70, borderRadius: 2, objectFit: "cover" }}
            />
            <Box>
              <Typography sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, fontWeight: 500, lineHeight: "28px" }}>
                {route.city}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 14, sm: 15, md: 16 },
                  fontWeight: 400,
                  lineHeight: "19px",
                  color: "#5E5E5E",
                }}
              >
                To: {route.to}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PopularRoutes;