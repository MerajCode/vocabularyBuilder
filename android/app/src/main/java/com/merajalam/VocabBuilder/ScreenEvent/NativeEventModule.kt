package com.merajalam.VocabBuilder.ScreenEvent

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

import android.os.Build
import android.content.Intent
import com.merajalam.VocabBuilder.ForgroundService.ScreenMonitorService

class NativeEventModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NativeEventModule"

    @ReactMethod
    fun addListener(eventName: String?) {
        // Required for NativeEventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for NativeEventEmitter
    }

    @ReactMethod
    fun startForgroundService() {

        val intent = Intent(reactApplicationContext, ScreenMonitorService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(intent)
        } else {
            reactApplicationContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopForgroundService() {
        val intent = Intent(reactApplicationContext, ScreenMonitorService::class.java)
            reactApplicationContext.stopService(intent)
    }

    fun sendEvent(event: String) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("SCREEN_EVENT", event)
            Log.d("NativeEventModule", "🔔 Sent event to JS: $event")
        } catch (e: Exception) {
            Log.e("NativeEventModule", "❌ Error sending event to JS", e)
        }
    }

    companion object {
        private var instance: NativeEventModule? = null

        fun getInstance(): NativeEventModule? {
            return instance
        }

        fun initialize(reactContext: ReactApplicationContext) {
            if (instance == null) {
                instance = NativeEventModule(reactContext)
            }
        }
    }
}
