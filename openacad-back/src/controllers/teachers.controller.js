// src/controllers/teachers.controller.js
const { pool } = require('../config/database');

const getTeachers = async (req, res) => {
  console.log('Iniciando busca de professores');
  try {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email
      FROM users u
      JOIN user_levels ul ON u.level_id = ul.id
      WHERE ul.name = 'Professor(a)'
      ORDER BY u.name
    `;
    
    console.log('Executando query:', query);
    
    const result = await pool.query(query);
    
    console.log('Quantidade de professores encontrados:', result.rows.length);
    console.log('Dados dos professores:', result.rows);

    const teachers = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email
    }));

    res.json(teachers);
  } catch (error) {
    console.error('Erro detalhado ao buscar professores:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar professores',
      details: error.message 
    });
  }
};

module.exports = {
  getTeachers
};
