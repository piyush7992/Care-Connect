// utils/fetchSteps.js
export async function fetchStepData() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  const response = await gapi.client.request({
    path: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    method: "POST",
    body: {
      aggregateBy: [
        {
          dataTypeName: "com.google.step_count.delta",
          dataSourceId:
            "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
        },
      ],
      bucketByTime: { durationMillis: 60000 }, // 1-minute buckets
      startTimeMillis: oneHourAgo,
      endTimeMillis: now,
    },
  });

  return response.result.bucket.map((bucket) => {
    const steps = bucket.dataset[0].point[0]?.value[0]?.intVal || 0;
    const time = new Date(
      parseInt(bucket.startTimeMillis)
    ).toLocaleTimeString();
    return { time, steps };
  });
}
