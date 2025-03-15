import { db } from "./db"
import { boards, columns, tasks } from "./schema"
import { eq } from "drizzle-orm"

export async function createBoardInDb(title: string) {
  return await db.insert(boards).values({ title }).returning()
}

export async function updateBoardTitleInDb(id: number, title: string) {
  return await db
    .update(boards)
    .set({ title })
    .where(eq(boards.id, id))
    .returning()
}

export async function deleteBoardFromDb(id: number) {
  return await db.delete(boards).where(eq(boards.id, id)).returning()
}

export async function createColumnInDb(
  title: string,
  board_id: number,
  position: number,
) {
  return await db
    .insert(columns)
    .values({ title, board_id, position })
    .returning()
}

export async function updateColumnTitleInDb(id: number, title: string) {
  return await db
    .update(columns)
    .set({ title })
    .where(eq(columns.id, id))
    .returning()
}

export async function deleteColumnFromDb(id: number) {
  return await db.delete(columns).where(eq(columns.id, id)).returning()
}

export async function createTaskInDb(
  title: string,
  description: string | null,
  label: string | null,
  column_id: number,
  board_id: number,
  position: number,
) {
  return await db
    .insert(tasks)
    .values({ title, description, label, column_id, board_id, position })
    .returning()
}

export async function updateTaskInDb(
  id: number,
  title: string,
  description: string | null,
  label: string | null,
) {
  return await db
    .update(tasks)
    .set({ title, description, label })
    .where(eq(tasks.id, id))
    .returning()
}

export async function updateTaskColumnInDb(
  id: number,
  column_id: number,
  position: number,
) {
  return await db
    .update(tasks)
    .set({ column_id, position })
    .where(eq(tasks.id, id))
    .returning()
}

export async function deleteTaskFromDb(id: number) {
  return await db.delete(tasks).where(eq(tasks.id, id)).returning()
}

export async function getBoardById(id: number) {
  return await db.select().from(boards).where(eq(boards.id, id))
}

export async function getColumnsForBoard(boardId: number) {
  return await db.select().from(columns).where(eq(columns.board_id, boardId))
}

export async function getTasksForBoard(boardId: number) {
  return await db.select().from(tasks).where(eq(tasks.board_id, boardId))
}

export async function getAllBoards() {
  return await db.select().from(boards)
}
