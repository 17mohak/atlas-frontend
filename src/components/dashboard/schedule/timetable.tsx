import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM"
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

// Mock scheduling data
const mockSessions = [
  { id: 1, day: "Monday", time: "09:00 AM", duration: 2, title: "UI/UX Design", room: "L-402", faculty: "Dr. Arjan Singh", color: "bg-blue-100 border-blue-300 text-blue-800" },
  { id: 2, day: "Tuesday", time: "11:00 AM", duration: 1.5, title: "Data Structures", room: "B-205", faculty: "Prof. Ada Lovelace", color: "bg-purple-100 border-purple-300 text-purple-800" },
  { id: 3, day: "Wednesday", time: "01:00 PM", duration: 3, title: "Design Studio Workshop", room: "C-302", faculty: "Dr. Arjan Singh", color: "bg-pink-100 border-pink-300 text-pink-800" },
  { id: 4, day: "Thursday", time: "10:00 AM", duration: 2, title: "Algorithms", room: "A-102", faculty: "Dr. Grace Hopper", color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
  { id: 5, day: "Friday", time: "02:00 PM", duration: 2, title: "Software Engineering", room: "D-401", faculty: "Dr. Margaret Hamilton", color: "bg-amber-100 border-amber-300 text-amber-800" },
]

export function Timetable() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
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
          {days.map((day, dayIndex) => (
            <div key={day} className="relative border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex flex-col">
              {timeSlots.map(time => (
                <div key={`${day}-${time}`} className="h-20 border-b border-zinc-200/50 dark:border-zinc-800/50" />
              ))}
              
              {/* Overlay Sessions */}
              {mockSessions.filter(s => s.day === day).map(session => {
                const startIndex = timeSlots.indexOf(session.time);
                if (startIndex === -1) return null;
                
                // Height = duration * 5rem (h-20)
                const height = `${session.duration * 5}rem`;
                // Top offset = index * 5rem
                const top = `${startIndex * 5}rem`;

                return (
                  <div 
                    key={session.id}
                    className={cn(
                      "absolute w-[94%] left-[3%] rounded-md border p-2 shadow-sm flex flex-col gap-1 transition-transform hover:scale-[1.02] cursor-pointer",
                      session.color
                    )}
                    style={{ height, top }}
                  >
                    <div className="font-semibold text-xs leading-tight truncate">{session.title}</div>
                    <div className="text-[10px] opacity-80 leading-none truncate">{session.faculty}</div>
                    <div className="mt-auto text-[10px] font-medium bg-white/40 dark:bg-black/20 w-fit px-1.5 py-0.5 rounded">
                      {session.room}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}