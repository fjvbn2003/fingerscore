# Wiring Diagram

This page describes the hardware connection for the Finger Score ring.

## Components
- **Microcontroller**: Seeed Studio XIAO nRF52840 Sense
- **Switches**: 2x Tactile Push Buttons (Up / Down)

## Wiring Scheme

The firmware uses internal pull-up resistors (`INPUT_PULLUP`), so the buttons should connect the digital pins directly to **GND** when pressed.

```mermaid
graph TD
    subgraph "Seeed Studio XIAO nRF52840 Sense"
        D0[Pin D0 / Up]
        D1[Pin D1 / Down]
        GND[GND]
    end

    subgraph "Buttons"
        B1[Push Button - UP]
        B2[Push Button - DOWN]
    end

    B1 --- D0
    B1 --- GND
    B2 --- D1
    B2 --- GND

    style B1 fill:#f9f,stroke:#333,stroke-width:2px
    style B2 fill:#f9f,stroke:#333,stroke-width:2px
    style D0 fill:#ccf,stroke:#333,stroke-width:2px
    style D1 fill:#ccf,stroke:#333,stroke-width:2px
    style GND fill:#aaa,stroke:#333,stroke-width:2px
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
