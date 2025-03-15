import React from "react"
import {
  Button,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
} from "@mui/material"

export default function Home() {
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Trello Clone</Typography>
        </Toolbar>
      </AppBar>
      <Paper style={{ padding: 16, marginTop: 16 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to Trello Clone
        </Typography>
        <TextField
          label="Enter your task"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary">
          Add Task
        </Button>
      </Paper>
    </Container>
  )
}
