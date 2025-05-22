package com.todo22001.VacabBuilder

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

data class WordData(
    val word: String,
    val type: String? = null,
    val meaning: String? = null,
    val form1: String? = null,
    val form2: String? = null,
    val form3: String? = null,
    val example: String? = null
)

fun showWordNotification(context: Context, wordData: WordData) {
    val channelId = "word_channel_id"
    val channelName = "Word Notifications"

    // Create channel for Android O+
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channel = NotificationChannel(
            channelId,
            channelName,
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Shows new word information"
        }

        val notificationManager: NotificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }

    // Construct long styled text
    val contentText = buildString {
        appendLine("📖 *${wordData.word}* (${wordData.type ?: "N/A"})")
        wordData.meaning?.let { appendLine("• Meaning: $it") }
        if (!wordData.form1.isNullOrEmpty() || !wordData.form2.isNullOrEmpty() || !wordData.form3.isNullOrEmpty()) {
            append("• Forms: ")
            append(listOfNotNull(wordData.form1, wordData.form2, wordData.form3).joinToString(", "))
            appendLine()
        }
        wordData.example?.let { appendLine("📝 Example: $it") }
    }

    val notification = NotificationCompat.Builder(context, channelId)
        .setSmallIcon(android.R.drawable.ic_menu_info_details)
        .setContentTitle("✨ Word of the Moment")
        .setStyle(NotificationCompat.BigTextStyle().bigText(contentText))
        .setPriority(NotificationCompat.PRIORITY_HIGH)
        .setAutoCancel(true)
        .build()

    NotificationManagerCompat.from(context).notify(1001, notification)
}
