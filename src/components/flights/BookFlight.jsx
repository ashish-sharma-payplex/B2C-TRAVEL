import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFareRule } from "../../hooks/flighthooks/useFareRule";
import { useFareQuote } from "../../hooks/flighthooks/useFareQuote";


// ─── SVG Icons ────────────────────────────────────────────────────────────────
const flightlogo = "/bookflighticon.svg";
const planlogo = "/planeicon.svg";

const ChevronDown = ({ size = 16, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const TrashIcon = () => (
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PlusIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const LuggageIcon = () => (
  <svg
    width="15"
    height="15"
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

const CabinBagIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="13" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

// ─── Static Fallback Fare Rules ───────────────────────────────────────────────
const FARE_RULES_FALLBACK = [
  {
    label: "Time Frame to cancel",
    sublabel: "Before scheduled departure time",
    column: "Airlines Fees\nper passenger",
    rows: [
      { desc: "Cancel Before 24 hours of departure time.", fee: "₹ 3,999" },
      {
        desc: "Cancel within 24 hours & before 4 hours of departure time.",
        fee: "₹ 4,999",
      },
    ],
  },
  {
    label: "Time Frame to reschedule",
    sublabel: "Before scheduled departure time",
    column: "Airlines Fees\nper passenger",
    rows: [
      { desc: "Reschedule before 24 hours of departure time.", fee: "₹ 2,999" },
      {
        desc: "Reschedule within 24 hours & before 4 hours of departure time.",
        fee: "₹ 2,999",
      },
    ],
  },
];

// ─── Validation helpers ───────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^\d{10}$/;

const noLeadingSpaces = (val) => val.replace(/^\s+/, "");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (date) =>
  date
    ? new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    : "--";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    : "";

const newTraveller = (type) => ({
  id: Date.now() + Math.random(),
  title: type === "adults" ? "Mr" : "Mstr",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  countryCode: "+91",
  dob: "",
  nationality: "India",
});

const buildInitialTravellers = (passengers) => {
  const adults = passengers?.adults || 1;
  const children = passengers?.children || 0;
  const infants = passengers?.infants || 0;
  return {
    adults: Array.from({ length: adults }, () => newTraveller("adults")),
    children: Array.from({ length: children }, () => newTraveller("children")),
    infants: Array.from({ length: infants }, () => newTraveller("infants")),
  };
};

const labelStyle = {
  position: "absolute",
  top: -9,
  left: 10,
  fontSize: 11,
  color: "#6b7280",
  background: "#fff",
  padding: "0 4px",
  zIndex: 1,
  pointerEvents: "none",
};

const errStyle = {
  fontSize: 11,
  color: "#dc2626",
  marginTop: 4,
  display: "block",
};

// ─── UPDATED validateTraveller — email & mobile now required for adults ───────
const validateTraveller = (type, data) => {
  const errs = {};
  if (!data.firstName.trim()) errs.firstName = "First name is required";
  if (!data.lastName.trim()) errs.lastName = "Last name is required";
  if (type === "adults") {
    if (!data.email || !data.email.trim()) {
      errs.email = "Email is required";
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      errs.email = "Enter a valid email address";
    }
    if (!data.mobile) {
      errs.mobile = "Mobile number is required";
    } else if (!MOBILE_REGEX.test(data.mobile)) {
      errs.mobile = "Mobile number must be exactly 10 digits";
    }
  }
  if (type === "children" || type === "infants") {
    if (!data.dob) errs.dob = "Date of birth is required";
  }
  return errs;
};

// ─── GST Toggle ───────────────────────────────────────────────────────────────
function GSTToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      style={{
        width: 40,
        height: 22,
        borderRadius: 999,
        flexShrink: 0,
        background: checked ? "#16a34a" : "#d1d5db",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 20 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

// ─── Single Traveller Card ────────────────────────────────────────────────────
function TravellerCard({
  type,
  data,
  index,
  total,
  onChange,
  onRemove,
  errors,
  showErrors,
}) {
  const titles = type === "adults" ? ["Mr", "Mrs", "Ms"] : ["Mstr", "Miss"];
  const labelMap = { adults: "Adult", children: "Child", infants: "Infant" };

  const handleText = (field, val) => {
    onChange({ ...data, [field]: noLeadingSpaces(val) });
  };

  const handleMobile = (val) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 10);
    onChange({ ...data, mobile: digitsOnly });
  };

  const fieldErr = (field) =>
    showErrors && errors?.[field] ? (
      <span style={errStyle}>⚠ {errors[field]}</span>
    ) : null;

  return (
    <div
      style={{
        border: `1px solid ${showErrors && Object.keys(errors || {}).length > 0 ? "#fca5a5" : "#e5e7eb"}`,
        borderRadius: 12,
        padding: 20,
        marginTop: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
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
        <span style={{ fontWeight: 600, fontSize: 13, color: "#6b7280" }}>
          {labelMap[type]} {index + 1}
        </span>
        {total > 1 && (
          <button
            onClick={onRemove}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              padding: "2px 6px",
              borderRadius: 6,
            }}
          >
            <TrashIcon /> Remove
          </button>
        )}
      </div>

      <div
        style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}
      >
        {titles.map((t) => (
          <label
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              fontSize: 14,
              color: "#374151",
            }}
          >
            <input
              type="radio"
              name={`${type}-${data.id}-title`}
              value={t}
              checked={data.title === t}
              onChange={() => onChange({ ...data, title: t })}
              style={{ accentColor: "#16a34a" }}
            />
            {t}
          </label>
        ))}
      </div>

      {/* Name fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
        className="two-col"
      >
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>First Name & Middle Name *</label>
          <input
            className={`input-field${showErrors && errors?.firstName ? " input-err" : ""}`}
            placeholder="First Name & Middle Name"
            value={data.firstName}
            onChange={(e) => handleText("firstName", e.target.value)}
          />
          {fieldErr("firstName")}
        </div>
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>Last Name *</label>
          <input
            className={`input-field${showErrors && errors?.lastName ? " input-err" : ""}`}
            placeholder="Last Name"
            value={data.lastName}
            onChange={(e) => handleText("lastName", e.target.value)}
          />
          {fieldErr("lastName")}
        </div>
      </div>

      {/* Adults — email & mobile now REQUIRED */}
      {type === "adults" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
            className="two-col"
          >
            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Email *</label>
              <input
                className={`input-field${showErrors && errors?.email ? " input-err" : ""}`}
                placeholder="Email Address"
                type="email"
                value={data.email}
                onChange={(e) => handleText("email", e.target.value)}
              />
              {fieldErr("email")}
            </div>
            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Mobile Number *</label>
              <div style={{ display: "flex" }}>
                <select
                  className="input-field"
                  style={{
                    width: 84,
                    borderRadius: "8px 0 0 8px",
                    borderRight: "none",
                    background: "#f9fafb",
                    paddingRight: 8,
                  }}
                  value={data.countryCode}
                  onChange={(e) =>
                    onChange({ ...data, countryCode: e.target.value })
                  }
                >
                  <option>+91</option>
                  <option>+1</option>
                  <option>+44</option>
                  <option>+971</option>
                </select>
                <input
                  className={`input-field${showErrors && errors?.mobile ? " input-err" : ""}`}
                  style={{ borderRadius: "0 8px 8px 0", flex: 1 }}
                  placeholder="10-digit number"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={data.mobile}
                  onChange={(e) => handleMobile(e.target.value)}
                />
              </div>
              {fieldErr("mobile")}
            </div>
          </div>
          <div style={{ position: "relative", maxWidth: "calc(50% - 7px)" }}>
            <label style={labelStyle}>Nationality</label>
            <input
              className="input-field"
              value="India"
              readOnly
              style={{
                background: "#f9fafb",
                cursor: "default",
                color: "#374151",
              }}
            />
          </div>
        </>
      )}

      {(type === "children" || type === "infants") && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          className="two-col"
        >
          <div style={{ position: "relative" }}>
            <label style={labelStyle}>Date of Birth *</label>
            <input
              className={`input-field${showErrors && errors?.dob ? " input-err" : ""}`}
              type="date"
              value={data.dob}
              onChange={(e) => onChange({ ...data, dob: e.target.value })}
            />
            {fieldErr("dob")}
          </div>
          <div style={{ position: "relative" }}>
            <label style={labelStyle}>Nationality</label>
            <input
              className="input-field"
              value="India"
              readOnly
              style={{
                background: "#f9fafb",
                cursor: "default",
                color: "#374151",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Traveller Group Section ──────────────────────────────────────────────────
function TravellerGroup({
  type,
  label,
  ageLabel,
  list,
  onChange,
  onAdd,
  onRemove,
  allErrors,
  showErrors,
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
            {label}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 6 }}>
            {ageLabel}
          </span>
        </div>
        <span
          style={{
            fontSize: 12,
            color: "#6b7280",
            background: "#f3f4f6",
            borderRadius: 999,
            padding: "2px 10px",
            fontWeight: 500,
          }}
        >
          {list.length} Added
        </span>
      </div>

      {list.map((traveller, idx) => (
        <TravellerCard
          key={traveller.id}
          type={type}
          data={traveller}
          index={idx}
          total={list.length}
          onChange={(updated) => onChange(type, traveller.id, updated)}
          onRemove={() => onRemove(type, traveller.id)}
          errors={allErrors?.[traveller.id]}
          showErrors={showErrors}
        />
      ))}
    </div>
  );
}

// ─── Baggage Tab ──────────────────────────────────────────────────────────────
function BaggageTab({ segs }) {
  const hasBaggageData = segs.some((seg) => seg?.Baggage || seg?.CabinBaggage);

  if (segs.length > 0 && !hasBaggageData) {
    return (
      <div
        style={{
          padding: "16px 20px",
          color: "#9ca3af",
          fontSize: 13,
          textAlign: "center",
        }}
      >
        Baggage information not available for this fare.
      </div>
    );
  }

  const displayData =
    segs.length > 0
      ? segs
      : [
        {
          Origin: { Airport: { AirportCode: "BOM" } },
          Destination: { Airport: { AirportCode: "DED" } },
          Baggage: "15 kg",
          CabinBaggage: "7 kg",
        },
        {
          Origin: { Airport: { AirportCode: "DED" } },
          Destination: { Airport: { AirportCode: "DEL" } },
          Baggage: "15 kg",
          CabinBaggage: "7 kg",
        },
      ];

  return (
    <div style={{ padding: "16px 20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {displayData.map((seg, i) => (
          <div key={i}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={flightlogo}
                  alt=""
                  style={{ width: 18, height: 18 }}
                />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                {seg?.Origin?.Airport?.AirportCode} –{" "}
                {seg?.Destination?.Airport?.AirportCode}
              </span>
            </div>
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  background: "#f9fafb",
                  padding: "10px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                <span />
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    justifyContent: "center",
                  }}
                >
                  <LuggageIcon /> Check-in
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    justifyContent: "center",
                  }}
                >
                  <CabinBagIcon /> Cabin
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#374151",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontWeight: 500 }}>Adult</span>
                <span style={{ textAlign: "center", fontWeight: 600 }}>
                  {seg?.Baggage || "15 kg"}
                </span>
                <span style={{ textAlign: "center", fontWeight: 600 }}>
                  {seg?.CabinBaggage || "7 kg"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Render Content by Type ────────────────────────────────────────────────
function renderContentByType(item, idx) {
  switch (item.type) {
    case "text":
      return (
        <tr key={idx}>
          <td
            colSpan={2}
            style={{
              fontSize: 13,
              color: "#374151",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {item.content}
          </td>
        </tr>
      );
    case "list":
      return (
        <tr key={idx}>
          <td colSpan={2} style={{ fontSize: 13, color: "#374151" }}>
            {item.title && (
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 8,
                  color: "#111827",
                  marginTop: idx > 0 ? 8 : 0,
                }}
              >
                {item.title}
              </div>
            )}
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              {item.items?.map((point, pi) => (
                <li key={pi} style={{ marginBottom: 4 }}>
                  {point}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      );
    case "notes":
      return (
        <tr key={idx}>
          <td colSpan={2}>
            <div
              style={{
                background: "#fef3c7",
                border: "1px solid #fde68a",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 13,
                color: "#92400e",
                marginTop: idx > 0 ? 8 : 0,
                lineHeight: 1.6,
              }}
            >
              {item.title && (
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  ⚠️ {item.title}
                </div>
              )}
              <div>{item.content || item.text}</div>
            </div>
          </td>
        </tr>
      );
    case "table":
      return (
        <tr key={idx}>
          <td colSpan={2} style={{ padding: 0 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
                marginTop: idx > 0 ? 8 : 0,
              }}
            >
              {item.header && (
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    {item.header.map((col, ci) => (
                      <th
                        key={ci}
                        style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#111827",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {item.rows?.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    {Array.isArray(row) ? (
                      row.map((cell, ci) => (
                        <td
                          key={ci}
                          style={{ padding: "8px 12px", color: "#374151" }}
                        >
                          {cell}
                        </td>
                      ))
                    ) : (
                      <td style={{ padding: "8px 12px", color: "#374151" }}>
                        {row}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      );
    case "heading":
      return (
        <tr key={idx}>
          <td
            colSpan={2}
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
              paddingTop: idx > 0 ? 12 : 0,
              paddingBottom: 6,
            }}
          >
            {item.content}
          </td>
        </tr>
      );
    case "divider":
      return (
        <tr key={idx}>
          <td colSpan={2} style={{ padding: "8px 0" }}>
            <div style={{ height: 1, background: "#e5e7eb" }} />
          </td>
        </tr>
      );
    default:
      return (
        <tr key={idx}>
          <td
            colSpan={2}
            style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}
          >
            {item.content || item.text || JSON.stringify(item)}
          </td>
        </tr>
      );
  }
}

// ─── Fare Rule Tab ────────────────────────────────────────────────────────
function FareRuleTab({ fareRuleData, fareLoading }) {
  if (fareLoading) {
    return (
      <div style={{ padding: "24px 20px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#6b7280",
            fontSize: 13,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading fare rules...
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (fareRuleData?.FareRules?.length > 0) {
    return (
      <div style={{ padding: "12px 0" }}>
        {fareRuleData.FareRules.map((rule, ri) => (
          <div
            key={ri}
            style={{
              marginBottom: ri < fareRuleData.FareRules.length - 1 ? 10 : 0,
            }}
          >
            <table className="rule-table">
              <thead>
                <tr>
                  <th style={{ width: "70%" }}>
                    <div>
                      {rule.Origin} → {rule.Destination}
                    </div>
                    <div
                      style={{
                        fontWeight: 400,
                        fontSize: 12,
                        color: "#6b7280",
                        marginTop: 2,
                      }}
                    >
                      {rule.Airline}
                    </div>
                  </th>
                  <th>
                    <div style={{ whiteSpace: "pre-line", textAlign: "right" }}>
                      Airlines Fees{"\n"}per passenger
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(rule.FareRuleDetail) ? (
                  rule.FareRuleDetail.map((item, idx) =>
                    renderContentByType(item, idx),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      style={{
                        whiteSpace: "pre-line",
                        lineHeight: 1.7,
                        fontSize: 13,
                        color: "#374151",
                      }}
                    >
                      {rule.FareRuleDetail}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 0" }}>
      {FARE_RULES_FALLBACK.map((group, gi) => (
        <div
          key={gi}
          style={{ marginBottom: gi < FARE_RULES_FALLBACK.length - 1 ? 10 : 0 }}
        >
          <table className="rule-table">
            <thead>
              <tr>
                <th style={{ width: "60%" }}>
                  <div>{group.label}</div>
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: 12,
                      color: "#6b7280",
                      marginTop: 2,
                    }}
                  >
                    {group.sublabel}
                  </div>
                </th>
                <th>
                  <div style={{ whiteSpace: "pre-line", textAlign: "right" }}>
                    {group.column}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row, ri) => (
                <tr key={ri}>
                  <td>{row.desc}</td>
                  <td>{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ─── Flight Card ──────────────────────────────────────────────────────────────
function FlightCard({
  flight,
  legLabel,
  expanded,
  onToggle,
  activeTab,
  onTabChange,
  fareRuleData,
  fareLoading,
}) {
  const segs = flight?.Segments?.[0] || [];
  const firstSeg = segs[0];
  const lastSeg = segs[segs.length - 1];

  return (
    <div className="card">
      {legLabel && (
        <div
          style={{
            padding: "10px 20px",
            fontSize: 12,
            fontWeight: 700,
            color: "#16a34a",
            background: "#f0fdf4",
            borderBottom: "1px solid #f3f4f6",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {legLabel}
        </div>
      )}

      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          cursor: "pointer",
          borderBottom: expanded ? "1px solid #f3f4f6" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={flightlogo}
              alt="Flight"
              style={{ width: 30, height: 30 }}
            />
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
              {segs.length > 1
                ? `${segs.length - 1} Stop${segs.length - 1 !== 1 ? "s" : ""}`
                : "Non-stop"}
            </div>
          </div>
        </div>
        <ChevronDown
          size={20}
          style={{
            color: "#6b7280",
            transition: "transform 0.25s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </div>

      {expanded && (
        <>
          {(segs.length > 0 ? segs : [null]).map((seg, idx) => (
            <div key={idx}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: 0,
                  alignItems: "center",
                  padding: "18px 20px 14px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={flightlogo}
                      alt=""
                      style={{ width: 22, height: 22 }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1a56db",
                        lineHeight: 1.4,
                      }}
                    >
                      {seg?.Airline?.AirlineName || "IndiGo"}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#1a56db", marginTop: 1 }}
                    >
                      {seg?.Airline?.AirlineCode || "6E"}-
                      {seg?.Airline?.FlightNumber || "5032"}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}
                    >
                      {seg?.Craft || "Airbus 3260"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    marginRight: 24,
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#111827",
                        lineHeight: 1.1,
                      }}
                    >
                      {formatTime(seg?.Origin?.DepTime) || "16:05"}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        marginTop: 3,
                      }}
                    >
                      {seg?.Origin?.Airport?.CityName || "Mumbai"} (
                      {seg?.Origin?.Airport?.AirportCode || "BOM"})
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        marginTop: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      {seg?.Origin?.Airport?.AirportName ||
                        "Chatrapati Shivaji Airport, Terminal 2"}
                    </div>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 80,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        marginBottom: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {Math.floor((seg?.Duration || 135) / 60)}h{" "}
                      {(seg?.Duration || 135) % 60}m
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div className="timeline-dot" />
                      <div className="timeline-line" />
                      <img
                        src={planlogo}
                        alt=""
                        style={{
                          width: 28,
                          height: 28,
                          flexShrink: 0,
                          opacity: 1,
                          margin: "0 6px",
                        }}
                      />
                      <div className="timeline-line" />
                      <div className="timeline-dot" />
                    </div>
                  </div>

                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#111827",
                        lineHeight: 1.1,
                      }}
                    >
                      {formatTime(seg?.Destination?.ArrTime) || "18:20"}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        marginTop: 3,
                      }}
                    >
                      {seg?.Destination?.Airport?.CityName || "Dehradun"} (
                      {seg?.Destination?.Airport?.AirportCode || "DED"})
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        marginTop: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      {seg?.Destination?.Airport?.AirportName ||
                        "Jolly Grant Airport, Terminal 1"}
                    </div>
                  </div>
                </div>
              </div>

              {idx < segs.length - 1 && (
                <div style={{ padding: "0 20px" }}>
                  <div className="layover-badge">
                    <span>
                      {seg?.GroundTime
                        ? `${Math.floor(seg.GroundTime / 60)}h ${seg.GroundTime % 60}m Layover at ${seg?.Destination?.Airport?.CityName}`
                        : `Layover at ${seg?.Destination?.Airport?.CityName}`}
                    </span>
                  </div>
                </div>
              )}
              {idx < segs.length - 1 && (
                <div
                  style={{ height: 1, background: "#f3f4f6", margin: "0 20px" }}
                />
              )}
            </div>
          ))}

          <div style={{ borderTop: "1px solid #f3f4f6" }}>
            <div
              style={{
                display: "flex",
                gap: 24,
                padding: "0 20px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              {["fare", "baggage"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabChange(tab);
                  }}
                >
                  {tab === "fare" ? "Fare Rules" : "Baggage"}
                </button>
              ))}
            </div>
            {activeTab === "fare" && (
              <FareRuleTab
                fareRuleData={fareRuleData}
                fareLoading={fareLoading}
              />
            )}
            {activeTab === "baggage" && <BaggageTab segs={segs} />}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookFlight() {
  const location = useLocation();
  const { flight, onwardFlight, returnFlight, searchMeta } =
    location.state || {};

  const isRoundTrip = !!(onwardFlight && returnFlight);
  const onwardF = isRoundTrip ? onwardFlight : flight;
  const returnF = isRoundTrip ? returnFlight : null;

  const adultCount = searchMeta?.passengers?.adults ?? 1;
  const childCount = searchMeta?.passengers?.children ?? 0;
  const infantCount = searchMeta?.passengers?.infants ?? 0;
  const totalPassengers = adultCount + childCount + infantCount;

  // ── Hooks ──
  const {
    onwardFareRule,
    returnFareRule,
    loading: fareLoading,
    fetchFareRule,
  } = useFareRule();
  const {
    onwardFareQuote,
    returnFareQuote,
    loading: fareQuoteLoading,
    fetchFareQuote,
  } = useFareQuote();

  useEffect(() => {
    if (searchMeta?.traceId && onwardF?.ResultIndex) {
      fetchFareRule({
        traceId: searchMeta.traceId,
        onwardResultIndex: onwardF.ResultIndex,
        returnResultIndex: returnF?.ResultIndex || null,
      });
      fetchFareQuote({
        traceId: searchMeta.traceId,
        onwardResultIndex: onwardF.ResultIndex,
        returnResultIndex: returnF?.ResultIndex || null,
      });
    }
  }, []);

  // ── UI State ──
  const [onwardExpanded, setOnwardExpanded] = useState(false);
  const [returnExpanded, setReturnExpanded] = useState(false);
  const [onwardTab, setOnwardTab] = useState("fare");
  const [returnTab, setReturnTab] = useState("fare");
  const [gstEnabled, setGstEnabled] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [travellers, setTravellers] = useState(() =>
    buildInitialTravellers(searchMeta?.passengers),
  );
  const [validationErrors, setValidationErrors] = useState({});

  const runValidation = (currentTravellers) => {
    const errs = {};
    ["adults", "children", "infants"].forEach((type) => {
      currentTravellers[type].forEach((t) => {
        const fieldErrs = validateTraveller(type, t);
        if (Object.keys(fieldErrs).length > 0) errs[t.id] = fieldErrs;
      });
    });
    return errs;
  };

  const handleAdd = (type) => {
    setTravellers((prev) => ({
      ...prev,
      [type]: [...prev[type], newTraveller(type)],
    }));
  };

  const handleChange = (type, id, updated) => {
    setTravellers((prev) => ({
      ...prev,
      [type]: prev[type].map((t) => (t.id === id ? updated : t)),
    }));
    if (showErrors) {
      setValidationErrors((prev) => {
        const newErrs = { ...prev };
        newErrs[id] = validateTraveller(type, updated);
        if (Object.keys(newErrs[id]).length === 0) delete newErrs[id];
        return newErrs;
      });
    }
  };

  const handleRemove = (type, id) => {
    setTravellers((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t.id !== id),
    }));
    setValidationErrors((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  // ── Contact State ──
  const [contact, setContact] = useState({
    countryCode: "+91",
    mobile: "",
    email: "",
  });
  const [contactErrors, setContactErrors] = useState({});

  // ── Billing State ──
  const [billing, setBilling] = useState({
    address: "",
    city: "",
    state: "",
    nationality: "India",
  });
  const [billingErrors, setBillingErrors] = useState({});

  const [gst, setGst] = useState({
    company: "",
    number: "",
    address: "",
    city: "",
    state: "",
    nationality: "India",
  });

  const handleContactMobile = (val) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 10);
    setContact((p) => ({ ...p, mobile: digitsOnly }));
    if (showErrors) {
      if (!digitsOnly) {
        setContactErrors((p) => ({ ...p, mobile: "Mobile number is required" }));
      } else if (!MOBILE_REGEX.test(digitsOnly)) {
        setContactErrors((p) => ({ ...p, mobile: "Mobile must be exactly 10 digits" }));
      } else {
        setContactErrors((p) => ({ ...p, mobile: "" }));
      }
    }
  };

  const handleContactEmail = (val) => {
    const cleaned = noLeadingSpaces(val);
    setContact((p) => ({ ...p, email: cleaned }));
    if (showErrors) {
      if (!cleaned) {
        setContactErrors((p) => ({ ...p, email: "Email is required" }));
      } else if (!EMAIL_REGEX.test(cleaned)) {
        setContactErrors((p) => ({ ...p, email: "Enter a valid email address" }));
      } else {
        setContactErrors((p) => ({ ...p, email: "" }));
      }
    }
  };

  // ── Fare Calculation from fare quote API ──
  const onwardFare = onwardFareQuote?.Results?.Fare;
  const returnFare = returnFareQuote?.Results?.Fare;

  const onwardPublished =
    onwardFare?.PublishedFare ?? onwardF?.Fare?.PublishedFare ?? 0;
  const returnPublished =
    returnFare?.PublishedFare ?? returnF?.Fare?.PublishedFare ?? 0;

  const onwardTaxAmt = onwardFare?.Tax ?? onwardF?.Fare?.Tax ?? 0;
  const returnTaxAmt = returnFare?.Tax ?? returnF?.Fare?.Tax ?? 0;

  const onwardFareTotal = onwardPublished * totalPassengers;
  const returnFareTotal = returnPublished * totalPassengers;
  const tax = (onwardTaxAmt + returnTaxAmt) * totalPassengers;
  const totalFare = onwardFareTotal + returnFareTotal;

  const isPriceChanged =
    onwardFareQuote?.IsPriceChanged || returnFareQuote?.IsPriceChanged || false;
  const isRefundable =
    onwardFareQuote?.Results?.IsRefundable ?? onwardF?.IsRefundable;

  const navigate = useNavigate();

  // ── handleProceed — full validation including billing ──
  const handleProceed = () => {
    setShowErrors(true);

    // Traveller validation
    const travErrs = runValidation(travellers);
    setValidationErrors(travErrs);

    // Contact validation — both required
    const cErrs = {};
    if (!contact.mobile) {
      cErrs.mobile = "Mobile number is required";
    } else if (!MOBILE_REGEX.test(contact.mobile)) {
      cErrs.mobile = "Mobile must be exactly 10 digits";
    }
    if (!contact.email) {
      cErrs.email = "Email is required";
    } else if (!EMAIL_REGEX.test(contact.email)) {
      cErrs.email = "Enter a valid email address";
    }
    setContactErrors(cErrs);

    // Billing validation — address, city, state required
    const bErrs = {};
    if (!billing.address.trim()) bErrs.address = "Address is required";
    if (!billing.city.trim()) bErrs.city = "City is required";
    if (!billing.state.trim()) bErrs.state = "State is required";
    setBillingErrors(bErrs);

    const hasErrors =
      Object.keys(travErrs).length > 0 ||
      Object.keys(cErrs).length > 0 ||
      Object.keys(bErrs).length > 0;

    if (hasErrors) {
      setTimeout(() => {
        const firstErr = document.querySelector(".input-err");
        if (firstErr)
          firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    navigate("/ssr", {
      state: {
        flight: onwardF,
        returnFlight: returnF,
        searchMeta,
        travellers,
        contact,
        billing,
        gst,
        fareQuote: onwardFareQuote,
        returnFareQuote,
        traceId: searchMeta?.traceId,
        resultIndex: onwardF?.ResultIndex,
        returnResultIndex: returnF?.ResultIndex || null,
        isLCC: onwardF?.IsLCC || false,
      },
    });
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "#f0f4fa",
        minHeight: "100vh",
        padding: "24px 0 64px",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .bk-wrap { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .bk-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
        @media (max-width: 860px) { .bk-grid { grid-template-columns: 1fr; } }
        .card { background: #fff; border-radius: 14px; box-shadow: 0 1px 10px rgba(0,0,0,0.07); overflow: hidden; }
        .card + .card { margin-top: 16px; }
        .input-field { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 11px 14px; font-size: 14px; color: #374151; outline: none; font-family: inherit; transition: border-color 0.2s; background: #fff; }
        .input-field:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.08); }
        .input-field::placeholder { color: #9ca3af; }
        .input-err { border-color: #dc2626 !important; background: #fff5f5 !important; }
        .input-err:focus { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,0.08) !important; }
        select.input-field { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='4 6 8 10 12 6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 13px 0; font-family: inherit; font-size: 14px; transition: color 0.15s; }
        .tab-active { border-bottom: 2px solid #16a34a; color: #16a34a; font-weight: 600; }
        .tab-inactive { border-bottom: 2px solid transparent; color: #6b7280; font-weight: 400; }
        .add-btn { background: none; border: 1px dashed #16a34a; cursor: pointer; font-family: inherit; color: #16a34a; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; transition: background 0.15s; }
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
        .rule-table td:last-child:not([colspan]) { text-align: right; font-weight: 600; color: #111827; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 580px) { .two-col { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="bk-wrap">
        <div className="bk-grid">
          <div>
            {/* ── Flight Cards ── */}
            <FlightCard
              flight={onwardF}
              legLabel={isRoundTrip ? "Onward Flight" : null}
              expanded={onwardExpanded}
              onToggle={() => setOnwardExpanded((v) => !v)}
              activeTab={onwardTab}
              onTabChange={setOnwardTab}
              fareRuleData={onwardFareRule}
              fareLoading={fareLoading}
            />

            {isRoundTrip && (
              <FlightCard
                flight={returnF}
                legLabel="Return Flight"
                expanded={returnExpanded}
                onToggle={() => setReturnExpanded((v) => !v)}
                activeTab={returnTab}
                onTabChange={setReturnTab}
                fareRuleData={returnFareRule}
                fareLoading={fareLoading}
              />
            )}

            {/* ── Travellers ── */}
            <div className="card">
              <div
                className="section-hdr"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3>Travellers Details</h3>
                  <p style={{ marginTop: 2 }}>
                    {adultCount} Adult{adultCount !== 1 ? "s" : ""}
                    {childCount > 0
                      ? `, ${childCount} Child${childCount !== 1 ? "ren" : ""}`
                      : ""}
                    {infantCount > 0
                      ? `, ${infantCount} Infant${infantCount !== 1 ? "s" : ""}`
                      : ""}
                    {" · "}
                    {searchMeta?.cabinClass || "Economy"}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  <UserIcon />
                  <span>Name should match Government ID proof</span>
                </div>
              </div>
              <div style={{ padding: "20px 20px 8px" }}>
                {travellers.adults.length > 0 && (
                  <TravellerGroup
                    type="adults"
                    label="Adult"
                    ageLabel="(12+ yrs)"
                    list={travellers.adults}
                    onChange={handleChange}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    allErrors={validationErrors}
                    showErrors={showErrors}
                  />
                )}
                {travellers.children.length > 0 && (
                  <div style={{ marginTop: travellers.adults.length > 0 ? 16 : 0 }}>
                    <TravellerGroup
                      type="children"
                      label="Child"
                      ageLabel="(2-12 yrs)"
                      list={travellers.children}
                      onChange={handleChange}
                      onAdd={handleAdd}
                      onRemove={handleRemove}
                      allErrors={validationErrors}
                      showErrors={showErrors}
                    />
                  </div>
                )}
                {travellers.infants.length > 0 && (
                  <div
                    style={{
                      marginTop:
                        travellers.adults.length > 0 || travellers.children.length > 0 ? 16 : 0,
                    }}
                  >
                    <TravellerGroup
                      type="infants"
                      label="Infant"
                      ageLabel="(0-2 yrs)"
                      list={travellers.infants}
                      onChange={handleChange}
                      onAdd={handleAdd}
                      onRemove={handleRemove}
                      allErrors={validationErrors}
                      showErrors={showErrors}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── Contact ── */}
            <div className="card">
              <div className="section-hdr">
                <h3>Contact Information</h3>
                <p>Your ticket &amp; Flight details will be shared here</p>
              </div>
              <div style={{ padding: 20 }}>
                <div
                  className="two-col"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>Mobile Number *</label>
                    <div style={{ display: "flex" }}>
                      <select
                        className="input-field"
                        style={{
                          width: 84,
                          borderRadius: "8px 0 0 8px",
                          borderRight: "none",
                          paddingRight: 8,
                        }}
                        value={contact.countryCode}
                        onChange={(e) =>
                          setContact((p) => ({ ...p, countryCode: e.target.value }))
                        }
                      >
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+971</option>
                      </select>
                      <input
                        className={`input-field${showErrors && contactErrors.mobile ? " input-err" : ""}`}
                        style={{ borderRadius: "0 8px 8px 0", flex: 1 }}
                        placeholder="10-digit number"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={contact.mobile}
                        onChange={(e) => handleContactMobile(e.target.value)}
                      />
                    </div>
                    {showErrors && contactErrors.mobile && (
                      <span style={errStyle}>⚠ {contactErrors.mobile}</span>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                      className={`input-field${showErrors && contactErrors.email ? " input-err" : ""}`}
                      placeholder="Email Address"
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleContactEmail(e.target.value)}
                    />
                    {showErrors && contactErrors.email && (
                      <span style={errStyle}>⚠ {contactErrors.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Billing ── */}
            <div className="card">
              <div className="section-hdr">
                <h3>Billing Information</h3>
                <p>Required for booking confirmation</p>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ marginBottom: 14, position: "relative" }}>
                  <label style={labelStyle}>Address *</label>
                  <input
                    className={`input-field${showErrors && billingErrors.address ? " input-err" : ""}`}
                    placeholder="Address"
                    value={billing.address}
                    onChange={(e) =>
                      setBilling((p) => ({
                        ...p,
                        address: noLeadingSpaces(e.target.value),
                      }))
                    }
                  />
                  {showErrors && billingErrors.address && (
                    <span style={errStyle}>⚠ {billingErrors.address}</span>
                  )}
                </div>
                <div
                  className="two-col"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>City *</label>
                    <input
                      className={`input-field${showErrors && billingErrors.city ? " input-err" : ""}`}
                      placeholder="City"
                      value={billing.city}
                      onChange={(e) =>
                        setBilling((p) => ({
                          ...p,
                          city: noLeadingSpaces(e.target.value),
                        }))
                      }
                    />
                    {showErrors && billingErrors.city && (
                      <span style={errStyle}>⚠ {billingErrors.city}</span>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <label style={labelStyle}>State *</label>
                    <input
                      className={`input-field${showErrors && billingErrors.state ? " input-err" : ""}`}
                      placeholder="State"
                      value={billing.state}
                      onChange={(e) =>
                        setBilling((p) => ({
                          ...p,
                          state: noLeadingSpaces(e.target.value),
                        }))
                      }
                    />
                    {showErrors && billingErrors.state && (
                      <span style={errStyle}>⚠ {billingErrors.state}</span>
                    )}
                  </div>
                </div>
                <div style={{ maxWidth: "calc(50% - 7px)", position: "relative" }}>
                  <label style={labelStyle}>Nationality</label>
                  <input
                    className="input-field"
                    value="India"
                    readOnly
                    style={{ background: "#f9fafb", cursor: "default", color: "#374151" }}
                  />
                </div>
              </div>
            </div>

            {/* ── GST ── */}
            <div className="card">
              <div className="section-hdr">
                <h3>GST Details</h3>
                <p>Use GST number to avail GST Benefits &amp; additional savings</p>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <GSTToggle
                    checked={gstEnabled}
                    onChange={() => setGstEnabled((v) => !v)}
                  />
                  <span style={{ fontSize: 14, color: "#374151" }}>
                    I would like to add my GST Number
                  </span>
                </div>
                {gstEnabled && (
                  <div style={{ marginTop: 18 }}>
                    <div
                      className="two-col"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                        marginBottom: 14,
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <label style={labelStyle}>Company Name</label>
                        <input
                          className="input-field"
                          placeholder="Company Name"
                          value={gst.company}
                          onChange={(e) =>
                            setGst((p) => ({ ...p, company: noLeadingSpaces(e.target.value) }))
                          }
                        />
                      </div>
                      <div style={{ position: "relative" }}>
                        <label style={labelStyle}>GST Number</label>
                        <input
                          className="input-field"
                          placeholder="GST Number"
                          value={gst.number}
                          onChange={(e) =>
                            setGst((p) => ({ ...p, number: noLeadingSpaces(e.target.value) }))
                          }
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: 14, position: "relative" }}>
                      <label style={labelStyle}>Address</label>
                      <input
                        className="input-field"
                        placeholder="Address"
                        value={gst.address}
                        onChange={(e) =>
                          setGst((p) => ({ ...p, address: noLeadingSpaces(e.target.value) }))
                        }
                      />
                    </div>
                    <div
                      className="two-col"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                        marginBottom: 14,
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <label style={labelStyle}>City</label>
                        <input
                          className="input-field"
                          placeholder="City"
                          value={gst.city}
                          onChange={(e) =>
                            setGst((p) => ({ ...p, city: noLeadingSpaces(e.target.value) }))
                          }
                        />
                      </div>
                      <div style={{ position: "relative" }}>
                        <label style={labelStyle}>State</label>
                        <input
                          className="input-field"
                          placeholder="State"
                          value={gst.state}
                          onChange={(e) =>
                            setGst((p) => ({ ...p, state: noLeadingSpaces(e.target.value) }))
                          }
                        />
                      </div>
                    </div>
                    <div style={{ maxWidth: "calc(50% - 7px)", position: "relative" }}>
                      <label style={labelStyle}>Nationality</label>
                      <input
                        className="input-field"
                        value="India"
                        readOnly
                        style={{ background: "#f9fafb", cursor: "default", color: "#374151" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Fare Summary (sticky) ── */}
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
                <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
                  Fare Summary
                </span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  {totalPassengers} Traveller{totalPassengers !== 1 ? "s" : ""}
                </span>
              </div>

              {fareQuoteLoading ? (
                <div style={{ padding: "28px 20px", textAlign: "center" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#6b7280",
                      fontSize: 13,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Fetching latest fare...
                  </div>
                </div>
              ) : (
                <div style={{ padding: "8px 0" }}>
                  <div className="fare-row">
                    <span style={{ color: "#6b7280" }}>Fare Type</span>
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>
                      {isRefundable ? "Refundable" : "Partial Refundable"}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "10px 20px 4px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#16a34a",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {isRoundTrip ? "Onward Flight" : "Flight Fare"}
                  </div>
                  <div className="fare-row">
                    <span>{isRoundTrip ? "Onward Fare" : "Base Fare"}</span>
                    <span style={{ fontWeight: 600 }}>
                      ₹{onwardFareTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {adultCount > 0 && (
                    <div className="fare-row">
                      <span>Adult × {adultCount}</span>
                      <span style={{ fontWeight: 600 }}>
                        ₹{(Math.round(onwardPublished) * adultCount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {childCount > 0 && (
                    <div className="fare-row">
                      <span>Child × {childCount}</span>
                      <span style={{ fontWeight: 600 }}>
                        ₹{(Math.round(onwardPublished) * childCount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {infantCount > 0 && (
                    <div className="fare-row">
                      <span>Infant × {infantCount}</span>
                      <span style={{ fontWeight: 600 }}>
                        ₹{(Math.round(onwardPublished) * infantCount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="fare-row">
                    <span>Taxes &amp; Fees</span>
                    <span style={{ fontWeight: 600 }}>
                      ₹{(onwardTaxAmt * totalPassengers).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="fare-row" style={{ borderTop: "1px solid #e5e7eb" }}>
                    <span style={{ fontWeight: 700, color: "#111827" }}>
                      {isRoundTrip ? "Onward Subtotal" : "Subtotal"}
                    </span>
                    <span style={{ fontWeight: 700, color: "#111827" }}>
                      ₹{(onwardFareTotal + onwardTaxAmt * totalPassengers).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {isRoundTrip && (
                    <>
                      <div
                        style={{
                          padding: "12px 20px 4px",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#16a34a",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          borderTop: "1px dashed #e5e7eb",
                          marginTop: 4,
                        }}
                      >
                        Return Flight
                      </div>
                      <div className="fare-row">
                        <span>Return Fare</span>
                        <span style={{ fontWeight: 600 }}>
                          ₹{returnFareTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                      {adultCount > 0 && (
                        <div className="fare-row">
                          <span>Adult × {adultCount}</span>
                          <span style={{ fontWeight: 600 }}>
                            ₹{(Math.round(returnPublished) * adultCount).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                      {childCount > 0 && (
                        <div className="fare-row">
                          <span>Child × {childCount}</span>
                          <span style={{ fontWeight: 600 }}>
                            ₹{(Math.round(returnPublished) * childCount).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                      <div className="fare-row">
                        <span>Taxes &amp; Fees</span>
                        <span style={{ fontWeight: 600 }}>
                          ₹{(returnTaxAmt * totalPassengers).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="fare-row" style={{ borderTop: "1px solid #e5e7eb" }}>
                        <span style={{ fontWeight: 700, color: "#111827" }}>Return Subtotal</span>
                        <span style={{ fontWeight: 700, color: "#111827" }}>
                          ₹{(returnFareTotal + returnTaxAmt * totalPassengers).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

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
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
                  Net Amount Payable
                </span>
                <span style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}>
                  {fareQuoteLoading ? "—" : `₹${totalFare.toLocaleString("en-IN")}`}
                </span>
              </div>

              <div style={{ padding: "16px 20px" }}>
                <button
                  onClick={handleProceed}
                  disabled={fareQuoteLoading}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 10,
                    background: fareQuoteLoading
                      ? "#d1d5db"
                      : "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    cursor: fareQuoteLoading ? "not-allowed" : "pointer",
                    boxShadow: fareQuoteLoading ? "none" : "0 2px 12px rgba(22,163,74,0.3)",
                    transition: "opacity 0.15s",
                  }}
                  onMouseOver={(e) => {
                    if (!fareQuoteLoading) e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {fareQuoteLoading ? "Loading Fare..." : "Proceed to Payment"}
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
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>
                    Secured &amp; Encrypted Payment
                  </span>
                </div>
              </div>

              {showErrors &&
                (Object.keys(validationErrors).length > 0 ||
                  Object.keys(contactErrors).length > 0 ||
                  Object.keys(billingErrors).length > 0) && (
                  <div
                    style={{
                      margin: "0 16px 16px",
                      padding: "10px 14px",
                      background: "#fff5f5",
                      border: "1px solid #fca5a5",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#dc2626",
                      fontWeight: 500,
                    }}
                  >
                    ⚠ Please fill all required fields correctly before proceeding.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}