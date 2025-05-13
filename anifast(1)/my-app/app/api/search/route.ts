import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import sql from "mssql";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Try to connect to the DB
    const pool: sql.ConnectionPool | undefined = await connectDB();

    // Safely handle undefined or disconnected pool
    if (!pool || !pool.connected) {
      return NextResponse.json(
        { error: "Database connection failed." },
        { status: 500 }
      );
    }

    const searchPattern = `%${query}%`;

    const result = await pool
      .request()
      .input("searchTerm", sql.VarChar, searchPattern)
      .query(`
        SELECT DISTINCT 
          a.AnimeID, a.Title, a.JapaneseTitle, a.Synopsis, a.CoverImage, 
          a.Episodes, a.Status, a.Rating, a.ReleaseDate, a.Type,
          (
            SELECT STRING_AGG(g.Name, ', ') 
            FROM AnimeGenres ag 
            JOIN Genres g ON ag.GenreID = g.GenreID 
            WHERE ag.AnimeID = a.AnimeID
          ) AS Genres
        FROM Anime a
        LEFT JOIN AnimeGenres ag ON a.AnimeID = ag.AnimeID
        LEFT JOIN Genres g ON ag.GenreID = g.GenreID
        WHERE a.Title LIKE @searchTerm 
           OR a.JapaneseTitle LIKE @searchTerm
           OR g.Name LIKE @searchTerm
        ORDER BY a.Rating DESC
      `);

    const animes = result.recordset.map(anime => ({
      ...anime,
      genres: anime.Genres ? anime.Genres.split(', ') : [],
    }));

    return NextResponse.json(animes);
  } catch (error: any) {
    console.error("Error during anime search:", error);
    return NextResponse.json(
      { error: "Unable to search anime." },
      { status: 500 }
    );
  }
}
