// import { useState } from "react";
// import flightApi from "../../api/flightApi";

// const useFlightSearch = () => {

//   const [flightData, setFlightData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const searchFlights = async () => {

//     try {

//       setLoading(true);

//       const payload = {
//         EndUserIp: "192.168.10.10",
//         TokenId: "ac2751e9-4cc3-406f-b678-c947e4f57a00",
//         AdultCount: "1",
//         ChildCount: "0",
//         InfantCount: "0",
//         DirectFlight: "false",
//         OneStopFlight: "false",
//         JourneyType: "1",

//         Segments: [
//           {
//             Origin: "ELS",
//             Destination: "DXB",
//             FlightCabinClass: 1,
//             PreferredDepartureTime: "2026-06-10T00:00:00",
//             PreferredArrivalTime: "2026-06-22T00:00:00"
//           }
//         ]
//       };

//       const response = await flightApi.post(
//         "/search/",
//         payload
//       );

//       setFlightData(response.data);

//       console.log("Full Response:", response.data);

//       console.log(
//         "Flight Results:",
//         response.data?.data?.results
//       );

//       console.log(
//         response.data.data.results.Results[0]
//         );

//         console.log(
//         "Segments => ",
//         response.data.data.results.Results[0].Segments
//         );

//         console.log(
//         "First Segment => ",
//         response.data.data.results.Results[0].Segments[0]
//         );

//         console.log(
//         "First Flight Leg => ",
//         response.data.data.results.Results[0].Segments[0][0]
//         );

//         console.log(
//         "Segments Count => ",
//         response.data.data.results.Results[0].Segments.length
//         );



//       return response.data;

//     } catch (error) {

//       console.log("Flight Search Error:", error);

//     } finally {

//       setLoading(false);

//     }

//   };

//   return {
//     searchFlights,
//     flightData,
//     loading,
//   };
// };

// export default useFlightSearch;



import { useState } from "react";
import flightApi from "../../api/flightApi";

const useFlightSearch = () => {

  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchFlights = async (
    fromCode,
    toCode,
    departureDate
  ) => {

    try {

      setLoading(true);

      const payload = {
        EndUserIp: "192.168.10.10",
        TokenId: "ac2751e9-4cc3-406f-b678-c947e4f57a00",

        AdultCount: "1",
        ChildCount: "0",
        InfantCount: "0",

        DirectFlight: "false",
        OneStopFlight: "false",

        JourneyType: "1",

        Segments: [
          {
            Origin: fromCode,
            Destination: toCode,

            FlightCabinClass: 1,

            PreferredDepartureTime:
              departureDate,

            PreferredArrivalTime:
              departureDate,
          },
        ],
      };

      const response = await flightApi.post(
        "/search/",
        payload
      );

      setFlightData(response.data);

      console.log(
        "Full Response:",
        response.data
      );

      console.log(
        "Flight Results:",
        response.data?.data?.results
      );

      console.log(
        "First Result:",
        response.data?.data?.results?.Results?.[0]
      );

      console.log(
        "Segments => ",
        response.data?.data?.results?.Results?.[0]
          ?.Segments
      );

      console.log(
        "First Segment => ",
        response.data?.data?.results?.Results?.[0]
          ?.Segments?.[0]
      );

      console.log(
        "First Flight Leg => ",
        response.data?.data?.results?.Results?.[0]
          ?.Segments?.[0]?.[0]
      );

      console.log(
        "Segments Count => ",
        response.data?.data?.results?.Results?.[0]
          ?.Segments?.length
      );

      return response.data;

    } catch (error) {

      console.log(
        "Flight Search Error:",
        error
      );

      return null;

    } finally {

      setLoading(false);

    }

  };

  return {
    searchFlights,
    flightData,
    loading,
  };
};

export default useFlightSearch;