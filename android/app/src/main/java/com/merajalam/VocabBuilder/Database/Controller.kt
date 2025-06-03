package com.merajalam.VocabBuilder.Database

import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.util.Log
import java.io.File

data class NotificationData(
    val id: Int,
    val title: String,
    val body: String,
    val now: Long
)

data class Settings(
    val type: String,
    val timer: Long,
    val unlockType: String?,
    val unlockStatus: Boolean,
    val presentType: String?,
    val presentStatus: Boolean
)

class Controller(private val context: Context) {
    

    private val DB_File = "/data/data/com.merajalam.VocabBuilder/files/SQLite/myvb.db"
    private val db: SQLiteDatabase by lazy {
        ensureDirectoryExists()
        SQLiteDatabase.openDatabase(DB_File, null, SQLiteDatabase.OPEN_READONLY)
    }

    private fun ensureDirectoryExists() {
        val file = File(DB_File)
        file.parentFile?.takeIf { !it.exists() }?.mkdirs()
    }

    fun getRandomWord(wordType: String? = ""): Pair<String, String>? {
        var cursor: Cursor? = null

        return try {
            cursor = if (!wordType.isNullOrEmpty()) {
                db.rawQuery("SELECT * FROM words WHERE type = ? ORDER BY RANDOM() LIMIT 1", arrayOf(wordType))
            } else {
                db.rawQuery("SELECT * FROM words ORDER BY RANDOM() LIMIT 1", null)
            }

            if (cursor.moveToFirst()) {
                val word = cursor.getString(cursor.getColumnIndexOrThrow("word"))
                val meaning = cursor.getString(cursor.getColumnIndexOrThrow("meaning"))
                val type = cursor.getString(cursor.getColumnIndexOrThrow("type"))
                val form1 = cursor.getString(cursor.getColumnIndexOrThrow("form1"))
                val form2 = cursor.getString(cursor.getColumnIndexOrThrow("form2"))
                val form3 = cursor.getString(cursor.getColumnIndexOrThrow("form3"))
                val example = cursor.getString(cursor.getColumnIndexOrThrow("example"))

                val content = if (type == "verb") {
                    "1st: $form1  |  2nd: $form2  |  3rd: $form3 \nExample: $example"
                } else {
                    "Example: $example"
                }

                val title = "$word - $meaning ($type)"
                Pair(title, content)
            } else {
                Pair("Sorry No Content", "Please Change Word Type.")
            }

        } catch (e: Exception) {
            Log.e("DatabaseHelper", "failed to execute query", e)
            Pair("Error", "Please Open App Again.")
        } finally {
            cursor?.close()
        }
    }

    fun getScheduledNotifications(): Cursor? {
        return db.rawQuery("SELECT * FROM scheduled_notifications WHERE is_active = 1", null)
    }

    fun getWordByType(type: String): Cursor {
        return if (type.isNotEmpty()) {
            db.rawQuery("SELECT * FROM words WHERE type = ? ORDER BY RANDOM() LIMIT 1", arrayOf(type))
        } else {
            db.rawQuery("SELECT * FROM words ORDER BY RANDOM() LIMIT 1", null)
        }
    }

    fun getSettings(): Settings {
        var cursor: Cursor? = null

        return try {
            cursor = db.rawQuery("SELECT * FROM settings LIMIT 1", null)

            if (cursor.moveToFirst()) {
                val type = cursor.getString(cursor.getColumnIndexOrThrow("type"))
                val timer = cursor.getInt(cursor.getColumnIndexOrThrow("timer")) * 60 * 1000L
                val unlockType = cursor.getString(cursor.getColumnIndexOrThrow("unlock_type"))
                val unlockStatus = cursor.getInt(cursor.getColumnIndexOrThrow("unlock_status")) != 0
                val presentType = cursor.getString(cursor.getColumnIndexOrThrow("present_type"))
                val presentStatus = cursor.getInt(cursor.getColumnIndexOrThrow("present_status")) != 0

                Settings(type, timer, unlockType, unlockStatus, presentType, presentStatus)
            } else {
                // Return default values if no row found
                Settings("default", 30_000L, null, false, null, false)
            }

        } catch (e: Exception) {
            Log.e("DatabaseHelper", "getSettings failed", e)
            Settings("default", 30_000L, null, false, null, false)
        } finally {
            cursor?.close()
        }
    }

    fun checkPrepare(): Boolean {
        val cursor = db.rawQuery(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='settings'",
            null
        )
        val exists = cursor.count > 0
        cursor.close()
        return exists
    }
}
