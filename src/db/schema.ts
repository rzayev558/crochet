import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * A crochet/knitting project — the thing you're making. Owns many counters and
 * carries notes + a photo of your work-in-progress.
 */
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  notes: text("notes").notNull().default(""),
  photoUri: text("photo_uri"),
  // "active" | "finished" — kept as text so we can add states later.
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

/**
 * A row/stitch counter. Always belongs to a project; deleting the project
 * cascades to its counters.
 */
export const counters = sqliteTable("counters", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  count: integer("count").notNull().default(0),
  step: integer("step").notNull().default(1),
  target: integer("target"), // null = no goal
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

/**
 * Yarn stash — a standalone inventory of what you own.
 */
export const yarns = sqliteTable("yarns", {
  id: text("id").primaryKey(),
  brand: text("brand").notNull().default(""),
  colorway: text("colorway").notNull(),
  // lace | fingering | sport | dk | worsted | aran | bulky | super_bulky
  weight: text("weight"),
  fiber: text("fiber").notNull().default(""),
  skeins: integer("skeins").notNull().default(1),
  yardsPerSkein: integer("yards_per_skein"),
  colorHex: text("color_hex"), // optional swatch color
  photoUri: text("photo_uri"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

/**
 * Pattern library — saved PDFs or photos of patterns, with a source link.
 */
export const patterns = sqliteTable("patterns", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  craft: text("craft").notNull().default("crochet"), // crochet | knit
  notes: text("notes").notNull().default(""),
  fileUri: text("file_uri"), // imported PDF/image
  fileName: text("file_name"),
  sourceUrl: text("source_url"),
  photoUri: text("photo_uri"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  counters: many(counters),
}));

export const countersRelations = relations(counters, ({ one }) => ({
  project: one(projects, {
    fields: [counters.projectId],
    references: [projects.id],
  }),
}));

export type Project = typeof projects.$inferSelect;
export type Counter = typeof counters.$inferSelect;
export type Yarn = typeof yarns.$inferSelect;
export type Pattern = typeof patterns.$inferSelect;
