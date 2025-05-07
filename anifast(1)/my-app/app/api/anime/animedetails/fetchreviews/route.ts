import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get("animeid");

  // Return a 400 error if no anime ID is provided.
  if (!animeId) {
    return NextResponse.json({ error: "Anime ID is required." }, { status: 400 });
  }

  try {
    const pool = await connectDB();

    // Use parameterized queries to prevent SQL injection
    const result = await pool.request()
      .input("AnimeID", animeId)
      .query("SELECT * FROM Reviews WHERE AnimeID = @AnimeID");

    return NextResponse.json(result.recordset ?? []);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
