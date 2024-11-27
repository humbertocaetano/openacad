const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Listar todos os níveis
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description FROM user_levels ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar níveis:', error);
    res.status(500).json({ message: 'Erro ao buscar níveis' });
  }
});

module.exports = router;

// Atualizar a rota de usuários (src/routes/users.routes.js)
// No método GET para listar usuários:
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.username, u.email, u.phone, 
             ul.id as level_id, ul.name as level_name
      FROM users u
      JOIN user_levels ul ON u.level_id = ul.id
      ORDER BY u.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// No método POST para criar usuário:
router.post('/', async (req, res) => {
  const { name, email, username, phone, level_id, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (name, email, username, phone, level_id, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, email, username, phone, level_id, hashedPassword]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // ... tratamento de erro existente ...
  }
});

// No método PUT para atualizar usuário:
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, username, phone, level_id, password } = req.body;
  
  try {
    let query = `
      UPDATE users 
      SET name = $1, email = $2, username = $3, phone = $4, level_id = $5
    `;
    let values = [name, email, username, phone, level_id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password_hash = $${values.length + 1}`;
      values.push(hashedPassword);
    }

    query += ` WHERE id = $${values.length + 1} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    // ... tratamento de erro existente ...
  }
});
