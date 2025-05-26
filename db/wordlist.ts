import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const wordlist = sqliteTable('words', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  word: text('word').notNull(),
  type: text('type'),
  meaning: text('meaning'),
  form1: text('form1'),
  form2: text('form2'),
  form3: text('form3'),
  example: text('example'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const wordType = wordlist.type;
// export const wordlistInsert = wordlist.$inferInsert;