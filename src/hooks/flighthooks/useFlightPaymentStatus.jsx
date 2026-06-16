// src/hooks/flighthooks/useFlightPaymentStatus.js
import { useState, useCallback, useEffect } from "react";
import { flightFetch } from "../../api/flightApi";

export function useFlightPaymentStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const checkPaymentStatus = useCallback(async (traceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await flightFetch(
        "/api/flightv2/payment/status/",
        {
          method: "POST",
          body: { trace_id: traceId },
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Status check failed");
      }

      setStatus(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling function
  const startPolling = useCallback((traceId, interval = 2000, maxAttempts = 180) => {
    setIsPolling(true);
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setIsPolling(false);
        setStatus((prev) => ({ ...prev, status: "EXPIRED" }));
        return;
      }

      try {
        const data = await checkPaymentStatus(traceId);

        if (
          data.status === "SUCCESS" ||
          data.status === "FAILED" ||
          data.status === "EXPIRED"
        ) {
          setIsPolling(false);
          return data;
        }

        attempts++;
        setTimeout(poll, interval);
      } catch (err) {
        console.error("Polling error:", err);
        attempts++;
        setTimeout(poll, interval);
      }
    };

    poll();
  }, [checkPaymentStatus]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    status,
    loading,
    error,
    isPolling,
    checkPaymentStatus,
    startPolling,
    stopPolling,
  };
}