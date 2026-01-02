"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/placeholder-logo.png" alt="AM-PM" className="h-10 w-10 rounded-lg object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">AM-PM Company Ltd</span>
            <span className="text-xs text-muted-foreground">Since 2013</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors text-left">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/request" className="text-sm font-medium hover:text-primary transition-colors">
            Request Transport
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          <Button asChild size="sm" className="ml-2">
            <Link href="/auth/login">Login</Link>
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-2 p-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/request"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Request Transport
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Button asChild className="mt-2">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
