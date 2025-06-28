import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";
import migrations from '../drizzle/migrations';

export const databaseName = "myvb.db";

export const sqliteDb = SQLite.openDatabaseSync(databaseName, {
  enableChangeListener: true,
});

// Run migrations
migrate(drizzle(sqliteDb), migrations);

export const db = drizzle(sqliteDb);
