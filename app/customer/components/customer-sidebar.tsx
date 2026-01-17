"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function CustomerSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Sidebar */}
      {isOpen && (
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col p-4 transition-transform duration-300">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="self-end text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>

          {/* Sidebar Content */}
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-4">Customer Portal</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="hover:text-blue-600 cursor-pointer">Dashboard</li>
              <li className="hover:text-blue-600 cursor-pointer">Requests</li>
              <li className="hover:text-blue-600 cursor-pointer">Profile</li>
              {/* Add more links as needed */}
            </ul>
          </div>
        </div>
      )}

      {/* Open Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded z-50 shadow-lg hover:bg-blue-700 transition-colors"
        >
          Open Sidebar
        </button>
      )}
    </>
  )
}
