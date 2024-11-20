const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

// Middleware para verificar autenticação
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  console.log('Token recebido:', token ? 'Presente' : 'Ausente');
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Verifique o token aqui se necessário
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar usuários
router.get('/', async (req, res) => {
  console.log('Requisição GET /users recebida');
  
  try {
    const result = await pool.query(`
	SELECT 
        u.id,
        u.name,
        u.username,
        u.email,
        u.phone,
        u.level_id,
        ul.name as level_name
      FROM users u
      LEFT JOIN user_levels ul ON u.level_id = ul.id
      ORDER BY u.name
	    `
    );
    
    console.log('Usuários encontrados:', result.rowCount);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// Criar usuário
router.post('/', async (req, res) => {
  console.log('Requisição POST /users recebida');
  console.log('Dados recebidos:', req.body);
  const { name, email, username, phone, level_id, password } = req.body;

  try {
    // Verificar se usuário já existe
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      const existingUser = userExists.rows[0];
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'E-mail já está em uso' });
      }
      return res.status(400).json({ message: 'Nome de usuário já existe' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir novo usuário
    const result = await pool.query(
      `INSERT INTO users (name, email, username, phone, level_id, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, username, phone, level_id`,
      [name, email, username, phone, level_id, hashedPassword]
    );

    console.log('Usuário criado com sucesso:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    if (error.code === '23505') { // Violação de unique
      res.status(400).json({ message: 'Usuário ou e-mail já existem' });
    } else {
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  }
});

// Excluir usuário
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
});

// Atualizar senha
router.patch('/:id/password', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ message: 'Erro ao atualizar senha' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, username, phone, level_id, password } = req.body;

  try {
    // Início da transação
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Primeiro, verifica se o email ou username já existem para outro usuário
      const checkExisting = await client.query(
        `SELECT id FROM users 
         WHERE (email = $1 OR username = $2) AND id != $3`,
        [email, username, id]
      );

      if (checkExisting.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          message: 'Email ou nome de usuário já está em uso por outro usuário' 
        });
      }

      // Preparar a query de atualização
      let query = `
        UPDATE users 
        SET name = $1, 
            email = $2, 
            username = $3, 
            phone = $4, 
            level_id = $5
      `;
      let values = [name, email, username, phone, level_id];

      // Se uma nova senha foi fornecida, adiciona à atualização
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += `, password_hash = $${values.length + 1}`;
        values.push(hashedPassword);
      }

      // Adiciona a condição WHERE e RETURNING
      query += ` WHERE id = $${values.length + 1} RETURNING id, name, email, username, phone, level_id`;
      values.push(id);

      // Executa a atualização
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      await client.query('COMMIT');
      res.json(result.rows[0]);

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    
    if (error.code === '23505') { // Violação de unique
      res.status(400).json({ message: 'Email ou nome de usuário já existe' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
  }
});

module.exports = router;
