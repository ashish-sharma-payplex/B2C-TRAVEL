import { useState, useCallback } from "react";
import { flightFetch, FLIGHT_ENDPOINTS } from "../../api/flightApi";

export function useFareRule() {
  const [onwardFareRule, setOnwardFareRule] = useState(null);
  const [returnFareRule, setReturnFareRule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFareRule = useCallback(async ({ traceId, onwardResultIndex, returnResultIndex }) => {
    setLoading(true);
    setError(null);
    setOnwardFareRule(null);
    setReturnFareRule(null);

    try {
      // Onward fare rule
      const onwardRes = await flightFetch(FLIGHT_ENDPOINTS.FARE_RULE, {
        method: "POST",
        body: {
          TraceId: traceId,
          ResultIndex: onwardResultIndex,
        },
      });

      if (onwardRes?.success) {
        setOnwardFareRule(onwardRes.data);
      }

      // Return fare rule (only for round trip)
      if (returnResultIndex) {
        const returnRes = await flightFetch(FLIGHT_ENDPOINTS.FARE_RULE, {
          method: "POST",
          body: {
            TraceId: traceId,
            ResultIndex: returnResultIndex,
          },
        });

        if (returnRes?.success) {
          setReturnFareRule(returnRes.data);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { onwardFareRule, returnFareRule, loading, error, fetchFareRule };
}