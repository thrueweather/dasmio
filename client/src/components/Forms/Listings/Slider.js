import React from "react";
import { Slider } from "antd";
import "antd/dist/antd.css";

const marks = {
  1: "1",
  3: "3",
  9: "9",
  9: "9",
  12: "12",
  24: "24",
  72: "72"
};

const CustomSlider = ({ name, onChange, value, step }) => {
  return (
    <Slider
      value={value}
      marks={marks}
      onChange={e => onChange(name, e)}
      defaultValue={1}
      min={1}
      max={72}
      step={step}
    />
  );
};

export default CustomSlider;
