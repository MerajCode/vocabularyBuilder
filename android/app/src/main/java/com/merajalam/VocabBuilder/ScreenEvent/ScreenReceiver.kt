package com.merajalam.VocabBuilder.ScreenEvent

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
                if (NativeEventModule.getInstance() != null) {
                    NativeEventModule.getInstance()?.sendEvent("SCREEN_OFF")
                } else {
                    Log.w("ScreenReceiver", "⚠️ NativeEventModule not initialized — screen event skipped")
                }

            }
            Intent.ACTION_SCREEN_ON -> {
                Log.d("ScreenReceiver", "🔓 Screen ON")

                if (NativeEventModule.getInstance() != null) {
                    NativeEventModule.getInstance()?.sendEvent("SCREEN_ON")
                } else {
                    Log.w("ScreenReceiver", "⚠️ NativeEventModule not initialized — screen event skipped")
                }
            }
            Intent.ACTION_USER_PRESENT -> {
                Log.d("ScreenReceiver", "👤 User Present (unlocked)")

                if (NativeEventModule.getInstance() != null) {
                    NativeEventModule.getInstance()?.sendEvent("USER_PRESENT")
                } else {
                    Log.w("ScreenReceiver", "⚠️ NativeEventModule not initialized — screen event skipped")
                }
            }
        }
    }
}
