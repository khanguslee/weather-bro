/* global io */
const socket = io();

function temperatureDataHandler(inputData) {
  console.log(`Temperature: ${inputData}`);
}

function humidityDataHandler(inputData) {
  console.log(`Humidity: ${inputData}`);
}

socket.on('esp32/room/temperature', temperatureDataHandler);
socket.on('esp32/room/humidity', humidityDataHandler);
