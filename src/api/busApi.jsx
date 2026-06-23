import { getUserId } from "../config/userConfig";

export const API_BASE_URL = "https://travelmytrip.com";

export const BUS_ENDPOINTS = {
  CITY_LIST: "/api/busv2/city-list/",
  BUS_SEARCH: "/api/busv2/search/",
  PAYMENT_CANCEL: "/api/busv2/payment/cancel/",
  BOOKING_LIST: "/api/busv2/bookings/list/",
  BOOKING_DETAILS: "/api/busv2/booking-detail/",
  BOOK: "/api/busv2/book/",
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

  const userId = getUserId();
  console.log(`🚌 busFetch | endpoint: ${endpoint} | x-user-id: ${userId}`);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "ft4xaqQzYscsEfWAqrl-iLqq67xzrHqGPxVHRXzm_NI",
    "x-user-id": userId,
  };

  const options = { method, headers };
  if (method === "POST" && body) options.body = JSON.stringify(body);

  const res = await fetch(url.toString(), options);
  const data = await res.json();
  return data;
}

export async function getBusBookingList() {
  return await busFetch(BUS_ENDPOINTS.BOOKING_LIST);
}

export async function getBusBookingDetails(traceId, busId) {
  return await busFetch(BUS_ENDPOINTS.BOOKING_DETAILS, {
    method: "POST",
    body: {
      trace_id: traceId,
      bus_id: busId,
    },
  });
}
