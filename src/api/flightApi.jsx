export const API_BASE_URL = "https://travelmytrip.com";

export const FLIGHT_API_HEADERS = {
  "Content-Type": "application/json",
  // "x-api-key": "phbA-DvwrvTf9WD-uvQ_7mVFD0NNMMhEMVkqX9gycws",
  "x-api-key": "ft4xaqQzYscsEfWAqrl-iLqq67xzrHqGPxVHRXzm_NI",
  "x-user-id": "1",
};

export async function flightFetch(
  endpoint,
  { params = {}, body = null, method = "GET" } = {},
) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, v);
    }
  });

  const options = { method, headers: { ...FLIGHT_API_HEADERS } };
  if (method === "POST" && body) options.body = JSON.stringify(body);

  const res = await fetch(url.toString(), options);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export const FLIGHT_ENDPOINTS = {
  COUNTRIES: "/api/flightv2/airports",
  SEARCH: "/api/flightv2/search/",
  CALENDAR_FARE: "/api/flightv2/calendar-fare/",
  FARE_RULE: "/api/flightv2/fare-rule/",
  FARE_QUOTE: "/api/flightv2/fare-quote/",
  SSR: "/api/flightv2/ssr/",

  BOOKING_DETAILS: "/api/flightv2/booking-details/",
};
