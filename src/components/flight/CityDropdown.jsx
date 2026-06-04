import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  InputBase,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon    from "@mui/icons-material/FlightLand";
import SearchIcon        from "@mui/icons-material/Search";
import LocationOnIcon    from "@mui/icons-material/LocationOn";
import AccessTimeIcon    from "@mui/icons-material/AccessTime";

const GREEN  = "#1A914B";
const BORDER = "#E3E8EE";

// ── City Data ──────────────────────────────────────────────
const CITIES = [
  { code: "BOM", city: "Mumbai",      airport: "Chhatrapati Shivaji Maharaj Intl Airport", state: "Maharashtra" },
  { code: "DEL", city: "New Delhi",   airport: "Indira Gandhi International Airport",       state: "Delhi"       },
  { code: "BLR", city: "Bengaluru",   airport: "Kempegowda International Airport",          state: "Karnataka"   },
  { code: "HYD", city: "Hyderabad",   airport: "Rajiv Gandhi International Airport",        state: "Telangana"   },
  { code: "MAA", city: "Chennai",     airport: "Chennai International Airport",             state: "Tamil Nadu"  },
  { code: "CCU", city: "Kolkata",     airport: "Netaji Subhas Chandra Bose Intl Airport",   state: "West Bengal" },
  { code: "PNQ", city: "Pune",        airport: "Pune International Airport",                state: "Maharashtra" },
  { code: "AMD", city: "Ahmedabad",   airport: "Sardar Vallabhbhai Patel Intl Airport",     state: "Gujarat"     },
  { code: "GOI", city: "Goa",         airport: "Goa International Airport (Dabolim)",       state: "Goa"         },
  { code: "JAI", city: "Jaipur",      airport: "Jaipur International Airport",              state: "Rajasthan"   },
  { code: "SXR", city: "Srinagar",    airport: "Sheikh ul-Alam International Airport",      state: "J&K"         },
  { code: "IXC", city: "Chandigarh",  airport: "Chandigarh International Airport",          state: "Punjab"      },
  { code: "VNS", city: "Varanasi",    airport: "Lal Bahadur Shastri International Airport", state: "UP"          },
  { code: "SHL", city: "Shimla",      airport: "Shimla Airport (Jubbarhatti)",              state: "HP"          },
  { code: "KUU", city: "Manali",      airport: "Kullu Manali Airport",                      state: "HP"          },
  { code: "AGR", city: "Agra",        airport: "Agra Airport (Pandit Deen Dayal Upadhyay)", state: "UP"          },
  { code: "TRV", city: "Thiruvananthapuram", airport: "Trivandrum International Airport",   state: "Kerala"      },
  { code: "COK", city: "Kochi",       airport: "Cochin International Airport",              state: "Kerala"      },
  { code: "NAG", city: "Nagpur",      airport: "Dr. Babasaheb Ambedkar Intl Airport",       state: "Maharashtra" },
  { code: "IXJ", city: "Jammu",       airport: "Jammu Airport (Satwari)",                   state: "J&K"         },
];

const POPULAR = ["BOM", "DEL", "BLR", "HYD", "MAA", "GOI"];

// ── Main Component ─────────────────────────────────────────
const CityDropdown = ({ label, value, onChange, icon, excludeCode }) => {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const [recent, setRecent]   = useState(["DEL", "BLR", "HYD"]);
  const ref                   = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? CITIES.filter(
        (c) =>
          c.code !== excludeCode &&
          (c.city.toLowerCase().includes(query.toLowerCase()) ||
            c.code.toLowerCase().includes(query.toLowerCase()) ||
            c.airport.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const popularCities = CITIES.filter(
    (c) => POPULAR.includes(c.code) && c.code !== excludeCode
  );

  const recentCities = CITIES.filter(
    (c) => recent.includes(c.code) && c.code !== excludeCode
  );

  const handleSelect = (city) => {
    onChange(city);
    setRecent((prev) => {
      const next = [city.code, ...prev.filter((c) => c !== city.code)].slice(0, 4);
      return next;
    });
    setQuery("");
    setOpen(false);
  };

  const displayValue = value ? `${value.code} - ${value.city}` : "";

  return (
    <Box ref={ref} sx={{ flex: "1 1 200px", position: "relative" }}>
      {/* ── Floating Label ── */}
      <Box
        sx={{
          position: "absolute",
          top: -12,
          left: 8,
          zIndex: 1,
          bgcolor: "#fff",
          px: 1,
          borderRadius: 1,
        }}
      >
        <Typography sx={{ color: "#555", fontSize: 12 }}>{label}</Typography>
      </Box>

      {/* ── Trigger Box ── */}
      <Box
        onClick={() => { setOpen(true); setQuery(""); }}
        sx={{
          border: `1px solid ${open ? GREEN : BORDER}`,
          borderRadius: 2,
          px: 1.5,
          py: "10px",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
          bgcolor: "#fff",
          transition: "border-color 0.2s",
          "&:hover": { borderColor: GREEN },
        }}
      >
        <Box sx={{ color: "#555", display: "flex" }}>{icon}</Box>
        <Typography
          fontSize={16}
          color={value ? "#333" : "#aaa"}
          sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {displayValue || "Select city"}
        </Typography>
      </Box>

      {/* ── Dropdown Panel ── */}
      {open && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: { xs: "90vw", sm: 380 },
            maxWidth: 420,
            bgcolor: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Search Input */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${BORDER}`,
              bgcolor: "#fafafa",
            }}
          >
            <SearchIcon sx={{ color: "#888", fontSize: 20 }} />
            <InputBase
              autoFocus
              placeholder="Search city or airport..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1, fontSize: 15, color: "#333" }}
            />
          </Box>

          <Box sx={{ maxHeight: 340, overflowY: "auto" }}>
            {/* ── Search Results ── */}
            {query.trim() ? (
              filtered.length > 0 ? (
                <Box>
                  <SectionLabel label="Search Results" />
                  {filtered.map((c) => (
                    <CityRow key={c.code} city={c} onSelect={handleSelect} />
                  ))}
                </Box>
              ) : (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography fontSize={14} color="#999">No city found for "{query}"</Typography>
                </Box>
              )
            ) : (
              <>
                {/* Recent Searches */}
                {recentCities.length > 0 && (
                  <Box>
                    <SectionLabel label="Recent Searches" icon={<AccessTimeIcon sx={{ fontSize: 14, color: "#888" }} />} />
                    {recentCities.map((c) => (
                      <CityRow key={c.code} city={c} onSelect={handleSelect} />
                    ))}
                  </Box>
                )}

                {/* Popular Cities */}
                <Box>
                  <SectionLabel label="Popular Cities" />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, px: 2, pb: 2 }}>
                    {popularCities.map((c) => (
                      <Box
                        key={c.code}
                        onClick={() => handleSelect(c)}
                        sx={{
                          border: `1px solid ${BORDER}`,
                          borderRadius: "8px",
                          px: 1.5,
                          py: 0.8,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: 70,
                          "&:hover": { borderColor: GREEN, bgcolor: "#f0faf4" },
                          transition: "all 0.15s",
                        }}
                      >
                        <Typography fontSize={13} fontWeight={700} color={GREEN}>
                          {c.code}
                        </Typography>
                        <Typography fontSize={11} color="#555">{c.city}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* All Cities */}
                <Box>
                  <SectionLabel label="All Cities" />
                  {CITIES.filter((c) => c.code !== excludeCode).map((c) => (
                    <CityRow key={c.code} city={c} onSelect={handleSelect} />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

// ── Section Label ──────────────────────────────────────────
const SectionLabel = ({ label, icon }) => (
  <Box
    sx={{
      px: 2,
      py: 1,
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      bgcolor: "#f8f9fa",
      borderBottom: `1px solid ${BORDER}`,
    }}
  >
    {icon}
    <Typography fontSize={11} fontWeight={700} color="#888" textTransform="uppercase" letterSpacing={0.8}>
      {label}
    </Typography>
  </Box>
);

// ── City Row ───────────────────────────────────────────────
const CityRow = ({ city, onSelect }) => (
  <Box
    onClick={() => onSelect(city)}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: 2,
      py: 1.2,
      cursor: "pointer",
      "&:hover": { bgcolor: "#f0faf4" },
      transition: "background 0.15s",
      borderBottom: `1px solid #f5f5f5`,
    }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: "8px",
        bgcolor: "#f0f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <LocationOnIcon sx={{ color: GREEN, fontSize: 18 }} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography fontSize={14} fontWeight={600} color="#111">
          {city.city}
        </Typography>
        <Typography
          fontSize={11}
          fontWeight={700}
          color={GREEN}
          sx={{ bgcolor: "#f0faf4", px: 0.8, py: 0.2, borderRadius: 1 }}
        >
          {city.code}
        </Typography>
      </Box>
      <Typography
        fontSize={12}
        color="#888"
        sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {city.airport}
      </Typography>
    </Box>
  </Box>
);

export default CityDropdown;
