package com.merajalam.VocabBuilder.BootReceiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.merajalam.VocabBuilder.ForgroundService.ScreenMonitorService
import android.os.Build
import android.util.Log

class BootReciver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            // Start the ScreenMonitorService to handle screen events
            Log.d("BootReceiver", "File From Kotlin")
            val serviceIntent = Intent(context, ScreenMonitorService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }

        }
    }
}