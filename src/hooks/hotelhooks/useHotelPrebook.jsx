import { useState, useCallback } from "react";
import { hotelFetch } from "../api/hotelApi"; // adjust path as needed

/**
 * usePrebook hook
 * Calls POST /api/hotelv2/prebook/ with the given payload.
 *
 * Usage:
 *   const { prebook, loading, error, data } = usePrebook();
 *   await prebook({ searchId, BookingCode, passengers, paymentMode });
 */
export function usePrebook() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [data, setData]       = useState(null);

  /**
   * @param {object} opts
   * @param {number|string} opts.searchId
   * @param {string}        opts.BookingCode
   * @param {object[]}      opts.passengers      - array of HotelPassenger objects
   * @param {string}        [opts.paymentMode]   - default "Limit"
   */
  const prebook = useCallback(async ({ searchId, BookingCode, passengers, paymentMode = "Limit" }) => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        searchId,
        BookingCode,
        PaymentMode: paymentMode,
        HotelRoomsDetails: [
          {
            HotelPassenger: passengers,
          },
        ],
      };

      const result = await hotelFetch("/api/hotelv2/prebook/", { body });
      setData(result);
      return result;
    } catch (err) {
      setError(err.message ?? "Prebook failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { prebook, loading, error, data };
}