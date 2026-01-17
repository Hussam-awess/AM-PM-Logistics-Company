"use client"

// NOTE: Customer portal temporarily disabled - all original code below is commented out for later editing
/*
import React, { useState, useEffect } from "react"
import CustomerSidebar from "@/components/customer-sidebar"
import { Bell } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

// PROBLEM: These props won't be provided by Next.js layout
interface Props {
  children: React.ReactNode
  userId: string
  fullName: string
}

export default function CustomerLayoutClient({ children, userId, fullName }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const supabase = createBrowserClient()

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("transport_requests")
      .select("*")
      .eq("requester_email", userId)
      .order("created_at", { ascending: false })
      .limit(5)
    setNotifications(data || [])
  }

  useEffect(() => {
    fetchNotifications()
    const channel = supabase
      .channel("customer-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transport_requests", filter: `requester_email=eq.${userId}` },
        () => fetchNotifications()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // PROBLEM: Empty dependency array but references userId - could cause stale closures
  }, [])

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */
//       {sidebarOpen && <CustomerSidebar />}

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
//         {/* Header */}
//         <header className="flex justify-between items-center bg-white p-4 shadow flex-shrink-0">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 bg-gray-200 rounded hover:bg-gray-300"
//             >
//               {sidebarOpen ? "×" : "☰"}
//             </button>
//             <h1 className="text-xl font-bold">Welcome, {fullName}</h1>
//           </div>

//           {/* Notification Bell */}
//           <div className="relative">
//             <Bell
//               className="h-6 w-6 cursor-pointer text-gray-600"
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//             />
//             {notifications.length > 0 && (
//               <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
//                 {notifications.length}
//               </span>
//             )}

//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
//                 <div className="p-2 text-sm font-medium border-b">Recent Requests</div>
//                 <div className="max-h-64 overflow-y-auto">
//                   {notifications.length === 0 && (
//                     <div className="p-4 text-gray-500 text-center">No recent requests</div>
//                   )}
//                   {notifications.map((n) => (
//                     <div key={n.id} className="p-2 border-b hover:bg-gray-100">
//                       <p className="font-medium text-gray-800">{n.cargo_type}</p>
//                       <p className="text-xs text-gray-500">
//                         {n.pickup_location} → {n.delivery_location}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         {new Date(n.created_at).toLocaleDateString()}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Scrollable Page Content */}
//         <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }
// */

// Temporary placeholder while customer portal is disabled
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
