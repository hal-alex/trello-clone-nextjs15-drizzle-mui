import "./globals.css"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { ThemeProvider } from "@mui/material/styles"
import theme from "./theme"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <body>{children}</body>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  )
}
