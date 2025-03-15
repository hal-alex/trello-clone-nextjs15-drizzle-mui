"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateTask } from "@/lib/actions"
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
} from "@mui/material"
import { TaskType } from "@/lib/schema"

interface EditTaskDialogProps {
  task: TaskType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [label, setLabel] = useState(task.label || "")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(task.title)
      setDescription(task.description || "")
      setLabel(task.label || "")
    }
  }, [open, task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      await updateTask({
        id: task.id,
        title,
        description: description || null,
        label: label || null,
      })

      // Force a refresh of the page data
      router.refresh()

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>Make changes to this task.</DialogContentText>
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
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-label-select-label">
              Label (optional)
            </InputLabel>
            <Select
              labelId="edit-label-select-label"
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
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!title.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
