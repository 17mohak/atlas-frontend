"use client"

import { useSchedule } from "./schedule-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Clock, MapPin, User, AlertTriangle } from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WorkbenchDetailsPane({ data }: { data: any }) {
  const { selectedSessionId, setSelectedSessionId, sessions, updateSession, deleteSession } = useSchedule()

  if (!selectedSessionId) {
    return null; // The parent handles the layout shift by conditional rendering or fixed width
  }

  const session = sessions.find(s => s.id === selectedSessionId)

  if (!session) {
    // If deleted or not found
    return null;
  }

  const hasWarnings = session.warnings && session.warnings.length > 0;

  return (
    <div className="w-80 h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col shadow-xl z-20 shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Session Details</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" onClick={() => setSelectedSessionId(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 flex flex-col gap-6 flex-1">
        {/* Subject Area */}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{session.courseName}</h2>
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 w-fit px-2 py-0.5 rounded-full">
            {session.id.startsWith('s-local') || session.id.startsWith('s-dropped') ? 'Draft' : 'Scheduled'}
          </div>
        </div>

        {/* Warnings */}
        {hasWarnings && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold text-sm">
              <AlertTriangle className="h-4 w-4" />
              Conflicts Detected
            </div>
            <ul className="text-xs text-red-600 dark:text-red-300 space-y-1 list-disc pl-4">
              {session.warnings?.map((w, i) => (
                <li key={i}>{w.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500 flex items-center gap-2">
              <User className="h-3 w-3" /> Faculty
            </Label>
            <select 
              className="w-full text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={session.facultyId}
              onChange={(e) => updateSession(session.id, { facultyId: e.target.value })}
            >
              <option value="unassigned">Unassigned</option>
              {data.faculty.map((f: { id: string, name: string }) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500 flex items-center gap-2">
              <MapPin className="h-3 w-3" /> Room
            </Label>
            <select 
              className="w-full text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={session.roomId}
              onChange={(e) => updateSession(session.id, { roomId: e.target.value })}
            >
              <option value="unassigned">Unassigned</option>
              {data.rooms.map((r: { id: string, roomNumber: string, type: string }) => (
                <option key={r.id} value={r.id}>{r.roomNumber} ({r.type})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Day
            </Label>
            <select 
              className="w-full text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={session.dayOfWeek}
              onChange={(e) => updateSession(session.id, { dayOfWeek: e.target.value })}
            >
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-500">Start Time</Label>
              <input 
                type="time" 
                className="w-full text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={new Date(session.startTime).toISOString().substr(11, 5)}
                onChange={(e) => {
                  const d = new Date(session.startTime)
                  const [hours, mins] = e.target.value.split(':')
                  d.setUTCHours(parseInt(hours, 10), parseInt(mins, 10), 0, 0)
                  updateSession(session.id, { startTime: d.toISOString() })
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-500">End Time</Label>
              <input 
                type="time" 
                className="w-full text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={new Date(session.endTime).toISOString().substr(11, 5)}
                onChange={(e) => {
                  const d = new Date(session.endTime)
                  const [hours, mins] = e.target.value.split(':')
                  d.setUTCHours(parseInt(hours, 10), parseInt(mins, 10), 0, 0)
                  updateSession(session.id, { endTime: d.toISOString() })
                }}
              />
            </div>
          </div>
          
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-6 flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={() => setSelectedSessionId(null)}>
            Close
          </Button>
          <Button variant="destructive" className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-0 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50" 
            onClick={() => deleteSession(session.id)}
          >
            Remove Session
          </Button>
        </div>
      </div>
    </div>
  )
}