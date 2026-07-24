import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TrendingUp, BarChart2, PieChart as PieIcon, Activity, Target } from 'lucide-react'

// Custom tooltip for dark mode glassmorphism
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/80 bg-card/95 p-3 shadow-xl text-xs backdrop-blur-md space-y-1">
        <p className="font-bold text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// 1. Line Chart: Weekly Productivity Trend
export function WeeklyProductivityChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-card/40 border-border/80 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <TrendingUp className="h-4 w-4 text-indigo-400" />
          Weekly Productivity Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} tickLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              name="Productivity Score"
              stroke="#818cf8"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// 2. Bar Chart: Tasks Completed Per Day
export function TasksPerDayChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-card/40 border-border/80 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <BarChart2 className="h-4 w-4 text-emerald-400" />
          Tasks Completed Per Day
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} tickLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// 3. Pie Chart: Task Completion Breakdown
export function TaskStatusPieChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-card/40 border-border/80 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <PieIcon className="h-4 w-4 text-purple-400" />
          Task Completion Status
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// 4. Area Chart: Focus Minutes Over Time
export function FocusTimeAreaChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-card/40 border-border/80 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <Activity className="h-4 w-4 text-amber-400" />
          Focus Minutes Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} tickLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="minutes"
              name="Focus Minutes"
              stroke="#f59e0b"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#focusGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// 5. Radial Bar Chart: Habit & Completion Gauges
export function HabitRadialChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-card/40 border-border/80 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
          <Target className="h-4 w-4 text-cyan-400" />
          Productivity Completion Gauges
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="25%"
            outerRadius="90%"
            barSize={12}
            data={data}
          >
            <RadialBar
              background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              dataKey="percentage"
              cornerRadius={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
