import { useState, useCallback } from "react";
import { flightFetch } from "../../api/flightApi";

export function useFlightBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bookFlight = useCallback(async (bookingPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await flightFetch("/api/flightv2/book/", {
        method: "POST",
        body: bookingPayload,
      });

      if (!response.success) {
        // response.error.message pakdo — jaise bus wale mein hai
        const errMsg =
          response?.error?.message ||
          response?.message ||
          "Booking failed. Please try again.";
        const errCode = response?.error?.code || "";
        const err = new Error(errMsg);
        err.code = errCode;
        throw err;
      }

      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { bookFlight, loading, error };
}