import { InferSelectModel } from "drizzle-orm"
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core"

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export const columns = pgTable("columns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  board_id: integer("board_id")
    .references(() => boards.id)
    .notNull(),
  position: integer("position").notNull(),
})

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  label: text("label"),
  column_id: integer("column_id")
    .references(() => columns.id)
    .notNull(),
  board_id: integer("board_id")
    .references(() => boards.id)
    .notNull(),
  position: integer("position").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export type TaskType = InferSelectModel<typeof tasks>
export type ColumnType = InferSelectModel<typeof columns>
export type BoardType = InferSelectModel<typeof boards>
