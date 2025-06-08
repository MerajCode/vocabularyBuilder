package com.merajalam.VocabBuilder.ForgroundService

import android.app.*
import android.content.*
import android.os.*
import android.util.Log
import com.merajalam.VocabBuilder.R
import com.merajalam.VocabBuilder.Database.Controller
import com.merajalam.VocabBuilder.ScreenEvent.ScreenReceiver
import com.merajalam.VocabBuilder.ScreenEvent.ScreenEventListener
import com.merajalam.VocabBuilder.Database.Settings

class ScreenMonitorService : Service(), ScreenEventListener {

    companion object {
        const val STICKY_CHANNEL_ID = "Vocabulary_Builder_Sticky"
        const val EVENT_CHANNEL_ID = "event_notification"
    }

    private val NOTIFICATION_ID = 1
    private lateinit var controller: Controller

    private val handler = Handler(Looper.getMainLooper())
    private var updateIntervalMillis: Long = 24 * 60 * 2 * 30_000L
    private var wordType: String = ""
    private lateinit var screenReceiver: ScreenReceiver
    private val lastTriggeredMap = mutableMapOf<Int, Long>()
    private var lastEventTime = 0L
    private val eventDebounceMillis = 3000L

    override fun onCreate() {
        super.onCreate()
        controller = Controller(this)
        createNotificationChannel()
        createNotificationChannelForEvent()
        waitForTablesAndStart()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == "UPDATE_STICKY_NOTIFICATION") {
            applySettings()
            return START_STICKY
        }

        val notification = buildNotification("Welcome To Vocabulary Builder", "Your learning journey has started.", "foreground")
        startForeground(NOTIFICATION_ID, notification)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        screenReceiver?.let {
            try {
                unregisterReceiver(it)
            } catch (e: Exception) {
                Log.w("ScreenMonitorService", "Error unregistering receiver", e)
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    // --------------- INIT --------------------

    private fun waitForTablesAndStart() {
        try {
            if (controller.checkPrepare()) {
                Log.d("ScreenMonitorService", "Tables ready, starting notifications")
                applySettings()
                registerUserEventReceivers()
                startRepeatingNotificationUpdate()
            } else {
                Log.d("ScreenMonitorService", "Tables not ready, retrying in 10 seconds")
                handler.postDelayed({ waitForTablesAndStart() }, 10_000)
            }
        } catch (e: Exception) {
            Log.e("ScreenMonitorService", "Error checking tables", e)
            handler.postDelayed({ waitForTablesAndStart() }, 10_000)
        }
    }

    private fun applySettings() {
        val setting = fetchSettings()
        wordType = setting.type
        updateIntervalMillis = setting.timer
    }

    private fun registerUserEventReceivers() {
        screenReceiver = ScreenReceiver()
        screenReceiver.listener = this
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_SCREEN_ON)
            addAction(Intent.ACTION_USER_PRESENT)
        }
        registerReceiver(screenReceiver, filter)
    }

    // --------------- NOTIFICATION HANDLING --------------------

    private fun startRepeatingNotificationUpdate() {
        handler.postDelayed(object : Runnable {
            override fun run() {
                val (title, content) = controller.getRandomWord(wordType) ?: Pair("No content", "VocabBuilder")
                updateNotification(title, content)
                handler.postDelayed(this, updateIntervalMillis)
            }
        }, updateIntervalMillis)

        handler.postDelayed(object : Runnable {
            override fun run() {
                checkAndTriggerScheduledNotifications()
                handler.postDelayed(this, 60_000L)
            }
        }, 0)
    }

    private fun updateNotification(title: String, content: String) {
        val notification = buildNotification("📝 $title", content, "foreground")
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, notification)
    }

    private fun buildNotification(title: String, content: String, group: String): Notification {
        val icon = if (group == "foreground") R.drawable.ic_custom_notification else R.mipmap.ic_launcher
        
        val channelId = if (group == "foreground") STICKY_CHANNEL_ID else EVENT_CHANNEL_ID

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, channelId)
        } else {
            Notification.Builder(this)
        }

        builder.apply {
            setContentTitle(title)
            setContentText(content)
            setSmallIcon(icon)
            setGroup(group)
            
            setOngoing(group == "foreground")
            
            if (channelId == EVENT_CHANNEL_ID) {
                setCategory(Notification.CATEGORY_MESSAGE)
            }
        }
        return builder.build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                STICKY_CHANNEL_ID,
                "Sticky Notifications",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun createNotificationChannelForEvent() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                EVENT_CHANNEL_ID, 
                "Event & Scheduled Notifications",
                NotificationManager.IMPORTANCE_HIGH
            )
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    // --------------- EVENT LISTENER METHODS --------------------
    override fun onScreenOn() {
        val setting = fetchSettings()
            if (setting.presentStatus) {
                if (canTriggerEvent()) {
                    showWordNotification(setting.presentType)
                }
            }
            Log.d("ScreenReceiver", "🔓 Screen ON")
    }

    override fun onUserPresent() {
        if (canTriggerEvent()) {
            val setting = fetchSettings()
            if (setting.unlockStatus) {
                showWordNotification(setting.unlockType)
            }
            Log.d("ScreenReceiver", "👤 User Present (unlocked)")
        }
    }

    private fun showWordNotification(type: String?) {
        val (title, content) = controller.getRandomWord(type) ?: Pair("No content", "VocabBuilder")
        showEventNotification(2, "$title 🎉", content)
        Log.d("CustomLogic", "TRIGGERED!")
    }

    private fun showEventNotification(id: Int, title: String, content: String) {
        val notification = buildNotification(title, content, "event")
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(id, notification)
    }

    // --------------- SCHEDULED NOTIFICATIONS --------------------

    private fun checkAndTriggerScheduledNotifications() {
        val now = System.currentTimeMillis()
        val data = controller.getScheduledNotifications()
        data?.use {
            while (it.moveToNext()) {
                val id = it.getInt(it.getColumnIndexOrThrow("id"))
                val type = it.getString(it.getColumnIndexOrThrow("type")) ?: "all"
                val interval = it.getLong(it.getColumnIndexOrThrow("timer"))

                val lastTriggered = lastTriggeredMap[id] ?: 0L

                if (now - lastTriggered >= interval) {
                    val (title, body) = controller.getRandomWord(type) ?: continue
                    showDynamicNotification(id, title, body)
                    lastTriggeredMap[id] = now
                }
            }
        }
    }

    private fun showDynamicNotification(id: Int, title: String, content: String) {
        val notification = buildNotification("🗓️ $title", content, "dynamic")
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(id, notification)
    }

    // --------------- UTILITIES --------------------

    private fun fetchSettings(): Settings = controller.getSettings()

    private fun canTriggerEvent(): Boolean {
        val now = System.currentTimeMillis()
        return if (now - lastEventTime > eventDebounceMillis) {
            lastEventTime = now
            true
        } else {
            false
        }
    }
}