export const API_BASE_URL = "https://travelmytrip.com";

export const BUS_API_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": "ft4xaqQzYscsEfWAqrl-iLqq67xzrHqGPxVHRXzm_NI",
  "x-user-id": "1",
};

export async function busFetch(
  endpoint,
  { params = {}, body = null, method = "GET" } = {},
) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, v);
    }
  });

  const options = { method, headers: { ...BUS_API_HEADERS } };
  if (method === "POST" && body) options.body = JSON.stringify(body);

  const res = await fetch(url.toString(), options);
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const BUS_ENDPOINTS = {
  CITY_LIST: "/api/busv2/city-list/",
  BUS_SEARCH: "/api/busv2/search/",
};
