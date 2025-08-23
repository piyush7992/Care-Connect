"use client";
import React, { useState } from "react";
import GoogleFitAuth from "../google-fit/page";
import FitnessDashboardUI from "./dashboard-ui"; // your UI code

export default function FitnessDashboard() {
  const [fitData, setFitData] = useState(null);

  return (
    <div>
      {!fitData ? (
        <GoogleFitAuth onLogin={setFitData} />
      ) : (
        <FitnessDashboardUI data={fitData} />
      )}
      <FitnessDashboardUI data={fitData} weeklyData={weeklyData} />

    </div>
  );
}