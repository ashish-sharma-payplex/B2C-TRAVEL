export const API_BASE_URL = "https://travelmytrip.com";

export const FLIGHT_API_HEADERS = {
  "Content-Type": "application/json",
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
  const data = await res.json();
  return data;
}

export const FLIGHT_ENDPOINTS = {
  COUNTRIES: "/api/flightv2/airports",
  SEARCH: "/api/flightv2/search/",
};