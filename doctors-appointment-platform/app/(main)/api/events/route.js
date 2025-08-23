import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server"; // adjust if using different auth

const prisma = new PrismaClient();

// Create new event
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const organizer = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!organizer) {
      return NextResponse.json(
        { error: "Organizer not found in DB" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      startsAt,
      endsAt,
      location,
      capacity,
      isPublished,
    } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        location: location || null,
        capacity: capacity ? parseInt(capacity, 10) : null,
        isPublished: isPublished ?? false,
        organizerId: organizer.id, // auto-set
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}

// Fetch all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        organizer: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
