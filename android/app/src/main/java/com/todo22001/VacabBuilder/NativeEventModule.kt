package com.todo22001.VacabBuilder

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

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
