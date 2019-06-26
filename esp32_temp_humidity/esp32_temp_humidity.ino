#include "DHT.h"

#define DHTTYPE DHT22

const uint8_t DHTPin = 13; 
DHT dht(DHTPin, DHTTYPE);

float temperature;
float humidity;
void setup() {  
  Serial.begin(115200);
  pinMode(DHTPin, INPUT);

  dht.begin();
}

void loop() {
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  Serial.println("Temperature: " + String(temperature));
  Serial.println("Humidity: " + String(humidity));

  delay(500);
}
