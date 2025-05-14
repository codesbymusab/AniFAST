import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import sql from "mssql";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 20;
    
    const pool = await connectDB();
    
    if (!pool || !pool.connected) {
      return NextResponse.json(
        { error: "Database connection failed." },
        { status: 500 }
      );
    }

    const result = await pool.request()
      .input("limit", sql.Int, limit)
      .query(`
        SELECT TOP (@limit)
          p.PostID,
          p.Email,
          p.Title,
          p.Content,
          p.LikeCount,
          p.Timestamp,
          u.Username,
          u.PfpNum
        FROM 
          Posts p
        INNER JOIN 
          Users u ON p.Email = u.Email
        ORDER BY 
          p.Timestamp DESC
      `);
    
    const posts = result.recordset.map(post => ({
      id: post.PostID,
      user: {
        name: post.Username,
        image: `/images/pfp${post.PfpNum}.png`
      },
      title: post.Title,
      content: post.Content,
      createdAt: post.Timestamp,
      likes: post.LikeCount,
      comments: 0
    }));

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Unable to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, email } = await request.json();
    
    if (!title || !content || !email) {
      return NextResponse.json(
        { error: "Title, content, and email are required" },
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
      .input("email", sql.VarChar, email)
      .input("title", sql.VarChar, title)
      .input("content", sql.Text, content)
      .input("timestamp", sql.DateTime, new Date())
      .query(`
        INSERT INTO Posts (Email, Title, Content, LikeCount, Timestamp)
        VALUES (@email, @title, @content, 0, @timestamp);
        
        SELECT SCOPE_IDENTITY() AS PostID;
      `);
    
    const postId = result.recordset[0].PostID;
    
    const userResult = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`SELECT Username, PfpNum FROM Users WHERE Email = @email`);
    
    const user = userResult.recordset[0];
    
    return NextResponse.json({
      id: postId,
      user: {
        name: user.Username,
        image: `/images/pfp${user.PfpNum}.png`
      },
      title,
      content,
      createdAt: new Date(),
      likes: 0,
      comments: 0
    });

  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Unable to create post" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { postId } = await request.json();
    
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
    
    await pool.request()
      .input("postId", sql.Int, postId)
      .query(`
        UPDATE Posts
        SET LikeCount = LikeCount + 1
        WHERE PostID = @postId
      `);
    
    const result = await pool.request()
      .input("postId", sql.Int, postId)
      .query(`
        SELECT LikeCount
        FROM Posts
        WHERE PostID = @postId
      `);
    
    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ likes: result.recordset[0].LikeCount });
    
  } catch (error: any) {
    console.error("Error updating like count:", error);
    return NextResponse.json(
      { error: "Unable to update like count" },
      { status: 500 }
    );
  }
}