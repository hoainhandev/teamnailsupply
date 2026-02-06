"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

import { Clock, CheckCircle2, BadgeCheck } from "lucide-react"

const STATUS_STYLE = {
  pending: { label: "pending", badge: "bg-amber-50 text-amber-700 border-amber-200", Icon: Clock },
  approved: { label: "approved", badge: "bg-blue-50 text-blue-700 border-blue-200", Icon: CheckCircle2 },
  paid: { label: "paid", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: BadgeCheck },
} as const

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Status = "pending" | "approved" | "paid"
type Row = {
  shopify_order_id: string
  amount: number
  status: Status
  created_at: string
}

export function RecentCommissionsTable() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoading(true)

      // ✅ endpoint mới
      const res = await fetch("/api/dashboard/commissions", { cache: "no-store" })
      const j = await res.json().catch(() => [])

      // ✅ nếu API trả array:
      setRows(Array.isArray(j) ? j : (j.items ?? []))

      setLoading(false)
    }
    run()
  }, [])

  // ...render rows vào table
}




export function CommissionTable() {
 const [tab, setTab] = useState<"all" | "pending" | "approved" | "paid">("all")
const [q, setQ] = useState("")
const [rows, setRows] = useState<any[]>([])
const [loading, setLoading] = useState(false)
const [err, setErr] = useState<string | null>(null)

useEffect(() => {
  const run = async () => {
    setLoading(true)
    setErr(null)

    const params = new URLSearchParams()
    if (tab !== "all") params.set("status", tab)
    if (q.trim()) params.set("q", q.trim())

    const res = await fetch(`/api/commissions?${params.toString()}`, { cache: "no-store" })

    // nếu API lỗi
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setErr(j.error ?? "Failed to load")
      setRows([])
      setLoading(false)
      return
    }

    // ✅ API của bạn trả ARRAY trực tiếp
    const j = await res.json().catch(() => [])

    // ✅ setRows đúng format (array)
    setRows(Array.isArray(j) ? j : (j.rows ?? j.items ?? []))

    setLoading(false)
  }

  run()
}, [tab, q])



  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

  <div className="flex items-center gap-2">
    <Input
          className="sm:max-w-xs"
          placeholder="Search order id..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

    <Button
      variant="outline"
     onClick={() => {
  const csv = toCsv(rows)
  downloadCsv("commissions.csv", csv)
      }}
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  </div>
</div>

       
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.shopify_order_id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-xs">{r.shopify_order_id}</TableCell>
                <TableCell>${r.amount.toFixed(2)}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-right text-muted-foreground">{r.created_at}</TableCell>
              </TableRow>
            ))}

            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  No results
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: keyof typeof STATUS_STYLE }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending
  const Icon = s.Icon

  return (
    <Badge variant="outline" className={`inline-flex items-center gap-1 ${s.badge}`}>
      <Icon className="h-3 w-3" />
      {s.label}
    </Badge>
  )
}

function escapeCsv(v: unknown) {
  const s = String(v ?? "")
  if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsv(rows: any[]) {
  const headers = ["shopify_order_id", "amount", "status", "created_at"]
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        escapeCsv(r.shopify_order_id),
        escapeCsv(r.amount),
        escapeCsv(r.status),
        escapeCsv(r.created_at),
      ].join(",")
    ),
  ]
  return lines.join("\n")
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

