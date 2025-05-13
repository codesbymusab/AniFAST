import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function POST(request: Request) {
  try {
    // Parse JSON body from the request
    const body = await request.json();
    console.log("Request Body:", body);
    const { AnimeId, UserEmail, Avatar, Rating, Content, ReviewDate } = body;
    let animeId = body.AnimeId || body.id;
     console.log("Extracted animeId:", animeId);
    // Validate required fields
    if (!AnimeId || !UserEmail || !Avatar || !Rating || !Content ||!ReviewDate) {
      return NextResponse.json(
        { error: "Missing one or more review fields" },
        { status: 400 }
      );
    }

  
    const pool = await connectDB();
    // Insert the review into the Reviews table and return the inserted review id
    const result = await pool
      .request()
      .input("AnimeId", AnimeId)
      .input("Useremail", UserEmail)
      .input("Avatar", Avatar)
      .input("Rating", Rating)
      .input("Content", Content)
      .input("ReviewDate", ReviewDate)
      .query(
        `INSERT INTO Reviews (AnimeId, UserEmail, Avatar, Rating, Content, ReviewDate)
         VALUES (@AnimeId, @Useremail, @Avatar, @Rating, @Content, @ReviewDate);`
        
      );

    return NextResponse.json({
      //message: "Review added successfully",
      review: { AnimeId, UserEmail, Avatar, Rating, Content, ReviewDate }
    });
  } catch (error: any) {
    console.error("Error posting review:", error);
    return NextResponse.json(
      { error: "Failed to post review", details: error.message },
      { status: 500 }
    );
  }
}
