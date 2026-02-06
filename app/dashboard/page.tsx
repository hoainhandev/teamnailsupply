import { KpiCards } from "@/components/kpi-cards"
import { CommissionTable } from "@/components/commission-table"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingCart, DollarSign, Clock, BadgeCheck, Download } from "lucide-react"

/* ===== STATUS COLOR MAP ===== */
const STATUS_STYLE = {
  pending: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "text-amber-600",
  },
  approved: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "text-blue-600",
  },
  paid: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "text-emerald-600",
  },
} as const

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track your commissions in realtime as orders are paid.
        </p>
      </div>

      <KpiCards />

      <Separator />

      <div className="space-y-2">
        <h2 className="text-base font-semibold">Recent commissions</h2>
        <p className="text-sm text-muted-foreground">
          Filter by status and search by order ID.
        </p>
      </div>

      <CommissionTable />
    </div>
  )
}

