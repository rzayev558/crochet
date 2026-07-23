import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// enableChangeListener powers drizzle's useLiveQuery reactivity.
export const expoDb = openDatabaseSync("loop.db", {
  enableChangeListener: true,
});

// SQLite disables FK enforcement by default; turn it on so cascades work.
expoDb.execSync("PRAGMA foreign_keys = ON;");

export const db = drizzle(expoDb, { schema });

// Locally-unique id. Random suffix avoids collisions within the same ms.
export const makeId = () =>
  `${Date.now().toString(36)}${Math.round(Math.random() * 1e9).toString(36)}`;
