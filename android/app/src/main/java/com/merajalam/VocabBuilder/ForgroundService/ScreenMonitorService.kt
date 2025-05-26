package com.merajalam.VocabBuilder.ForgroundService

import android.app.*
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.util.Log

import android.database.sqlite.SQLiteDatabase
import android.content.Intent
import android.database.Cursor
import com.merajalam.VocabBuilder.R
import android.graphics.Color
import android.widget.RemoteViews

class ScreenMonitorService : Service() {

    private val CHANNEL_ID = "Vocabulary_Builder"
    private val NOTIFICATION_ID = 1
    private val DB_File = "/data/data/com.merajalam.VocabBuilder/files/SQLite/myvb.db"
    private val lastTriggeredMap = mutableMapOf<Int, Long>()


    private val handler = Handler()
    private var wordType: String = "default"
    private var updateIntervalMillis: Long = 30_000L

    private val updateRunnable = object : Runnable {
        override fun run() {
            val (title,content) = getRandomWord() ?: Pair("No content", "VocabBuilder")
            updateNotification(title, content)
            handler.postDelayed(this, updateIntervalMillis)
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        waitForTablesAndStart();
    }

    
    private fun waitForTablesAndStart() {
        try {
            val db = SQLiteDatabase.openDatabase(DB_File, null, SQLiteDatabase.OPEN_READONLY)
            val cursor = db.rawQuery(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='bar_notification'",
                null
            )
            val exists = cursor.count > 0
            cursor.close()
            db.close()

            if (exists) {
                Log.d("ScreenMonitorService", "Tables ready, starting notifications")
                val (typeFromDb, intervalFromDb) = getAttributes() ?: Pair("default", 30_000L)
                wordType = typeFromDb
                updateIntervalMillis = intervalFromDb
                startRepeatingNotificationUpdate()
            } else {
                Log.d("ScreenMonitorService", "Tables not ready, retrying in 10 seconds")
                handler.postDelayed({ waitForTablesAndStart() }, 10_000)
            }
        } catch (e: Exception) {
            Log.e("ScreenMonitorService", "Error checking tables, retrying in 10 seconds", e)
            handler.postDelayed({ waitForTablesAndStart() }, 10_000)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildNotification("Welcome To Vocabulary Builder", "Your learning journey has started.","foreground")
        startForeground(NOTIFICATION_ID, notification)
        return START_STICKY
    }
    

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(updateRunnable)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "VocabBuilder Notifications",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(title: String, content: String, group: String): Notification {

        // val remoteViews = RemoteViews(packageName, R.layout.custom_notification)

        // // Set texts
        // remoteViews.setTextViewText(R.id.title, "Word of the Day")
        // remoteViews.setTextViewText(R.id.message, "This is your daily word!")

        // // Dynamically set background color (use a color int)
        // val backgroundColor = Color.parseColor("#FFEB3B") // yellow
        // remoteViews.setInt(R.id.custom_notification_root, "setBackgroundColor", backgroundColor)
        var icon = R.mipmap.ic_launcher
        if(group=="foreground"){
            icon = R.drawable.ic_custom_notification
        }
        

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
                .setContentTitle(title)
                .setStyle(Notification.BigTextStyle().bigText(content))
                // .setContentText(content)
                .setPriority(Notification.PRIORITY_HIGH)
                .setCategory(Notification.CATEGORY_MESSAGE)
                .setDefaults(Notification.DEFAULT_ALL)
                .setGroup(group)
                .setSmallIcon(icon)
                .setOngoing(true)
                .build()
        } else {
            Notification.Builder(this)
                .setContentTitle(title)
                .setStyle(Notification.BigTextStyle().bigText(content))
                // .setContentText(content)
                .setPriority(Notification.PRIORITY_HIGH)
                .setCategory(Notification.CATEGORY_MESSAGE)
                .setDefaults(Notification.DEFAULT_ALL)
                .setSmallIcon(icon)
                .setOngoing(true)
                .build()
        }
    }

    private fun updateNotification(title: String, content: String) {
        val notification = buildNotification(title, content,"foreground")
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, notification)
    }

    private fun startRepeatingNotificationUpdate() {
        handler.postDelayed(updateRunnable, updateIntervalMillis)

        handler.postDelayed(object : Runnable {
        override fun run() {
            checkAndTriggerScheduledNotifications()
            handler.postDelayed(this, 60_000L) // check every 1 min
            }
        }, 0)
    }

    private fun getRandomWord(): Pair<String, String>? {

        var db: SQLiteDatabase? = null
        var cursor: Cursor? = null

        return try {

            db = SQLiteDatabase.openDatabase(DB_File, null, SQLiteDatabase.OPEN_READONLY)
            
            if(wordType!="default"){
                cursor = db.rawQuery("SELECT * FROM words WHERE type = ? ORDER BY RANDOM() LIMIT 1", arrayOf(wordType))
            }else{
                cursor = db.rawQuery("SELECT * FROM words ORDER BY RANDOM() LIMIT 1", null)
            }

            if (cursor.moveToFirst()) {
                val id = cursor.getInt(cursor.getColumnIndexOrThrow("id"))
                val word = cursor.getString(cursor.getColumnIndexOrThrow("word"))
                val type = cursor.getString(cursor.getColumnIndexOrThrow("type"))
                val meaning = cursor.getString(cursor.getColumnIndexOrThrow("meaning"))
                val form1 = cursor.getString(cursor.getColumnIndexOrThrow("form1"))
                val form2 = cursor.getString(cursor.getColumnIndexOrThrow("form2"))
                val form3 = cursor.getString(cursor.getColumnIndexOrThrow("form3"))
                val example = cursor.getString(cursor.getColumnIndexOrThrow("example"))
                
                var content: String = "Somthing went wrong";
                
                if(type == "verb"){
                    content = "1st: $form1  |  2nd: $form2  |  3rd: $form3 \nExample: $example"
                }else{
                    content = "Example: $example";
                }

                val title = "📝 $word - $meaning ($type)"

                Log.d("getRandomWord", "✅ Read success")
                Pair(title,content)
            } else {
                Log.e("getRandomWord", "❌ No data found in DB")
                Pair("Error", "Please Open App Again.")
            }

        } catch (e: Exception) {
            Log.e("getRandomWord", "❌ DB read failed", e)
            Pair("Error", "Please Open App Again.")
        } finally {
            cursor?.close()
            db?.close()
        }
    }

    private fun getAttributes(): Pair<String, Long>? {
        
        var db: SQLiteDatabase? = null
        var cursor: Cursor? = null

        return try {
            db = SQLiteDatabase.openDatabase(DB_File, null, SQLiteDatabase.OPEN_READONLY)
            cursor = db.rawQuery("SELECT * FROM bar_notification LIMIT 1", null)

            if (cursor.moveToFirst()) {
                val type = cursor.getString(cursor.getColumnIndexOrThrow("type"))
                val timer = cursor.getInt(cursor.getColumnIndexOrThrow("timer"))
                Pair(type, timer * 60 * 1000L) //in mili
            } else {
                Pair("default", 30_000L) // fallback
            }

        } catch (e: Exception) {
            Log.e("IntervalFetch", "❌ Failed to fetch interval", e)
            Pair("default", 30_000L) // fallback

        } finally {
            cursor?.close()
            db?.close()
        }
    }

    private fun checkAndTriggerScheduledNotifications() {
        val now = System.currentTimeMillis()

        val db = SQLiteDatabase.openDatabase(DB_File, null, SQLiteDatabase.OPEN_READONLY)
        val cursor = db.rawQuery("SELECT * FROM scheduled_notifications WHERE is_active = 1", null)

        while (cursor.moveToNext()) {
            val id = cursor.getInt(cursor.getColumnIndexOrThrow("id"))
            val type = cursor.getString(cursor.getColumnIndexOrThrow("type")) ?: "all"
            val interval = cursor.getLong(cursor.getColumnIndexOrThrow("timer"))

            val lastTriggered = lastTriggeredMap[id] ?: 0L
            if (now - lastTriggered >= interval) {
                val wordCursor = if (type != "all") {
                    db.rawQuery("SELECT * FROM words WHERE type = ? ORDER BY RANDOM() LIMIT 1", arrayOf(type))
                } else {
                    db.rawQuery("SELECT * FROM words ORDER BY RANDOM() LIMIT 1", null)
                }

                if (wordCursor.moveToFirst()) {
                    val word = wordCursor.getString(wordCursor.getColumnIndexOrThrow("word"))
                    val meaning = wordCursor.getString(wordCursor.getColumnIndexOrThrow("meaning"))
                    val example = wordCursor.getString(wordCursor.getColumnIndexOrThrow("example"))
                    val form1 = wordCursor.getString(wordCursor.getColumnIndexOrThrow("form1"))
                    val form2 = wordCursor.getString(wordCursor.getColumnIndexOrThrow("form2"))
                    val form3 = wordCursor.getString(wordCursor.getColumnIndexOrThrow("form3"))
                    val wordType = wordCursor.getString(wordCursor.getColumnIndexOrThrow("type"))

                    val title = "🗓️ $word - $meaning ($wordType)"
                    val body = if (wordType == "verb") {
                        "1st: $form1  |  2nd: $form2  |  3rd: $form3 \nExample: $example"
                    } else {
                        "Example: $example"
                    }

                    showDynamicNotification(id, title, body)
                    lastTriggeredMap[id] = now
                }
                wordCursor.close()
            }
        }

        cursor.close()
        db.close()
    }

    private fun showDynamicNotification(id: Int, title: String, content: String) {
        val notification = buildNotification(title, content, "dynamic")
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(id, notification)
    }



}
