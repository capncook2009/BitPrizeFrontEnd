import React, { useState } from "react";

export const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  onChange,
  label = "Range Slider",
}) => {
  const [value, setValue] = useState(defaultValue);

  // Calculate percentage for background gradient
  const percentage = ((value - min) / (max - min)) * 100;

  // Handle slider change
  const handleChange = (e) => {
    const newValue: any = Number(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700"></label>
        <span className="text-sm font-medium text-gray-500">{value} %</span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #2563eb ${percentage}%, #e5e7eb ${percentage}%)`,
          }}
        />

        {/* Custom styles for webkit browsers */}
        <style jsx>{`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background-color: white;
            border: 2px solid #2563eb;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            background-color: #2563eb;
            transform: scale(1.1);
          }

          input[type="range"]:focus {
            outline: none;
          }
        `}</style>
      </div>

      {/* <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div> */}
    </div>
  );
};

// // Example usage
// export default function Example() {
//   const handleValueChange = (value) => {
//     console.log("Current value:", value);
//   };

//   return (
//     <div className="p-6">
//       <RangeSlider
//         min={0}
//         max={100}
//         step={1}
//         defaultValue={50}
//         onChange={handleValueChange}
//         label="Volume"
//       />
//     </div>
//   );
// }
