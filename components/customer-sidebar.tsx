"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, MessageSquare, FileText, LogOut, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CustomerSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  const navItems = [
    { href: "/customer", label: "Dashboard", icon: Package },
    { href: "/customer/requests", label: "My Requests", icon: FileText },
    { href: "/customer/tracking", label: "Track Shipment", icon: Truck },
    { href: "/customer/messages", label: "Messages", icon: MessageSquare },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <h1 className="text-lg font-bold text-slate-900">AM-PM</h1>
        <span className="ml-2 text-xs text-slate-500">Customer Portal</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href ? "bg-primary text-primary-foreground" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
