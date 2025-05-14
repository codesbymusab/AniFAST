//File: app\api\user\route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import sql from "mssql";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const pool = await connectDB();
    
    if (!pool || !pool.connected) {
      return NextResponse.json(
        { error: "Database connection failed." },
        { status: 500 }
      );
    }

    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT 
          Username as name, 
          Email as email,
          Bio as bio,
          PfpNum as pfpNum
        FROM Users 
        WHERE Email = @email
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.recordset[0]);
  } catch (error: any) {
    console.error("User API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { email, bio } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const pool = await connectDB();
    
    if (!pool || !pool.connected) {
      return NextResponse.json(
        { error: "Database connection failed." },
        { status: 500 }
      );
    }

    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("bio", sql.VarChar, bio)
      .query(`
        UPDATE Users
        SET Bio = @bio
        WHERE Email = @email
      `);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update Bio Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}