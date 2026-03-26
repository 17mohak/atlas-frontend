import { Room } from "@/lib/schemas/academic"

const mockRooms: Room[] = [
  { id: "r1", roomNumber: "L-402", type: "Lecture Hall", capacity: 60, isLab: false, status: "Occupied" },
  { id: "r2", roomNumber: "A-102", type: "Lecture Hall", capacity: 150, isLab: false, status: "Available" },
  { id: "r3", roomNumber: "B-205", type: "Computer Lab", capacity: 40, isLab: true, status: "Available" },
  { id: "r4", roomNumber: "B-206", type: "Computer Lab", capacity: 40, isLab: true, status: "Maintenance" },
  { id: "r5", roomNumber: "C-302", type: "Design Studio", capacity: 25, isLab: true, status: "Occupied" },
  { id: "r6", roomNumber: "C-305", type: "Design Studio", capacity: 30, isLab: true, status: "Available" },
  { id: "r7", roomNumber: "D-401", type: "Seminar Room", capacity: 60, isLab: false, status: "Available" },
  { id: "r8", roomNumber: "D-405", type: "Meeting Room", capacity: 15, isLab: false, status: "Occupied" },
  { id: "r9", roomNumber: "A-105", type: "Seminar Room", capacity: 80, isLab: false, status: "Available" },
  { id: "r10", roomNumber: "B-101", type: "Lecture Hall", capacity: 200, isLab: false, status: "Maintenance" },
]

export async function getRooms(): Promise<Room[]> {
  // Simulate network latency (500ms)
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockRooms
}