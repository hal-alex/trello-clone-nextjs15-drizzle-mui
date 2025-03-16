"use client"

import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outlined"
      color="inherit"
      size="small"
    >
      Logout
    </Button>
  )
}
