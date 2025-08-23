"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EventsDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Events</h1>
        <Link href="/events/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add New Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p className="text-gray-500">No events yet.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow hover:shadow-lg">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-700">{event.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                📍 {event.location || "No location"}
              </p>
              <p className="text-sm text-gray-500">
                🗓 {event.startsAt ? new Date(event.startsAt).toLocaleString() : "TBD"} - {event.endsAt ? new Date(event.endsAt).toLocaleString() : "TBD"}
              </p>
              <p className="text-sm text-gray-500">👥 Capacity: {event.capacity ?? "Unlimited"}</p>
              <p className={`text-sm font-medium mt-2 ${event.isPublished ? "text-green-600" : "text-red-600"}`}>
                {event.isPublished ? "Published" : "Draft"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Organizer: {event.organizer?.name || "Unknown"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
