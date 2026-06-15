import { useState, useCallback } from "react";
import { flightFetch, FLIGHT_ENDPOINTS } from "../../api/flightApi";

export function useSSR() {
  const [ssrData, setSsrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSSR = useCallback(async ({ traceId, resultIndex }) => {
    setLoading(true);
    setError(null);
    setSsrData(null);
    try {
      const res = await flightFetch(FLIGHT_ENDPOINTS.SSR, {
        method: "POST",
        body: { TraceId: traceId, ResultIndex: resultIndex },
      });
      if (res?.success) {
        setSsrData(res.data);
      } else {
        setError("Failed to fetch SSR data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { ssrData, loading, error, fetchSSR };
}
