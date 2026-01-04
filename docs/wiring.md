# Wiring Diagram

This page describes the hardware connection for the Finger Score ring.

## Components
- **Microcontroller**: Seeed Studio XIAO nRF52840 Sense
- **Switches**: 2x Tactile Push Buttons (Up / Down)

## Reference Pinout Image
![XIAO nRF52840 Sense Pinout](/Users/youngjukim/.gemini/antigravity/brain/87b81c08-5ea9-4a3e-a1e2-5ac3c5144fd8/xiao_pinout_reference.png)

## Wiring Scheme

The firmware uses internal pull-up resistors (`INPUT_PULLUP`), so the buttons should connect the digital pins directly to **GND** when pressed.

```mermaid
graph TD
    subgraph "Seeed Studio XIAO nRF52840 Sense Layout"
        direction TB
        
        subgraph "Left Connector (J1)"
            P0[D0 / A0 / P0.02]
            P1[D1 / A1 / P0.03]
            P2[D2 / A2 / P0.28]
            P3[D3 / A3 / P0.29]
            P4[D4 / A4 / SDA / P0.04]
            P5[D5 / A5 / SCL / P0.05]
            P6[D6 / TX / P1.11]
        end
        
        subgraph "Right Connector (J2)"
            P_5V[5V]
            P_GND[GND]
            P_3V3[3V3]
            P10[D10 / MOSI / P1.15]
            P9[D9 / MISO / P1.14]
            P8[D8 / SCK / P1.13]
            P7[D7 / RX / P1.12]
        end
    end

    %% Button Connections
    BTN_UP((UP Button)) --- P0
    BTN_UP --- P_GND
    BTN_DOWN((DOWN Button)) --- P1
    BTN_DOWN --- P_GND

    style P0 fill:#f9f,stroke:#333
    style P1 fill:#f9f,stroke:#333
    style P_GND fill:#aaa,stroke:#333
    style P_5V fill:#faa,stroke:#333
    style P_3V3 fill:#faa,stroke:#333
```

## Pin Mapping Table

| Function | XIAO Pin | Type | Notes |
| :--- | :--- | :--- | :--- |
| Score Up | **D0** | Digital Input | Connect to GND via button |
| Score Down | **D1** | Digital Input | Connect to GND via button |
| Ground | **GND** | Power | Common ground for both buttons |

## Visual Guide
1. Solder one leg of the **Up Button** to pin **D0**.
2. Solder one leg of the **Down Button** to pin **D1**.
3. Solder the other legs of **both buttons** to a **GND** pin.
