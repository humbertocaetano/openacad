const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/available/:studentId', async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const studentResult = await pool.query(
      'SELECT class_id FROM students WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const classId = studentResult.rows[0].class_id;

    const result = await pool.query(
      `SELECT DISTINCT 
        s.id,
        s.name,
        ts.year,
        u.name as teacher_name
       FROM subjects s
       JOIN teacher_subjects ts ON s.id = ts.subject_id
       JOIN teachers t ON ts.teacher_id = t.id
       JOIN users u ON t.user_id = u.id
       JOIN classes c ON s.year_id = c.year_id
       WHERE c.id = $1
       AND ts.active = true
       AND NOT EXISTS (
         SELECT 1 FROM student_subjects ss 
         WHERE ss.teacher_subject_id = ts.id 
         AND ss.student_id = $2
       )`,
      [classId, studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas disponíveis:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
});

router.get('/enrolled/:studentId', async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
        ss.id as enrollment_id,
        s.id as subject_id,
        s.name as subject_name,
        ts.year,
        u.name as teacher_name,
        ss.status
       FROM student_subjects ss
       JOIN teacher_subjects ts ON ss.teacher_subject_id = ts.id
       JOIN subjects s ON ts.subject_id = s.id
       JOIN teachers t ON ts.teacher_id = t.id
       JOIN users u ON t.user_id = u.id
       WHERE ss.student_id = $1
       ORDER BY s.name`,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas matriculadas:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
});

router.post('/enroll', async (req, res) => {
  const { studentId, teacherSubjectId } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO student_subjects 
       (student_id, teacher_subject_id, status)
       VALUES ($1, $2, 'CURSANDO')
       RETURNING *`,
      [studentId, teacherSubjectId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao matricular aluno:', error);
    res.status(500).json({ error: 'Erro ao realizar matrícula' });
  }
});

router.delete('/:enrollmentId', async (req, res) => {
  const { enrollmentId } = req.params;
  
  try {
    await pool.query(
      'DELETE FROM student_subjects WHERE id = $1',
      [enrollmentId]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao cancelar matrícula:', error);
    res.status(500).json({ error: 'Erro ao cancelar matrícula' });
  }
});

module.exports = router;
