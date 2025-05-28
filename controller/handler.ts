import { scheduled_notifications } from "@/db/schedule";
// import { WordData } from '@/utils/Type/Table';
import { eq, InferInsertModel, sql } from "drizzle-orm";
import Papa from "papaparse";
import { settings, wordlist } from "../db/schema";
import { db } from "./database";

export type ScheduledNotificationInsert = InferInsertModel<
  typeof scheduled_notifications
>;
export type SettingInsert = InferInsertModel<typeof settings>;
export type WordData = InferInsertModel<typeof wordlist>;

class WordsDB {
  // You already opened the DB with Drizzle globally, so no need to init here.

  static async insertWord(wordData: WordData): Promise<number> {
    const result = await db.insert(wordlist).values(wordData).returning();
    // result is an array of inserted rows, get the id of first inserted
    return result[0].id;
  }

  static async insertNotification(
    sheduleData: ScheduledNotificationInsert
  ): Promise<number> {
    const result = await db
      .insert(scheduled_notifications)
      .values(sheduleData)
      .returning();
    // result is an array of inserted rows, get the id of first inserted
    return result[0].id;
  }

  static async updateNotification(
    is_active: number,
    id: number
  ): Promise<void> {
    const ss = await db
      .update(scheduled_notifications)
      .set({ is_active })
      .where(eq(scheduled_notifications.id, id))
      .run();
  }

  static async getNotifications(): Promise<ScheduledNotificationInsert[]> {
    const notifications = await db.select().from(scheduled_notifications).all();
    return notifications;
  }

  static async deleteNotifications(id: number) {
    console.log(id);
    const res = await db
      .delete(scheduled_notifications)
      .where(eq(scheduled_notifications.id, id))
      .run();
    console.log(res);
  }

  static async SettingUpdate(
    settingData: Omit<SettingInsert, "id">
  ): Promise<number> {
    const fixedId = 1; // always operate on ID 1

    const result = await db
      .insert(settings)
      .values({
        id: fixedId,
        ...settingData,
      })
      .onConflictDoUpdate({
        target: [settings.id], // conflict on id
        set: {
          ...settingData,
        },
      })
      .returning();

    return result[0].id;
  }
  
  static async deletebar(): Promise<void> {
    await db.delete(settings).run();
  }

  static async getSetting(): Promise<SettingInsert[]> {
    const setting = await db.select().from(settings).limit(1).all();
    return setting;
  }

  static async updateWord(id: number, wordData: WordData): Promise<void> {
    await db.update(wordlist).set(wordData).where(eq(wordlist.id, id)).run();
  }

  static async deleteWord(id: number): Promise<void> {
    await db.delete(wordlist).where(eq(wordlist.id, id)).run();
  }


  static async getWord(id: number): Promise<WordData | undefined> {
    const word = await db
      .select()
      .from(wordlist)
      .where(eq(wordlist.id, id))
      .limit(1)
      .all();
    return word[0];
  }

  static async getAllTypes(): Promise<string[]> {
  const result = await db
    .select({ type: wordlist.type })
    .from(wordlist)
    .groupBy(wordlist.type);

    // Extract type values from result
    return result.map((row) => row.type).filter((type): type is string => type !== null);;
  }

  static async getRandWord(type?: string): Promise<WordData | undefined> {
    if (type) {
      const word = await db
        .select()
        .from(wordlist)
        .where(eq(wordlist.type, type))
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .all();
      return word[0];
    } else {
      const word = await db
        .select()
        .from(wordlist)
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .all();
      return word[0];
    }
  }

  static async getAllwordlist(): Promise<WordData[]> {
    const data = await db.select().from(wordlist).all();
    return data;
  }

  static async bulkInsertFromCSV(csvContent: string): Promise<void> {
    const parsed = Papa.parse<WordData>(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length) {
      throw new Error(
        "CSV parsing error: " + parsed.errors.map((e) => e.message).join(", ")
      );
    }

    await db.transaction(async (tx) => {
      for (const row of parsed.data) {
        if (!row.word) continue;
        await tx.insert(wordlist).values(row);
      }
    });
  }
}

export default WordsDB;
