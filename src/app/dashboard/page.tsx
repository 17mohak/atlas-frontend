import { Suspense } from "react"
import { getDashboardOverview } from "@/services/overview.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Activity, Users, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { OverviewChart } from "@/components/dashboard/overview-chart"

async function DashboardContent() {
  const metrics = await getDashboardOverview()

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.topMetrics.map((metric, i) => (
          <Card key={i} className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {metric.label}
              </CardTitle>
              {metric.status === "Critical" && <AlertTriangle className="h-4 w-4 text-red-500" />}
              {metric.status === "Warning" && <Users className="h-4 w-4 text-amber-500" />}
              {metric.status === "Good" && <Activity className="h-4 w-4 text-emerald-500" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{metric.value}</div>
              {metric.trend !== null && (
                <p className={cn(
                  "text-xs mt-1 font-medium",
                  metric.trend > 0 ? (metric.status === "Critical" ? "text-red-500" : "text-emerald-500") : "text-zinc-500"
                )}>
                  {metric.trend > 0 ? "+" : ""}{metric.trend}% from last week
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Weekly Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart />
          </CardContent>
        </Card>

        {/* System Conflicts Panel */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Active Conflicts
            </CardTitle>
            <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 py-0.5 px-2.5 rounded-full text-xs font-bold">
              {metrics.totalConflicts}
            </span>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-4 mt-2">
              {metrics.recentConflicts.map((conflict) => (
                <div key={conflict.id} className="flex flex-col gap-2 p-3 bg-red-50/50 dark:bg-red-950/20 rounded-md border border-red-100 dark:border-red-900/50">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 dark:text-red-300">{conflict.type}</h4>
                    <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-1 leading-relaxed">{conflict.description}</p>
                  </div>
                  <button className="text-xs self-start bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 font-medium">
                    Resolve Manually
                  </button>
                </div>
              ))}
              {metrics.recentConflicts.length === 0 && (
                <div className="flex flex-col items-center justify-center p-6 text-zinc-500 h-full">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                  <p className="text-sm font-medium">No active conflicts detected.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800" />
        <div className="h-80 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800" />
      </div>
    </div>
  )
}

export default function DashboardOverview() {
  return (
    <div className="flex-1 flex flex-col h-full space-y-6 p-4 md:p-8 pt-6 overflow-y-auto">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">System Overview</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Real-time command center for the ATLAS scheduling engine.</p>
        </div>
      </div>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}