import { DashboardMetrics } from "@/lib/schemas/academic"

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Simulate network latency (500ms)
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    roomUtilization: 78.5,
    activeClasses: 42,
    facultyOnLeave: 3,
    totalConflicts: 2,
    recentConflicts: [
      { id: "c1", type: "Double Booking", description: "Dr. Arjan Singh scheduled in L-402 and B-205 simultaneously on Monday 10:00 AM.", severity: "Critical", resolved: false },
      { id: "c2", type: "Faculty Overload", description: "Prof. Ada Lovelace assigned 22 hours (Max: 20).", severity: "Warning", resolved: false }
    ],
    topMetrics: [
      { label: "Room Utilization", value: "78.5%", trend: 2.4, status: "Good" },
      { label: "Active Classes", value: 42, trend: 5.1, status: "Good" },
      { label: "Faculty Leaves", value: 3, trend: -1.2, status: "Warning" },
      { label: "System Conflicts", value: 2, trend: 100, status: "Critical" },
    ]
  }
}