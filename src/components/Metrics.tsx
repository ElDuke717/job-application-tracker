import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import BarGraph from './BarGraph';

const Metrics = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      // Example: Draw a simple bar chart
      const data = [10, 20, 30, 40, 50];
      const svg = d3.select(d3Container.current)
                    .append('svg')
                    .attr('width', 600)
                    .attr('height', 300);

      svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 60)
        .attr("y", d => 300 - d)
        .attr("width", 50)
        .attr("height", d => d)
        .attr("fill", "blue");
    }
  }, []);

  return (
    <div>
      <h1>Metrics</h1>

        <BarGraph />
    </div>
  );
}

export default Metrics;
