const sockets = {};

const mqtt = require('mqtt');

sockets.init = function socketInit(server) {
  /* Connect to MQTT Broker */
  const mqttOptions = {
    reconnectPeriod: 1000,
    connectTimeout: 5000,
    clientId: 'mqttClient',
  };

  const mqttClient = mqtt.connect('mqtt://localhost:1883', mqttOptions);
  const roomTempTopic = 'esp32/room/temperature';
  const roomHumidityTopic = 'esp32/room/humidity';

  mqttClient.subscribe(roomTempTopic);
  mqttClient.subscribe(roomHumidityTopic);
  mqttClient.on('connect', function mqttConnected() {
    console.log('Connected to MQTT broker');
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
