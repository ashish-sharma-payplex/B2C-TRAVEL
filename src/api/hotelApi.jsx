export const API_BASE_URL = "https://travelmytrip.com";

export const API_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": "phbA-DvwrvTf9WD-uvQ_7mVFD0NNMMhEMVkqX9gycws",
  "x-user-id": "1",
};

export async function hotelFetch(
  endpoint,
  { params = {}, body = {}, method = "POST" } = {},
) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, v);
    }
  });

  const options = { method, headers: { ...API_HEADERS } };
  if (method === "POST") options.body = JSON.stringify(body);

  const res = await fetch(url.toString(), options);
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const ENDPOINTS = {
  CITIES: "/api/hotelv2/cities/",
  HOTEL_CODES: "/api/hotelv2/hotel-codes/",
  HOTEL_DETAILS: "/api/hotelv2/hotel-details/",
  HOTEL_SEARCH: "/api/hotelv2/search/",
};
