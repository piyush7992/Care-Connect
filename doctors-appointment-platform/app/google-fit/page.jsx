"use client";
import { useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import FitnessDashboardUI from "../dashboard/dashboard-ui";

export default function GoogleFitPage() {
  const [fitData, setFitData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);

  const login = useGoogleLogin({
    scope: [
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.heart_rate.read",
      "https://www.googleapis.com/auth/fitness.nutrition.read",
      "https://www.googleapis.com/auth/fitness.body.read"
    ].join(" "),
    onSuccess: async tokenResponse => {
      try {
        const res = await fetch("/api/googlefit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);

        setFitData(json.data);
        setWeeklyData(json.weeklyData);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    },
    onError: err => console.error("Login Error:", err),
  });

  if (!fitData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button
          onClick={() => login()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign in with Google Fit
        </button>
      </div>
    );
  }

  return <FitnessDashboardUI data={fitData} weeklyData={weeklyData} />;
}