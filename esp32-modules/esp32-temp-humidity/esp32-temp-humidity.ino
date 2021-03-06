/*
  Tutorial: https://randomnerdtutorials.com/esp32-mqtt-publish-subscribe-arduino-ide/
*/
#include <WiFi.h>
#include <PubSubClient.h>

#include "DHT.h"
#define DHTTYPE DHT22

const char* network_ssid = "WIFI NETWORK";
const char* network_password = "WIFI PASSWORD";

const char* mqtt_server = "postman.cloudmqtt.com";

WiFiClient espClient;
PubSubClient client(espClient);

const uint8_t DHTPin = 13;
const uint8_t LEDPin = 25;
DHT dht(DHTPin, DHTTYPE);

float temperature = 0;
float humidity = 0;
long prev_time = 0;

void setup() {  
  Serial.begin(115200);
  pinMode(DHTPin, INPUT);
  pinMode(LEDPin, OUTPUT);

  dht.begin();
  setup_wifi();
  // Change below port number to 1883 for the default port that mqtt brokers use
  client.setServer(mqtt_server, 13393);
}

void setup_wifi() {
  digitalWrite(LEDPin, HIGH);
  Serial.print("Connecting to network:");
  Serial.println(network_ssid);

  WiFi.begin(network_ssid, network_password);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LEDPin, LOW);
    delay(100);
    digitalWrite(LEDPin, HIGH);
    delay(400);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  digitalWrite(LEDPin, LOW);
}

void reconnect_mqtt() {
    digitalWrite(LEDPin, HIGH);
    while (!client.connected()) {
      Serial.print("Attempting MQTT connection...");
      if (client.connect("ESP32-ROOM", "USERNAME", "PASSWORD")) {
        Serial.println("connected");
      } else {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        Serial.println(" try again in 5 seconds");
        // Wait 5 seconds before retrying
        delay(5000);
      }
    }
    digitalWrite(LEDPin, LOW);
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
