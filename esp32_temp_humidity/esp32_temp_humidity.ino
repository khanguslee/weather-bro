"""
  Tutorial: https://randomnerdtutorials.com/esp32-mqtt-publish-subscribe-arduino-ide/
"""
#include <WiFi.h>
#include <PubSubClient.h>

#include "DHT.h"
#define DHTTYPE DHT22

const char* network_ssid = "SSID HERE";
const char* network_password = "PASSWORD HERE";

const char* mqtt_server = "MQTT BROKER IP HERE";

WiFiClient espClient;
PubSubClient client(espClient);

const uint8_t DHTPin = 13; 
DHT dht(DHTPin, DHTTYPE);

float temperature = 0;
float humidity = 0;
long prev_time = 0;

void setup() {  
  Serial.begin(115200);
  pinMode(DHTPin, INPUT);

  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void setup_wifi() {
  Serial.print("Connecting to network:");
  Serial.println(network_ssid);

  WiFi.begin(network_ssid, network_password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
    while (!client.connected()) {
      Serial.print("Attempting MQTT connection...");
      if (client.connect("ESP32-ROOM")) {
        Serial.println("connected");
      } else {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        Serial.println(" try again in 5 seconds");
        // Wait 5 seconds before retrying
        delay(5000);
      }
    }
}

void loop() {
  if (!client.connected()) {
    reconnect_mqtt();
  }
  client.loop();
  long current_time = millis();
  if (current_time - prev_time > 1000) {
    prev_time = current_time;
    
    temperature = dht.readTemperature();
    char temperature_string[8];
    dtostrf(temperature, 1, 2, temperature_string);
    Serial.print("Temperature: ");
    Serial.println(temperature_string);
    client.publish("esp32/room/temperature", temperature_string);

    humidity = dht.readHumidity();
    char humidity_string[8];
    dtostrf(humidity, 1, 2, humidity_string);
    Serial.print("Humidity: ");
    Serial.println(humidity_string);
    client.publish("esp32/room/humidity", humidity_string);
  }
}
