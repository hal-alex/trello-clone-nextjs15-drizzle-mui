"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material"
import { createTask } from "@/lib/actions"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material"

interface CreateTaskDialogProps {
  boardId: number
  columnId: number
}

export function CreateTaskDialog({ boardId, columnId }: CreateTaskDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [label, setLabel] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      await createTask({
        title,
        description,
        label: label || null,
        column_id: columnId,
        board_id: boardId,
        position: 0,
      })

      // Force a refresh of the page data
      router.refresh()

      setOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to create task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setLabel("")
    setIsExpanded(false)
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={() => setOpen(true)}
        aria-label="Add task"
      >
        <AddIcon fontSize="small" />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
          resetForm()
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New Task</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Add a new task to this column.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description (optional)"
              fullWidth
              multiline
              rows={isExpanded ? 10 : 3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse" : "Expand"}
              sx={{ display: "block", margin: "0 auto" }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <FormControl fullWidth margin="dense">
              <InputLabel id="label-select-label">Label (optional)</InputLabel>
              <Select
                labelId="label-select-label"
                value={label}
                label="Label (optional)"
                onChange={(e) => setLabel(e.target.value)}
              >
                <MenuItem value="">No label</MenuItem>
                <MenuItem value="Bug">Bug</MenuItem>
                <MenuItem value="Feature">Feature</MenuItem>
                <MenuItem value="Enhancement">Enhancement</MenuItem>
                <MenuItem value="Documentation">Documentation</MenuItem>
                <MenuItem value="High Priority">High Priority</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!title.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
