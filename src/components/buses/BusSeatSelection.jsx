import React, { useState } from "react";
import Swal from "sweetalert2";
import { useBusSeatLayout } from "../../hooks/buseshooks/useBusSeatLayout";
import { useBusBoardingPoints } from "../../hooks/buseshooks/useBusBoardingPoints";
import { useNavigate } from "react-router-dom";

const GREEN = "#16a34a";

// ── Seat SVG icons from public folder ──────────────────────────────────────
const SEAT_ICONS = {
  available: "/availableseat.svg",
  female: "/availableforfemale.svg",
  male: "/availableformale.svg",
  booked: "/bookedseat.svg",
  selected: "/selectedseat.svg",
};

const SeatIcon = ({ status, label, onClick, size = 36 }) => {
  const clickable =
    status === "available" ||
    status === "selected" ||
    status === "female" ||
    status === "male";

  return (
    <div
      onClick={clickable ? onClick : undefined}
      title={label}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        cursor: clickable ? "pointer" : "not-allowed",
        transition: "opacity 0.15s, transform 0.15s",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        if (clickable) {
          e.currentTarget.style.opacity = "0.75";
          e.currentTarget.style.transform = "scale(1.08)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <img
        src={SEAT_ICONS[status] || SEAT_ICONS.available}
        alt={status}
        width={size}
        height={size}
        draggable={false}
        style={{ display: "block", userSelect: "none" }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: -14,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            color: "#6b7280",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

const LegendItem = ({ status, label }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
    }}
  >
    <SeatIcon status={status} size={28} />
    <span
      style={{
        fontSize: 10,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 1.3,
        maxWidth: 30,
      }}
    >
      {label}
    </span>
  </div>
);

const DriverCell = () => (
  <div
    style={{
      width: 36,
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1.5px solid #e5e7eb",
      borderRadius: "50%",
      background: "#fff",
      flexShrink: 0,
    }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="1.6" />
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="5"
        stroke="#9ca3af"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="22"
        stroke="#9ca3af"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="12"
        x2="5"
        y2="12"
        stroke="#9ca3af"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="19"
        y1="12"
        x2="22"
        y2="12"
        stroke="#9ca3af"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

function getSeatStatus(seat, selectedSeatNames) {
  if (selectedSeatNames.includes(seat.SeatName)) return "selected";
  if (!seat.SeatStatus) return "booked";
  if (seat.IsLadiesSeat) return "female";
  if (seat.IsMalesSeat) return "male";
  return "available";
}

const RealSeatMap = ({ seats, selectedSeatNames, onSeatToggle }) => {
  if (!seats || seats.length === 0) {
    return (
      <div style={{ color: "#9ca3af", fontSize: 13, padding: 16 }}>
        No seat data available.
      </div>
    );
  }

  const upperRows = seats.filter((row) => row.some((s) => s.IsUpper));
  const lowerRows = seats.filter((row) => row.some((s) => !s.IsUpper));

  const renderSection = (rows, label) => {
    if (rows.length === 0) return null;
    return (
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6b7280",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 10,
            paddingLeft: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "22px 20px",
            background: "#fafafa",
            display: "inline-block",
          }}
        >
          {rows.map((row, rowIdx) => {
            const sortedSeats = [...row].sort(
              (a, b) => parseInt(a.ColumnNo) - parseInt(b.ColumnNo),
            );
            const cells = [];
            sortedSeats.forEach((seat, sIdx) => {
              if (sIdx > 0) {
                const prevCol = parseInt(sortedSeats[sIdx - 1].ColumnNo);
                const currCol = parseInt(seat.ColumnNo);
                if (currCol - prevCol > 2)
                  cells.push(
                    <div
                      key={`gap-${sIdx}`}
                      style={{ width: 18, flexShrink: 0 }}
                    />,
                  );
              }
              const status = getSeatStatus(seat, selectedSeatNames);
              const clickable = status !== "booked";
              cells.push(
                <SeatIcon
                  key={seat.SeatName}
                  status={status}
                  label={seat.SeatName}
                  size={36}
                  onClick={
                    clickable
                      ? () => onSeatToggle(seat.SeatName, seat)
                      : undefined
                  }
                />,
              );
            });
            return (
              <div
                key={rowIdx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: rowIdx < rows.length - 1 ? 22 : 0,
                }}
              >
                {rowIdx === 0 ? (
                  <DriverCell />
                ) : (
                  <div style={{ width: 36, flexShrink: 0 }} />
                )}
                {cells}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderSection(upperRows, "Upper Berth")}
      {renderSection(lowerRows, "Lower Berth")}
    </div>
  );
};

// ── Shimmer Skeleton ────────────────────────────────────────────────────────
const shimmerBase = {
  background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
  backgroundSize: "600px 100%",
  animation: "busSeatShimmer 1.4s infinite linear",
  borderRadius: 6,
  flexShrink: 0,
};

const SeatMapSkeleton = () => {
  const ShimmerRow = ({ count, isFirst }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {isFirst ? (
        <div
          style={{ ...shimmerBase, width: 36, height: 36, borderRadius: "50%" }}
        />
      ) : (
        <div style={{ width: 36, flexShrink: 0 }} />
      )}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            ...shimmerBase,
            width: 36,
            height: 36,
            marginLeft: i === 2 ? 14 : 0,
          }}
        />
      ))}
    </div>
  );
  return (
    <>
      <style>{`@keyframes busSeatShimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }`}</style>
      {["Upper Berth", "Lower Berth"].map((label) => (
        <div key={label} style={{ marginBottom: 20 }}>
          <div
            style={{ ...shimmerBase, width: 90, height: 10, marginBottom: 12 }}
          />
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "18px 12px",
              background: "#fafafa",
              display: "inline-block",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {[4, 4, 4].map((count, i) => (
                <ShimmerRow key={i} count={count} isFirst={i === 0} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const BoardingPointsSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <style>{`@keyframes busSeatShimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }`}</style>
    <div style={{ ...shimmerBase, width: 110, height: 12, marginBottom: 4 }} />
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{ ...shimmerBase, height: 54, borderRadius: 8 }} />
    ))}
  </div>
);

// ── Boarding / Dropping Flow ────────────────────────────────────────────────
const BoardingDroppingFlow = ({
  boardingPoints,
  droppingPoints,
  selectedBoardingPoint,
  selectedDroppingPoint,
  onSelectBoarding,
  onSelectDropping,
}) => {
  const [step, setStep] = useState("boarding");
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState("in");

  const bothSelected = selectedBoardingPoint && selectedDroppingPoint;

  const handleBoardingSelect = (pt) => {
    onSelectBoarding(pt);
    setSlideDir("out");
    setAnimating(true);
    setTimeout(() => {
      setStep("dropping");
      setSlideDir("in");
      setTimeout(() => setAnimating(false), 320);
    }, 260);
  };

  const getAnimStyle = () => {
    if (!animating)
      return {
        opacity: 1,
        transform: "translateX(0)",
        transition: "opacity 0.28s ease, transform 0.28s ease",
      };
    if (slideDir === "out")
      return {
        opacity: 0,
        transform:
          step === "boarding" ? "translateX(-20px)" : "translateX(20px)",
        transition: "opacity 0.26s ease, transform 0.26s ease",
      };
    return {
      opacity: 0,
      transform: step === "dropping" ? "translateX(20px)" : "translateX(-20px)",
      transition: "none",
    };
  };

  const PointList = ({ points, selected, onSelect }) => (
    <div
      style={{
        maxHeight: 200,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {points && points.length > 0 ? (
        points.map((pt, i) => {
          const isSelected = selected?.name === pt.name;
          return (
            <div
              key={i}
              onClick={() => onSelect(pt)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
                background: isSelected ? "#f0fdf4" : "#fff",
                border: isSelected ? `1px solid ${GREEN}` : "1px solid #f3f4f6",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? GREEN : "#d1d5db"}`,
                    background: isSelected ? GREEN : "transparent",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#fff",
                      }}
                    />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                    {pt.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    {pt.subLabel}
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  flexShrink: 0,
                }}
              >
                {pt.time}
              </span>
            </div>
          );
        })
      ) : (
        <div
          style={{
            fontSize: 13,
            color: "#9ca3af",
            textAlign: "center",
            padding: "12px 0",
          }}
        >
          No points available
        </div>
      )}
    </div>
  );

  if (bothSelected) {
    const ConfirmedRow = ({ point, onChangeClick }) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
            {point.name}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            {point.subLabel}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
            {point.time}
          </div>
        </div>
        <button
          onClick={onChangeClick}
          style={{
            background: "#fff",
            border: `1.5px solid ${GREEN}`,
            borderRadius: 8,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 600,
            color: GREEN,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Change
        </button>
      </div>
    );
    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <ConfirmedRow
            point={selectedBoardingPoint}
            onChangeClick={() => {
              onSelectBoarding(null);
              onSelectDropping(null);
              setStep("boarding");
            }}
          />
          <div style={{ height: 1, background: "#f3f4f6", margin: "0 16px" }} />
          <ConfirmedRow
            point={selectedDroppingPoint}
            onChangeClick={() => {
              onSelectDropping(null);
              setStep("dropping");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div style={getAnimStyle()}>
        {step === "boarding" ? (
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#111",
                marginBottom: 10,
              }}
            >
              Boarding Point
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "9px 12px",
                marginBottom: 8,
                background: "#fff",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>
                Search Boarding Point
              </span>
            </div>
            <PointList
              points={boardingPoints}
              selected={selectedBoardingPoint}
              onSelect={handleBoardingSelect}
            />
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setSlideDir("out");
                setAnimating(true);
                setTimeout(() => {
                  setStep("boarding");
                  setSlideDir("in");
                  setTimeout(() => setAnimating(false), 320);
                }, 260);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 0 10px 0",
                color: GREEN,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={GREEN}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Change boarding point
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 14,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={GREEN}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#166534",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Boarding from
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#14532d" }}
                >
                  {selectedBoardingPoint?.name} · {selectedBoardingPoint?.time}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#111",
                marginBottom: 10,
              }}
            >
              Dropping Point
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "9px 12px",
                marginBottom: 8,
                background: "#fff",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>
                Search Dropping Point
              </span>
            </div>
            <PointList
              points={droppingPoints}
              selected={selectedDroppingPoint}
              onSelect={onSelectDropping}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ── Bus Card ────────────────────────────────────────────────────────────────
const BusCardExpanded = ({ bus }) => {
  const [expanded, setExpanded] = useState(false);
  const [activePrice, setActivePrice] = useState("All");
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState(null);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null);
  const [selectedSeatNames, setSelectedSeatNames] = useState([]);
  const [selectedSeatObjects, setSelectedSeatObjects] = useState([]);
  const [apiSeats, setApiSeats] = useState(null);
  const [seatLayoutLoaded, setSeatLayoutLoaded] = useState(false);
  const [apiBoardingPoints, setApiBoardingPoints] = useState([]);
  const [apiDroppingPoints, setApiDroppingPoints] = useState([]);
  const [fetchStarted, setFetchStarted] = useState(false);

  const { fetchSeatLayout, loading: seatLoading } = useBusSeatLayout();
  const { fetchBoardingPoints } = useBusBoardingPoints();
  const navigate = useNavigate();

  const handleToggleExpand = async () => {
    const opening = !expanded;
    setExpanded(opening);
    if (opening && !seatLayoutLoaded) {
      setFetchStarted(true);
      const traceId = bus.traceId ?? bus.trace_id ?? bus.traceID;
      const resultIndex =
        bus.resultIndex ?? bus.result_index ?? bus.resultindex;

      if (!traceId || resultIndex === undefined || resultIndex === null) {
        setSeatLayoutLoaded(true);
        return;
      }

      try {
        const [seatRes, bpRes] = await Promise.all([
          fetchSeatLayout({ traceId, resultIndex }),
          fetchBoardingPoints({ traceId, resultIndex }),
        ]);
        console.log("SEAT LAYOUT CALL:", { traceId, resultIndex });
        if (!seatRes?.success) {
          const msg =
            seatRes?.error?.message ||
            "Something went wrong. Please try again.";
          setExpanded(false);
          setSeatLayoutLoaded(false);
          setFetchStarted(false);
          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            html: `
              <p style="color:#c2410c;font-size:14px;margin:0 0 8px 0;">${msg}</p>
              <p style="color:#9ca3af;font-size:13px;margin:0;">Please go back and search again to get fresh results.</p>
            `,
            confirmButtonText: "Go Back & Search",
            confirmButtonColor: "#16a34a",
            showCancelButton: false,
          });
          return;
        }

        if (seatRes?.data?.seats) setApiSeats(seatRes.data.seats);
        setSeatLayoutLoaded(true);

        if (bpRes?.success && bpRes?.data) {
          const mapPoint = (p) => ({
            id: p.id,
            name: p.name,
            subLabel: p.location || p.landmark || p.address || "",
            time: p.time
              ? new Date(p.time).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "",
            contact: p.contact || "",
          });
          setApiBoardingPoints(
            (bpRes.data.boarding_points || []).map(mapPoint),
          );
          setApiDroppingPoints(
            (bpRes.data.dropping_points || []).map(mapPoint),
          );
        }
      } catch (err) {
        setExpanded(false);
        setSeatLayoutLoaded(false);
        setFetchStarted(false);
        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          html: `
            <p style="color:#c2410c;font-size:14px;margin:0 0 8px 0;">Something went wrong. Please try again.</p>
            <p style="color:#9ca3af;font-size:13px;margin:0;">Please go back and search again to get fresh results.</p>
          `,
          confirmButtonText: "Go Back & Search",
          confirmButtonColor: "#16a34a",
          showCancelButton: false,
        });
      }
    }
  };

  const handleSeatToggle = (seatName, seatObj) => {
    console.log("SEAT OBJECT:", JSON.stringify(seatObj, null, 2));
    setSelectedSeatNames((prevNames) => {
      const isSelected = prevNames.includes(seatName);
      if (isSelected) {
        setSelectedSeatObjects((prevObjs) =>
          prevObjs.filter((o) => o.SeatName !== seatName),
        );
        return prevNames.filter((n) => n !== seatName);
      } else {
        setSelectedSeatObjects((prevObjs) => {
          if (prevObjs.some((o) => o.SeatName === seatName)) return prevObjs;
          return [...prevObjs, seatObj];
        });
        return [...prevNames, seatName];
      }
    });
  };

  const totalFare = selectedSeatObjects.reduce(
    (sum, s) => sum + (s.SeatFare || 0),
    0,
  );
  const priceTiers = apiSeats
    ? [...new Set(apiSeats.flat().map((s) => s.SeatFare))].sort((a, b) => a - b)
    : bus.priceTiers || [];
  const filteredSeats = apiSeats
    ? activePrice === "All"
      ? apiSeats
      : apiSeats.map((row) =>
          row.filter((s) => s.SeatFare === Number(activePrice)),
        )
    : null;

  const canContinue =
    selectedSeatNames.length > 0 &&
    selectedBoardingPoint &&
    selectedDroppingPoint;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.12)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.07)")
      }
    >
      {/* ── Card Header ── */}
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>
              {bus.operatorName}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              {bus.busType}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#111",
                    lineHeight: 1,
                  }}
                >
                  {bus.departureTime}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
                  {bus.departureDate}, {bus.from}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                  {bus.duration}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: "#d1d5db" }} />
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginLeft: 2 }}
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#111",
                    lineHeight: 1,
                  }}
                >
                  {bus.arrivalTime}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
                  {bus.arrivalDate}, {bus.to}
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", marginLeft: 24, flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>from</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
              ₹ {bus.price?.toLocaleString("en-IN")}
            </div>
            <button
              onClick={handleToggleExpand}
              disabled={seatLoading && !seatLayoutLoaded}
              style={{
                background: expanded ? "#374151" : GREEN,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 16px",
                fontWeight: 600,
                fontSize: 13,
                cursor: seatLoading ? "wait" : "pointer",
                marginTop: 8,
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
            >
              {seatLoading && !seatLayoutLoaded
                ? "Loading..."
                : expanded
                  ? "Hide seats"
                  : "Select seats"}
            </button>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 5 }}>
              {bus.seatsAvailable} Seats Available
            </div>
          </div>
        </div>
      </div>

      {/* ── Expanded Section ── */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid #f3f4f6",
            padding: "16px 18px",
            background: "#fdfdfd",
          }}
        >
          {/* Legend + count */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>
                {bus.seatsAvailable} seat{bus.seatsAvailable !== 1 ? "s" : ""}{" "}
                available
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                Click on seat to select/deselect
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <LegendItem status="available" label="Available" />
              <LegendItem status="booked" label="Booked" />
              <LegendItem status="female" label="Ladies only" />
              <LegendItem status="male" label="Gents only" />
              <LegendItem status="selected" label="Selected" />
            </div>
          </div>

          {/* Price Filter Tabs */}
          {priceTiers.length > 0 && seatLayoutLoaded && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              {["All", ...priceTiers].map((tier) => (
                <div
                  key={tier}
                  onClick={() => setActivePrice(tier)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    userSelect: "none",
                    border:
                      activePrice === tier
                        ? `1.5px solid ${GREEN}`
                        : "1.5px solid #e5e7eb",
                    background: activePrice === tier ? GREEN : "#fff",
                    color: activePrice === tier ? "#fff" : "#374151",
                    fontSize: 13,
                    fontWeight: 500,
                    transition: "all 0.15s",
                  }}
                >
                  {tier === "All" ? "All" : `₹${tier}`}
                </div>
              ))}
            </div>
          )}

          {/* ── 60-40 Split: Seat Map | Boarding/Dropping ── */}
          <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
            {/* LEFT 60% — Seat Map */}
            <div
              style={{
                flex: "0 0 60%",
                minWidth: 0,
                overflowX: "auto",
              }}
            >
              {fetchStarted && !seatLayoutLoaded ? (
                <SeatMapSkeleton />
              ) : seatLayoutLoaded && filteredSeats ? (
                <RealSeatMap
                  seats={filteredSeats}
                  selectedSeatNames={selectedSeatNames}
                  onSeatToggle={handleSeatToggle}
                />
              ) : seatLayoutLoaded && !filteredSeats ? (
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: 13,
                    padding: "24px 16px",
                  }}
                >
                  Could not load seat layout.
                </div>
              ) : null}
            </div>

            {/* Vertical divider */}
            <div
              style={{
                width: 1,
                background: "#f0f0f0",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            />

            {/* RIGHT 40% — Boarding / Dropping + Continue */}
            <div
              style={{
                flex: "0 0 calc(40% - 21px)",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1 }}>
                {fetchStarted && !seatLayoutLoaded ? (
                  <BoardingPointsSkeleton />
                ) : (
                  <BoardingDroppingFlow
                    boardingPoints={apiBoardingPoints}
                    droppingPoints={apiDroppingPoints}
                    selectedBoardingPoint={selectedBoardingPoint}
                    selectedDroppingPoint={selectedDroppingPoint}
                    onSelectBoarding={setSelectedBoardingPoint}
                    onSelectDropping={setSelectedDroppingPoint}
                  />
                )}
              </div>

              {/* Continue bar */}
              {!seatLoading && seatLayoutLoaded && (
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 14,
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>
                          Seat Selected:
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111",
                            wordBreak: "break-all",
                          }}
                        >
                          {selectedSeatNames.length > 0
                            ? selectedSeatNames.join(", ")
                            : "—"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>
                          Base Fare:
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111",
                          }}
                        >
                          {totalFare > 0
                            ? `₹ ${totalFare.toLocaleString("en-IN")}`
                            : "—"}
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={!canContinue}
                      onClick={() => {
                        const uniqueSeatObjects = selectedSeatObjects.filter(
                          (seat, idx, arr) =>
                            arr.findIndex(
                              (s) => s.SeatName === seat.SeatName,
                            ) === idx,
                        );
                        const uniqueSeatNames = [...new Set(selectedSeatNames)];
                        navigate("/buses/passenger-details", {
                          state: {
                            bus,
                            selectedSeatObjects: uniqueSeatObjects,
                            selectedSeatNames: uniqueSeatNames,
                            selectedBoardingPoint,
                            selectedDroppingPoint,
                          },
                        });
                      }}
                      style={{
                        background: canContinue ? GREEN : "#e5e7eb",
                        color: canContinue ? "#fff" : "#9ca3af",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 0",
                        width: "100%",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: canContinue ? "pointer" : "not-allowed",
                        transition: "background 0.2s",
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer Tags ── */}
      <div
        style={{
          borderTop: "1px solid #f3f4f6",
          padding: "10px 18px",
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {(bus.footerTags || []).map((tag) => (
          <div
            key={tag}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 13, color: "#6b7280" }}>{tag}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Filter Panel ────────────────────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters }) => {
  const toggle = (category, key) =>
    setFilters((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: !prev[category][key] },
    }));
  const toggleArr = (category, val) =>
    setFilters((prev) => {
      const arr = prev[category];
      return {
        ...prev,
        [category]: arr.includes(val)
          ? arr.filter((x) => x !== val)
          : [...arr, val],
      };
    });
  const clearAll = () =>
    setFilters({
      depSlots: { slot1: false, slot2: false, slot3: false, slot4: false },
      busTypes: { ac: false, nonAc: false, seater: false, sleeper: false },
      boardingPoints: [],
      droppingPoints: [],
    });

  const timeSlots = [
    { key: "slot1", label: "12AM – 6AM", icon: "🌙" },
    { key: "slot2", label: "6AM – 12PM", icon: "🌅" },
    { key: "slot3", label: "12PM – 6PM", icon: "☀️" },
    { key: "slot4", label: "6PM – 12AM", icon: "🌙" },
  ];
  const busTypeButtons = [
    { key: "ac", label: "AC" },
    { key: "nonAc", label: "Non AC" },
    { key: "seater", label: "Seater" },
    { key: "sleeper", label: "Sleeper" },
  ];
  const boardingOptions = ["Airoli", "Dadar", "Bandra", "Andheri"];
  const droppingOptions = [
    "Alandi phata",
    "Ambegoan",
    "Talegoan",
    "Finolx Pcmc",
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
          Filter by:
        </span>
        <span
          onClick={clearAll}
          style={{
            color: GREEN,
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Clear
        </span>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#111",
          marginBottom: 8,
        }}
      >
        Departure Time
      </div>
      {timeSlots.map((slot) => (
        <label
          key={slot.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 0",
            cursor: "pointer",
            color: "#374151",
          }}
        >
          <input
            type="checkbox"
            checked={filters.depSlots[slot.key]}
            onChange={() => toggle("depSlots", slot.key)}
            style={{ accentColor: GREEN, width: 14, height: 14 }}
          />
          <span>{slot.icon}</span>
          <span style={{ fontSize: 13 }}>{slot.label}</span>
        </label>
      ))}
      <div style={{ height: 1, background: "#f3f4f6", margin: "14px 0" }} />
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#111",
          marginBottom: 10,
        }}
      >
        Bus Type
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {busTypeButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => toggle("busTypes", btn.key)}
            style={{
              border: filters.busTypes[btn.key]
                ? `1.5px solid ${GREEN}`
                : "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "8px 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              fontSize: 12,
              color: "#374151",
              background: filters.busTypes[btn.key] ? "#f0fdf4" : "#fff",
              transition: "all 0.15s",
            }}
          >
            {btn.key === "ac" && <span style={{ fontSize: 18 }}>❄️</span>}
            {btn.key === "nonAc" && <span style={{ fontSize: 18 }}>🌬️</span>}
            {btn.key === "seater" && <span style={{ fontSize: 18 }}>🪑</span>}
            {btn.key === "sleeper" && <span style={{ fontSize: 18 }}>🛏️</span>}
            {btn.label}
          </button>
        ))}
      </div>
      <div style={{ height: 1, background: "#f3f4f6", margin: "14px 0" }} />
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#111",
          marginBottom: 8,
        }}
      >
        Boarding Point
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "7px 10px",
          marginBottom: 8,
          background: "#fff",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          Search Boarding Point
        </span>
      </div>
      {boardingOptions.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 0",
            cursor: "pointer",
            fontSize: 12,
            color: "#374151",
          }}
        >
          <input
            type="checkbox"
            checked={filters.boardingPoints.includes(opt)}
            onChange={() => toggleArr("boardingPoints", opt)}
            style={{ accentColor: GREEN, width: 13, height: 13 }}
          />
          {opt}
        </label>
      ))}
      <span
        style={{
          color: GREEN,
          fontSize: 12,
          cursor: "pointer",
          marginTop: 6,
          display: "block",
        }}
      >
        + Show all boarding points
      </span>
      <div style={{ height: 1, background: "#f3f4f6", margin: "14px 0" }} />
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#111",
          marginBottom: 8,
        }}
      >
        Dropping Point
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "7px 10px",
          marginBottom: 8,
          background: "#fff",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          Search Dropping Point
        </span>
      </div>
      {droppingOptions.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 0",
            cursor: "pointer",
            fontSize: 12,
            color: "#374151",
          }}
        >
          <input
            type="checkbox"
            checked={filters.droppingPoints.includes(opt)}
            onChange={() => toggleArr("droppingPoints", opt)}
            style={{ accentColor: GREEN, width: 13, height: 13 }}
          />
          {opt}
        </label>
      ))}
      <span
        style={{
          color: GREEN,
          fontSize: 12,
          cursor: "pointer",
          marginTop: 6,
          display: "block",
        }}
      >
        + Show all dropping points
      </span>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const BusSeatSelection = ({ buses = [], from = "", to = "" }) => {
  const [filters, setFilters] = useState({
    depSlots: { slot1: false, slot2: false, slot3: false, slot4: false },
    busTypes: { ac: false, nonAc: false, seater: false, sleeper: false },
    boardingPoints: [],
    droppingPoints: [],
  });
  return (
    <div
      style={{
        padding: "24px 32px",
        maxWidth: 1300,
        margin: "0 auto",
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div style={{ width: 220, flexShrink: 0, position: "sticky", top: 80 }}>
        <FilterPanel filters={filters} setFilters={setFilters} />
      </div>
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
            {from && to ? `Buses from ${from} to ${to}` : "Available Buses"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            {buses.length} buses found
          </div>
        </div>
        {buses.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "64px 0",
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚌</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>
              No buses found
            </div>
          </div>
        )}
        {buses.map((bus, index) => (
          <BusCardExpanded key={bus.id ?? index} bus={bus} />
        ))}
        {buses.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 0",
              gap: 12,
            }}
          >
            <div style={{ height: 1, width: 60, background: "#e5e7eb" }} />
            <span style={{ fontSize: 13, color: "#9ca3af" }}>
              All buses loaded
            </span>
            <div style={{ height: 1, width: 60, background: "#e5e7eb" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSeatSelection;
