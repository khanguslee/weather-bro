#include <TFT_eSPI.h> 
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include "DHT.h"

#define DHTTYPE DHT22

const uint8_t DHTPin = 17;
DHT dht(DHTPin, DHTTYPE);
float temperature = 0;
float humidity = 0;
long prev_time = 0;

const int ldrPin = 15;

Adafruit_BMP280 bmp;

TFT_eSPI tft = TFT_eSPI();

void setup()
{
    Serial.begin(115200);

    // Setup DHT
    pinMode(DHTPin, INPUT);
    dht.begin();

    if (!bmp.begin(0x76)) {
      Serial.println("Could not find a valid BMP280 sensor, check wiring!");
      while (100);
    }

    // Setup LDR
    pinMode(ldrPin, INPUT);

    // Setup OLED display
    tft.init();
    // Set the font colour to be white with a black background
    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.fillScreen(TFT_BLACK);
}

void loop()
{
    long current_time = millis();
    if (current_time - prev_time > 1000)
    {
        prev_time = current_time;
        
        
        temperature = dht.readTemperature();
        char temperatureString[8];
        dtostrf(temperature, 1, 2, temperatureString);
        Serial.print("Temperature: ");
        Serial.println(temperatureString);       


        humidity = dht.readHumidity();
        char humidityString[8];
        dtostrf(humidity, 1, 2, humidityString);
        Serial.print("Humidity: ");
        Serial.println(humidityString);

        int pressureValue = bmp.readPressure() / 100.0F;
        char pressureString[8];
        dtostrf(pressureValue, 1, 2, pressureString);
        Serial.print("Pressure = ");
        Serial.println(pressureValue);

        tft_display(temperatureString, humidityString, pressureString);

        int ldrValue = analogRead(ldrPin);
        int adjustedLdrValue = map(ldrValue, 0, 4095, 0, 1000);
        Serial.print("LDR: ");
        Serial.println(adjustedLdrValue);
    }
}

void tft_display(char* temperature, char* humidity, char* pressure) {
  // Set "cursor" at top left corner of display (0,0) and select font 4
  tft.setCursor(0, 0, 4);

  tft.println("Temp: ");
  tft.println(temperature);
 
  tft.println("Humidity: ");
  tft.println(humidity);

  tft.println("Pressure: ");
  tft.println(pressure);
}
