// dashboard/page.jsx
"use client"; // only if you need client-side features

import React from "react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 text-center text-gray-500" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // full viewport height
        width: "80vw",  // full viewport width
        textAlign: "center",
      }}>
      <h1 style={{ fontSize: "3vw", lineHeight: 1 }}>Nothing has been enlisted here as of now.</h1>
    </div>
  );
}
