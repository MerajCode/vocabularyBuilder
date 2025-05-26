import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

export const databaseName = "myvb.db";

export const sqliteDb = SQLite.openDatabaseSync(databaseName, {
  enableChangeListener: true,
});

export const db = drizzle(sqliteDb);

sqliteDb.execSync(`
  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    type TEXT,
    meaning TEXT,
    form1 TEXT,
    form2 TEXT,
    form3 TEXT,
    example TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

sqliteDb.execSync(`
  CREATE TABLE IF NOT EXISTS bar_notification (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	type text,
	timer integer NOT NULL,
	created_at text DEFAULT CURRENT_TIMESTAMP
);
`);

sqliteDb.execSync(`
  CREATE TABLE IF NOT EXISTS scheduled_notifications (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	type text,
	timer integer NOT NULL,
	is_active integer DEFAULT 1 NOT NULL,
	created_at text DEFAULT CURRENT_TIMESTAMP
);
`);
