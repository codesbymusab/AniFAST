import { NextResponse } from "next/server";
import { connectDB } from "@/server/db"; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const AnimeID = parseInt(searchParams.get("animeid") ?? "1"); // Default to ID 1 if missing

  try {
    const pool = await connectDB();

    const query = `
     SELECT 
    A.AnimeID,
    A.Title,
    A.JapaneseTitle,
    A.CoverImage,
    A.Synopsis,
    A.Rating,
    A.Episodes,
    CAST(A.ReleaseDate AS NVARCHAR(MAX)) AS ReleaseDate,
    A.Status,
    S.Name AS Studio,
    S.Website,
    (SELECT STRING_AGG(Name, ', ') 
     FROM (SELECT DISTINCT G.Name 
           FROM AnimeGenres AG 
           INNER JOIN Genres G ON AG.GenreID = G.GenreID 
           WHERE AG.AnimeID = A.AnimeID) AS UniqueGenres) AS Genres,
    (SELECT STRING_AGG(Name, ', ') 
     FROM (SELECT DISTINCT T.Name 
           FROM AnimeTags AT 
           INNER JOIN Tags T ON AT.TagID = T.TagID 
           WHERE AT.AnimeID = A.AnimeID) AS UniqueTags) AS Tags
FROM Anime AS A
JOIN Studios AS S ON A.StudioID = S.StudioID
WHERE A.AnimeID = @AnimeID;

    `;

    // Use parameterized query to prevent SQL injection
    const result = await pool.request().input("AnimeID", AnimeID).query(query);

    if (!result.recordset.length) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }
   
    return NextResponse.json(result.recordset[0]); // Return only the first matching anime
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return NextResponse.json({ error: "Failed to fetch anime data" }, { status: 500 });
  }
}
