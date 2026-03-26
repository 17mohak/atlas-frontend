"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sparkles, BookOpen, Users, UserMinus, Loader2 } from "lucide-react"
import { useSchedule } from "./schedule-context"
import { useDraggable } from "@dnd-kit/core"

interface MockSubject {
  id: string
  name: string
  code: string
  lecsPerWeek: number
  requiresLab: boolean
}

interface MockDepartment {
  id: string
  name: string
}

interface MockBatch {
  id: string
  name: string
  departmentId: string
}

interface MockFaculty {
  id: string
  name: string
  department: string
  status: string
}

interface MockData {
  departments: MockDepartment[]
  batches: MockBatch[]
  subjects: MockSubject[]
  faculty: MockFaculty[]
}

function DraggableSubjectCard({ sub, current, req, color, facultyName }: { sub: MockSubject, current: number, req: number, color: string, facultyName: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `subject-${sub.id}`,
    data: { 
      type: "SIDEBAR_ITEM", 
      subjectId: sub.id, 
      name: sub.name,
      facultyId: "123e4567-e89b-12d3-a456-426614174000", // Hardcoding a mock faculty ID for now
      lecsPerWeek: sub.lecsPerWeek,
      color,
      facultyName
    }
  })

  // We no longer apply transform directly here because DragOverlay handles the visual clone,
  // but we can fade out the original item while it is dragging.
  const style = {
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none cursor-grab active:cursor-grabbing">
      <Card className={cn("p-3 transition-colors shadow-sm border-l-4", color)}>
        <div className="flex justify-between items-start mb-1">
          <div className="font-medium text-sm leading-tight text-zinc-900 dark:text-zinc-100">{sub.name}</div>
          <div className={cn("text-xs font-bold px-1.5 py-0.5 rounded", 
            current < req ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
          )}>
            {current}/{req}
          </div>
        </div>
        <div className="text-xs text-zinc-500">{sub.code} • {facultyName}</div>
      </Card>
    </div>
  )
}

export function WorkbenchSidebar({ data }: { data: MockData }) {
  const [activeTab, setActiveTab] = useState<"subjects" | "faculty" | "leaves">("subjects")
  const { department, setDepartment, batch, setBatch, isGenerating, generateVariants } = useSchedule()

  return (
    <div className="w-80 flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase mb-1.5 block">Department</label>
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-2 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none"
          >
            {data.departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase mb-1.5 block">Batch / Cohort</label>
          <select 
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-2 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none"
          >
            {data.batches.filter((b) => b.departmentId === department).map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        
        <Button 
          onClick={generateVariants}
          disabled={isGenerating}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isGenerating ? "Optimizing..." : "Generate Variants"}
        </Button>
      </div>

      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button 
          onClick={() => setActiveTab("subjects")}
          className={cn("flex-1 p-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition-colors", 
            activeTab === "subjects" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          )}
        >
          <BookOpen className="h-4 w-4" />
          Subjects
        </button>
        <button 
          onClick={() => setActiveTab("faculty")}
          className={cn("flex-1 p-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition-colors", 
            activeTab === "faculty" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          )}
        >
          <Users className="h-4 w-4" />
          Faculty
        </button>
        <button 
          onClick={() => setActiveTab("leaves")}
          className={cn("flex-1 p-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition-colors", 
            activeTab === "leaves" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          )}
        >
          <UserMinus className="h-4 w-4" />
          Leaves
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/10">
        {activeTab === "subjects" && (
          <>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-medium text-zinc-500">Subject List</span>
              <span className="text-xs font-medium text-zinc-500">Lecs / Wk</span>
            </div>
            {data.subjects.map((sub, idx: number) => {
              const current = idx === 0 ? 2 : (idx === 1 ? 0 : 3) // Mocking current allocation logic
              const req = sub.lecsPerWeek
              const colors = ["border-l-blue-500", "border-l-pink-500", "border-l-purple-500"]
              const color = colors[idx % colors.length]

              return (
                <DraggableSubjectCard 
                  key={sub.name} 
                  sub={sub} 
                  current={current} 
                  req={req} 
                  color={color} 
                  facultyName={sub.requiresLab ? 'Lab Faculty' : 'Lecturer'}
                />
              )
            })}
          </>
        )}
        
        {activeTab === "faculty" && (
          <div className="space-y-2">
            {data.faculty.map((f) => (
               <Card key={f.id} className="p-3 shadow-sm border-l-4 border-l-zinc-300">
                 <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{f.name}</div>
                 <div className="text-xs text-zinc-500 mt-1 flex justify-between">
                   <span>{f.department}</span>
                   <span>{f.status}</span>
                 </div>
               </Card>
            ))}
          </div>
        )}

        {activeTab === "leaves" && (
          <div className="text-sm text-zinc-500 p-4 text-center">Approved leaves calendar drops here.</div>
        )}
      </div>
    </div>
  )
}