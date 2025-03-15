import Link from "next/link"
import { Add as AddIcon } from "@mui/icons-material"
import {
  Typography,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
} from "@mui/material"
import { CreateBoardDialog } from "@/components/create-board-dialog"
import { getAllBoards } from "@/lib/dbActions"

export default async function HomePage() {
  const boards = await getAllBoards()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2B79B9 0%, #1A5889 100%)",
        p: 3,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            animation: "fadeInTop 0.5s ease-out",
            "@keyframes fadeInTop": {
              "0%": { opacity: 0, transform: "translateY(-10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            My Boards
          </Typography>
          <CreateBoardDialog />
        </Box>

        <Grid container spacing={2}>
          {boards.map((board, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={board.id}>
              <Link
                href={`/board/${board.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      transform: "translateY(-4px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                    animation: "fadeIn 0.3s ease-out",
                    animationDelay: `${index * 50}ms`,
                    "@keyframes fadeIn": {
                      "0%": { opacity: 0 },
                      "100%": { opacity: 1 },
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: "bold" }}
                    >
                      {board.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}
                    >
                      {new Date(board.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CreateBoardDialog
              trigger={
                <Card
                  sx={{
                    height: "100%",
                    minHeight: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    border: "1px dashed rgba(255, 255, 255, 0.2)",
                    color: "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    cursor: "pointer",
                    animation: "fadeIn 0.3s ease-out",
                    animationDelay: `${boards.length * 50}ms`,
                    "@keyframes fadeIn": {
                      "0%": { opacity: 0 },
                      "100%": { opacity: 1 },
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <AddIcon sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Create new board
                    </Typography>
                  </CardContent>
                </Card>
              }
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
