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

    // Settings
    private var isSoundEnabled = true
    private var winThreshold = 21
    private var fontSizeScale = "Large"
    private var currentLang = "ko" // Default to Korean

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
        
        findViewById<ImageButton>(R.id.btnResetAll).setOnClickListener { resetAll() }
        findViewById<ImageButton>(R.id.btnSettings).setOnClickListener { showSettingsDialog() }

        loadSettings()
        applySettings()

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

    private fun loadSettings() {
        val prefs = getSharedPreferences("FingerScorePrefs", MODE_PRIVATE)
        isSoundEnabled = prefs.getBoolean("sound", true)
        winThreshold = prefs.getInt("winThreshold", 21)
        fontSizeScale = prefs.getString("fontSize", "Large") ?: "Large"
        currentLang = prefs.getString("lang", "ko") ?: "ko"
    }

    private fun saveSettings() {
        val prefs = getSharedPreferences("FingerScorePrefs", MODE_PRIVATE)
        prefs.edit().apply {
            putBoolean("sound", isSoundEnabled)
            putInt("winThreshold", winThreshold)
            putString("fontSize", fontSizeScale)
            putString("lang", currentLang)
            apply()
        }
    }

    private fun applySettings() {
        // App Font Size Scaling (Reverted to stable extreme)
        val (scoreSize, setSize) = when(fontSizeScale) {
            "Small" -> 120f to 40f
            "Medium" -> 220f to 80f
            "Large" -> 350f to 120f
            else -> 350f to 120f
        }
        
        tvScoreA.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, scoreSize)
        tvScoreB.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, scoreSize)
        
        tvSetsA.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, setSize)
        tvSetsB.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, setSize)

        // Language handled by activity recreation usually, but we can update TTS locale
        setTtsLanguage(currentLang)
        
        // Update Winning Score Hints or logic
        // This part needs to be careful not to override sport-specific win scores if they are fixed.
        // For now, let's assume winThreshold is a general setting that might be overridden by sport.
        // The actual win score logic is in checkGameWin.
    }

    private fun setTtsLanguage(langCode: String) {
        val locale = when(langCode) {
            "ko" -> Locale.KOREA
            "en" -> Locale.US
            "ja" -> Locale.JAPAN
            "zh" -> Locale.SIMPLIFIED_CHINESE
            else -> Locale.US
        }
        tts?.language = locale
    }

    private fun showSettingsDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_settings, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        val switchSound = dialogView.findViewById<Switch>(R.id.switchSound)
        val rgFontSize = dialogView.findViewById<RadioGroup>(R.id.rgFontSize)
        val etWinScore = dialogView.findViewById<EditText>(R.id.etWinScore)
        val spinnerLang = dialogView.findViewById<Spinner>(R.id.spinnerLanguage)
        val btnSave = dialogView.findViewById<Button>(R.id.btnSaveSettings)

        // Init values
        switchSound.isChecked = isSoundEnabled
        etWinScore.setText(winThreshold.toString())
        when(fontSizeScale) {
            "Small" -> rgFontSize.check(R.id.rbFontSmall)
            "Medium" -> rgFontSize.check(R.id.rbFontMedium)
            "Large" -> rgFontSize.check(R.id.rbFontLarge)
        }

        // Language Spinner
        val languages = listOf(getString(R.string.lang_ko), getString(R.string.lang_en), getString(R.string.lang_ja), getString(R.string.lang_zh))
        val langCodes = listOf("ko", "en", "ja", "zh")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, languages)
        spinnerLang.adapter = adapter
        spinnerLang.setSelection(langCodes.indexOf(currentLang))

        btnSave.setOnClickListener {
            isSoundEnabled = switchSound.isChecked
            winThreshold = etWinScore.text.toString().toIntOrNull() ?: 21
            fontSizeScale = when(rgFontSize.checkedRadioButtonId) {
                R.id.rbFontSmall -> "Small"
                R.id.rbFontMedium -> "Medium"
                R.id.rbFontLarge -> "Large"
                else -> "Large"
            }
            val newLang = langCodes[spinnerLang.selectedItemPosition]
            
            val langChanged = newLang != currentLang
            currentLang = newLang
            
            saveSettings()
            applySettings()
            dialog.dismiss()

            if (langChanged) {
                updateBaseContext(this, currentLang)
                recreate()
            }
        }

        dialog.show()
    }

    private fun updateBaseContext(context: Context, lang: String): Context {
        val locale = Locale(lang)
        Locale.setDefault(locale)
        val config = context.resources.configuration
        config.setLocale(locale)
        return context.createConfigurationContext(config)
    }

    private fun announceScore(isTeamA: Boolean) {
        if (!isSoundEnabled || tts == null || !ttsEnabled) return
        val text = when (currentLang) {
            "ko" -> "현재 스코어, A팀 ${scoreA}대 B팀 ${scoreB}입니다."
            "ja" -> "現在のスコアは、チームA ${scoreA}対 チームB ${scoreB}です。"
            "zh" -> "当前比分，A队 ${scoreA}比 B队 ${scoreB}。"
            else -> "Current score, Team A ${scoreA}, Team B ${scoreB}."
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
        findViewById<ImageButton>(R.id.plusOneA).setOnClickListener { scoreA++; announceScore(true); checkGameWin('A'); updateUI() }
        findViewById<ImageButton>(R.id.btnMinusA).setOnClickListener { if (scoreA > 0) scoreA--; updateUI() }
        findViewById<ImageButton>(R.id.plusOneB).setOnClickListener { scoreB++; announceScore(false); checkGameWin('B'); updateUI() }
        findViewById<ImageButton>(R.id.btnMinusB).setOnClickListener { if (scoreB > 0) scoreB--; updateUI() }
    }

    private fun checkGameWin(team: Char) {
        val winScore = if (currentSport == Sport.TENNIS) 4 else winThreshold
        
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
            val deviceName = device.name ?: scanRecord?.deviceName ?: getString(R.string.unknown_device)
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
                runOnUiThread { tvStatus.text = "${getString(R.string.disconnected)}: $addr"; updateUI() }
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
                    if (value == 1) { scoreA++; announceScore(true); checkGameWin('A') } 
                    else if (value == 2 && scoreA > 0) scoreA--
                } else if (addr == addressB) {
                    if (value == 1) { scoreB++; announceScore(false); checkGameWin('B') }
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
