// src/components/flights/FlightPaymentPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusPaymentQRModal from "../buses/BusPaymentQRModal";
import { useFlightBook } from "../../hooks/flighthooks/useFlightBook";
import { useFlightPaymentInitiate } from "../../hooks/flighthooks/useFlightPaymentInitiate";
import { useFlightPaymentStatus } from "../../hooks/flighthooks/useFlightPaymentStatus";
import { useFlightTicket } from "../../hooks/flighthooks/useFlightTicket";
import Swal from "sweetalert2";
import { useFlightPaymentCancel } from "../../hooks/flighthooks/useFlightPaymentCancel";

const TITLE_MAP = {
  "Mr.": "Mr",
  Mr: "Mr",
  "Mrs.": "Ms",
  Mrs: "Ms",
  "Ms.": "Ms",
  Ms: "Ms",
  Miss: "Ms",
  Mstr: "Mr",
  Master: "Mr",
  "Dr.": "Dr",
  Dr: "Dr",
  DR: "Dr",
  "Prof.": "Mr",
  Prof: "Mr",
  PROF: "Mr",
  CHD: "Mr",
  MST: "Mr",
  Inf: "Mr",
};

const normalizeTitle = (title, fallback = "Mr") => {
  const mapped = TITLE_MAP[title];
  if (mapped) return mapped;
  const fb = TITLE_MAP[fallback] || fallback;
  return fb.slice(0, 2);
};
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
  const { initiatePayment, loading: initiateLoading } =
    useFlightPaymentInitiate();
  const { status, isPolling, startPolling, stopPolling } =
    useFlightPaymentStatus();
  const { generateTicket, loading: ticketLoading } = useFlightTicket();
  const { cancelPayment: cancelFlightPayment } = useFlightPaymentCancel();

  const handleFlightCancel = async () => {
    await cancelFlightPayment(traceId);
    stopPolling(); // ← polling band karo
    navigate("/flights", { replace: true }); // ← redirect
  };
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
      Title: normalizeTitle(trav.title, trav.gender === 2 ? "Ms" : "Mr"),
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
      ...(trav.passportNumber && trav.passportExpiry && {
        PassportNo: trav.passportNumber.trim(),
        PassportExpiry: trav.passportExpiry,
      }),
      ...(paxType === 1 && trav.panNumber?.trim() && {
        PanNo: trav.panNumber.trim(),
      }),
    };
  });

  // ✅ Yeh return function ke andar tha hi nahi pehle — isliye error tha
  return {
    TraceId: traceId,
    ResultIndex: resultIndex,
    ...(returnResultIndex && { ReturnResultIndex: returnResultIndex }),
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

    // ── Seat Dynamic ──────────────────────────────────────────
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

    // ── Meal Dynamic ──────────────────────────────────────────
    let mealDynamic = null;
    if (selectedMeals && Object.keys(selectedMeals).length > 0) {
      for (const [segKey, passMap] of Object.entries(selectedMeals)) {
        const meal = passMap[trav?.id];
        if (meal) {
          mealDynamic = {
            AirlineCode: meal.AirlineCode || "",
            FlightNumber: meal.FlightNumber || "",
            Origin: meal.Origin || "",
            Destination: meal.Destination || "",
            Code: meal.Code || "",
            Description: meal.AirlineDescription || meal.Description || "",
            AirlineDescription: meal.AirlineDescription || "",
            Currency: "INR",
            Price: meal.Price || 0,
            Quantity: 1,
          };
          break;
        }
      }
    }

    // ── Baggage Dynamic ───────────────────────────────────────
    let baggageDynamic = null;
    if (selectedBaggage && Object.keys(selectedBaggage).length > 0) {
      for (const [segKey, passMap] of Object.entries(selectedBaggage)) {
        const bag = passMap[trav?.id];
        if (bag) {
          baggageDynamic = {
            AirlineCode: bag.AirlineCode || "",
            FlightNumber: bag.FlightNumber || "",
            Origin: bag.Origin || "",
            Destination: bag.Destination || "",
            Code: bag.Code || "",
            Description: bag.Text || bag.Description || "",
            Currency: "INR",
            Price: bag.Price || 0,
            Weight: bag.Weight || 0,
            Quantity: 1,
          };
          break;
        }
      }
    }

    // ── Passport / PAN (conditional) ──────────────────────────
    const passportFields =
      trav.passportNumber && trav.passportExpiry
        ? {
            PassportNo: trav.passportNumber.trim(),
            PassportExpiry: trav.passportExpiry, // "YYYY-MM-DD"
          }
        : {};

    const panField =
      paxType === 1 && trav.panNumber && trav.panNumber.trim()
        ? { PanNo: trav.panNumber.trim() }
        : {};

    return {
      Title: normalizeTitle(trav.title, trav.gender === 2 ? "Ms" : "Mr"),
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
      ...(mealDynamic && { MealDynamic: mealDynamic }),
      ...(baggageDynamic && { BaggageDynamic: baggageDynamic }),
      // ✅ Passport & PAN — only included when present
      ...passportFields,
      ...panField,
    };
  });

  const payload = {
    TraceId: traceId,
    ResultIndex: resultIndex,
    ...(returnResultIndex && { ReturnResultIndex: returnResultIndex }),
    IsLCC: isLCC || false,
    Passengers: passengers,
  };

  console.log("=== TICKET PAYLOAD ===");
  payload.Passengers.forEach((p, i) => {
    console.log(
      `Passenger ${i}: Title="${p.Title}" | Name="${p.FirstName} ${p.lastName}" | PaxType=${p.PaxType} | PassportNo="${p.PassportNo || "—"}" | PanNo="${p.PanNo || "—"}"`,
    );
  });
  console.log("Full Payload:", JSON.stringify(payload, null, 2));

  return payload;
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

          try {
            const result = await bookFlight(payload);
            setBookingData(result);
          } catch (bookErr) {
            // Bus wale style mein Swal dikhao
            await Swal.fire({
              icon: "error",
              title: "Booking Failed",
              html: `
            <div style="font-size:14px;color:#374151;line-height:1.8;text-align:left">
              <div style="margin-bottom:6px">
                <span style="color:#6b7280;font-size:12px">Reason</span><br/>
                <strong>${bookErr.message || "Something went wrong. Please try again."}</strong>
              </div>
              ${
                bookErr.code
                  ? `
              <div>
                <span style="color:#6b7280;font-size:12px">Error Code</span><br/>
                <strong style="font-family:monospace">${bookErr.code}</strong>
              </div>`
                  : ""
              }
            </div>
          `,
              confirmButtonColor: "#16a34a",
              confirmButtonText: "Go Back",
              allowOutsideClick: false,
            }).then(() => {
              navigate(-1); // user ko back bhejo
            });
            return; // aage payment initiate nahi hoga
          }
        } else {
          console.log("LCC flight — skipping Book API");
        }

        await initiatePaymentStep();
      } catch (err) {
        console.error("Payment initiate error:", err);
        setFlowError(
          "We couldn't start your payment. Please go back and try again.",
        );
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
      setFlowError(
        "We couldn't restart your payment. Please go back and try again.",
      );
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
        <p
          style={{ fontSize: 16, fontWeight: 600, color: "#dc2626", margin: 0 }}
        >
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
        text={
          bookingLoading
            ? "Confirming your booking..."
            : "Preparing your payment..."
        }
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
      onCancelPayment={handleFlightCancel}
    />
  );
}
