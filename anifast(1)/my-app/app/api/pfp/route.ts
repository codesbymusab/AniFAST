//File: app\api\pfp\route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import sql from "mssql"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("email", sql.NVarChar(255), email)
      .query("SELECT ProfilePicture FROM Users WHERE Email = @email");

    const pfp = result.recordset[0]?.ProfilePicture;

    return NextResponse.json({ pfp });
  } catch (error: any) {
    console.error("PFP API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
