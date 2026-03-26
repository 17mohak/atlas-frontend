"use client"

import { Button } from "@/components/ui/button"
import { Room } from "@/lib/schemas/academic"
import { cn } from "@/lib/utils"

interface RoomsTableProps {
  data: Room[]
}

export function RoomsTable({ data }: RoomsTableProps) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-950 rounded-md border border-indigo-100 dark:border-indigo-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No rooms found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-indigo-100 dark:border-indigo-900 overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900">
          <tr>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Room</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Type</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Capacity</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Lab</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300">Status</th>
            <th className="px-6 py-3 font-medium text-indigo-900 dark:text-indigo-300 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-indigo-50 dark:divide-indigo-900/50 bg-white dark:bg-zinc-950">
          {data.map((room) => (
            <tr key={room.id} className="transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20">
              <td className="px-6 py-4 font-medium text-indigo-950 dark:text-indigo-100">{room.roomNumber}</td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                    room.type === 'Lecture Hall' && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
                    room.type === 'Computer Lab' && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800",
                    room.type === 'Design Studio' && "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800",
                    (room.type === 'Seminar Room' || room.type === 'Meeting Room') && "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                  )}>
                    {room.type}
                  </span>
              </td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{room.capacity}</td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{room.isLab ? "Yes" : "No"}</td>
              <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    room.status === 'Available' && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
                    room.status === 'Occupied' && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                    room.status === 'Maintenance' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {room.status}
                  </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}