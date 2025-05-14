//File: app\api\pfp\route.ts

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
      .input("email", sql.NVarChar(255), email)
      .query("SELECT PfpNum FROM Users WHERE Email = @email");
    
    const pfpNum = result.recordset[0]?.PfpNum || 1;
    return NextResponse.json({ pfpNum });
  } catch (error: any) {
    console.error("PFP API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { email, pfpNum } = await request.json();
    
    if (!email || !pfpNum) {
      return NextResponse.json(
        { error: "Email and pfpNum are required" },
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
      .input("email", sql.NVarChar(255), email)
      .input("pfpNum", sql.Int, pfpNum)
      .query("UPDATE Users SET PfpNum = @pfpNum WHERE Email = @email");
    
    return NextResponse.json({ success: true, pfpNum });
  } catch (error: any) {
    console.error("PFP Update API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
