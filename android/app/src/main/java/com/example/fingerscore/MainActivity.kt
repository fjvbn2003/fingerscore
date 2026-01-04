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
import android.speech.tts.TextToSpeech
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import java.util.*

enum class Sport { TABLE_TENNIS, TENNIS, BADMINTON }

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private var scoreA = 0
    private var scoreB = 0
    private var setsA = 0
    private var setsB = 0
    private var currentSport = Sport.TABLE_TENNIS

    private lateinit var tvScoreA: TextView
    private lateinit var tvScoreB: TextView
    private lateinit var tvSetsA: TextView
    private lateinit var tvSetsB: TextView
    private lateinit var tvStatus: TextView
    private lateinit var btnPairA: Button
    private lateinit var btnPairB: Button
    
    private var tts: TextToSpeech? = null
    private var ttsEnabled = false

    private val bluetoothManager by lazy { getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager }
    private val bluetoothAdapter by lazy { bluetoothManager.adapter }
    private val bleScanner by lazy { bluetoothAdapter.bluetoothLeScanner }

    private var addressA: String? = null
    private var addressB: String? = null
    private val connectedGatts = mutableMapOf<String, BluetoothGatt>()
    
    // For Scan Dialog
    private val foundDevices = mutableMapOf<String, BluetoothDevice>()
    private var currentDialogAdapter: ArrayAdapter<String>? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tvScoreA = findViewById(R.id.tvScoreA)
        tvScoreB = findViewById(R.id.tvScoreB)
        tvSetsA = findViewById(R.id.tvSetsA)
        tvSetsB = findViewById(R.id.tvSetsB)
        tvStatus = findViewById(R.id.tvGlobalStatus)
        btnPairA = findViewById(R.id.btnPairA)
        btnPairB = findViewById(R.id.btnPairB)

        tts = TextToSpeech(this, this)

        setupSportSelectors()
        setupManualControls()
        setupPairingButtons()
        
        findViewById<ImageButton>(R.id.btnResetAll).setOnClickListener {
            resetAll()
        }

        checkPermissions()
        updateUI()
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale.getDefault())
            if (result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED) {
                ttsEnabled = true
            }
        }
    }

    private fun announceScore() {
        if (!ttsEnabled) return
        val text = if (currentSport == Sport.TENNIS) {
            "${getString(R.string.team_a)} ${formatScore(scoreA)}, ${getString(R.string.team_b)} ${formatScore(scoreB)}"
        } else {
            "${getString(R.string.team_a)} $scoreA, ${getString(R.string.team_b)} $scoreB"
        }
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
    }

    private fun resetAll() {
        scoreA = 0
        scoreB = 0
        setsA = 0
        setsB = 0
        updateUI()
        Toast.makeText(this, getString(R.string.score_reset), Toast.LENGTH_SHORT).show()
    }

    private fun setupSportSelectors() {
        val btnTT = findViewById<Button>(R.id.btnTableTennis)
        val btnTennis = findViewById<Button>(R.id.btnTennis)
        val btnBadm = findViewById<Button>(R.id.btnBadminton)

        val resetColors = {
            btnTT.setTextColor(getColor(R.color.text_secondary))
            btnTennis.setTextColor(getColor(R.color.text_secondary))
            btnBadm.setTextColor(getColor(R.color.text_secondary))
        }

        btnTT.setOnClickListener {
            currentSport = Sport.TABLE_TENNIS
            resetColors()
            btnTT.setTextColor(getColor(R.color.accent_green))
            updateUI()
        }
        btnTennis.setOnClickListener {
            currentSport = Sport.TENNIS
            resetColors()
            btnTennis.setTextColor(getColor(R.color.accent_green))
            updateUI()
        }
        btnBadm.setOnClickListener {
            currentSport = Sport.BADMINTON
            resetColors()
            btnBadm.setTextColor(getColor(R.color.accent_green))
            updateUI()
        }
    }

    private fun setupManualControls() {
        findViewById<ImageButton>(R.id.plusOneA).setOnClickListener { scoreA++; announceScore(); checkGameWin('A'); updateUI() }
        findViewById<ImageButton>(R.id.btnMinusA).setOnClickListener { if (scoreA > 0) scoreA--; updateUI() }
        findViewById<ImageButton>(R.id.plusOneB).setOnClickListener { scoreB++; announceScore(); checkGameWin('B'); updateUI() }
        findViewById<ImageButton>(R.id.btnMinusB).setOnClickListener { if (scoreB > 0) scoreB--; updateUI() }
    }

    private fun checkGameWin(team: Char) {
        val winScore = when (currentSport) {
            Sport.TABLE_TENNIS -> 11
            Sport.TENNIS -> 4 // Simplified Game win (Needs Deuce logic for pro)
             Sport.BADMINTON -> 21
        }
        
        if (team == 'A' && scoreA >= winScore) {
            setsA++
            scoreA = 0
            scoreB = 0
        } else if (team == 'B' && scoreB >= winScore) {
            setsB++
            scoreA = 0
            scoreB = 0
        }
    }

    private fun setupPairingButtons() {
        btnPairA.setOnClickListener { startPairingFlow('A') }
        btnPairB.setOnClickListener { startPairingFlow('B') }
    }

    private fun startPairingFlow(team: Char) {
        foundDevices.clear()
        val adapter = ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, mutableListOf())
        currentDialogAdapter = adapter

        val dialog = AlertDialog.Builder(this)
            .setTitle(getString(R.string.select_ring, if (team == 'A') "A" else "B"))
            .setAdapter(adapter) { _, position ->
                val displayName = adapter.getItem(position)
                val device = foundDevices[displayName]
                if (device != null) {
                    if (team == 'A') addressA = device.address else addressB = device.address
                    connectToDevice(device)
                }
            }
            .setNegativeButton(android.R.string.cancel) { _, _ -> bleScanner.stopScan(scanCallback) }
            .show()

        bleScanner.startScan(scanCallback)
        Toast.makeText(this, getString(R.string.scanning), Toast.LENGTH_SHORT).show()
        Handler(Looper.getMainLooper()).postDelayed({
            bleScanner.stopScan(scanCallback)
        }, 10000)
    }

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
    }

    private fun connectToDevice(device: BluetoothDevice) {
        val addr = device.address
        if (connectedGatts.containsKey(addr)) return
        tvStatus.text = "${getString(R.string.connecting)} $addr"
        device.connectGatt(this, false, gattCallback)
    }

    private val gattCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            val addr = gatt.device.address
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                connectedGatts[addr] = gatt
                runOnUiThread { tvStatus.text = "${getString(R.string.connected)}: $addr" }
                gatt.discoverServices()
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                connectedGatts.remove(addr)
                gatt.close()
                runOnUiThread { tvStatus.text = "Disconnected: $addr"; updateUI() }
            }
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            val serviceUUID = UUID.fromString("f0debc9a-7856-3412-f0de-bc9a78563412")
            val charUUID = UUID.fromString("f1debc9a-7856-3412-f1de-bc9a78563412")
            
            val service = gatt.getService(serviceUUID)
            val char = service?.getCharacteristic(charUUID)
            if (char != null) {
                gatt.setCharacteristicNotification(char, true)
                val descriptor = char.getDescriptor(UUID.fromString("00002902-0000-1000-8000-00805f9b34fb"))
                if (descriptor != null) {
                    descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                    gatt.writeDescriptor(descriptor)
                }
            }
        }

        override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
            val value = characteristic.getIntValue(BluetoothGattCharacteristic.FORMAT_UINT8, 0)
            val addr = gatt.device.address
            runOnUiThread {
                if (addr == addressA) {
                    if (value == 1) { scoreA++; announceScore(); checkGameWin('A') } 
                    else if (value == 2 && scoreA > 0) scoreA--
                } else if (addr == addressB) {
                    if (value == 1) { scoreB++; announceScore(); checkGameWin('B') }
                    else if (value == 2 && scoreB > 0) scoreB--
                }
                updateUI()
            }
        }
    }

    private fun updateUI() {
        tvScoreA.text = formatScore(scoreA)
        tvScoreB.text = formatScore(scoreB)
        tvSetsA.text = setsA.toString()
        tvSetsB.text = setsB.toString()
        btnPairA.text = if (addressA != null && connectedGatts.containsKey(addressA)) getString(R.string.connected) else getString(R.string.pair_ring_a)
        btnPairB.text = if (addressB != null && connectedGatts.containsKey(addressB)) getString(R.string.connected) else getString(R.string.pair_ring_b)
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

    override fun onDestroy() {
        super.onDestroy()
        tts?.stop()
        tts?.shutdown()
        connectedGatts.values.forEach { it.close() }
    }
}
