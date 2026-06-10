import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const TravellersDropdown = () => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");

  return (
    <Box sx={{ border: "1px solid #E3E8EE", borderRadius: 1, p: 1, minWidth: 200 }}>
      {/* Adults */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box>
          <Typography>Adults</Typography>
          <Typography variant="body2" color="text.secondary">12+ Years</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="small" onClick={() => setAdults(Math.max(1, adults - 1))}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ mx: 1 }}>{adults}</Typography>
          <IconButton size="small" onClick={() => setAdults(adults + 1)}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Children */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box>
          <Typography>Children</Typography>
          <Typography variant="body2" color="text.secondary">2-12 yrs</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="small" onClick={() => setChildren(Math.max(0, children - 1))}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ mx: 1 }}>{children}</Typography>
          <IconButton size="small" onClick={() => setChildren(children + 1)}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Infants */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box>
          <Typography>Infant</Typography>
          <Typography variant="body2" color="text.secondary">0-2 yrs</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="small" onClick={() => setInfants(Math.max(0, infants - 1))}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ mx: 1 }}>{infants}</Typography>
          <IconButton size="small" onClick={() => setInfants(infants + 1)}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Travel Class */}
      <Box sx={{ mt: 1 }}>
        {["Economy", "Premium Economy", "First Class", "Business Class"].map((cls) => (
          <Box key={cls} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <input
              type="radio"
              name="travelClass"
              value={cls}
              checked={travelClass === cls}
              onChange={() => setTravelClass(cls)}
            />
            <Typography sx={{ ml: 1 }}>{cls}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TravellersDropdown;