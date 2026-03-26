"use client"

import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Faculty } from "@/lib/schemas/academic"
import { cn } from "@/lib/utils"

interface FacultyTableProps {
  data: Faculty[]
}

export function FacultyTable({ data }: FacultyTableProps) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-950 rounded-md border border-indigo-100 dark:border-indigo-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No faculty members found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-indigo-100 dark:border-indigo-900 overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900">
          <tr>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Name</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Department</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Total Hours</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Status</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-indigo-50 dark:divide-indigo-900/50 bg-white dark:bg-zinc-950">
          {data.map((faculty) => (
            <tr key={faculty.id} className="transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20">
              <td className="px-6 py-4 font-medium text-indigo-950 dark:text-indigo-100">{faculty.name}</td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{faculty.department ?? "N/A"}</td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{faculty.totalHours.toFixed(1)}</td>
              <td className="px-6 py-4">
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  (faculty.status === "Active" || faculty.status === "In Session") && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
                  (faculty.status === "On Leave" || faculty.status === "Sabbatical") && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                  faculty.status === "Inactive" && "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                )}>
                  {faculty.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-indigo-600">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}