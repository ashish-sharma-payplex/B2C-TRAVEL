// src/hooks/flighthooks/useFlightPaymentInitiate.js
import { useState, useCallback } from "react";
import { flightFetch } from "../../api/flightApi";

export function useFlightPaymentInitiate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = useCallback(async (traceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await flightFetch(
        "/api/flightv2/payment/initiate/",
        {
          method: "POST",
          body: { trace_id: traceId },
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Payment initiation failed");
      }

      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { initiatePayment, loading, error };
}