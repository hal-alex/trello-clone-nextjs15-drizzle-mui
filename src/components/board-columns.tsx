"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Add as AddIcon } from "@mui/icons-material"
import type { Column, Task } from "@/lib/types"
import { createColumn } from "@/lib/actions"
import { Button, TextField, Box, Paper } from "@mui/material"
import { ColumnComponent } from "@/components/column"

interface BoardColumnsProps {
  boardId: number
  columns: Column[]
  tasksByColumn: Record<number, Task[]>
}

export function BoardColumns({
  boardId,
  columns,
  tasksByColumn,
}: BoardColumnsProps) {
  const router = useRouter()
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [localTasksByColumn, setLocalTasksByColumn] = useState(tasksByColumn)

  // Update local state when props change (e.g., after a task is created)
  useEffect(() => {
    setLocalTasksByColumn(tasksByColumn)
  }, [tasksByColumn])

  const handleAddColumn = async () => {
    if (newColumnTitle.trim()) {
      await createColumn(boardId, newColumnTitle)
      setNewColumnTitle("")
      setIsAddingColumn(false)
      router.refresh() // Force a refresh to show the new column
    }
  }

  // Function to handle task movement between columns
  const handleTaskMove = (
    taskId: number,
    sourceColumnId: number,
    targetColumnId: number,
  ) => {
    // Create a deep copy of the current state
    const updatedTasksByColumn = { ...localTasksByColumn }

    // Find the task in the source column
    const sourceColumn = updatedTasksByColumn[sourceColumnId] || []
    const taskIndex = sourceColumn.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) return

    // Remove the task from the source column
    const [task] = sourceColumn.splice(taskIndex, 1)

    // Update the task's column_id
    const updatedTask = { ...task, column_id: targetColumnId }

    // Add the task to the target column
    if (!updatedTasksByColumn[targetColumnId]) {
      updatedTasksByColumn[targetColumnId] = []
    }
    updatedTasksByColumn[targetColumnId].push(updatedTask)

    // Update the state
    setLocalTasksByColumn(updatedTasksByColumn)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 2,
          alignItems: "flex-start",
        }}
      >
        {columns.map((column, index) => (
          <Box
            key={column.id}
            sx={{
              animation: "fadeInLeft 0.3s ease-out",
              animationDelay: `${index * 50}ms`,
              "@keyframes fadeInLeft": {
                "0%": { opacity: 0, transform: "translateX(-10px)" },
                "100%": { opacity: 1, transform: "translateX(0)" },
              },
            }}
          >
            <ColumnComponent
              column={column}
              tasks={localTasksByColumn[column.id] || []}
              boardId={boardId}
              onTaskMove={handleTaskMove}
            />
          </Box>
        ))}

        {isAddingColumn ? (
          <Paper
            sx={{
              width: 280,
              flexShrink: 0,
              p: 2,
              bgcolor: "rgba(235, 236, 240, 0.9)",
              boxShadow: 1,
              borderRadius: 1,
              animation: "fadeInRight 0.3s ease-out",
              "@keyframes fadeInRight": {
                "0%": { opacity: 0, transform: "translateX(10px)" },
                "100%": { opacity: 1, transform: "translateX(0)" },
              },
            }}
          >
            <TextField
              placeholder="Enter column title..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              sx={{ mb: 1, bgcolor: "white", borderRadius: 1 }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddColumn()
                } else if (e.key === "Escape") {
                  setIsAddingColumn(false)
                  setNewColumnTitle("")
                }
              }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddColumn}
              >
                Add Column
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setIsAddingColumn(false)
                  setNewColumnTitle("")
                }}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        ) : (
          <Button
            variant="outlined"
            sx={{
              height: 40,
              width: 280,
              flexShrink: 0,
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              animation: "fadeInRight 0.3s ease-out",
              "@keyframes fadeInRight": {
                "0%": { opacity: 0, transform: "translateX(10px)" },
                "100%": { opacity: 1, transform: "translateX(0)" },
              },
            }}
            onClick={() => setIsAddingColumn(true)}
            startIcon={<AddIcon />}
          >
            Add Column
          </Button>
        )}
      </Box>
    </DndProvider>
  )
}
