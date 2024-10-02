import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WordCloud = ({ images }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(800, window.innerWidth - 40);
      setDimensions({ width, height: width * 0.75 });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!images.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    const labels = images.flatMap(img => img.labels);
    const labelCounts = d3.rollups(labels, v => v.length, d => d)
      .sort((a, b) => d3.descending(a[1], b[1]));

    const maxCount = d3.max(labelCounts, d => d[1]);
    const minCount = d3.min(labelCounts, d => d[1]);

    const fontScale = d3.scaleLog()
      .domain([minCount, maxCount])
      .range([14, 60]);

    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain([minCount, maxCount]);

    const layout = cloud()
      .size([width, height])
      .words(labelCounts.map(d => ({ text: d[0], size: fontScale(d[1]), value: d[1] })))
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      svg.attr("width", width)
         .attr("height", height)
         .append("g")
         .attr("transform", `translate(${width / 2},${height / 2})`)
         .selectAll("text")
         .data(words)
         .join("text")
         .style("font-size", d => `${d.size}px`)
         .style("font-family", "Arial, sans-serif")
         .style("fill", d => colorScale(d.value))
         .attr("text-anchor", "middle")
         .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
         .text(d => d.text)
         .on("mouseover", handleMouseOver)
         .on("mouseout", handleMouseOut);
    }

    function handleMouseOver(event, d) {
      const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${width / 2 + d.x},${height / 2 + d.y})`);

      tooltip.append("rect")
        .attr("x", 10)
        .attr("y", -20)
        .attr("width", 100)
        .attr("height", 25)
        .attr("fill", "white")
        .attr("opacity", 0.7);

      tooltip.append("text")
        .attr("x", 15)
        .attr("y", -2)
        .text(`Count: ${d.value}`)
        .attr("font-size", "12px")
        .attr("fill", "black");

      d3.select(event.target)
        .transition()
        .duration(200)
        .style("font-size", `${d.size * 1.2}px`)
        .style("font-weight", "bold");
    }

    function handleMouseOut(event) {
      svg.select(".tooltip").remove();
      d3.select(event.target)
        .transition()
        .duration(200)
        .style("font-size", d => `${d.size}px`)
        .style("font-weight", "normal");
    }

  }, [images, dimensions]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Image Metadata Tags</h2>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-auto"
      ></svg>
    </div>
  );
};

export default WordCloud;