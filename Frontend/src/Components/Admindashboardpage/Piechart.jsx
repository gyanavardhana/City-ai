import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const Piechart = ({ users }) => {
  const svgRef = useRef();
  const [activeSlice, setActiveSlice] = useState(null);

  useEffect(() => {
    if (!users || users.length === 0) {
      console.error("Missing or empty users data");
      return;
    }

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const roleCounts = d3.rollups(users, v => v.length, d => d.role);
    const pieData = d3.pie().value(d => d[1])(roleCounts);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Add the pie slices
    svg.selectAll("path")
      .data(pieData)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colorScale(i))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style("opacity", 1);
        setActiveSlice(d);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).style("opacity", 0.7);
        setActiveSlice(null);
      });

    // Add the polylines between chart and labels
    svg.selectAll("polyline")
      .data(pieData)
      .join("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", function(d) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

    // Add the labels
    svg.selectAll("text")
      .data(pieData)
      .join("text")
      .text(d => `${d.data[0]} (${d.data[1]})`)
      .attr("transform", function(d) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", function(d) {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return (midAngle < Math.PI ? 'start' : 'end');
      })
      .style("font-size", "0.9rem")
      .style("fill", "#333");

  }, [users]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-bold text-center my-4">User Roles Distribution</h2>
      <div className="relative flex justify-center">
        <svg ref={svgRef} className="w-auto h-auto max-h-[400px]"></svg>
        {activeSlice && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-2 rounded shadow-lg z-10">
            <p className="font-bold text-lg">{activeSlice.data[0]}</p>
            <p>Count: {activeSlice.data[1]}</p>
            <p>Percentage: {((activeSlice.endAngle - activeSlice.startAngle) / (2 * Math.PI) * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Piechart;
