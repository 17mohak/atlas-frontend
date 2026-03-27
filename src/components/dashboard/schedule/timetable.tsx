"use client"

import { cn } from "@/lib/utils"
import { useSchedule } from "./schedule-context"
import { useDroppable, useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM"
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

// Helper removed to fix unused vars

function getExactTopOffset(isoString: string) {
  const date = new Date(isoString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  
  // Base 8 AM is index 0
  const baseHour = 8;
  const hourDiff = hours - baseHour;
  
  // Each hour is 5rem. We can return the value in rem.
  // 1 hour = 5rem. So (hourDiff + minutes/60) * 5
  return (hourDiff + minutes / 60) * 5;
}

function getDurationInHours(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  return (end - start) / (1000 * 60 * 60)
}

function DroppableCell({ day, time }: { day: string, time: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${day}-${time}`,
    data: { day, time }
  })

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "h-20 border-b transition-colors",
        isOver ? "bg-indigo-50/80 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800" : "border-zinc-200/50 dark:border-zinc-800/50"
      )} 
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DraggableSessionBlock({ session, rooms, faculty, height, top }: { session: any, rooms: { id: string, roomNumber: string }[], faculty: { id: string, name: string }[], height: string, top: string }) {
  const { selectedSessionId, setSelectedSessionId } = useSchedule()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: session.id,
    data: {
      type: "GRID_ITEM",
      sessionId: session.id,
      courseName: session.courseName,
      facultyId: session.facultyId,
      roomId: session.roomId,
    }
  })

  const hasWarnings = session.warnings && session.warnings.length > 0;
  const isSelected = selectedSessionId === session.id;
  const roomObj = rooms.find(r => r.id === session.roomId)
  const facultyObj = faculty.find(f => f.id === session.facultyId)

  // Use a softer opacity for the original grid item while it is dragging
  const style = {
    height,
    top,
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 40 : (isSelected ? 30 : 10),
  }

  return (
    <div 
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => setSelectedSessionId(session.id)}
      className={cn(
        "absolute w-[94%] left-[3%] rounded-md border p-2 shadow-sm flex flex-col gap-1 transition-transform cursor-grab active:cursor-grabbing touch-none",
        hasWarnings ? "bg-red-50 border-red-300 text-red-900 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200" 
          : "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
        !isDragging && "hover:scale-[1.02]",
        isSelected && "ring-2 ring-indigo-500 dark:ring-indigo-400 ring-offset-1 dark:ring-offset-zinc-950"
      )}
      style={style}
    >
      <div className="font-semibold text-xs leading-tight truncate">{session.courseName}</div>
      <div className="text-[10px] opacity-80 leading-none truncate">{facultyObj?.name || 'Unknown Faculty'}</div>
      <div className="mt-auto flex justify-between items-center">
        <div className="text-[10px] font-medium bg-white/50 dark:bg-black/20 w-fit px-1.5 py-0.5 rounded">
          {roomObj?.roomNumber || 'TBD'}
        </div>
        {hasWarnings && (
          <div className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 rounded">
            ! Conflict
          </div>
        )}
      </div>
    </div>
  )
}

export function Timetable({ rooms, faculty }: { rooms: { id: string; roomNumber: string }[], faculty: { id: string; name: string }[] }) {
  const { sessions, isGenerating } = useSchedule()

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden relative">
      {/* Generating Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">OR-Tools Computing Best Fit...</div>
        </div>
      )}

      {/* Header Row */}
      <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="p-3 border-r border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-medium text-sm text-zinc-500">
          Time
        </div>
        {days.map(day => (
          <div key={day} className="p-3 border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-semibold text-sm text-zinc-700 dark:text-zinc-300">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] min-w-[800px]">
          {/* Time Column */}
          <div className="flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
            {timeSlots.map(time => (
              <div key={time} className="h-20 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-center pt-2 text-xs text-zinc-500">
                {time}
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {days.map((day) => (
            <div key={day} className="relative border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex flex-col">
              {timeSlots.map(time => (
                <DroppableCell key={`${day}-${time}`} day={day} time={time} />
              ))}
              
              {/* Overlay Sessions */}
              {!isGenerating && sessions.filter(s => s.dayOfWeek === day).map(session => {
                const duration = getDurationInHours(session.startTime, session.endTime);
                
                // Height = duration * 5rem (h-20)
                const height = `${duration * 5}rem`;
                
                // Use exact top offset to allow half-hour shifts
                const topRem = getExactTopOffset(session.startTime);
                // Don't render if it's outside our 8am-5pm grid
                if (topRem < 0 || topRem > 45) return null;
                
                const top = `${topRem}rem`;

                return (
                  <DraggableSessionBlock 
                    key={session.id}
                    session={session}
                    rooms={rooms}
                    faculty={faculty}
                    height={height}
                    top={top}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}