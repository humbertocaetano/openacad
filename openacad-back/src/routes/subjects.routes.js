const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { getSubjects, getSubjectsForAllocation } = require('../controllers/subjects.controller');

router.get('/for-allocation', getSubjectsForAllocation);

router.get('/by-class', async (req, res) => {
  try {
    const yearId = parseInt(req.query.yearId);
    const divisionId = parseInt(req.query.divisionId);

    if (isNaN(yearId) || isNaN(divisionId)) {
      return res.status(400).json({ error: 'yearId e divisionId devem ser números válidos' });
    }

    console.log('Buscando disciplinas com yearId:', yearId, 'e divisionId:', divisionId);

    const result = await pool.query(
      `SELECT DISTINCT s.id, s.name
       FROM subjects s
       JOIN classes c ON s.year_id = c.year_id
       WHERE c.year_id = $1 
       AND c.division_id = $2
       AND s.active = true
       ORDER BY s.name`,
      [yearId, divisionId]
    );
    
    console.log('Disciplinas encontradas:', result.rows);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    console.error('Detalhes do erro:', error.message);
    res.status(500).json({ error: 'Erro ao buscar disciplinas', details: error.message });
  }
});

// Listar áreas de conhecimento
router.get('/knowledge-areas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM knowledge_areas ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar áreas de conhecimento:', error);
    res.status(500).json({ message: 'Erro ao buscar áreas de conhecimento' });
  }
});

router.get('/', getSubjects);

// Listar todas as disciplinas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.year_id,
        s.knowledge_area_id,
        s.objective,
        s.syllabus,
        s.basic_bibliography,
        s.complementary_bibliography,
	s.hours_per_year,
        s.active,
        sy.name as year_name,
        ka.name as knowledge_area_name
      FROM subjects s
      JOIN school_years sy ON s.year_id = sy.id
      LEFT JOIN knowledge_areas ka ON s.knowledge_area_id = ka.id
      ORDER BY sy.name, s.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ message: 'Erro ao buscar disciplinas' });
  }
});

// Buscar uma disciplina específica
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        sy.name as year_name,
        ka.name as knowledge_area_name
      FROM subjects s
      JOIN school_years sy ON s.year_id = sy.id
      LEFT JOIN knowledge_areas ka ON s.knowledge_area_id = ka.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar disciplina:', error);
    res.status(500).json({ message: 'Erro ao buscar disciplina' });
  }
});

// Criar disciplina
router.post('/', async (req, res) => {
  const {
    name,
    year_id,
    knowledge_area_id,
    objective,
    syllabus,
    basic_bibliography,
    complementary_bibliography,
    active
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO subjects (
        name,
        year_id,
        knowledge_area_id,
        objective,
        syllabus,
        basic_bibliography,
        complementary_bibliography,
	hours_per_year,
        active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [name, year_id, knowledge_area_id, objective, syllabus, basic_bibliography, complementary_bibliography, hours_per_year, active !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
    if (error.code === '23505') {
      res.status(400).json({ message: 'Já existe uma disciplina com este nome para o ano selecionado' });
    } else {
      res.status(500).json({ message: 'Erro ao criar disciplina' });
    }
  }
});

// Atualizar disciplina
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    year_id,
    knowledge_area_id,
    objective,
    syllabus,
    basic_bibliography,
    complementary_bibliography,
    hours_per_year,
    active
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE subjects
      SET name = $1,
          year_id = $2,
          knowledge_area_id = $3,
          objective = $4,
          syllabus = $5,
          basic_bibliography = $6,
          complementary_bibliography = $7,
	  hours_per_year = $8,
          active = $9,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *`,
      [name, year_id, knowledge_area_id, objective, syllabus, basic_bibliography, complementary_bibliography, hours_per_year, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error);
    if (error.code === '23505') {
      res.status(400).json({ message: 'Já existe uma disciplina com este nome para o ano selecionado' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar disciplina' });
    }
  }
});

// Excluir disciplina
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM subjects WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    res.json({ message: 'Disciplina excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir disciplina:', error);
    res.status(500).json({ message: 'Erro ao excluir disciplina' });
  }
});

// Atualizar status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const result = await pool.query(
      'UPDATE subjects SET active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar status da disciplina:', error);
    res.status(500).json({ message: 'Erro ao atualizar status da disciplina' });
  }
});


module.exports = router;
