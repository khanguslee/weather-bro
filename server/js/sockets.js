const sockets = {};

const mqtt = require('mqtt');

require('dotenv').config();

sockets.init = function socketInit(server) {
  /* Connect to MQTT Broker */
  const mqttOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    host: process.env.MQTT_SERVER,
    port: process.env.MQTT_PORT,
    reconnectPeriod: 1000,
    connectTimeout: 5000,
    clientId: `mqtt-client_${Math.random()
      .toString(16)
      .substr(2, 8)}`,
  };

  const mqttClient = mqtt.connect(process.env.MQTT_SERVER, mqttOptions);
  const roomTempTopic = 'esp32/room/temperature';
  const roomHumidityTopic = 'esp32/room/humidity';

  mqttClient.subscribe(roomTempTopic);
  mqttClient.subscribe(roomHumidityTopic);
  mqttClient.on('connect', function mqttConnected() {
    console.log('Connected to MQTT broker');
  });

  mqttClient.on('error', function mqttError(error) {
    console.error(`MQTT error: ${error}`);
  });

  /* Start socket.io connection */
  // eslint-disable-next-line global-require
  const io = require('socket.io').listen(server);
  io.on('connection', function ioConnection(socket) {
    console.log('User connected');
    mqttClient.on('message', function mqttMessage(topic, payload) {
      const payloadString = payload.toString();
      console.log(payloadString);
      if (topic === roomTempTopic) {
        socket.emit(roomTempTopic, payloadString);
      } else if (topic === roomHumidityTopic) {
        socket.emit(roomHumidityTopic, payloadString);
      }
    });
  });
};

module.exports = sockets;
