"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Types based on the schema
interface Session {
  id: string
  courseName: string
  facultyId: string
  roomId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  warnings?: { message: string, code?: string, conflictingSessionIds?: string[] }[]
}

interface ScheduleContextType {
  department: string
  setDepartment: (dept: string) => void
  batch: string
  setBatch: (batch: string) => void
  sessions: Session[]
  setSessions: (sessions: Session[]) => void
  isGenerating: boolean
  generateVariants: () => Promise<void>
  addSession: (payload: Omit<Session, 'id' | 'warnings'>) => void
  moveSession: (sessionId: string, updates: Partial<Pick<Session, 'dayOfWeek' | 'startTime' | 'endTime' | 'roomId'>>) => void
  updateSession: (sessionId: string, updates: Partial<Session>) => void
  deleteSession: (sessionId: string) => void
  selectedSessionId: string | null
  setSelectedSessionId: (id: string | null) => void
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

const calculateConflicts = (currentSessions: Session[]): Session[] => {
  // Deep clone to avoid mutating the original state directly
  const updatedSessions = currentSessions.map(s => ({ ...s, warnings: [] as { message: string, code?: string, conflictingSessionIds?: string[] }[] }));

  for (let i = 0; i < updatedSessions.length; i++) {
    for (let j = i + 1; j < updatedSessions.length; j++) {
      const s1 = updatedSessions[i];
      const s2 = updatedSessions[j];

      if (s1.dayOfWeek !== s2.dayOfWeek) continue;

      const s1Start = new Date(s1.startTime).getTime();
      const s1End = new Date(s1.endTime).getTime();
      const s2Start = new Date(s2.startTime).getTime();
      const s2End = new Date(s2.endTime).getTime();

      // Strict time overlap
      if (s1Start < s2End && s1End > s2Start) {
        // Check Room Conflict
        if (s1.roomId !== "unassigned" && s1.roomId === s2.roomId) {
          s1.warnings!.push({
            code: "ROOM_DOUBLE_BOOKED",
            message: `Room overlap with ${s2.courseName}.`,
            conflictingSessionIds: [s2.id]
          });
          s2.warnings!.push({
            code: "ROOM_DOUBLE_BOOKED",
            message: `Room overlap with ${s1.courseName}.`,
            conflictingSessionIds: [s1.id]
          });
        }

        // Check Faculty Conflict
        if (s1.facultyId !== "unassigned" && s1.facultyId === s2.facultyId) {
          s1.warnings!.push({
            code: "FACULTY_OVERLAP",
            message: `Faculty overlap with ${s2.courseName}.`,
            conflictingSessionIds: [s2.id]
          });
          s2.warnings!.push({
            code: "FACULTY_OVERLAP",
            message: `Faculty overlap with ${s1.courseName}.`,
            conflictingSessionIds: [s1.id]
          });
        }
      }
    }
  }

  // Clean up empty warnings array
  return updatedSessions.map(s => ({
    ...s,
    warnings: s.warnings!.length > 0 ? s.warnings : undefined
  }));
};

export function ScheduleProvider({ children, initialSessions = [] }: { children: ReactNode, initialSessions?: Session[] }) {
  const [department, setDepartment] = useState("d-001") // Mock ID
  const [batch, setBatch] = useState("b-100") // Mock ID
  const [sessions, setSessions] = useState<Session[]>(() => calculateConflicts(initialSessions))
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const generateVariants = async () => {
    setIsGenerating(true)
    try {
      const { generateScheduleVariants } = await import('@/services/overview.service')
      // Pass the current configuration/state to the generator if needed
      const result = await generateScheduleVariants()
      
      const newSessions = result.data.length > 0 ? result.data.map((s: { id: string, courseName: string, facultyId: string, roomId: string, dayOfWeek: string, startTime: string, endTime: string }) => ({...s, id: crypto.randomUUID()})) : [{
        id: crypto.randomUUID(),
        courseName: "Algorithmic Generation Dummy",
        facultyId: "123e4567-e89b-12d3-a456-426614174000",
        roomId: "r11bc32d-79ee-6594-c789-2g24d4e5f691",
        dayOfWeek: "Wednesday",
        startTime: "2026-04-01T10:00:00Z",
        endTime: "2026-04-01T12:00:00Z"
      }];

      // Completely replace the existing state with the new generated variants
      setSessions(calculateConflicts(newSessions))
    } catch (e) {
      console.error("Failed to generate variants:", e)
    } finally {
      setIsGenerating(false)
    }
  }

  const addSession = (payload: Omit<Session, 'id' | 'warnings'>) => {
    const newSession: Session = {
      ...payload,
      id: crypto.randomUUID(),
    }
    setSessions(prev => calculateConflicts([...prev, newSession]))
  }

  const moveSession = (sessionId: string, updates: Partial<Pick<Session, 'dayOfWeek' | 'startTime' | 'endTime' | 'roomId'>>) => {
    setSessions(prev => {
      const sessionIndex = prev.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) return prev;

      const updatedSession = { ...prev[sessionIndex], ...updates };
      const nextSessions = [...prev];
      nextSessions[sessionIndex] = updatedSession;
      
      return calculateConflicts(nextSessions);
    });
  }

  const updateSession = (sessionId: string, updates: Partial<Session>) => {
    setSessions(prev => {
      const sessionIndex = prev.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) return prev;

      const updatedSession = { ...prev[sessionIndex], ...updates };
      const nextSessions = [...prev];
      nextSessions[sessionIndex] = updatedSession;
      
      return calculateConflicts(nextSessions);
    });
  }

  const deleteSession = (sessionId: string) => {
    setSessions(prev => calculateConflicts(prev.filter(s => s.id !== sessionId)));
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null);
    }
  }

  return (
    <ScheduleContext.Provider value={{ 
      department, setDepartment, 
      batch, setBatch, 
      sessions, setSessions,
      isGenerating, generateVariants,
      addSession, moveSession, updateSession, deleteSession,
      selectedSessionId, setSelectedSessionId
    }}>
      {children}
    </ScheduleContext.Provider>
  )
}

export function useSchedule() {
  const context = useContext(ScheduleContext)
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider")
  }
  return context
}