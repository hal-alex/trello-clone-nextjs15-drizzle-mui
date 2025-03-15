"use client"

import type React from "react"

import { useState } from "react"
import { useDrop } from "react-dnd"
import {
  MoreHoriz as MoreHorizIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material"
import type { Column, Task } from "@/lib/types"
import {
  deleteColumn,
  updateColumnTitle,
  updateTaskColumn,
} from "@/lib/actions"
import {
  Paper,
  Typography,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from "@mui/material"
import { TaskCard } from "@/components/task-card"
import { CreateTaskDialog } from "@/components/create-task-dialog"

interface ColumnProps {
  column: Column
  tasks: Task[]
  boardId: number
  onTaskMove: (
    taskId: number,
    sourceColumnId: number,
    targetColumnId: number,
  ) => void
}

export function ColumnComponent({
  column,
  tasks,
  boardId,
  onTaskMove,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: number; columnId: number }) => {
      // Update the local state immediately for a responsive UI
      onTaskMove(item.id, item.columnId, column.id)

      // Then update the database
      updateTaskColumn(item.id, column.id)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleTitleChange = async () => {
    if (title !== column.title) {
      await updateColumnTitle(column.id, title)
    }
    setIsEditing(false)
  }

  const handleDeleteColumn = async () => {
    await deleteColumn(column.id)
  }

  return (
    <Paper
      ref={drop}
      sx={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        bgcolor: isOver ? "#E3E5E8" : "#EBECF0",
        boxShadow: isOver ? 2 : 1,
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        {isEditing ? (
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.875rem",
              bgcolor: "white",
              "& .MuiOutlinedInput-root": {
                height: 32,
              },
            }}
            autoFocus
            onBlur={handleTitleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTitleChange()
              } else if (e.key === "Escape") {
                setTitle(column.title)
                setIsEditing(false)
              }
            }}
          />
        ) : (
          <Typography
            variant="subtitle2"
            sx={{
              px: 1,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => setIsEditing(true)}
          >
            {column.title} ({tasks.length})
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CreateTaskDialog boardId={boardId} columnId={column.id} />

          <IconButton
            size="small"
            onClick={handleMenuClick}
            aria-label="Column actions"
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                setIsEditing(true)
                handleMenuClose()
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Rename Column</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsDeleteDialogOpen(true)
                handleMenuClose()
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText sx={{ color: "error.main" }}>
                Delete Column
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1,
          overflowY: "auto",
          maxHeight: "calc(100vh - 180px)",
        }}
      >
        {tasks.map((task, index) => (
          <Box
            key={task.id}
            sx={{
              animation: "fadeIn 0.3s ease-out",
              animationDelay: `${index * 30}ms`,
              "@keyframes fadeIn": {
                "0%": { opacity: 0 },
                "100%": { opacity: 1 },
              },
            }}
          >
            <TaskCard task={task} />
          </Box>
        ))}

        {tasks.length === 0 && (
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              py: 2,
              color: "text.disabled",
              fontStyle: "italic",
            }}
          >
            No tasks yet
          </Typography>
        )}
      </Box>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete the column and all of its tasks. This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteColumn}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
