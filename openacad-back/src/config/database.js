// src/config/database.js
const { Pool } = require('pg');
const { config } = require('dotenv');

// Garante que as variáveis de ambiente sejam carregadas
config();

// Configuração mais detalhada do pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // número máximo de clientes no pool
  idleTimeoutMillis: 30000, // tempo máximo que um cliente pode ficar inativo no pool
  connectionTimeoutMillis: 2000, // tempo máximo para estabelecer uma conexão
});

// Função para testar a conexão
const setupDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Testando conexão com o banco de dados...');
    
    // Testa a conexão
    const res = await client.query('SELECT NOW()');
    console.log('Conexão com o banco de dados estabelecida em:', res.rows[0].now);
    
    // Testa se as tabelas existem
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Tabelas não encontradas. Iniciando criação das tabelas...');
      // Aqui você pode adicionar a lógica para criar as tabelas
      // ou alertar que é necessário executar as migrações
    }
    
    client.release();
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail
    });
    
    // Instruções detalhadas para resolução de problemas comuns
    if (error.code === 'ECONNREFUSED') {
      console.error(`
        Não foi possível conectar ao PostgreSQL. Verifique se:
        1. O PostgreSQL está instalado e rodando
        2. As configurações de host e porta estão corretas
        3. O firewall permite conexões na porta ${process.env.DB_PORT}
      `);
    } else if (error.code === '28P01') {
      console.error(`
        Senha incorreta. Verifique se:
        1. A senha no arquivo .env está correta
        2. O usuário tem permissão para acessar o banco de dados
      `);
    } else if (error.code === '3D000') {
      console.error(`
        Banco de dados '${process.env.DB_NAME}' não existe. Para criar:
        1. Execute: sudo -u postgres psql
        2. Digite: CREATE DATABASE ${process.env.DB_NAME};
        3. Digite: GRANT ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} TO ${process.env.DB_USER};
      `);
    }
    
    // Em ambiente de desenvolvimento, mantemos o servidor rodando
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Adiciona listeners para eventos do pool
pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente do pool:', err);
});

pool.on('connect', () => {
  console.log('Nova conexão estabelecida com o banco de dados');
});

pool.on('remove', () => {
  console.log('Cliente removido do pool');
});

module.exports = {
  pool,
  setupDatabase
};
