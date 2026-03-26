import { Faculty } from "@/lib/schemas/academic"

const mockFaculty: Faculty[] = [
  { id: "f1", name: "Dr. Arjan Singh", department: "Design", totalHours: 18.5, status: "In Session" },
  { id: "f2", name: "Prof. Ada Lovelace", department: "Mathematics", totalHours: 12.0, status: "On Leave" },
  { id: "f3", name: "Dr. Grace Hopper", department: "Software Engineering", totalHours: 20.0, status: "Active" },
  { id: "f4", name: "Prof. John von Neumann", department: "Mathematics", totalHours: 0, status: "Sabbatical" },
  { id: "f5", name: "Dr. Katherine Johnson", department: "Physics", totalHours: 15.5, status: "Active" },
  { id: "f6", name: "Prof. Richard Feynman", department: "Physics", totalHours: 0, status: "Inactive" },
  { id: "f7", name: "Dr. Margaret Hamilton", department: "Software Engineering", totalHours: 22.0, status: "Active" },
  { id: "f8", name: "Prof. Donald Knuth", department: "Computer Science", totalHours: 10.0, status: "Active" },
  { id: "f9", name: "Dr. Barbara Liskov", department: null, totalHours: 5.0, status: "Active" },
  { id: "f10", name: "Prof. Tim Berners-Lee", department: "Information Technology", totalHours: 0, status: "On Leave" },
]

export async function getFaculty(): Promise<Faculty[]> {
  // Simulate network latency (500ms)
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockFaculty
}