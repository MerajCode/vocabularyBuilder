package com.merajalam.VocabBuilder.ScreenEvent

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

interface ScreenEventListener {
    fun onScreenOn()
    fun onUserPresent()
}

class ScreenReceiver() : BroadcastReceiver() {
    var listener: ScreenEventListener? = null
    override fun onReceive(context: Context?, intent: Intent?) {
        when (intent?.action) {
            Intent.ACTION_SCREEN_ON -> {
                Log.d("ScreenReceiver", "🔓 Screen ON")
                listener?.onScreenOn()
            }

            Intent.ACTION_USER_PRESENT -> {
                Log.d("ScreenReceiver", "👤 User Present (unlocked)")
                listener?.onUserPresent()
            }
        }
    }
}
