"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material"
import type { Board } from "@/lib/types"
import { deleteBoard, updateBoardTitle } from "@/lib/actions"
import {
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

interface BoardHeaderProps {
  board: Board
}

export function BoardHeader({ board }: BoardHeaderProps) {
  const router = useRouter()
  const [title, setTitle] = useState(board.title)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleTitleChange = async () => {
    if (title !== board.title) {
      await updateBoardTitle(board.id, title)
    }
    setIsEditing(false)
  }

  const handleDeleteBoard = async () => {
    await deleteBoard(board.id)
    router.push("/")
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        animation: "fadeIn 0.5s ease-in-out",
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {isEditing ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              maxWidth: 400,
              input: { color: "white", fontWeight: "bold", fontSize: "1.5rem" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
            }}
            autoFocus
            onBlur={handleTitleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTitleChange()
              } else if (e.key === "Escape") {
                setTitle(board.title)
                setIsEditing(false)
              }
            }}
          />
        </Box>
      ) : (
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => setIsEditing(true)}
        >
          {board.title}
        </Typography>
      )}

      <div>
        <IconButton
          onClick={handleMenuClick}
          sx={{ color: "white" }}
          aria-label="board actions"
        >
          <MoreVertIcon />
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
            <ListItemText>Rename Board</ListItemText>
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
              Delete Board
            </ListItemText>
          </MenuItem>
        </Menu>
      </div>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete the board and all of its tasks. This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteBoard} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
