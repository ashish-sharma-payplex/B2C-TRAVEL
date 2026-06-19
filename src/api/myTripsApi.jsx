import { flightFetch, FLIGHT_ENDPOINTS } from "./flightApi";

export async function getMyTrips() {
  try {
    const response = await flightFetch(
      "/api/flightv2/user/bookings"
    );

    return response;
  } catch (error) {

    console.log("My Trips API Error :", error);

    throw error;
  }
}


export async function getBookingDetails(bookingId) {

  try {

    const response = await flightFetch(
      FLIGHT_ENDPOINTS.BOOKING_DETAILS,
      {
        method: "POST",

        body: {
          BookingId: bookingId,
        },
      }
    );

    return response;

  } catch (error) {

    console.log("Booking Details Error :", error);

    throw error;

  }

}