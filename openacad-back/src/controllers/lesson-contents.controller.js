const { pool } = require('../config/database');

// Listar conteúdos de uma disciplina específica
const getLessonsByTeacherSubject = async (req, res) => {
  try {
    const { teacherSubjectId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        id,
        date,
        content,
        objective,
        resources,
        evaluation_method,
        observations
      FROM lesson_contents
      WHERE teacher_subject_id = $1
      ORDER BY date
    `, [teacherSubjectId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    res.status(500).json({ message: 'Erro ao buscar conteúdos programáticos' });
  }
};

// Buscar um conteúdo específico
const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT *
      FROM lesson_contents
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Conteúdo não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    res.status(500).json({ message: 'Erro ao buscar conteúdo programático' });
  }
};

// Criar novo conteúdo
const createLesson = async (req, res) => {
  const client = await pool.connect();
  try {
    const { 
      teacher_subject_id,
      date,
      content,
      objective,
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
      throw new Error('Disciplina não encontrada ou inativa');
    }

    const result = await client.query(`
      INSERT INTO lesson_contents (
        teacher_subject_id,
        date,
        content,
        objective,
        resources,
        evaluation_method,
        observations
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      teacher_subject_id,
      date,
      content,
      objective,
      resources,
      evaluation_method,
      observations
    ]);

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar conteúdo:', error);
    res.status(500).json({ 
      message: 'Erro ao criar conteúdo programático',
      detail: error.message 
    });
  } finally {
    client.release();
  }
};

// Atualizar conteúdo existente
const updateLesson = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { 
      date,
      content,
      objective,
      resources,
      evaluation_method,
      observations
    } = req.body;

    await client.query('BEGIN');

    const result = await client.query(`
      UPDATE lesson_contents
      SET 
        date = $1,
        content = $2,
        objective = $3,
        resources = $4,
        evaluation_method = $5,
        observations = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [
      date,
      content,
      objective,
      resources,
      evaluation_method,
      observations,
      id
    ]);

    if (result.rows.length === 0) {
      throw new Error('Conteúdo não encontrado');
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar conteúdo:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar conteúdo programático',
      detail: error.message 
    });
  } finally {
    client.release();
  }
};

// Excluir conteúdo
const deleteLesson = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const result = await client.query(
      'DELETE FROM lesson_contents WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Conteúdo não encontrado');
    }

    await client.query('COMMIT');
    res.json({ message: 'Conteúdo excluído com sucesso' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao excluir conteúdo:', error);
    res.status(500).json({ 
      message: 'Erro ao excluir conteúdo programático',
      detail: error.message 
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getLessonsByTeacherSubject,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};