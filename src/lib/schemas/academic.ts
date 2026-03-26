import { z } from "zod"

export const FacultyStatusSchema = z.enum(["Active", "In Session", "On Leave", "Sabbatical", "Inactive"])

export const FacultySchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  department: z.string().nullable(),
  totalHours: z.number().nonnegative(),
  status: FacultyStatusSchema,
})

export type FacultyStatus = z.infer<typeof FacultyStatusSchema>
export type Faculty = z.infer<typeof FacultySchema>

export const RoomTypeSchema = z.enum(["Lecture Hall", "Computer Lab", "Design Studio", "Seminar Room", "Meeting Room"])

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