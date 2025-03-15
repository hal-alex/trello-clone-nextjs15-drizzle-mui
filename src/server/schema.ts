import { pgTable, uuid } from "drizzle-orm/pg-core"

export const example = pgTable("example", {
  id: uuid("id").defaultRandom().primaryKey(),
})
