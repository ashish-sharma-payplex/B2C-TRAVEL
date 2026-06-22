import React, {

useEffect,

useState,

} from "react";

import {

Box,

Typography,

} from "@mui/material";

import {

getBusBookingList,

} from "../../src/api/busApi";


const BusBooking = () => {

const [loading, setLoading] = useState(false);

const [busBookings, setBusBookings] = useState([]);


const fetchBusBookings = async () => {

try {

setLoading(true);

const response = await getBusBookingList();

console.log(

"Bus Booking List :",

response

);

if (

response?.results?.length === 0

) {

console.log(

"No Bus Bookings Available"

);

}

setBusBookings(

response.results || []

);

} catch (error) {

console.log(

"Bus Booking Error :",

error

);

} finally {

setLoading(false);

}

};


useEffect(() => {

fetchBusBookings();

}, []);


return (

<Box>

<Typography

sx={{

fontSize:22,

fontWeight:700,

mb:3,

}}

>

🚌 Bus Bookings

</Typography>


    {/* {loading ? (

    <Typography>

    Loading...

    </Typography>

    ) : (

    <Typography>

    Total Bookings :

    {busBookings.length}

    </Typography>

    )} */}


{loading ? (

  <Typography>

    Loading...

  </Typography>

) : busBookings.length > 0 ? (

  <Typography>

    Total Bookings :

    {busBookings.length}

  </Typography>

) : (

  <Box

    sx={{

      display: "flex",

      flexDirection: "column",

      alignItems: "center",

      justifyContent: "center",

      minHeight: "500px",

    }}

  >

    <Box

      component="img"

      src="/no-bus.png"

      alt="No Bus"

      sx={{

        width: 220,

        height: 220,

        objectFit: "contain",

        mb: 2,

      }}

    />

<Typography

sx={{

maxWidth: "452px",

minHeight: "48px",

fontFamily: "Inter,sans-serif",

fontWeight: 400,

fontSize: "20px",

lineHeight: "24px",

letterSpacing: 0,

textAlign: "center",

color: "#4B5563",

mx: "auto",

}}

>

Oops! No bus bookings found.

</Typography>

  </Box>

)}

</Box>

);

};


export default BusBooking;



