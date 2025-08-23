"use client";
import WeeklyChart from "./weeklychart";

export default function FitnessDashboardUI({ data, weeklyData }) {
  const safeWater = data?.water ?? 0;

  return (
    <div className="p-6 min-h-screen bg-black-100">
      <h1 className="text-2xl font-bold mb-6">Fitness Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 shadow rounded-2xl text-center">
          <p className="font-semibold">Steps</p>
          <p className="text-2xl font-bold">{Math.round(data?.steps ?? 0)}</p>
        </div>
        <div className="p-4 shadow rounded-2xl text-center">
          <p className="font-semibold">Calories</p>
          <p className="text-2xl font-bold">{Math.round(data?.calories ?? 0)} kcal</p>
        </div>
        <div className="p-4 shadow rounded-2xl text-center">
          <p className="font-semibold">Water</p>
          <p className="text-2xl font-bold">{safeWater.toFixed(1)} L</p>
        </div>
        <div className="p-4 shadow rounded-2xl text-center">
          <p className="font-semibold">Heart Rate</p>
          <p className="text-2xl font-bold">{Math.round(data?.heart ?? 0)} bpm</p>
        </div>
      </div>

      {weeklyData?.length > 0 && <WeeklyChart data={weeklyData} />}
    </div>
  );
}