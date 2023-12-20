import React from "react";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";

// Our data...
const data = [
  { type: "Applications", value: 43 },
  { type: "E-mail", value: 2 },
  { type: "Phone Screens", value: 1 },
  { type: "Interviews", value: 0 },
  { type: "Rejections", value: 12 },
  { type: "Acceptances", value: 0 },
  { type: "Offers", value: 0 },
];

// Define the graph dimensions and margins
const width = 700;
const height = 500;
const margin = { top: 20, bottom: 50, left: 50, right: 20 };

// Create scales
const xScale = scaleBand({
  domain: data.map((d) => d.type),
  range: [margin.left, width - margin.right],
  padding: 0.5,
});

const yScale = scaleLinear({
  domain: [0, Math.max(...data.map((d) => d.value))],
  range: [height - margin.bottom, margin.top],
});

// Customize y-axis ticks to whole numbers
const yAxisTicks = yScale.ticks().filter((tick) => Number.isInteger(tick));
// To get the value for a specific type, e.g., 'Applications'
// calcs to get rate of phone screens from applications
const typeToFind = "Applications";
const applicationValue = data.find((item) => item.type === typeToFind)?.value;
const screens = Math.floor(applicationValue * 0.2);

export default function BarGraph() {
  return (
    <div className='graph'>
     
      <svg width={width} height={height}>
        <Group>
          {data.map((d) => {
            const barHeight = height - margin.bottom - yScale(d.value);
            return (
              <Bar
                key={`bar-${d.type}`}
                x={xScale(d.type)}
                y={yScale(d.value)}
                height={barHeight}
                width={xScale.bandwidth()}
                fill="#65C89B"
              />
            );
          })}
          <AxisLeft scale={yScale} left={margin.left} tickValues={yAxisTicks} />
          <AxisBottom
            scale={xScale}
            top={height - margin.bottom}
            tickLabelProps={() => ({
              fontSize: 12, // Set your desired font size here
              textAnchor: "middle", // Center the tick labels
            })}
          />
        </Group>
      </svg>
      <h3>
        Target 20% conversion from application full CS style application to
        phone screen.
      </h3>
      <h3>
        You could possibly get {screens} phone{" "}
        {screens > 1 ? "screens" : "screen"} with your current rate of
        applications.
      </h3>
    </div>
  );
}

export { BarGraph };