import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import * as d3 from 'd3';

const ActivityChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Data representing number of ships and corresponding days
    const data = [
      { day: '2023-01-01', ships: 10 },
      { day: '2023-01-02', ships: 15 },
      { day: '2023-01-03', ships: 25 },
      { day: '2023-01-04', ships: 30 },
      { day: '2023-01-05', ships: 34 },
      { day: '2023-01-06', ships: 18 },
      { day: '2023-01-07', ships: 20 },
      
    ];
  
    // Set up dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.day))
      .range([0, width])
      .padding(0.1);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.ships)])
      .nice()
      .range([height, 0]);
  
    // Append the svg element to the ref container
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Filter data to show every 4th date
    const filteredData = data.filter((d, i) => i % 4 === 0);
  
    // Add the x-axis
    svg.append('g')
      .selectAll('.x-axis')
      .data(filteredData)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${xScale(d.day)}, 0)`)
      .append('text')
      .attr('y', height)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('fill', '#fff')
      .text(d => d.day);
  
    // Add the y-axis
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('fill', '#fff');
  
    // Create the line
    const line = d3.line()
      .x(d => xScale(d.day) + xScale.bandwidth() / 2)
      .y(d => yScale(d.ships));
  
    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', '#635acc')
      .style('stroke-width', 2);
  
    // Add circles to represent the data points
    svg.selectAll('.circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('cx', d => xScale(d.day) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.ships))
      .attr('r', 5)
      .style('fill', '#635acc');
  }, []);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg ref={svgRef} />
    </Box>
  );
};

export default ActivityChart;
