// src/hooks/flighthooks/useFlightBook.js
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
      // API ka actual error object use karo
      const errMsg =
        response.error?.message ||   // { "error": { "message": "..." } }
        response.message ||
        "Booking failed";
      throw new Error(errMsg);
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