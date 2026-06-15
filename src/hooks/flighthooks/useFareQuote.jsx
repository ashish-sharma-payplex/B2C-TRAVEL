import { useState, useCallback } from "react";
import { flightFetch, FLIGHT_ENDPOINTS } from "../../api/flightApi";

export function useFareQuote() {
  const [onwardFareQuote, setOnwardFareQuote] = useState(null);
  const [returnFareQuote, setReturnFareQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFareQuote = useCallback(
    async ({ traceId, onwardResultIndex, returnResultIndex }) => {
      setLoading(true);
      setError(null);
      setOnwardFareQuote(null);
      setReturnFareQuote(null);

      try {
        // Onward fare quote
        const onwardRes = await flightFetch(FLIGHT_ENDPOINTS.FARE_QUOTE, {
          method: "POST",
          body: {
            TraceId: traceId,
            ResultIndex: onwardResultIndex,
          },
        });

        if (onwardRes?.success) {
          setOnwardFareQuote(onwardRes.data);
        }

        // Return fare quote (only for round trip)
        if (returnResultIndex) {
          const returnRes = await flightFetch(FLIGHT_ENDPOINTS.FARE_QUOTE, {
            method: "POST",
            body: {
              TraceId: traceId,
              ResultIndex: returnResultIndex,
            },
          });

          if (returnRes?.success) {
            setReturnFareQuote(returnRes.data);
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

  return { onwardFareQuote, returnFareQuote, loading, error, fetchFareQuote };
}
