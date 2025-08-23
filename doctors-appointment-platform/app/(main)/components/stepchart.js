// components/StepChart.js
import { Line } from "react-chartjs-2";

export default function StepChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: "Steps",
        data: data.map((d) => d.steps),
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
}
