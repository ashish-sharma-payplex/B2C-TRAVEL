import { useState } from "react";
import { useLocation } from "react-router-dom";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const flightlogo = "/bookflighticon.svg";
const planlogo   = "/planeicon.svg";

const ChevronDown = ({ size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const LuggageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="7" width="12" height="14" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 4 0v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
);

const CabinBagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="13" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

// ─── Static Data ──────────────────────────────────────────────────────────────
const FARE_RULES = [
  {
    label: "Time Frame to cancel",
    sublabel: "Before scheduled departure time",
    column: "Airlines Fees\nper passenger",
    rows: [
      { desc: "Cancel Before 24 hours of departure time.", fee: "₹ 3,999" },
      { desc: "Cancel within 24 hours & before 4 hours of departure time.", fee: "₹ 4,999" },
    ],
  },
  {
    label: "Time Frame to reschedule",
    sublabel: "Before scheduled departure time",
    column: "Airlines Fees\nper passenger",
    rows: [
      { desc: "Reschedule before 24 hours of departure time.", fee: "₹ 2,999" },
      { desc: "Reschedule within 24 hours & before 4 hours of departure time.", fee: "₹ 2,999" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (date) =>
  date ? new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }) : "";

const newTraveller = (type) => ({
  id: Date.now() + Math.random(),
  title: type === "adults" ? "Mr." : "Mstr",
  firstName: "", lastName: "", email: "", mobile: "", countryCode: "+91",
  dob: "", nationality: "India",
});

// ─── Floating Label Input ─────────────────────────────────────────────────────
const labelStyle = {
  position: "absolute", top: -9, left: 10,
  fontSize: 11, color: "#6b7280", background: "#fff",
  padding: "0 4px", zIndex: 1, pointerEvents: "none",
};

// ─── GST Toggle ───────────────────────────────────────────────────────────────
function GSTToggle({ checked, onChange }) {
  return (
    <button type="button" onClick={onChange} aria-pressed={checked}
      style={{
        width: 40, height: 22, borderRadius: 999, flexShrink: 0,
        background: checked ? "#16a34a" : "#d1d5db",
        border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
      }}>
      <span style={{
        position: "absolute", top: 3, left: checked ? 20 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

// ─── Single Traveller Card ────────────────────────────────────────────────────
function TravellerCard({ type, data, index, total, onChange, onRemove }) {
  const titles = type === "adults" ? ["Mr.", "Mrs.", "Ms."] : ["Mstr", "Miss"];
  const labelMap = { adults: "Adult", children: "Child", infants: "Infant" };

  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: 12,
      padding: 20, marginTop: 12, background: "#fafafa",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: "#6b7280" }}>
          {labelMap[type]} {index + 1}
        </span>
        {total > 0 && (
          <button onClick={onRemove}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", gap: 4, fontSize: 13, padding: "2px 6px", borderRadius: 6 }}>
            <TrashIcon /> Remove
          </button>
        )}
      </div>

      {/* Title radios */}
      <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
        {titles.map((t) => (
          <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14, color: "#374151" }}>
            <input type="radio" name={`${type}-${data.id}-title`} value={t}
              checked={data.title === t}
              onChange={() => onChange({ ...data, title: t })}
              style={{ accentColor: "#16a34a" }} />
            {t}
          </label>
        ))}
      </div>

      {/* First + Last name */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="two-col">
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>First Name & Middle Name</label>
          <input className="input-field" placeholder="First Name & Middle Name"
            value={data.firstName}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })} />
        </div>
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>Last Name</label>
          <input className="input-field" placeholder="Last Name"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })} />
        </div>
      </div>

      {/* Adult-only fields */}
      {type === "adults" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="two-col">
            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Email (Optional)</label>
              <input className="input-field" placeholder="Email (Optional)" type="email"
                value={data.email}
                onChange={(e) => onChange({ ...data, email: e.target.value })} />
            </div>
            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Mobile Number (Optional)</label>
              <div style={{ display: "flex" }}>
                <select className="input-field"
                  style={{ width: 84, borderRadius: "8px 0 0 8px", borderRight: "none", background: "#f9fafb", paddingRight: 8 }}
                  value={data.countryCode}
                  onChange={(e) => onChange({ ...data, countryCode: e.target.value })}>
                  <option>+91</option><option>+1</option><option>+44</option><option>+971</option>
                </select>
                <input className="input-field" style={{ borderRadius: "0 8px 8px 0", flex: 1 }}
                  placeholder="Mobile Number" type="tel"
                  value={data.mobile}
                  onChange={(e) => onChange({ ...data, mobile: e.target.value })} />
              </div>
            </div>
          </div>
          <div style={{ position: "relative", maxWidth: "calc(50% - 7px)" }}>
            <label style={labelStyle}>Nationality</label>
            <select className="input-field" value={data.nationality}
              onChange={(e) => onChange({ ...data, nationality: e.target.value })}>
              {["India", "United States", "United Kingdom", "UAE", "Singapore"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </>
      )}

      {/* Child / Infant fields */}
      {(type === "children" || type === "infants") && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="two-col">
          <div style={{ position: "relative" }}>
            <label style={labelStyle}>Date of Birth</label>
            <input className="input-field" type="date"
              value={data.dob}
              onChange={(e) => onChange({ ...data, dob: e.target.value })} />
          </div>
          <div style={{ position: "relative" }}>
            <label style={labelStyle}>Nationality</label>
            <select className="input-field" value={data.nationality}
              onChange={(e) => onChange({ ...data, nationality: e.target.value })}>
              {["India", "United States", "United Kingdom", "UAE", "Singapore"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Traveller Group Section ──────────────────────────────────────────────────
function TravellerGroup({ type, label, ageLabel, icon, list, onChange, onAdd, onRemove }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {/* Group header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{label}</span>
          <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 6 }}>{ageLabel}</span>
        </div>
        <span style={{
          fontSize: 12, color: "#6b7280", background: "#f3f4f6",
          borderRadius: 999, padding: "2px 10px", fontWeight: 500,
        }}>
          {list.length} Added
        </span>
      </div>

      {/* Cards */}
      {list.map((traveller, idx) => (
        <TravellerCard
          key={traveller.id}
          type={type}
          data={traveller}
          index={idx}
          total={list.length}
          onChange={(updated) => onChange(type, traveller.id, updated)}
          onRemove={() => onRemove(type, traveller.id)}
        />
      ))}

      {/* Add more button — always shown */}
      <button className="add-btn" onClick={() => onAdd(type)}
        style={{ marginTop: 12 }}>
        <PlusIcon />
        Add {label.split(" ")[0]}
      </button>

      <div style={{ height: 1, background: "#f0f0f0", margin: "16px 0 0" }} />
    </div>
  );
}

// ─── Baggage Tab ──────────────────────────────────────────────────────────────
function BaggageTab({ segs }) {
  const fallback = [
    { Origin: { Airport: { AirportCode: "BOM" } }, Destination: { Airport: { AirportCode: "DED" } }, Baggage: "15 kg", CabinBaggage: "7 kg" },
    { Origin: { Airport: { AirportCode: "DED" } }, Destination: { Airport: { AirportCode: "DEL" } }, Baggage: "15 kg", CabinBaggage: "7 kg" },
  ];
  const data = segs.length > 0 ? segs : fallback;

  return (
    <div style={{ padding: "16px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {data.map((seg, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6 , display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={flightlogo} alt="" style={{ width: 18, height: 18 }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                {seg?.Origin?.Airport?.AirportCode} – {seg?.Destination?.Airport?.AirportCode}
              </span>
            </div>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#f9fafb", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#374151" }}>
                <span />
                <span style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}><LuggageIcon /> Check-in</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}><CabinBagIcon /> Cabin</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "10px 14px", fontSize: 13, color: "#374151", borderTop: "1px solid #e5e7eb" }}>
                <span style={{ fontWeight: 500 }}>Adult</span>
                <span style={{ textAlign: "center", fontWeight: 600 }}>{seg?.Baggage || "15 kg"}</span>
                <span style={{ textAlign: "center", fontWeight: 600 }}>{seg?.CabinBaggage || "7 kg"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookFlight() {
  const location = useLocation();
  const { flight, searchMeta } = location.state || {};

  const segs        = flight?.Segments?.[0] || [];
  const firstSeg    = segs[0];
  const lastSeg     = segs[segs.length - 1];
  const adultCount  = searchMeta?.passengers?.adults   || 2;
  const childCount  = searchMeta?.passengers?.children || 1;
  const infantCount = searchMeta?.passengers?.infants  || 1;
  const totalPassengers = adultCount + childCount + infantCount;

  // ── UI State ──
  const [flightExpanded, setFlightExpanded] = useState(true);
  const [activeTab,      setActiveTab]      = useState("fare");
  const [gstEnabled,     setGstEnabled]     = useState(false);

  // ── Travellers ──
  const [travellers, setTravellers] = useState({
    adults:   [],
    children: [],
    infants:  [],
  });

  const handleAdd = (type) => {
    setTravellers(prev => ({ ...prev, [type]: [...prev[type], newTraveller(type)] }));
  };

  const handleChange = (type, id, updated) => {
    setTravellers(prev => ({
      ...prev,
      [type]: prev[type].map(t => t.id === id ? updated : t),
    }));
  };

  const handleRemove = (type, id) => {
    setTravellers(prev => ({
      ...prev,
      [type]: prev[type].filter(t => t.id !== id),
    }));
  };

  // ── Contact ──
  const [contact, setContact] = useState({ countryCode: "+91", mobile: "8529637412", email: "" });

  // ── Billing ──
  const [billing, setBilling] = useState({ address: "", city: "", state: "", nationality: "India" });

  // ── GST ──
  const [gst, setGst] = useState({ company: "", number: "", address: "", city: "", state: "", nationality: "India" });

  // ── Fare ──
  const tax      = flight?.Fare?.Tax || 2946;
  const totalFare = flight?.Fare?.PublishedFare
    ? flight.Fare.PublishedFare * totalPassengers
    : 17945;

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f0f4fa", minHeight: "100vh", padding: "24px 0 64px" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .bk-wrap { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .bk-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
        @media (max-width: 860px) { .bk-grid { grid-template-columns: 1fr; } }
        .card { background: #fff; border-radius: 14px; box-shadow: 0 1px 10px rgba(0,0,0,0.07); overflow: hidden; }
        .card + .card { margin-top: 16px; }
        .input-field {
          width: 100%; border: 1px solid #d1d5db; border-radius: 8px;
          padding: 11px 14px; font-size: 14px; color: #374151;
          outline: none; font-family: inherit; transition: border-color 0.2s; background: #fff;
        }
        .input-field:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.08); }
        .input-field::placeholder { color: #9ca3af; }
        select.input-field {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='4 6 8 10 12 6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
        }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 13px 0; font-family: inherit; font-size: 14px; transition: color 0.15s; }
        .tab-active { border-bottom: 2px solid #16a34a; color: #16a34a; font-weight: 600; }
        .tab-inactive { border-bottom: 2px solid transparent; color: #6b7280; font-weight: 400; }
        .add-btn {
          background: none; border: 1px dashed #16a34a; cursor: pointer;
          font-family: inherit; color: #16a34a; font-size: 13px; font-weight: 600;
          padding: 8px 16px; border-radius: 8px;
          display: inline-flex; align-items: center; gap: 6px;
          transition: background 0.15s;
        }
        .add-btn:hover { background: #f0fdf4; }
        .section-hdr { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; }
        .section-hdr h3 { font-size: 16px; font-weight: 700; color: #111827; }
        .section-hdr p { font-size: 13px; color: #6b7280; margin-top: 2px; }
        .fare-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; font-size: 14px; color: #374151; }
        .fare-row + .fare-row { border-top: 1px solid #f3f4f6; }
        .timeline-dot { width: 8px; height: 8px; border-radius: 50%; border: 2px solid #9ca3af; background: #fff; flex-shrink: 0; }
        .timeline-line { flex: 1; height: 2px; background: #d1d5db; }
        .layover-badge { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
        .layover-badge::before, .layover-badge::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
        .layover-badge span { font-size: 12px; color: #92400e; background: #fef3c7; border: 1px solid #fde68a; border-radius: 999px; padding: 3px 14px; font-weight: 500; white-space: nowrap; }
        .rule-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .rule-table th { text-align: left; font-weight: 700; color: #111827; padding: 12px 16px; background: #f3f4f6; }
        .rule-table th:last-child { text-align: right; }
        .rule-table td { padding: 11px 16px; color: #374151; border-top: 1px solid #f0f0f0; }
        .rule-table td:last-child { text-align: right; font-weight: 600; color: #111827; }
        .seg-grid { display: grid; grid-template-columns: 160px 1fr 1fr; gap: 12px; align-items: center; padding: 18px 20px 14px; }
        @media (max-width: 580px) {
          .seg-grid { grid-template-columns: 1fr; }
          .two-col { grid-template-columns: 1fr !important; }
        }
        /* bottom add-passenger strip */
        .add-strip {
          display: flex; gap: 10px; flex-wrap: wrap;
          padding: 14px 20px; background: #f9fafb;
          border-top: 1px solid #f0f0f0;
        }
        .add-strip-btn {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1.5px solid #16a34a; border-radius: 8px;
          background: #fff; color: #16a34a; font-size: 13px; font-weight: 600;
          padding: 8px 16px; cursor: pointer; font-family: inherit; transition: background 0.15s;
        }
        .add-strip-btn:hover { background: #f0fdf4; }
      `}</style>

      <div className="bk-wrap">
        <div className="bk-grid">

          {/* ══════ LEFT ══════ */}
          <div>

            {/* ── Flight Card ── */}
            <div className="card">
              {/* Collapsible header */}
              <div
                onClick={() => setFlightExpanded(v => !v)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px", cursor: "pointer",
                  borderBottom: flightExpanded ? "1px solid #f3f4f6" : "none",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 10,  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src={flightlogo} alt="Flight" style={{ width: 30, height: 30  }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
                      {firstSeg?.Origin?.Airport?.CityName || "New Delhi"} to{" "}
                      {lastSeg?.Destination?.Airport?.CityName || "Mumbai"}
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
                      {formatDate(firstSeg?.Origin?.DepTime) || "Sun, Feb 08"} •{" "}
                      {firstSeg?.Airline?.AirlineName || "Indigo"} •{" "}
                      {Math.floor((lastSeg?.AccumulatedDuration || 135) / 60)}h{" "}
                      {(lastSeg?.AccumulatedDuration || 135) % 60}m •{" "}
                      {segs.length > 1 ? `${segs.length - 1} Stop${segs.length - 1 !== 1 ? "s" : ""}` : "Non-stop"}
                    </div>
                  </div>
                </div>
                <ChevronDown size={20} style={{ color: "#6b7280", transition: "transform 0.25s", transform: flightExpanded ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
              </div>

              {flightExpanded && (
                <>
                  {/* Segments */}
                  {(segs.length > 0 ? segs : [null]).map((seg, idx) => (
                    <div key={idx}>
                      <div className="seg-grid">
                        {/* Airline */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8 , display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <img src={flightlogo} alt="" style={{ width: 22, height: 22  }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a56db" }}>
                              {seg?.Airline?.AirlineName || "IndiGo"} · {seg?.Airline?.AirlineCode || "6E"}-{seg?.Airline?.FlightNumber || "5032"}
                            </div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{seg?.Craft || "Airbus 3260"}</div>
                          </div>
                        </div>

                        {/* Departure */}
                        <div>
                          <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>
                            {formatTime(seg?.Origin?.DepTime) || "16:05"}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 3 }}>
                            {seg?.Origin?.Airport?.CityName || "Mumbai"} ({seg?.Origin?.Airport?.AirportCode || "BOM"})
                          </div>
                          <div style={{ fontSize: 12, color: "#9ca3af" }}>
                            {seg?.Origin?.Airport?.AirportName || "Chatrapati Shivaji Airport, Terminal 2"}
                          </div>
                        </div>

                        {/* Timeline + Arrival */}
                        <div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>
                              {Math.floor((seg?.Duration || 135) / 60)}h {(seg?.Duration || 135) % 60}m
                            </span>
                            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                              <div className="timeline-dot" />
                              <div className="timeline-line" />
                              <img src={planlogo} alt="" style={{ width: 18, height: 18, flexShrink: 0 }} />
                              <div className="timeline-line" />
                              <div className="timeline-dot" />
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>
                              {formatTime(seg?.Destination?.ArrTime) || "18:20"}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 3 }}>
                              {seg?.Destination?.Airport?.CityName || "Dehradun"} ({seg?.Destination?.Airport?.AirportCode || "DED"})
                            </div>
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>
                              {seg?.Destination?.Airport?.AirportName || "Jolly Grant Airport, Terminal 1"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Layover */}
                      {seg?.GroundTime > 0 && idx < segs.length - 1 && (
                        <div style={{ padding: "0 20px" }}>
                          <div className="layover-badge">
                            <span>{Math.floor(seg.GroundTime / 60)}h {seg.GroundTime % 60}m Layover at {seg?.Destination?.Airport?.CityName}</span>
                          </div>
                        </div>
                      )}
                      {idx < segs.length - 1 && <div style={{ height: 1, background: "#f3f4f6", margin: "0 20px" }} />}
                    </div>
                  ))}

                  {/* Tabs */}
                  <div style={{ borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: 24, padding: "0 20px", borderBottom: "1px solid #f3f4f6" }}>
                      {["fare", "baggage"].map(tab => (
                        <button key={tab} className={`tab-btn ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
                          onClick={() => setActiveTab(tab)}>
                          {tab === "fare" ? "Fare Rules" : "Baggage"}
                        </button>
                      ))}
                    </div>

                    {activeTab === "fare" && (
                      <div style={{ padding: "12px 0" }}>
                        {FARE_RULES.map((group, gi) => (
                          <div key={gi} style={{ marginBottom: gi < FARE_RULES.length - 1 ? 10 : 0 }}>
                            <table className="rule-table">
                              <thead>
                                <tr>
                                  <th style={{ width: "60%" }}>
                                    <div>{group.label}</div>
                                    <div style={{ fontWeight: 400, fontSize: 12, color: "#6b7280", marginTop: 2 }}>{group.sublabel}</div>
                                  </th>
                                  <th><div style={{ whiteSpace: "pre-line", textAlign: "right" }}>{group.column}</div></th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.rows.map((row, ri) => (
                                  <tr key={ri}><td>{row.desc}</td><td>{row.fee}</td></tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "baggage" && <BaggageTab segs={segs} />}
                  </div>
                </>
              )}
            </div>

            {/* ── Travellers Details ── */}
            <div className="card">
              <div className="section-hdr" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Travellers Details</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
                  <UserIcon />
                  <span>Name should match Government ID proof</span>
                </div>
              </div>

              <div style={{ padding: "20px 20px 8px" }}>
                {/* Adult group */}
                <TravellerGroup
                  type="adults"
                  label="Adult"
                  ageLabel="(12+ yrs)"
                  list={travellers.adults}
                  onChange={handleChange}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />

                {/* Child group */}
                <div style={{ marginTop: 16 }}>
                  <TravellerGroup
                    type="children"
                    label="Child"
                    ageLabel="(2-12 yrs)"
                    list={travellers.children}
                    onChange={handleChange}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                  />
                </div>

                {/* Infant group */}
                <div style={{ marginTop: 16 }}>
                  <TravellerGroup
                    type="infants"
                    label="Infant"
                    ageLabel="(0-2 yrs)"
                    list={travellers.infants}
                    onChange={handleChange}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                  />
                </div>
              </div>

              {/* ── Bottom strip: quick-add buttons ── */}
              <div className="add-strip">
                <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, alignSelf: "center", marginRight: 4 }}>Add passenger:</span>
                <button className="add-strip-btn" onClick={() => handleAdd("adults")}>
                  <PlusIcon /> Adult
                </button>
                <button className="add-strip-btn" onClick={() => handleAdd("children")}>
                  <PlusIcon /> Child
                </button>
                <button className="add-strip-btn" onClick={() => handleAdd("infants")}>
                  <PlusIcon /> Infant
                </button>
              </div>
            </div>

            {/* ── Contact Information ── */}
            <div className="card">
              <div className="section-hdr">
                <h3>Contact Information</h3>
                <p>Your ticket &amp; Flight details will be shared here</p>
              </div>
              <div style={{ padding: 20 }}>
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>Mobile Number</label>
                    <div style={{ display: "flex" }}>
                      <select className="input-field"
                        style={{ width: 84, borderRadius: "8px 0 0 8px", borderRight: "none", background: "#f9fafb", paddingRight: 8 }}
                        value={contact.countryCode}
                        onChange={(e) => setContact(p => ({ ...p, countryCode: e.target.value }))}>
                        <option>+91</option><option>+1</option><option>+44</option><option>+971</option>
                      </select>
                      <input className="input-field" style={{ borderRadius: "0 8px 8px 0", flex: 1 }}
                        placeholder="Mobile Number" type="tel"
                        value={contact.mobile}
                        onChange={(e) => setContact(p => ({ ...p, mobile: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>Email Address</label>
                    <input className="input-field" placeholder="Email Address" type="email"
                      value={contact.email}
                      onChange={(e) => setContact(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Billing Information ── */}
            <div className="card">
              <div className="section-hdr">
                <h3>Billing Information</h3>
                <p>Your ticket &amp; Flight details will be shared here</p>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ marginBottom: 14, position: "relative" }}>
                  <label style={labelStyle}>Address</label>
                  <input className="input-field" placeholder="Address"
                    value={billing.address}
                    onChange={(e) => setBilling(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>City</label>
                    <input className="input-field" placeholder="City"
                      value={billing.city}
                      onChange={(e) => setBilling(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>State</label>
                    <input className="input-field" placeholder="State"
                      value={billing.state}
                      onChange={(e) => setBilling(p => ({ ...p, state: e.target.value }))} />
                  </div>
                </div>
                <div style={{ maxWidth: "calc(50% - 7px)", position: "relative" }}>
                  <label style={labelStyle}>Nationality</label>
                  <select className="input-field" value={billing.nationality}
                    onChange={(e) => setBilling(p => ({ ...p, nationality: e.target.value }))}>
                    {["India", "United States", "United Kingdom", "UAE", "Singapore"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ── GST Details ── */}
            <div className="card">
              <div className="section-hdr">
                <h3>GST Details</h3>
                <p>Use GST number to avail GST Benefits &amp; additional savings</p>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <GSTToggle checked={gstEnabled} onChange={() => setGstEnabled(v => !v)} />
                  <span style={{ fontSize: 14, color: "#374151" }}>I would like to add my GST Number</span>
                </div>

                {gstEnabled && (
                  <div style={{ marginTop: 18 }}>
                    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <div style={{ position: "relative" }}>
                        <label style={labelStyle}>Company Name</label>
                        <input className="input-field" placeholder="Company Name" value={gst.company} onChange={(e) => setGst(p => ({ ...p, company: e.target.value }))} />
                      </div>
                      <div style={{ position: "relative" }}>
                        <label style={labelStyle}>GST Number</label>
                        <input className="input-field" placeholder="GST Number" value={gst.number} onChange={(e) => setGst(p => ({ ...p, number: e.target.value }))} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 14, position: "relative" }}>
                      <label style={labelStyle}>Address</label>
                      <input className="input-field" placeholder="Address" value={gst.address} onChange={(e) => setGst(p => ({ ...p, address: e.target.value }))} />
                    </div>
                    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <div style={{ position: "relative" }}>
                        <label style={labelStyle}>City</label>
                        <input className="input-field" placeholder="City" value={gst.city} onChange={(e) => setGst(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div style={{ position: "relative" }}>
                        <label style={labelStyle}>State</label>
                        <input className="input-field" placeholder="State" value={gst.state} onChange={(e) => setGst(p => ({ ...p, state: e.target.value }))} />
                      </div>
                    </div>
                    <div style={{ maxWidth: "calc(50% - 7px)", position: "relative" }}>
                      <label style={labelStyle}>Nationality</label>
                      <select className="input-field" value={gst.nationality} onChange={(e) => setGst(p => ({ ...p, nationality: e.target.value }))}>
                        {["India", "United States", "United Kingdom", "UAE", "Singapore"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
          {/* ══════ END LEFT ══════ */}

          {/* ══════ RIGHT — Fare Summary ══════ */}
          <div style={{ position: "sticky", top: 24 }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Fare Summary</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  {travellers.adults.length + travellers.children.length + travellers.infants.length || totalPassengers} Traveller(s)
                </span>
              </div>

              <div style={{ padding: "8px 0" }}>
                <div className="fare-row">
                  <span style={{ color: "#6b7280" }}>Fare Type</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>
                    {flight?.IsRefundable ? "Refundable" : "Partial Refundable"}
                  </span>
                </div>
                {adultCount > 0 && (
                  <div className="fare-row">
                    <span>Adult × {adultCount}</span>
                    <span style={{ fontWeight: 600 }}>₹{(8666).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {childCount > 0 && (
                  <div className="fare-row">
                    <span>Child × {childCount}</span>
                    <span style={{ fontWeight: 600 }}>₹{(4333).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {infantCount > 0 && (
                  <div className="fare-row">
                    <span>Infant × {infantCount}</span>
                    <span style={{ fontWeight: 600 }}>₹{(2000).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="fare-row">
                  <span>Taxes &amp; Fees</span>
                  <span style={{ fontWeight: 600 }}>₹{tax.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "#f9fafb", borderTop: "2px solid #e5e7eb" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Net Amount Payable</span>
                <span style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}>₹{totalFare.toLocaleString("en-IN")}</span>
              </div>

              <div style={{ padding: "16px 20px" }}>
                <button
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 10,
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#fff", fontSize: 15, fontWeight: 700, border: "none",
                    cursor: "pointer", boxShadow: "0 2px 12px rgba(22,163,74,0.3)", transition: "opacity 0.15s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}>
                  Proceed to Payment
                </button>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Secured &amp; Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
          {/* ══════ END RIGHT ══════ */}

        </div>
      </div>
    </div>
  );
}