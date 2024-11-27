const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conexão bem sucedida!');
    
    // Testa permissões
    const result = await client.query('SELECT * FROM users LIMIT 1');
    console.log('Permissão de leitura OK');
    
    // Testa inserção
    await client.query('BEGIN');
    await client.query(`
      INSERT INTO users (name, email, password_hash, user_level)
      VALUES ($1, $2, $3, $4)
    `, ['Test User', 'test@test.com', 'hash', 'user']);
    await client.query('ROLLBACK');
    console.log('Permissão de escrita OK');
    
    client.release();
  } catch (err) {
    console.error('Erro ao testar conexão:', err);
  } finally {
    pool.end();
  }
}

testConnection();
