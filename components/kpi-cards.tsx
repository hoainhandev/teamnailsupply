"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, DollarSign, Clock, BadgeCheck } from "lucide-react"

type Summary = { orders: number; total: number; pending: number; paid: number }

export function KpiCards() {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const res = await fetch("/api/dashboard/summary", { cache: "no-store" })
      const j = await res.json().catch(() => null)
      setData(j)
      setLoading(false)
    }
    run()
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi
        title="Orders"
        value={loading ? "..." : (data?.orders ?? 0)}
        hint="Last 30 days"
        icon={<ShoppingBag className="h-4 w-4" />}
        accent="blue"
      />
      <Kpi
        title="Total"
        value={loading ? "..." : `$${(data?.total ?? 0).toFixed(2)}`}
        hint="All statuses"
        icon={<DollarSign className="h-4 w-4" />}
        accent="violet"
      />
      <Kpi
        title="Pending"
        value={loading ? "..." : `$${(data?.pending ?? 0).toFixed(2)}`}
        hint="Awaiting approval"
        icon={<Clock className="h-4 w-4" />}
        badge="pending"
        accent="amber"
      />
      <Kpi
        title="Paid"
        value={loading ? "..." : `$${(data?.paid ?? 0).toFixed(2)}`}
        hint="Completed payouts"
        icon={<BadgeCheck className="h-4 w-4" />}
        badge="paid"
        accent="emerald"
      />
    </div>
  )
}

function Kpi({
  title,
  value,
  hint,
  badge,
  icon,
  accent,
}: {
  title: string
  value: string | number
  hint: string
  badge?: "pending" | "approved" | "paid"
  icon: React.ReactNode
  accent: "blue" | "violet" | "amber" | "emerald"
}) {
  const accentMap = {
    blue: "bg-blue-500/10 text-blue-600",
    violet: "bg-violet-500/10 text-violet-600",
    amber: "bg-amber-500/10 text-amber-700",
    emerald: "bg-emerald-500/10 text-emerald-700",
  } as const

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {badge ? <StatusBadge status={badge} /> : null}
            <div className={`grid h-8 w-8 place-items-center rounded-lg ${accentMap[accent]}`}>
              {icon}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: "pending" | "approved" | "paid" }) {
  if (status === "pending") return <Badge variant="secondary">pending</Badge>
  if (status === "approved") return <Badge>approved</Badge>
  return <Badge variant="outline">paid</Badge>
}
