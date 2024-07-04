#include <NTPtimeESP.h>

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <TimeLib.h>
#include "DHT.h"  

#ifndef APSSID
#define APSSID "HGB" 
#define APPSK "200903HB"
#endif

/* Set these to your desired credentials. */
const char *ssid = APSSID;
const char *password = APPSK;
const char *URL = "http://192.168.52.95:8081/post";
const char *ntpServer = "pool.ntp.org"; // NTP server to get current time
WiFiClient client;
HTTPClient http;
ESP8266WebServer server(80);
#define DHTPIN D7 // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11 // DHT 22 (AM2302), AM2321
#define BUZZER D5 // Pin connected to the buzzer
#define TEMP_THRESHOLD  20 // Temperature threshold (degrees C)
#define HUMID_THRESHOLD  80 // Humidity threshold (%)
#define Fan  D6

DHT dht(DHTPIN, DHTTYPE); // Initialize DHT sensor object
unsigned long lastPostTime = 0; // Last time the data was posted
const unsigned long postInterval = 5000; // Interval between posts (in milliseconds)

void handleOnConnect();

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.print("Connect to existing Wifi network...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.on("/", handleOnConnect);
  server.enableCORS(true);
  server.begin();
  Serial.println("HTTP server started");
  dht.begin(); // Initialize DHT sensor
  pinMode(BUZZER, OUTPUT); // Declare buzzer pin as output
  configTime(7 * 3600, 0, ntpServer); // Configure time zone and NTP server
  while (!time(nullptr)) { // Wait for the time to be set
    Serial.print(".");
    delay(1000);
  }
  Serial.println("Time set");
  lastPostTime = millis(); // Initialize last post time
}

void loop() {
  server.handleClient();
  unsigned long currentTime = millis(); // Get current time
  float temp = dht.readTemperature(); // Read temperature from DHT sensor
  float humid = dht.readHumidity(); // Read humidity from DHT sensor
  Serial.print("Temperature: "); // Print temperature value
  Serial.print(temp);
  Serial.println(" *C");
  Serial.print("Humidity: "); // Print humidity value
  Serial.print(humid);
  Serial.println(" %");
  if (temp > TEMP_THRESHOLD || humid > HUMID_THRESHOLD  ) { // If temperature or humidity exceeds threshold
    Serial.println("Warning: Temperature or humidity is too high!"); // Print warning
    tone(BUZZER, 1000, 1000); // Activate buzzer to make sound with frequency 1000Hz for 1 second
    postJsonData(temp, humid); // Post temperature and humidity data to server
    digitalWrite(Fan,HIGH);
    Serial.println("Fan on");
  }else { 
    Serial.println("Warning: Temperature or humidity is normal"); // Print warning
    tone(BUZZER, 0, 0); // Activate buzzer to make sound with frequency 1000Hz for 1 second
    postJsonData(temp, humid); // Post temperature and humidity data to server
    digitalWrite(Fan,LOW);
    Serial.println("Fan off");
  }
  delay(2000); // Wait 2 seconds
}

void handleOnConnect() {
  server.send(200, "text/html", "ok");
}

void postJsonData(float temp, float humid) {
  Serial.print("connecting to ");
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, URL)) { // HTTP
      Serial.print("[HTTP] POST...\n");
      // Send data to server as JSON
      const int capacity = JSON_OBJECT_SIZE(2000);
      StaticJsonDocument<capacity> doc;
      /* Read sensor data here */
      doc["temperature"] = temp;
      doc["humidity"] = humid;
      time_t now = time(nullptr); // Get current time
      char timeStr[9]; // Buffer to store time string
      strftime(timeStr, sizeof(timeStr), "%H:%M:%S", localtime(&now)); // Format time as HH:MM:SS
      doc["times"] = timeStr;
      char output[2048];  
      serializeJson(doc, Serial); // Print to screen
      serializeJson(doc, output); // Write to output variable
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST(output);
      Serial.println(httpCode);
      http.end(); //Close connection Serial.println();
      Serial.println("closing connection");
    }
  }
}