import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("userEmail");

  // Return a 400 error if no email is provided.
  if (!userEmail) {
    return NextResponse.json({ error: "User Email is required." }, { status: 400 });
  }
  const query=`SELECT U.UserID,U.Username,U.PfpNum,F.STATUS FROM FRIENDS AS F
JOIN USERS AS U ON F.FriendEmail=U.Email
WHERE F.UserEmail='${userEmail}'`;

  try {
    const pool = await connectDB();

    // Use parameterized queries to prevent SQL injection
    const result = await pool.request()
      .query(query);

    return NextResponse.json(result.recordset ?? []);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
