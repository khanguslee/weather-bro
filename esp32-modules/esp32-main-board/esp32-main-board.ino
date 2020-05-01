#include "DHT.h"
#define DHTTYPE DHT22

const uint8_t DHTPin = 17;
DHT dht(DHTPin, DHTTYPE);

float temperature = 0;
float humidity = 0;
long prev_time = 0;

void setup()
{
    Serial.begin(115200);
    pinMode(DHTPin, INPUT);

    dht.begin();
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
    }
}
