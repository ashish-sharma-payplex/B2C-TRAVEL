// src/components/flights/FlightPaymentPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusPaymentQRModal from "../buses/BusPaymentQRModal";
import { useFlightBook } from "../../hooks/flighthooks/useFlightBook";
import { useFlightPaymentInitiate } from "../../hooks/flighthooks/useFlightPaymentInitiate";
import { useFlightPaymentStatus } from "../../hooks/flighthooks/useFlightPaymentStatus";
import { useFlightTicket } from "../../hooks/flighthooks/useFlightTicket";


const TITLE_MAP = {
  "Mr.": "Mr", "Mr": "Mr",
  "Mrs.": "Mrs", "Mrs": "Mrs",
  "Ms.": "Ms", "Ms": "Ms",
  "Miss": "Miss",
  "Mstr": "Mstr", "Master": "Master",
  "Dr.": "DR", "Dr": "DR", "DR": "DR",
  "Prof.": "PROF", "Prof": "PROF", "PROF": "PROF",
  "CHD": "CHD", "MST": "MST", "Inf": "Inf",
};
const normalizeTitle = (title, fallback) => TITLE_MAP[title] || fallback;

function ProcessingScreen({ text }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f4fa",
        fontFamily: "'Inter', sans-serif",
        gap: 16,
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2.5"
        style={{ animation: "spin 0.9s linear infinite" }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#374151", margin: 0 }}>
        {text}
      </p>
      <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
        Please do not refresh or go back
      </p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function FlightPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    flight,
    returnFlight,
    searchMeta,
    travellers,
    contact,
    billing,
    gst,
    seatSelections,
    selectedMeals,
    selectedBaggage,
    isLCC,
    traceId,
    resultIndex,
    returnResultIndex,
    fareQuote,
    returnFareQuote,
  } = location.state || {};

  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [flowError, setFlowError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  const { bookFlight, loading: bookingLoading } = useFlightBook();
  const { initiatePayment, loading: initiateLoading } = useFlightPaymentInitiate();
  const { status, isPolling, startPolling, stopPolling } = useFlightPaymentStatus();
  const { generateTicket, loading: ticketLoading } = useFlightTicket();

  // ── Build Fare object from fareQuote ──────────────────────────────────────
  const buildFareObject = (fareResult) => {
    const f = fareResult?.Results?.Fare;
    if (!f) return undefined;
    return {
      Currency: f.Currency || "INR",
      BaseFare: f.BaseFare || 0,
      Tax: f.Tax || 0,
      YQTax: f.YQTax || 0,
      AdditionalTxnFeeOfrd: f.AdditionalTxnFeeOfrd || 0,
      AdditionalTxnFeePub: f.AdditionalTxnFeePub || 0,
      PGCharge: f.PGCharge || 0,
      PublishedFare: f.PublishedFare || 0,
    };
  };

  // ── Build booking payload — ONLY ever called for non-LCC ────────────────
  const buildBookingPayload = () => {
    const adultCount = searchMeta?.passengers?.adults || 1;
    const childCount = searchMeta?.passengers?.children || 0;
    const infantCount = searchMeta?.passengers?.infants || 0;

    const fareObj = buildFareObject(fareQuote);

    const allTravellers = [
      ...(travellers?.adults || []),
      ...(travellers?.children || []),
      ...(travellers?.infants || []),
    ];

    const passengers = allTravellers.map((trav, idx) => {
      const paxType =
        idx < adultCount ? 1 : idx < adultCount + childCount ? 2 : 3;

      return {
        Title: normalizeTitle(trav.title, idx < adultCount ? "Mr" : "Mstr"),
        FirstName: trav.firstName,
        LastName: trav.lastName,
        PaxType: paxType,
        Gender: trav.gender || 1,
        AddressLine1: billing?.address || "N/A",
        City: billing?.city || "N/A",
        CountryCode: "IN",
        CountryName: "India",
        ContactNo: contact?.mobile || "",
        Email: contact?.email || "",
        IsLeadPax: idx === 0,
        Nationality: "Indian",
        ...(trav.dob && { DateOfBirth: trav.dob }),
        ...(fareObj && { Fare: fareObj }),
      };
    });

    return {
      TraceId: traceId,
      ResultIndex: resultIndex,
      IsLCC: false,
      Origin: searchMeta?.fromCity?.code,
      Destination: searchMeta?.toCity?.code,
      Passengers: passengers,
    };
  };

  // ── Build ticket payload — used by BOTH LCC and non-LCC ────────────────
  // NOTE: IsLCC is included here as a hint to the backend in case the
  // ticket endpoint needs to do a combined book+ticket for LCC (since no
  // separate Book call happens in that case). Verify the exact field name
  // your ticket API expects.
  const buildTicketPayload = () => {
    const adultCount = searchMeta?.passengers?.adults || 1;
    const childCount = searchMeta?.passengers?.children || 0;
    const fareObj = buildFareObject(fareQuote);

    const allTravellers = [
      ...(travellers?.adults || []),
      ...(travellers?.children || []),
      ...(travellers?.infants || []),
    ];

    const passengers = allTravellers.map((trav, idx) => {
      const paxType =
        idx < adultCount ? 1 : idx < adultCount + childCount ? 2 : 3;

      const seatDynamic = [];
      if (seatSelections && Object.keys(seatSelections).length > 0) {
        Object.entries(seatSelections).forEach(([segKey, passMap]) => {
          const seatCode = passMap[trav?.id];
          if (seatCode) {
            seatDynamic.push({
              AirlineCode: "",
              FlightNumber: "",
              CraftType: "",
              Origin: "",
              Destination: "",
              AvailablityType: 1,
              Description: "",
              Code: seatCode,
              RowNo: seatCode.slice(0, -1),
              SeatNo: seatCode.slice(-1),
              SeatType: 0,
              SeatWayType: 0,
              Compartment: 0,
              Deck: 0,
              Currency: "INR",
              Price: 0,
            });
          }
        });
      }

      return {
        Title: normalizeTitle(trav.title, idx < adultCount ? "Mr" : "Mstr"),
        FirstName: trav.firstName,
        LastName: trav.lastName,
        PaxType: paxType,
        Gender: trav.gender || 1,
        AddressLine1: billing?.address || "N/A",
        City: billing?.city || "N/A",
        CountryCode: "IN",
        CountryName: "India",
        ContactNo: contact?.mobile || "",
        Email: contact?.email || "",
        IsLeadPax: idx === 0,
        Nationality: "Indian",
        ...(trav.dob && { DateOfBirth: trav.dob }),
        ...(fareObj && { Fare: fareObj }),
        ...(seatDynamic.length > 0 && { SeatDynamic: seatDynamic }),
      };
    });

    return {
      TraceId: traceId,
      ResultIndex: resultIndex,
      IsLCC: isLCC || false,
      Passengers: passengers,
    };
  };

  // ── Step: Initiate payment (QR) — shared by both LCC & non-LCC ────────────
  const initiatePaymentStep = async () => {
    const result = await initiatePayment(traceId);
    setPaymentData(result);
    setShowPaymentModal(true);
    startPolling(traceId);
  };

  // ── Step: Generate ticket + redirect — shared by both LCC & non-LCC ───────
  const handlePaymentSuccess = async () => {
    try {
      const ticketPayload = buildTicketPayload();
      const ticketResult = await generateTicket(ticketPayload);

      navigate("/flight-ticket", {
        state: {
          ticket: ticketResult,
          bookingData, // null for LCC — FlightTicketPage falls back to `ticket`
          paymentData,
          searchMeta,
          travellers,
          seatSelections,
        },
        replace: true,
      });
    } catch (err) {
      console.error("Ticket generation error:", err);
      setFlowError(
        "We couldn't generate your ticket. Please contact support with your payment reference.",
      );
    }
  };

  // ── Main flow ────────────────────────────────────────────────────────────
  // Non-LCC : Book  → Initiate → Poll → Ticket → redirect
  // LCC     :         Initiate → Poll → Ticket → redirect   (Book skipped)
  useEffect(() => {
    if (hasStarted) return;
    if (!traceId || !resultIndex || !travellers || !contact || !billing) return;

    setHasStarted(true);

   const startFlow = async () => {
  try {
    if (!isLCC) {
      const payload = buildBookingPayload();
      console.log("Booking payload:", JSON.stringify(payload, null, 2));

      let result;
      try {
        result = await bookFlight(payload);
      } catch (bookErr) {
        // Book API fail — error dikhao, aage mat jao
        setFlowError(bookErr.message || "Booking failed. Please try again.");
        return; // ← yahi key line hai — payment initiate nahi hoga
      }

      setBookingData(result);
    } else {
      console.log("LCC flight — skipping Book API");
    }

    // Sirf tab aao yahan agar book success hua (ya LCC hai)
    await initiatePaymentStep();

  } catch (err) {
    console.error("Payment initiate error:", err);
    setFlowError("We couldn't start your payment. Please go back and try again.");
  }
};

    startFlow();
  }, [traceId, resultIndex, travellers, contact, billing]);

  // ── Monitor payment status — shared by both flows ─────────────────────────
  useEffect(() => {
    if (!status?.status) return;
    setPaymentStatus(status.status);

    if (status.status === "SUCCESS") {
      stopPolling();
      handlePaymentSuccess();
    } else if (status.status === "FAILED") {
      stopPolling();
      setTimeout(() => {
        navigate("/flights", { replace: true });
      }, 15000);
    } else if (status.status === "EXPIRED") {
      stopPolling();
    }
  }, [status]);

  // ── Handle retry payment (used by both flows) ──────────────────────────────
  const handleRetry = async () => {
    try {
      await initiatePaymentStep();
    } catch (err) {
      console.error("Retry initiate error:", err);
      setFlowError("We couldn't restart your payment. Please go back and try again.");
    }
  };

  // ── Hard error fallback ─────────────────────────────────────────────────
  if (flowError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f4fa",
          fontFamily: "'Inter', sans-serif",
          gap: 12,
          padding: 24,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 600, color: "#dc2626", margin: 0 }}>
          {flowError}
        </p>
        <button
          onClick={() => navigate("/flights", { replace: true })}
          style={{
            marginTop: 8,
            padding: "10px 20px",
            borderRadius: 8,
            background: "#16a34a",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Back to Flights
        </button>
      </div>
    );
  }

  // ── Before QR is ready: booking (non-LCC only) and/or payment initiation ──
  if (!showPaymentModal && (bookingLoading || initiateLoading)) {
    return (
      <ProcessingScreen
        text={bookingLoading ? "Confirming your booking..." : "Preparing your payment..."}
      />
    );
  }

  // ── After payment success, while ticket is being generated ────────────────
  if (paymentStatus === "SUCCESS" || ticketLoading) {
    return <ProcessingScreen text="Generating your ticket..." />;
  }

  return (
    <BusPaymentQRModal
      visible={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      paymentData={paymentData}
      onRetry={handleRetry}
      onSuccess={handlePaymentSuccess}
      paymentStatus={paymentStatus}
      traceId={traceId}
      resultIndex={resultIndex}
    />
  );
}