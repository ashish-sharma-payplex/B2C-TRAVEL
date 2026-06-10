import { useState } from "react";

const flightlogo = "/bookflighticon.svg";

const ChevronDown = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlaneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const FARE_RULES = [
  {
    label: "Time Frame to cancel",
    sublabel: "Before scheduled departure time",
    column: "Airlines Fees\nper passenger",
    rows: [
      { desc: "Cancel Before 24 hours of departure time.", fee: "₹ 3999" },
      { desc: "Cancel within 24 hours & before 4 hours of departure time.", fee: "₹ 4999" },
    ],
  },
  {
    label: "Time Frame to rescheduled",
    sublabel: "Before scheduled departure time",
    column: "Airlines Fees\nper passenger",
    rows: [
      { desc: "Reschedule before 24 hours of departure time.", fee: "₹ 2999" },
      { desc: "Reschedule within 24 hours & before 4 hours of departure time.", fee: "₹ 2999" },
    ],
  },
];

const BAGGAGE_RULES = [
  { type: "Cabin", allowance: "7 kg per person" },
  { type: "Check-in", allowance: "15 kg per person" },
];

export default function BookFlight() {
  const [flightExpanded, setFlightExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("fare");

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f0f4fa", minHeight: "310vh", padding: "24px 0 48px", maxWidth:"1440px" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .bk-container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .bk-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }
        @media (max-width: 768px) {
          .bk-grid { grid-template-columns: 1fr; }
        //   .bk-fare-summary { order: 2; margin-top: 16px; }
        }
        .card { background: #fff; border-radius: 12px; box-shadow: 0 1px 8px rgba(0,0,0,0.07); overflow: hidden; }
        .card + .card { margin-top: 16px; }
        .btn-link { background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
        .tab-active { border-bottom: 2px solid #16a34a; color: #16a34a; font-weight: 600; }
        .tab-inactive { border-bottom: 2px solid transparent; color: #6b7280; }
        .input-field {
          width: 100%; border: 1px solid #d1d5db; border-radius: 8px;
          padding: 11px 14px; font-size: 14px; color: #374151; outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,0.1); }
        .input-field::placeholder { color: #9ca3af; }
        .add-btn { color: #16a34a; font-size: 14px; font-weight: 500; cursor: pointer; background: none; border: none; font-family: inherit; display: flex; align-items: center; gap: 4px; padding: 2px 0; }
        .add-btn:hover { text-decoration: underline; }
        .section-divider { height: 1px; background: #f0f0f0; margin: 0; }
        .pill { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 500; border-radius: 999px; padding: 2px 10px; }
        .layover-badge {
          display: flex; align-items: center; justify-content: center;
          margin: 8px 0; gap: 8px;
        }
        .layover-badge span {
          font-size: 12px; color: #6b7280; background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 999px; padding: 3px 14px; font-weight: 500;
        }
        .layover-badge:before, .layover-badge:after {
          content: ''; flex: 1; height: 1px; background: #e5e7eb;
        }
        .flight-row { display: grid; grid-template-columns: 140px 1fr 1fr; gap: 12px; align-items: center; padding: 18px 20px 10px; }
        @media (max-width: 520px) {
          .flight-row { grid-template-columns: 1fr; gap: 8px; }
        }
        .timeline { display: flex; align-items: center; gap: 8px; }
        .timeline-line { flex: 1; height: 2px; background: #d1d5db; position: relative; }
        .timeline-dot { width: 8px; height: 8px; border-radius: 50%; border: 2px solid #9ca3af; background: #fff; flex-shrink: 0; }
        .fare-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; font-size: 14px; color: #374151; }
        .fare-row:not(:last-child) { border-bottom: 1px solid #f3f4f6; }
        .fare-total { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: #f9fafb; border-top: 2px solid #e5e7eb; }
        .travelers-section { padding: 20px; }
        .traveler-group { margin-bottom: 20px; }
        .traveler-title { font-size: 16px; font-weight: 600; color: #111827; }
        .traveler-count { font-size: 13px; color: #6b7280; }
        .contact-section { padding: 20px; }
        .billing-section { padding: 20px; }
        .input-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .input-grid-2 { grid-template-columns: 1fr; } }
        .section-header { padding: 18px 20px 12px; border-bottom: 1px solid #f3f4f6; }
        .section-header h3 { font-size: 16px; font-weight: 700; color: #111827; }
        .section-header p { font-size: 13px; color: #6b7280; margin-top: 2px; }
        .gst-section { padding: 20px; }
        .toggle { width: 36px; height: 20px; border-radius: 999px; background: #d1d5db; position: relative; cursor: pointer; border: none; transition: background 0.2s; }
        .toggle.on { background: #16a34a; }
        .toggle:after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: left 0.2s; }
        .toggle.on:after { left: 18px; }
        select.input-field { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='4 6 8 10 12 6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
        .mobile-prefix { display: flex; align-items: center; gap: 0; }
        .mobile-prefix select { border-radius: 8px 0 0 8px; border-right: none; width: 80px; background: #f9fafb; }
        .mobile-prefix input { border-radius: 0 8px 8px 0; flex: 1; }
        .rule-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .rule-table th { text-align: left; font-weight: 600; color: #111827; padding: 10px 14px; background: #f9fafb; font-size: 13px; }
        .rule-table th:last-child { text-align: right; }
        .rule-table td { padding: 10px 14px; color: #374151; border-top: 1px solid #f0f0f0; }
        .rule-table td:last-child { text-align: right; font-weight: 500; }
        .rule-group-header { background: #f3f4f6; }
        .rule-group-header td { font-weight: 700; font-size: 13px; color: #111827; padding: 10px 14px; }
      `}</style>

      <div className="bk-container">
        <div className="bk-grid">
          {/* LEFT COLUMN */}
          <div>
            {/* Flight Card */}
            <div className="card">
              {/* Flight Header */}
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", borderBottom: flightExpanded ? "1px solid #f3f4f6" : "none" }}
                onClick={() => setFlightExpanded(v => !v)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                     <img
                        src={flightlogo}
                           alt="Flight"
                       style={{ width: 20, height: 20, objectFit: "contain" }}
                         />
                     </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>New Delhi to Mumbai</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Sun, Feb 08 • IndiGo • 2h 15m (1 Stop)</div>
                  </div>
                </div>
                <ChevronDown size={20} style={{ color: "#6b7280", transition: "transform 0.2s", transform: flightExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
              </div>

              {flightExpanded && (
                <>
                  {/* Flight Leg 1 */}
                  <div className="flight-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                     <div style={{ width: 32, height: 32, background: "#e8f0fe", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <img
                           src={flightlogo}
                           alt="Flight"
                        style={{ width: 18, height: 18, objectFit: "contain" }}
                           />
                        </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a56db" }}>IndiGo · 6E-5032</div>
                        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>Airbus 3260</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>16:05</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Mumbai (BOM)</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>Chatrapati Shivaji Aiport, Terminal 2</div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div className="timeline-dot" />
                        <div className="timeline-line" />
                        <div style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>02h 15m</div>
                        <div className="timeline-line" />
                        <div className="timeline-dot" />
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>18:20</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Dehradun (DED)</div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>Jolly Grant Airport Terminal 1</div>
                      </div>
                    </div>
                  </div>

                  {/* Layover */}
                  <div style={{ padding: "0 20px" }}>
                    <div className="layover-badge">
                      <span>1h 25m Layover at Dehradun</span>
                    </div>
                  </div>

                  {/* Flight Leg 2 */}
                  <div className="flight-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                     <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <img
                          src={flightlogo}
                          alt="Flight"
                            style={{ width: 20, height: 20, objectFit: "contain" }}
                                />
                           </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a56db" }}>IndiGo · 6E-2592</div>
                        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>Airbus 3510</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>19:45</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Dehradun (DED)</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>Jolly Grant Airport, Terminal 2</div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div className="timeline-dot" />
                        <div className="timeline-line" />
                        <div style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>00h 55m</div>
                        <div className="timeline-line" />
                        <div className="timeline-dot" />
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>20:40</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Dehradun (DED)</div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>Jolly Grant Airport Terminal 1</div>
                      </div>
                    </div>
                  </div>

                  {/* Fare Rules / Baggage Tabs */}
                  <div style={{ borderTop: "1px solid #f3f4f6", margin: "0 0 0 0" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", padding: "0 20px", gap: 24 }}>
                      {["fare", "baggage"].map(tab => (
                        <button
                          key={tab}
                          className={`btn-link ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
                          style={{ padding: "13px 0", fontSize: 14, fontWeight: activeTab === tab ? 600 : 400, letterSpacing: 0.1 }}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab === "fare" ? "Fare Rules" : "Baggage"}
                        </button>
                      ))}
                    </div>

                    {activeTab === "fare" && (
                      <div style={{ padding: "0 0 12px" }}>
                        {FARE_RULES.map((group, gi) => (
                          <table key={gi} className="rule-table" style={{ marginBottom: gi === 0 ? 8 : 0 }}>
                            <thead>
                              <tr>
                                <th style={{ width: "60%" }}>
                                  <div style={{ fontWeight: 700, color: "#111827" }}>{group.label}</div>
                                  <div style={{ fontWeight: 400, color: "#9ca3af", fontSize: 12 }}>{group.sublabel}</div>
                                </th>
                                <th>
                                  <div style={{ whiteSpace: "pre-line", textAlign: "right" }}>{group.column}</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.rows.map((row, ri) => (
                                <tr key={ri}>
                                  <td>{row.desc}</td>
                                  <td style={{ fontWeight: 600, color: "#111827" }}>{row.fee}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ))}
                      </div>
                    )}

                    {activeTab === "baggage" && (
                      <div style={{ padding: "12px 20px" }}>
                        <table className="rule-table">
                          <thead>
                            <tr>
                              <th>Baggage Type</th>
                              <th style={{ textAlign: "right" }}>Allowance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {BAGGAGE_RULES.map((r, i) => (
                              <tr key={i}>
                                <td>{r.type}</td>
                                <td style={{ fontWeight: 600 }}>{r.allowance}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Travellers Details */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Travellers Details</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                  <UserIcon />
                  <span>Name should be same as in Government ID proof</span>
                </div>
              </div>
              <div className="travelers-section">
                {[
                  { label: "Adult (12+ yrs)", total: 2 },
                  { label: "Child (2-12 yrs)", total: 1 },
                  { label: "Infant (0-2 yrs)", total: 1 },
                ].map((g, i) => (
                  <div key={i} className="traveler-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span className="traveler-title">{g.label}</span>
                      <span className="traveler-count">0/{g.total} Added</span>
                    </div>
                    <button className="add-btn">
                      <span style={{ fontSize: 18, lineHeight: 1, marginRight: 2 }}>+</span>
                      {g.label === "Infant (0-2 yrs)" ? "Add Child" : `Add ${g.label.split(" ")[0]}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="section-header">
                <h3>Contact Information</h3>
                <p>Your ticket &amp; Flight details will be shared here</p>
              </div>
              <div className="contact-section">
                <div className="input-grid-2" style={{ marginBottom: 12 }}>
                  <div>
                    <div className="mobile-prefix">
                      <select className="input-field" style={{ width: 88, borderRadius: "8px 0 0 8px", borderRight: "none", background: "#f9fafb", paddingRight: 8 }}>
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+971</option>
                      </select>
                      <input className="input-field" style={{ borderRadius: "0 8px 8px 0", flex: 1 }} placeholder="8529637412" defaultValue="8529637412" type="tel" />
                    </div>
                  </div>
                  <input className="input-field" placeholder="Email Address" type="email" />
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="section-header">
                <h3>Billing Information</h3>
                <p>Your ticket &amp; Flight details will be shared here</p>
              </div>
              <div className="billing-section">
                <div style={{ marginBottom: 12 }}>
                  <input className="input-field" placeholder="Address" />
                </div>
                <div className="input-grid-2" style={{ marginBottom: 12 }}>
                  <input className="input-field" placeholder="City" />
                  <input className="input-field" placeholder="State" />
                </div>
                <div className="input-grid-2">
                  <div />
                  <select className="input-field">
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>UAE</option>
                    <option>Singapore</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GST Details */}
            <div className="card" style={{ marginTop: 16 }}>
              <div className="gst-section">
                <div style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 4 }}>GST Details</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>Use GST number to avail GST Benefits &amp; additional savings</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <GSTToggle />
                  <span style={{ fontSize: 14, color: "#374151" }}>I would like to add my GST Number</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Fare Summary */}
          <div className="bk-fare-summary">
            <div className="card" style={{ position: "sticky", top: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Fare Summary</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>4 Traveller</span>
              </div>
              <div style={{ padding: "10px 0 0" }}>
                <div className="fare-row">
                  <span style={{ color: "#6b7280" }}>Fare Type</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>Partial Refundable</span>
                </div>
                <div className="fare-row">
                  <span>Adult x 2</span>
                  <span style={{ fontWeight: 600 }}>₹8,666</span>
                </div>
                <div className="fare-row">
                  <span>Child x 1</span>
                  <span style={{ fontWeight: 600 }}>₹4,333</span>
                </div>
                <div className="fare-row">
                  <span>Infant x 1</span>
                  <span style={{ fontWeight: 600 }}>₹2,000</span>
                </div>
                <div className="fare-row">
                  <span>Taxes &amp; Fees</span>
                  <span style={{ fontWeight: 600 }}>₹2,946</span>
                </div>
              </div>
              <div className="fare-total">
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Net Amount Payable</span>
                <span style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}>₹17,945</span>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <button
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 8,
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#fff", fontSize: 15, fontWeight: 700, border: "none",
                    cursor: "pointer", letterSpacing: 0.3, boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
                    transition: "opacity 0.15s"
                  }}
                  onMouseOver={e => e.currentTarget.style.opacity = "0.92"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}
                >
                  Proceed to Payment
                </button>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Secured &amp; Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GSTToggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      className={`toggle${on ? " on" : ""}`}
      onClick={() => setOn(v => !v)}
      aria-pressed={on}
      aria-label="Toggle GST"
    />
  );
}