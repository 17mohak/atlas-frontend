"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { day: "Mon", utilization: 65, load: 45 },
  { day: "Tue", utilization: 78, load: 58 },
  { day: "Wed", utilization: 82, load: 60 },
  { day: "Thu", utilization: 75, load: 55 },
  { day: "Fri", utilization: 85, load: 65 },
]

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis 
          dataKey="day" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
          itemStyle={{ color: '#e4e4e7' }}
        />
        <Line 
          type="monotone" 
          dataKey="utilization" 
          stroke="#6366f1" 
          strokeWidth={3}
          activeDot={{ r: 6 }} 
          name="Room Utilization"
        />
        <Line 
          type="monotone" 
          dataKey="load" 
          stroke="#10b981" 
          strokeWidth={3}
          activeDot={{ r: 6 }} 
          name="Faculty Load"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}