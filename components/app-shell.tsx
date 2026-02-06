"use client"

import { ReactNode } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AppShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      {/* Topbar */}
      <header className="h-14 border-b bg-background flex items-center px-6 justify-between">
        <div className="font-semibold tracking-tight">
          KOL Portal
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-8 w-8">
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem
  className="text-red-600"
  onSelect={async (e) => {
    e.preventDefault()
    await fetch("/api/logout", { method: "POST" })
    window.location.href = "/login"
  }}
>
  Logout
</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Page content */}
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
