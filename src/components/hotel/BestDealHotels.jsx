import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const GREEN = "#16a34a";
const BORDER = "#e5e7eb";
const GAP = 20;

const hotels = [
  {
    id: 1,
    image: "/images/jw-marriott.jpg",
    rating: 4.96,
    reviews: 672,
    stars: 5,
    type: "Hotel",
    name: "JW Marriott Mumbai Hotel",
    location: "Mumbai, Maharashtra",
    price: "₹14,000",
  },
  {
    id: 2,
    image: "/images/leela-palace.jpg",
    rating: 4.96,
    reviews: 512,
    stars: 5,
    type: "Hotel",
    name: "Leela Palace",
    location: "Mumbai, Maharashtra",
    price: "₹17,400",
  },
  {
    id: 3,
    image: "/images/california-sunset.jpg",
    rating: 4.96,
    reviews: 672,
    stars: 4,
    type: "Hotel",
    name: "California Sunset/Twilight Boat Cruise",
    location: "Mumbai, Maharashtra",
    price: "₹27,000",
  },
  {
    id: 4,
    image: "/images/taj-hotel.jpg",
    rating: 4.89,
    reviews: 843,
    stars: 5,
    type: "Heritage Hotel",
    name: "Taj Mahal Palace Mumbai",
    location: "Colaba, Mumbai",
    price: "₹32,500",
  },
  {
    id: 5,
    image: "/images/four-seasons.jpg",
    rating: 4.91,
    reviews: 398,
    stars: 5,
    type: "Hotel",
    name: "Four Seasons Hotel Mumbai",
    location: "Worli, Mumbai",
    price: "₹22,800",
  },
];

function HotelCard({ hotel }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 10px 30px rgba(0,0,0,0.13)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.22s, box-shadow 0.22s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: "relative",
          height: 210,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <CardMedia
          component="img"
          image={hotel.image}
          alt={hotel.name}
          sx={{
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.32s",
          }}
        />
        {/* Heart */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#fff",
            width: 34,
            height: 34,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            "&:hover": { background: "#fff", transform: "scale(1.12)" },
            transition: "transform 0.2s",
          }}
        >
          {liked ? (
            <FavoriteIcon sx={{ fontSize: 17, color: "#ef4444" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 17, color: "#9ca3af" }} />
          )}
        </IconButton>

        {/* Rating badge */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: "#fff",
            borderRadius: "20px",
            px: 1.2,
            py: 0.6,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <StarIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
          <Typography
            sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}
          >
            {hotel.rating}
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
            ({hotel.reviews} reviews)
          </Typography>
        </Box>
      </Box>

      {/* Body */}
      <CardContent
        sx={{
          p: "14px 16px 16px !important",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          alignItems: "flex-start",
        }}
      >
        {/* Stars + type */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 0.7 }}>
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <StarIcon key={i} sx={{ fontSize: 11, color: "#f59e0b" }} />
          ))}
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#d1d5db",
              mx: 0.3,
            }}
          />
          <Typography
            sx={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}
          >
            {hotel.type}
          </Typography>
        </Box>

        {/* Name */}
        <Typography
          sx={{
            fontSize: "0.97rem",
            fontWeight: 700,
            color: "#111827",
            mb: 0.6,
            lineHeight: 1.3,
          }}
        >
          {hotel.name}
        </Typography>

        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
          <LocationOnIcon sx={{ fontSize: 13, color: "#9ca3af" }} />
          <Typography sx={{ fontSize: "0.78rem", color: "#6b7280" }}>
            {hotel.location}
          </Typography>
        </Box>

        {/* Price + Book */}
        {/* Price + Book */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end", // ← center tha, ab flex-end
            justifyContent: "space-between",
            mt: "auto",
            width: "100%", // ← yeh add karo
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: "0.67rem", color: "#9ca3af", mb: "1px" }}
            >
              per night
            </Typography>
            <Typography
              sx={{ fontSize: "1.18rem", fontWeight: 800, color: GREEN }}
            >
              {hotel.price}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#111827",
              borderColor: BORDER,
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
              py: 0.9,
              mb: "2px", // ← price ke baseline se thoda upar
              "&:hover": {
                background: "#111827",
                color: "#fff",
                borderColor: "#111827",
              },
              transition: "all 0.2s",
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function BestDealsHotel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const visibleCount = isMobile ? 1 : isTablet ? 2 : 3;

  const [current, setCurrent] = useState(0);
  const maxSlide = hotels.length - visibleCount;

  const goTo = (index) => setCurrent(Math.max(0, Math.min(index, maxSlide)));

  const cardWidthPct = `calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})`;

  return (
    <Box
      sx={{
        p: { xs: "20px 16px", md: "32px 24px" },
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1.5, sm: 0 },
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "1.35rem", md: "1.6rem" },
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Best deals Hotel 🔥
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", mt: 0.5 }}>
            Quality as judged by customers. Book at the ideal price!
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignSelf: { xs: "flex-end", sm: "auto" },
          }}
        >
          {[
            { Icon: ChevronLeftIcon, dir: -1 },
            { Icon: ChevronRightIcon, dir: 1 },
          ].map(({ Icon, dir }) => (
            <IconButton
              key={dir}
              disabled={dir === -1 ? current === 0 : current >= maxSlide}
              onClick={() => goTo(current + dir)}
              sx={{
                width: 38,
                height: 38,
                border: `1.5px solid ${BORDER}`,
                background: "#fff",
                borderRadius: "50%",
                "&:hover": { background: "#f3f4f6", borderColor: "#9ca3af" },
                "&:disabled": { opacity: 0.4 },
              }}
            >
              <Icon sx={{ fontSize: 18, color: "#374151" }} />
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Slider */}
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            gap: `${GAP}px`,
            transform: `translateX(calc(-${current} * (${cardWidthPct} + ${GAP}px)))`,
            transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
            alignItems: "stretch",
          }}
        >
          {hotels.map((hotel) => (
            <Box
              key={hotel.id}
              sx={{ flex: `0 0 ${cardWidthPct}`, minWidth: 0 }}
            >
              <HotelCard hotel={hotel} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Dots */}
      <Box
        sx={{ display: "flex", justifyContent: "center", gap: 0.8, mt: 2.5 }}
      >
        {Array.from({ length: maxSlide + 1 }).map((_, i) => (
          <Box
            key={i}
            onClick={() => goTo(i)}
            sx={{
              height: 8,
              width: i === current ? 22 : 8,
              borderRadius: i === current ? "4px" : "50%",
              background: i === current ? GREEN : "#d1d5db",
              cursor: "pointer",
              transition: "all 0.25s",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
