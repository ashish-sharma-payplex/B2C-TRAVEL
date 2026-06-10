import axios from "axios";

const flightApi = axios.create({
  baseURL: "https://travelmytrip.com/api/flightv2",
  headers: {
    "Content-Type": "application/json",

    "x-api-key": "ft4xaqQzYscsEfWAqrl-iLqq67xzrHqGPxVHRXzm_NI",
    "x-user-id": "1",
  },
});

export default flightApi;