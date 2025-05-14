import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get("animeid");

  // Return a 400 error if no anime ID is provided.
  if (!animeId) {
    return NextResponse.json({ error: "Anime ID is required." }, { status: 400 });
  }
  let query;
  if(animeId.includes("user")){
    const email = animeId.replace("user", "").trim();
    query=`SELECT TOP 4 U.Username,A.Title,R.* FROM Reviews AS R
 Join Anime AS A ON A.AnimeID=R.AnimeID
 Join Users AS U ON U.Email=R.UserEmail
 WHERE UserEmail='${email}'`

  }
  else if (animeId == '0') {
    query = `SELECT TOP 6 U.Username,A.Title,R.* FROM Reviews AS R
 Join Anime AS A ON A.AnimeID=R.AnimeID
 Join Users AS U ON U.Email=R.UserEmail`;
  }
  else {
    query = `SELECT U.Username,R.* FROM Reviews AS R
 Join Users AS U ON U.Email=R.UserEmail WHERE AnimeID = @AnimeID`;
  }
  try {
    const pool = await connectDB();

    // Use parameterized queries to prevent SQL injection
    const result = await pool.request()
      .input("AnimeID", animeId)
      .query(query);

    return NextResponse.json(result.recordset ?? []);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
