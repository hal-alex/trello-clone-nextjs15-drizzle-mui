import { notFound } from "next/navigation"
import {
  getBoardById,
  getColumnsForBoard,
  getTasksForBoard,
} from "@/lib/dbActions"
import { BoardHeader } from "@/components/board-header"
import { BoardColumns } from "@/components/board-columns"
import { Box, Container } from "@mui/material"

type BoardPageProps = {
  params: Promise<{ id: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const paramsFrom = await params
  const boardId = Number.parseInt(paramsFrom.id)

  if (isNaN(boardId)) {
    return notFound()
  }

  const board = (await getBoardById(boardId))[0]

  if (!board) {
    return notFound()
  }

  const columns = await getColumnsForBoard(boardId)
  const tasks = await getTasksForBoard(boardId)

  // Group tasks by column
  const tasksByColumn = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.column_id === column.id)
    return acc
  }, {} as Record<number, typeof tasks>)

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2B79B9 0%, #1A5889 100%)",
        p: 3,
      }}
    >
      <Container maxWidth="xl">
        <BoardHeader board={board} />
        <BoardColumns
          boardId={boardId}
          columns={columns}
          tasksByColumn={tasksByColumn}
        />
      </Container>
    </Box>
  )
}
