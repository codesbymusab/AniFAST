
import "dotenv/config";
import sql, { config as SqlConfig } from "mssql";

const config: SqlConfig = {
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  server: process.env.DB_SERVER ?? "",
  database: process.env.DB_NAME ?? "",
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false,
  },
};

export async function connectDB() {
  try {
    const pool = await sql.connect(config);

    console.log("Connected to Azure SQL Database");
    return pool;
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
