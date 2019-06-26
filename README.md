# weather-bro
ESP32 microcontroller that feeds weather data via MQTT to a MQTT Broker

# Getting Started
## Equipment

* ESP32 DEVKIT
* DHT22 Sensor (AM2302)

## ESP32 Setup
If you want to use the Arduino IDE to setup the ESP32 microcontroller, you will need to download the library [here](https://github.com/espressif/arduino-esp32).

You will also need to download the following libraries using the Library Manager. `Tools > Manage Libraries...` 
* DHT sensor library by Adafruit
* [PubSubClient by Nick O'Leary](https://github.com/knolleary/pubsubclient)

Edit the sketch for the ESP32 to the correct Network SSID and password. Make sure you point to the correct IP address for the MQTT broker.
