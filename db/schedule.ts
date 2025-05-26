import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const scheduled_notifications = sqliteTable('scheduled_notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type'),
  repeat_interval: integer('timer').notNull(),
  is_active: integer('is_active').notNull().default(1),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const notificationType = scheduled_notifications.type;
