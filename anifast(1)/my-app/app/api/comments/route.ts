import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import sql from "mssql";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
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
      .query(`
        SELECT 
          c.CommentID,
          c.Content,
          c.Timestamp,
          c.Email,
          u.Username,
          u.PfpNum
        FROM 
          Comments c
        INNER JOIN 
          Users u ON c.Email = u.Email
        WHERE 
          c.PostID = @postId
        ORDER BY 
          c.Timestamp ASC
      `);
    
    const comments = result.recordset.map(comment => ({
      id: comment.CommentID,
      content: comment.Content,
      createdAt: comment.Timestamp,
      user: {
        email: comment.Email,
        name: comment.Username,
        image: `/images/pfp${comment.PfpNum}.png`
      }
    }));

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Unable to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { postId, content, email } = await request.json();
    
    if (!postId || !content || !email) {
      return NextResponse.json(
        { error: "Post ID, content, and email are required" },
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
      .input("postId", sql.Int, postId)
      .input("email", sql.VarChar, email)
      .input("content", sql.Text, content)
      .input("timestamp", sql.DateTime, new Date())
      .query(`
        INSERT INTO Comments (PostID, Email, Content, Timestamp)
        VALUES (@postId, @email, @content, @timestamp);
        
        SELECT SCOPE_IDENTITY() AS CommentID;
      `);
    
    const commentId = result.recordset[0].CommentID;
    
    const userResult = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`SELECT Username, PfpNum FROM Users WHERE Email = @email`);
    
    const user = userResult.recordset[0];
    
    return NextResponse.json({
      id: commentId,
      content,
      createdAt: new Date(),
      user: {
        email,
        name: user.Username,
        image: `/images/pfp${user.PfpNum}.png`
      }
    });

  } catch (error: any) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Unable to create comment" },
      { status: 500 }
    );
  }
}