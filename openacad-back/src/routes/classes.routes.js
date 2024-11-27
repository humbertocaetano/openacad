const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Listar todas as turmas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.year_id,
        c.division_id,
        c.active,
        sy.name as year_name,
        cd.name as division_name
      FROM classes c
      JOIN school_years sy ON c.year_id = sy.id
      JOIN class_divisions cd ON c.division_id = cd.id
      ORDER BY sy.name, cd.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    res.status(500).json({ message: 'Erro ao buscar turmas' });
  }
});

// Listar anos escolares
router.get('/years', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM school_years ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar anos escolares:', error);
    res.status(500).json({ message: 'Erro ao buscar anos escolares' });
  }
});

// Listar divisões
router.get('/divisions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM class_divisions ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar divisões:', error);
    res.status(500).json({ message: 'Erro ao buscar divisões' });
  }
});

// Criar turma
router.post('/', async (req, res) => {
  const { year_id, division_id, active } = req.body;

  try {
    // Verificar se a combinação já existe
    const existingClass = await pool.query(
      'SELECT id FROM classes WHERE year_id = $1 AND division_id = $2',
      [year_id, division_id]
    );

    if (existingClass.rows.length > 0) {
      return res.status(400).json({ message: 'Esta turma já existe' });
    }

    const result = await pool.query(
      `INSERT INTO classes (year_id, division_id, active)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [year_id, division_id, active !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar turma:', error);
    res.status(500).json({ message: 'Erro ao criar turma' });
  }
});

// Atualizar turma
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { year_id, division_id, active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE classes
       SET year_id = $1, division_id = $2, active = $3
       WHERE id = $4
       RETURNING *`,
      [year_id, division_id, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    res.status(500).json({ message: 'Erro ao atualizar turma' });
  }
});

// Excluir turma
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM classes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    res.json({ message: 'Turma excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir turma:', error);
    res.status(500).json({ message: 'Erro ao excluir turma' });
  }
});

// Atualizar status da turma
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const result = await pool.query(
      'UPDATE classes SET active = $1 WHERE id = $2 RETURNING *',
      [active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar status da turma:', error);
    res.status(500).json({ message: 'Erro ao atualizar status da turma' });
  }
});

router.get('/divisions/:yearId', async (req, res) => {
  const { yearId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT DISTINCT cd.id, cd.name
       FROM class_divisions cd
       JOIN classes c ON c.division_id = cd.id
       WHERE c.year_id = $1
       ORDER BY cd.name`,
      [yearId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
});

module.exports = router;
