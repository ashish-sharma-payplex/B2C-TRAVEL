// // src/pages/flights/FlightsPage.jsx
// import React, { useState } from "react";
// import CityDropdown from "@/components/flights/CityDropdown";
// import FlightDatePicker from "@/components/flights/DatePicker";
// import TravellersDropdown from "@/components/flights/TravellersDropdown";

// const flightsData = [
//   {
//     airline: "IndiGo",
//     code: "6E-2156",
//     departure: "06:30",
//     from: "New Delhi",
//     duration: "2h 45m",
//     arrival: "09:15",
//     to: "Mumbai",
//     price: 1650,
//     seats: 5,
//     nonstop: true,
//   },
//   {
//     airline: "Akasa",
//     code: "6E-6218",
//     departure: "06:30",
//     from: "New Delhi",
//     duration: "2h 45m",
//     arrival: "09:15",
//     to: "Mumbai",
//     price: 1650,
//     seats: 5,
//     nonstop: true,
//   },
//   // add more flights...
// ];

// const FlightsPage = () => {
//   const [priceRange, setPriceRange] = useState([4000, 22000]);
//   const [stops, setStops] = useState([]);
//   const [selectedAirlines, setSelectedAirlines] = useState([]);

//   const handlePriceChange = (e) => {
//     setPriceRange([+e.target.value[0], +e.target.value[1]]);
//   };

//   const toggleStop = (stop) => {
//     if (stops.includes(stop)) {
//       setStops(stops.filter((s) => s !== stop));
//     } else {
//       setStops([...stops, stop]);
//     }
//   };

//   const toggleAirline = (airline) => {
//     if (selectedAirlines.includes(airline)) {
//       setSelectedAirlines(selectedAirlines.filter((a) => a !== airline));
//     } else {
//       setSelectedAirlines([...selectedAirlines, airline]);
//     }
//   };

//   const filteredFlights = flightsData.filter(
//     (f) =>
//       f.price >= priceRange[0] &&
//       f.price <= priceRange[1] &&
//       (stops.length === 0 ||
//         (f.nonstop && stops.includes("Nonstop")) ||
//         (!f.nonstop && stops.includes("1 Stop"))) &&
//       (selectedAirlines.length === 0 || selectedAirlines.includes(f.airline))
//   );

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-10 bg-gray-100 min-h-screen">
//       {/* Filters */}
//       <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
//         <h2 className="font-medium text-lg text-gray-700 mb-4">Filter by:</h2>

//         {/* Price Range */}
//         <div className="mb-4">
//           <label className="block text-gray-600 font-medium mb-1">
//             Price Range
//           </label>
//           <input
//             type="range"
//             min="4000"
//             max="22000"
//             value={priceRange[1]}
//             onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
//             className="w-full"
//           />
//           <div className="flex justify-between text-gray-500 text-sm mt-1">
//             <span>₹{priceRange[0]}</span>
//             <span>₹{priceRange[1]}</span>
//           </div>
//         </div>

//         {/* Stops */}
//         <div className="mb-4">
//           <h3 className="font-medium text-gray-700 mb-2">Stops</h3>
//           {["Nonstop", "1 Stop", "2+ Stop"].map((stop) => (
//             <label key={stop} className="flex items-center gap-2 mb-1">
//               <input
//                 type="checkbox"
//                 checked={stops.includes(stop)}
//                 onChange={() => toggleStop(stop)}
//               />
//               <span className="text-gray-600">{stop}</span>
//             </label>
//           ))}
//         </div>

//         {/* Airlines */}
//         <div className="mb-4">
//           <h3 className="font-medium text-gray-700 mb-2">Airlines</h3>
//           {["IndiGo", "Air India", "SpiceJet", "Akasa"].map((airline) => (
//             <label key={airline} className="flex items-center gap-2 mb-1">
//               <input
//                 type="checkbox"
//                 checked={selectedAirlines.includes(airline)}
//                 onChange={() => toggleAirline(airline)}
//               />
//               <span className="text-gray-600">{airline}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Flights List */}
//       <div className="w-full lg:w-3/4 flex flex-col gap-4">
//         {filteredFlights.map((flight, idx) => (
//           <div
//             key={idx}
//             className="flex flex-col lg:flex-row justify-between items-center bg-white p-4 rounded-lg shadow gap-4"
//           >
//             <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
//               <div className="text-left">
//                 <div className="font-medium text-gray-800">{flight.airline}</div>
//                 <div className="text-gray-500 text-sm">{flight.code}</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-medium">{flight.departure}</div>
//                 <div className="text-gray-500 text-sm">{flight.from}</div>
//               </div>
//               <div className="text-center text-yellow-400 font-medium">
//                 {flight.duration} {flight.nonstop ? "Non-stop" : "1 Stop"}
//               </div>
//               <div className="text-center">
//                 <div className="font-medium">{flight.arrival}</div>
//                 <div className="text-gray-500 text-sm">{flight.to}</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="font-semibold text-lg">₹{flight.price}</div>
//               <button className="bg-green-600 text-white py-2 px-4 rounded">
//                 Book Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FlightsPage;



import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import CityDropdown from "@/components/flights/CityDropdown";
import FlightDatePicker from "@/components/flights/DatePicker";
import TravellersDropdown from "@/components/flights/TravellersDropdown";
import FlightsListingPage from "@/components/flights/FlightsListingPage";
import { useNavigate } from "react-router-dom";

const FlightsPage = () => {
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [tripType, setTripType] = useState("Oneway"); // Oneway / Round Trip

  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Search Clicked");
    navigate("/flights/listing");
  };


  return (
    <Box className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Box className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        {/* Trip Type */}
        <Box className="flex gap-4 mb-4">
          <button
            className={`py-2 px-4 rounded ${tripType === "Oneway" ? "bg-green-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTripType("Oneway")}
          >
            Oneway
          </button>
          <button
            className={`py-2 px-4 rounded ${tripType === "Round Trip" ? "bg-green-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTripType("Round Trip")}
          >
            Round Trip
          </button>
        </Box>

        {/* Inputs Row */}
        <Box className="flex flex-col md:flex-row md:items-center gap-4 md:gap-2">
          <CityDropdown label="From" value={fromCity} onChange={setFromCity} />
          <CityDropdown label="To" value={toCity} onChange={setToCity} />
          <FlightDatePicker label="Departure" value={departureDate} onChange={setDepartureDate} />
          {tripType === "Round Trip" && (
            <FlightDatePicker label="Return" value={returnDate} onChange={setReturnDate} />
          )}
          <TravellersDropdown />
          
          <Button
            variant="contained"
            color="success"
            className="min-w-[120px]"
            onClick={handleSearch}
          >
            Search
          </Button>

        </Box>
      </Box>
    </Box>
  );
};

export default FlightsPage;