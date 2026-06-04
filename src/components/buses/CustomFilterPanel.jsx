import React, { useState } from "react";
import { Box, Typography, Checkbox } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import HotelIcon from "@mui/icons-material/Hotel";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";

const GREEN = "#16a34a";

const SectionHeader = ({ label, open, toggle }) => (
  <Box
    onClick={toggle}
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      mb: "10px",
    }}
  >
    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
      {label}
    </Typography>
    {open ? (
      <ExpandLessIcon sx={{ fontSize: 18, color: "#6b7280" }} />
    ) : (
      <ExpandMoreIcon sx={{ fontSize: 18, color: "#6b7280" }} />
    )}
  </Box>
);

const CommonBusFilterPanel = ({ filters, setFilters }) => {
  const [depOpen, setDepOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);
  const [boardOpen, setBoardOpen] = useState(true);
  const [dropOpen, setDropOpen] = useState(true);

  const departureSlots = [
    { key: "slot1", label: "12AM - 6AM", Icon: NightsStayIcon },
    { key: "slot2", label: "6AM - 12PM", Icon: WbTwilightIcon },
    { key: "slot3", label: "12PM - 6PM", Icon: WbSunnyIcon },
    { key: "slot4", label: "6PM - 12AM", Icon: DarkModeIcon },
  ];

  const busTypes = [
    { key: "ac", label: "AC", Icon: AcUnitIcon },
    { key: "nonAc", label: "Non AC", Icon: AirIcon },
    { key: "seater", label: "Seater", Icon: EventSeatIcon },
    { key: "sleeper", label: "Sleeper", Icon: HotelIcon },
  ];

  const boardingPoints = ["Airoli", "Dadar", "Bandra", "Kurla"];
  const droppingPoints = [
    "Alandi phata",
    "Ambegoan",
    "Talegoan",
    "Finolx Pcmc",
  ];

  const toggleDepSlot = (key) =>
    setFilters((f) => ({
      ...f,
      depSlots: { ...f.depSlots, [key]: !f.depSlots[key] },
    }));

  const toggleBusType = (key) =>
    setFilters((f) => ({
      ...f,
      busTypes: { ...f.busTypes, [key]: !f.busTypes[key] },
    }));

  const togglePoint = (arr, val) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        p: "18px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "16px",
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
          Filter by:
        </Typography>
        <Typography
          onClick={() =>
            setFilters({
              depSlots: {
                slot1: false,
                slot2: false,
                slot3: false,
                slot4: false,
              },
              busTypes: {
                ac: false,
                nonAc: false,
                seater: false,
                sleeper: false,
              },
              boardingPoints: [],
              droppingPoints: [],
            })
          }
          sx={{
            fontSize: 13,
            color: "#111",
            textDecoration: "underline",
            cursor: "pointer",
            "&:hover": { color: GREEN },
          }}
        >
          Clear
        </Typography>
      </Box>

      <Box sx={{ height: "1px", bgcolor: "#f3f4f6", mb: "16px" }} />

      {/* Departure Time */}
      <SectionHeader
        label="Departure Time"
        open={depOpen}
        toggle={() => setDepOpen((o) => !o)}
      />
      {depOpen && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            mb: "16px",
          }}
        >
          {departureSlots.map(({ key, label, Icon }) => (
            <Box
              key={key}
              onClick={() => toggleDepSlot(key)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <Checkbox
                checked={filters.depSlots[key]}
                size="small"
                sx={{
                  p: 0.3,
                  color: "#d1d5db",
                  "&.Mui-checked": { color: GREEN },
                  "& .MuiSvgIcon-root": { fontSize: 18 },
                }}
              />
              <Icon sx={{ fontSize: 16, color: "#9ca3af" }} />
              <Typography sx={{ fontSize: 13, color: "#374151" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ height: "1px", bgcolor: "#f3f4f6", mb: "16px" }} />

      {/* Bus Type */}
      <SectionHeader
        label="Bus Type"
        open={typeOpen}
        toggle={() => setTypeOpen((o) => !o)}
      />
      {typeOpen && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            mb: "16px",
          }}
        >
          {busTypes.map(({ key, label, Icon }) => (
            <Box
              key={key}
              onClick={() => toggleBusType(key)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
                py: "10px",
                px: "6px",
                border: filters.busTypes[key]
                  ? `1.5px solid ${GREEN}`
                  : "1px solid #e5e7eb",
                borderRadius: "10px",
                bgcolor: filters.busTypes[key] ? "#f0fdf4" : "#fff",
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": { borderColor: GREEN },
              }}
            >
              <Icon
                sx={{
                  fontSize: 20,
                  color: filters.busTypes[key] ? GREEN : "#9ca3af",
                }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  color: filters.busTypes[key] ? GREEN : "#6b7280",
                  fontWeight: filters.busTypes[key] ? 600 : 400,
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ height: "1px", bgcolor: "#f3f4f6", mb: "16px" }} />

      {/* Boarding Point */}
      <SectionHeader
        label="Boarding Point"
        open={boardOpen}
        toggle={() => setBoardOpen((o) => !o)}
      />
      {boardOpen && (
        <Box sx={{ mb: "16px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              px: "10px",
              py: "7px",
              mb: "10px",
            }}
          >
            <SearchIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
            <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
              Search Boarding Point
            </Typography>
          </Box>
          {boardingPoints.map((pt) => (
            <Box
              key={pt}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  boardingPoints: togglePoint(f.boardingPoints, pt),
                }))
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                mb: "6px",
              }}
            >
              <Checkbox
                checked={filters.boardingPoints.includes(pt)}
                size="small"
                sx={{
                  p: 0.3,
                  color: "#d1d5db",
                  "&.Mui-checked": { color: GREEN },
                  "& .MuiSvgIcon-root": { fontSize: 18 },
                }}
              />
              <Typography sx={{ fontSize: 13, color: "#374151" }}>
                {pt}
              </Typography>
            </Box>
          ))}
          <Typography
            sx={{
              fontSize: 13,
              color: GREEN,
              fontWeight: 600,
              cursor: "pointer",
              mt: "4px",
            }}
          >
            + Show all boarding points
          </Typography>
        </Box>
      )}

      <Box sx={{ height: "1px", bgcolor: "#f3f4f6", mb: "16px" }} />

      {/* Dropping Point */}
      <SectionHeader
        label="Dropping Point"
        open={dropOpen}
        toggle={() => setDropOpen((o) => !o)}
      />
      {dropOpen && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              px: "10px",
              py: "7px",
              mb: "10px",
            }}
          >
            <SearchIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
            <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
              Search Dropping Point
            </Typography>
          </Box>
          {droppingPoints.map((pt) => (
            <Box
              key={pt}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  droppingPoints: togglePoint(f.droppingPoints, pt),
                }))
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                mb: "6px",
              }}
            >
              <Checkbox
                checked={filters.droppingPoints.includes(pt)}
                size="small"
                sx={{
                  p: 0.3,
                  color: "#d1d5db",
                  "&.Mui-checked": { color: GREEN },
                  "& .MuiSvgIcon-root": { fontSize: 18 },
                }}
              />
              <Typography sx={{ fontSize: 13, color: "#374151" }}>
                {pt}
              </Typography>
            </Box>
          ))}
          <Typography
            sx={{
              fontSize: 13,
              color: GREEN,
              fontWeight: 600,
              cursor: "pointer",
              mt: "4px",
            }}
          >
            + Show all dropping points
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CommonBusFilterPanel;
