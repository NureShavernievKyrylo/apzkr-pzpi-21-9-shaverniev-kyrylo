/**
   ESP32 + DHT22 Example for Wokwi
   
   https://wokwi.com/arduino/projects/322410731508073042
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include "DHTesp.h"

const int DHT_PIN = 15;
DHTesp dhtSensor;

// Replace with your network credentials
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// Replace with your server endpoint
const char* server = "http://localhost:8000/update_temperature_data";

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 10000; // 10 seconds

void setup() {
  Serial.begin(115200);
  
  // Setup DHT22 sensor
  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Connected to Wi-Fi");
}

void loop() {
  TempAndHumidity data = dhtSensor.getTempAndHumidity();
  
  // Check if the sensor is providing valid data
  if (isnan(data.temperature) || isnan(data.humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  Serial.println("Temp: " + String(data.temperature, 2) + "°C");
  
  Serial.println("---");

  unsigned long currentTime = millis();

  // Only send data every `sendInterval`
  if (currentTime - lastSendTime >= sendInterval) {
    lastSendTime = currentTime;

    // Send the data to the server
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.setTimeout(5000); 
      http.begin(server);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");

      String postData = "temperature=" + String(data.temperature, 2) + "&humidity=" + String(data.humidity, 1);
      int httpResponseCode = http.POST(postData);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    }
  }

  delay(2000); // Wait for a new reading from the sensor (DHT22 has ~0.5Hz sample rate)
}