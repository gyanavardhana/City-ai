import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import * as d3 from 'd3';

const MetricCard = ({ title, value, change, icon: Icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-4 w-4 text-gray-400" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {change >= 0 ? '+' : ''}{change}%
    </p>
  </div>
);

const Histogram = ({ reviews }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(800, window.innerWidth - 40);
      setDimensions({ width, height: width * 0.6 });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const ratingData = reviews.map(r => r.rating);

    const x = d3.scaleLinear()
      .domain([0.5, 5.5])
      .range([0, innerWidth]);

    const histogram = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(5))
      (ratingData);

    const y = d3.scaleLinear()
      .domain([0, d3.max(histogram, d => d.length)])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3.scaleSequential()
      .domain([1, 5])
      .interpolator(d3.interpolateViridis);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const bars = g.selectAll(".bar")
      .data(histogram)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.x0) + 1)
      .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", d => colorScale(d.x0))
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    bars.transition()
      .duration(1000)
      .attr("y", d => y(d.length))
      .attr("height", d => innerHeight - y(d.length))
      .delay((d, i) => i * 100);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("y2", -innerHeight)
        .attr("stroke-opacity", 0.1));

    g.append("g")
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", innerWidth)
        .attr("stroke-opacity", 0.1));

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Rating")
      .attr("fill", "#4a5568");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .text("Number of Reviews")
      .attr("fill", "#4a5568");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text("Distribution of Review Ratings")
      .attr("fill", "#2d3748");

    function handleMouseOver(event, d) {
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr("opacity", 0.7);

      const [x, y] = d3.pointer(event);

      const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${x + margin.left},${y + margin.top - 30})`);

      tooltip.append("rect")
        .attr("width", 120)
        .attr("height", 30)
        .attr("fill", "white")
        .attr("stroke", "#ccc");

      tooltip.append("text")
        .attr("x", 60)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(`Count: ${d.length} (${((d.length / reviews.length) * 100).toFixed(1)}%)`);
    }

    function handleMouseOut(event) {
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr("opacity", 1);

      svg.select(".tooltip").remove();
    }

  }, [reviews, dimensions]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-auto"
      ></svg>
    </div>
  );
};

export default Histogram;