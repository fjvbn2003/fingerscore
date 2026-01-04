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
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import java.util.*

enum class Sport { TABLE_TENNIS, TENNIS, BADMINTON }

class MainActivity : AppCompatActivity() {

    private var scoreA = 0
    private var scoreB = 0
    private var currentSport = Sport.TABLE_TENNIS

    private lateinit var tvScoreA: TextView
    private lateinit var tvScoreB: TextView
    private lateinit var tvStatus: TextView
    private lateinit var btnPairA: Button
    private lateinit var btnPairB: Button

    private val bluetoothManager by lazy { getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager }
    private val bluetoothAdapter by lazy { bluetoothManager.adapter }
    private val bleScanner by lazy { bluetoothAdapter.bluetoothLeScanner }

    private val SERVICE_UUID = UUID.fromString("12345678-9abc-def0-1234-56789abcdef0")
    private val CHARACTERISTIC_UUID = UUID.fromString("12345678-9abc-def0-1234-56789abcdef1")

    private var addressA: String? = null
    private var addressB: String? = null
    private val connectedGatts = mutableMapOf<String, BluetoothGatt>()
    
    // For Scan Dialog
    private val foundDevices = mutableMapOf<String, BluetoothDevice>()
    private var pairingTeam: Char? = null // 'A' or 'B'

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tvScoreA = findViewById(R.id.tvScoreA)
        tvScoreB = findViewById(R.id.tvScoreB)
        tvStatus = findViewById(R.id.tvGlobalStatus)
        btnPairA = findViewById(R.id.btnPairA)
        btnPairB = findViewById(R.id.btnPairB)

        setupSportSelectors()
        setupManualControls()
        setupPairingButtons()

        checkPermissions()
    }

    private fun setupSportSelectors() {
        val btnTT = findViewById<Button>(R.id.btnTableTennis)
        val btnTennis = findViewById<Button>(R.id.btnTennis)
        val btnBadm = findViewById<Button>(R.id.btnBadminton)

        val resetColors = {
            btnTT.setTextColor(0xFFFFFFFF.toInt())
            btnTennis.setTextColor(0xFFFFFFFF.toInt())
            btnBadm.setTextColor(0xFFFFFFFF.toInt())
        }

        btnTT.setOnClickListener {
            currentSport = Sport.TABLE_TENNIS
            resetColors()
            btnTT.setTextColor(0xFF00E676.toInt())
            updateUI()
        }
        btnTennis.setOnClickListener {
            currentSport = Sport.TENNIS
            resetColors()
            btnTennis.setTextColor(0xFF00E676.toInt())
            updateUI()
        }
        btnBadm.setOnClickListener {
            currentSport = Sport.BADMINTON
            resetColors()
            btnBadm.setTextColor(0xFF00E676.toInt())
            updateUI()
        }
    }

    private fun setupManualControls() {
        findViewById<ImageButton>(R.id.plusOneA).setOnClickListener { scoreA++; updateUI() }
        findViewById<ImageButton>(R.id.btnMinusA).setOnClickListener { if (scoreA > 0) scoreA--; updateUI() }
        findViewById<ImageButton>(R.id.plusOneB).setOnClickListener { scoreB++; updateUI() }
        findViewById<ImageButton>(R.id.btnMinusB).setOnClickListener { if (scoreB > 0) scoreB--; updateUI() }
    }

    private fun setupPairingButtons() {
        btnPairA.setOnClickListener { startPairingFlow('A') }
        btnPairB.setOnClickListener { startPairingFlow('B') }
    }

    private fun startPairingFlow(team: Char) {
        pairingTeam = team
        foundDevices.clear()
        
        val dialog = AlertDialog.Builder(this)
            .setTitle("Pair Ring for Team $team")
            .setItems(arrayOf("Scanning...")) { _, _ -> }
            .setNegativeButton("Cancel") { _, _ -> bleScanner.stopScan(scanCallback) }
            .show()

        val adapter = ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, mutableListOf())
        dialog.listView.adapter = adapter
        dialog.listView.setOnItemClickListener { _, _, position, _ ->
            val name = adapter.getItem(position)
            val device = foundDevices[name]
            if (device != null) {
                if (team == 'A') addressA = device.address else addressB = device.address
                connectToDevice(device)
                dialog.dismiss()
            }
        }

        bleScanner.startScan(scanCallback)
        Toast.makeText(this, "Scanning for 10s...", Toast.LENGTH_SHORT).show()
        Handler(Looper.getMainLooper()).postDelayed({
            bleScanner.stopScan(scanCallback)
            if (adapter.isEmpty) {
                adapter.add("No devices found")
                adapter.notifyDataSetChanged()
            }
        }, 5000)

        // Internal scan callback update
        this.currentDialogAdapter = adapter
    }

    private var currentDialogAdapter: ArrayAdapter<String>? = null

    private fun checkPermissions() {
        val permissions = arrayOf(
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_CONNECT,
            Manifest.permission.ACCESS_FINE_LOCATION
        )
        if (permissions.any { ActivityCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED }) {
            ActivityCompat.requestPermissions(this, permissions, 1)
        }
    }

    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            val scanRecord = result.scanRecord
            val deviceName = device.name ?: scanRecord?.deviceName ?: "Unknown"
            val addr = device.address
            val displayName = "$deviceName ($addr)"
            
            if (!foundDevices.containsKey(displayName)) {
                foundDevices[displayName] = device
                runOnUiThread {
                    currentDialogAdapter?.add(displayName)
                    currentDialogAdapter?.notifyDataSetChanged()
                }
            }
        }

        override fun onScanFailed(errorCode: Int) {
            Log.e("BLE_DEBUG", "Scan failed: $errorCode")
            runOnUiThread {
                Toast.makeText(this@MainActivity, "Scan Failed: $errorCode", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun connectToDevice(device: BluetoothDevice) {
        tvStatus.text = "Connecting to ${device.address}..."
        device.connectGatt(this, false, gattCallback)
    }

    private val gattCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            val addr = gatt.device.address
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                connectedGatts[addr] = gatt
                runOnUiThread { tvStatus.text = "Connected: $addr" }
                gatt.discoverServices()
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                connectedGatts.remove(addr)
                runOnUiThread { tvStatus.text = "Disconnected: $addr" }
            }
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            Log.d("BLE_DEBUG", "Services discovered: $status")
            // Results in F0DEBC9A-7856-3412-F0DE-BC9A78563412
            val serviceUUID = UUID.fromString("f0debc9a-7856-3412-f0de-bc9a78563412")
            val charUUID = UUID.fromString("f1debc9a-7856-3412-f1de-bc9a78563412")
            
            val service = gatt.getService(serviceUUID)
            if (service == null) {
                Log.e("BLE_DEBUG", "Service NOT found: $serviceUUID")
                // Log all discovered services for debugging
                gatt.services.forEach { Log.d("BLE_DEBUG", "Found service: ${it.uuid}") }
                return
            }
            
            val char = service.getCharacteristic(charUUID)
            if (char != null) {
                Log.d("BLE_DEBUG", "Characteristic found: $charUUID")
                val registered = gatt.setCharacteristicNotification(char, true)
                Log.d("BLE_DEBUG", "Notification registered: $registered")
                
                val descriptor = char.getDescriptor(UUID.fromString("00002902-0000-1000-8000-00805f9b34fb"))
                if (descriptor != null) {
                    descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                    val success = gatt.writeDescriptor(descriptor)
                    Log.d("BLE_DEBUG", "Descriptor write initiated: $success")
                } else {
                    Log.e("BLE_DEBUG", "Descriptor NOT found")
                }
            } else {
                Log.e("BLE_DEBUG", "Characteristic NOT found: $charUUID")
                service.characteristics.forEach { Log.d("BLE_DEBUG", "Found char: ${it.uuid}") }
            }
        }

        override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
            val value = characteristic.getIntValue(BluetoothGattCharacteristic.FORMAT_UINT8, 0)
            val addr = gatt.device.address
            Log.d("BLE_DEBUG", "Characteristic changed from $addr: value=$value")
            runOnUiThread {
                if (addr == addressA) {
                    if (value == 1) scoreA++ else if (value == 2 && scoreA > 0) scoreA--
                } else if (addr == addressB) {
                    if (value == 1) scoreB++ else if (value == 2 && scoreB > 0) scoreB--
                }
                updateUI()
            }
        }
    }

    private fun updateUI() {
        tvScoreA.text = formatScore(scoreA)
        tvScoreB.text = formatScore(scoreB)
        btnPairA.text = if (addressA != null) "A: Connected" else "PAIR RING A"
        btnPairB.text = if (addressB != null) "B: Connected" else "PAIR RING B"
    }

    private fun formatScore(s: Int): String {
        if (currentSport == Sport.TENNIS) {
            return when (s) {
                0 -> "0"
                1 -> "15"
                2 -> "30"
                3 -> "40"
                else -> "AD"
            }
        }
        return s.toString()
    }
}
