"use client"

import type React from "react"
import { useState, useRef, forwardRef } from "react"
import { useRouter } from "next/navigation"
import { useDrag } from "react-dnd"
import {
  MoreHoriz as MoreHorizIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
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
import { TaskType } from "@/lib/schema"

interface TaskCardProps {
  task: TaskType
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task }, ref) => {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const isDraggingRef = useRef(false)
    const mouseDownPosRef = useRef({ x: 0, y: 0 })

    const [{ isDragging }, drag] = useDrag({
      type: "TASK",
      item: () => {
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
      router.refresh()
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleClick = (e: React.MouseEvent) => {
      const dx = Math.abs(e.clientX - mouseDownPosRef.current.x)
      const dy = Math.abs(e.clientY - mouseDownPosRef.current.y)
      const movedDistance = Math.sqrt(dx * dx + dy * dy)

      if (!isDraggingRef.current && movedDistance < 5) {
        setIsEditDialogOpen(true)
      }
    }

    return (
      <>
        <Card
          ref={(node) => {
            drag(node)
            if (typeof ref === "function") {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
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

            {task.label &&
              task.label !== "no-label" &&
              task.label !== "none" && (
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
            <ListItemText sx={{ color: "error.main" }}>
              Delete Task
            </ListItemText>
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
            <Button
              onClick={handleDeleteTask}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  },
)

// Add display name to fix the react/display-name error
TaskCard.displayName = "TaskCard"
