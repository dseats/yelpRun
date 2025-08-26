import * as React from "react";
import Box from "@mui/material/Box";
import MuiSlider from "@mui/material/Slider";

const MySlider = (value) => {
  return (
    <Box sx={{ width: 300 }}>
      <MuiSlider
        defaultValue={50}
        aria-label="Default"
        valueLabelDisplay="auto"
      />
    </Box>
  );
};

export default MySlider;
