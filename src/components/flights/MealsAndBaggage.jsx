

// import { useState } from "react";

// // ─── Inline SVG icons (no external deps) ─────────────────────────────────────

// const MealsIcon = ({ active }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
//     stroke={active ? "#16a34a" : "#6b7280"} strokeWidth="2"
//     strokeLinecap="round" strokeLinejoin="round">
//     <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
//     <path d="M7 2v20" />
//     <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
//   </svg>
// );

// const BaggageIcon = ({ active }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
//     stroke={active ? "#16a34a" : "#6b7280"} strokeWidth="2"
//     strokeLinecap="round" strokeLinejoin="round">
//     <rect x="6" y="4" width="12" height="16" rx="2" />
//     <path d="M9 4V2h6v2" />
//     <line x1="12" y1="8" x2="12" y2="16" />
//     <line x1="8" y1="12" x2="16" y2="12" />
//   </svg>
// );

// const PlaneSegIcon = ({ color = "#fff" }) => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
//     stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
//   </svg>
// );

// const ChevronRight = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
//     stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="9 18 15 12 9 6" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//     stroke="#9ca3af" strokeWidth="2">
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
//     <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//   </svg>
// );

// // Luggage icons for different sizes (color-coded like the design)
// const Bag3kg  = () => <BagSvg color="#f59e0b" size={28} label="S" />;
// const Bag5kg  = () => <BagSvg color="#10b981" size={30} label="M" />;
// const Bag10kg = () => <BagSvg color="#f59e0b" size={34} label="L" />;
// const Bag15kg = () => <BagSvg color="#6366f1" size={36} label="XL" />;
// const Bag20kg = () => <BagSvg color="#f59e0b" size={30} label="M" />;
// const Bag30kg = () => <BagSvg color="#10b981" size={36} label="XL" />;

// function BagSvg({ color, size, label }) {
//   return (
//     <div style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <svg width={size} height={size} viewBox="0 0 40 50" fill="none">
//         <rect x="6" y="10" width="28" height="36" rx="4" fill={color} opacity="0.9"/>
//         <rect x="14" y="4" width="12" height="8" rx="2" fill={color} opacity="0.7"/>
//         <line x1="20" y1="18" x2="20" y2="38" stroke="white" strokeWidth="2" opacity="0.6"/>
//         <line x1="10" y1="28" x2="30" y2="28" stroke="white" strokeWidth="2" opacity="0.6"/>
//         <rect x="17" y="24" width="6" height="8" rx="1" fill="white" opacity="0.3"/>
//       </svg>
//     </div>
//   );
// }

// // ─── Static data ──────────────────────────────────────────────────────────────

// const SEGMENTS = [
//   { id: "del-nag", label: "DEL - NAG" },
//   { id: "nag-bom", label: "NAG - BOM" },
// ];

// const MEALS_DATA = [
//   { id: "m1", name: "Tropical Berry Smoothie",   price: 300 },
//   { id: "m2", name: "Choco-Banana Bliss",         price: 330 },
//   { id: "m3", name: "Chocolate Mint Shake",       price: 350 },
//   { id: "m4", name: "Strawberry Dream Shake",     price: 290 },
//   { id: "m5", name: "Vanilla Almond Delight",     price: 280 },
//   { id: "m6", name: "Peanut Butter Energy Shake", price: 360 },
//   { id: "m7", name: "Coconut Bliss Shake",        price: 320 },
//   { id: "m8", name: "Mango Coconut Fusion",       price: 310 },
// ];

// const BAGGAGE_DATA = [
//   { id: "b1", name: "Additional 3 KG",  price: 1800,  Icon: Bag3kg  },
//   { id: "b2", name: "Additional 20 KG", price: 12000, Icon: Bag20kg },
//   { id: "b3", name: "Additional 5 KG",  price: 2750,  Icon: Bag5kg  },
//   { id: "b4", name: "Additional 30 KG", price: 18000, Icon: Bag30kg },
//   { id: "b5", name: "Additional 10 KG", price: 4500,  Icon: Bag10kg },
//   { id: "b6", name: null }, // empty cell for grid alignment
//   { id: "b7", name: "Additional 15 KG", price: 6750,  Icon: Bag15kg },
//   { id: "b8", name: null }, // empty cell
// ];

// const PASSENGERS = [
//   { id: "p1", name: "Shivam C" },
//   { id: "p2", name: "Rahul M"  },
//   { id: "p3", name: "Donke"    },
// ];

// const FARE_SUMMARY = {
//   fareType    : "Partial Refundable",
//   travellers  : 4,
//   adultCount  : 2,
//   adultFare   : 8666,
//   childCount  : 1,
//   childFare   : 4333,
//   infantCount : 1,
//   infantFare  : 2000,
//   taxes       : 2946,
//   total       : 17945,
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const INR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// // ─── AddButton ────────────────────────────────────────────────────────────────
// function AddButton({ added, onToggle }) {
//   return (
//     <button
//       onClick={onToggle}
//       style={{
//         width: 72,
//         padding: "7px 0",
//         borderRadius: 8,
//         border: added ? "1.5px solid #16a34a" : "1.5px solid #d1d5db",
//         background: added ? "#f0fdf4" : "#fff",
//         color: added ? "#16a34a" : "#374151",
//         fontSize: 13,
//         fontWeight: 600,
//         cursor: "pointer",
//         fontFamily: "inherit",
//         transition: "all .15s",
//         flexShrink: 0,
//       }}
//     >
//       {added ? "Added ✓" : "Add"}
//     </button>
//   );
// }

// // ─── Item Grid (shared for Meals + Baggage) ────────────────────────────────────
// // Renders items in a 2-column grid, each row = one item (left col) + one item (right col)
// function ItemGrid({ items, selections, onToggle, type }) {
//   // Pair items into rows of 2
//   const pairs = [];
//   for (let i = 0; i < items.length; i += 2) {
//     pairs.push([items[i], items[i + 1] || null]);
//   }

//   return (
//     <div style={{
//       border: "1px solid #e5e7eb",
//       borderRadius: 12,
//       overflow: "hidden",
//       background: "#fff",
//       margin: "16px 0",
//     }}>
//       {pairs.map(([left, right], pi) => (
//         <div key={pi} style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           borderBottom: pi < pairs.length - 1 ? "1px dashed #f0f0f0" : "none",
//         }}>
//           {/* Left cell */}
//           <div style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "14px 16px",
//             borderRight: "1px dashed #f0f0f0",
//             gap: 10,
//           }}>
//             {left?.name ? (
//               <>
//                 {type === "baggage" && left.Icon && (
//                   <div style={{ flexShrink: 0 }}><left.Icon /></div>
//                 )}
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 3 }}>
//                     {left.name}
//                   </div>
//                   <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
//                     {INR(left.price)}
//                   </div>
//                 </div>
//                 <AddButton
//                   added={!!selections[left.id]}
//                   onToggle={() => onToggle(left.id)}
//                 />
//               </>
//             ) : <div />}
//           </div>

//           {/* Right cell */}
//           <div style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "14px 16px",
//             gap: 10,
//           }}>
//             {right?.name ? (
//               <>
//                 {type === "baggage" && right.Icon && (
//                   <div style={{ flexShrink: 0 }}><right.Icon /></div>
//                 )}
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 3 }}>
//                     {right.name}
//                   </div>
//                   <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
//                     {INR(right.price)}
//                   </div>
//                 </div>
//                 <AddButton
//                   added={!!selections[right.id]}
//                   onToggle={() => onToggle(right.id)}
//                 />
//               </>
//             ) : <div />}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Passenger Strip ──────────────────────────────────────────────────────────
// // Bottom row of passenger cards; active passenger highlighted in green
// function PassengerStrip({ passengers, activeId, onSelect, getLabel }) {
//   return (
//     <div style={{
//       display: "flex",
//       gap: 10,
//       marginTop: 4,
//       flexWrap: "wrap",
//     }}>
//       {passengers.map((p) => {
//         const isActive = p.id === activeId;
//         const label = getLabel(p.id);
//         return (
//           <button
//             key={p.id}
//             onClick={() => onSelect(p.id)}
//             style={{
//               padding: "10px 14px",
//               borderRadius: 10,
//               border: isActive ? "1.5px solid #16a34a" : "1.5px solid #e5e7eb",
//               background: "#fff",
//               cursor: "pointer",
//               fontFamily: "inherit",
//               textAlign: "left",
//               minWidth: 110,
//               transition: "border-color .15s",
//             }}
//           >
//             <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? "#16a34a" : "#111827", marginBottom: 2 }}>
//               {p.name}
//             </div>
//             <div style={{ fontSize: 12, color: isActive ? "#16a34a" : "#6b7280" }}>
//               {label}
//             </div>
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Segment Pill Tabs ────────────────────────────────────────────────────────
// function SegmentTabs({ segments, activeSegId, onSelect }) {
//   return (
//     <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
//       {segments.map((seg) => {
//         const isActive = seg.id === activeSegId;
//         return (
//           <button
//             key={seg.id}
//             onClick={() => onSelect(seg.id)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 7,
//               padding: "7px 14px",
//               borderRadius: 8,
//               border: "none",
//               background: isActive ? "#1a3a8f" : "#e8edf8",
//               color: isActive ? "#fff" : "#374151",
//               fontSize: 13,
//               fontWeight: 600,
//               cursor: "pointer",
//               fontFamily: "inherit",
//               transition: "background .15s",
//             }}
//           >
//             <span style={{
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               width: 22,
//               height: 22,
//               borderRadius: 5,
//               background: isActive ? "rgba(255,255,255,0.18)" : "#1a3a8f",
//             }}>
//               <PlaneSegIcon color="#fff" />
//             </span>
//             {seg.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Fare Summary Card ────────────────────────────────────────────────────────
// function FareSummaryCard({ summary }) {
//   return (
//     <div style={{
//       background: "#fff",
//       borderRadius: 14,
//       boxShadow: "0 1px 8px rgba(0,0,0,.08)",
//       overflow: "hidden",
//       position: "sticky",
//       top: 20,
//     }}>
//       {/* Header */}
//       <div style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "16px 20px 12px",
//         borderBottom: "1px solid #f3f4f6",
//       }}>
//         <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Fare Summary</span>
//         <span style={{ fontSize: 13, color: "#6b7280" }}>{summary.travellers} Traveller</span>
//       </div>

//       {/* Rows */}
//       <div style={{ padding: "4px 0" }}>
//         {[
//           { label: "Fare Type",    value: summary.fareType,   valueColor: "#16a34a" },
//           { label: `Adult x ${summary.adultCount}`,  value: INR(summary.adultFare)  },
//           { label: `Child x ${summary.childCount}`,  value: INR(summary.childFare)  },
//           { label: `Infant x ${summary.infantCount}`,value: INR(summary.infantFare) },
//           { label: "Taxes & Fees", value: INR(summary.taxes) },
//         ].map((row, i) => (
//           <div key={i} style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "9px 20px",
//             fontSize: 14,
//             color: "#374151",
//             borderBottom: "1px solid #f9fafb",
//           }}>
//             <span style={{ color: "#6b7280" }}>{row.label}</span>
//             <span style={{ fontWeight: 600, color: row.valueColor || "#111827" }}>{row.value}</span>
//           </div>
//         ))}
//       </div>

//       {/* Total */}
//       <div style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "14px 20px",
//         background: "#f9fafb",
//         borderTop: "2px solid #e5e7eb",
//       }}>
//         <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Net Amount Payable</span>
//         <span style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>{INR(summary.total)}</span>
//       </div>

//       {/* Proceed button */}
//       <div style={{ padding: "14px 20px" }}>
//         <button style={{
//           width: "100%",
//           padding: "12px 0",
//           borderRadius: 8,
//           background: "linear-gradient(135deg, #16a34a, #15803d)",
//           color: "#fff",
//           fontSize: 14,
//           fontWeight: 700,
//           border: "none",
//           cursor: "pointer",
//           boxShadow: "0 2px 8px rgba(22,163,74,.25)",
//           transition: "opacity .15s",
//           fontFamily: "inherit",
//         }}
//           onMouseOver={e => (e.currentTarget.style.opacity = ".88")}
//           onMouseOut={e  => (e.currentTarget.style.opacity = "1")}
//         >
//           Proceed to Payment
//         </button>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 }}>
//           <LockIcon />
//           <span style={{ fontSize: 11, color: "#9ca3af" }}>Secured &amp; Encrypted Payment</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function MealsAndBaggage() {
//   // Active main tab: "meals" | "baggage"
//   const [activeTab, setActiveTab] = useState("meals");

//   // Active segment
//   const [activeSeg, setActiveSeg] = useState(SEGMENTS[0].id);

//   // Active passenger
//   const [activePassenger, setActivePassenger] = useState(PASSENGERS[0].id);

//   // Selections: { [passengerId]: { [segmentId]: { [itemId]: boolean } } }
//   // meal selections
//   const [mealSelections, setMealSelections] = useState({});
//   // baggage selections
//   const [baggageSelections, setBaggageSelections] = useState({});

//   // Toggle a meal item for current passenger + segment
//   const toggleMeal = (itemId) => {
//     setMealSelections(prev => {
//       const pax  = prev[activePassenger] || {};
//       const seg  = pax[activeSeg] || {};
//       return {
//         ...prev,
//         [activePassenger]: {
//           ...pax,
//           [activeSeg]: { ...seg, [itemId]: !seg[itemId] },
//         },
//       };
//     });
//   };

//   // Toggle a baggage item for current passenger + segment
//   const toggleBaggage = (itemId) => {
//     setBaggageSelections(prev => {
//       const pax  = prev[activePassenger] || {};
//       const seg  = pax[activeSeg] || {};
//       return {
//         ...prev,
//         [activePassenger]: {
//           ...pax,
//           [activeSeg]: { ...seg, [itemId]: !seg[itemId] },
//         },
//       };
//     });
//   };

//   // Current selections map for rendering
//   const currentMeals   = mealSelections?.[activePassenger]?.[activeSeg]   || {};
//   const currentBaggage = baggageSelections?.[activePassenger]?.[activeSeg] || {};

//   // Passenger label builders
//   const getMealLabel = (pId) => {
//     const allSegs = mealSelections[pId] || {};
//     let count = 0, total = 0;
//     Object.values(allSegs).forEach(seg => {
//       const ids = Object.entries(seg).filter(([, v]) => v).map(([k]) => k);
//       count += ids.length;
//       total += ids.reduce((s, id) => s + (MEALS_DATA.find(m => m.id === id)?.price || 0), 0);
//     });
//     if (count === 0) return "Select Meal";
//     return `${count} Meal${count > 1 ? "s" : ""} • ${INR(total)}`;
//   };

//   const getBaggageLabel = (pId) => {
//     const allSegs = baggageSelections[pId] || {};
//     let count = 0, total = 0;
//     Object.values(allSegs).forEach(seg => {
//       const ids = Object.entries(seg).filter(([, v]) => v).map(([k]) => k);
//       count += ids.length;
//       total += ids.reduce((s, id) => {
//         const item = BAGGAGE_DATA.find(b => b.id === id);
//         return s + (item?.price || 0);
//       }, 0);
//     });
//     if (count === 0) return "Select Baggage";
//     // e.g. "3KG• ₹1800"
//     const kgStr = BAGGAGE_DATA
//       .filter(b => baggageSelections[pId]?.[activeSeg]?.[b.id] && b.name)
//       .map(b => b.name.replace("Additional ", ""))
//       .join(", ");
//     return kgStr ? `${kgStr}• ${INR(total)}` : "Select Baggage";
//   };

//   return (
//     <>
//       <style>{`
//         @media (max-width: 820px) {
//           .mb-page-grid { grid-template-columns: 1fr !important; }
//           .mb-right-col { order: -1; }
//           .mb-item-grid-inner { grid-template-columns: 1fr !important; }
//           .mb-item-grid-inner > div:first-child { border-right: none !important; border-bottom: 1px dashed #f0f0f0 !important; }
//         }
//         @media (max-width: 520px) {
//           .mb-seg-tab { font-size: 12px !important; padding: 6px 10px !important; }
//           .mb-pax-strip { gap: 8px !important; }
//           .mb-pax-btn { min-width: 90px !important; padding: 8px 10px !important; }
//         }
//       `}</style>

//       <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#f0f4fa", minHeight: "100vh", padding: "24px 16px 60px" }}>
//         <div style={{
//           maxWidth: 1200,
//           margin: "0 auto",
//           display: "grid",
//           gridTemplateColumns: "1fr 290px",
//           gap: 20,
//           alignItems: "start",
//         }} className="mb-page-grid">

//           {/* ════════════════════════════════════════════
//               LEFT — Main card
//           ════════════════════════════════════════════ */}
//           <div style={{
//             background: "#fff",
//             borderRadius: 16,
//             boxShadow: "0 1px 8px rgba(0,0,0,.07)",
//             overflow: "hidden",
//           }}>
//             {/* ── Top tabs bar ── */}
//             <div style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "0 24px",
//               borderBottom: "1px solid #f3f4f6",
//             }}>
//               <div style={{ display: "flex", gap: 0 }}>
//                 {[
//                   { key: "meals",   label: "MEALS"   },
//                   { key: "baggage", label: "BAGGAGE" },
//                 ].map(({ key, label }) => {
//                   const isOn = activeTab === key;
//                   return (
//                     <button
//                       key={key}
//                       onClick={() => setActiveTab(key)}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 7,
//                         padding: "16px 20px",
//                         background: "none",
//                         border: "none",
//                         borderBottom: isOn ? "2.5px solid #16a34a" : "2.5px solid transparent",
//                         color: isOn ? "#16a34a" : "#6b7280",
//                         fontWeight: isOn ? 700 : 500,
//                         fontSize: 14,
//                         cursor: "pointer",
//                         fontFamily: "inherit",
//                         letterSpacing: 0.4,
//                         transition: "color .15s",
//                         marginBottom: -1,
//                       }}
//                     >
//                       {key === "meals" ? <MealsIcon active={isOn} /> : <BaggageIcon active={isOn} />}
//                       {label}
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* Skip to Seat Selection */}
//               <button style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 4,
//                 background: "none",
//                 border: "none",
//                 color: "#16a34a",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 fontFamily: "inherit",
//               }}>
//                 Skip to Seat Selection <ChevronRight />
//               </button>
//             </div>

//             {/* ── Content area ── */}
//             <div style={{ padding: "20px 24px 16px" }}>

//               {/* Segment pill tabs */}
//               <SegmentTabs
//                 segments={SEGMENTS}
//                 activeSegId={activeSeg}
//                 onSelect={setActiveSeg}
//               />

//               {/* Item grid */}
//               {activeTab === "meals" ? (
//                 <ItemGrid
//                   items={MEALS_DATA}
//                   selections={currentMeals}
//                   onToggle={toggleMeal}
//                   type="meals"
//                 />
//               ) : (
//                 <ItemGrid
//                   items={BAGGAGE_DATA.filter(b => b.name)} // skip null placeholders
//                   selections={currentBaggage}
//                   onToggle={toggleBaggage}
//                   type="baggage"
//                 />
//               )}

//               {/* Divider */}
//               <div style={{ height: 1, background: "#f3f4f6", margin: "8px 0 14px" }} />

//               {/* Passenger selector strip */}
//               <PassengerStrip
//                 passengers={PASSENGERS}
//                 activeId={activePassenger}
//                 onSelect={setActivePassenger}
//                 getLabel={activeTab === "meals" ? getMealLabel : getBaggageLabel}
//               />
//             </div>
//           </div>

//           {/* ════════════════════════════════════════════
//               RIGHT — Fare Summary (sticky)
//           ════════════════════════════════════════════ */}
//           <div className="mb-right-col">
//             <FareSummaryCard summary={FARE_SUMMARY} />
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }


import { useState } from "react";

// ─── SVG Icon Components ───────────────────────────────────────────────────────

const PlaneIcon = ({ size = 20 }) => (
  <img src="/bookflighticon.svg" width={size} height={size} alt="plane" />
);

const BagIcon1 = ({ size = 22 }) => (
  <img src="/images/bag1.png" width={size} height={size} alt="hotel" />
);

const BagIcon2 = ({ size = 22 }) => (
  <img src="/images/bag2.png" width={size} height={size} alt="bus" />
);

const BagIcon3 = ({ size = 22 }) => (
  <img src="/images/bag3.png" width={size} height={size} alt="train" />
);

const BagIcon4 = ({ size = 18 }) => (
  <img src="/images/bag4.png" width={size} height={size} alt="offers" />
);

const BagIcon5 = ({ size = 18 }) => (
  <img src="/images/bag5.png" width={size} height={size} alt="support" />
);

const BagIcon6 = ({ size = 18 }) => (
  <img src="/images/bag6.png" width={size} height={size} alt="user" />
);

const MealIcon = ({ size = 20 }) => (
  <img src="/mealsIcon.svg" width={size} height={size} alt="meal" />
);

const BaggageIcon = ({ size = 20 }) => (
  <img src="/baggageIcon.svg" width={size} height={size} alt="baggage" />
);

// ─── Data ──────────────────────────────────────────────────────────────────────

const baggageOptions = [
  { id: "b3", label: "Additional 3 KG", price: 1800, icon: <BagIcon1 /> },
  { id: "b5", label: "Additional 5 KG", price: 2750, icon: <BagIcon2  /> },
  { id: "b10", label: "Additional 10 KG", price: 4500, icon: <BagIcon3 /> },
  { id: "b15", label: "Additional 15 KG", price: 6750, icon: < BagIcon4 /> },
  { id: "b20", label: "Additional 20 KG", price: 12000, icon: <BagIcon5 /> },
  { id: "b30", label: "Additional 30 KG", price: 18000, icon: < BagIcon6/> },
];

const mealOptions = [
  { id: "m1", label: "Tropical Berry Smoothie", price: 300 },
  { id: "m2", label: "Choco-Banana Bliss", price: 330 },
  { id: "m3", label: "Chocolate Mint Shake", price: 350 },
  { id: "m4", label: "Strawberry Dream Shake", price: 290 },
  { id: "m5", label: "Vanilla Almond Delight", price: 280 },
  { id: "m6", label: "Peanut Butter Energy Shake", price: 360 },
  { id: "m7", label: "Coconut Bliss Shake", price: 320 },
  { id: "m8", label: "Mango Coconut Fusion", price: 310 },
];

const travellers = [
  { id: "t1", name: "Shivam C" },
  { id: "t2", name: "Rahul M" },
  { id: "t3", name: "Donke" },
];

const routes = ["DEL - NAG", "NAG - BOM"];

// ─── Main Component ────────────────────────────────────────────────────────────

export default function DealplexBooking() {
  const [activeTab, setActiveTab] = useState("MEALS");
  const [activeRoute, setActiveRoute] = useState(0);
  const [activeTraveller, setActiveTraveller] = useState("t2");

  // per traveller, per route selections
  const [mealSelections, setMealSelections] = useState({});   // key: `${tid}-${ri}`
  const [bagSelections, setBagSelections] = useState({});     // key: `${tid}-${ri}`

  const selKey = (tid, ri) => `${tid}-${ri}`;

  const handleAddMeal = (mealId) => {
    const k = selKey(activeTraveller, activeRoute);
    setMealSelections(prev => ({
      ...prev,
      [k]: prev[k] === mealId ? null : mealId,
    }));
  };

  const handleAddBag = (bagId) => {
    const k = selKey(activeTraveller, activeRoute);
    setBagSelections(prev => ({
      ...prev,
      [k]: prev[k] === bagId ? null : bagId,
    }));
  };

  const getTravellerMealSummary = (tid) => {
    let totalPrice = 0;
    let count = 0;
    routes.forEach((_, ri) => {
      const k = selKey(tid, ri);
      if (mealSelections[k]) {
        const meal = mealOptions.find(m => m.id === mealSelections[k]);
        if (meal) { totalPrice += meal.price; count++; }
      }
    });
    if (count === 0) return null;
    return `${count} Meal${count > 1 ? "s" : ""} • ₹${totalPrice}`;
  };

  const getTravellerBagSummary = (tid) => {
    let totalPrice = 0;
    let totalKg = 0;
    routes.forEach((_, ri) => {
      const k = selKey(tid, ri);
      if (bagSelections[k]) {
        const bag = baggageOptions.find(b => b.id === bagSelections[k]);
        if (bag) {
          totalPrice += bag.price;
          const kg = parseInt(bag.label.match(/\d+/)[0]);
          totalKg += kg;
        }
      }
    });
    if (totalPrice === 0) return null;
    return `${totalKg}KG • ₹${totalPrice}`;
  };

  const getAddedExtras = () => {
    let extra = 0;
    travellers.forEach(t => {
      routes.forEach((_, ri) => {
        const mk = selKey(t.id, ri);
        if (mealSelections[mk]) {
          const m = mealOptions.find(x => x.id === mealSelections[mk]);
          if (m) extra += m.price;
        }
        if (bagSelections[mk]) {
          const b = baggageOptions.find(x => x.id === bagSelections[mk]);
          if (b) extra += b.price;
        }
      });
    });
    return extra;
  };

  const baseAmount = 17945;
  const totalPayable = baseAmount + getAddedExtras();

  // ─── Styles ─────────────────────────────────────────────────────────────────

  const styles = {
    global: `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f6fa; }
      @media (max-width: 768px) {
        .dp-layout { flex-direction: column !important; }
        .dp-sidebar { width: 100% !important; }
        .dp-grid-2 { grid-template-columns: 1fr !important; }
        .dp-nav-links { display: none !important; }
      }
      @media (max-width: 480px) {
        .dp-traveller-bar { flex-wrap: wrap !important; gap: 6px !important; }
        .dp-traveller-card { min-width: 130px !important; }
      }
    `,

    page: {
      minHeight: "100vh",
      background: "#f5f6fa",
    },

   

    logo: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      textDecoration: "none",
    },

    logoSvg: {
      width: 42,
      height: 42,
    },

    logoText: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#1a1a2e",
      letterSpacing: "-0.5px",
    },

    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },

    navItem: (active) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "6px 16px",
      cursor: "pointer",
      borderRadius: "8px",
      transition: "background 0.15s",
      textDecoration: "none",
    }),

    navLabel: (active) => ({
      fontSize: "13px",
      fontWeight: active ? "600" : "400",
      color: active ? "#1a7c4f" : "#555",
      marginTop: "3px",
    }),

    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },

    navTextBtn: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px",
      color: "#555",
      cursor: "pointer",
      padding: "6px 8px",
      borderRadius: "6px",
      transition: "background 0.15s",
      background: "none",
      border: "none",
    },

    manageBooking: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
    },

    manageText: {
      fontSize: "13px",
      color: "#555",
    },

    manageTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1a1a2e",
    },

    loginBtn: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 18px",
      border: "1.5px solid #1a7c4f",
      borderRadius: "20px",
      color: "#1a7c4f",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      background: "#fff",
      transition: "all 0.15s",
    },

    body: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "24px 20px",
    },

    layout: {
      display: "flex",
      gap: "20px",
      alignItems: "flex-start",
    },

    mainCard: {
      flex: 1,
      background: "#fff",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      minWidth: 0,
    },

    tabBar: {
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #eee",
      padding: "0 24px",
      gap: "0",
      position: "relative",
    },

    tabBtn: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "16px 20px 14px",
      cursor: "pointer",
      border: "none",
      background: "none",
      fontSize: "15px",
      fontWeight: active ? "600" : "500",
      color: active ? "#1a7c4f" : "#666",
      borderBottom: active ? "2.5px solid #1a7c4f" : "2.5px solid transparent",
      marginBottom: "-1px",
      transition: "all 0.15s",
      letterSpacing: "0.3px",
    }),

    skipBtn: {
      marginLeft: "auto",
      color: "#1a7c4f",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      background: "none",
      border: "none",
      padding: "8px 0",
    },

    routeBar: {
      display: "flex",
      gap: "10px",
      padding: "16px 24px",
      borderBottom: "1px solid #f0f0f0",
    },

    routeBtn: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "7px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
      border: "none",
      background: active ? "#1a7c4f" : "#f0f0f0",
      color: active ? "#fff" : "#555",
      transition: "all 0.15s",
    }),

    contentArea: {
      padding: "20px 24px",
    },

    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },

    optionRow: (selected) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 0",
      borderBottom: "1px dashed #f0f0f0",
      gap: "10px",
      background: selected ? "rgba(26,124,79,0.04)" : "transparent",
      borderRadius: selected ? "8px" : "0",
      paddingLeft: selected ? "8px" : "0",
      paddingRight: selected ? "8px" : "0",
      transition: "all 0.15s",
    }),

    optionLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: 1,
    },

    optionLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1a1a2e",
    },

    optionPrice: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#333",
    },

    addBtn: (selected) => ({
      padding: "7px 22px",
      borderRadius: "6px",
      border: selected ? "none" : "1.5px solid #ccc",
      background: selected ? "#1a7c4f" : "#fff",
      color: selected ? "#fff" : "#333",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      minWidth: "72px",
      transition: "all 0.15s",
      whiteSpace: "nowrap",
    }),

    travellerBar: {
      display: "flex",
      gap: "10px",
      padding: "16px 24px 20px",
      borderTop: "1px solid #f0f0f0",
      overflowX: "auto",
    },

    travellerCard: (active) => ({
      padding: "10px 16px",
      borderRadius: "8px",
      border: active ? "2px solid #1a7c4f" : "1.5px solid #e0e0e0",
      cursor: "pointer",
      minWidth: "140px",
      background: "#fff",
      transition: "all 0.15s",
    }),

    travellerName: (active) => ({
      fontSize: "14px",
      fontWeight: "600",
      color: active ? "#1a7c4f" : "#1a1a2e",
      marginBottom: "3px",
    }),

    travellerSub: {
      fontSize: "12px",
      color: "#888",
    },

    sidebar: {
      width: "300px",
      flexShrink: 0,
    },

    fareCard: {
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    },

    fareTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },

    fareTitleText: {
      fontSize: "17px",
      fontWeight: "700",
      color: "#1a1a2e",
    },

    travellerCount: {
      fontSize: "13px",
      color: "#888",
    },

    fareRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid #f5f5f5",
    },

    fareLabel: {
      fontSize: "14px",
      color: "#555",
    },

    fareValue: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1a1a2e",
    },

    fareTypeRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid #f5f5f5",
    },

    partialTag: {
      fontSize: "13px",
      color: "#1a7c4f",
      fontWeight: "600",
    },

    netRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0 4px",
    },

    netLabel: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#1a1a2e",
    },

    netValue: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#1a1a2e",
    },

    proceedBtn: {
      width: "100%",
      marginTop: "16px",
      padding: "13px",
      background: "linear-gradient(135deg, #1a7c4f 0%, #22a866 100%)",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
      letterSpacing: "0.3px",
      transition: "opacity 0.15s",
    },

    extrasBadge: {
      marginTop: "10px",
      background: "#f0faf5",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "13px",
      color: "#1a7c4f",
      fontWeight: "500",
      display: "flex",
      justifyContent: "space-between",
    },
  };

  const currentSelMeal = mealSelections[selKey(activeTraveller, activeRoute)];
  const currentSelBag = bagSelections[selKey(activeTraveller, activeRoute)];
  const extras = getAddedExtras();

  return (
    <div style={styles.page}>
      <style>{styles.global}</style>

      

      {/* ── Body ────────────────────────────────────────────────── */}
      <div style={styles.body}>
        <div style={styles.layout} className="dp-layout">

          {/* Main Card */}
          <div style={styles.mainCard}>

            {/* Tabs */}
            <div style={styles.tabBar}>
              <button
                style={styles.tabBtn(activeTab === "MEALS")}
                onClick={() => setActiveTab("MEALS")}
              >
                <MealIcon size={18} color={activeTab === "MEALS" ? "#1a7c4f" : "#666"} />
                MEALS
              </button>
              <button
                style={styles.tabBtn(activeTab === "BAGGAGE")}
                onClick={() => setActiveTab("BAGGAGE")}
              >
                <BaggageIcon size={18} color={activeTab === "BAGGAGE" ? "#1a7c4f" : "#666"} />
                BAGGAGE
              </button>
              <button style={styles.skipBtn}>
                Skip to Seat Selection &nbsp;›
              </button>
            </div>

            {/* Route Selector */}
            <div style={styles.routeBar}>
              {routes.map((r, i) => (
                <button
                  key={r}
                  style={styles.routeBtn(activeRoute === i)}
                  onClick={() => setActiveRoute(i)}
                >
                  <img
  src="/bookflighticon.svg"
  width="14"
  height="14"
  alt="plane"
  style={{
    filter: activeRoute === i
      ? "invert(1)"
      : "invert(0.3)"
  }}
/>
                  {r}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={styles.contentArea}>
              {activeTab === "MEALS" ? (
                <div style={styles.grid2} className="dp-grid-2">
                  {mealOptions.map(meal => {
                    const selected = currentSelMeal === meal.id;
                    return (
                      <div key={meal.id} style={styles.optionRow(selected)}>
                        <div style={styles.optionLeft}>
                          <div>
                            <div style={styles.optionLabel}>{meal.label}</div>
                            <div style={styles.optionPrice}>₹{meal.price}</div>
                          </div>
                        </div>
                        <button
                          style={styles.addBtn(selected)}
                          onClick={() => handleAddMeal(meal.id)}
                        >
                          {selected ? "✓ Added" : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={styles.grid2} className="dp-grid-2">
                  {baggageOptions.map(bag => {
                    const selected = currentSelBag === bag.id;
                    return (
                      <div key={bag.id} style={styles.optionRow(selected)}>
                        <div style={styles.optionLeft}>
                          {bag.icon}
                          <div>
                            <div style={styles.optionLabel}>{bag.label}</div>
                            <div style={styles.optionPrice}>₹{bag.price.toLocaleString("en-IN")}</div>
                          </div>
                        </div>
                        <button
                          style={styles.addBtn(selected)}
                          onClick={() => handleAddBag(bag.id)}
                        >
                          {selected ? "✓ Added" : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Traveller Bar */}
            <div style={styles.travellerBar} className="dp-traveller-bar">
              {travellers.map(t => {
                const mealSum = getTravellerMealSummary(t.id);
                const bagSum = getTravellerBagSummary(t.id);
                const summary = activeTab === "MEALS" ? mealSum : bagSum;
                return (
                  <div
                    key={t.id}
                    style={styles.travellerCard(activeTraveller === t.id)}
                    className="dp-traveller-card"
                    onClick={() => setActiveTraveller(t.id)}
                  >
                    <div style={styles.travellerName(activeTraveller === t.id)}>{t.name}</div>
                    <div style={styles.travellerSub}>
                      {summary
                        ? summary
                        : (activeTab === "MEALS" ? "Select Meal" : "Select Baggage")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar} className="dp-sidebar">
            <div style={styles.fareCard}>
              <div style={styles.fareTitle}>
                <span style={styles.fareTitleText}>Fare Summary</span>
                <span style={styles.travellerCount}>4 Traveller</span>
              </div>

              <div style={styles.fareTypeRow}>
                <span style={styles.fareLabel}>Fare Type</span>
                <span style={styles.partialTag}>Partial Refundable</span>
              </div>

              {[
                { label: "Adult x 2", value: "₹8,666" },
                { label: "Child x 1", value: "₹4,333" },
                { label: "Infant x 1", value: "₹2,000" },
                { label: "Taxes & Fees", value: "₹2,946" },
              ].map(row => (
                <div key={row.label} style={styles.fareRow}>
                  <span style={styles.fareLabel}>{row.label}</span>
                  <span style={styles.fareValue}>{row.value}</span>
                </div>
              ))}

              {extras > 0 && (
                <div style={styles.extrasBadge}>
                  <span>Add-ons</span>
                  <span>+₹{extras.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div style={styles.netRow}>
                <span style={styles.netLabel}>Net Amount Payable</span>
                <span style={styles.netValue}>₹{totalPayable.toLocaleString("en-IN")}</span>
              </div>

              <button style={styles.proceedBtn}>
                Proceed to Seat Selection
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}