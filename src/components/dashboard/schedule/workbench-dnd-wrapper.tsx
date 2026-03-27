"use client"

import { ReactNode, useState, useEffect } from "react"
import { DndContext, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor, DragOverlay } from "@dnd-kit/core"
import { useSchedule } from "./schedule-context"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function WorkbenchDnDWrapper({ children }: { children: ReactNode }) {
  const { sessions, addSession, moveSession } = useSchedule()
  const [isMounted, setIsMounted] = useState(false)
  const [activeDragItem, setActiveDragItem] = useState<Record<string, string | null | undefined> | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced from 8px to 3px to ensure drags trigger easily
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItem(event.active.data.current as Record<string, string | null | undefined> | null)
  }

  const handleDragCancel = () => {
    setActiveDragItem(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragItem(null)

    if (over) {
      const { day, time } = over.data.current as { day: string, time: string }
      
      // Parse "08:00 AM" into hours for a dummy ISO string
      const hoursMatch = time.match(/(\d+):(\d+)\s(AM|PM)/)
      let hour = 8
      if (hoursMatch) {
        hour = parseInt(hoursMatch[1], 10)
        if (hoursMatch[3] === "PM" && hour !== 12) hour += 12
        if (hoursMatch[3] === "AM" && hour === 12) hour = 0
      }

      const startDate = new Date()
      startDate.setUTCHours(hour, 0, 0, 0)
      const startTime = startDate.toISOString()

      const endDate = new Date()
      endDate.setUTCHours(hour + 1, 0, 0, 0)
      const endTime = endDate.toISOString()

      if (active.data.current?.type === "SIDEBAR_ITEM") {
        const { facultyId, name } = active.data.current

        // Optimistic update
        addSession({
          courseName: name,
          facultyId: facultyId || "unassigned",
          roomId: "unassigned", // Leaving room unassigned by default on drop
          dayOfWeek: day,
          startTime,
          endTime
        })
      } else if (active.data.current?.type === "GRID_ITEM") {
        const sessionId = active.data.current.sessionId
        // Update existing session while preserving duration
        const sessionToMove = sessions.find(s => s.id === sessionId)
        if (sessionToMove) {
          const oldStart = new Date(sessionToMove.startTime).getTime()
          const oldEnd = new Date(sessionToMove.endTime).getTime()
          const duration = oldEnd - oldStart

          const newStartDate = new Date(startTime)
          const newEndDate = new Date(newStartDate.getTime() + duration)

          moveSession(sessionId, {
            dayOfWeek: day,
            startTime: newStartDate.toISOString(),
            endTime: newEndDate.toISOString()
          })
        }
      }
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeDragItem?.type === "SIDEBAR_ITEM" && (
          <div className="w-72 opacity-90 rotate-2 scale-105 transition-transform shadow-2xl cursor-grabbing">
            <Card className={cn("p-3 border-l-4", activeDragItem.color || "border-l-zinc-500")}>
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-sm leading-tight text-zinc-900 dark:text-zinc-100">{activeDragItem.name}</div>
              </div>
              <div className="text-xs text-zinc-500">{activeDragItem.facultyName}</div>
            </Card>
          </div>
        )}
        {activeDragItem?.type === "GRID_ITEM" && (
          <div className="w-full h-full opacity-90 shadow-2xl rounded-md border p-2 flex flex-col gap-1 cursor-grabbing bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-100">
             <div className="font-semibold text-xs leading-tight truncate">{activeDragItem.courseName}</div>
             <div className="text-[10px] opacity-80 leading-none truncate">Moving session...</div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}