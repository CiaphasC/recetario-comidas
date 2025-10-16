import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Recetario de Cocina",
  description: "Gestión moderna de recetas e ingredientes",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <div className="flex min-h-screen">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <MobileNav />
          <main className="flex-1 overflow-auto pt-20 md:pt-0 pr-20 md:pr-0">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
