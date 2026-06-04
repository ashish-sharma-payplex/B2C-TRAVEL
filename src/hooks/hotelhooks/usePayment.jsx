import { useState, useCallback, useRef } from "react";
import { hotelFetch } from "../../api/hotelApi";

export function usePayment() {
  const [initiating, setInitiating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const pollingRef = useRef(null);
  const prebookIdRef = useRef(null);
  const expiryMsRef = useRef(null); // ✅ expiry track karo polling ke liye

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // ✅ Client-side se directly EXPIRED set karo — polling ka wait nahi
  const handleClientExpiry = useCallback(() => {
    setPaymentStatus((prev) => {
      // Sirf tab set karo jab abhi bhi PENDING hai
      if (prev === "PENDING") {
        stopPolling();
        return "EXPIRED";
      }
      return prev;
    });
  }, [stopPolling]);

  const startPolling = useCallback(
    (prebookId, expiryMs) => {
      stopPolling();
      prebookIdRef.current = String(prebookId);
      expiryMsRef.current = expiryMs ?? null;

      const poll = async () => {
        // ✅ Client side pe already expired check — polling band karo
        if (expiryMsRef.current && Date.now() > expiryMsRef.current + 5000) {
          stopPolling();
          return;
        }

        try {
          const res = await hotelFetch("/api/hotelv2/payment/status/", {
            body: { prebookId: prebookIdRef.current },
          });
          const rawStatus = res?.data?.txnStatus ?? res?.data?.status ?? null;
          if (rawStatus) {
            const upper = rawStatus.toUpperCase();
            const normalized = upper === "FAIL" ? "FAILED" : upper;
            setPaymentStatus(normalized);
            if (["SUCCESS", "FAILED", "EXPIRED", "CANCELLED"].includes(normalized)) {
              stopPolling();
            }
          }
        } catch (err) {
          console.warn("[poll error]", err.message);
        }
      };

      // ✅ Adaptive polling — last 60 sec mein faster poll
      const getInterval = () => {
        if (!expiryMsRef.current) return 3000;
        const remaining = expiryMsRef.current - Date.now();
        if (remaining < 60000) return 2000; // last 1 min → 2 sec
        return 3000;
      };

      poll(); // immediate first poll

      // ✅ Smart interval — check karta rahe aur adjust kare
      const scheduleNext = () => {
        pollingRef.current = setTimeout(async () => {
          await poll();
          if (pollingRef.current !== null) scheduleNext(); // next schedule
        }, getInterval());
      };

      scheduleNext();
    },
    [stopPolling],
  );

  const initiatePayment = useCallback(
    async (prebookId, { onSuccess } = {}) => {
      setInitiating(true);
      setError(null);
      setPaymentData(null);
      setPaymentStatus("PENDING");
      setResetKey((k) => k + 1);
      stopPolling();
      prebookIdRef.current = String(prebookId);

      try {
        const result = await hotelFetch("/api/hotelv2/payment/initiate/", {
          body: { prebookId: String(prebookId) },
        });
        const data = result?.data ?? result;
        const dataWithTs = { ...data, _ts: Date.now() };

        // ✅ Expiry parse karke ref mein store karo
        if (data.expiryDate) {
          const rawExpiry = data.expiryDate.includes("Z") || data.expiryDate.includes("+")
            ? new Date(data.expiryDate).getTime()
            : new Date(data.expiryDate.replace(" ", "T") + "+05:30").getTime();
          expiryMsRef.current = rawExpiry - 3000; // same buffer as countdown
        }

        setPaymentData(dataWithTs);
        setPaymentStatus("PENDING");
        startPolling(prebookId, expiryMsRef.current);
        if (onSuccess) onSuccess(dataWithTs);
        return dataWithTs;
      } catch (err) {
        setError(err.message ?? "Payment initiation failed.");
        throw err;
      } finally {
        setInitiating(false);
      }
    },
    [startPolling, stopPolling],
  );

  const cancelPayment = useCallback(
    async (prebookId) => {
      if (!prebookId) return;
      setCancelling(true);
      stopPolling();
      try {
        await hotelFetch("/api/hotelv2/payment/cancel/", {
          body: { prebookId: String(prebookId) },
        });
        setPaymentStatus("CANCELLED");
      } catch (err) {
        console.warn("[cancel error]", err.message);
        setPaymentStatus("CANCELLED");
      } finally {
        setCancelling(false);
      }
    },
    [stopPolling],
  );

  return {
    initiatePayment,
    cancelPayment,
    stopPolling,
    handleClientExpiry, // ✅ export karo
    paymentData,
    paymentStatus,
    initiating,
    cancelling,
    error,
    resetKey,
  };
}