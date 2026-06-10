import { useState, useCallback } from "react";
import { FLIGHT_ENDPOINTS, flightFetch } from "../../api/flightApi";

// FlightCabinClass mapping
// 1 = Economy, 2 = Premium Economy, 3 = Business, 4 = First Class
const CABIN_CLASS_MAP = {
  Economy: 1,
  "Premium Economy": 2,
  Business: 3,
  "First Class": 4,
};

function formatDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  // "2026-06-22T00:00:00"
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
}

export function useFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const searchFlights = useCallback(async ({
    fromCity,
    toCity,
    departureDate,
    returnDate,
    passengers,
    cabinClass,
    tripType, // "oneway" | "roundtrip"
  }) => {
    setLoading(true);
    setError(null);
    setResults(null);

    const cabinClassNum = CABIN_CLASS_MAP[cabinClass] ?? 1;
    const journeyType = tripType === "roundtrip" ? "2" : "1";
    const depTime = formatDateTime(departureDate);

    let payload;

    if (journeyType === "1") {
      // One-way
      payload = {
        AdultCount: String(passengers.adults),
        ChildCount: String(passengers.children),
        InfantCount: String(passengers.infants),
        DirectFlight: "false",
        OneStopFlight: "false",
        JourneyType: "1",
        Segments: [
          {
            Origin: fromCity.code,
            Destination: toCity.code,
            FlightCabinClass: cabinClassNum,
            PreferredDepartureTime: depTime,
            PreferredArrivalTime: depTime,
          },
        ],
      };
    } else {
      // Round-trip
      const retTime = formatDateTime(returnDate);
      payload = {
        AdultCount: String(passengers.adults),
        ChildCount: String(passengers.children),
        InfantCount: String(passengers.infants),
        DirectFlight: "false",
        OneStopFlight: "false",
        JourneyType: "2",
        PreferredAirlines: null,
        Segments: [
          {
            Origin: fromCity.code,
            Destination: toCity.code,
            FlightCabinClass: String(cabinClassNum),
            PreferredDepartureTime: depTime,
            PreferredArrivalTime: depTime,
          },
          {
            Origin: toCity.code,
            Destination: fromCity.code,
            FlightCabinClass: String(cabinClassNum),
            PreferredDepartureTime: retTime,
            PreferredArrivalTime: retTime,
          },
        ],
        Sources: null,
      };
    }

    try {
      const data = await flightFetch(FLIGHT_ENDPOINTS.SEARCH, {
        method: "POST",
        body: payload,
      });
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message);
      return { success: false, error: { message: err.message } };
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchFlights, loading, error, results };
}