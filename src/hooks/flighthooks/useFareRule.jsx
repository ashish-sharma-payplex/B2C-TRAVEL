import { useState, useCallback } from "react";
import { flightFetch } from "../../api/flightApi"; 

/**
 * useFareRule
 *
 * POST /api/flightv2/fare-rule/
 * Body  : { TraceId: string, ResultIndex: string }
 * Shape : { success: true, message: string, data: { FareRules: [...] } }
 */

const FARE_RULE_ENDPOINT = "/api/flightv2/fare-rule/";

export function useFareRule() {
  const [fareRules, setFareRules] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const fetchFareRule = useCallback(async ({ traceId, resultIndex }) => {
    // Both values come from the search response via router state.
    // If either is missing the flight data wasn't passed correctly — surface that clearly.
    if (!traceId || !resultIndex) {
      setError("Could not load fare rules — flight data is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    setFareRules([]);

    try {
      const res = await flightFetch(FARE_RULE_ENDPOINT, {
        method: "POST",
        body: { TraceId: traceId, ResultIndex: resultIndex },
      });

      if (!res?.success) {
        throw new Error(res?.message || "Fare rule request failed.");
      }

      setFareRules(res?.data?.FareRules ?? []);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFareRules([]);
    setLoading(false);
    setError(null);
  }, []);

  return { fareRules, loading, error, fetchFareRule, reset };
}



// import { useState, useCallback } from "react";
// import { flightFetch } from "../../api/flightApi"; 

// // ─── Endpoint — corrected to match your API ───────────────────────────────────
// // POST https://travelmytrip.com/api/flightv2/fare-rule/
// const FARE_RULE_ENDPOINT = "/api/flightv2/fare-rule/";

// /**
//  * useFareRule
//  *
//  * Fetches fare-rule data for a specific flight result.
//  *
//  * API response shape:
//  * {
//  *   "success": true,
//  *   "message": "Fare rule fetched successfully",
//  *   "data": {
//  *     "FareRules": [ ...rule objects... ]
//  *   }
//  * }
//  *
//  * POST body:
//  * {
//  *   "TraceId": "<string>",
//  *   "ResultIndex": "<string>"
//  * }
//  *
//  * @returns {{
//  *   fareRules    : Array,           — data.FareRules from response ([] if empty)
//  *   loading      : boolean,
//  *   error        : string | null,
//  *   fetchFareRule: (params: { traceId: string, resultIndex: string }) => Promise<void>,
//  *   reset        : () => void,
//  * }}
//  *
//  * Usage:
//  *   const { fareRules, loading, error, fetchFareRule } = useFareRule();
//  *   fetchFareRule({ traceId: flight.TraceId, resultIndex: flight.ResultIndex });
//  */
// export function useFareRule() {
//   const [fareRules, setFareRules] = useState([]);
//   const [loading, setLoading]     = useState(false);
//   const [error, setError]         = useState(null);

//   const fetchFareRule = useCallback(async ({ traceId, resultIndex }) => {
//     // Guard — both fields are required by the API
//     if (!traceId || !resultIndex) {
//       setError("Flight data is incomplete. Please go back and select the flight again.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setFareRules([]);

//     try {
//       const response = await flightFetch(FARE_RULE_ENDPOINT, {
//         method: "POST",
//         body: {
//           TraceId: traceId,
//           ResultIndex: resultIndex,
//         },
//       });

//       // API-level failure — success: false
//       if (!response?.success) {
//         throw new Error(response?.message || "Failed to fetch fare rules.");
//       }

//       // Safely extract FareRules array from data object
//       const rules = response?.data?.FareRules ?? [];
//       setFareRules(rules);
//     } catch (err) {
//       setError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const reset = useCallback(() => {
//     setFareRules([]);
//     setLoading(false);
//     setError(null);
//   }, []);

//   return { fareRules, loading, error, fetchFareRule, reset };
// }