import { useState, useCallback } from "react";
import { busFetch } from "../../api/busApi";

/**
 * useBusSeatLayout
 * - Seat layout POST API call karta hai
 * - Body: { trace_id, result_index }
 * - Same headers use hote hain jo baki hooks use karte hain (busFetch se)
 */
export function useBusSeatLayout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSeatLayout = useCallback(async ({ traceId, resultIndex }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await busFetch("/api/busv2/seat-layout/", {
        method: "POST",
        body: {
          trace_id: traceId,
          result_index: resultIndex,
        },
      });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchSeatLayout, loading, error };
}
