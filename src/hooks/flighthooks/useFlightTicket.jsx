// src/hooks/flighthooks/useFlightTicket.js
import { useState, useCallback } from "react";
import { flightFetch } from "../../api/flightApi";

export function useFlightTicket() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTicket = useCallback(async (ticketPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await flightFetch("/api/flightv2/ticket/", {
        method: "POST",
        body: ticketPayload,
      });

      if (!response.success) {
        throw new Error(response.message || "Ticket generation failed");
      }

      setTicket(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { ticket, loading, error, generateTicket };
}