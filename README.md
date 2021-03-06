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

You will also need to download libraries using the Library Manager. `Tools > Manage Libraries...`

### esp32_temp_humidity.ino

#### Libraries

- DHT sensor library by Adafruit
- [PubSubClient by Nick O'Leary](https://github.com/knolleary/pubsubclient)

Edit the sketch for the ESP32 to the correct Network SSID and password. Make sure you point to the correct IP address for the MQTT broker.

### esp32-main-board.ino

The ESP32 module used for this sketch was the ESP32 TTGO T-Display. This module has an built-in 1.14" display. Installation and pinouts for this module can be found [here](https://github.com/Xinyuan-LilyGO/TTGO-T-Display).

#### Libraries

- TFT_eSPI
  - Please follow the instructions in [this repo on installation](https://github.com/Xinyuan-LilyGO/TTGO-T-Display).
- DHT sensor library by Adafruit
- Adafruit BMP280 library by Adafruit

# TODO:

- [ ] Complete real-time dashboard (Can only see data from past 5 minutes or so)
- [ ] Complete historical data viewer
- [ ] Add winston logging
- [ ] Add travisCI
- [ ] Integrate MongoDB to store data
- [x] LED to display unsuccessful connection to MQTT Broker
- [ ] Hovering over circles show data value
- [ ] Circuit diagram of microcontroller and associated sensors/output
