//File: app\api\likes\route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import sql from "mssql";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const email = searchParams.get("email");
    
    if (!postId || !email) {
      return NextResponse.json(
        { error: "Post ID and email are required" },
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

    const result = await pool.request()
      .input("postId", sql.Int, parseInt(postId))
      .input("email", sql.VarChar, email)
      .query(`
        SELECT 1 AS hasLiked
        FROM Likes
        WHERE PostID = @postId AND Email = @email
      `);
    
    const hasLiked = result.recordset.length > 0;

    return NextResponse.json({ hasLiked });
  } catch (error: any) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      { error: "Unable to check like status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { postId, email } = await request.json();
    
    if (!postId || !email) {
      return NextResponse.json(
        { error: "Post ID and email are required" },
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
    
    const checkResult = await pool.request()
      .input("postId", sql.Int, postId)
      .input("email", sql.VarChar, email)
      .query(`
        SELECT 1 FROM Likes
        WHERE PostID = @postId AND Email = @email
      `);
    
    const hasLiked = checkResult.recordset.length > 0;
    
    if (hasLiked) {
      await pool.request()
        .input("postId", sql.Int, postId)
        .input("email", sql.VarChar, email)
        .query(`
          DELETE FROM Likes
          WHERE PostID = @postId AND Email = @email
        `);
    } else {
      await pool.request()
        .input("postId", sql.Int, postId)
        .input("email", sql.VarChar, email)
        .input("timestamp", sql.DateTime, new Date())
        .query(`
          INSERT INTO Likes (PostID, Email, Timestamp)
          VALUES (@postId, @email, @timestamp)
        `);
    }
    
    const countResult = await pool.request()
      .input("postId", sql.Int, postId)
      .query(`
        SELECT COUNT(*) AS LikeCount
        FROM Likes
        WHERE PostID = @postId
      `);
    
    await pool.request()
      .input("postId", sql.Int, postId)
      .input("likeCount", sql.Int, countResult.recordset[0].LikeCount)
      .query(`
        UPDATE Posts
        SET LikeCount = @likeCount
        WHERE PostID = @postId
      `);
    
    return NextResponse.json({
      likes: countResult.recordset[0].LikeCount,
      hasLiked: !hasLiked
    });
    
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Unable to toggle like" },
      { status: 500 }
    );
  }
}