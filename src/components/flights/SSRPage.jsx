// src\components\flights\SSRPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSSR } from "../../hooks/flighthooks/useSSR";

// ─── Icons ────────────────────────────────────────────────────────────────────
const MealIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const BaggageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="7" width="12" height="14" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 4 0v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Baggage size icons
const BagSmall = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <rect
      x="8"
      y="10"
      width="16"
      height="18"
      rx="2"
      fill="#fbbf24"
      stroke="#f59e0b"
      strokeWidth="1.5"
    />
    <path d="M12 10V8a2 2 0 0 1 4 0v2" stroke="#f59e0b" strokeWidth="1.5" />
  </svg>
);
const BagMed = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect
      x="6"
      y="8"
      width="20"
      height="20"
      rx="2"
      fill="#34d399"
      stroke="#10b981"
      strokeWidth="1.5"
    />
    <path d="M11 8V6a2 2 0 0 1 4 0v2" stroke="#10b981" strokeWidth="1.5" />
  </svg>
);
const BagLarge = () => (
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
    <rect
      x="4"
      y="6"
      width="24"
      height="22"
      rx="2"
      fill="#60a5fa"
      stroke="#3b82f6"
      strokeWidth="1.5"
    />
    <path d="M10 6V4a2 2 0 0 1 4 0v2" stroke="#3b82f6" strokeWidth="1.5" />
  </svg>
);
const BagXL = () => (
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
    <rect
      x="3"
      y="5"
      width="26"
      height="23"
      rx="2"
      fill="#a78bfa"
      stroke="#8b5cf6"
      strokeWidth="1.5"
    />
    <path d="M10 5V3a2 2 0 0 1 4 0v2" stroke="#8b5cf6" strokeWidth="1.5" />
  </svg>
);

const getBagIcon = (weight) => {
  if (weight <= 5) return <BagSmall />;
  if (weight <= 10) return <BagMed />;
  if (weight <= 20) return <BagLarge />;
  return <BagXL />;
};

// Meal emoji map
const getMealEmoji = (code) => {
  const map = {
    VGAN: "🥗",
    PTSW: "🥪",
    LCML: "🥗",
    JNML: "🧆",
    FRCK: "🍰",
    DBVG: "🥦",
    CPML: "🍱",
    CJSW: "🥙",
    AGSW: "🍛",
  };
  return map[code] || "🍽️";
};

export default function SSRPage() {
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
  } = location.state || {};

  const { ssrData, loading, error, fetchSSR } = useSSR();

  useEffect(() => {
    if (traceId && resultIndex) {
      fetchSSR({ traceId, resultIndex });
    }
  }, []);

  // ── Tabs & Segment ──
  const [activeTab, setActiveTab] = useState("meals"); // "meals" | "baggage"
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(0);

  // ── Traveller selection ──
  const allTravellers = useMemo(() => {
    const list = [];
    (travellers?.adults || []).forEach((t) =>
      list.push({ ...t, ptype: "Adult" }),
    );
    (travellers?.children || []).forEach((t) =>
      list.push({ ...t, ptype: "Child" }),
    );
    (travellers?.infants || []).forEach((t) =>
      list.push({ ...t, ptype: "Infant" }),
    );
    return list;
  }, [travellers]);

  const [activeTravellerIdx, setActiveTravellerIdx] = useState(0);

  // ── Selected meals: { [segKey]: { [travellerId]: mealObj } } ──
  const [selectedMeals, setSelectedMeals] = useState({});
  // ── Selected baggage: { [segKey]: { [travellerId]: baggageObj } } ──
  const [selectedBaggage, setSelectedBaggage] = useState({});

  const mealSegments = ssrData?.MealsBySegment || [];
  const baggageSegments = ssrData?.BaggageBySegment || [];

  const currentMealSeg = mealSegments[activeSegmentIdx];
  const currentBagSeg = baggageSegments[activeSegmentIdx] || baggageSegments[0];

  // Meals for current segment (exclude NoMeal)
  const availableMeals = (currentMealSeg?.meals || []).filter(
    (m) => m.Code !== "NoMeal",
  );
  const availableBaggage = (currentBagSeg?.baggage || []).filter(
    (b) => b.Code !== "NoBaggage",
  );

  const currentTraveller = allTravellers[activeTravellerIdx];

  const getSelectedMeal = (segKey, travId) =>
    selectedMeals?.[segKey]?.[travId] || null;
  const getSelectedBag = (segKey, travId) =>
    selectedBaggage?.[segKey]?.[travId] || null;

  const handleSelectMeal = (meal) => {
    const segKey = currentMealSeg?.segment_key;
    const travId = currentTraveller?.id;
    setSelectedMeals((prev) => {
      const prevSeg = prev[segKey] || {};
      // Toggle off if same
      if (prevSeg[travId]?.Code === meal.Code) {
        const updated = { ...prevSeg };
        delete updated[travId];
        return { ...prev, [segKey]: updated };
      }
      return { ...prev, [segKey]: { ...prevSeg, [travId]: meal } };
    });
  };

  const handleSelectBaggage = (bag) => {
    const segKey = currentBagSeg?.segment_key;
    const travId = currentTraveller?.id;
    setSelectedBaggage((prev) => {
      const prevSeg = prev[segKey] || {};
      if (prevSeg[travId]?.Code === bag.Code) {
        const updated = { ...prevSeg };
        delete updated[travId];
        return { ...prev, [segKey]: updated };
      }
      return { ...prev, [segKey]: { ...prevSeg, [travId]: bag } };
    });
  };

  // ── Extra charges calculation ──
  const extraMealTotal = useMemo(() => {
    let total = 0;
    Object.values(selectedMeals).forEach((segMap) => {
      Object.values(segMap).forEach((meal) => {
        total += meal.Price || 0;
      });
    });
    return total;
  }, [selectedMeals]);

  const extraBaggageTotal = useMemo(() => {
    let total = 0;
    Object.values(selectedBaggage).forEach((segMap) => {
      Object.values(segMap).forEach((bag) => {
        total += bag.Price || 0;
      });
    });
    return total;
  }, [selectedBaggage]);

  // Base fare from fareQuote
  const totalPassengers = allTravellers.length || 1;
  const onwardPublished =
    fareQuote?.Results?.Fare?.PublishedFare ?? flight?.Fare?.PublishedFare ?? 0;
  const returnPublished =
    returnFareQuote?.Results?.Fare?.PublishedFare ??
    returnFlight?.Fare?.PublishedFare ??
    0;
  const onwardTax = fareQuote?.Results?.Fare?.Tax ?? flight?.Fare?.Tax ?? 0;
  const returnTax =
    returnFareQuote?.Results?.Fare?.Tax ?? returnFlight?.Fare?.Tax ?? 0;
  const baseFareTotal = (onwardPublished + returnPublished) * totalPassengers;
  const taxTotal = (onwardTax + returnTax) * totalPassengers;
  const grandTotal = baseFareTotal + extraMealTotal + extraBaggageTotal;

  const adultCount = searchMeta?.passengers?.adults ?? 1;
  const childCount = searchMeta?.passengers?.children ?? 0;
  const infantCount = searchMeta?.passengers?.infants ?? 0;

  // Traveller label
  const travellerLabel = (t, idx) => {
    const name = t.firstName
      ? `${t.firstName} ${t.lastName}`.trim()
      : `${t.ptype} ${idx + 1}`;
    return name.length > 12 ? name.slice(0, 12) + "…" : name;
  };

  // Per-traveller summary for bottom bar
  const getTravellerMealSummary = (trav) => {
    let count = 0,
      total = 0;
    mealSegments.forEach((seg) => {
      const m = selectedMeals?.[seg.segment_key]?.[trav.id];
      if (m) {
        count++;
        total += m.Price;
      }
    });
    if (count === 0) return "Select Meal";
    return `${count} Meal${count > 1 ? "s" : ""} • ₹${total}`;
  };

  const getTravellerBagSummary = (trav) => {
    let weight = 0,
      total = 0,
      count = 0;
    baggageSegments.forEach((seg) => {
      const b = selectedBaggage?.[seg.segment_key]?.[trav.id];
      if (b) {
        weight += b.Weight;
        total += b.Price;
        count++;
      }
    });
    if (count === 0) return "Select Baggage";
    return `${weight}KG • ₹${total}`;
  };

  const handleContinue = () => {
    alert("Proceeding to payment with SSR selections!");
  };

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'Inter','Segoe UI',sans-serif",
          minHeight: "100vh",
          background: "#f0f4fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <div style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>
            Loading add-ons...
          </div>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Inter','Segoe UI',sans-serif",
        background: "#f0f4fa",
        minHeight: "100vh",
        padding: "24px 0 80px",
      }}
    >
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        .ssr-wrap{max-width:1200px;margin:0 auto;padding:0 16px;}
        .ssr-grid{display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start;}
        @media(max-width:860px){.ssr-grid{grid-template-columns:1fr;}}
        .card{background:#fff;border-radius:14px;box-shadow:0 1px 10px rgba(0,0,0,0.07);overflow:hidden;}
        .card+.card{margin-top:16px;}
        .tab-btn{background:none;border:none;cursor:pointer;padding:13px 0;font-family:inherit;font-size:14px;transition:color 0.15s;}
        .tab-active{border-bottom:2px solid #16a34a;color:#16a34a;font-weight:600;}
        .tab-inactive{border-bottom:2px solid transparent;color:#6b7280;font-weight:400;}
        .seg-btn{border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;font-size:13px;font-weight:500;padding:7px 16px;color:#374151;transition:all 0.15s;display:flex;align-items:center;gap:6px;}
        .seg-btn.active{border-color:#16a34a;background:#f0fdf4;color:#16a34a;font-weight:600;}
        .meal-card{border:1.5px solid #e5e7eb;border-radius:10px;padding:14px 16px;cursor:pointer;transition:all 0.15s;display:flex;justify-content:space-between;align-items:center;background:#fff;}
        .meal-card:hover{border-color:#16a34a;background:#f9fffe;}
        .meal-card.selected{border-color:#16a34a;background:#f0fdf4;}
        .bag-card{border:1.5px solid #e5e7eb;border-radius:10px;padding:14px 16px;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:12px;background:#fff;}
        .bag-card:hover{border-color:#16a34a;background:#f9fffe;}
        .bag-card.selected{border-color:#16a34a;background:#f0fdf4;}
        .add-btn-sm{border:1.5px solid #16a34a;border-radius:8px;background:#fff;color:#16a34a;font-size:13px;font-weight:600;padding:6px 20px;cursor:pointer;font-family:inherit;transition:background 0.15s;white-space:nowrap;}
        .add-btn-sm:hover{background:#f0fdf4;}
        .add-btn-sm.added{background:#16a34a;color:#fff;border-color:#16a34a;}
        .trav-chip{border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;padding:10px 14px;text-align:left;transition:all 0.15s;flex:1;min-width:0;}
        .trav-chip.active{border-color:#16a34a;background:#f0fdf4;}
        .fare-row{display:flex;justify-content:space-between;align-items:center;padding:10px 20px;font-size:14px;color:#374151;}
        .fare-row+.fare-row{border-top:1px solid #f3f4f6;}
        .skip-btn{background:none;border:none;cursor:pointer;color:#16a34a;font-size:13px;font-weight:600;font-family:inherit;display:flex;align-items:center;gap:4px;}
        @media(max-width:580px){
          .meals-grid{grid-template-columns:1fr!important;}
          .bag-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      <div className="ssr-wrap">
        <div className="ssr-grid">
          {/* ── Left: SSR Panel ── */}
          <div>
            <div className="card">
              {/* Tab Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 20px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ display: "flex", gap: 24 }}>
                  <button
                    className={`tab-btn ${activeTab === "meals" ? "tab-active" : "tab-inactive"}`}
                    onClick={() => setActiveTab("meals")}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <MealIcon /> Meals
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "baggage" ? "tab-active" : "tab-inactive"}`}
                    onClick={() => setActiveTab("baggage")}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <BaggageIcon /> Baggage
                  </button>
                </div>
                <button
                  className="skip-btn"
                  onClick={() => {
                    setActiveTab(activeTab === "meals" ? "baggage" : "seats");
                  }}
                >
                  Skip to {activeTab === "meals" ? "Baggage" : "Seat"} Selection{" "}
                  <ChevronRight />
                </button>
              </div>

              {/* Segment Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "12px 20px",
                  borderBottom: "1px solid #f3f4f6",
                  flexWrap: "wrap",
                }}
              >
                {(activeTab === "meals" ? mealSegments : baggageSegments).map(
                  (seg, idx) => (
                    <button
                      key={seg.segment_key}
                      className={`seg-btn ${activeSegmentIdx === idx ? "active" : ""}`}
                      onClick={() => setActiveSegmentIdx(idx)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={activeSegmentIdx === idx ? "#16a34a" : "#9ca3af"}
                        stroke="none"
                      >
                        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                      </svg>
                      {seg.origin} - {seg.destination}
                    </button>
                  ),
                )}
              </div>

              {/* ── MEALS TAB ── */}
              {activeTab === "meals" && (
                <div style={{ padding: "16px 20px" }}>
                  {availableMeals.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#9ca3af",
                        fontSize: 13,
                        padding: "24px 0",
                      }}
                    >
                      No meals available for this segment.
                    </div>
                  ) : (
                    <div
                      className="meals-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      {availableMeals.map((meal) => {
                        const segKey = currentMealSeg?.segment_key;
                        const isSelected =
                          getSelectedMeal(segKey, currentTraveller?.id)
                            ?.Code === meal.Code;
                        return (
                          <div
                            key={meal.Code}
                            className={`meal-card ${isSelected ? "selected" : ""}`}
                            onClick={() => handleSelectMeal(meal)}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                minWidth: 0,
                              }}
                            >
                              <span style={{ fontSize: 22, flexShrink: 0 }}>
                                {getMealEmoji(meal.Code)}
                              </span>
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#111827",
                                    lineHeight: 1.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {meal.AirlineDescription || meal.Code}
                                </div>
                                <div
                                  style={{
                                    fontSize: 13,
                                    color: "#16a34a",
                                    fontWeight: 700,
                                    marginTop: 2,
                                  }}
                                >
                                  ₹{meal.Price}
                                </div>
                              </div>
                            </div>
                            <button
                              className={`add-btn-sm ${isSelected ? "added" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectMeal(meal);
                              }}
                              style={{ marginLeft: 8, flexShrink: 0 }}
                            >
                              {isSelected ? (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <CheckIcon /> Added
                                </span>
                              ) : (
                                "Add"
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── BAGGAGE TAB ── */}
              {activeTab === "baggage" && (
                <div style={{ padding: "16px 20px" }}>
                  {availableBaggage.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#9ca3af",
                        fontSize: 13,
                        padding: "24px 0",
                      }}
                    >
                      No extra baggage available for this segment.
                    </div>
                  ) : (
                    <div
                      className="bag-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      {availableBaggage.map((bag) => {
                        const segKey = currentBagSeg?.segment_key;
                        const isSelected =
                          getSelectedBag(segKey, currentTraveller?.id)?.Code ===
                          bag.Code;
                        return (
                          <div
                            key={bag.Code}
                            className={`bag-card ${isSelected ? "selected" : ""}`}
                            onClick={() => handleSelectBaggage(bag)}
                          >
                            <div style={{ flexShrink: 0 }}>
                              {getBagIcon(bag.Weight)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#111827",
                                }}
                              >
                                Additional {bag.Weight} KG
                              </div>
                              {bag.Text && (
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: "#6b7280",
                                    marginTop: 2,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {bag.Text}
                                </div>
                              )}
                              <div
                                style={{
                                  fontSize: 14,
                                  color: "#16a34a",
                                  fontWeight: 700,
                                  marginTop: 3,
                                }}
                              >
                                ₹{bag.Price.toLocaleString("en-IN")}
                              </div>
                            </div>
                            <button
                              className={`add-btn-sm ${isSelected ? "added" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectBaggage(bag);
                              }}
                              style={{ flexShrink: 0 }}
                            >
                              {isSelected ? (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <CheckIcon /> Added
                                </span>
                              ) : (
                                "Add"
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Traveller Bottom Bar ── */}
              <div
                style={{
                  borderTop: "1px solid #f3f4f6",
                  padding: "12px 20px",
                  background: "#fafafa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    overflowX: "auto",
                    paddingBottom: 2,
                  }}
                >
                  {allTravellers.map((trav, idx) => (
                    <button
                      key={trav.id}
                      className={`trav-chip ${activeTravellerIdx === idx ? "active" : ""}`}
                      onClick={() => setActiveTravellerIdx(idx)}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color:
                            activeTravellerIdx === idx ? "#16a34a" : "#111827",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {travellerLabel(trav, idx)}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#6b7280",
                          marginTop: 2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {activeTab === "meals"
                          ? getTravellerMealSummary(trav)
                          : getTravellerBagSummary(trav)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Fare Summary ── */}
          <div style={{ position: "sticky", top: 24 }}>
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px 12px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span
                  style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}
                >
                  Fare Summary
                </span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  {totalPassengers} Traveller{totalPassengers !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{ padding: "8px 0" }}>
                <div className="fare-row">
                  <span style={{ color: "#6b7280" }}>Fare Type</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>
                    {(fareQuote?.Results?.IsRefundable ?? flight?.IsRefundable)
                      ? "Refundable"
                      : "Partial Refundable"}
                  </span>
                </div>
                <div className="fare-row">
                  <span>{returnFlight ? "Onward Fare" : "Base Fare"}</span>
                  <span style={{ fontWeight: 600 }}>
                    ₹
                    {(onwardPublished * totalPassengers).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
                {returnFlight && (
                  <div className="fare-row">
                    <span>Return Fare</span>
                    <span style={{ fontWeight: 600 }}>
                      ₹
                      {(returnPublished * totalPassengers).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                )}
                {adultCount > 0 && (
                  <div className="fare-row">
                    <span>Adult × {adultCount}</span>
                    <span style={{ fontWeight: 600 }}>
                      ₹
                      {(
                        Math.round(onwardPublished) * adultCount
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {childCount > 0 && (
                  <div className="fare-row">
                    <span>Child × {childCount}</span>
                    <span style={{ fontWeight: 600 }}>
                      ₹
                      {(
                        Math.round(onwardPublished) * childCount
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {infantCount > 0 && (
                  <div className="fare-row">
                    <span>Infant × {infantCount}</span>
                    <span style={{ fontWeight: 600 }}>
                      ₹
                      {(
                        Math.round(onwardPublished) * infantCount
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="fare-row">
                  <span>Taxes &amp; Fees</span>
                  <span style={{ fontWeight: 600 }}>
                    ₹{taxTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {extraMealTotal > 0 && (
                  <div className="fare-row">
                    <span style={{ color: "#16a34a" }}>Meals Added</span>
                    <span style={{ fontWeight: 600, color: "#16a34a" }}>
                      +₹{extraMealTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {extraBaggageTotal > 0 && (
                  <div className="fare-row">
                    <span style={{ color: "#16a34a" }}>Extra Baggage</span>
                    <span style={{ fontWeight: 600, color: "#16a34a" }}>
                      +₹{extraBaggageTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 20px",
                  background: "#f9fafb",
                  borderTop: "2px solid #e5e7eb",
                }}
              >
                <span
                  style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}
                >
                  Net Amount Payable
                </span>
                <span
                  style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}
                >
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div style={{ padding: "16px 20px" }}>
                <button
                  onClick={handleContinue}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#16a34a,#15803d)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 12px rgba(22,163,74,0.3)",
                    transition: "opacity 0.15s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Continue to Payment
                </button>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 10,
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>
                    Secured &amp; Encrypted Payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
