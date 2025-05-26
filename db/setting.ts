import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const bar_notification = sqliteTable('bar_notification', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type'),
  timer: integer('timer').notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const bnType = bar_notification.type;