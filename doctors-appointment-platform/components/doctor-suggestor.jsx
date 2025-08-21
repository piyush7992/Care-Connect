"use client";
import { useState } from "react";

export default function DoctorSuggestor() {
  const [symptoms, setSymptoms] = useState("");
  const [suggestions, setSuggestions] = useState("");

  async function handleSuggest() {
    const res = await fetch("/api/suggest-doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    const data = await res.json();
    setSuggestions(data.suggestions);
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Enter your symptoms..."
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleSuggest}
        className="mt-2 bg-blue-600 text-black px-4 py-2 rounded"
      >
        Suggest Doctor
      </button>

      {suggestions && (
        <div className="mt-4 bg-black-100 p-3 rounded">
          <h2 className="font-bold text-lg">Top 3 Suggestions:</h2>
          <pre>{suggestions}</pre>
        </div>
      )}
    </div>
  );
}