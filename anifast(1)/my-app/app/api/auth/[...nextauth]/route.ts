import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/server/db"; // Assumes connectDB returns a pool connection
import "dotenv/config";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "text", 
          placeholder: "example@email.com" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: { body?: any; query: any; headers: any; method: string }
      ): Promise<{ id: number; name: string; email: string } | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          // Connect to the Microsoft SQL Server database
          const pool = await connectDB();

          // Execute a parameterized query to prevent SQL injection.
          // Adjust the input types as necessary, e.g., using mssql.VarChar if needed.
          const result = await pool.request()
            .input("email", credentials.email)
            .input("password", credentials.password)
            .query(
              `SELECT * FROM USERS WHERE Email = @email AND PasswordHash = @password`
            );

          // If a user is found, return the user object.
          if (result.recordset && result.recordset.length > 0) {
            const user = result.recordset[0];
            
            // Ensure the returned object matches the session shape.
            return {
              id: user.UserID,        
              name: user.Username,        
              email: user.Email,    
                
            };
          }

          // If no matching user exists, return null.
          return null;
        } catch (error: any) {
          console.error("Database error during authentication:", error);
          throw new Error("Database error: " + error.message);
        }
      }
    })
  ],
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
