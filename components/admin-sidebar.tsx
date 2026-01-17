"use client"
import React from "react"
import Link from "next/link"

interface Props {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: Props) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 transform transition-transform duration-300 z-50 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Admin Menu</h2>
        <button
          className="text-white text-2xl font-bold"
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          ×
        </button>
      </div>
      <nav className="flex flex-col space-y-2 p-4">
        <Link href="/admin" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/requests" className="hover:underline">
          Requests
        </Link>
        <Link href="/admin/settings" className="hover:underline">
          Settings
        </Link>
      </nav>
    </aside>
  )
}
