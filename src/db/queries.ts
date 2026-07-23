import AsyncStorage from "@react-native-async-storage/async-storage";
import { desc, eq } from "drizzle-orm";
import { db, makeId } from "./client";
import { counters, patterns, projects, yarns } from "./schema";

const now = () => Date.now();

/* ------------------------------- Projects ------------------------------- */

export function createProject(name: string) {
  const id = makeId();
  const t = now();
  db.insert(projects)
    .values({
      id,
      name: name.trim() || "New project",
      notes: "",
      status: "active",
      createdAt: t,
      updatedAt: t,
    })
    .run();
  return id;
}

export function updateProject(
  id: string,
  patch: Partial<{ name: string; notes: string; photoUri: string | null; status: string }>
) {
  db.update(projects)
    .set({ ...patch, updatedAt: now() })
    .where(eq(projects.id, id))
    .run();
}

export function deleteProject(id: string) {
  db.delete(projects).where(eq(projects.id, id)).run(); // cascades to counters
}

export const projectsQuery = db
  .select()
  .from(projects)
  .orderBy(desc(projects.updatedAt));

export const projectByIdQuery = (id: string) =>
  db.select().from(projects).where(eq(projects.id, id));

/* ------------------------------- Counters ------------------------------- */

export function createCounter(projectId: string, name: string) {
  const id = makeId();
  const t = now();
  db.insert(counters)
    .values({
      id,
      projectId,
      name: name.trim() || "Counter",
      count: 0,
      step: 1,
      target: null,
      createdAt: t,
      updatedAt: t,
    })
    .run();
  return id;
}

export function setCount(id: string, count: number) {
  db.update(counters)
    .set({ count: Math.max(0, count), updatedAt: now() })
    .where(eq(counters.id, id))
    .run();
}

export function updateCounter(
  id: string,
  patch: Partial<{ name: string; step: number; target: number | null; count: number }>
) {
  db.update(counters)
    .set({ ...patch, updatedAt: now() })
    .where(eq(counters.id, id))
    .run();
}

export function deleteCounter(id: string) {
  db.delete(counters).where(eq(counters.id, id)).run();
}

export const countersForProjectQuery = (projectId: string) =>
  db
    .select()
    .from(counters)
    .where(eq(counters.projectId, projectId))
    .orderBy(desc(counters.createdAt));

export const counterByIdQuery = (id: string) =>
  db.select().from(counters).where(eq(counters.id, id));

/* --------------------------------- Yarn --------------------------------- */

export function createYarn(v: {
  brand?: string;
  colorway: string;
  weight?: string | null;
  fiber?: string;
  skeins?: number;
  yardsPerSkein?: number | null;
  colorHex?: string | null;
  photoUri?: string | null;
  notes?: string;
}) {
  const id = makeId();
  const t = now();
  db.insert(yarns)
    .values({
      id,
      brand: v.brand ?? "",
      colorway: v.colorway.trim() || "Untitled yarn",
      weight: v.weight ?? null,
      fiber: v.fiber ?? "",
      skeins: v.skeins ?? 1,
      yardsPerSkein: v.yardsPerSkein ?? null,
      colorHex: v.colorHex ?? null,
      photoUri: v.photoUri ?? null,
      notes: v.notes ?? "",
      createdAt: t,
      updatedAt: t,
    })
    .run();
  return id;
}

export function updateYarn(
  id: string,
  patch: Partial<{
    brand: string;
    colorway: string;
    weight: string | null;
    fiber: string;
    skeins: number;
    yardsPerSkein: number | null;
    colorHex: string | null;
    photoUri: string | null;
    notes: string;
  }>
) {
  db.update(yarns)
    .set({ ...patch, updatedAt: now() })
    .where(eq(yarns.id, id))
    .run();
}

export function deleteYarn(id: string) {
  db.delete(yarns).where(eq(yarns.id, id)).run();
}

export const yarnsQuery = db.select().from(yarns).orderBy(desc(yarns.updatedAt));
export const yarnByIdQuery = (id: string) =>
  db.select().from(yarns).where(eq(yarns.id, id));

/* ------------------------------- Patterns ------------------------------- */

export function createPattern(v: {
  title: string;
  craft?: string;
  notes?: string;
  fileUri?: string | null;
  fileName?: string | null;
  sourceUrl?: string | null;
  photoUri?: string | null;
}) {
  const id = makeId();
  const t = now();
  db.insert(patterns)
    .values({
      id,
      title: v.title.trim() || "Untitled pattern",
      craft: v.craft ?? "crochet",
      notes: v.notes ?? "",
      fileUri: v.fileUri ?? null,
      fileName: v.fileName ?? null,
      sourceUrl: v.sourceUrl ?? null,
      photoUri: v.photoUri ?? null,
      createdAt: t,
      updatedAt: t,
    })
    .run();
  return id;
}

export function updatePattern(
  id: string,
  patch: Partial<{
    title: string;
    craft: string;
    notes: string;
    fileUri: string | null;
    fileName: string | null;
    sourceUrl: string | null;
    photoUri: string | null;
  }>
) {
  db.update(patterns)
    .set({ ...patch, updatedAt: now() })
    .where(eq(patterns.id, id))
    .run();
}

export function deletePattern(id: string) {
  db.delete(patterns).where(eq(patterns.id, id)).run();
}

export const patternsQuery = db
  .select()
  .from(patterns)
  .orderBy(desc(patterns.updatedAt));
export const patternByIdQuery = (id: string) =>
  db.select().from(patterns).where(eq(patterns.id, id));

/* --------------------- One-time AsyncStorage migration ------------------- */

const LEGACY_KEY = "loop.counters.v1";
const MIGRATED_FLAG = "loop.migratedToSqlite.v1";

/**
 * Phase 1 stored a flat list of counters in AsyncStorage. Import them once
 * into a default project so nothing is lost on upgrade.
 */
export async function migrateLegacyCountersIfNeeded() {
  const done = await AsyncStorage.getItem(MIGRATED_FLAG);
  if (done) return;

  try {
    const raw = await AsyncStorage.getItem(LEGACY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const legacy: any[] = parsed?.state?.counters ?? parsed?.counters ?? [];

    if (legacy.length > 0) {
      const projectId = createProject("My Counters");
      const t = now();
      for (const c of legacy) {
        db.insert(counters)
          .values({
            id: c.id ?? makeId(),
            projectId,
            name: c.name ?? "Counter",
            count: c.count ?? 0,
            step: c.step ?? 1,
            target: c.target ?? null,
            createdAt: c.createdAt ?? t,
            updatedAt: c.updatedAt ?? t,
          })
          .run();
      }
    }
  } catch {
    // A malformed legacy blob shouldn't block startup — just skip it.
  } finally {
    await AsyncStorage.setItem(MIGRATED_FLAG, "1");
  }
}
