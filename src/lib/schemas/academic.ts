import { z } from "zod"

export const FacultyStatusSchema = z.enum(["Active", "In Session", "On Leave", "Sabbatical", "Inactive", "Available"])

export const FacultySchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  department: z.string().nullable(),
  totalHours: z.number().nonnegative(),
  status: FacultyStatusSchema,
})

export type FacultyStatus = z.infer<typeof FacultyStatusSchema>
export type Faculty = z.infer<typeof FacultySchema>

export const RoomTypeSchema = z.enum(["Lecture Hall", "Computer Lab", "Design Studio", "Seminar Room", "Meeting Room", "Studio"])

export const RoomStatusSchema = z.enum(["Available", "Occupied", "Maintenance"])

export const RoomSchema = z.object({
  id: z.string(),
  roomNumber: z.string(),
  type: RoomTypeSchema,
  capacity: z.number().int().positive("Capacity must be positive."),
  isLab: z.boolean(),
  status: RoomStatusSchema,
})

export type RoomType = z.infer<typeof RoomTypeSchema>
export type RoomStatus = z.infer<typeof RoomStatusSchema>
export type Room = z.infer<typeof RoomSchema>

// Dashboard Overview Schemas
export const SystemConflictSchema = z.object({
  id: z.string(),
  type: z.enum(["Double Booking", "Faculty Overload", "Room Capacity Exceeded"]),
  description: z.string(),
  severity: z.enum(["Critical", "Warning", "Info"]),
  resolved: z.boolean(),
})

export const MetricSchema = z.object({
  label: z.string(),
  value: z.number().or(z.string()),
  trend: z.number().nullable(), // Percentage change
  status: z.enum(["Good", "Warning", "Critical"]).optional(),
})

export const DashboardMetricsSchema = z.object({
  roomUtilization: z.number(), // Percentage
  activeClasses: z.number(),
  facultyOnLeave: z.number(),
  totalConflicts: z.number(),
  recentConflicts: z.array(SystemConflictSchema),
  topMetrics: z.array(MetricSchema),
})

export type SystemConflict = z.infer<typeof SystemConflictSchema>
export type DashboardMetrics = z.infer<typeof DashboardMetricsSchema>

// --- New Workbench Schemas (Batch, Subject, Config) ---

export const BatchSchema = z.object({
  id: z.string().uuid(),
  name: z.string(), // e.g., "2026 UX Cohort"
  departmentId: z.string(),
  studentCount: z.number().int().positive(),
})

export type Batch = z.infer<typeof BatchSchema>

export const SubjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(), // e.g., "Interaction Design"
  code: z.string(),
  lecsPerWeek: z.number().int().positive(),
  requiresLab: z.boolean().default(false),
})

export type Subject = z.infer<typeof SubjectSchema>

export const ScheduleConfigSchema = z.object({
  departmentId: z.string(),
  batchId: z.string(),
  term: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export type ScheduleConfig = z.infer<typeof ScheduleConfigSchema>

// Core Session Schema (for Timetable & Conflicts)
export const DayOfWeekSchema = z.enum([
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
])

export const ConflictWarningSchema = z.object({
  code: z.enum([
    "ROOM_DOUBLE_BOOKED", 
    "FACULTY_OVERLAP", 
    "CAPACITY_EXCEEDED",
    "FACULTY_UNAVAILABLE"
  ]),
  message: z.string(),
  conflictingSessionIds: z.array(z.string().uuid()).optional(),
})

export type ConflictWarning = z.infer<typeof ConflictWarningSchema>

export const SessionSchema = z.object({
  id: z.string().uuid(),
  courseName: z.string(),
  facultyId: z.string().uuid(),
  roomId: z.string().uuid(),
  dayOfWeek: DayOfWeekSchema,
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  warnings: z.array(ConflictWarningSchema).optional(),
})

export type Session = z.infer<typeof SessionSchema>
