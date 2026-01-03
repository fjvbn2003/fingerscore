# Finger Score Project

This project consists of two parts:
1. **Firmware**: For the Seeed Studio XIAO nRF52840 Sense ring.
2. **Android App**: A scoreboard app that connects to the ring via BLE.

See the [Wiring Diagram](file:///Users/youngjukim/Desktop/fingerscore/docs/wiring.md) for hardware setup instructions.

## 1. Firmware Setup (Arduino)

### Prerequisites
- [Arduino IDE](https://www.arduino.cc/en/software) installed.
- **Board Support**:
  - Go to `Settings` > `Additional Boards Manager URLs`.
  - Add: `https://files.seeedstudio.com/arduino/package_seeeduino_boards_index.json`
  - Go to `Tools` > `Board` > `Boards Manager`.
  - Search and install **Seeed nRF52 Boards**.
- **Libraries**:
  - Go to `Tools` > `Manage Libraries`.
  - Search and install **Adafruit Bluefruit nRF52**.
  - Search and install **Adafruit TinyUSB Library**.

### Deployment (Arduino IDE)
1. Open `firmware/firmware.ino` in Arduino IDE.
2. Select Board: **Seeed XIAO nRF52840 Sense**.
3. Connect your device via USB.
4. Click **Upload**.

### Deployment (Terminal - `arduino-cli`)
If you prefer the terminal, follow these steps:

1. **Install `arduino-cli`**:
   ```bash
   brew install arduino-cli
   ```
2. **Setup Configuration**:
   ```bash
   arduino-cli config init
   arduino-cli config add board_manager.additional_urls https://files.seeedstudio.com/arduino/package_seeeduino_boards_index.json
   arduino-cli core update-index
   ```
3. **Install Board and Libraries**:
   ```bash
   arduino-cli core install Seeeduino:nrf52
   arduino-cli lib install "Adafruit Bluefruit nRF52" "Adafruit TinyUSB Library"
   ```
4. **Compile and Upload**:
   Replace `/dev/cu.usbmodem...` with your actual serial port (check with `arduino-cli board list`).
   ```bash
   # Compile
   arduino-cli compile --fqbn Seeeduino:nrf52:Seeed_XIAO_NRF52840_Sense firmware/firmware.ino
   
   # Upload
   arduino-cli upload -p /dev/cu.usbmodem1101 --fqbn Seeeduino:nrf52:Seeed_XIAO_NRF52840_Sense firmware/firmware.ino
   ```

---

## 2. Android App Setup

The current repository contains only the source files. To run the app:

### Prerequisites
- [Android Studio](https://developer.android.com/studio) installed.

### Setup Instructions
1. Open Android Studio.
2. Select **Open** and choose the `android` folder in this repository.
3. Wait for Gradle to sync.
4. **Build and Run**:
   - Connect an Android device (physical device recommended for BLE).
   - Click **Run** (Green play button).

## Troubleshooting
- **Firmware Compilation Error**: "Unable to handle compilation" is fixed by the `.vscode/arduino.json` configuration provided in this repo.
- **BLE Connection**: Ensure Location and Bluetooth are enabled on your Android device.
