const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Buscar alunos de uma aula com status de presença
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    const result = await pool.query(`
      WITH student_list AS (
        SELECT 
          s.id,
          s.registration,
          u.name,
          ts.id as teacher_subject_id
        FROM students s
        JOIN users u ON s.user_id = u.id
        JOIN lesson_contents lc ON lc.id = $1
        JOIN teacher_subjects ts ON lc.teacher_subject_id = ts.id
        WHERE s.active = true
        AND s.class_id = (
          SELECT c.id 
          FROM classes c 
          JOIN teacher_subjects ts ON ts.division_id = c.division_id 
          WHERE ts.id = lc.teacher_subject_id
        )
      )
      SELECT 
        sl.*,
        COALESCE(a.present, false) as present
      FROM student_list sl
      LEFT JOIN attendances a ON a.student_id = sl.id 
        AND a.lesson_content_id = $1
      ORDER BY sl.name
    `, [lessonId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos da aula:', error);
    res.status(500).json({ message: 'Erro ao buscar alunos da aula' });
  }
});

// Salvar frequência
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { lessonId, attendances } = req.body;
    
    await client.query('BEGIN');

    // Remover registros existentes
    await client.query(
      'DELETE FROM attendances WHERE lesson_content_id = $1',
      [lessonId]
    );

    // Inserir novos registros
    for (const attendance of attendances) {
      await client.query(`
        INSERT INTO attendances (
          lesson_content_id,
          student_id,
          present,
          created_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      `, [lessonId, attendance.studentId, attendance.present]);
    }

    await client.query('COMMIT');
    res.json({ message: 'Frequência registrada com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao salvar frequência:', error);
    res.status(500).json({ message: 'Erro ao salvar frequência' });
  } finally {
    client.release();
  }
});

module.exports = router;