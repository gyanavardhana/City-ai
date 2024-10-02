import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const Scatterplot = ({ locations }) => {
  const svgRef = useRef();
  const [activePoint, setActivePoint] = useState(null);

  useEffect(() => {
    if (!locations || locations.length === 0) {
      console.error("Missing or empty locations data");
      return;
    }

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(locations, d => d.pollution)])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(locations, d => d.safety)])
      .range([height, 0]);

    const colorScale = d3.scaleLinear()
      .domain([d3.min(locations, d => d.safety), d3.max(locations, d => d.safety)])
      .range(["red", "green"]);

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .style("font-size", "14px")
      .style("text-anchor", "middle")
      .text("Pollution Index");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("fill", "black")
      .style("font-size", "14px")
      .style("text-anchor", "middle")
      .text("Safety Index");

    // Add dots
    svg.selectAll("circle")
      .data(locations)
      .join("circle")
      .attr("cx", d => x(d.pollution))
      .attr("cy", d => y(d.safety))
      .attr("r", 8)
      .style("fill", d => colorScale(d.safety))
      .style("opacity", 0.7)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style("opacity", 1).attr("r", 12);
        setActivePoint(d);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).style("opacity", 0.7).attr("r", 8);
        setActivePoint(null);
      });

    // Add chart title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("City Safety vs Pollution");

  }, [locations]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 relative">
        <svg ref={svgRef} className="w-full h-auto"></svg>
        {activePoint && (
          <div className="absolute bg-white bg-opacity-90 p-3 rounded shadow-lg" style={{ left: `${activePoint.pollution * 10}%`, top: `${100 - activePoint.safety * 20}%` }}>
            <p className="font-bold">{activePoint.name}</p>
            <p>Pollution: {activePoint.pollution.toFixed(1)}</p>
            <p>Safety: {activePoint.safety.toFixed(1)}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Scatterplot;