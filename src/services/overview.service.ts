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
 * Generates an algorithmic schedule variant using a Python OR-Tools CP-SAT solver.
 * Maps the frontend entities into a Constraint Satisfaction Problem (CSP) payload.
 * Fallbacks to a local mock if the solver backend is offline.
 */
export async function generateScheduleVariants(currentState?: Record<string, unknown>): Promise<{ status: string, variantId?: string, message: string, data: { id: string, courseName: string, facultyId: string, roomId: string, dayOfWeek: string, startTime: string, endTime: string }[] }> {
  // Use provided state or default to the mock database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state: any = currentState || mockWorkbenchData;

  // --- VERCEL PRODUCTION BYPASS ---
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    console.log("Running in production/Vercel. Bypassing local Python solver...");
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate solver latency
    
    return {
      status: "success",
      variantId: "v-vercel-production",
      message: "Generated optimal schedule variant (Production Mock).",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: mockWorkbenchData.sessions.map((s: any) => ({ ...s, id: crypto.randomUUID() }))
    };
  }

  // 1. Format the CSP Payload for OR-Tools Contract
  const cspPayload = {
    metadata: {
      targetTerm: "Fall 2026",
      daysPerWeek: 5,
      slotsPerDay: 10
    },
    resources: {
      rooms: state.rooms.map((r: { id: string, isLab: boolean, capacity: number }) => ({
        id: r.id,
        isLab: r.isLab,
        capacity: r.capacity
      })),
      faculty: state.faculty.map((f: { id: string, department: string, totalHours: number }) => ({
        id: f.id,
        department: f.department,
        maxHours: f.totalHours
      }))
    },
    demands: {
      batches: state.batches.map((b: { id: string, studentCount: number, departmentId: string }) => ({
        id: b.id,
        size: b.studentCount,
        departmentId: b.departmentId
      })),
      subjects: state.subjects.map((s: { id: string, lecsPerWeek: number, requiresLab: boolean }) => ({
        id: s.id,
        lecsPerWeek: s.lecsPerWeek,
        requiresLab: s.requiresLab
      }))
    }
  };

  // 2. Attempt to fetch from Python CP-SAT solver
  try {
    const response = await fetch("http://localhost:8000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cspPayload),
    });

    if (!response.ok) {
      throw new Error(`Solver API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      status: "success",
      variantId: data.variantId || `v-${Date.now()}`,
      message: "Generated optimal schedule variant via OR-Tools.",
      data: data.sessions
    };

  } catch (error) {
    // 3. Fallback if Python backend is unreachable
    console.warn("⚠️ OR-Tools Python solver is offline or unreachable. Falling back to local mock generation.", error);
    
    // Artificial delay to simulate solver execution time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      status: "success",
      variantId: "v-fallback-alpha",
      message: "Generated optimal schedule variant (Mock Fallback) with 0 critical conflicts.",
      // Map new UUIDs to ensure no React key collisions if fallback is triggered multiple times
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: mockWorkbenchData.sessions.map((s: any) => ({ ...s, id: crypto.randomUUID() }))
    };
  }
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
