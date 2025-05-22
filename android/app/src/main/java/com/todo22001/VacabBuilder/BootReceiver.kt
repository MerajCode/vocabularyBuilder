package com.todo22001.VacabBuilder

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            // Start the ScreenMonitorService to handle screen events
            val serviceIntent = Intent(context, ScreenMonitorService::class.java)
            context.startForegroundService(serviceIntent) // or startService() based on your API target
        }
    }
}