import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Timetable } from "@/components/dashboard/schedule/timetable"
import { CalendarDays, Filter, Plus, Download } from "lucide-react"

export default function SchedulePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 space-y-4">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Smart Class Scheduler</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Master timetable matrix for the upcoming academic week.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-zinc-200 dark:border-zinc-800 hidden md:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
            <Plus className="mr-2 h-4 w-4" /> New Session
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center w-full bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Input 
            placeholder="Search by faculty, room, or subject..." 
            className="pl-4 w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto border border-zinc-200 dark:border-zinc-800">
            <CalendarDays className="mr-2 h-4 w-4" />
            Week of Oct 24
          </Button>
          <Button variant="outline" className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Main Core Engine Area */}
      <div className="flex-1 min-h-0 relative">
        <Timetable />
      </div>
    </div>
  )
}