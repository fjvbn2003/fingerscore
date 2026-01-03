package com.example.fingerscore

import android.Manifest
import android.bluetooth.*
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import java.util.*

class MainActivity : AppCompatActivity() {

    private var score = 0
    private lateinit var tvScore: TextView
    private lateinit var tvStatus: TextView
    
    private val bluetoothManager by lazy { getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager }
    private val bluetoothAdapter by lazy { bluetoothManager.adapter }
    private val bleScanner by lazy { bluetoothAdapter.bluetoothLeScanner }

    // Service and Characteristic UUIDs (Matching Firmware)
    private val SERVICE_UUID = UUID.fromString("12345678-9abc-def0-1234-56789abcdef0")
    private val CHARACTERISTIC_UUID = UUID.fromString("12345678-9abc-def0-1234-56789abcdef1")

    private val connectedDevices = mutableMapOf<String, BluetoothGatt>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tvScore = findViewById(R.id.tvScore)
        tvStatus = findViewById(R.id.tvStatus)
        findViewById<Button>(R.id.btnReset).setOnClickListener {
            score = 0
            updateScoreUI()
        }

        checkPermissions()
    }

    private fun checkPermissions() {
        val permissions = arrayOf(
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_CONNECT,
            Manifest.permission.ACCESS_FINE_LOCATION
        )
        
        if (permissions.any { ActivityCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED }) {
            ActivityCompat.requestPermissions(this, permissions, 1)
        } else {
            startBleScan()
        }
    }

    private fun startBleScan() {
        tvStatus.text = "Scanning for FingerScore-Ring..."
        bleScanner.startScan(scanCallback)
        // Stop scan after 10 seconds to save power
        Handler(Looper.getMainLooper()).postDelayed({
            bleScanner.stopScan(scanCallback)
        }, 10000)
    }

    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            val deviceName = device.name ?: ""
            if (deviceName.contains("FingerScore-Ring")) {
                tvStatus.text = "Found Ring: ${device.address}. Connecting..."
                connectToDevice(device)
            }
        }
    }

    private fun connectToDevice(device: BluetoothGattDevice) {
        if (connectedDevices.containsKey(device.address)) return
        
        device.connectGatt(this, false, gattCallback)
    }

    private val gattCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                Log.i("BLE", "Connected to ${gatt.device.address}")
                connectedDevices[gatt.device.address] = gatt
                runOnUiThread { tvStatus.text = "Connected to ${connectedDevices.size} Ring(s)" }
                gatt.discoverServices()
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                connectedDevices.remove(gatt.device.address)
                runOnUiThread { tvStatus.text = "Disconnected. Re-scanning..." }
                startBleScan()
            }
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            val service = gatt.getService(SERVICE_UUID)
            val characteristic = service?.getCharacteristic(CHARACTERISTIC_UUID)
            if (characteristic != null) {
                // Enable Notifications
                gatt.setCharacteristicNotification(characteristic, true)
                val descriptor = characteristic.getDescriptor(UUID.fromString("00002902-0000-1000-8000-00805f9b34fb"))
                descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                gatt.writeDescriptor(descriptor)
            }
        }

        override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
            val value = characteristic.getIntValue(BluetoothGattCharacteristic.FORMAT_UINT8, 0)
            runOnUiThread {
                if (value == 1) score++ else if (value == 2) score--
                updateScoreUI()
            }
        }
    }

    private fun updateScoreUI() {
        tvScore.text = score.toString()
    }
}
