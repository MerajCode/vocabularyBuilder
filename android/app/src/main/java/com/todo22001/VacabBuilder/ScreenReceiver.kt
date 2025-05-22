package com.todo22001.VacabBuilder

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class ScreenReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        val action = intent?.action
        Log.d("ScreenReceiver", "Received action: $action")

        when (action) {
            Intent.ACTION_SCREEN_OFF -> {
                Log.d("ScreenReceiver", "📴 Screen OFF")
                NativeEventModule.getInstance()?.sendEvent("SCREEN_OFF")
            }
            Intent.ACTION_SCREEN_ON -> {
                Log.d("ScreenReceiver", "🔓 Screen ON")
                NativeEventModule.getInstance()?.sendEvent("SCREEN_ON")
            }
            Intent.ACTION_USER_PRESENT -> {
                Log.d("ScreenReceiver", "👤 User Present (unlocked)")
                NativeEventModule.getInstance()?.sendEvent("USER_PRESENT")
            }
        }
    }
}
