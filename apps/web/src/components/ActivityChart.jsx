import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, useTheme } from "@mui/material";

const ActivityChart = ({ data }) => {
  const svgRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    // Get the last 7 data points
    const recentData = data;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = 600; // Width for the visible portion of the chart
    const fullWidth = data.length * 100; // Full width to allow scrolling
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Set up scales
    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.date))
      .range([margin.left, fullWidth - margin.right])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Draw axes
    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(3);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", "white");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`) // Keep it fixed
      .call(yAxis)
      .selectAll("text")
      .style("fill", "white");

    // Draw grid lines
    svg
      .append("g")
      .attr("stroke", theme.palette.grey[700])
      .attr("stroke-opacity", 0.3)
      .call((g) =>
        g
          .selectAll("line")
          .data(y.ticks(3))
          .join("line")
          .attr("x1", margin.left)
          .attr("x2", fullWidth - margin.right)
          .attr("y1", (d) => y(d))
          .attr("y2", (d) => y(d))
      );

    // Draw the line
    const line = d3
      .line()
      .x((d) => x(d.date) || 0)
      .y((d) => y(d.value))
      .curve(d3.curveLinear);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Draw circles
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.date) || 0)
      .attr("cy", (d) => y(d.value))
      .attr("r", 5)
      .attr("fill", "white")
      .attr("stroke", theme.palette.grey[900])
      .attr("stroke-width", 2);
  }, [data, theme]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[900],
        borderRadius: "8px",
        padding: "16px",
        overflowX: "auto", // Enable horizontal scrolling
        '&::-webkit-scrollbar': {
          height: '3px', // Width of the scrollbar
        },
        '&::-webkit-scrollbar-track': {
          background: '#1e1e1e', // Track background color
          borderRadius: '3px', // Track rounded corners
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(145deg, #444, #888)', // Thumb gradient
          borderRadius: '3px', // Thumb rounded corners
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'linear-gradient(145deg, #666, #aaa)', // Hover effect on thumb
        },
      }}
    >
      <svg ref={svgRef} width={data.length * 100} height="300"></svg>
    </Box>
  );
};

export default ActivityChart;
