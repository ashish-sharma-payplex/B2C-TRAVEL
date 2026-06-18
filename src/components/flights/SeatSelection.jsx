// src/components/flights/SeatSelectionPage.jsx
import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSSR } from "../../hooks/flighthooks/useSSR";

/* ─────────────────────────────────────────────────────────────────────────────
   TINY ICON COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
const IconSeat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 20v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4"/><circle cx="12" cy="7" r="3"/>
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconFlight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
const isAvailable = (seat) => seat.AvailablityType === 1;
const isExitRow = (seat) => [4, 6, 10, 12, 16, 18].includes(seat.SeatType);

function groupByRow(seats) {
  const map = {};
  for (const s of seats) {
    if (s.Code === "NoSeat") continue;
    const r = s.RowNo;
    if (!map[r]) map[r] = [];
    map[r].push(s);
  }
  return map;
}

function flattenSeatRows(seatRows) {
  return seatRows.flatMap((r) => r.Seats || []);
}

const COL_ORDER = ["A", "B", "C", "D", "E", "F"];

/* ─────────────────────────────────────────────────────────────────────────────
   SEAT COLOUR LOGIC
───────────────────────────────────────────────────────────────────────────── */
function seatStyle(seat, state) {
  if (state === "blocked") return { bg: "#E2E6EA", border: "#C8CDD4", text: "#9AA3AE", cursor: "not-allowed" };
  if (state === "selected") return { bg: "#16a34a", border: "#15803d", text: "#fff", cursor: "pointer" };
  if (state === "other") return { bg: "#DBEAFE", border: "#93C5FD", text: "#2563EB", cursor: "not-allowed" };

  const p = seat.Price;
  if (p === 0) return { bg: "#F8FAFC", border: "#CBD5E0", text: "#64748B", cursor: "pointer" };
  if (isExitRow(seat)) return { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E", cursor: "pointer" };
  if (p >= 1500) return { bg: "#F3E8FF", border: "#C084FC", text: "#7E22CE", cursor: "pointer" };
  if (p >= 800) return { bg: "#DBEAFE", border: "#60A5FA", text: "#1E40AF", cursor: "pointer" };
  if (p >= 400) return { bg: "#DCFCE7", border: "#4ADE80", text: "#166534", cursor: "pointer" };
  return { bg: "#F8FAFC", border: "#CBD5E0", text: "#64748B", cursor: "pointer" };
}

/* ─────────────────────────────────────────────────────────────────────────────
   SINGLE SEAT CELL
───────────────────────────────────────────────────────────────────────────── */
function SeatCell({ seat, state, onSelect }) {
  const [hov, setHov] = useState(false);
  const s = seatStyle(seat, state);
  const isBlocked = state === "blocked" || state === "other";
  const isSelected = state === "selected";

  const bg = hov && !isBlocked ? (isSelected ? "#15803d" : "#bbf7d0") : s.bg;

  return (
    <div
      title={isBlocked
        ? (seat.AvailablityType === 3 ? "Occupied" : state === "other" ? "Selected by another passenger" : "Unavailable")
        : `${seat.Code}${seat.Price > 0 ? ` · ₹${seat.Price}` : " · Free"}${isExitRow(seat) ? " · Exit Row" : ""}`}
      onClick={() => !isBlocked && onSelect(seat)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 28,
        borderRadius: "5px 5px 2px 2px",
        border: `1.5px solid ${s.border}`,
        background: bg,
        cursor: s.cursor,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.12s",
        transform: isSelected ? "scale(1.12)" : "scale(1)",
        flexShrink: 0,
        position: "relative",
        boxShadow: isSelected ? "0 2px 8px rgba(22,163,74,0.35)" : "none",
      }}
    >
      {isBlocked && !isSelected ? (
        <div style={{ width: 12, height: 12, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: "100%", height: "1.5px", background: "#9AA3AE", transform: "rotate(45deg)", borderRadius: 1 }}/>
          <div style={{ position: "absolute", width: "100%", height: "1.5px", background: "#9AA3AE", transform: "rotate(-45deg)", borderRadius: 1 }}/>
        </div>
      ) : isSelected ? (
        <div style={{ color: "#fff" }}><IconCheck /></div>
      ) : (
        <span style={{ fontSize: "0.52rem", fontWeight: 700, color: s.text, lineHeight: 1, letterSpacing: "-0.2px" }}>
          {isExitRow(seat) ? "EXIT" : seat.Price === 0 ? "FREE" : ""}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CABIN MAP
───────────────────────────────────────────────────────────────────────────── */
function CabinMap({ seatRows, selections, activePassengerId, allPassengerIds, onSelect }) {
  const selectedByActive = selections[activePassengerId];
  const allSelected = new Set(Object.values(selections));

  const sortedRowNos = Object.keys(seatRows).map(Number).sort((a, b) => a - b);

  const exitRowSet = useMemo(() => {
    const s = new Set();
    for (const [rNo, seats] of Object.entries(seatRows)) {
      if (seats.some(isExitRow)) s.add(Number(rNo));
    }
    return s;
  }, [seatRows]);

  const SW = 30, GAP = 4, AISLE = 22;
  const LEFT_COLS = ["A", "B", "C"], RIGHT_COLS = ["D", "E", "F"];
  const SIDE_W = SW * 3 + GAP * 2;
  const TOTAL_W = SIDE_W * 2 + AISLE + 28;
  const PLANE_W = TOTAL_W + 32;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}>
      <img src="/aerofront.png" alt="Aircraft front" style={{ display: "block", width: PLANE_W, height: "auto", marginBottom: -2, objectFit: "contain" }} />

      <div style={{
        border: "1.5px solid #CBD5E0", borderTop: "none", borderBottom: "none",
        borderRadius: 0, background: "linear-gradient(to bottom, #F8FAFC, #F1F5F9)",
        padding: "8px 16px 28px", width: PLANE_W, boxSizing: "border-box", position: "relative",
      }}>
        {["left", "right"].map((side) => (
          <div key={side} style={{
            position: "absolute", [side === "left" ? "left" : "right"]: -16,
            top: "35%", width: 16, height: 56,
            background: `linear-gradient(to ${side === "left" ? "right" : "left"}, transparent, #CBD5E0)`,
            borderRadius: side === "left" ? "8px 0 0 8px" : "0 8px 8px 0",
          }}/>
        ))}

        <div style={{ display: "flex", alignItems: "center", marginBottom: 6, paddingLeft: 14 }}>
          {LEFT_COLS.map((c, i) => (
            <div key={c} style={{ width: SW, marginRight: i < 2 ? GAP : 0, textAlign: "center" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#94A3B8", letterSpacing: 1 }}>{c}</span>
            </div>
          ))}
          <div style={{ width: AISLE + 28 }}/>
          {RIGHT_COLS.map((c, i) => (
            <div key={c} style={{ width: SW, marginLeft: i > 0 ? GAP : 0, textAlign: "center" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#94A3B8", letterSpacing: 1 }}>{c}</span>
            </div>
          ))}
        </div>

        <div style={{ maxHeight: 420, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#CBD5E0 transparent" }}>
          {sortedRowNos.map((rowNo) => {
            const rowSeats = seatRows[rowNo];
            const isExit = exitRowSet.has(rowNo);
            const byCol = {};
            for (const s of rowSeats) byCol[s.SeatNo] = s;
            const prevRowNo = sortedRowNos[sortedRowNos.indexOf(rowNo) - 1];
            const showExitMarker = isExit && (!prevRowNo || !exitRowSet.has(prevRowNo));

            return (
              <div key={rowNo}>
                {showExitMarker && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "6px 0 4px", padding: "0 2px" }}>
                    <div style={{ flex: 1, height: 1, background: "#FCD34D" }}/>
                    <span style={{ fontSize: "0.48rem", fontWeight: 900, color: "#D97706", letterSpacing: 1.5 }}>EXIT ROW</span>
                    <div style={{ flex: 1, height: 1, background: "#FCD34D" }}/>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", marginBottom: GAP }}>
                  {LEFT_COLS.map((col, ci) => {
                    const seat = byCol[col];
                    if (!seat) return <div key={col} style={{ width: SW, marginRight: ci < 2 ? GAP : 0 }}/>;
                    const seatCode = seat.Code;
                    const isThisSelected = selectedByActive === seatCode;
                    const isOtherSelected = !isThisSelected && allSelected.has(seatCode);
                    const blocked = !isAvailable(seat);
                    const state = blocked ? "blocked" : isThisSelected ? "selected" : isOtherSelected ? "other" : "available";
                    return (
                      <div key={col} style={{ marginRight: ci < 2 ? GAP : 0 }}>
                        <SeatCell seat={seat} state={state} onSelect={(s) => onSelect(s.Code)} />
                      </div>
                    );
                  })}

                  <div style={{ width: AISLE + 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.55rem", color: "#94A3B8", fontWeight: 700 }}>{rowNo}</span>
                  </div>

                  {RIGHT_COLS.map((col, ci) => {
                    const seat = byCol[col];
                    if (!seat) return <div key={col} style={{ width: SW, marginLeft: ci > 0 ? GAP : 0 }}/>;
                    const seatCode = seat.Code;
                    const isThisSelected = selectedByActive === seatCode;
                    const isOtherSelected = !isThisSelected && allSelected.has(seatCode);
                    const blocked = !isAvailable(seat);
                    const state = blocked ? "blocked" : isThisSelected ? "selected" : isOtherSelected ? "other" : "available";
                    return (
                      <div key={col} style={{ marginLeft: ci > 0 ? GAP : 0 }}>
                        <SeatCell seat={seat} state={state} onSelect={(s) => onSelect(s.Code)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <img src="/aeroback.png" alt="Aircraft back" style={{ display: "block", width: PLANE_W, height: "auto", marginTop: -2, objectFit: "contain" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEGEND
───────────────────────────────────────────────────────────────────────────── */
const LEGEND = [
  { bg: "#DCFCE7", border: "#4ADE80", label: "₹300–799" },
  { bg: "#DBEAFE", border: "#60A5FA", label: "₹800–1499" },
  { bg: "#F3E8FF", border: "#C084FC", label: "₹1500+" },
  { bg: "#FEF3C7", border: "#F59E0B", label: "Exit Row" },
  { bg: "#F8FAFC", border: "#CBD5E0", label: "Free" },
  { bg: "#16a34a", border: "#15803d", label: "Selected", textColor: "#fff" },
  { bg: "#E2E6EA", border: "#C8CDD4", label: "Occupied" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function SeatSelectionPage() {
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
    fareQuote,
    returnFareQuote,
    traceId,
    resultIndex,
    returnResultIndex,
    selectedMeals,
    selectedBaggage,
    isLCC,
  } = location.state || {};

  const isRoundTrip = !!returnFlight;

  const { onwardSSR, returnSSR, loading, error, fetchSSR } = useSSR();

  useEffect(() => {
    if (traceId && resultIndex) {
      fetchSSR({
        traceId,
        onwardResultIndex: resultIndex,
        returnResultIndex: returnResultIndex || returnFlight?.ResultIndex || null,
      });
    }
  }, []);

  /* ── Passengers ── */
  const allPassengers = useMemo(() => {
    const list = [];
    (travellers?.adults || []).forEach((t, i) => list.push({ ...t, ptype: "Adult", idx: i }));
    (travellers?.children || []).forEach((t, i) => list.push({ ...t, ptype: "Child", idx: i }));
    return list;
  }, [travellers]);

  const [activePassIdx, setActivePassIdx] = useState(0);
  const activePass = allPassengers[activePassIdx];

  /* ── Segments ── */
  const segments = useMemo(() => {
    const onward = (onwardSSR?.SeatsBySegment || [])
      .filter(s => s.seat_rows?.some(r => r.Seats?.some(seat => seat.Code !== "NoSeat")))
      .map(s => ({
        ...s, leg: "onward",
        key: `onward-${s.segment_key}`,
        label: `${s.origin} → ${s.destination}`,
        flightNo: s.flight_number,
      }));
    const ret = isRoundTrip
      ? (returnSSR?.SeatsBySegment || [])
          .filter(s => s.seat_rows?.some(r => r.Seats?.some(seat => seat.Code !== "NoSeat")))
          .map(s => ({
            ...s, leg: "return",
            key: `return-${s.segment_key}`,
            label: `${s.origin} → ${s.destination}`,
            flightNo: s.flight_number,
          }))
      : [];
    return [...onward, ...ret];
  }, [onwardSSR, returnSSR, isRoundTrip]);

  const [activeSegIdx, setActiveSegIdx] = useState(0);
  const activeSeg = segments[activeSegIdx];

  /* ── Seat Rows for active segment ── */
  const seatRowsMap = useMemo(() => {
    if (!activeSeg) return {};
    const flat = flattenSeatRows(activeSeg.seat_rows || []);
    return groupByRow(flat);
  }, [activeSeg]);

  /* ── Selections ── */
  const [selections, setSelections] = useState({});
  const activeSegSelections = selections[activeSeg?.key] || {};
  const activePassSeatCode = activeSegSelections[activePass?.id] || null;

  function seatPrice(segKey, seatCode) {
    const seg = segments.find(s => s.key === segKey);
    if (!seg) return 0;
    const flat = flattenSeatRows(seg.seat_rows || []);
    const s = flat.find(s => s.Code === seatCode);
    return s?.Price || 0;
  }

  const handleSeatSelect = (seatCode) => {
    if (!activeSeg || !activePass) return;
    const segKey = activeSeg.key;
    setSelections(prev => {
      const segData = { ...(prev[segKey] || {}) };
      if (segData[activePass.id] === seatCode) {
        delete segData[activePass.id];
      } else {
        const takenBy = Object.entries(segData).find(([pid, sc]) => sc === seatCode && pid !== activePass.id);
        if (takenBy) return prev;
        segData[activePass.id] = seatCode;
        if (activePassIdx < allPassengers.length - 1) {
          setTimeout(() => setActivePassIdx(i => i + 1), 350);
        }
      }
      return { ...prev, [segKey]: segData };
    });
  };

  /* ── Fare calculation ── */
  const extraMealTotal = useMemo(() => {
    let t = 0;
    Object.values(selectedMeals || {}).forEach(m => Object.values(m).forEach(meal => { t += meal.Price || 0; }));
    return t;
  }, [selectedMeals]);

  const extraBagTotal = useMemo(() => {
    let t = 0;
    Object.values(selectedBaggage || {}).forEach(m => Object.values(m).forEach(b => { t += b.Price || 0; }));
    return t;
  }, [selectedBaggage]);

  const seatTotal = useMemo(() => {
    let t = 0;
    Object.entries(selections).forEach(([segKey, passMap]) => {
      Object.entries(passMap).forEach(([, sc]) => { t += seatPrice(segKey, sc); });
    });
    return t;
  }, [selections, segments]);

  const adultCount = searchMeta?.passengers?.adults ?? (travellers?.adults?.length ?? 1);
  const childCount = searchMeta?.passengers?.children ?? (travellers?.children?.length ?? 0);
  const infantCount = searchMeta?.passengers?.infants ?? (travellers?.infants?.length ?? 0);
  const totalPax = adultCount + childCount + infantCount;

  const onwardPublished = fareQuote?.Results?.Fare?.PublishedFare ?? flight?.Fare?.PublishedFare ?? 0;
  const returnPublished = returnFareQuote?.Results?.Fare?.PublishedFare ?? returnFlight?.Fare?.PublishedFare ?? 0;
  const onwardTax = fareQuote?.Results?.Fare?.Tax ?? flight?.Fare?.Tax ?? 0;
  const returnTax = returnFareQuote?.Results?.Fare?.Tax ?? returnFlight?.Fare?.Tax ?? 0;

  const onwardFare = onwardPublished * totalPax;
  const returnFare = returnPublished * totalPax;
  const onwardTaxTotal = onwardTax * totalPax;
  const returnTaxTotal = returnTax * totalPax;
  const grandTotal = onwardFare + returnFare + onwardTaxTotal + returnTaxTotal + extraMealTotal + extraBagTotal + seatTotal;

  const totalSeatsSelected = Object.values(selections).reduce((acc, seg) => acc + Object.keys(seg).length, 0);
  const maxSeats = segments.length * allPassengers.length;
  const progress = maxSeats > 0 ? (totalSeatsSelected / maxSeats) * 100 : 0;

  // ── handleContinue — IsLCC ke hisab se navigate karo ─────────────────────
  const handleContinue = () => {
  const flightIsLCC = isLCC ?? location.state?.flight?.IsLCC ?? false;

  const nextState = {
    ...location.state,
    seatSelections: flightIsLCC ? {} : selections,
    isLCC: flightIsLCC,
    skipBooking: false, // normal flow
  };

  navigate("/flight-payment", { state: nextState });
};

  /* ── Loading / Error ── */
  if (loading) return (
    <div style={styles.center}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"
        style={{ animation: "spin 0.9s linear infinite" }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      <p style={{ marginTop: 14, color: "#64748B", fontSize: 14 }}>Loading seat map…</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Agar seat data nahi hai — skip option do ──────────────────────────────
  if (error || segments.length === 0) return (
  <div style={styles.center}>
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "32px 40px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      textAlign: "center",
      maxWidth: 400,
    }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>💺</div>
      <p style={{ color: "#374151", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
        Seat map not available
      </p>
      <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24 }}>
        Seat selection is not available for this flight. You can proceed to payment.
      </p>
      <button
        style={styles.continueBtn}
        onClick={() => {
          const flightIsLCC = isLCC ?? location.state?.flight?.IsLCC ?? false;
          navigate("/flight-payment", {
            state: {
              ...location.state,
              seatSelections: {},
              isLCC: flightIsLCC,
              skipBooking: false, // normal flow — payment page apna kaam karega
            },
          });
        }}
      >
        Continue to Payment
      </button>

      {/* ← Yahi naya button hai — seedha flights pe */}
      <button
        style={{
          ...styles.continueBtn,
          marginTop: 10,
          background: "none",
          color: "#6b7280",
          border: "1.5px solid #e5e7eb",
          boxShadow: "none",
        }}
        onClick={() => navigate("/flights", { replace: true })}
      >
        Back to Home
      </button>
    </div>
  </div>
);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#F1F5F9", minHeight: "100vh", padding: "24px 0 80px" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        .ss-grid{display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start;max-width:1200px;margin:0 auto;padding:0 16px;}
        .ss-grid>*{min-width:0;}
        @media(max-width:860px){.ss-grid{grid-template-columns:1fr;}}
        .card{background:#fff;border-radius:14px;box-shadow:0 1px 12px rgba(0,0,0,0.07);overflow:hidden;}
        .seg-tab{border:1.5px solid #E2E8F0;border-radius:10px;background:#fff;cursor:pointer;font-family:inherit;font-size:13px;font-weight:500;padding:8px 16px;color:#374151;transition:all 0.15s;display:flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;}
        .seg-tab.active{border-color:#16a34a;background:#f0fdf4;color:#16a34a;font-weight:700;}
        .pax-chip{border:1.5px solid #E2E8F0;border-radius:999px;background:#fff;cursor:pointer;font-family:inherit;padding:7px 16px;text-align:left;transition:all 0.15s;white-space:nowrap;flex-shrink:0;}
        .pax-chip.active{border-color:#16a34a;background:#f0fdf4;}
        .fare-row{display:flex;justify-content:space-between;align-items:center;padding:9px 20px;font-size:13.5px;color:#374151;gap:8px;border-top:1px solid #F1F5F9;}
        .fare-row>span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .fare-row>span:last-child{flex-shrink:0;white-space:nowrap;}
      `}</style>

      {/* ── breadcrumb ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "10px 24px", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        {["Flight", "Travellers", "Meals & Bags", "Seats", "Payment"].map((s, i) => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span style={{ color: "#CBD5E0", fontSize: 10 }}>›</span>}
            <span style={{ fontSize: 12.5, fontWeight: i === 3 ? 700 : 400, color: i === 3 ? "#16a34a" : i < 3 ? "#94A3B8" : "#CBD5E0" }}>{s}</span>
          </span>
        ))}
      </div>

      <div className="ss-grid">
        {/* ════════════ LEFT PANEL ════════════ */}
        <div>
          <div className="card">

            {/* header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ color: "#16a34a" }}><IconSeat /></div>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Choose Your Seats</span>
              </div>
              <button onClick={handleContinue} style={{ background: "none", border: "none", color: "#16a34a", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                Skip <IconChevron />
              </button>
            </div>

            {/* segment tabs */}
            <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderBottom: "1px solid #F1F5F9", overflowX: "auto" }}>
              {segments.map((seg, idx) => (
                <button key={seg.key} className={`seg-tab ${activeSegIdx === idx ? "active" : ""}`} onClick={() => setActiveSegIdx(idx)}>
                  <div style={{ color: activeSegIdx === idx ? "#16a34a" : "#94A3B8" }}><IconFlight /></div>
                  {isRoundTrip && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5,
                      padding: "1px 5px", borderRadius: 999,
                      background: seg.leg === "onward" ? "#EFF6FF" : "#FDF4FF",
                      color: seg.leg === "onward" ? "#1D4ED8" : "#A21CAF",
                    }}>
                      {seg.leg === "onward" ? "Onward" : "Return"}
                    </span>
                  )}
                  {seg.label} <span style={{ fontSize: 11, color: "#94A3B8" }}>#{seg.flightNo}</span>
                </button>
              ))}
            </div>

            {/* main body */}
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>

              {/* ── LEFT INFO SIDEBAR ── */}
              <div style={{ width: 200, flexShrink: 0, borderRight: "1px solid #F1F5F9", padding: "18px 16px" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                  Passengers
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                  {allPassengers.map((p, idx) => {
                    const seatCode = (selections[activeSeg?.key] || {})[p.id];
                    const isActive = activePassIdx === idx;
                    return (
                      <div key={p.id} onClick={() => setActivePassIdx(idx)} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                        border: `1.5px solid ${isActive ? "#4ADE80" : "#F1F5F9"}`,
                        background: isActive ? "#F0FDF4" : "#FAFAFA",
                        transition: "all 0.15s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: "50%",
                            background: isActive ? "#16a34a" : "#E2E8F0",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, color: isActive ? "#fff" : "#64748B",
                          }}>
                            {(p.firstName || p.ptype)?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>
                              {p.firstName ? `${p.firstName} ${p.lastName || ""}`.trim() : `${p.ptype} ${idx + 1}`}
                            </div>
                            {seatCode && (
                              <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>Seat {seatCode}</div>
                            )}
                          </div>
                        </div>
                        {seatCode && (
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#111827" }}>
                            ₹{seatPrice(activeSeg?.key, seatCode).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                  Seat Types
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {LEGEND.map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 18, height: 16, borderRadius: "4px 4px 2px 2px", background: l.bg, border: `1.5px solid ${l.border}`, flexShrink: 0 }}/>
                      <span style={{ fontSize: 11.5, color: "#475569" }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SEAT MAP ── */}
              <div style={{
                flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start",
                padding: "24px 12px", background: "#F8FAFC", overflowX: "auto",
              }}>
                {activeSeg && Object.keys(seatRowsMap).length > 0 ? (
                  <CabinMap
                    seatRows={seatRowsMap}
                    selections={activeSegSelections}
                    activePassengerId={activePass?.id}
                    allPassengerIds={allPassengers.map(p => p.id)}
                    onSelect={handleSeatSelect}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, paddingTop: 40 }}>
                    No seat map available for this segment.
                  </div>
                )}
              </div>
            </div>

            {/* ── PASSENGER CHIPS BOTTOM BAR ── */}
            <div style={{ borderTop: "1px solid #F1F5F9", padding: "12px 20px", background: "#FAFAFA" }}>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
                {allPassengers.map((p, idx) => {
                  const seatCode = (selections[activeSeg?.key] || {})[p.id];
                  const isActive = activePassIdx === idx;
                  const name = p.firstName ? `${p.firstName} ${p.lastName || ""}`.trim() : `${p.ptype} ${idx + 1}`;
                  return (
                    <button key={p.id} className={`pax-chip ${isActive ? "active" : ""}`} onClick={() => setActivePassIdx(idx)}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: isActive ? "#16a34a" : "#111827" }}>
                        {name.length > 14 ? name.slice(0, 14) + "…" : name}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>
                        {seatCode ? `Seat ${seatCode} · ₹${seatPrice(activeSeg?.key, seatCode)}` : "Pick a seat"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ RIGHT: FARE SUMMARY ════════════ */}
        <div style={{ position: "sticky", top: 24 }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Fare Summary</span>
              <span style={{ fontSize: 12.5, color: "#6B7280" }}>{totalPax} Traveller{totalPax !== 1 ? "s" : ""}</span>
            </div>

            <div style={{ padding: "6px 0" }}>
              <div className="fare-row" style={{ borderTop: "none" }}>
                <span style={{ color: "#6B7280" }}>Fare Type</span>
                <span style={{ color: "#16a34a", fontWeight: 600 }}>
                  {(fareQuote?.Results?.IsRefundable ?? flight?.IsRefundable) ? "Refundable" : "Partial Refundable"}
                </span>
              </div>

              <div style={{ padding: "10px 20px 4px", fontSize: 11.5, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {isRoundTrip ? "Onward Flight" : "Flight Fare"}
              </div>
              {adultCount > 0 && <div className="fare-row"><span>Adult × {adultCount}</span><span style={{ fontWeight: 600 }}>₹{(onwardPublished * adultCount).toLocaleString("en-IN")}</span></div>}
              {childCount > 0 && <div className="fare-row"><span>Child × {childCount}</span><span style={{ fontWeight: 600 }}>₹{(onwardPublished * childCount).toLocaleString("en-IN")}</span></div>}
              {infantCount > 0 && <div className="fare-row"><span>Infant × {infantCount}</span><span style={{ fontWeight: 600 }}>₹{(onwardPublished * infantCount).toLocaleString("en-IN")}</span></div>}
              <div className="fare-row"><span>Taxes &amp; Fees</span><span style={{ fontWeight: 600 }}>₹{onwardTaxTotal.toLocaleString("en-IN")}</span></div>

              {isRoundTrip && (<>
                <div style={{ padding: "10px 20px 4px", fontSize: 11.5, fontWeight: 800, color: "#A21CAF", textTransform: "uppercase", letterSpacing: 0.5, borderTop: "1px dashed #E2E8F0", marginTop: 4 }}>
                  Return Flight
                </div>
                {adultCount > 0 && <div className="fare-row"><span>Adult × {adultCount}</span><span style={{ fontWeight: 600 }}>₹{(returnPublished * adultCount).toLocaleString("en-IN")}</span></div>}
                {childCount > 0 && <div className="fare-row"><span>Child × {childCount}</span><span style={{ fontWeight: 600 }}>₹{(returnPublished * childCount).toLocaleString("en-IN")}</span></div>}
                <div className="fare-row"><span>Taxes &amp; Fees</span><span style={{ fontWeight: 600 }}>₹{returnTaxTotal.toLocaleString("en-IN")}</span></div>
              </>)}

              {extraMealTotal > 0 && (
                <div className="fare-row"><span style={{ color: "#16a34a" }}>Meals</span><span style={{ fontWeight: 600, color: "#16a34a" }}>+₹{extraMealTotal.toLocaleString("en-IN")}</span></div>
              )}
              {extraBagTotal > 0 && (
                <div className="fare-row"><span style={{ color: "#16a34a" }}>Extra Baggage</span><span style={{ fontWeight: 600, color: "#16a34a" }}>+₹{extraBagTotal.toLocaleString("en-IN")}</span></div>
              )}
              {seatTotal > 0 && (
                <div className="fare-row"><span style={{ color: "#16a34a" }}>Seat Charges</span><span style={{ fontWeight: 700, color: "#16a34a" }}>+₹{seatTotal.toLocaleString("en-IN")}</span></div>
              )}
            </div>

            {/* total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "#F9FAFB", borderTop: "2px solid #E2E8F0", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14.5, color: "#111827" }}>Net Amount Payable</span>
              <span style={{ fontWeight: 800, fontSize: 17, color: "#111827", flexShrink: 0 }}>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            {/* progress */}
            <div style={{ padding: "14px 20px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Seats selected</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{totalSeatsSelected} / {maxSeats}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", borderRadius: 3, background: "#16a34a", width: `${progress}%`, transition: "width 0.35s ease" }}/>
              </div>
            </div>

            <div style={{ padding: "0 20px 20px" }}>
              <button onClick={handleContinue} style={styles.continueBtn}>
                Continue to Payment
              </button>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 10 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontSize: 11.5, color: "#94A3B8" }}>Secured &amp; Encrypted Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED STYLES
───────────────────────────────────────────────────────────────────────────── */
const styles = {
  center: {
    fontFamily: "'Inter','Segoe UI',sans-serif",
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 12,
    background: "#F1F5F9",
  },
  continueBtn: {
    width: "100%", padding: "13px 0", borderRadius: 10,
    background: "linear-gradient(135deg,#16a34a,#15803d)",
    color: "#fff", fontSize: 15, fontWeight: 700,
    border: "none", cursor: "pointer",
    boxShadow: "0 2px 12px rgba(22,163,74,0.28)",
    transition: "opacity 0.15s",
  },
};