# Finger Score Project

This project consists of two parts:
1. **Firmware**: For the Seeed Studio XIAO nRF52840 Sense ring.
2. **Android App**: A scoreboard app that connects to multiple rings via BLE.

See the [Wiring Diagram](file:///Users/youngjukim/Desktop/fingerscore/docs/wiring.md) for hardware setup instructions.

---

## 1. Firmware Setup (Arduino)

### Prerequisites
- [Arduino IDE](https://www.arduino.cc/en/software) or `arduino-cli` installed.
- **Board URL**: `https://files.seeedstudio.com/arduino/package_seeeduino_boards_index.json`

### Terminal Workflow (`arduino-cli`)

1. **Setup**:
   ```bash
   arduino-cli core update-index
   arduino-cli core install Seeeduino:nrf52
   arduino-cli lib install "Adafruit Bluefruit nRF52" "Adafruit TinyUSB Library"
   ```

2. **Identify Board (USB)**:
   ```bash
   arduino-cli board list
   # Look for a device with "XIAO nRF52840 Sense"
   ```

3. **Compile and Upload**:
   ```bash
   # Compile
   arduino-cli compile --fqbn Seeeduino:nrf52:xiaonRF52840Sense firmware/firmware.ino
   
   # Upload (Replace /dev/... with your port)
   arduino-cli upload -p /dev/cu.usbmodem1101 --fqbn Seeeduino:nrf52:xiaonRF52840Sense firmware/firmware.ino
   ```

---

## 2. Android App Setup

### Prerequisites
- Android SDK and Platform Tools installed.
- **Wireless Debugging**: Enabled on your Android device (Developer Options).

### Terminal Workflow (CLI)

1. **Setup Project**:
   ```bash
   cd android
   ./gradlew wrapper --gradle-version 8.0.2
   ```

2. **Connect Device (Wireless)**:
   ```bash
   # 1. Pair (Look for IP:Port and Pairing Code on your phone)
   adb pair [IP:PORT] [PAIRING_CODE]
   
   # 2. Connect (Look for IP:Port on your phone)
   adb connect [IP:PORT]
   ```

3. **Build and Deploy**:
   ```bash
   # Build APK
   ./gradlew assembleDebug
   
   # Install and Run
   adb -s [DEVICE_IP:PORT] install -r app/build/outputs/apk/debug/app-debug.apk
   adb -s [DEVICE_IP:PORT] shell am start -n com.example.fingerscore/.MainActivity
   ```

---

## 3. Using the App

### Finding your Ring
- **BLE Name**: The firmware advertises as **`FingerScore-Ring`**.
- **In-App Scan**: Click `PAIR RING A` or `PAIR RING B`. The app will list all nearby BLE devices. Look for **`FingerScore-Ring`**.
- **Bluetooth/Location**: Ensure both are **ON** on your phone. Location is mandatory for BLE scanning on Android.

### Scoreboard Features
- **Team A/B**: Split screen for two rings.
- **Sports**: Supports Table Tennis, Tennis (15/30/40), and Badminton.
- **Manual Mode**: Tap `+` or `-` on the screen to adjust scores manually.
