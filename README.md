# Weather Bro

ESP32 microcontroller that feeds weather data via MQTT to a MQTT Broker

# Getting Started

## Software

Install node libraries with:

```
npm install
```

Using [dotenv](https://github.com/motdotla/dotenv) library, we can store environment variables within a `.env` file. Create a `.env` file and add the necessary environment variables:

| Environment Variable | Value                            |
| -------------------- | -------------------------------- |
| MQTT_SERVER          | Address of the MQTT broker       |
| MQTT_PORT            | Port of the MQTT broker          |
| MQTT_USERNAME        | Username to use MQTT broker with |
| MQTT_PASSWORD        | Password for the username        |

## Equipment

- ESP32 DEVKIT
- DHT22 Sensor (AM2302)

## ESP32 Setup

If you want to use the Arduino IDE to setup the ESP32 microcontroller, you will need to download the library [here](https://github.com/espressif/arduino-esp32).

You will also need to download the following libraries using the Library Manager. `Tools > Manage Libraries...`

- DHT sensor library by Adafruit
- [PubSubClient by Nick O'Leary](https://github.com/knolleary/pubsubclient)

Edit the sketch for the ESP32 to the correct Network SSID and password. Make sure you point to the correct IP address for the MQTT broker.

# TODO:

- [ ] Complete real-time dashboard (Can only see data from past 5 minutes or so)
- [ ] Complete historical data viewer
- [ ] Add winston logging
- [ ] Add travisCI
- [ ] Integrate MongoDB to store data
- [ ] LED to display unsuccessful connection to MQTT Broker
