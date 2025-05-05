import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { animeId, userEmail } = body;

    console.log("User Email:", userEmail);
    console.log("Anime ID:", animeId);

    if (!animeId || !userEmail) {
      return NextResponse.json({ error: "Missing animeId or userEmail" }, { status: 400 });
    }

    const pool = await connectDB();

    await pool.request()
      .input("userEmail", userEmail) // Parameter name now matches query
      .input("AnimeId", animeId)
      .query("INSERT INTO Watchlist (AnimeId, Email) VALUES (@AnimeId, @userEmail)");

    return NextResponse.json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json({ error: "Failed to add to favorites" }, { status: 500 });
  }
}
