import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,    
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","600","700"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "AM-PM Company Ltd - Logistics & Transportation Solutions",
  description:
    "Professional container transportation and cargo logistics services across Tanzania and Congo. Founded in 2013, delivering reliable freight solutions.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/placeholder-logo.png", type: "image/png" },
    ],
    shortcut: "/placeholder-logo.png",
    apple: "/apple-logo.png",
    other: [
      { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/placeholder-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className}`}>
  {children}
</body>
      <Analytics />
    </html>
  )
}
