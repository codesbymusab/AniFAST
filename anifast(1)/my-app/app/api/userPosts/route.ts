//File: app\api\userPosts\route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import sql from "mssql";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
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
    
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT 
          p.PostID as id,
          p.Title as title,
          p.Content as content,
          p.LikeCount as likes,
          p.Timestamp as timestamp,
          u.Username as username,
          u.PfpNum as pfpNum,
          (SELECT COUNT(*) FROM Comments c WHERE c.PostID = p.PostID) AS comments
        FROM 
          Posts p
        INNER JOIN
          Users u ON p.Email = u.Email
        WHERE
          p.Email = @email
        ORDER BY
          p.Timestamp DESC
      `);
        
    const posts = result.recordset.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      likes: post.likes,
      timestamp: post.timestamp,
      comments: post.comments
    }));
    
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Unable to fetch user posts" },
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
                
        SELECT SCOPE_IDENTITY() AS id;
      `);
        
    const postId = result.recordset[0].id;
    
    return NextResponse.json({
      id: postId,
      title,
      content,
      timestamp: new Date(),
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