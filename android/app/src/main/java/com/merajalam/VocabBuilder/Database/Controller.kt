package com.merajalam.VocabBuilder.Database

import android.content.Context
import android.os.Environment
import android.database.sqlite.SQLiteDatabase
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity

fun testDb(context: Context) {
    val dbName = "myvb.db"
    val internalDbPath = "/data/data/com.merajalam.VocabBuilder/files/SQLite/myvb.db"
    
    val db = SQLiteDatabase.openDatabase(internalDbPath, null, SQLiteDatabase.OPEN_READONLY)
    
    try {
        val cursor = db.rawQuery("SELECT * FROM words", null)
        while (cursor.moveToNext()) {
                val id = cursor.getInt(cursor.getColumnIndexOrThrow("id"))
                val word = cursor.getString(cursor.getColumnIndexOrThrow("word"))
                val meaning = cursor.getString(cursor.getColumnIndexOrThrow("meaning"))
                val example = cursor.getString(cursor.getColumnIndexOrThrow("example"))

                Log.d("WordEntry", "ID: $id | Word: $word | Meaning: $meaning | Example: $example")
        }
        cursor.close()
        db.close()
        println("read success")
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
