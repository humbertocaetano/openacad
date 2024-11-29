const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Listar todos os planos de aula com filtro opcional por professor
router.get('/', async (req, res) => {
  try {
    const { teacher_id } = req.query;
    
    let query = `
      SELECT 
        lc.id,
        lc.date,
        lc.objective,
        lc.content,
        lc.resources,
        lc.evaluation_method,
        lc.observations,
        ts.teacher_id,
        u.name as teacher_name,
        s.name as subject_name,
        sy.name as class_year_name,
        cd.name as class_division_name
      FROM lesson_contents lc
      JOIN teacher_subjects ts ON lc.teacher_subject_id = ts.id
      JOIN teachers t ON ts.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN subjects s ON ts.subject_id = s.id
      JOIN school_years sy ON s.year_id = sy.id
      LEFT JOIN class_divisions cd ON ts.division_id = cd.id
    `;

    const params = [];
    if (teacher_id) {
      query += ` WHERE ts.teacher_id = $1`;
      params.push(teacher_id);
    }

    query += ` ORDER BY lc.date DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar planos de aula:', error);
    res.status(500).json({ message: 'Erro ao buscar planos de aula' });
  }
});

// Buscar planos de aula por disciplina do professor
router.get('/teacher-subject/:teacherSubjectId', async (req, res) => {
  try {
    const { teacherSubjectId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        lc.*,
        u.name as teacher_name,
        s.name as subject_name,
        sy.name as class_year_name,
        cd.name as class_division_name
      FROM lesson_contents lc
      JOIN teacher_subjects ts ON lc.teacher_subject_id = ts.id
      JOIN teachers t ON ts.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN subjects s ON ts.subject_id = s.id
      JOIN school_years sy ON s.year_id = sy.id
      LEFT JOIN class_divisions cd ON ts.division_id = cd.id
      WHERE lc.teacher_subject_id = $1
      ORDER BY lc.date DESC
    `, [teacherSubjectId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar planos de aula:', error);
    res.status(500).json({ message: 'Erro ao buscar planos de aula' });
  }
});

// Buscar um plano específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        lc.*,
        ts.teacher_id,
        u.name as teacher_name,
        s.name as subject_name,
        sy.name as class_year_name,
        cd.name as class_division_name
      FROM lesson_contents lc
      JOIN teacher_subjects ts ON lc.teacher_subject_id = ts.id
      JOIN teachers t ON ts.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN subjects s ON ts.subject_id = s.id
      JOIN school_years sy ON s.year_id = sy.id
      LEFT JOIN class_divisions cd ON ts.division_id = cd.id
      WHERE lc.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Plano de aula não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar plano de aula:', error);
    res.status(500).json({ message: 'Erro ao buscar plano de aula' });
  }
});

// Criar novo plano de aula
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { 
      teacher_subject_id,
      date,
      objective,
      content,
      resources,
      evaluation_method,
      observations
    } = req.body;

    await client.query('BEGIN');

    // Verifica se o teacher_subject existe e está ativo
    const teacherSubjectCheck = await client.query(
      'SELECT id FROM teacher_subjects WHERE id = $1 AND active = true',
      [teacher_subject_id]
    );

    if (teacherSubjectCheck.rows.length === 0) {
      throw new Error('Disciplina do professor não encontrada ou inativa');
    }

    const result = await client.query(`
      INSERT INTO lesson_contents (
        teacher_subject_id,
        date,
        objective,
        content,
        resources,
        evaluation_method,
        observations
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      teacher_subject_id,
      date,
      objective,
      content,
      resources,
      evaluation_method,
      observations
    ]);

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar plano de aula:', error);
    res.status(500).json({ message: error.message || 'Erro ao criar plano de aula' });
  } finally {
    client.release();
  }
});

// Atualizar plano existente
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { 
      teacher_subject_id,
      date,
      objective,
      content,
      resources,
      evaluation_method,
      observations
    } = req.body;

    await client.query('BEGIN');

    const result = await client.query(`
      UPDATE lesson_contents
      SET 
        date = $1,
        objective = $2,
        content = $3,
        resources = $4,
        evaluation_method = $5,
        observations = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND teacher_subject_id = $8
      RETURNING *
    `, [
      date,
      objective,
      content,
      resources,
      evaluation_method,
      observations,
      id,
      teacher_subject_id
    ]);

    if (result.rows.length === 0) {
      throw new Error('Plano de aula não encontrado');
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar plano de aula:', error);
    res.status(500).json({ message: error.message || 'Erro ao atualizar plano de aula' });
  } finally {
    client.release();
  }
});

// Excluir plano
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const result = await client.query(
      'DELETE FROM lesson_contents WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Plano de aula não encontrado');
    }

    await client.query('COMMIT');
    res.json({ message: 'Plano de aula excluído com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao excluir plano de aula:', error);
    res.status(500).json({ message: error.message || 'Erro ao excluir plano de aula' });
  } finally {
    client.release();
  }
});

module.exports = router;