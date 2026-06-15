import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...\n');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ MySQL connection successful!\n');

    // Check if database exists
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME]);

    if (databases.length === 0) {
      console.log('⚠️  Database not found. Creating...');
      await connection.query(`CREATE DATABASE ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ Database '${process.env.DB_NAME}' created!\n`);
    } else {
      console.log(`✅ Database '${process.env.DB_NAME}' exists!\n`);
    }

    // Switch to our database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Check tables
    const [tables] = await connection.query('SHOW TABLES');

    console.log('📊 Tables in database:');
    if (tables.length === 0) {
      console.log('   ⚠️  No tables found!');
      console.log('\n   👉 Run these commands to setup:');
      console.log('      mysql -u root -p portfolio_db < server/schema.sql');
      console.log('      mysql -u root -p portfolio_db < server/seed.sql');
    } else {
      tables.forEach((table) => {
        const tableName = Object.values(table)[0];
        console.log(`   ✅ ${tableName}`);
      });

      // Check row counts
      console.log('\n📈 Row counts:');
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   ${tableName}: ${count[0].count} rows`);
      }
    }

    await connection.end();
    console.log('\n✅ Test complete!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Tips:');
    console.log('   1. Make sure MySQL is running');
    console.log('   2. Check DB_PASSWORD in .env file');
    console.log('   3. Verify MySQL credentials are correct\n');
    process.exit(1);
  }
}

testDatabase();
