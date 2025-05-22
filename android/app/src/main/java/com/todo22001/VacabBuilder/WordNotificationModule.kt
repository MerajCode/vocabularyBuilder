package com.todo22001.VacabBuilder

import com.todo22001.VacabBuilder.WordData
import com.todo22001.VacabBuilder.showWordNotification
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class WordNotificationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WordNotificationModule"

    @ReactMethod
    fun showNotification(data: ReadableMap) {
        val context: Context = reactApplicationContext

        val wordData = WordData(
            word = data.getString("word") ?: "Unknown",
            type = data.getString("type"),
            meaning = data.getString("meaning"),
            form1 = data.getString("form1"),
            form2 = data.getString("form2"),
            form3 = data.getString("form3"),
            example = data.getString("example")
        )

        showWordNotification(context, wordData)
    }
}
