"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Add as AddIcon } from "@mui/icons-material"
import { createBoard } from "@/lib/actions"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material"

interface CreateBoardDialogProps {
  trigger?: React.ReactNode
}

export function CreateBoardDialog({ trigger }: CreateBoardDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      const boardId = await createBoard(title)
      setOpen(false)
      router.push(`/board/${boardId}`)
    } catch (error) {
      console.error("Failed to create board:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {trigger ? (
        <Box onClick={() => setOpen(true)} sx={{ cursor: "pointer" }}>
          {trigger}
        </Box>
      ) : (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Board
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Board</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Give your board a name to get started.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Board title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!title.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create Board"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
