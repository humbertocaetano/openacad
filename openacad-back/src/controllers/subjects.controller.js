// src/controllers/subjects.controller.js
const { pool } = require('../config/database');

const getSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.id,
        s.name,
        s.year_id,
        s.knowledge_area_id,
        s.hours_per_year,
        s.objective,
        s.syllabus,
        s.basic_bibliography,
        s.complementary_bibliography,
        s.active,
        sy.name as year_name,
        ka.name as knowledge_area_name
      FROM subjects s
      LEFT JOIN school_years sy ON s.year_id = sy.id
      LEFT JOIN knowledge_areas ka ON s.knowledge_area_id = ka.id
      ORDER BY s.name, sy.name`,
    );

    const subjects = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      year_id: row.year_id,
      year_name: row.year_name,
      knowledge_area_id: row.knowledge_area_id,
      knowledge_area_name: row.knowledge_area_name,
      hours_per_year: row.hours_per_year,
      objective: row.objective,
      syllabus: row.syllabus,
      basic_bibliography: row.basic_bibliography,
      complementary_bibliography: row.complementary_bibliography,
      active: row.active
    }));

    res.json(subjects);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
};

const createSubject = async (req, res) => {
  const { 
    name, 
    year_id, 
    knowledge_area_id, 
    hours_per_year,
    objective, 
    syllabus, 
    basic_bibliography, 
    complementary_bibliography 
  } = req.body;

  console.log('Dados recebidos:', req.body);

  try {
    const result = await pool.query(
      `INSERT INTO subjects 
       (name, year_id, knowledge_area_id, hours_per_year, objective, syllabus, 
        basic_bibliography, complementary_bibliography, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
       RETURNING *`,
      [name, year_id, knowledge_area_id, hours_per_year || 0, objective, syllabus, 
       basic_bibliography, complementary_bibliography]
    );

    console.log('Registro criado:', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
    res.status(500).json({ error: 'Erro ao criar disciplina' });
  }
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    year_id, 
    knowledge_area_id, 
    hours_per_year,
    objective, 
    syllabus, 
    basic_bibliography, 
    complementary_bibliography,
    active 
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE subjects 
       SET name = $1, year_id = $2, knowledge_area_id = $3, hours_per_year = $4,
           objective = $5, syllabus = $6, basic_bibliography = $7, 
           complementary_bibliography = $8, active = $9
       WHERE id = $10
       RETURNING *`,
      [name, year_id, knowledge_area_id, hours_per_year || 0, objective, syllabus, 
       basic_bibliography, complementary_bibliography, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }

    console.log('Registro atualizado:', result.rows[0]);
	  
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error);
    res.status(500).json({ error: 'Erro ao atualizar disciplina' });
  }
};


module.exports = {
  getSubjects,
  createSubject,
  updateSubject
};
