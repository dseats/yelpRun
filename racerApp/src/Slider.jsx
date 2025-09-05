// import * as React from "react";
// import Box from "@mui/material/Box";
// import MuiSlider from "@mui/material/Slider";

// const MySlider = (value) => {
//   return (
//     <Box sx={{ width: 300 }}>
//       <MuiSlider
//         defaultValue={50}
//         aria-label="Default"
//         valueLabelDisplay="auto"
//       />
//     </Box>
//   );
// };

// export default MySlider;
// MySlider.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

export default function MySlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Slider
        value={value} // controlled
        onChange={(e, nv) => onChange?.(e, nv)} // forward MUI signature
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto" // shows a bubble with the value
        aria-label="distance"
      />
    </Box>
  );
}
