import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Timetable } from "@/components/dashboard/schedule/timetable"
import { WorkbenchSidebar } from "@/components/dashboard/schedule/workbench-sidebar"
import { WorkbenchDetailsPane } from "@/components/dashboard/schedule/workbench-details-pane"
import { ScheduleProvider } from "@/components/dashboard/schedule/schedule-context"
import { WorkbenchDnDWrapper } from "@/components/dashboard/schedule/workbench-dnd-wrapper"
import { CalendarDays, Filter, Download } from "lucide-react"
import mockWorkbenchData from '../../../../mock-workbench-data.json'

export default function SchedulePage() {
  return (
    <ScheduleProvider initialSessions={mockWorkbenchData.sessions}>
      <WorkbenchDnDWrapper>
        <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
          {/* Left Control Panel */}
          <WorkbenchSidebar data={mockWorkbenchData} />

          {/* Main Core Engine Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mr-4">Workbench</h2>
                <div className="relative w-64">
                  <Input 
                    placeholder="Search matrix..." 
                    className="h-8 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-2" />
                <Button variant="ghost" size="sm" className="h-8 text-zinc-600 dark:text-zinc-400">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Week of Mar 30
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 border-zinc-200 dark:border-zinc-800">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
                <Button variant="outline" size="sm" className="h-8 border-zinc-200 dark:border-zinc-800 hidden md:flex">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            {/* Timetable Matrix */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden">
              <Timetable rooms={mockWorkbenchData.rooms} faculty={mockWorkbenchData.faculty} />
            </div>
          </div>
          
          {/* Right-Hand Details Pane */}
          <WorkbenchDetailsPane data={mockWorkbenchData} />
        </div>
      </WorkbenchDnDWrapper>
    </ScheduleProvider>
  )
}