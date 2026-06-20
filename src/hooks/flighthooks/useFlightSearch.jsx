// ─── useFlightSearch.js ───────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { flightFetch, FLIGHT_ENDPOINTS } from "../../api/flightApi";

const CABIN_CLASS_MAP = {
  Economy: 1,
  "Premium Economy": 2,
  Business: 3,
  "First Class": 4,
};

const SEARCH_TIMEOUT_MS = 45000;

function formatSegmentDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
}

function withTimeout(promise, ms, errorMsg = "Request timed out") {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMsg)), ms),
    ),
  ]);
}

// ── Normalize API response into consistent shape ──────────────────────────────
// Returns: { onwardFlights, returnFlights, isRoundTrip, onwardMeta, returnMeta }
// Case 1: Old format  → data.results.Results (flat array, one-way)
// Case 2: New format  → data.Outbound + data.Inbound (round trip)
// Case 3: New format  → data.Outbound + Inbound: null (one-way)
export function normalizeFlightResponse(data) {
  if (!data)
    return {
      onwardFlights: [],
      returnFlights: [],
      isRoundTrip: false,
      onwardMeta: null,
      returnMeta: null,
    };

  // New format
  if (data.Outbound !== undefined) {
    const outbound = data.Outbound?.results || [];
    const inbound  = data.Inbound?.results  || [];
    const isRoundTrip = !!data.Inbound;

    return {
      onwardFlights: outbound,
      returnFlights: inbound,
      isRoundTrip,
      onwardMeta: data.Outbound
        ? {
            count: data.Outbound.count,
            page: data.Outbound.page,
            pageSize: data.Outbound.page_size,
            next: data.Outbound.next,
          }
        : null,
      returnMeta: data.Inbound
        ? {
            count: data.Inbound.count,
            page: data.Inbound.page,
            pageSize: data.Inbound.page_size,
            next: data.Inbound.next,
          }
        : null,
    };
  }

  // Old format
  const flat = data.results?.Results || [];
  return {
    onwardFlights: flat,
    returnFlights: [],
    isRoundTrip: false,
    onwardMeta: null,
    returnMeta: null,
  };
}

export function useFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const searchFlights = useCallback(
    async ({
      fromCity,
      toCity,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
      tripType,
      
      outboundPage      = 1,
      outboundPageSize  = 20,
      inboundPage       = 1,
      inboundPageSize   = 20,
    }) => {
      setLoading(true);
      setError(null);

      try {
        const journeyType = tripType === "roundtrip" ? 2 : 1;
        const cabinCode   = CABIN_CLASS_MAP[cabinClass] || 1;
        const depDate     = formatSegmentDate(departureDate);

        const segments = [
          {
            Origin: fromCity.code,
            Destination: toCity.code,
            FlightCabinClass: cabinCode,
            PreferredDepartureTime: depDate,
            PreferredArrivalTime: depDate,
          },
        ];

        if (tripType === "roundtrip" && returnDate) {
          const retDate = formatSegmentDate(returnDate);
          segments.push({
            Origin: toCity.code,
            Destination: fromCity.code,
            FlightCabinClass: cabinCode,
            PreferredDepartureTime: retDate,
            PreferredArrivalTime: retDate,
          });
        }

        const body = {
          EndUserIp:        "192.168.10.10",
          TokenId:          "ac2751e9-4cc3-406f-b678-c947e4f57a00",
          AdultCount:       String(passengers.adults   || 1),
          ChildCount:       String(passengers.children || 0),
          InfantCount:      String(passengers.infants  || 0),
          DirectFlight:     "false",
          OneStopFlight:    "false",
          JourneyType:      journeyType,
          PreferredAirlines: [],
          Segments:         segments,
          Sources:          [],
          // ── New pagination params ──
          outbound_page:      outboundPage,
          outbound_page_size: outboundPageSize,
          inbound_page:       inboundPage,
          inbound_page_size:  inboundPageSize,
        };

        const result = await withTimeout(
          flightFetch(FLIGHT_ENDPOINTS.SEARCH, { method: "POST", body }),
          SEARCH_TIMEOUT_MS,
          "Flight search timed out. Please try again.",
        );

        return result;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { searchFlights, loading, error };
}