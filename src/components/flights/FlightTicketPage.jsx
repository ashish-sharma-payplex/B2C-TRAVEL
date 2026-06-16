// src/components/flights/FlightTicketPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import { 
  FileDownload as Download, 
  Share as Share2, 
  Home 
} from "@mui/icons-material";

export default function FlightTicketPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { ticket, bookingData, searchMeta } = location.state || {};

  // For LCC flights there's no separate Book step, so `bookingData` will be
  // null. Fall back to fields on the ticket response itself — verify the
  // exact field names your ticket API returns for LCC (BookingId/PNR/Status
  // may live directly on `ticket` instead of a separate booking object).
  const info = bookingData || ticket || null;

  if (!ticket || !info) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f4f8",
        }}
      >
        <Typography>Ticket data not found. Redirecting...</Typography>
      </Box>
    );
  }

  const handleDownloadTicket = () => {
    console.log("Download ticket");
  };

  const handleShareTicket = () => {
    console.log("Share ticket");
  };

  return (
    <Box sx={{ background: "#f0f4f8", minHeight: "100vh", padding: "24px 0" }}>
      <Box
        sx={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {/* Success Header */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            padding: 3,
            marginBottom: 2,
            textAlign: "center",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
          }}
        >
          <Box sx={{ fontSize: 40, marginBottom: 1 }}>✓</Box>
          <Typography
            sx={{ fontSize: 24, fontWeight: 700, color: "#16a34a", mb: 0.5 }}
          >
            Booking Confirmed!
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
            Your flight has been successfully booked
          </Typography>
        </Paper>

        {/* PNR and Booking ID */}
        <Paper elevation={0} sx={{ borderRadius: 3, padding: 2.5, mb: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5 }}>
                Booking ID
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  fontFamily: "monospace",
                }}
              >
                {info.BookingId || "—"}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5 }}>
                PNR Number
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#16a34a",
                  fontFamily: "monospace",
                }}
              >
                {info.PNR || "—"}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Flight Details */}
        <Paper elevation={0} sx={{ borderRadius: 3, padding: 2.5, mb: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2 }}>
            Flight Details
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5 }}>
                From
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                {searchMeta?.fromCity?.code}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                {searchMeta?.fromCity?.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ width: 40, height: 1, background: "#d1d5db" }} />
              <Typography sx={{ fontSize: 10, color: "#9ca3af" }}>
                {searchMeta?.tripType === "roundtrip" ? "Round Trip" : "One Way"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5 }}>
                To
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                {searchMeta?.toCity?.code}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                {searchMeta?.toCity?.name}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Ticket Information */}
        <Paper elevation={0} sx={{ borderRadius: 3, padding: 2.5, mb: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2 }}>
            Ticket Information
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: 1,
                background: "#f9fafb",
                borderRadius: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                Booking Reference
              </Typography>
              <Typography
                sx={{ fontSize: 12, fontWeight: 700, color: "#111827" }}
              >
                {info.BookingId || "—"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: 1,
                background: "#f9fafb",
                borderRadius: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                Status
              </Typography>
              <Typography
                sx={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}
              >
                {info.Status === 1 ? "Confirmed" : info.Status || "Confirmed"}
              </Typography>
            </Box>
            {ticket?.TicketNumber && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 1,
                  background: "#f9fafb",
                  borderRadius: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                  Ticket Number
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#111827",
                    fontFamily: "monospace",
                  }}
                >
                  {ticket.TicketNumber}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleDownloadTicket}
            startIcon={<Download sx={{ fontSize: 18 }} />}
            sx={{
              background: "#16a34a",
              "&:hover": { background: "#15803d" },
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Download Ticket
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleShareTicket}
            startIcon={<Share2 sx={{ fontSize: 18 }} />}
            sx={{
              borderColor: "#16a34a",
              color: "#16a34a",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              "&:hover": {
                background: "#f0fdf4",
              },
            }}
          >
            Share
          </Button>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/flights", { replace: true })}
          startIcon={<Home sx={{ fontSize: 18 }} />}
          sx={{
            borderColor: "#e5e7eb",
            color: "#374151",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
            "&:hover": {
              background: "#f9fafb",
            },
          }}
        >
          Back to Flights
        </Button>

        {/* Confirmation Message */}
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            background: "#fef3c7",
            border: "1px solid #fde68a",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            A confirmation email has been sent to your registered email address.
            Please check your inbox for ticket details and updates.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}