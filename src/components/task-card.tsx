"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDrag } from "react-dnd"
import {
  MoreHoriz as MoreHorizIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import type { Task } from "@/lib/types"
import { deleteTask } from "@/lib/actions"
import {
  Card,
  CardContent,
  Typography,
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
  Chip,
} from "@mui/material"
import { EditTaskDialog } from "@/components/edit-task-dialog"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // Track if we're dragging to distinguish between click and drag
  const isDraggingRef = useRef(false)
  const mouseDownPosRef = useRef({ x: 0, y: 0 })

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: (monitor) => {
      // Set dragging flag when drag starts
      isDraggingRef.current = true
      return {
        id: task.id,
        columnId: task.column_id,
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => {
      // Reset dragging flag when drag ends
      setTimeout(() => {
        isDraggingRef.current = false
      }, 100)
    },
  })

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteTask = async () => {
    await deleteTask(task.id)
    router.refresh() // Force a refresh after deletion
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Store the position where mouse down occurred
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: React.MouseEvent) => {
    // Calculate distance moved since mousedown
    const dx = Math.abs(e.clientX - mouseDownPosRef.current.x)
    const dy = Math.abs(e.clientY - mouseDownPosRef.current.y)
    const movedDistance = Math.sqrt(dx * dx + dy * dy)

    // If we didn't drag and just clicked (moved less than 5px), open the edit dialog
    if (!isDraggingRef.current && movedDistance < 5) {
      setIsEditDialogOpen(true)
    }
  }

  return (
    <>
      <Card
        ref={drag}
        sx={{
          bgcolor: "white",
          boxShadow: 1,
          borderRadius: 1,
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          "&:hover": {
            boxShadow: 2,
            transform: "translateY(-2px)",
          },
          transition: "all 0.2s ease",
          ...(isDragging && {
            opacity: 0.5,
            transform: "rotate(2deg) scale(1.05)",
          }),
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Typography variant="body2">{task.title}</Typography>
            <IconButton
              size="small"
              sx={{
                mt: -0.5,
                mr: -0.5,
                opacity: 0,
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                ".MuiCard-root:hover &": { opacity: 1 },
              }}
              onClick={handleMenuClick}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>

          {task.description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              {task.description}
            </Typography>
          )}

          {task.label && task.label !== "no-label" && task.label !== "none" && (
            <Chip
              label={task.label}
              size="small"
              variant="outlined"
              sx={{ mt: 1, fontSize: "0.7rem", height: 20 }}
            />
          )}
        </CardContent>
      </Card>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setIsEditDialogOpen(true)
            handleMenuClose()
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
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
          <ListItemText sx={{ color: "error.main" }}>Delete Task</ListItemText>
        </MenuItem>
      </Menu>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete this task. This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
