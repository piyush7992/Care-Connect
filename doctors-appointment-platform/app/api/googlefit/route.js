import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) throw new Error("No access token provided");

    const endTimeMillis = Date.now();
    const startTimeMillis = endTimeMillis - 7 * 24 * 60 * 60 * 1000;

    const body = {
      aggregateBy: [
        { dataTypeName: "com.google.step_count.delta" },
        { dataTypeName: "com.google.calories.expended" },
        { dataTypeName: "com.google.heart_rate.bpm" },
        { dataTypeName: "com.google.hydration" },
      ],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis,
      endTimeMillis,
    };

    const response = await fetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Fit API Error:", errorText);
      throw new Error(`Google Fit API error: ${errorText}`);
    }

    const fitData = await response.json();

    const weeklyData =
      fitData.bucket?.map((b) => ({
        day: new Date(Number(b.startTimeMillis)).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        steps: b.dataset[0]?.point?.[0]?.value?.[0]?.intVal || 0,
        calories: b.dataset[1]?.point?.[0]?.value?.[0]?.fpVal || 0,
        heart: b.dataset[2]?.point?.[0]?.value?.[0]?.fpVal || 0,
        water: b.dataset[3]?.point?.[0]?.value?.[0]?.fpVal || 0,
      })) || [];

    const totals = weeklyData.reduce(
      (acc, d) => ({
        steps: acc.steps + d.steps,
        calories: acc.calories + d.calories,
        heart: d.heart, // latest heart rate
        water: acc.water + d.water,
      }),
      { steps: 0, calories: 0, heart: 0, water: 0 }
    );

    return NextResponse.json({ data: totals, weeklyData });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
