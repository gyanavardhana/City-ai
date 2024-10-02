import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ users, locations, reviews }) => {
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
    if (!users.length || !locations.length || !reviews.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    svg.attr("width", width).attr("height", height);

    const nodes = users.map(u => ({ ...u, type: 'user' }))
      .concat(locations.map(l => ({ ...l, type: 'location' })));
    const links = reviews.map(r => ({ source: r.userId, target: r.locationId, value: 1 }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    const colorScale = d3.scaleOrdinal()
      .domain(['user', 'location'])
      .range(['#4299e1', '#48bb78']);

    const linkGroup = svg.append("g");
    const link = linkGroup.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));

    const nodeGroup = svg.append("g");
    const node = nodeGroup.selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", d => colorScale(d.type))
      .call(drag(simulation));

    node.append("title")
      .text(d => d.type === 'user' ? `User: ${d.name}` : `Location: ${d.name}`);

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.name)
      .attr("font-size", 12)
      .attr("dx", 12)
      .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x = Math.max(10, Math.min(width - 10, d.x)))
        .attr("cy", d => d.y = Math.max(10, Math.min(height - 10, d.y)));

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        nodeGroup.attr("transform", event.transform);
        linkGroup.attr("transform", event.transform);
        label.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [users, locations, reviews, dimensions]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">User-Location Interaction Network</h2>
      <div className="relative">
        <svg
          ref={svgRef}
          className="w-full h-auto border border-gray-300 rounded"
        ></svg>
        <div className="absolute top-2 left-2 bg-white bg-opacity-75 p-2 rounded">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">Users</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Locations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;