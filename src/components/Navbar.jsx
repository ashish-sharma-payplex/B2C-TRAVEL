import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Box, Typography, Button,
  IconButton, Drawer, List, ListItem,
  ListItemButton, ListItemText, Divider,
  useMediaQuery, useTheme,
} from "@mui/material";
import MenuIcon               from "@mui/icons-material/Menu";
import PersonOutlinedIcon     from "@mui/icons-material/PersonOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LuggageOutlinedIcon    from "@mui/icons-material/LuggageOutlined";

const GREEN = "#16a34a";

const RIGHT_ITEMS = [
  { label: "Offers",   icon: <LocalOfferOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Support",  icon: <HeadsetMicOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "My Trips", icon: <LuggageOutlinedIcon    sx={{ fontSize: 18 }} />, subtitle: "Manage Booking" },
];

const CATEGORIES = [
  { label: "Flights", img: "/navbaricons/flightslogo.svg", path: "/flights", emoji: "✈️" },
  { label: "Hotels",  img: "/navbaricons/hotelslogo.svg",  path: "/hotels",  emoji: "🏨" },
  { label: "Buses",   img: "/navbaricons/buseslogo.svg",   path: "/buses",   emoji: "🚌" },
  { label: "Trains",  img: "/navbaricons/trainslogo.svg",  path: "/trains",  emoji: "🚆" },
];

const Navbar = ({ scrolled }) => {
  const [drawerOpen, setDrawer] = useState(false);
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate  = useNavigate();
  const location  = useLocation();

  // Hotels page pe CategoryTabs already hai — duplicate mat dikha
 const hideCategories =
  location.pathname.startsWith("/hotels/results") ||
  location.pathname.startsWith("/hotels/details");

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: "#ffffff",
          color: "#1a1a1a",
          borderBottom: "1px solid #e8e8e8",
          transform: scrolled ? "translateY(-100%)" : "translateY(0)",
          opacity: scrolled ? 0 : 1,
          visibility: scrolled ? "hidden" : "visible",
          transition: "transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: "64px !important", gap: 1 }}>

          {/* Logo */}
          <Box
            component="a" href="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none", mr: 2, flexShrink: 0 }}
          >
            <Box
              component="img"
              src="/navbaricons/dealplexlogo.svg"
              alt="Dealplex"
              sx={{ height: 38, objectFit: "contain" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </Box>

          {/* Desktop Categories — hotels pe hide */}
          {!isMobile && !hideCategories && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
              {CATEGORIES.map((cat) => {
                const isActive = location.pathname === cat.path;
                return (
                  <Box
                    key={cat.label}
                    onClick={() => navigate(cat.path)}
                    sx={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      px: 2.5, py: 1, cursor: "pointer", borderRadius: "10px",
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    <Box
                      component="img"
                      src={cat.img}
                      alt={cat.label}
                      sx={{ width: 28, height: 28, objectFit: "contain", mb: 0.4 }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? GREEN : "#444",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cat.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Desktop Right Side */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
              {RIGHT_ITEMS.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex", alignItems: "center", gap: 0.6,
                    px: 1.5, py: 0.8, cursor: "pointer", borderRadius: "8px",
                    transition: "background 0.15s",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  <Box sx={{ color: "#555" }}>{item.icon}</Box>
                  <Box>
                    {item.subtitle && (
                      <Typography sx={{ fontSize: 10, color: GREEN, fontWeight: 600, lineHeight: 1, mb: 0.1 }}>
                        {item.subtitle}
                      </Typography>
                    )}
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#333", lineHeight: 1, whiteSpace: "nowrap" }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<PersonOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  ml: 1, borderRadius: "8px", borderColor: GREEN, color: GREEN,
                  fontWeight: 600, fontSize: 13, textTransform: "none",
                  px: 2, py: 0.8, whiteSpace: "nowrap",
                  "&:hover": { borderColor: "#15803d", bgcolor: "#f0fdf4" },
                }}
              >
                Login / Signup
              </Button>
            </Box>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <IconButton onClick={() => setDrawer(true)} sx={{ ml: "auto", color: "#333" }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawer(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Box sx={{ px: 2, pb: 1.5 }}>
            <Box component="img" src="/navbaricons/dealplexlogo.svg" alt="Dealplex"
              sx={{ height: 34, objectFit: "contain" }} />
          </Box>
          <Divider />

          {/* Mobile Categories — hotels pe hide */}
          {!hideCategories && (
            <List dense>
              {CATEGORIES.map((cat) => {
                const isActive = location.pathname === cat.path;
                return (
                  <ListItem key={cat.label} disablePadding>
                    <ListItemButton
                      onClick={() => { navigate(cat.path); setDrawer(false); }}
                      sx={{ gap: 1.5, bgcolor: isActive ? "#f0fdf4" : "transparent" }}
                    >
                      <Box
                        component="img" src={cat.img} alt={cat.label}
                        sx={{ width: 26, height: 26, objectFit: "contain" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <ListItemText
                        primary={cat.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? GREEN : "#333",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}

          <Divider />

          <List dense>
            {RIGHT_ITEMS.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton sx={{ gap: 1.5 }}>
                  <Box sx={{ color: "#555" }}>{item.icon}</Box>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: "#333" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          <Box sx={{ px: 2, py: 2 }}>
            <Button fullWidth variant="outlined" startIcon={<PersonOutlinedIcon />}
              sx={{
                borderRadius: "8px", borderColor: GREEN, color: GREEN,
                fontWeight: 600, textTransform: "none",
                "&:hover": { borderColor: "#15803d", bgcolor: "#f0fdf4" },
              }}
            >
              Login / Signup
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;