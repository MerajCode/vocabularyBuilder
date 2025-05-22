import * as SQLite from "expo-sqlite";
import Papa from "papaparse";

export type WordData = {
  word: string;
  type?: string | null;
  meaning?: string | null;
  form1?: string | null;
  form2?: string | null;
  form3?: string | null;
  example?: string | null;
};

class WordsDB {
  private static db: SQLite.SQLiteDatabase | null = null;

  private static async init(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync("./mywords.db");
      await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS words (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          word TEXT NOT NULL,
          type TEXT,
          meaning TEXT,
          form1 TEXT,
          form2 TEXT,
          form3 TEXT,
          example TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
    return this.db;
  }

  static async insertWord(wordData: WordData): Promise<number> {
    const db = await this.init();
    const {
      word,
      type = null,
      meaning = null,
      form1 = null,
      form2 = null,
      form3 = null,
      example = null,
    } = wordData;

    const result = await db.runAsync(
      `INSERT INTO words (word, type, meaning, form1, form2, form3, example)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      word,
      type,
      meaning,
      form1,
      form2,
      form3,
      example
    );

    console.log("result.lastInsertRowId: ", result.lastInsertRowId);
    return result.lastInsertRowId;
  }

  static async updateWord(id: number, wordData: WordData): Promise<void> {
    const db = await this.init();
    const {
      word,
      type = null,
      meaning = null,
      form1 = null,
      form2 = null,
      form3 = null,
      example = null,
    } = wordData;

    await db.runAsync(
      `UPDATE words SET word = ?, type = ?, meaning = ?, form1 = ?, form2 = ?, form3 = ?, example = ? WHERE id = ?`,
      word,
      type,
      meaning,
      form1,
      form2,
      form3,
      example,
      id
    );
  }

  static async deleteWord(id: number): Promise<void> {
    const db = await this.init();
    await db.runAsync(`DELETE FROM words WHERE id = ?`, id);
  }

  static async getWord(
    id: number
  ): Promise<(WordData & { id: number; created_at: string }) | undefined> {
    const db = await this.init();
    const row = await db.getFirstAsync(`SELECT * FROM words WHERE id = ?`, id);
    return row
      ? (row as WordData & { id: number; created_at: string })
      : undefined;
  }

  static async getRandWord(
    type?: string
  ): Promise<(WordData & { id: number; created_at: string }) | undefined> {
    const db = await this.init();
    const row = type
      ? await db.getFirstAsync(
          `SELECT * FROM words WHERE type=? ORDER BY RANDOM() LIMIT 1`,
          type
        )
      : await db.getFirstAsync(`SELECT * FROM words ORDER BY RANDOM() LIMIT 1`);
    return row
      ? (row as WordData & { id: number; created_at: string })
      : undefined;
  }

  static async getAllWords(): Promise<
    (WordData & { id: number; created_at: string })[]
  > {
    const db = await this.init();
    const rows = await db.getAllAsync(`SELECT * FROM words`);
    return rows as (WordData & { id: number; created_at: string })[];
  }

  /**
   * Bulk insert words from CSV content string.
   * CSV must have columns: word,type,meaning,form1,form2,form3,example
   */
  static async bulkInsertFromCSV(csvContent: string): Promise<void> {
    const db = await this.init();

    // Parse CSV content
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length) {
      throw new Error(
        "CSV parsing error: " + parsed.errors.map((e) => e.message).join(", ")
      );
    }

    // Wrap inserts in a transaction for better performance
    await db.execAsync("BEGIN TRANSACTION;");

    try {
      for (const row of parsed.data as WordData[]) {
        // Ensure required field word exists
        if (!row.word) continue;

        await db.runAsync(
          `INSERT INTO words (word, type, meaning, form1, form2, form3, example) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          row.word,
          row.type ?? null,
          row.meaning ?? null,
          row.form1 ?? null,
          row.form2 ?? null,
          row.form3 ?? null,
          row.example ?? null
        );
      }
      await db.execAsync("COMMIT;");
    } catch (err) {
      await db.execAsync("ROLLBACK;");
      throw err;
    }
  }
}

export default WordsDB;
