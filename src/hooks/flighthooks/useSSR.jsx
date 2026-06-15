import { useState, useCallback } from "react";
import { flightFetch, FLIGHT_ENDPOINTS } from "../../api/flightApi";

export function useSSR() {
  const [onwardSSR, setOnwardSSR] = useState(null);
  const [returnSSR, setReturnSSR] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSSR = useCallback(
    async ({ traceId, onwardResultIndex, returnResultIndex }) => {
      setLoading(true);
      setError(null);
      setOnwardSSR(null);
      setReturnSSR(null);

      try {
        // Onward SSR
        const onwardRes = await flightFetch(FLIGHT_ENDPOINTS.SSR, {
          method: "POST",
          body: { TraceId: traceId, ResultIndex: onwardResultIndex },
        });

        if (onwardRes?.success) {
          setOnwardSSR(onwardRes.data);
        } else {
          setError("Failed to fetch SSR data");
        }

        // Return SSR (only for round trip)
        if (returnResultIndex) {
          const returnRes = await flightFetch(FLIGHT_ENDPOINTS.SSR, {
            method: "POST",
            body: { TraceId: traceId, ResultIndex: returnResultIndex },
          });

          if (returnRes?.success) {
            setReturnSSR(returnRes.data);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { onwardSSR, returnSSR, loading, error, fetchSSR };
}