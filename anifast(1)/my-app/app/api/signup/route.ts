// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;
    console.log("API Signup:", { email, username, password }); // Log on server-side

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the MSSQL database
    const pool = await connectDB();

    // Use OUTPUT clause so that the inserted UserID is returned.
    const result = await pool.request()
      .input("email", email)
      .input("username", username)
      .input("password", password)
      .query(
        `INSERT INTO USERS (Email, Username, PasswordHash) 
         OUTPUT inserted.UserID
         VALUES (@email, @username, @password);`
      );

    // Check if we got a result back
    if (!result.recordset || result.recordset.length === 0) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    const newUserId = result.recordset[0].UserID;
    console.log("New user inserted with ID:", newUserId);

    return NextResponse.json({ id: newUserId, email, username });
  } catch (error: any) {
    console.error("Error during sign-up:", error);
    return NextResponse.json(
      { error: "Unable to sign up user." },
      { status: 500 }
    );
  }
}
