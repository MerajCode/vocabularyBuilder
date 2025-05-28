import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type'),
  timer: integer('timer').notNull(),
  unlockType: text('unlock_type'),
  unlockStatus: integer('unlock_status', { mode: 'boolean' }).default(false),
  presentType: text('present_type'),
  presentStatus: integer('present_status', { mode: 'boolean' }).default(false), // Added column name here
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const bnType = settings.type;