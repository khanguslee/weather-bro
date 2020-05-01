#include <TFT_eSPI.h> 
#include <SPI.h>
#include "DHT.h"

#define DHTTYPE DHT22

const uint8_t DHTPin = 17;
DHT dht(DHTPin, DHTTYPE);
float temperature = 0;
float humidity = 0;
long prev_time = 0;

TFT_eSPI tft = TFT_eSPI();

void setup()
{
    Serial.begin(115200);
    pinMode(DHTPin, INPUT);

    dht.begin();

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
        char temperature_string[8];
        dtostrf(temperature, 1, 2, temperature_string);
        Serial.print("Temperature: ");
        Serial.println(temperature_string);       


        humidity = dht.readHumidity();
        char humidity_string[8];
        dtostrf(humidity, 1, 2, humidity_string);
        Serial.print("Humidity: ");
        Serial.println(humidity_string);

        tft_display(temperature_string, humidity_string);
    }
}

void tft_display(char* temperature, char* humidity) {
  // Set "cursor" at top left corner of display (0,0) and select font 4
  tft.setCursor(0, 0, 4);

  tft.println("Temp: ");
  tft.println(temperature);
 
  tft.println("Humidity: ");
  tft.println(humidity);
}
