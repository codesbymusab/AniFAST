import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") ?? "popular"; // Default filter
  const limit = parseInt(searchParams.get("limit") ?? "10", 10); // Default limit

  try {
    const pool = await connectDB();
    
    let query = "SELECT TOP " + limit + " * FROM Anime";

    if (filter === "new") {
      query += " WHERE ReleaseDate >= DATEADD(month, -6, GETDATE())"; // Anime released in last 6 months
    } else if (filter === "popular") {
      query += ""; 
    } else if (filter === "top-rated") {
      query += " ORDER BY Rating DESC"; 
    }
   

    const result = await pool.request().query(query);

    return NextResponse.json(result.recordset ?? []);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
