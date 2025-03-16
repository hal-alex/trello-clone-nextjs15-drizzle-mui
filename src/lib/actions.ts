"use server"

import { revalidatePath } from "next/cache"
import {
  createBoardInDb,
  updateBoardTitleInDb,
  deleteBoardFromDb,
  createColumnInDb,
  updateColumnTitleInDb,
  deleteColumnFromDb,
  createTaskInDb,
  updateTaskInDb,
  updateTaskColumnInDb,
  deleteTaskFromDb,
} from "./dbActions"
import { TaskType } from "./schema"

// Board actions
export async function createBoard(title: string) {
  const boardId = await createBoardInDb(title)
  revalidatePath("/")
  return boardId
}

export async function updateBoardTitle(id: number, title: string) {
  await updateBoardTitleInDb(id, title)
  revalidatePath(`/board/${id}`)
}

export async function deleteBoard(id: number) {
  await deleteBoardFromDb(id)
  revalidatePath("/")
}

export async function createColumn(boardId: number, title: string) {
 await createColumnInDb(title, boardId, 0)
  revalidatePath(`/board/${boardId}`)
}

export async function updateColumnTitle(
  id: number,
  title: string,
): Promise<void> {
  await updateColumnTitleInDb(id, title)
  revalidatePath("/board/[id]", "page")
}

export async function deleteColumn(id: number): Promise<void> {
  await deleteColumnFromDb(id)
  revalidatePath("/board/[id]", "page")
}

export async function createTask(
  task: Omit<TaskType, "id" | "created_at">,
) {
  await createTaskInDb(
    task.title,
    task.description,
    task.label,
    task.column_id,
    task.board_id,
    task.position,
  )
  revalidatePath(`/board/${task.board_id}`)
}

export async function updateTask(
  task: Pick<TaskType, "id" | "title" | "description" | "label">,
) {
  await updateTaskInDb(task.id, task.title, task.description, task.label)
  revalidatePath("/board/[id]", "page")
}

export async function updateTaskColumn(
  taskId: number,
  columnId: number,
  position: number,
) {
  await updateTaskColumnInDb(taskId, columnId, position)
  revalidatePath("/board/[id]", "page")
}

export async function deleteTask(id: number) {
  await deleteTaskFromDb(id)
  revalidatePath("/board/[id]", "page")
}
