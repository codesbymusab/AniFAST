import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") ?? "popular"; // Default filter
  const limit = parseInt(searchParams.get("limit") ?? "10", 10); // Default limit
  console.log(filter);
  try {
    const pool = await connectDB();

    let query = "SELECT TOP " + limit + " AnimeID,Title,Episodes,Status,Rating,CoverImage FROM Anime";

    if (filter === "new") {
      query += " WHERE ReleaseDate >= DATEADD(month, -6, GETDATE()) OR Status='RELEASING'"; // Anime released in last 6 months
    } else if (filter === "popular") {
      query += "";
    } else if (filter === "top-rated") {
      query += " ORDER BY Rating DESC";
    } else if (filter.includes("recommendation1")) {
      const email = filter.replace("recommendation1", "").trim();
      query = `
      SELECT TOP 6 
          FA.AnimeID, FA.Title, FA.Episodes, FA.Status, FA.Rating, FA.CoverImage, FA.Name,
          FA.GenreMatchCount, FA.TagMatchCount
      FROM (
         
          SELECT 
              A.AnimeID, A.Title, A.Episodes, A.Status, A.Rating, A.CoverImage, S.Name,
              COUNT(DISTINCT AG.GenreID) AS GenreMatchCount,
              COUNT(DISTINCT AT.TagID) AS TagMatchCount
          FROM Anime AS A
          JOIN Studios AS S ON A.StudioID = S.StudioID
          LEFT JOIN Watchlist AS W ON A.AnimeID = W.AnimeID AND W.Email = '${email}'
          JOIN AnimeGenres AG ON A.AnimeID = AG.AnimeID
          JOIN AnimeTags AT ON A.AnimeID = AT.AnimeID
          WHERE EXISTS (
              SELECT 1 FROM AnimeGenres WHERE AnimeID IN (
                  SELECT AnimeID FROM Watchlist WHERE Email = '${email}'
              ) AND GenreID = AG.GenreID
          )
          AND EXISTS (
              SELECT 1 FROM AnimeTags WHERE AnimeID IN (
                  SELECT AnimeID FROM Watchlist WHERE Email ='${email}'
              ) AND TagID = AT.TagID
          )
          AND W.AnimeID IS NULL
          GROUP BY A.AnimeID, A.Title, A.Episodes, A.Status, A.Rating, A.CoverImage, S.Name
      ) AS FA  
      WHERE FA.GenreMatchCount >= 6 AND FA.TagMatchCount >= 6
      ORDER BY (FA.GenreMatchCount * 2 + FA.TagMatchCount * 1.5) DESC;
      
`;
    } else if (filter.includes("recommendation2")) {
      const email = filter.replace("recommendation2", "").trim();
      query = `
SELECT TOP 6 A.AnimeID, A.Title, A.Episodes, A.Status, A.Rating, A.CoverImage, S.Name,
   COUNT(DISTINCT G.GenreID) AS GenreMatchCount,
   COUNT(DISTINCT T.TagID) AS TagMatchCount
FROM Anime AS A
JOIN Studios AS S ON A.StudioID = S.StudioID
LEFT JOIN Favorites AS F ON A.AnimeID = F.AnimeID AND F.Email = '${email}'
JOIN AnimeGenres AG ON A.AnimeID = AG.AnimeID
JOIN AnimeTags AT ON A.AnimeID = AT.AnimeID
JOIN Genres G ON AG.GenreID = G.GenreID
JOIN Tags T ON AT.TagID = T.TagID
WHERE G.GenreID IN (
SELECT GenreID FROM AnimeGenres 
WHERE AnimeID IN (SELECT AnimeID FROM Favorites WHERE Email = '${email}')
)
AND T.TagID IN (
SELECT TagID FROM AnimeTags
WHERE AnimeID IN (SELECT AnimeID FROM Favorites WHERE Email = '${email}')
)
AND F.AnimeID IS NULL
GROUP BY A.AnimeID, A.Title, A.Episodes, A.Status, A.Rating, A.CoverImage, S.Name
HAVING COUNT(DISTINCT G.GenreID) >= 3 AND COUNT(DISTINCT T.TagID) >= 3
ORDER BY (COUNT(DISTINCT G.GenreID) * 2 + COUNT(DISTINCT T.TagID) * 1.5) DESC;
`;

    } else if (filter.includes("recommendation3")) {
      const email = filter.replace("recommendation3", "").trim();
      query = `

  SELECT A.AnimeID, Title, Episodes, Status, Rating, CoverImage, S.Name 
  FROM Users AS U
  JOIN Watchlist AS W ON W.Email = U.Email
  JOIN Anime AS A ON A.AnimeID = W.AnimeID
  JOIN Studios AS S ON A.StudioID = S.StudioID
  WHERE W.Email IN (
Select FriendEmail from Friends
Where UserEmail='${email}')
AND A.AnimeID NOT IN (
SELECT A.AnimeID 
  FROM Users AS U
  JOIN Watchlist AS W ON W.Email = U.Email
  JOIN Anime AS A ON A.AnimeID = W.AnimeID
  
  WHERE W.Email='${email}'
)
`;



    } else if (filter.includes("watchlist")) {
      const email = filter.replace("watchlist", "").trim();

      query = `SELECT A.AnimeID, Title, Episodes, Status, Rating, CoverImage, S.Name 
               FROM Users AS U
               JOIN Watchlist AS W ON W.Email = U.Email
               JOIN Anime AS A ON A.AnimeID = W.AnimeID
               JOIN Studios AS S ON A.StudioID = S.StudioID
               WHERE W.Email='${email}'`;

    } else if (filter.includes("favorites")) {
      const email = filter.replace("favorites", "").trim();

      query = `Select A.AnimeID,Title,Episodes,Status,Rating,CoverImage,S.Name from Users AS U
            JOIN Favorites AS F ON F.Email=U.Email
            Join Anime AS A ON A.AnimeID=F.AnimeID
            Join Studios AS S ON A.StudioID=S.StudioID
             WHERE F.Email='${email}'`;
    }



    const result = await pool.request().query(query);

    return NextResponse.json(result.recordset ?? []);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
