/**
 * Finger Score - Ring Firmware
 * Device: Seeed Studio XIAO nRF52840 Sense
 *
 * Description:
 * This firmware acts as a BLE Peripheral. It monitors two tactile switches
 * (Up/Down). When pressed, it sends a score update command to the connected
 * Android device. LED Indicators:
 * - Blue Blinking: Advertising (Waiting for connection)
 * - Green On: Connected
 * - Red: Error or Button Press Feedback
 */

#include <Adafruit_TinyUSB.h>
#include <bluefruit.h>

// BLE Service and Characteristics
// Custom UUIDs for Finger Score
const uint8_t FS_SERVICE_UUID[] = {0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC,
                                   0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78,
                                   0x9A, 0xBC, 0xDE, 0xF0};

const uint8_t FS_CHAR_UUID[] = {0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF1,
                                0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF1};

BLEService fsService = BLEService(FS_SERVICE_UUID);
BLECharacteristic fsCharacteristic = BLECharacteristic(FS_CHAR_UUID);

// Pin Definitions
const int BUTTON_UP = D0;
const int BUTTON_DOWN = D1;

// Button State
int lastUpState = HIGH;
int lastDownState = HIGH;

void setup() {
  Serial.begin(115200);
  // while ( !Serial ) delay(10); // Optional: Wait for serial

  pinMode(BUTTON_UP, INPUT_PULLUP);
  pinMode(BUTTON_DOWN, INPUT_PULLUP);

  // XIAO nRF52840 LEDs are active LOW
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  digitalWrite(LED_RED, HIGH);
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_BLUE, HIGH);

  Serial.println("Finger Score Ring Initializing...");

  Bluefruit.begin();
  Bluefruit.setTxPower(4); // Check bluefruit.h for supported values
  Bluefruit.setName("FingerScore-Ring");

  // Set callbacks
  Bluefruit.Periph.setConnectCallback(connect_callback);
  Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

  // Setup Service
  fsService.begin();

  // Setup Characteristic
  // Properties: Read, Notify
  fsCharacteristic.setProperties(CHR_PROPS_READ | CHR_PROPS_NOTIFY);
  fsCharacteristic.setPermission(SECMODE_OPEN, SECMODE_OPEN);
  fsCharacteristic.setFixedLen(1);
  fsCharacteristic.begin();
  fsCharacteristic.write8(0); // Initial value

  // Setup Advertising
  startAdv();

  Serial.println("Advertising...");
}

void startAdv(void) {
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  Bluefruit.Advertising.addService(fsService);
  Bluefruit.Advertising.addName();

  /* Start Advertising
   * - Enable auto advertising if disconnected
   * - Interval:  fast mode = 20 ms, slow mode = 152.5 ms
   * - Timeout for fast mode is 30 seconds
   */
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244); // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30);   // number of seconds in fast mode
  Bluefruit.Advertising.start(0); // 0 = Don't stop advertising after n seconds
}

void loop() {
  // Handle LED Blinking if not connected
  if (!Bluefruit.connected()) {
    static uint32_t lastBlink = 0;
    if (millis() - lastBlink > 500) {
      lastBlink = millis();
      digitalWrite(LED_BLUE, !digitalRead(LED_BLUE));
      digitalWrite(LED_GREEN, HIGH); // Ensure Green is OFF
    }
  } else {
    digitalWrite(LED_BLUE, HIGH); // Blue OFF
    digitalWrite(LED_GREEN, LOW); // Green ON (Connected)
  }

  // Read Buttons
  int currentUpState = digitalRead(BUTTON_UP);
  int currentDownState = digitalRead(BUTTON_DOWN);

  // Dual Button Long Press Detection (Reset Pairing)
  static uint32_t resetHoldStart = 0;
  if (currentUpState == LOW && currentDownState == LOW) {
    if (resetHoldStart == 0) {
      resetHoldStart = millis();
    } else if (millis() - resetHoldStart > 2000) { // 2 seconds hold
      Serial.println("RESET: Both buttons held. Disconnecting...");
      // Visual feedback: Fast red blink
      for (int i = 0; i < 5; i++) {
        digitalWrite(LED_RED, LOW);
        delay(100);
        digitalWrite(LED_RED, HIGH);
        delay(100);
      }
      Bluefruit.disconnect(0); // Disconnect all connections
      resetHoldStart = 0;      // Reset timer
    }
  } else {
    resetHoldStart = 0;
  }

  // Simple Debounce/State Change Detection
  // Only trigger if only one button is pressed to avoid double scores during
  // reset attempt
  if (currentUpState == LOW && currentDownState == HIGH &&
      lastUpState == HIGH) {
    sendScoreUpdate(1); // 1 = Up
    feedbackFlash();
    delay(50); // Small debounce
  }

  if (currentDownState == LOW && currentUpState == HIGH &&
      lastDownState == HIGH) {
    sendScoreUpdate(2); // 2 = Down
    feedbackFlash();
    delay(50); // Small debounce
  }

  lastUpState = currentUpState;
  lastDownState = currentDownState;
}

void sendScoreUpdate(uint8_t value) {
  if (Bluefruit.connected()) {
    Serial.print("Sending Update: ");
    Serial.println(value == 1 ? "UP" : "DOWN");
    fsCharacteristic.notify8(value);
  } else {
    Serial.println("Not connected, command dropped.");
  }
}

void feedbackFlash() {
  digitalWrite(LED_RED, LOW);
  delay(100);
  digitalWrite(LED_RED, HIGH);
}

void connect_callback(uint16_t conn_handle) {
  char central_name[32] = {0};
  BLEConnection *connection = Bluefruit.Connection(conn_handle);
  connection->getPeerName(central_name, sizeof(central_name));

  Serial.print("Connected to ");
  Serial.println(central_name);
}

void disconnect_callback(uint16_t conn_handle, uint8_t reason) {
  (void)conn_handle;
  (void)reason;
  Serial.println("Disconnected");
}
