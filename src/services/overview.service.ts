import { DashboardMetrics, DashboardMetricsSchema } from '@/lib/schemas/academic';
// Mock data import, simulating database access for metrics logic
import mockWorkbenchData from '../../mock-workbench-data.json';

interface MockSession {
  warnings?: { message: string }[];
}

interface MockFaculty {
  status: string;
}

/**
 * Service handling System Overview logic
 * Calculates metrics directly from raw entity lists to avoid relying on a backend /metrics route.
 */
export async function getDashboardOverview(): Promise<DashboardMetrics> {
  const { faculty, rooms, sessions } = mockWorkbenchData;
  
  // Room Utilization (Active Sessions vs Total Room Slots)
  // Assuming 10 slots per day * 5 days = 50 slots per week per room
  const totalRoomSlots = rooms.length * 50;
  const activeSessions = sessions.length;
  const roomUtilization = totalRoomSlots > 0 ? (activeSessions / totalRoomSlots) * 100 : 0;

  // Total Conflicts Calculation
  const allWarnings = (sessions as MockSession[]).flatMap((s) => s.warnings || []);
  const totalConflicts = allWarnings.length;

  const facultyOnLeave = (faculty as MockFaculty[]).filter((f) => f.status === "On Leave" || f.status === "Sabbatical").length;

  // Build the metrics payload
  const metricsData = {
    roomUtilization: Math.round(roomUtilization),
    activeClasses: activeSessions,
    facultyOnLeave,
    totalConflicts,
    recentConflicts: allWarnings.slice(0, 5).map((w, index: number) => ({
      id: `conflict-${index}`,
      type: "Double Booking", // Simplified mapping for mock
      description: w.message,
      severity: "Warning",
      resolved: false
    })),
    topMetrics: [
      { label: "Room Utilization", value: `${Math.round(roomUtilization)}%`, trend: 2.5, status: roomUtilization > 80 ? "Good" : "Warning" },
      { label: "Active Classes", value: activeSessions, trend: 5, status: "Good" },
      { label: "Faculty on Leave", value: facultyOnLeave, trend: -1, status: "Warning" },
      { label: "Total Conflicts", value: totalConflicts, trend: totalConflicts > 0 ? 10 : 0, status: totalConflicts === 0 ? "Good" : "Critical" }
    ]
  };

  return DashboardMetricsSchema.parse(metricsData);
}

/**
 * Simulates a visual stub for generating algorithmic schedule variants.
 * Applies a 2-second delay and returns the generated mock.
 */
export async function generateScheduleVariants(config: unknown): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _config = config; // Keep unused var for future implementation
  // Simulate heavy computation / network request
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Return a generated mock payload
  return {
    status: "success",
    variantId: "v-7890-alpha",
    message: "Generated optimal schedule variant with 0 critical conflicts.",
    data: mockWorkbenchData.sessions
  };
}

/**
 * Simulates saving a manually dropped session mutation.
 * Applies a 500ms delay and returns a success status.
 */
export async function saveSessionMutation(sessionData: unknown): Promise<{ status: string, data: unknown }> {
  // Simulate network latency for save
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    status: "success",
    data: sessionData
  };
}
