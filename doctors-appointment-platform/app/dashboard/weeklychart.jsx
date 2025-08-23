"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function WeeklyChart({ data }) {
  const safeData = data.map(d => ({
    day: d.day || "",
    steps: d.steps ?? 0,
    calories: d.calories ?? 0,
    heart: d.heart ?? 0,
    water: d.water ?? 0,
  }));

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Weekly Fitness Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={safeData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              switch (name) {
                case "steps": return [`${value}`, "Steps"];
                case "calories": return [`${value} kcal`, "Calories"];
                case "heart": return [`${value} bpm`, "Heart Rate"];
                case "water": return [`${value.toFixed(1)} L`, "Water"];
                default: return [value, name];
              }
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="steps" stroke="#1E40AF" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="calories" stroke="#F59E0B" />
          <Line type="monotone" dataKey="heart" stroke="#EF4444" />
          <Line type="monotone" dataKey="water" stroke="#10B981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}