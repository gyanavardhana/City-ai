import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const TimeSeriesChart = ({ reviews }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(800, window.innerWidth - 40);
      setDimensions({ width, height: width * 0.5 });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!reviews.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const timeData = d3.rollups(reviews, v => v.length, d => new Date(d.createdAt))
      .sort((a, b) => d3.ascending(a[0], b[0]));

    const x = d3.scaleTime()
      .domain(d3.extent(timeData, d => d[0]))
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(timeData, d => d[1])])
      .nice()
      .range([innerHeight, 0]);

    const line = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    const area = d3.area()
      .x(d => x(d[0]))
      .y0(innerHeight)
      .y1(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add gradient
    const gradient = g.append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", y(0))
      .attr("x2", 0).attr("y2", y(d3.max(timeData, d => d[1])));

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(59, 130, 246, 0.1)");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(59, 130, 246, 0.4)");

    // Add area
    g.append("path")
      .datum(timeData)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    // Add line
    g.append("path")
      .datum(timeData)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Add dots
    g.selectAll(".dot")
      .data(timeData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d[0]))
      .attr("cy", d => y(d[1]))
      .attr("r", 4)
      .attr("fill", "#3b82f6");

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("y2", -innerHeight)
        .attr("stroke-opacity", 0.1));

    // Add y-axis
    g.append("g")
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", innerWidth)
        .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Review Count"));

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Review Count Over Time");

  }, [reviews, dimensions]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-auto"
      ></svg>
    </div>
  );
};

export default TimeSeriesChart;