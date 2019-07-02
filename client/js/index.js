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

const maxTemperature = 50;
const maxHumidity = 100;

const yScaleTemperature = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, maxTemperature]);

const yScaleHumidity = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, maxHumidity]);

function updateXScale() {
  let lastTime;
  let recentTime;
  // Check edge cases when there are no elements in either temperature or humidity data
  if (temperatureData.size() === 0) {
    lastTime = humidityData.last().time;
    recentTime = humidityData.front().time;
  } else if (humidityData.size() === 0) {
    lastTime = temperatureData.last().time;
    recentTime = temperatureData.front().time;
  } else {
    lastTime =
      temperatureData.last().time < humidityData.last().time
        ? temperatureData.last().time
        : humidityData.last().time;
    recentTime =
      temperatureData.front().time > humidityData.front().time
        ? temperatureData.front().time
        : humidityData.front().time;
  }

  return d3
    .scaleTime()
    .domain([lastTime, recentTime])
    .range([0, width]);
}

function setupOverviewGraph() {
  const svg = d3
    .select('#overview-graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleTime().range([0, width]);

  // Display time x-axis
  svg
    .append('g')
    .attr('class', 'axis')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M:%S')));

  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.top)
    .style('text-anchor', 'middle')
    .text('Time');

  // Display temperature y-axis
  svg
    .append('g')
    .attr('class', 'axis')
    .attr('id', 'y-axis-temperature')
    .call(d3.axisLeft(yScaleTemperature));

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left / 2)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Temperature (C)');

  // Display humidity y-axis
  svg
    .append('g')
    .attr('class', 'axis')
    .attr('id', 'y-axis-humidity')
    .attr('transform', `translate(${width},0)`)
    .call(d3.axisRight(yScaleHumidity));

  svg
    .append('text')
    .attr(
      'transform',
      `translate(${width + margin.right},${height / 2}) rotate(90)`
    )
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Humidity');

  console.log(temperatureData.data);
}

function temperatureDataHandler(inputData) {
  console.log(`Temperature: ${inputData}`);
  temperatureData.add(parseFloat(inputData));
  temperatureData.print();
  // Remove previous data
  d3.selectAll('.temperature-line').remove();
  d3.selectAll('.temperature-dot').remove();

  const xScale = updateXScale();

  const temperatureLine = d3
    .line()
    .x(d => xScale(d.time))
    .y(d => yScaleTemperature(d.data))
    .curve(d3.curveMonotoneX);

  const svg = d3.select('#overview-graph svg');
  svg
    .selectAll('#x-axis')
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M:%S')));
  svg
    .append('path')
    .datum(temperatureData.data)
    .attr('class', 'temperature-line')
    .attr('d', temperatureLine)
    .attr('transform', `translate(${margin.left},${margin.top})`);

  svg
    .selectAll('.temperature-dot')
    .data(temperatureData.data)
    .enter()
    .append('circle')
    .attr('class', 'temperature-dot')
    .attr('cx', d => xScale(d.time))
    .attr('cy', d => yScaleTemperature(d.data))
    .attr('r', 3)
    .attr('transform', `translate(${margin.left},${margin.top})`);
}

function humidityDataHandler(inputData) {
  console.log(`Humidity: ${inputData}`);
  humidityData.add(parseFloat(inputData));
  humidityData.print();

  // Remove previous data
  d3.selectAll('.humidity-line').remove();
  d3.selectAll('.humidity-dot').remove();

  // TODO: Change xScale to check for lowest/highest values from temperature or humidity queues.
  const xScale = updateXScale();

  const humidityLine = d3
    .line()
    .x(d => xScale(d.time))
    .y(d => yScaleHumidity(d.data))
    .curve(d3.curveMonotoneX);

  const svg = d3.select('#overview-graph svg');
  svg
    .selectAll('#x-axis')
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M:%S')));
  svg
    .append('path')
    .datum(humidityData.data)
    .attr('class', 'humidity-line')
    .attr('d', humidityLine)
    .attr('transform', `translate(${margin.left},${margin.top})`);

  svg
    .selectAll('.humidity-dot')
    .data(humidityData.data)
    .enter()
    .append('circle')
    .attr('class', 'humidity-dot')
    .attr('cx', d => xScale(d.time))
    .attr('cy', d => yScaleHumidity(d.data))
    .attr('r', 3)
    .attr('transform', `translate(${margin.left},${margin.top})`);
}

setupOverviewGraph();
socket.on('esp32/room/temperature', temperatureDataHandler);
socket.on('esp32/room/humidity', humidityDataHandler);
