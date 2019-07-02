/* global io,
  d3,
*/

// Have to ignore below line or else node can't find the file
// eslint-disable-next-line import/extensions
import Queue from './queue.js';

const socket = io();
const temperatureData = new Queue(60);
const humidityData = new Queue(60);
const margin = { top: 50, right: 50, bottom: 50, left: 100 };
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

function setupTemperatureGraph() {
  const svg = d3
    .select('#temperature-graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleTime().range([0, width]);

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, 50]);

  svg
    .append('g')
    .attr('class', 'axis')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M:%S')));

  // Display x-axis label
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.top)
    .style('text-anchor', 'middle')
    .text('Time');

  svg
    .append('g')
    .attr('class', 'axis')
    .attr('id', 'y-axis')
    .call(d3.axisLeft(yScale));

  // Display y-axis label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left / 2)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Temperature (C)');

  console.log(temperatureData.data);
}

function temperatureDataHandler(inputData) {
  console.log(`Temperature: ${inputData}`);
  temperatureData.add(parseFloat(inputData));
  temperatureData.print();
  // Remove previous data
  d3.selectAll('.line').remove();
  d3.selectAll('.dot').remove();

  const xScale = d3
    .scaleTime()
    .domain([temperatureData.last().time, temperatureData.front().time])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, 30]);

  const line = d3
    .line()
    .x(d => xScale(d.time))
    .y(d => yScale(d.data))
    .curve(d3.curveMonotoneX);

  const svg = d3.select('#temperature-graph svg');
  svg
    .selectAll('#x-axis')
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M:%S')));
  svg
    .append('path')
    .datum(temperatureData.data)
    .attr('class', 'line')
    .attr('d', line)
    .attr('transform', `translate(${margin.left},200)`);

  svg
    .selectAll('.dot')
    .data(temperatureData.data)
    .enter()
    .append('circle') // Uses the enter().append() method
    .attr('class', 'dot') // Assign a class for styling
    .attr('cx', d => xScale(d.time))
    .attr('cy', d => yScale(d.data))
    .attr('r', 3)
    .attr('transform', `translate(${margin.left},200)`);
}

function humidityDataHandler(inputData) {
  console.log(`Humidity: ${inputData}`);
  humidityData.add(parseFloat(inputData));
  humidityData.print();
}

setupTemperatureGraph();
socket.on('esp32/room/temperature', temperatureDataHandler);
socket.on('esp32/room/humidity', humidityDataHandler);
