
// import React, { useState } from "react";
// import { Box, TextField } from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

// const FlightDatePicker = ({ label, value, onChange }) => {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <DatePicker
//         label={label}
//         value={value}
//         onChange={onChange}
//         renderInput={(params) => (
//           <TextField {...params} sx={{ width: 160 }} size="small" />
//         )}
//       />
//     </LocalizationProvider>
//   );
// };

// export default FlightDatePicker;



import React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const FlightDatePicker = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </LocalizationProvider>
  );
};

export default FlightDatePicker;