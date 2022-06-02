#include <Adafruit_MQTT.h>
#include <Adafruit_MQTT_Client.h>
#include <ESP8266WiFi.h>


#define ssid "Kaveesh"
#define pass "5000gpay"


#define server "io.adafruit.com"
#define port 1883
#define username "kaveesh2001"
#define apiKey "aio_IGzm90OzpfXhpk9oGcUrFX7yivyy"
 
int analogInPin  = A0;    // Analog input pin
int sensorValue;          // Analog Output of Sensor
float calibration = 0.36; // Check Battery voltage using multimeter & add/subtract the value
int bat_percentage;
 
WiFiClient client;

// Setup the MQTT client class by passing in the WiFi client and MQTT server and login details.
Adafruit_MQTT_Client mqtt(&client, server, port, username, apiKey);


Adafruit_MQTT_Publish voltage = Adafruit_MQTT_Publish(&mqtt, username "/feeds/voltage");
Adafruit_MQTT_Publish percent = Adafruit_MQTT_Publish(&mqtt, username "/feeds/percent");

float mapfloat(float x, float in_min, float in_max, float out_min, float out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void MQTT_connect()
{

  //  // Stop if already connected
  if (mqtt.connected() && mqtt.ping())
  {
    //    mqtt.disconnect();
    return;
  }

  int8_t ret;

  mqtt.disconnect();

  Serial.print("Connecting to MQTT... ");
  uint8_t retries = 3;
  while ((ret = mqtt.connect()) != 0) // connect will return 0 for connected
  {
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Retrying MQTT connection in 5 seconds...");
    mqtt.disconnect();
    delay(5000);  // wait 5 seconds
    retries--;
    if (retries == 0)
    {
      ESP.reset();
    }
  }
  Serial.println("MQTT Connected!");
}
 
void setup()
{
  Serial.begin(9600);
  Serial.println("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, pass);
 
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    Serial.print("*");
  }
  Serial.println("");
  Serial.println("WiFi connected");
}
 
void loop()
{

  MQTT_connect();
  
  sensorValue = analogRead(analogInPin);
  float volt = (((sensorValue * 3.3) / 1024) * 2 + calibration); //multiply by two as voltage divider network is 100K & 100K Resistor
 
  bat_percentage = mapfloat(volt, 2.8, 4.2, 0, 100); //2.8V as Battery Cut off Voltage & 4.2V as Maximum Voltage
 
  if (bat_percentage >= 100)
  {
    bat_percentage = 100;
  }
  if (bat_percentage <= 0)
  {
    bat_percentage = 1;
  }
 
  Serial.print("Analog Value = ");
  Serial.print(sensorValue);
  Serial.print("\t Output Voltage = ");
  Serial.print(volt);
  Serial.print("\t Battery Percentage = ");
  Serial.println(bat_percentage);
  delay(3000);
  voltage.publish(volt);
  percent.publish(bat_percentage);
}