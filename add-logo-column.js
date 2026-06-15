import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
  });
  
  try {
    await db.query(`ALTER TABLE experiences ADD COLUMN logo_icon VARCHAR(100) DEFAULT 'work'`);
    console.log("Column added successfully.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists.");
    } else {
      console.error(err);
    }
  }
  await db.end();
}
run();
