import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'portfolio_db',
      multipleStatements: true,
    });

    console.log('✅ Connected to database!\n');

    // Read and execute schema
    console.log('📄 Importing schema.sql...');
    const schemaPath = path.join(__dirname, 'server', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schema);
    console.log('✅ Schema imported!\n');

    // Read and execute seed data
    console.log('📄 Importing seed.sql...');
    const seedPath = path.join(__dirname, 'server', 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seed);
    console.log('✅ Seed data imported!\n');

    // Verify
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Created tables:');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`   ✅ ${tableName} (${count[0].count} rows)`);
    }

    await connection.end();

    console.log('\n🎉 Database setup complete!');
    console.log('\n📝 Default admin credentials:');
    console.log('   Username: rangz');
    console.log('   Password: rangzadmin05\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.sql) {
      console.error('SQL:', error.sql.substring(0, 200) + '...');
    }
    process.exit(1);
  }
}

setupDatabase();
